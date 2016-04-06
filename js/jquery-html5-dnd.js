/*
 * config is as follows:
 * {
 *    type:"reorder" || "switch",
 *    handleDragStartCallback: function,
 *    handleDropCallback: function
 *}
 */
(function ($, window, undefined) {
    var ACTION = {"reorder": 0, "switch": 1};

    /**
     * Set the source column's HTML to the HTML of the column we dropped on.
     *
     * @param e event
     * @param that target
     */
    function doItemsSwitch(dragSrcEl, that) {
        var $drag = $(dragSrcEl).clone(true, true);
        var $drop = $(that).clone(true, true);
        $(dragSrcEl).replaceWith($drop);
        $(that).replaceWith($drag);
    }

    /**
     * Set the source column before or after the column we dropped on.
     *
     * @param e
     * @param that
     */
    function doItemsReorder(dragSrcEl, that, cols) {
        var dragSrcOrder = parseInt(dragSrcEl.getAttribute("order"));
        var dropOrder = parseInt(that.getAttribute("order"));

        var elements = [].slice.call(cols);

        var dragSrcElt = elements.splice(dragSrcOrder, 1)[0];
        elements.splice(dropOrder, 0, dragSrcElt);
        reorderElementList(cols, getElementsArray(elements));
    }

    function getElementsArray(elements) {
        var array = [];
        elements.forEach(function (elt) {
            var $copy = $(elt).clone(true, true);
            array.push($copy);
        });
        return array;
    }

    function reorderElementList(cols, eltArray) {
        [].forEach.call(cols, function (col, index) {
            var $before = eltArray[index];
            $(col).replaceWith($before);
            col.setAttribute("order", index);
        });
    }

    /*------------------- inject function -------------------*/
    $.fn.extend({
        initHtml5DnD: function (configObj) {
            var config = configObj || {};
            var actionType = ACTION[config.type] || ACTION["reorder"];
            var dragSrcEl = null, cols = $(this);

            addDragEvent();

            function addDragEvent() {
                cols.each(function (index) {
                    var $this = $(this);
                    $this.attr("draggable", "true");
                    $this.attr("order", index);
                    // add event listener
                    $this[0].addEventListener('dragstart', handleDragStart, false);
                    $this[0].addEventListener('dragenter', handleDragEnter, false);
                    $this[0].addEventListener('dragover', handleDragOver, false);
                    $this[0].addEventListener('dragleave', handleDragLeave, false);
                    $this[0].addEventListener('drop', handleDrop, false);
                    $this[0].addEventListener('dragend', handleDragEnd, false);
                });
            }

            function handleDragStart(e) {
                this.style.opacity = '0.4';
                dragSrcEl = this;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
                if (typeof config.handleDropCallback === "function") {
                    config.handleDragStartCallback(dragSrcEl);
                }
            }

            function handleDragOver(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

                return false;
            }

            function handleDragEnter(e) {
                // this / e.target is the current hover target.
                this.classList.add('over');
            }

            function handleDragLeave(e) {
                // this / e.target is previous target element.
                this.classList.remove('over');
            }

            function handleDrop(e) {
                // this/e.target is current target element.
                if (e.stopPropagation) {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                }
                // Don't do anything if dropping the same column we're dragging.
                if (dragSrcEl != this) {
                    switch (actionType) {
                        // "reorder type"
                        case 0:
                            doItemsReorder(dragSrcEl, this, cols);
                            break;
                        // "switch type"
                        case 1:
                            doItemsSwitch(dragSrcEl, this);
                            break;
                    }
                    if (typeof config.handleDropCallback === "function") {
                        config.handleDropCallback(dragSrcEl, this);
                    }
                }
                return false;
            }

            function handleDragEnd(e) {
                // this/e.target is the source node.
                [].forEach.call(cols, function (col) {
                    col.style.opacity = '1';
                    col.classList.remove('over');
                });
            }
        }
    });

}(jQuery, this));





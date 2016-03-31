function Html5DnD(listClassName, type) {
    var ACTION = {"switch": 0, "reorder": 1};

    var dragSrcEl = null, cols;


    var actionType = ACTION[type] || ACTION["switch"];
    addDragEvent();

    function addDragEvent() {
        cols = document.querySelectorAll(listClassName);
        [].forEach.call(cols, function (col, index) {
            // set draggable attribute
            col.setAttribute("draggable", "true");
            col.setAttribute("order", index);
            // add event listener
            col.addEventListener('dragstart', handleDragStart, false);
            col.addEventListener('dragenter', handleDragEnter, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('dragleave', handleDragLeave, false);
            col.addEventListener('drop', handleDrop, false);
            col.addEventListener('dragend', handleDragEnd, false);
        });
    }

    function handleDragStart(e) {
        this.style.opacity = '0.4';
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
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
        this.classList.remove('over');  // this / e.target is previous target element.
    }

    function handleDrop(e) {
        // this/e.target is current target element.
        dragSrcEl.style.opacity = '1';
        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }
        // Don't do anything if dropping the same column we're dragging.
        if (dragSrcEl != this) {
            switch (actionType) {
                // "switch type"
                case 0:
                    doItemsSwitch(e, this);
                    break;
                // "reorder type"
                case 1:
                    doItemsReorder(e, this);
                    break;
            }
        }

        return false;
    }

    function handleDragEnd(e) {
        // this/e.target is the source node.
        [].forEach.call(cols, function (col) {
            col.classList.remove('over');
        });
    }

    /**
     * Set the source column's HTML to the HTML of the column we dropped on.
     *
     * @param e event
     * @param that target
     */
    function doItemsSwitch(e, that) {
        dragSrcEl.innerHTML = that.innerHTML;
        that.innerHTML = e.dataTransfer.getData('text/html');
    }

    /**
     * Set the source column before or after the column we dropped on.
     *
     * @param e
     * @param that
     */
    function doItemsReorder(e, that) {
        var dragSrcOrder = parseInt(dragSrcEl.getAttribute("order"));
        var dropOrder = parseInt(that.getAttribute("order"));

        var elements = [].slice.call(cols);

        var dragSrcElt = elements.splice(dragSrcOrder, 1)[0];
        elements.splice(dropOrder, 0, dragSrcElt);
        reorderElementList(getElementsArray(elements));
    }

    function getElementsArray(elements) {
        var array = [];
        elements.forEach(function (elt) {
            var attributes = {};
            copyAttributes(attributes, elt);
            array.push({attributes: attributes, innerHTML: elt.innerHTML});
        });
        return array;
    }

    function reorderElementList(eltArray) {
        [].forEach.call(cols, function (col, index) {
            var newElt = eltArray[index];
            copyAttributes(col, newElt);
            col.setAttribute("order", index);
            col.innerHTML = newElt.innerHTML;
        });
    }

    function copyAttributes(source, target) {
        var attributes = target.attributes;
        for (var name in attributes) {
            source[name] = target[name];
        }
    }
}

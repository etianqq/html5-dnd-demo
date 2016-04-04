function Html5DnD(listClassName, type) {
    var ACTION = {"reorder": 0, "switch": 1};

    var dragSrcEl = null, cols;


    var actionType = ACTION[type] || ACTION["reorder"];
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
        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }
        // Don't do anything if dropping the same column we're dragging.
        if (dragSrcEl != this) {
            switch (actionType) {
                // "reorder type"
                case 0:
                    doItemsReorder(e, this);
                    break;
                // "switch type"
                case 1:
                    doItemsSwitch(e, this);
                    break;
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

    /**
     * Set the source column's HTML to the HTML of the column we dropped on.
     *
     * @param e event
     * @param that target
     */
    function doItemsSwitch(e, that) {
        var targetAttrObj = copyElementOwnAttributes(that);
        var dragSrcAttrObj = copyElementOwnAttributes(dragSrcEl);
        dragSrcEl.innerHTML = that.innerHTML;
        that.innerHTML = e.dataTransfer.getData('text/html');
        copyObjToElementAttributes(dragSrcEl, targetAttrObj);
        copyObjToElementAttributes(that, dragSrcAttrObj);
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
            var attributes = copyElementOwnAttributes(elt);
            array.push({attributes: attributes, innerHTML: elt.innerHTML});
        });
        return array;
    }

    function reorderElementList(eltArray) {
        [].forEach.call(cols, function (col, index) {
            var newElt = eltArray[index];
            copyObjToElementAttributes(col, newElt.attributes);
            col.setAttribute("order", index);
            col.innerHTML = newElt.innerHTML;
        });
    }

    function copyElementOwnAttributes(elt) {
        var attributes = {};
        var attrObj = elt.attributes;
        for (var key in attrObj) {
            if (attrObj.hasOwnProperty(key)) {
                var valueObj = attrObj[key];
                attributes[valueObj.nodeName] = valueObj.nodeValue;
            }
        }
        return attributes;
    }

    function copyObjToElementAttributes(targetElt, sourceObj) {
        for (var name in sourceObj) {
            targetElt.setAttribute(name, sourceObj[name]);
        }
    }
}

var Html5Drag = (function () {
    var dragSrcEl = null, cols;

    function addDragEvent(listClassName) {
        cols = document.querySelectorAll(listClassName);
        var index = 0;
        [].forEach.call(cols, function (col) {
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
            index += 2;
        });
    }

    function handleDragStart(e) {
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
            var dropOrder = parseInt(this.getAttribute("order"));
            var dragSrcOrder = parseInt(dragSrcEl.getAttribute("order"));
            if (dragSrcOrder < dropOrder) {
                dragSrcEl.setAttribute("order", dropOrder + 1);
            }
            else {
                dragSrcEl.setAttribute("order", dropOrder - 1);
            }
            reorderElementList();
        }

        return false;
    }

    function handleDragEnd(e) {
        // this/e.target is the source node.
        [].forEach.call(cols, function (col) {
            col.classList.remove('over');
        });
    }

    function getReorderInnerHtml() {
        var elements = [].slice.call(cols);

        elements.sort(function (col1, col2) {
            var order1 = parseInt(col1.getAttribute("order"));
            var order2 = parseInt(col2.getAttribute("order"));
            return order1 - order2;
        });

        var array = [];
        elements.forEach(function (col) {
            array.push({html: col.innerHTML, className: col.getAttribute("class")});
        });
        return array;
    }

    function reorderElementList() {
        var order = 0;
        var innerHtmlObjArray = getReorderInnerHtml();
        [].forEach.call(cols, function (col, index) {
            var innerHtmlObj = innerHtmlObjArray[index];
            col.setAttribute("order", order);
            col.setAttribute("class", innerHtmlObj.className);
            col.innerHTML = innerHtmlObj.html;
            order += 2;
        });
    }

    return {
        init: function (listClassName) {
            addDragEvent(listClassName);
        }
    }
}());

# html5 drag and drop
implementation of switch and reorder feature using html5 dnd
## How to use
```sh
<script type="text/javascript" src="js/html5-dnd.js"></script>

<body>
<ul id="drag-switch">
    <li class="item">List item 1</li>
    <li class="item">List item 2</li>
    <li class="item">List item 3</li>
</ul>

<ul id="drag-reorder">
    <li class="item">List item 1</li>
    <li class="item">List item 2</li>
    <li class="item">List item 3</li>
</ul>

<script>
    new Html5DnD("#drag-switch li, "switch");  // or new Html5DnD("#drag-switch li);
    new Html5DnD("#drag-reorder li", "reorder");
</script>
</body>
```
The default dnd type is "switch".

Referenced document: [http://www.html5rocks.com/en/tutorials/dnd/basics/]

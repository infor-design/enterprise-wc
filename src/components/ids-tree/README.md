# ids-tree

## Description

A tree is a structure that is hierarchical in structure. The tree consists of categories, subcategories and is vertical in format.
Trees present a hierarchically structured list. Each node in the hierarchy may have child nodes, and nodes that have children may be expanded or collapsed to show or hide the children.

For example, in a file system that uses tree to display folders and files, a node representing a folder can be expanded to reveal the contents of the folder, which may be files, folders, or both. Tree node depth visualized by indentation in a list.

## Use Cases

- Tree component use to display hierarchically structured list.
- To select node out of a set of hierarchically structured list nodes.

## Terminology

**Tree:** A hierarchical collection of labeled nodes, each represented by a TreeNode.
**TreeNode:** A node can be expanded to reveal nodes, if any exist, and collapsed to hide nodes.
**Text:** The label/text to represent each tree node.
**Icon:** An icon to represent the node type tree node.
**Badge:** Tree nodes can optionally display badges to visualize more data.

## Features (With Code Examples)

A normal tree used as a web component.

```html
<ids-tree id="tree-demo" label="Demo Tree">
  <ids-tree-node id="home">Home</ids-tree-node>
  <ids-tree-node id="public-folders" label="Public Folders">
    <ids-tree-node id="leadership">Leadership</ids-tree-node>
  </ids-tree-node>
</ids-tree>
```

A tree built as using data/datasource

```html
<ids-tree id="tree-demo" label="Demo Tree"></ids-tree>
```

```javascript
const treeDemo = document.querySelector('#tree-demo');
if (treeDemo) {
  (async function init() {
    const url = '/data/tree-basic.json';
    const res = await fetch(url);
    const data = await res.json();
    treeDemo.data = data;
  }());
}
```

A tree with expand or collapse group nodes

```html
<ids-tree id="tree-demo" label="Demo Tree"></ids-tree>
```

```javascript
const dataset = [{
  "id": "home",
  "text": "Home",
  "selected": "true"
}, {
  "id": "public-folders",
  "text": "Public Folders",
  "expanded": "true",
  "children": [{
    "id": "leadership",
    "text": "Leadership"
  }]
}, {
  "id": "icons",
  "text": "Icons",
  "expanded": "false",
  "children": [{
    "id": "audio",
    "text": "Audio",
    "icon": "tree-audio"
  }]
}];
const treeDemo = document.querySelector('#tree-demo');
treeDemo?.data = dataset;
```

A tree with pre selected value thru data

```html
<ids-tree id="tree-demo" label="Demo Tree"></ids-tree>
```

```javascript
const dataset = [{
  "id": "home",
  "text": "Home",
  "selected": "true"
}, {
  "id": "public-folders",
  "text": "Public Folders",
  "children": [{
    "id": "leadership",
    "text": "Leadership"
  }]
}];
const treeDemo = document.querySelector('#tree-demo');
treeDemo?.data = dataset;
```

A tree using expand target setting

```html
<ids-tree id="tree-demo" label="Demo Tree"></ids-tree>
```

```javascript
const dataset = [{
  "id": "home",
  "text": "Home"
}, {
  "id": "public-folders",
  "text": "Public Folders",
  "children": [{
    "id": "leadership",
    "text": "Leadership"
  }]
}];
const treeDemo = document.querySelector('#tree-demo');
treeDemo?.expandTarget = 'icon'; // will expand when clicking the icon only
treeDemo?.data = dataset;
```

A tree using expand target setting with No icon rotation (animation)

```html
<ids-tree id="tree-demo" label="Demo Tree"></ids-tree>
```

```javascript
const dataset = [{
  "id": "home",
  "text": "Home"
}, {
  "id": "public-folders",
  "text": "Public Folders",
  "children": [{
    "id": "leadership",
    "text": "Leadership"
  }]
}];
const treeDemo = document.querySelector('#tree-demo');
treeDemo?.toggleIconRotate = false;
treeDemo?.expandTarget = 'icon';
treeDemo?.data = dataset;
```

A tree with Custom Icons

```html
<ids-tree id="tree-demo" label="Demo Tree"></ids-tree>
```

```javascript
const dataset = [{
  "id": "home",
  "text": "Home"
}, {
  "id": "public-folders",
  "text": "Public Folders",
  "children": [{
    "id": "leadership",
    "text": "Leadership"
  }]
}];
const treeDemo = document.querySelector('#tree-demo');
treeDemo?.expandTarget = 'icon';
treeDemo?.toggleIconRotate = false;
treeDemo?.collapseIcon = 'user-folder-closed';
treeDemo?.expandIcon = 'user-folder-open';
treeDemo?.toggleCollapseIcon = 'chevron-right';
treeDemo?.toggleExpandIcon = 'chevron-down';
treeDemo?.icon = 'tree-doc';
treeDemo?.data = dataset;
```

A tree with Badges

```html
<ids-tree id="tree-demo" label="Demo Tree"></ids-tree>
```

```javascript
const dataset = [{
  "id": "home",
  "text": "Home",
  "badge": {
    "text": "5",
    "shape": "round"
  }
}, {
  "id": "public-folders",
  "text": "Public Folders",
  "children": [{
    "id": "leadership",
    "text": "Leadership"
  }]
}];
const treeDemo = document.querySelector('#tree-demo');
treeDemo?.data = dataset;
```

Loading child data dynamically

```html
<ids-tree id="tree-demo" label="Demo Tree"></ids-tree>
```

```javascript
const dataset = [{
  "id": "home",
  "text": "Home",
  "badge": {
    "text": "5",
    "shape": "round"
  }
}, {
  "id": "public-folders",
  "text": "Public Folders",
  "children": []
}];
const treeDemo = document.querySelector('#tree-demo');
treeDemo?.data = dataset;

treeDemo!.beforeExpanded = async function beforeShow() {
  const url = treeJSON;
  const res2 = await fetch(url);
  const data2 = await res2.json();

  // Reuse the same API but change the data
  data2[0].text = `New Dynamic Node`;
  delete data2[0].children;

  // Takes an array
  return [data2[0]];
};
```

## Settings and Attributes (Tree)

- `collapseIcon` {string} Sets the tree group collapse icon
- `data` {array} Set the data array for tree
- `disabled` {boolean} Sets the tree to disabled state
- `expandIcon` {string} Sets the tree group expand icon
- `expanded` {boolean} Sets the tree to be expanded
- `icon` {string} Sets the tree node icon
- `label` {string} Set the overall tree aria label text
- `selectable` {string} Sets the tree node to be selectable. Accepted options are `multiple`, `single`, `none`.
- `toggleCollapseIcon` {string} Sets the tree group toggle collapse icon
- `toggleExpandIcon` {string} Sets the tree group toggle expand icon
- `toggleIconRotate` {boolean} Sets the tree to use toggle icon rotate
- `expandTarget` {'node' | 'icon'} Sets the trees expand target between `node` (the whole tree item) and just the `icon`

## Settings and Attributes (Tree Node)

- `collapseIcon` {string} Sets the tree group collapse icon
- `disabled` {boolean} Sets the tree node to disabled
- `expandIcon` {string} Sets the tree group expand icon
- `expanded` {boolean} Sets the tree group to be expanded
- `icon` {string} Sets the tree node icon
- `label` {string} Set the node label text, this can also be done via the innerText but this is more tricky with parent nodes so a label is provided.
- `selectable` {string} Sets the tree node to be selectable
- `selected` {boolean} Sets the tree node to be selected
- `tabbable` {boolean} Set if the node is tabbable
- `expandTarget` {'node' | 'icon'} Sets the trees expand target between `node` (the whole tree item) and just the `icon`

## Themeable Parts (Tree)

- `tree` allows you to further style the tree element

## Themeable Parts (Tree Node)

- `group-node` allows you to further style the group node element
- `node` allows you to further style the node element
- `node-container` allows you to further style the node container element
- `icon` allows you to further style the icon element
- `toggle-icon` allows you to further style the toggle icon element
- `text` allows you to further style the text element

## Events (Tree)

- `beforeselected` Fires before the tree node/group get selected, you can return false in the response to veto
- `selected` Fires after the tree node/group get selected
- `beforeunselected` Fires before the tree node/group get unselected, you can return false in the response to veto
- `unselected` Fires after the tree node/group get unselected
- `beforecollapsed` Fires before the tree group get collapsed, you can return false in the response to veto.
- `collapsed` Fires after the tree group get collapsed
- `beforeexpanded` Fires before the tree group get expanded, you can return false in the response to veto
- `expanded` Fires after the tree group get expanded

## Methods (Tree)

- `collapseAll(): void` Collapse all attached nodes to the tree
- `expandAll(): void` Expand all attached nodes to the tree
- `collapse(selector: string): void` Collapse a tree node by given CSS selector
- `expand(selector: string): void` Expand a tree node by given CSS selector
- `toggle(selector: string): void` Toggle a tree node by given CSS selector
- `select(selector: string): void` Selects a tree node by given CSS selector
- `unselect(selector: string): void` UnSelects a tree node by given CSS selector
- `isSelected(selector: string): boolean` Check if related node is selected or not, by given CSS selector
- `getNode(selector: string): object` Get a tree node by given CSS selector
- `addNodes(nodeData: Array<IdsTreeData>, location?: 'bottom' | 'top' | 'before' | 'after' | 'child', node?: HTMLElement): void` Loops through an array with one or more nodes and adds them to the tree. Location can be 'bottom', 'top', 'before' or 'after' or as a 'child'. Before / after / child are used with a node reference. May use getNode() to find the node you want to add next to. In order to add child nodes specify the parent option in the dataset

## Methods (Tree Node)

- `setFocus()` Set focus to node container
- `getNode(selector: string)` Get a node given a css selector

## Callbacks (functions)

- `beforeExpanded = () =>` Fires a callback function before expanding a node with children, this function will wait synchronously for a result. If the result is to be vetoed return false. Otherwise can either use the callback as an event or return an array of tree node data items that will be loaded in as children of the node you expanded. `addNodes` will only be called the first time, if the children are empty. Otherwise just the callback will fire and any return data will be ignored.
- `afterExpanded = () =>` Fires a callback function after expanding a node with children.

## States and Variations (With Code Examples)

- Badges: Ability to show some extra content
- Custom Icons: End user can set custom icons to each node
- Data/Datasource: Tree use the data array to set nodes
- Disabled: Disabled nodes cannot be clicked, hovered, focused or selected
- Expand or Collapse: Tree can display show/hide child nodes thru its parent/group node
- Selection (single): Tree supports the single node selection
- Expand Target: Provides an option to expand by clicking either the node or on just on the icon
- Tree by Markup: Tree can set thru the markup only

## Keyboard Guidelines

- <kbd>Tab/Shift + Tab</kbd>: This will focus or unfocus the tree.
- <kbd>Enter or Space</kbd>: Performs the default action (select and toggle node) as on click event for the focused node.
- <kbd>Down Arrow</kbd>: Moves focus to the next node that is focusable without opening or closing a node. If focus is on the last node, it does nothing.
- <kbd>Up Arrow</kbd>: Moves focus to the previous node that is focusable without opening or closing a node. If focus is on the first node, it does nothing.
- <kbd>Right Arrow</kbd>: When focus is on a closed node, it opens the node and focus does not move. When focus is on a open node, it moves focus to the first child node. When focus is on an end node, it does nothing.
- <kbd>Left Arrow</kbd>: When focus is on an open node, it closes the node. When focus is on a child node that is also either node or a closed group node, it moves focus to its parent node. When focus is on a root node that is also either node or a closed group node, it does nothing.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container.

## Designs

[Design Specs](https://www.figma.com/file/ri2Knf3KchdfdzRAeds0Ab/IDS-Mobility-v4.6?node-id=1%3A5740)

## Accessibility Guidelines

- Tree component contained in the element has a `role="tree"` and `aria-label`
- Each node element contains with `role="treeitem"`
- Each node element contains its current state with a `boolean` value as `aria-disabled`, `aria-selected`  and if it's a parent/group node `aria-expanded`
- Each node element contains its current position with a `number` value as `aria-level`, `aria-setsize`, `aria-posinset`
- Each parent/group node element contains with `role="group"`

## Regional Considerations

In Right To Left Languages the icons, text and alignment will flow to the other side. Labels should be localized in the current language.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Tree was introduced in v4.2.0
- Tree is comprised of new HTML markup and classes, and is invoked with `$('#my-element').tree()`.

**4.x to 5.x**

- Tree is now a custom element. `<ids-tree></ids-tree>`
- Individual Tree nodes are now also custom elements. `<ids-tree-node></ids-tree-node>`
- Tree nodes can contain other tree nodes (nesting).
- If using events, events are now plain JS events.
- Can now be imported as a single JS file and used with encapsulated styles.
- `addNode` is now `addNodes` as it can accept one or more nodes at once

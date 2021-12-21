# Ids Tree Component

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

    fetch(url)
      .then(
        (res) => {
          if (res.status !== 200) {
            return;
          }

          res.json().then((data) => {
            treeDemo.data = data;
          });
        }
      );
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

A tree using toggle target setting

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
treeDemo?.useToggleTarget = true;
treeDemo?.data = dataset;
```

A tree using toggle target setting and (No Icon Rotation)

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
treeDemo?.useToggleTarget = true;
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
treeDemo?.useToggleTarget = true;
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

## Settings and Attributes (Tree)

- `collapseIcon` {string} Sets the tree group collapse icon
- `data` {array} Set the data array for tree
- `disabled` {boolean} Sets the tree to disabled state
- `expandIcon` {string} Sets the tree group expand icon
- `expanded` {boolean} Sets the tree to be expanded
- `icon` {string} Sets the tree node icon
- `label` {string} Set the tree aria label text
- `selectable` {string} Sets the tree node to be selectable
- `toggleCollapseIcon` {string} Sets the tree group toggle collapse icon
- `toggleExpandIcon` {string} Sets the tree group toggle expand icon
- `toggleIconRotate` {boolean} Sets the tree to use toggle icon rotate
- `useToggleTarget` {boolean} Sets the tree to use toggle target

## Settings and Attributes (Tree Node)

- `collapseIcon` {string} Sets the tree group collapse icon
- `disabled` {boolean} Sets the tree node to disabled
- `expandIcon` {string} Sets the tree group expand icon
- `expanded` {boolean} Sets the tree group to be expanded
- `icon` {string} Sets the tree node icon
- `label` {string} Set the node label text
- `selectable` {string} Sets the tree node to be selectable
- `selected` {boolean} Sets the tree node to be selected
- `tabbable` {boolean} Set if the node is tabbable
- `useToggleTarget` {boolean} Sets the tree node to use toggle target

## Theme-able Parts (Tree)

- `tree` allows you to further style the tree element

## Theme-able Parts (Tree Node)

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

## Methods (Tree Node)

- `setFocus(): void` Set focus to node container

## States and Variations (With Code Examples)

- Badges: Ability to show some extra content
- Custom Icons: End user can set custom icons to each node
- Data/Datasource: Tree use the data array to set nodes
- Disabled: Disabled nodes cannot be clicked, hovered, focused or selected
- Expand or Collapse: Tree can display show/hide child nodes thru its parent/group node
- Selection (single): Tree supports the single node selection
- Toggle Target: This provide to toggle expand/collapse by icon only
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

## Converting from Previous Versions

- 3.x: Tree have all new markup and classes.
- 4.x: Tree have all new markup and classes for web components.

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

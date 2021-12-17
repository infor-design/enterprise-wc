# Ids Separator Component

The Separator Component provides a visual separator between two items. Its currently used on `ids-toolbar` and `ids-menu` and `ids-popupmenu`. In each case it adds a vertical line between two of the respective items.

For IDS Menu Component examples see [Ids Popup Menu](../ids-menu/README.md) and for IDS Toolbar Component examples see [Ids Toolbar](../ids-toolbar/README.md).

## Use Cases

- Display a visual split between two tabs that are not directly related
- Display or split sections or menu items that are not directly related

## Settings (Attributes)

- `vertical` Can be used to turn set the separator between a horizontal and vertical. The vertical one is ued on tabs and the horizontal (default) is used on menus

## Themeable Parts

- `separator` allows you to further style the separator element

## Features (With Code Examples)

To Show separators between items in a menu you would do something like the following.

```html
<ids-popup-menu id="my-menu" target="menu-button" trigger="click">
    <ids-menu-group>
        <ids-menu-item>Personalize Columns</ids-menu-item>
    </ids-menu-group>
    <ids-separator></ids-separator>
    <ids-menu-group select="single">
        <ids-menu-header>Row Height</ids-menu-header>
        <ids-menu-item disabled="true">Extra Small</ids-menu-item>
        <ids-menu-item>Small</ids-menu-item>
        <ids-menu-item>Medium</ids-menu-item>
        <ids-menu-item selected="true">Large</ids-menu-item>
    </ids-menu-group>
    <ids-separator></ids-separator>
    <ids-menu-group select="multiple" keep-open="true">
        <ids-menu-item selected="true">Show Filter Row</ids-menu-item>
    </ids-menu-group>
    <ids-menu-group>
        <ids-menu-item>Run Filter</ids-menu-item>
        <ids-menu-item>Clear Filter</ids-menu-item>
    </ids-menu-group>
</ids-popup-menu>
```

# Ids Drawer

The Ids Drawer component creates a fixed area on the edge of the browser viewport that can be used for roll-out navigation or actions, such as those present on [Application Menus](../ids-app-menu/README.md) or [Action Sheets](../ids-action-sheet/README.md).

## Attributes and Properties

- `edge` defines which edge of the viewport the Drawer will appear from.  Can be `start` (left) or `bottom`
- `type` sets the display type of the Drawer.  It can be styled as an `app-menu` or `action-sheet`.
- `visible` if true, the Drawer is rolled out from its specified edge

## Features (With Code Examples)

Drawers can be defined simply by their edge:

```html
<ids-drawer id="my-drawer" edge="start">
    <ids-text>This is my Drawer content</ids-text>
</ids-drawer>

<!-- or -->

<ids-drawer id="my-drawer" edge="bottom">
    <ids-text>This is my Bottom Drawer content</ids-text>
</ids-drawer>
```

They can also take on a `type` for styling.  Drawers are foundational components that are intended to be built-upon for other purposes.  It's recommended that you extend the IdsDrawer and either add a built-in type, or define your own custom styles for the Drawer. if you intend on using your own custom styles, leave this attribute off:

```html
<ids-drawer id="my-drawer" edge="start" type="app-menu">
    <ids-text>This is my App-menu-styled Drawer content</ids-text>
</ids-drawer>
```

Drawers can be displayed from their corresponding edge using the `visible` attribute:

```html
<ids-drawer id="my-drawer" edge="start" type="app-menu" visible>
    <ids-text>This is my Displayed, App-menu-styled Drawer content</ids-text>
</ids-drawer>
```

...or by using Javascript properties and methods:

```js
const drawer = document.querySelector('#my-drawer');
drawer.visible = true;

// ...or
drawer.show();

// later on, after use
drawer.hide();
```

## Converting from Previous Versions (Breaking Changes)

In the 4.x IDS Components there was no Drawer component.  This component represents part of the functionality provided by the 4.x Application Menu, and has been made more general to be shared.

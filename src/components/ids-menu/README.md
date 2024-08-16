# ids-menu

## Description

The IdsMenu Component provides the ui for a menu. This includes groups, icons, submenus, text, disabled ect. By itself a menu is not very useful and will just paint on the page as if it was open. Use [IdsMenuButton]('../ids-menu-button/README.md') in order to show a menu on a button click. Or use [IdsPopupMenu]('../ids-popup-menu/README.md') to show a menu on a click or right click anywhere on the page. The construction of a menu is comprised of several related components.

`ids-menu-group` is used to create a group for a set of menu items.
`ids-menu-header` is used a as a label for groups of menu items
`ids-menu-item` is the main component normal menu items

## Use Cases

- Display an application menu
- Display submenus
- Display a menu with icons

## Terminology

**Group** A label separating items in the menu in a logical group
**Submenus** A a list of choices that is part of another list of choices

## Attributes and Properties (ids-menu-group)

- `disabled` {boolean} true if the entire menu should become disabled
- `keep-open` {boolean} true if selection of an item within this group should cause the parent menu to close
- `selection` {string} The type of selection to set this group between `single` and `multiple` or `none`
- `wrap` {boolean} if true, the child menu-items will be styled into a column view.

## Features (With Code Examples)

A simple menu with three items can be created by creating a `ids-menu` with a single `ids-menu-group` and three `ids-menu-item` components.

```html
<ids-menu id="simple-menu">
  <ids-menu-group wrap>
    <ids-menu-item>One</ids-menu-item>
    <ids-menu-item>Two</ids-menu-item>
    <ids-menu-item>Three</ids-menu-item>
  </ids-menu-group>
</ids-menu>
```

A menu can have a toggle-able menu item that is indicated with a check that toggles when you turn it on and off. In this example selecting `Two` will mark it checked and unchecked

```html
<ids-menu id="simple-menu">
  <ids-menu-group>
    <ids-menu-item>One</ids-menu-item>
    <ids-menu-item toggleable>Two</ids-menu-item>
    <ids-menu-item>Three</ids-menu-item>
  </ids-menu-group>
</ids-menu>
```

A more complicated menu can be formed using combinations of  `ids-menu` with a `ids-menu-group` and nested `ids-menu-item` components.

```html
<ids-menu id="complex-menu">
  <ids-menu-group id="main-settings">
    <ids-menu-item icon="mail" value="mail">Mail</ids-menu-item>
    <ids-menu-item icon="filter" value="filter">Filter</ids-menu-item>
    <ids-menu-item icon="settings" value="settings">Settings</ids-menu-item>
    <ids-separator></ids-separator>
    <ids-menu-item value="long-no-icons">Very long, indescribable action with no icons</ids-menu-item>
    <ids-menu-item icon="url" disabled="true" value="big-with-icons">
      Another big menu item, but with icons!
    </ids-menu-item>
  </ids-menu-group>
  <ids-separator></ids-separator>
  <ids-menu-header id="additional-actions-header">Additional Actions</ids-menu-header>
  <ids-menu-group id="more-settings" aria-describedby="additional-actions-header">
    <ids-menu-item value="more-actions">
      More Actions
    </ids-menu-item>
    <ids-menu-item icon="user" value="even-more-actions">
        Even More Actions
    </ids-menu-item>
    <ids-menu-item id="no-select" value="no-select">This one can't be selected (Check the console)</ids-menu-item>
    </ids-menu-group>
    <ids-separator></ids-separator>
    <ids-menu-group id="other-settings">
    <ids-menu-item icon="more" value="other-items">Other Items</ids-menu-item>
  </ids-menu-group>
</ids-menu>
```

### Selection Event Handling

When an `<ids-menu-item>` element is selected from a menu, it has the potential to fire up to two different events.  The events fired depend on how the menu is configured.  Consider this menu:

```html
<ids-menu id="my-menu">
  <ids-menu-group id="main-settings">
    <ids-menu-item icon="mail" value="mail">Mail</ids-menu-item>
    <ids-menu-item icon="filter" value="filter">Filter</ids-menu-item>
    <ids-menu-item icon="settings" value="settings">Settings</ids-menu-item>
  </ids-menu-group>
</ids-menu>
```

In this example, when any of the menu's items are chosen by click or by keyboard, no selection events are fired.  This is because there is no `select` attribute determining single or multiple selection.  The menu item chosen will not change the menu's selection state, and will simply fire a `pick` event.

This next example will cause a both a `selected` event and a `pick` event to fire whenever an item is chosen.  No `deselected` events will fire in this case:

```html
<ids-menu id="my-menu">
  <ids-menu-group id="main-settings" select="single">
    <ids-menu-item icon="mail" value="mail">Mail</ids-menu-item>
    <ids-menu-item icon="filter" value="filter">Filter</ids-menu-item>
    <ids-menu-item icon="settings" value="settings">Settings</ids-menu-item>
  </ids-menu-group>
</ids-menu>
```

You can also have `toggleable` menu items where the menu item check can be turned on and off. For example

```html
<ids-menu>
  <ids-menu-group select="single">
    <ids-menu-item icon="mail" toggable value="mail">Keep Active</ids-menu-item>
  </ids-menu-group>
</ids-menu>
```

You can also align the icon on the right side.

```html
<ids-menu>
  <ids-menu-group>
    <ids-menu-item icon="mail" icon-align="end">Keep Active</ids-menu-item>
  </ids-menu-group>
</ids-menu>
```

This next example will cause a either a `selected` OR `deselected` event, as well as a `pick` event, to fire whenever an item is chosen.  When an item is chosen, its selection state is changed, and the event fired corresponds to its new value:

```html
<ids-menu id="my-menu">
  <ids-menu-group id="main-settings" select="multiple">
    <ids-menu-item icon="mail" value="mail">Mail</ids-menu-item>
    <ids-menu-item icon="filter" value="filter">Filter</ids-menu-item>
    <ids-menu-item icon="settings" value="settings">Settings</ids-menu-item>
  </ids-menu-group>
</ids-menu>
```

### Shortcut keys

IdsMenuItem elements can have a `shortcut-keys` attribute defined, which will pass text representing a keyboard shortcut to be displayed into the white space opposite the regular text:

```html
<ids-menu-item id="action-create" icon="folder" shortcut-keys="⌘+R">Create New Folder</ids-menu-item>
```

```js
const menuItem = document.querySelector('ids-menu-item');
menuItem.setAttribute('shortcut-keys', '⌘+R');
```

## Class Hierarchy Menu Group

- IdsMenuGroup
  - IdsElement
- Mixins
  IdsEventsMixin
  IdsLocaleMixin

## Class Hierarchy Menu Header

- IdsMenuHeader
  - IdsElement
- Mixins
  IdsEventsMixin
  IdsLocaleMixin

## Class Hierarchy Menu Item

- IdsMenuItem
  - IdsElement
- Mixins
  IdsEventsMixin
  IdsLocaleMixin

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- This component is relatively backwards compatible except inforContextMenu should be replaced with popupmenu in the API call and class name
- Remove class divider as it is deprecated
- Checkbox construct is simplified
- Group replaced with heading

**4.x to 5.x**

- The menu component has been changed to a web component and renamed to `ids-menu`.
- If using properties/settings these are now attributes.
- Markup has changed to a custom element `<ids-menu></ids-menu>`
- If using events events are now plain JS events for example (i.e. menu click events)
- Can now be imported as a single JS file and used with encapsulated styles

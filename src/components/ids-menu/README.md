# Ids Menu Component

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

- `keepopen` {boolean} true if selection of an item within this group should cause the parent menu to close
- `selection` {string} The type of selection to set this group between `single` and `multiple` or `none`

## Features (With Code Examples)

A simple menu with three items can be created by creating a `ids-menu` with a single `ids-menu-group` and three `ids-menu-item` components.

```html
<ids-menu id="simple-menu">
  <ids-menu-group>
    <ids-menu-item>One</ids-menu-item>
    <ids-menu-item>Two</ids-menu-item>
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

## Class Hierarchy Menu Group

- IdsMenuGroup
  - IdsElement
- Mixins
  IdsEventsMixin
  IdsLocaleMixin
  IdsThemeMixin

## Class Hierarchy Menu Header

- IdsMenuHeader
  - IdsElement
- Mixins
  IdsEventsMixin
  IdsLocaleMixin
  IdsThemeMixin

## Class Hierarchy Menu Item

- IdsMenuItem
  - IdsElement
- Mixins
  IdsEventsMixin
  IdsLocaleMixin
  IdsThemeMixin

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

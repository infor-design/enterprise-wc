# Ids Popup Menu Component

## Description

The Ids Popup Menu component allows the capability for providing lists of contextual options related to a current application, page, or widget.  The options within the menu provide values that can be acted on, events that can determine application function, and can contain toggle information.

Ids Popup Menus are able to be attached directly to the page, taking the place of standard browser context menus.  They are also able to be attached to specific components, such as buttons, input fields, and grid cells, to provide contextual options specific to those elements.

The Ids Popup Menu is a complex component that combines an [`IdsMenu`](../ids-menu/README.md) and [`IdsPopup`](./ids-popup/README.md) to create its core functionality.

## Use Cases

- Provide a list of actionable items related to an entire application (Context Menu behavior)
- Provide a list of actionable items related to another widget (f.x.: MenuButton behavior, Data Grid cell options)
- Attach major functions of an application to easily-accessible clicks/touches.

## Terminology

### Component Types

**Menu** The base container element, `IdsMenu`, usually represented in the Shadow DOM with a standard HTML `<div>` tag.
**Popup Menu** This specific component `IdsPopupMenu`, which wraps a standard menu in a "Popup" that can be hidden and shown on command.
**Menu Item** A sub-component of the `IdsPopupMenu`, which is the actionable item within the menu.  These can have values, be selected or deselected, disabled, and icons.  They are also able to contain Submenus.
**Menu Group** All menu items exist inside of an `IdsMenuGroup` sub-component type, which contains information about how selection can occur on its contained items. Selection be "none" (standard click behavior), "single" which allows only a single item in the group to be checked, or "multi" which allows any/all items in the group to be selected simultaneously. A menu can be comprised of one or multiple groups of items, and each group's selection within the parent menu is independent of the others.
**Menu Header** This sub-component describes the contents of a specific Menu Group with an accessible heading, represented in the Shadow DOM with a `<li>`. Only one of these should exist within a Menu Group.
**Separator** A simple sub-component that visually separates Menu Items.  These can be used either as direct children of the Menu between the Menu Groups (represented in Shadow DOM by a `<div>`), or inside of a Menu Group between the Menu Items (represented in Shadow DOM by a `<li>`).
**Submenu** Nested `IdsPopupMenu` components that originate from a base Popup Menu.  These are attached to a parent menu item, and can be activated by hovering the menu item with a mouse, tapped, clicked, or by using some keyboard commands.

### Behaviors

**Keep Open** Defined on Menu Groups. The presence of this property causes a Popup Menu to remain open when one of the Menu Group's Menu Items is selected/deselected. The Popup Menu can only be closed by an explicit keyboard action, or by clicking/tapping outside of it. By default, selecting/deselecting a Menu Item will cause the Popup Menu to close.
**Select** Defined on Menu Groups. This option defines the type of selection possible within the Menu Group. When this option is not present (default), simply selecting an item from the Popup Menu will store it as "selected" but not visually represent it as such. If this option exists and is set to "single", all Menu Items in the Menu Group will display a single-selectable checkmark when selected, causing the others in the group to become deselected. If this option is set to "multiple", each Menu Item in the group can be selected/deselected independently, and will be represented by a multi-selectable checkbox.
**Target** Defined on Popup Menus. The Popup Menus can have a `target` property defined that will define another element in the page as being the "actionable" element for causing the menu to show/hide.
**Trigger** Defined on Popup Menus. The name of the action that causes the Popup Menu to be displayed. The default behavior for Popup Menus will make them occur on the browser's document-level `contextmenu` event, but the trigger behavior can also occur on a left/right/middle `click`, as well as displaying when invoked by using the `immediate` behavior.

## Settings (Attributes)

### Popup Menu

- `target` {HTMLElement} if defined, creates a link between this Popup Menu and another element in the DOM.
- `trigger` {string} the action on which to activate the Popupmenu. This defaults to `contextmenu`, but can also be `click` or `immediate`.

### Menu Group

- `keep-open` {boolean} if true, causes the parent Popup Menu to remain open when an item within this group is selected/deselected.
- `select` {string} Determines selection type. This defaults to "none", but can be "single" or "multiple".

### Menu Item

- `disabled` {boolean} set disabled state.
- `href` {string} set the `href` attribute on the internal anchor.
- `icon` {string} set the icon type used on the menu item.
- `selected` {boolean} sets checkmark/checkbox state, if the menu item is selectable.
- `submenu` {IdsPopupMenu} links a child Popupmenu to this element, if applicable.
- `tabindex` {number} set the `tabindex` attribute on the internal anchor.
- `value` {string} set the radio value.

## Features (With Code Examples)

It's possible to create a Popupmenu that stands alone and takes the place of the browser's context menu by default:

```html
<ids-popup-menu id="popupmenu">
    <ids-menu-group>
        <ids-menu-item value="1">One</ids-menu-item>
        <ids-menu-item value="2">Two</ids-menu-item>
        <ids-menu-item value="3">Three</ids-menu-item>
    </ids-menu-group>
</ids-popup-menu>
```

It's also possible to recreate this structure in raw Javascript:

```js
const menu = new IdsPopupMenu();
menu.id = 'popupmenu';
document.body.appendChild(menu);

const group = new IdsMenuGroup();
menu.appendChild(group);

const itemOne = new IdsMenuItem();
itemOne.value = 1;
group.appendChild(itemOne);

const itemTwo = new IdsMenuItem();
itemTwo.value = 1;
group.appendChild(itemTwo);

const itemThree = new IdsMenuItem();
itemThree.value = 1;
group.appendChild(itemThree);
```

Additionally, it's possible to use an [IdsDataSource](../../core/README.md#ids-data-source) to populate the Popup Menu dynamically.  The component has a standardize JSON format that can be used to create a menu structure quickly:

```js
const menu = new IdsPopupMenu();
menu.data = {
    id: 'popupmenu',
    contents: [
        {
            type: 'group',
            items: [
                {
                    text: 'One',
                    value: 1
                },
                {
                    text: 'Two',
                    value: 2
                },
                {
                    text: 'Three',
                    value: 3
                },
            ]
        }
    ]
}
document.body.appendChild(menu);
```

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Replace usage of `.inforContextMenu()` with `.contextmenu()` or `.popupmenu()` (depending on the use case)

**4.x to 5.x**

- Popup Menu is now a custom element `<ids-popup-menu></ids-popup-menu>`.
- Events triggered by the Popup Menu are now plain JS (for example `selected`/`deselected`)
- Selection of items is now divided up by Menu Groups `<ids-menu-group></ids-menu-group>`.  Multiple menu groups in each Popup Menu are supported, and selection in one group will not affect selection in other groups.
- Many previous settings are now attribute-friendly (for example `closeOnSelect` is now a `keep-open` attribute on menu groups).
- Made dynamic menus possible by using [IdsDataSource](../../core/README.md#ids-data-source)

## Keyboard Guidelines

- <kbd>Tab</kbd> Can be used to navigate to the next available menu item with a 0+ tab-index value.
- <kbd>Shift + Tab</kbd> Does the opposite, navigating to the previous available menu item.
- <kbd>Up/down arrow</kbd> navigate up and down the list.
- <kbd>Left/right arrow</kbd> traverses nested Popup Menus.  If the currently-highlighted menu item contains a Submenu, pressing the right arrow will open that Submenu.  If the left arrow is pressed while a nested menu item is focused, its Submenu will be closed and focus will be returned to the parent menu item.
- <kbd>Enter/Return</kbd> Perform selection/deselection where available.  On items that contain submenus, this will not select/deselect and will instead trigger the submenu.
- <kbd>Shift+F10</kbd> can be used to trigger document-level Popup Menus that are bound to the `contextmenu` event.

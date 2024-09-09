# ids-menu-button

## Description

The IDS Menu Button component is an extension of the standard [Button component](../ids-button/README.md) that is styled with Infor branding, and allows for being implicitly linked to an [IDS Popup Menu Component](../ids-popup-menu/README.md) that can be used for triggering multiple different actions.

## Use Cases

- Create menu buttons that store multiple different actions
- Create menu buttons that allow selection of single items within groups
- Create menu buttons that allow selection of multiple items within groups

## Terminology

**Dropdown Icon** Menu Buttons have a secondary icon (separate from the IDS Button "icon" property) that acts as the Popup Menu's Arrow Target.  This icon is normally a standard "dropdown" icon, but can be changed if needed.

## Settings (Attributes)

- `disabled` true if the Menu Button should become disabled.  This also makes the attached Popupmenu and all of its sub-elements disabled.
- `dropdownIcon` sets the type of icon to be used as the dropdown icon.  If null/empty, the dropdown icon is not displayed.  Note that this is different than the standard IDS Button `icon` property, and both can exist at the same time.
- `formatterWidth` set the width and formatter style for menu button.
- `menu` can be defined as a CSS selector string, or if using the JS property, can be a direct reference to an IdsPopupMenu component.
- `value` sets/gets selected menu items by providing list of menu item values

## Methods

- `async beforeShow(opts)` A callback that fires when the menu is opened. You can use the opts to see what menu and details about what is opening. Since the method is async you can do a call back and return structured [menu data](https://github.com/infor-design/enterprise-wc/blob/main/src/assets/data/menu-contents.json) when returned the menu will show with this data. See [popup menu](https://github.com/infor-design/enterprise-wc/blob/main/src/components/ids-popup-menu/README.md) for more details.

## States and Variations

Since the menu button combined from several IDS Components, you can refer to their documentation for information about states/variants:

- [IdsButton](../ids-button/README.md) for Button-specific states
- [IdsPopupMenu](../ids-popup-menu/README.md) for Menu-specific states

### Variations

- ["More Actions" Button]() is technically a menu button, since it contains additional actions related to the current workflow hidden in a Popup Menu.  This variant displays no dropdown icon, and appears as an Icon Button.

## Features (with code samples)

Most menu buttons are implicitly linked to their Popup Menus using `id` attributes.  The Popup Menu also needs to be told which `target` element to use:

```html
<ids-menu-button id="my-button" menu="my-menu">
    <span>My Menu Button</span>
</ids-menu-button>
<!-- ... -->
<ids-popup-menu id="my-menu" target="#my-button">
    <!-- ... -->
</ids-popup-menu>
```

Menu Buttons themselves can have the Dropdown Icon set directly on the markup:

```html
<ids-menu-button id="my-button" menu="my-menu" dropdown-icon>
    <span>My Menu Button</span>
</ids-menu-button>
```

Both the regular IdsButton `icon` setting and `dropdown-icon` can be used together:

```html
<ids-menu-button id="my-button" menu="my-menu" icon="settings" dropdown-icon>
    <span>My Menu Button</span>
</ids-menu-button>
```

The Dropdown Icon can be customized, if necessary:

```html
<ids-menu-button id="my-button" menu="my-menu" dropdown-icon="launch">
    <span>My Menu Button</span>
</ids-menu-button>
```

The button can set as formatter width and style:

```html
<ids-menu-button id="my-button" menu="my-menu" formatter-width="125px" dropdown-icon>
    <span>My Menu Button</span>
</ids-menu-button>
```

## Keyboard Guidelines

- <kbd>Enter/Return</kbd> When the Button is focused, will cause the menu to toggle open/closed.
- <kbd>Enter/Return</kbd> When the Popup Menu Items are focused, performs selection/deselection where available.  On items that contain submenus, this will not select/deselect and will instead trigger the submenu.

## Responsive Guidelines

- When the menu is opened, it will intelligently decide which direction to flow.  If there is more space between the top of the button and the top of the viewport (compared to the bottom of the button/viewport), it will open above the button.  In some cases, the menu may open to the left/right of the button.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Menu Button was not a "standard" component in 4.x, and needed to be created manually.

**4.x to 5.x**
- Markup has changed to a custom element `<ids-menu-button></ids-menu-button>`
- Can now be imported as a single JS file and used with encapsulated styles.
- Now exists as its own component
- Implicitly linked to a menu by using `menu="my-menu"` CSS selector attribute, or direct element reference in JS

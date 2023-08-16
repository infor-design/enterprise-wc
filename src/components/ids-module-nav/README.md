# IDS Module Nav

This component displays top-level navigation in a flyout menu, similar to [IDS App Menu](../ids-app-menu/README.md).

## Use Cases

- Use for top-level [Module]() navigation.

## Terminology

- **Module Nav**: The UX element that holds all navigation items.
- **Module Button** The UX element providing access to the Module's home.
- **Role Switcher**: The UX element that contains the Module Button, as well as the Dropdown used to display the Module's Roles.
- **Settings Menu**: The UX element that displays additional settings at the bottom of the Module Nav.

## Settings and Attributes

IdsMultiselect inherits most of it's settings from ids-dropdown, please refer to that document [here](../ids-dropdown/README.md) for more details. Below are listed new settings or ones that have been modified or are different from ids-dropdown:

- `display-mode` {false|'collapsed'|'expanded'} Chooses the Module Nav's display type
- `filterable` {boolean} If true, allows accordion filtering via the searchfield using the built-in behavior (false if you want to implement your own)
- `pin-sections` {boolean} If true, pins key areas of the navigation accordion to the top/bottom of the page.
- `show-detail` {boolean} If true, displays the optional detail pane.
- `offset-content` {boolean} If true, doesn't allow an `display-mode: expanded` Module Nav to cover its underlying content pane, instead offseting the content.

## Features (With Code Examples)

TBD

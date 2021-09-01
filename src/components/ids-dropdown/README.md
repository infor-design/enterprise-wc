# Ids Dropdown Component

## Description

The Dropdown allows users to select from a list. Like an Html Select with style. Displays one or more selectable values in a menu that is collapsed by default. A user can select an actionable value.

## Use Cases

- Use when you need to let the user select something from a list of values
- Use when you want users to contribute data to your website and let them organize their content themselves.

## Terminology

- **Tag**: A UI embellishments for classification

## Features (With Code Examples)

A normal tag used as a web component.

```html
<ids-tag>Normal Tag</ids-tag>
```

## Settings and Attributes

- `clickable` {boolean} Turns on the functionality to make the tag clickable like a link

## Themeable Parts

- `checkbox` allows you to further style the checkbox input element

## States and Variations (With Code Examples)

- Color

## Keyboard Guidelines

- <kbd>Tab/Shift + Tab</kbd>: Moves focus into and out of the dropdown input. If the list is open, this will close the list, selecting the current item, and moving to the next focusable element
- <kbd>Alt + Down Arrow / Down Arrow</kbd>: Opens the dropdown list and moves focus to the selected option. If nothing is selected, then focus moves to the first option in the list. If the combobox is not editable nothing will happen.
- <kbd>Enter</kbd>: Selects the currently highlighted item in the list, updates the input field, highlights the selected item in the dropdown list, closes the dropdown list, and returns focus to the input field.
- <kbd>Escape</kbd>: Closes the dropdown list, returns focus to the edit field, and does not change the current selection.
- <kbd>AnyKey</kbd>: Typing a letter opens the list and filters to the items that start with that letter

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent dimensions.

## Converting from Previous Versions

- 3.x: Tags have all new markup and classes.
- 4.x: Tags have all new markup and classes for web components.

## Designs

[Design Specs](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.

## Regional Considerations

Labels should be localized in the current language. The close and link icons will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).

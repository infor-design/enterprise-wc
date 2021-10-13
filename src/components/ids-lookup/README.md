# Ids Lookup Component

## Description

TBD

## Use Cases

- Use when the content on your page is mapped into multiple categories and does not only fit into one hierarchical category.
- Use when you want users to contribute data to your website and let them organize their content themselves.

## Terminology

- **Tag**: A UI embellishments for classification

## Features (With Code Examples)

A normal lookup used as a web component.

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

- <kbd>Tab/Shift+Tab</kbd>: If the tab is focusable this will focus or unfocus the tag.
- <kbd>Backspace / Alt+Del</kbd>: If the tag is dismissible then this will remove the tag.
- <kbd>Enter</kbd>: If the tag is clickable then this will follow the tag link.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent dimensions.

## Converting from Previous Versions

- 3.x: Lookup have all new markup and classes.
- 4.x: Lookup have all new markup and classes for web components.

## Designs

[Design Specs](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color Lookup that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.

## Regional Considerations

Labels should be localized in the current language. The close and link icons will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).

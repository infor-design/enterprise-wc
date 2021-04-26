# Ids Hyperlink Component

## Description

This component styles hyperlinks to the design guidelines. Also called a link. Typically a hyperlink will open a file file or document or be used to navigate to a new location.

## Use Cases

- When you need static text on a page
- When you need disabled appearing text in a page

## Terminology

- **Link/Hyperlink**: An interactive link to another page within Infor software to external destinations.
- **Disabled**: A link can be disabled if its not actionable at the moment.

## Features (With Code Examples)

A normal hyperlink element used as a web component that opens a url in a new window.

```html
<ids-hyperlink href="http://www.example.com" target="_blank">Normal Link</ids-hyperlink>
```

A Disabled appearing hyperlink element.

```html
  <ids-hyperlink href="http://www.example.com" disabled="true" target="_blank">Disabled Link</ids-hyperlink>
```


## Settings and Attributes

- `disabled` {boolean} Set the link to disabled
- `href` {string} Set the links href to a url or file
- `target` {string} Set the links target attribute. Valid values are '_blank' | '_self' | '_parent' | '_top' | frame name.
- `mode` {string} Set the theme mode
- `version` {string} Set the theme version

## Themeable Parts

- `link` allows you to further style the link element

## States and Variations (With Code Examples)

- Disabled
- Visited
- Hover
- Active

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the link is enabled this will focus or unfocus the link.
- <kbd>Enter</kbd>: If this will follow the link url or action.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent dimensions.

## Converting from Previous Versions

- 3.x: Used a css class on `<a>` tags
- 4.x: Used a css class on `<a>` tags

## Designs

[Design Specs](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   Ensure the color tags pass contrast.

## Regional Considerations

Link text should be localized in the current language. And should flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).

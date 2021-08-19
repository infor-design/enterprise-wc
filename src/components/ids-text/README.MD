# Ids Text Component

## Description

This component styles arbitrary text elements using the design guidelines.

## Use Cases

- When you need static text on a page
- When you need disabled appearing text in a page

## Terminology

- **Text**: A a human-readable sequence of character s and the words
- **Disabled**: Text can be disabled, this is usually done with some other element in mind. For example a disabled field label
- **Audible**: Text that does not appear in the page but is read by users with screen readers in order to give them information.

## Features (With Code Examples)

A normal text element used as a web component in size 16px.

```html
<ids-text font-size="16">Normal Text</ids-text>
```

A Disabled appearing text element.

```html
<ids-text disabled="true">Disabled Text</ids-text>
```

Using the data/label theme, related to [IdsSummaryField](../ids-summary-field/README.md)
```html
<ids-text label="true">Title</ids-text>
<ids-text data="true">Some random data</ids-text>
```

## Settings and Attributes

- `type` {boolean} Set the type of element it is usually h1-h6. Defaults to span
- `audible` {string} Set `audible` string (screen reader only text)
- `disabled` {boolean} Set the text to disabled in appearance
- `fontSize` {string} Set the size of font to use (in pixels)
- `mode` {string} Set the theme mode
- `version` {string} Set the theme version
- `color` {string} If set to `unset`, the CSS color will be `'unset'` allowing you to color with surrounding content.
- `color-variant` {string} can be set to "alternate" to display contrasting color for text via the [IdsColorVariantMixin](../../src/mixins/ids-color-variant/README.md)
- `data` {boolean} Sets the css of the text to the according theme
- `label` {boolean} Sets the css of the text to the according theme
## Themeable Parts

- `text` allows you to further style the text element

## States and Variations (With Code Examples)

- Audible
- Size
- Disabled
- Color Variant (alternate)

## Keyboard Guidelines

Text is not keyboard focusable so has no keyboard shortcuts.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent dimensions.

## Converting from Previous Versions

- 3.x: Did not exist
- 4.x: Convert spans/ h1-h6 to use the web component with types

## Designs

[Design Specs](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   Ensure the color tags pass contrast.

## Regional Considerations

Text should be localized in the current language. And should flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).

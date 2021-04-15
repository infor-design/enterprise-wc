# Ids Tooltip Component

## Description

Tooltips are a component thats used in conjunction with other components to show additional information and non critical information related to an element such as a button or field. A tooltip will displays information on either hover, tab and/or focus. In this version we have separated the tooltip from popups.

## Use Cases

- Displays additional non critical information thats not discernible from the interface/design.

## Terminology

- **Tooltip**: A message which appears when a cursor is positioned over an icon, image, hyperlink, or other element in a graphical user interface.

## Features (With Code Examples)

A normal tooltip used as a web component attached to a button.

```html
<ids-button id="button-1">Example Button</ids-button>
<ids-tooltip target="button-1" placement="top">Tooltips Provide Additional Information</ids-tooltip>
```

## Usage Guidance

- Do not show critical information in a tooltip or use it for functionality, it should be strictly for supplemental information
- Write concise tooltip text. Imagine someone on a small screen or with high zoom needing to pan around just to read the tooltip.
- Avoid rich content. Formatting such as bold text, italics, headings, icons, etc. will not be conveyed through `aria-describedby` or `aria-labelledby`.
- No interactive content. Any interactive content such as links or buttons should not be placed within a tooltip.

## Settings and Attributes

- `target` {string} ....
- `placement` {string} ....
- `cssClass` {string} ....
- `keepOpen` {boolean} ....
- `trigger` {string} ....

## States and Variations (With Code Examples)

- Color
- Open
- Closed

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the element tooltip is showing on focus then this will cause the tooltip to appear.

## Responsive Guidelines

- Tooltips do not work well in mobile or in responsive situations and should be avoided. But the tooltip will attempt to adjust to fit the page as the popup menu allows.

## Converting from Previous Versions

- 3.x: Tags have all new markup and classes.
- 4.x: Tags have all new markup and classes for web components.

## Accessibility Guidelines

For a good article on making the tooltip accessible see [Tooltips WCAG 2.1](https://sarahmhigley.com/writing/tooltips-in-wcag-21/)

To make the tooltip accessible we do the following:

We use `aria-describedby` or `aria-labelledby` to associate the UI control with the tooltip. Do not put essential information in tooltips.

The following general rules apply:

- Do not add interactive content (buttons/links ect) in a hyperlink
- Only interactive elements should trigger tooltips. While disabled tooltips do work on hover they do not work on focus so are not accessible and should be avoided.- Tooltip text is purely supplemental, and should not override the existing accessible name for a control.

## Regional Considerations

Tooltips should be localized in the current language. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).

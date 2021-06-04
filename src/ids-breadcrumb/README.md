# Ids Breadcrumb Component

## Description

Displays the current view and all parent views. A user can navigate between views. Best for presenting hierarchical paths in a system.

## Terminology
/*
- **Counts**: UI embellishments for summarizing high level numeric information.
- **Value**: The numeric value displayed on the count component.
- **Text**:  The name or brief description of the value.
- **Compact**: When compact, the count value appears slightly smaller than usual.
*/
## Features (With Code Examples)

A normal breadcrumb component

```html
<ids-breadcrumb>
  <ids-hyperlink font-size="14" color="unset">First Item</ids-hyperlink>
  <ids-hyperlink font-size="14" color="unset">Second Item</ids-hyperlink>
  <ids-hyperlink font-size="14" color="unset" disabled>Disabled Item</ids-hyperlink>
  <ids-hyperlink font-size="14" color="unset">Current Item</ids-hyperlink>
</ids-breadcrumb>
```

## Settings and Attributes

Use ids-hyperlink components as the inner elements a the breadcrumb is designed to work with these specifically. The following ids-hyperlink attributes should be considered:
- `color` {string} Set to unset to disable the hyperlink color and get the default coloring to work.
- `disabled` Use leave blank or set to 'true' to set disabled color.
- `font-size` {number} Will be 14 by default.
- `href` {string} The url that the hyperlink component links to.

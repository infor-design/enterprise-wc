# ids-breadcrumb 

## Description

A breadcrumb is a navigational element that shows a user their current location in the hierarchical context of an application and allows them to navigate back through page levels. See more [usage details](https://design.infor.com/components/components/breadcrumb).

## Features (With Code Examples)

A normal breadcrumb component with a disabled item. The last item represents the current page.

```html
<ids-breadcrumb>
  <ids-hyperlink font-size="14" color="unset">First Item</ids-hyperlink>
  <ids-hyperlink font-size="14" color="unset">Second Item</ids-hyperlink>
  <ids-hyperlink font-size="14" color="unset" disabled>Disabled Item</ids-hyperlink>
  <ids-hyperlink font-size="14" color="unset">Current Item</ids-hyperlink>
</ids-breadcrumb>
```

## Settings and Attributes

The breadcrumb can contain either ids-text or ids-hyperlink, depending on whether the item is navigable.

Relevant ids-hyperlink attributes:

- `color` {string} Set to `unset` to use the default coloring.
- `disabled` Set to `true` to apply disabled styling.
- `font-size` {number} Defaults to `14`.
- `href` {string} The URL that the hyperlink points to.
- `truncate` {boolean} If `true`, the breadcrumb list can be truncated, hiding some links behind an overflow menu.

## States and Variations (With Code Examples)

- Default: The default state of breadcrumb text.
- Hover: Indicates that the user is hovering over a breadcrumb item, and can click to navigate to a higher hierarchy level. The last item does not have a hover state, as it represents the user’s current page and is typically non-interactive.
- Focus: Indicates that the user has highlighted the hyperlink through keyboard navigation.

## Themeable Parts

- `checkbox` allows you to further style the checkbox input element
- `slider` allows you to further style the sliding part of the switch
- `label` allows you to further style the label text

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- "Collapsing Lists" was deprecated but later added as truncate feature.
- Markup has entirely changed, see the updated code example

**4.x to 5.x**
- Markup has changed to a custom element `<ids-breadcrumb></ids-breadcrumb>`
- Markup Uses `ids-hyperlink` instead of `<a>`
- Can now be imported as a single JS file and used with encapsulated styles

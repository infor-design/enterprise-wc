# Ids Breadcrumb Component

## Description

A breadcrumb is a navigational element that shows a user their current location in the hierarchical context of an application and allows them to navigate back through page levels.

A user can navigate between views using a breadcrumb. It is best for presenting hierarchical paths in a system and showing the user the location.

Breadcrumbs show the user's location within the context of a site’s navigational hierarchy. Since it only displays the navigational path from a single point of origin, it does not reflect the user's previous site history. While multi-line breadcrumbs are supported and sometimes necessary, truncated or single-line breadcrumbs are preferred, as they are less content-dense.

## Use Cases

- Breadcrumbs give users a way to view and trace their steps back through various levels within a hierarchy. Breadcrumbs help to minimize confusion in applications that contain a deep navigational hierarchy.

## Features (With Code Examples)

A normal breadcrumb component with an disabled item. The last item is considered the current link and has bolded styling.

```html
<ids-breadcrumb>
  <ids-hyperlink font-size="14" color="unset">First Item</ids-hyperlink>
  <ids-hyperlink font-size="14" color="unset">Second Item</ids-hyperlink>
  <ids-hyperlink font-size="14" color="unset" disabled>Disabled Item</ids-hyperlink>
  <ids-hyperlink font-size="14" color="unset">Current Item</ids-hyperlink>
</ids-breadcrumb>
```

## Settings and Attributes

Inside the breadcrumb you can have either ids-text of ids-hyperlink elements depending if the text is linkable or not.

The following ids-hyperlink attributes should be considered

- `color` {string} Set to unset to disable the hyperlink color and get the default coloring to work.
- `disabled` Use leave blank or set to 'true' to set disabled color.
- `font-size` {number} Will be 14 by default.
- `href` {string} The url that the hyperlink component links to.

## States and Variations (With Code Examples)

- Default: The default state of breadcrumb text.
- Hover: Indicates that the user is hovering over a text item in the breadcrumb, and can click on the item to navigate to a level that is higher in the navigational hierarchy. Since the last item in the breadcrumb represents the user’s current page, it is typically non-interactive and does not include a hover state.
- Focus: Indicates that the user has highlighted the hyperlink through tab key navigation.

## Themeable Parts

- `checkbox` allows you to further style the checkbox input element
- `slider` allows you to further style the sliding part of the switch
- `label` allows you to further style the label text

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the bread crumb item is focus is focusable this will focus or unfocus the link.
- <kbd>Enter</kbd>: If a link this will follow the link.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- "Collapsing Lists" was deprecated but later added as truncate feature.
- Markup has entirely changed, see the updated code example

**4.x to 5.x**
- Bread Crumb now uses all new markup and classes for web components (see above)
- Markup has changed to a custom element `<ids-breadcrumb></ids-breadcrumb>`
- Markup Uses `ids-hyperlink` instead of `<a>`
- Can now be imported as a single JS file and used with encapsulated styles

# ids-badge

## Description

The ids-badge informs users of a status or count of an object. See more [usage details](https://design.infor.com/components/components/badge).

## Terminology

- **Badge**: Used to inform users of the status of an object or of an action.
- **Color**: This is the color of the badge.
- **Shape**: This is the shape of the badge. It can be round or rounded rectangle.

## Themeable Parts

- `badge` allows you to further style the badge element

## Features (With Code Examples)

A normal/no properties badge used as a web component.

```html
<ids-badge>5</ids-badge>
```

Use the `color` attribute to style badges as statuses:
`alert`, `error`, `info`, `warning`, or `success`.

```html
<ids-badge color="caution">10</ids-badge>
<ids-badge color="error">1500</ids-badge>
<ids-badge color="info">25k+</ids-badge>
<ids-badge color="warning">16</ids-badge>
<ids-badge color="success">5</ids-badge>
```

To create a circular badge, use the `shape` attribute with the value `round`:

```html
<ids-badge color="caution" shape="round">10</ids-badge>
```

For improved accessibility, add an audible description using <ids-text>:

```html
<ids-badge color="error">404 <ids-text audible="true">In Error Condition</ids-text></ids-badge>
```

## Settings and Attributes

- `color` {string} Sets the status color of the badge. Values are `alert`, `error`, `warning`, `success`, or `info`.
- `disabled` {boolean} Sets the disabled state.
- `shape` {string} Sets the badge shape. Values are `normal` (default) or `round`.

## States and Variations

- Color
- Disabled
- Shape


## Converting from Previous Versions (Breaking Changes)

**4.x to 5.x**
- Markup has changed to a custom element `<ids-badge></ids-badge>
- Can now be imported as a single JS file and used with encapsulated styles
- The names of some badge types have changed.
- The yellow warning is removed in favor of just the orange warning.
- Some of the types/settings are changed.

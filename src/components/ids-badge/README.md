#Ids Badge Component

## Description

The IDS Badge Compoment consists of a small circle containing alphanumeric or icon that appears to another object. Badges are used to display alphanumeric values. A User can easily skim object-related values.

## Use Cases

- Badges can be use to give a non-critical status update on a piece of information or action to your application.
- Badges can be used to provide users with information about an object that is worthy of attention.

## Terminology

**Badge**: used to inform users of the status of an object or of an action.
**Color**: This is the color of the badge.
**Shape**: This is the shape of the badge. It can be round or rounded rectangle.

## Themeable Parts

- `badge` allows you to further style the badge element

## Features (With Code Examples)

A normal/ no properties badge used as a web component.

```html
<ids-badge>5</ids-badge>
```

A colored badge is done by adding a `color` attribute and one of the following:
alert, error, info, warning, and success.

```html
<ids-badge color="alert">10</ids-badge>
<ids-badge color="error">1500</ids-badge>
<ids-badge color="info">25k+</ids-badge>
<ids-badge color="warning">16</ids-badge>
<ids-badge color="success">5</ids-badge>
```

A shape badge is done by adding a `shape` attribute and one of the following: normal, and round. When you don't set the shape, normal will be the default value.

```html
<ids-badge color="alert" shape="round">10</ids-badge>
```

A badge with an icon can be configure by adding the `<ids-icon></ids-icon>` component inside of the badge.

```html
<ids-badge color="alert" shape="round"><ids-icon icon="pending" size="normal"></ids-icon></ids-badge>
```

Audible span can de configure by adding `<ids-text audible="true"></ids-text>` inside of the badge.

```html
<ids-badge color="error">404 <ids-text audible="true">In Error Condition</ids-text></ids-badge>
```

## Settings and Attributes

- `color` {string} Sets the color of the badge e.g. `alert`, `error`, or `info`.
- `shape` {string} `normal` is the default value of the shape, you can also change it to `round`.

## States and Variations

- Color
- Shape

## Keyboard Guidelines

Badges do not have tab stops and have no keyboard interaction on their own, but they may be placed in a grid cell or object that has tab focus.

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1 Ensure the color badges pass contrast.

## Converting from Previous Versions (Breaking Changes)

**4.x to 5.x**
- Markup has changed to a custom element `<ids-badge></ids-badge>
- Can now be imported as a single JS file and used with encapsulated styles
- The names of some badge types have changed.
- The yellow warning is removed in favor of just the orange warning.
- Some of the types/settings are changed.

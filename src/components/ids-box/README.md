# ids-box

## Description

ids-box is a primitive component that cards and widgets build on. Also consider ids-card, as it includes additional interactivity. See ids-widget for use with Role-Based Workspaces (RBWS).

## Terminology

- **Box**: A configurable box with a border or not that centers contents
- **Card**: An additional layer to boxes that adds functionality like states and selection
- **Widget**: An additional layer to cards that adds functionality for home pages / portal

## Features (With Code Examples)

A box with default padding:

```html
<ids-box>
  Bordered
</ids-box>
```

A square box with padding and unrounded corners:

```html
<ids-box square padding-x="32" padding-y="32" border-radius="0">
  Squared
</ids-box>
```

## Class Hierarchy

- IdsBox
  - IdsElement

## Settings (Attributes)

- `actionable` {boolean} Adds actionable states (when used in cards)
- `backgroundColor` {string} Set the background color (as a CSS variable)
- `borderless` {boolean} Turns off the borders
- `borderRadius` {number} Sets the border radius to something non-default
- `shadowed` {number} Turn off the border but leave the shadow (for RBWS)
- `width` {string} Sets a width in pixels or percent
- `height` {string} Sets a height in pixels or percent
- `paddingX` {string} Set the x axis padding on the box contents (in pixels)
- `paddingY` {string} Set the y axis padding on the box contents (in pixels)

## Themeable Parts

- `box` allows you to further style the box element

## States and Variations

- Color
- Size

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container.

## Converting from Previous Versions (Breaking Changes)

**4.x to 5.x**

- New component that is the base layer to cards in the previous context

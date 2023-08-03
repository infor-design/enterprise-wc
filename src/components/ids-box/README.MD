# Ids Box Component

## Description

Boxes are small UI that are a base layer to cards and widgets that. They can be used as a lightweight container on their own for visual information. If your looking for most specific card features you might expect. Do checkout the card component as it is much more useful. If your looking for home page "cards" look at the widget component.

## Use Cases

- Use when you want to show visual information in a box with border or without and center the content

## Dos and Don'ts

- Overcrowd your content with boxes, so people can see the items clearly.

## Terminology

- **Box**: A configurable box with a border or not that centers contents
- **Card**: An additional layer to boxes that adds functionality like states and selection
- **Widget**: An additional layer to cards that adds functionality for home pages / portal

## Features (With Code Examples)

A box tag used as a web component with 16x padding by default.

```html
<ids-box>
  Bordered
</ids-box>
```

A square box with padding and unrounded corners

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
- `backgroundColor` {string} Set the background color (as a css variable)
- `borderless` {boolean} Turns off the borders
- `borderRadius` {number} Sets the border radius to something non-default
- `shadowed` {number} Turn off the border but leave the shadow (for home pages)
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

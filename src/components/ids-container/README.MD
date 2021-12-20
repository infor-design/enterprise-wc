# Ids Container Component

## Description

We created a root container component. This is used currently for theming the page and reseting the browser styles. In addition the container is the parent element for the locale and language, all components that are in it will use this locale/language.

## Use Cases

- When you need to use components that will not overflow the page boundary
- When you need a root container for IDS components
- When you need to style the page background
- When you need a locale and language

## Terminology

- **Page Container**: The older term for ids-container

## Features (With Code Examples)

A normal container used as a web component.

```html
<ids-container scrollable="true">
  <!-- ids components -->
</ids-container>
```

A normal container with a set padding.
```html
<ids-container scrollable="true" padding="8">
  <!-- ids components -->
</ids-container>
```

## Settings and Attributes

- `scrollable` {boolean} Turns on the overflow to allow for scroll
- `padding` {number} Sets the padding in px around the container (defaults to 0 / none)
- `color-variant` {string} can be set to "alternate" to display contrasting color for text/icons via the [IdsColorVariantMixin](../../src/mixins/ids-color-variant/README.md)

## States and Variations (With Code Examples)

- Color
- Scrollable
- Padding

## Keyboard Guidelines

- <kbd>Down Arrow/Up Arrow</kbd>: Scrolls the container

## Responsive Guidelines

- This component will be 100% width and height in the page / parent

## Converting from Previous Versions

- 3.x: Did not exist
- 4.x: Replaces a div with the page-container class

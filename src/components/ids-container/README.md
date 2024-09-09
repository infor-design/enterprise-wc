# ids-container 

## Description

A root container component that's used for theming the page and resetting the browser styles. The ids-container is also the parent element for the locale and language, all components that are in it will use this locale/language.

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

- `scrollable` {boolean} If `true`, turns on the overflow to allow for scroll.
- `padding` {number} Sets the padding (in px) around the container. Defaults to 0 / none.
- `color-variant` {string} Can be set to "alternate" to display contrasting color for text or icons via the [IdsColorVariantMixin](../../src/mixins/ids-color-variant-mixin/README.md).
- `background-color` {boolean} Set as `true` to display a background color (different based on theme).

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

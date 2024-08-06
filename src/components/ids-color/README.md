# ids-color

## Description

ids-color consists of custom element `<ids-color>`. Once initialized, it functions to display a color setting using a `hex` attribute. 

## Settings and Attributes

- `hex` {string} Sets the color hex attribute.
- `size` {string} The size of the color swatch: `xs`, `sm`, `mm`, `md`, `lg`, or `full`
- `color` {string} Sets the background color to a CSS variable.
- `clickable` {boolean} Set to `true` to add the checkbox from ids-color-picker.
- `label` {string} Displays a label under the color swatch.

## Code Examples

A basic use of the color picker with a hex color option.

```html
<ids-color hex="#b94e4e"></ids-color>
```

A basic use case of the color picker to show a color palette item in larger size.

```html
<ids-color size="full" color="--ids-color-red-10" clickable="false" label="--ids-color-red-10"></ids-color>
```
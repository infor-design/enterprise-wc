# Ids Color

## Description

The color consists of a custom element `<ids-color></ids-color>`. Once initialized, it functions to display a color setting using a hex attribute. The IDS color palette consists of two types of colors:

Status Colors: Specific colors within the color palette are associated with different statuses across products. We tend to use 5 different categories of statuses.
Neutral Colors: Specific grey based colors of which there is 11 including white which all the components are comprised of.
Colorful Colors: Six more color sets based of ten colors that are used to communicate status, states, theming and charts.

## Settings and Attributes

- `hex` {string} Sets the hex attribute to display a colors hex value `hex="#b94e4e"`
- `size` {string} The color swatch's size between `(xs, sm, mm, md, lg, full)`
- `color` {string} Sets the background color to a color css variable
- `clickable` {boolean} If set to false the checkbox will not be added (checkbox is used in the color picker).
- `label` {string} Sets a label under the color swatch

## Code Examples

A basic use case of the color picker with a hex color option.

```html
<ids-color hex="#b94e4e"></ids-color>
```

A basic use case of the color picker to show a color palette item in larger size.

```html
<ids-color size="full" color="--ids-color-red-10" clickable="false" label="--ids-color-red-10"></ids-color>
```
## Theme Variables

For a list of css variables added at the `:root` you can used [see the theme information](rc/themes/default/).

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>
- <kbd>Enter</kbd>

# Ids Icon Component

## Description

The design system provides a list of standard icons which can be used in your applications. The list of icons is a result of a studying common iconography and consolidating that with standardized icons (for example, a floppy disk to represent a "save" function). The icons in the list should be familiar to users.

## Use Cases

- Icons are most effective when they improve visual interest and grab the user's attention. They help guide users while they're navigating a page.
- Use too many icons and they'll become nothing more than decoration. Their use for navigation on a webpage can often cause dilution.

## Terminology

- **Icon**: An icon is a symbol. In this design case this is literal, for example  the little trashcan to indicate delete.
- **Svg**: Stands for eXtensible Markup Language (XML)-based vector graphic format for the Web and other environments

## Features (With Code Examples)

For a normal sized icon just specific the icon name and the web component will display the appropriate icon.

```html
<ids-icon icon="notes"></ids-icon>
```

Icons come in 6 sizes depending where it is used.

```html
<ids-icon icon="notes" size="xxl"></ids-icon>
<ids-icon icon="notes" size="xl"></ids-icon>
<ids-icon icon="notes" size="large"></ids-icon>
<ids-icon icon="notes" size="medium"></ids-icon>
<ids-icon icon="notes" size="small"></ids-icon>
<ids-icon icon="notes" size="xsmall"></ids-icon>
```

In addition to the default sizes the icon also supports custom height, width and viewbox properties
for specialized cases

```html
<ids-icon icon="notes" custom-height="80" custom-width="70" custom-viewbox="0 0 50 50"></ids-icon>
```

The most common implementation of custom sizing is for empty-message icons, which are available through ids-icon

```html
<ids-icon icon="empty-generic" custom-height="80" custom-width="80" custom-viewbox="0 0 80 80"></ids-icon>
```

Icons also have offer notification badge options in 4 possible positions

```html
<ids-icon icon="notes" badge-position="top-left"></ids-icon>
<ids-icon icon="notes" badge-position="top-right"></ids-icon>
<ids-icon icon="notes" badge-position="bottom-left"></ids-icon>
<ids-icon icon="notes" badge-position="bottom-right"></ids-icon>
```
These badges can also be displayed in 5 possible colors

```html

<ids-icon icon="notes" badge-position="top-left" badge-color="base"></ids-icon>
<ids-icon icon="notes" badge-position="top-left" badge-color="info"></ids-icon>
<ids-icon icon="notes" badge-position="top-left"></ids-icon badge-color="warning">
<ids-icon icon="notes" badge-position="top-left"></ids-icon badge-color="success">
<ids-icon icon="notes" badge-position="top-left" badge-color="error"></ids-icon>
```

You can add a custom icon by passing its name and an array of objects defining the SVG elements' attribute names and values.
We recommend you use [svgo](https://github.com/svg/svgo) to optimize your SVG before adding them to IdsIcon.

```js
import IdsIcon from '../ids-icon';

IdsIcon.addIcon('custom-cargoship', [{
  shape: 'path',
  d: 'm17.54 12.23-1.42 1H3.1l-2-2.6h16.42ZM3.32 8.85h2.74V7H3.32Zm4.78 0h2.74V7H8.1Zm8.56 1.62V5.19h-3.4v5.21',
  transform: 'translate(-0.12 -4.69)'
}]);
```

## Methods

- `addIcon(name: string, data: Array<any>): void` - Static method used to add custom icons.

## States and Variations

- Color
- Size
- Alert
- Badge-Position
- Badge-Color
- Height
- Viewbox
- Width

## Keyboard Guidelines

An icon is not on its own keyboard focusable and has no keyboard interaction.

## Responsive Guidelines

- Flows within its parent/placement and is usually centered vertically.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Icons have all new markup and classes.

**4.x to 5.x**

- The Icon component has been changed to a web component
- You no longer need the huge block of svg in the page.
- The icon and size are set via properties/attributes
- Markup has changed to a custom element `<ids-icon></ids-icon>` (see examples above)
- Can now be imported as a single JS file and used with encapsulated styles
- If using events, events are now plain JS events.
- Can now display notification badge (combines this feature)
- Can now be used to display empty-message options
- The logos have been removed/deprecated.
- The pseudo elements have been removed/deprecated.

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1. Ensure the icons tags pass contrast when combined with text.

## Regional Considerations

Some icons that indicate direction will be flipped when in Right-To-Left languages. This is a TODO still.

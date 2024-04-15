# Ids Personalization API

## Description

Our concept of Personalization is changing the primary color. You may want to do this for various reasons.
Personalization can either by a system setting or a use setting, this is up to the application developers.
We include small API for Personalization. When called it changes the primary color tokens with a generated sheet.
And updates the text color to one of good contrast. Then a style sheet is appended with the token changes.

## Use Cases

- When you want to mark an instance of an app with a color. For example for test environments.
- When you want to add a customer color to the app
- When you prefer a dark vs light color or are color blind or find the color more pleasing

## Components that Support Personalization

Only a subset of components support personalization:

- `Headers and Subheaders` - Changes its background color and buttons, search and text in it are reflected
- `Module Tabs` - The tabs and sub tabs and states.
- `Buttons` - The various states.
- `Tabs` - The tabs and states.
- `Misc` - Any items that get a primary color will also reflect. This include checkboxes, selection states (some), focus, progress bar but this is subject to change.

## Terminology

- **Personalization**: A broad term to describe changing the look of the applications main color.

## Features (With Code Examples)

Add an ids-theme-switcher to the page near the top and set the version and mode properties.

```js
import IdsPersonalization from '<path>/ids-personalize';
const personalize = new IdsPersonalization();
personalize.color = `#800`;
// See generated colors
console.log(personalize.colorProgression(personalize.color));
```

## Settings and Attributes

- `color` {string} Get or set the personalization color
- `colorProgression` {Record} Displays 10 primary color token values and the text color

## Methods

- `resetToDefault` {void} Removes any previous personalization styles from the page.

## Converting from Previous Versions

- 3.x: This version did not have any personalization
- 4.x: [Personalization](https://github.com/infor-design/enterprise/tree/main/src/components/personalize) api added
- 5.x: Personalization api changed to `const pers = new IdsPersonalization();` and only one color is needed.

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. The New Version of the theme has better color usage than the classic theme.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   The New Version of the theme has better contrast than the classic theme. Light and Dark mode pass WCAG AA and High Contrast passes WCAG AAA

## Regional Considerations

As a point of interest colors can have certain meanings associated with them for countries and cultures. We found this [article on color meaning](https://www.shutterstock.com/blog/color-symbolism-and-meanings-around-the-world) interesting.

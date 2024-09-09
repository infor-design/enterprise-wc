# ids-theme-switcher

## Description

We include a theme switcher component that can be visual or non visual. If visual it comes with a menu button to allow you to pick theme. If non visible you can set its properties and all other components in the page will change theme to the set theme.

You can include the initial theme one of two ways.

1. Let the components manage the styles in head manually
2. If you need to serve the css files in a different way you can include the theme manually as a link. Then the theme switcher will replace the file name section when you use it. Or you could full manage this yourself (replacing the theme file changes theme). For example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="/my-place/themes/ids-theme-default-light.css">
</head>
<body>
```

## Use Cases

- When you want to use a common look across applications with a theme
- When you prefer a dark vs light mode or need a high contrast mode for low light situations or Accessibility.

## Terminology

- **Theme**: A broad term to describe changing the look of the application. We essentially have 6 themes from a historical sense but have tried change Terminology over time and currently refer to a theme as one of the UI versions (New vs Classic)
- **Modes**: Formerly called Variant and lets you switch between dark, light and high contrast with in the version essentially constituting a new theme.
- **Versions**: Formerly called Theme and lets you switch between the New look and the Classic look and maybe in the future more themes.
- **New**: The new Formerly called Uplift and Vibrant
- **Classic**: Formerly called Soho and Subtle

## Features (With Code Examples)

Add an ids-theme-switcher to the page near the top and set the version and mode properties.

```html
<ids-theme-switcher mode="dark"></ids-theme-switcher>
```

## Settings and Attributes

- `mode` {string} Turns on the functionality to add an (x) button to clear remove the tag
- `selfManaged` {boolean} If added no links will attempt to be fetch via the fetch api. The expectation is you will manage the style sheet themes manually.

## Converting from Previous Versions

- 3.x: This version did not have any themes
- 4.x: You no longer change the style sheet out like in previous versions
- 5.x: You no longer need to change the style sheet out like in previous versions because the css in encapsulated within each component now

## Proposed Changes

- Fix Accessibility issue (1.4.1 Use of Color) by adding an icon to the color tags.
- Fix Accessibility issue (1.4.3 Contrast (Minimum)) by changing or not using some tags

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. The New Version of the theme has better color usage than the classic theme.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   The New Version of the theme has better contrast than the classic theme. Light and Dark mode pass WCAG AA and High Contrast passes WCAG AAA

## Regional Considerations

As a point of interest colors can have certain meanings associated with them for countries and cultures. We found this [article on color meaning](https://www.shutterstock.com/blog/color-symbolism-and-meanings-around-the-world) interesting.

# Ids Loader Component

## Description

The ids-loader component is used to notify the user that the system is processing a request, and that they must wait for that request to be processed before continuing with the current task. There are different indicators and UI styles for different scenarios. In previous versions this has been called Loading Indicator or Busy Indicator.

## Use Cases

- Loading indicators tell users about wait times for current processes. Examples can include, searching through a page and submitting a form or a page loading. These indicators communicate the status to the user.

## Terminology

- *Determinate*: Used when there is a defined loading time. These indicators display percentages that help approximate the wait time.
- *Indeterminate*: Used when there is an undefined loading time. These indicators are for unspecified wait times, and do not include a percentage.

## Features (With Code Examples)

A page loader can be added to a page by adding an ids-loader to the page and running the scripts. It will not appear until the web component is in a `connnected` state.

```html
<ids-loader></ids-loader>
```

## Settings and Attributes

TBD

## States and Variations (With Code Examples)

- Loading
- Determinate
- Indeterminate

## Keyboard Guidelines

No keyboard shortcuts available.

## Responsive Guidelines

- The Page Loader will fill 100% off the top of the page

## Converting from Previous Versions

- 3.x:  have all new markup and classes.
- 4.x: Busy Indicator has been changed to ids-loader. It has all new markup and classes for web components.

## Proposed Changes

- Fix Accessibility issue (1.4.1 Use of Color) by adding an icon to the color tags.
- Add a label or off screen text for accessibility

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.1 Text Alternatives - Provide text alternatives for any non-text content so that it can be changed into other forms people need, such as large print, braille, speech, symbols or simpler language.

## Regional Considerations

Any Labels should be localized in the current language. The animation should flip in RTL mode (TBD)

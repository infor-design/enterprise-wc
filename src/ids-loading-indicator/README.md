# Ids Loading Indicator Component

## Description

The ids-loading-indicator component is used to notify the user that the system is processing a request, and that they must wait for that request to be processed before continuing with the current task. There are different indicators and UI styles for different scenarios. In previous versions this has been called Loading Indicator or Busy Indicator.

## Use Cases

- Loading indicators tell users about wait times for current processes. Examples can include, searching through a page and submitting a form or a page loading. These indicators communicate the status to the user.

## Terminology

- *Determinate*: Used when there is a defined loading time. These indicators display percentages that help approximate the wait time.
- *Indeterminate*: Used when there is an undefined loading time. These indicators are for unspecified wait times, and do not include a percentage.

## Features (With Code Examples)

A page loader can be added to a page by adding an ids-loading-indicator to the page and running the scripts. It will not appear until the web component is in a `connnected` state.

Circular and indeterminate:
```html
<ids-loading-indicator></ids-loading-indicator>
```
Indeterminate and linear:
```html
<ids-loading-indicator linear></ids-loading-indicator>
```

Determinate, linear, with 75% completion and the percentage text shown:
```html
<ids-loading-indicator progress="10" sticky percentage-visible></ids-loading-indicator>
```

Determinate, with 10% completion and affixed to the top of view it is currently in:
```html
<ids-loading-indicator progress="10" sticky percentage-visible></ids-loading-indicator>
```


## Settings and Attributes

- `progress` *{number | undefined}* Represents the percentage completed for the indicator; if not specified, the indicator is set into indeterminate mode (e.g. no specific progress with an animation)
- `sticky` *{boolean}* Flags the indicator as an sticky indicator type; causes
the indicator to stick to the top of the innermost parent IdsElement and span it horizontally. If set, will unflag this indicator as a linear or circular indicator.
- `linear` *{boolean}* value Flags the indicator as a linear indicator type;
   * causes the indicator to span its parent component horizontally and
   * be represented as a horizontal/linear bar. If set, removes current
   * flag types that may be set.
- `percentage-visible` *{boolean}* Denotes that the percentage text should be visible (not applicable to `sticky` loading indicators).

## Themeable Parts

- `loader` allows you to further style the loader element

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
- 4.x: Busy Indicator has been changed to ids-loading-indicator. It has all new markup and classes for web components.

## Proposed Changes

- Fix Accessibility issue (1.4.1 Use of Color) by adding an icon to the color tags.
- Add a label or off screen text for accessibility

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.1 Text Alternatives - Provide text alternatives for any non-text content so that it can be changed into other forms people need, such as large print, braille, speech, symbols or simpler language.

## Regional Considerations

Any Labels should be localized in the current language. The animation should flip in RTL mode (TBD)

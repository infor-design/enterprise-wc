# Ids Loading Indicator Component

## Description

The `<ids-loading-indicator>` component is used to notify the user that the system is processing a request, and that they must wait for that request to be processed before continuing with the current task. There are different indicators and UI styles for different scenarios. In previous versions this has been called Loading Indicator or Busy Indicator.

## Use Cases

- Loading indicators tell users about wait times for current processes. Examples can include, searching through a page and submitting a form or a page loading. These indicators communicate the status to the user.

## Terminology

- **Determinate**: Used when there is a defined loading time. These indicators display percentages that help approximate the wait time.
- **Indeterminate**: Used when there is an undefined loading time. These indicators are for unspecified wait times, and do not include a percentage.

## Features (With Code Examples)

A page loader can be added to a page by adding an ids-loading-indicator to the page and running the scripts. It will not appear until the web component is in a `connnected` state.

A circular and indeterminate indicator will be the default behavior of an `ids-loading-indicator` without attributes passed:
```html
<ids-loading-indicator></ids-loading-indicator>
```
Adding a `linear` flag sets the indicator to be a linear indicator:
```html
<ids-loading-indicator linear></ids-loading-indicator>
```

Setting any type of indicator's `progress` attribute will cause the indicator to become
determinate and then represent the percentage given by the the attribute. In this example,
the progress is at 20% which would mean 20% of the linear indicator will be filled in/marked as
complete.

```html
<ids-loading-indicator linear progress="20"></ids-loading-indicator>
```

Adding the `percentage-visible` flag attribute will cause text to show up on an indicator:

```html
<ids-loading-indicator linear progress="20" percentage-visible></ids-loading-indicator>
```

Adding a `sticky` attribute will set the indicator to a sticky indicator, which will affix
the indicator to the top of the current component.

```html
<ids-loading-indicator sticky></ids-loading-indicator>
```

In the following example, the indicator is determinate, with 10% completion and
affixed to the top of view it is currently in:
```html
<ids-loading-indicator progress="10" sticky></ids-loading-indicator>
```

## Settings and Attributes

- `progress` *{number | undefined}* Represents the percentage completed for the indicator; if not specified, the indicator is set into indeterminate mode (e.g. no specific progress with an animation)
- `sticky` *{boolean}* Flags the indicator as an sticky indicator type; causes
the indicator to stick to the top of the innermost parent IdsElement and span it horizontally. If set, will unflag this indicator as a linear or circular indicator.
- `linear` *{boolean}* value Flags the indicator as a linear indicator type; causes the indicator to span its parent component horizontally and become a horizontal/linear bar. If set, removes other current flag types that may be set.
- `percentage-visible` *{boolean}* Denotes that the percentage text should be visible (not applicable to `sticky` loading indicators).

## Themeable Parts
- `container` - the loader (svg) container element
- `progress` - the percentage complete or active part of the indeterminate area
- `overall` - the overall area which would span what the indicator would at 100% and always on the indicator.
- `percentage-text` the percentage text shown (when `percentage-visible` flag is set)

## Keyboard Guidelines

No keyboard shortcuts available -- the loading indicator is only meant to be a visual indicator to the user and not interactive.

## Responsive Guidelines

- if using a `sticky` indicator, the indicator will span 100% of the nearest `relative` positioned div.

## Converting from Previous Versions

- 3.x:  have all new markup and classes.
- 4.x: Busy Indicator has been changed to `ids-loading-indicator`. It has all new markup and classes for web components.

## Proposed Changes

- Fix Accessibility issue (1.4.1 Use of Color) by adding an icon to the color tags.
- Add a label or off screen text for accessibility

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.1 Text Alternatives - Provide text alternatives for any non-text content so that it can be changed into other forms people need, such as large print, braille, speech, symbols or simpler language.

## Regional Considerations

Any Labels should be localized in the current language. The animation should flip in RTL mode (TBD)

# Ids Time Picker Component

## Description

The Timepicker Component provides a click/touch user interface for setting a time.

## Use Cases (TODO)

- Entering an exact, unrestricted time (allowing any time to be entered, such as 11:39). In this use case, users should be allowed to either type the time values or select them.
- Entering time intervals (e.g., allowing time entry only in specific set intervals, such as 15 or 30 minutes). In this case, you should either prevent users from manually entering the minute values or automatically correct manual entries to the nearest interval
- Entering time values only within a specific range of time (such as only enter times within standard business hours). In this case, you should either prevent users from manually entering values or automatically correct manual entries to the nearest valid time

## Terminology

- **Timepicker**: A UI element for setting hours, minutes, seconds and periods (am/pm).
- **Popup**: A window/modal that appears when the timepicker is clicked.
- **Dropdowns**: Input elements for selecting hours, minutes, seconds and periods (am/pm).
- **Period**: AM (before noon) and PM (after noon).
- **Toggle**: Timepicker's popup will be opened if already closed, or closed if already opened.
- **Disabled**: Timepicker can be disabled so it cannot be followed or clicked.
- **Readonly**: Timepicker can be set to readonly so it cannot be edited.

## Features (With Code Examples)

A normal timepicker used as a web component.

```html
<ids-time-picker
  label="12-Hour Time Picker w/ seconds and period (am/pm)"
  placeholder="Enter your start time"
  format="hh:mm:ss a"
></ids-time-picker>
```

A `disabled` timepicker and a `readonly` timepicker.

```html
<ids-time-picker label="Disabled Time Picker" value="10:30 AM" disabled></ids-time-picker>

<ids-time-picker label="Readonly Time Picker" value="10:30 AM" readonly></ids-time-picker>
```

An `autoselect` timepicker and an `autoupdate` timepicker.

```html
<ids-time-picker label="Autoselect Time Picker" value="10:30 AM" autoselect></ids-time-picker>

<ids-time-picker label="Autoupdate Time Picker" value="10:30 AM" autoupdate></ids-time-picker>
```

It's also possible to configure the timepicker with a custom time format. This allows the timepicker to be configured in 24-hour/Miliary time and/or with a seconds picker for more accurate time.

```html
<ids-time-picker
  label="12-Hour Time Picker (w/ seconds)"
  format="hh:mm:ss"
></ids-time-picker>

<ids-time-picker
  label="24-Hour Time Picker"
  format="HH:mm"
></ids-time-picker>
```

It's also possible to control the intervals of minutes and seconds available for picking.

```html
<ids-time-picker
  label="5-minute intervals"
  format="hh:mm"
  minute-interval="5"
></ids-time-picker>

<ids-time-picker
  label="10-second intervals"
  format="hh:mm:ss"
  second-interval="10"
></ids-time-picker>
```

## Class Hierarchy

- IdsTimePicker
    - IdsElement
- Mixins
    - IdsEventsMixin
    - IdsKeyboardMixin
    - IdsPopupOpenEventsMixin,
    - IdsThemeMixin
    - IdsLocaleMixin

## Settings

- `autoselect` {boolean} Automatically opens the popup on focus.
- `autoupdate` {boolean} Automatically updates the time string value and hides the "Set Time" button.
- `colorVariant` {string} set the current color variant.
- `compact` {boolean} sets the component to be compact mode.
- `dirty-tracker` {boolean} sets the dirty tracking feature on to indicate a changed field. See [Ids Dirty Tracker Mixin](../../mixins/ids-dirty-tracker-mixin/README.md) for more information.
- `disabled` {boolean} Disables the timepicker
- `fieldHeight` {string} defines the field height. See [Ids Field Height Mixin](../../mixins/ids-field-height-mixin/README.md) for more information.
- `readonly` {boolean} Makes the timepicker readonly
- `label` {string} Set the timepicker's label
- `labelState` {string} indicates that a label is hidden (note that for accessibility reasons, `label` should still be specified). See [Ids Label State Mixin](../../mixins/ids-label-state-mixin/README.md) for more information.
- `placeholder` {string} Set the timepicker's placeholder
- `language` {string} Set the timepicker's language (Default: "en")
- `locale` {string} Set the timepicker's locale (Default: "en-US")
- `noMargins` {boolean} sets whether or not no-margins around the component.
- `size` {'sm' | 'md' | 'lg' | 'full' | string} Sets the size of the input-field's width
- `mode` {'light' | 'dark' | 'contrast' | string} Set the theme mode
- `version` {'new' | 'classic' | string} Set the theme version
- `intervals` {readonly} Get the minutes and seconds intervals
- `options` {readonly} Get dropdown-options for hour, minutes, second and period (am/pm)
- `embeddable` {boolean} Set whether or not to show only hours/minutes/seconds dropdowns without input

## Events

- `mouseup` {MouseEvent} Clicking the clock-icon will toggle the popup window.

## Methods

- `closeTimePopup()` Close the timepicker's popup window
- `openTimePopup()` Open the timepicker's popup window
- `toggleTimePopup()` Close the timepicker's popup window
- `setTimeOnField()` Set the input-field's timestring value.

## Themeable Parts (TODO)

- `label` allows you to further style the label text
- `input` allows you to further style the input element
- `popup` allows you to further style the timepicker's popup window

## States and Variations

- `hasSeconds` {boolean} Does the timepicker format include seconds ("ss")?
- `hasPeriod` {boolean} Does the timepicker format include the am/pm period (" a")?
- `is12Hours` {boolean} Is the timepicker using a 12-Hour format ("hh")?
- `is24Hours` {boolean} Is the timepicker using a 24-Hour format ("HH")?
- `isOpen` {boolean} Is the timepicker's popup open?

## Keyboard Guidelines

- <kbd>Enter</kbd>: Toggles the popup window, if the timepicker is not disabled or readonly.
- <kbd>Escape</kbd> or <kbd>Backspace</kbd>: Close the popup window, if the timepicker is not disabled or readonly.

## Responsive Guidelines (TODO)

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent dimensions.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Timepicker was implemented in v4.0.0
- Timepicker can be invoked with `$('#my-element').timepicker()`.

**4.x to 5.x**

- Timepicker are now custom elements `<ids-time-picker></ids-time-picker>`
- If using events, events are now plain JS events
- Can now be imported as a single JS file and used with encapsulated styles

## Designs

[Design Specs WC](https://www.figma.com/file/ri2Knf3KchdfdzRAeds0Ab/IDS-Mobility-v4.6?node-id=1%3A5740)

## Accessibility Guidelines

- The Time Picker needs to support both manual time entry (hours, minutes, and, on rare occasions, seconds) as well as some method of selecting from valid entries. Depending on the use case, users may be able to manually enter a time or only select from a restricted set of values.

## Regional Considerations (TODO)

Labels should be localized in the current language. The close and link icons will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).

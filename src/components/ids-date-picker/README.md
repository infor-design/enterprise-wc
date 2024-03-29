# Ids Date Picker Component

## Description
The `ids-date-picker` is a web component to support date entry

## Use Cases
- Display date form field with input attributes (value, label, placeholder, disabled, readonly) and validation
- Display date picker in calendar toolbar (`ids-week-view`, `ids-month-view`)

## Settings (Attributes)
- `colorVariant` {string} set the current color variant.
- `compact` {boolean} sets the component to be compact mode.
- `fieldHeight` {string} defines the field height. See [Ids Field Height Mixin](../../mixins/ids-field-height-mixin/README.md) for more information.
- `value` {string|null} - Input value
- `placeholder` {true|false} - Whether or not to show date format as input placeholder
- `label` {string|null} - Input label
- `labelState` {string} indicates that a label is hidden (note that for accessibility reasons, `label` should still be specified). See [Ids Label State Mixin](../../mixins/ids-label-state-mixin/README.md) for more information.
- `noMargins` {boolean} sets whether or not no-margins around the component.
- `id` {string} - Input ID
- `disabled` {true|false} - Whether or not the input should be disabled
- `readonly` {true|false} - Whether or not the input should be readonly
- `tabbable` {true|false} - Whether or not the trigger button should be tabbable
- `size` {'xs'|'sm'|'mm'|'md'|'lg'|'full'} - Size (width) of the field. Default is `sm`
- `validate` {'required'|'date'|'rangeDate'|string} - Input validation rules
- `validation-events` {string} - Input validation events, `change blur` as default
- `format` {'locale'|string|null} - Input date format, if not set defaults to locale calendar date format. Examples: `yyyy-MM-dd`, `d/M/yyyy`, `dd/MM/yyyy`
- `is-calendar-toolbar` {true|false} - Whether or not the component is used in calendar toolbar. Uses text instead of input
- `is-dropdown` {true|false} - Whether or not the component is dropdown with year/month picker
- `month` `{string|number|null}` - Specifies a month for the popup calendar (`ids-month-view` attribute)
- `day` `{string|number|null}` - Specifies a day for the popup calendar (`ids-month-view` attribute)
- `year` `{string|number|null}` - Specifies a year for the popup calendar (`ids-month-view` attribute)
- `first-day-of-week` `{string|number|null}` - Specifies first day of the week for the popup calendar, if not set the information comes from the locale (`ids-month-view` attribute)
- `show-today` `{true|false}` - Whether or not to show the today button in the popup calendar (`ids-month-view` attribute)
- `expanded` `{true|false}` - When the date picker is month/year picker it specifies whether or not the picker is expanded
- `legend` - Set array of legend items:
  - `name` `{string}` - The name of the legend (required)
  - `color` `{string}` - The color of the legend, either hex or IDS variable excluding `--ids-color-` part i.e. `green-60` (required)
  - `dates` `{Array}` - Array of dates (either dates or dayOfWeek is required)
  - `dayOfWeek` `{Array}` - Array of days of week where 0 is Sunday (either dates or dayOfWeek is required)
- `use-range` `{true|false}` - Whether or not the component should be a range picker. If set without settings default settings will apply.
- `rangeSettings` `{Object}` - Range selection settings:
  - `start` `{string}` - start date of the range selection. Default is `null` not set
  - `end` `{string}` - end date of the range selection. Default is `null` not set
  - `separator` `{string}` - separator symbol for the input value i.e. `2/7/2018 - 2/22/2018` if separator is ` - `. Default is ` - `
  - `minDays` `{number}` - minimum number of days to select. Default is `0` not set
  - `maxDays` `{number}` - maximum number of days to select. Default is `0` not set
  - `selectForward` `{boolean}` - Whether or not the selection should be in forward direction. Default is `false`
  - `selectBackward` `{boolean}` - Whether or not the selection should be in backward direction. Default is `false`
  - `includeDisabled` `{boolean}` - Whether or not the selection should include disabled dates visually
  - `selectWeek` `{boolean}` - Whether or not the selection should include the whole week
- `disableSettings` `{Object}` - Disable dates settings:
  - `dates` `{Array}` - Disable specific dates (in a format that can be converted to a date)
  - `years` `{Array}` - Disable specific years
  - `minDate` `{string}` - Disable up to a minimum date
  - `maxDate` `{string}` - Disable up to a maximum date
  - `dayOfWeek` `{Array}` - Disable a specific of days of the week 0-6
  - `isEnable` `{boolean}` - Enables the disabled dates. Default is false
- `mask` `{true|false}` - Whether or not to enable date mask for the input. `format` attribute will be set as mask options format
- `minute-interval` {number} Set time picker minutes dropdown options interval
- `second-interval` {number} Set time picker seconds dropdown options interval
- `use-current-time` {true|false} - Set whether or not to show current time in the time picker dropdowns
- `show-picklist-year` `{true|false}` Whether or not to show a list of years in the picklist, default if true
- `show-picklist-month` `{true|false}` Whether or not to show a list of months in the picklist, default is true
- `show-picklist-week` `{true|false}` Whether or not to show week numbers in the picklist

## Methods
- `open()` - opens calendar popup
- `close()` - closes calendar popup

## Events
- `dayselected` - Fires when a day is selected or range selection is completed
- `expanded` - Fires when a month/year picker is opened/closed
- Event listeners for input (trigger field) `blur`, `change`, `focus`, `select`, `keydown`, `keypress`, `keyup`, `click`, `dbclick`, `beforetriggerclicked`, `triggerclicked` events can be added to `input` component property:

```js
const datePicker = document.querySelector('ids-date-picker');

datePicker.input.addEventListener('change');
```
- Event listeners for popup `show`, `hide` events can be added to `popup` property:
```js
const datePicker = document.querySelector('ids-date-picker');

datePicker.popup.addEventListener('show');
datePicker.popup.addEventListener('hide');
```

## Themeable Parts
- `container` allows you to further style the container element of the component
- `trigger-field` allows you to further style the trigger container
- `trigger-button` allows you to further style the trigger button
- `icon` allows you to further style the icon in the trigger button
- `input` allows you to further style the input element
- `popup` allows you to further style the popup element
- `footer` - allows you to further style the popup footer
- `btn-clear` - allows you to further style the clear button
- `btn-apply ` - allows you to further style the apply button

## Features (With Code Examples)
With no settings. Showing empty input field with no label or placeholder.
Calendar popup highlights current date, the first day of week is based on the locale calendar.

```html
<ids-date-picker></ids-date-picker>
```

With date form field settings. Required. Validation triggers on the input value change. Not tabbable.

```html
<ids-date-picker
  id="date-field"
  label="Date Field"
  value="3/4/2016"
  placeholder="M/d/yyyy"
  format="locale"
  validate="required"
  validation-events="change"
  size="lg"
  tabbable="false"
></ids-date-picker>
```

As dropdown variation.

```html
<ids-date-picker
  value="November 2021"
  is-dropdown="true"
></ids-date-picker>
```

When used in calendar toolbar.

```html
<ids-date-picker
  is-calendar-toolbar="true"
  year="2021"
  month="10"
  day="15"
  show-today="false"
  first-day-of-week="1"
></ids-date-picker>
```

Enable range selection with default settings.

```html
<ids-date-picker
  use-range="true"
></ids-date-picker>
```

The component can be controlled dynamically

```js
const datePicker = document.querySelector('ids-date-picker');

// Set legend
datePicker.legend = [
  {
    name: 'Public Holiday',
    color: 'green-60',
    dates: ['12/31/2021', '12/24/2021', '1/1/2022'],
  },
  { name: 'Weekends', color: 'orange-60', dayOfWeek: [0, 6] },
  {
    name: 'Other',
    color: 'red-30',
    dates: ['1/8/2022', '1/9/2022', '1/23/2022'],
  },
  {
    name: 'Half Days',
    color: 'purple-60',
    dates: ['1/21/2022', '1/22/2022'],
  },
  {
    name: 'Full Days',
    color: '#1677ee',
    dates: ['1/24/2022', '1/25/2022'],
  }
];

// Unset legend
datePicker.legend = null;

// Enable range selection and set range settings
datePicker.useRange = true;
datePicker.rangeSettings = {
  start: '12/24/2021',
  end: '1/25/2022'
};

// Disable range selection
datePicker.useRange = false;

// Add disabled dates
datePicker.disableSettings = {
  dates: ['2/7/2018', '2/9/2018', '2/10/2018', '2/11/2018'],
  dayOfWeek: [0, 6],
  minDate: '2/6/2018',
  maxDate: '2/12/2018',
  years: [2017, 2018],
  isEnable: true
}
```

## Keyboard Guidelines
- <kbd>Tab</kbd> - becomes active by tabbing into it.
- <kbd>Shift + Tab</kbd> reverses the direction of the tab order. Once in the widget, a <kbd>Shift + Tab</kbd> will take the user to the previous focusable element in the tab order
- <kbd>Up</kbd> and <kbd>Down</kbd> goes to the same day of the week in the previous or next week respectively. If the user advances past the end of the month they continue into the next or previous month as appropriate
- <kbd>Left</kbd> Go to the previous day. Visually, focus is moved from day to day and wraps from row to row in a grid of days and weeks
- <kbd>Right</kbd> Advances to the next day. Visually, focus is moved from day to day and wraps from row to row in a grid of days and weeks
- <kbd>Control + Page Up</kbd> moves to the same date in the previous year
- <kbd>Control + Page Down</kbd> moves to the same date in the next year
- <kbd>Space</kbd>, in singleton mode, acts as a toggle either selecting or de-selecting the date. In contiguous mode, it behaves similar to selecting a range of text: <kbd>Space</kbd> selects the first date. <kbd>Shift + Arrows</kbd> add to the selection. Pressing <kbd>Space</kbd> again de-selects the previous selections and selects the current focused date. In non-contiguous mode, <kbd>Space</kbd> may be used to select multiple non-contiguous dates
- <kbd>Home</kbd> moves to the first day of the current month
- <kbd>End</kbd> moves to the last day of the current month
- <kbd>Page Up</kbd> moves to the same date in the previous month
- <kbd>Page Down</kbd> moves to the same date in the next month
- <kbd>Enter</kbd> submits the form
- <kbd>Escape</kbd>, in the case of a popup date picker, closes the widget without any action
- <kbd>T</kbd> inserts today's date. Except for cases where date format includes wide/abbreviated months
- <kbd>+</kbd> Is used to increment the day in the calendar. This is in addition to the <kbd>Right</kbd>. This works both when in the input field or when the calendar picker is open. If the date pattern contains a `-` in it then this key interferes with typing so this key shortcut is disabled.
- <kbd>-</kbd>  Is used to increment the day in the calendar. This is in addition to the <kbd>Left</kbd>. This works both when in the input field or when the calendar picker is open. If the date pattern contains a `-` in it then this key interferes with typing so this key shortcut is disabled.

## Accessibility
The Date Picker is a complex control to code for accessibility.

- Always associate labels to the input field
- Add an `aria` label to the calendar element
- Add `aria-selected=true` to selected day
- Add instructional information like "Use down arrow to select" to the input as an audible label
- Each calendar item should have an audible label to announce the day of week while arrowing through days
- For comparison, see a similar <a href="http://oaa-accessibility.org/example/15/" target="_blank">example</a>

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- This is a new component for 4.x

**4.x to 5.x**
- Listeners for input and popup events should be added to references `input` and `popup` now. See Events section.
- `disable/readonly/tabbable` are now attributes not methods
- If using events, events are now plain JS events for example: change
- Markup has changed to a custom element `<ids-date-picker></ids-date-picker>`
- Can now be imported as a single JS file and used with encapsulated styles
- Instead of `onOpenCalendar` callback there are `show`, `hide` popup plain JS events and a date for calendar can be set as date picker `year`, `month`, `day` settings when calendar popup is opened
- To use date picker with time picker `format` attribute should contain time i.e. `M/d/yyyy hh:mm a`
- Added week numbers option to the calendar picklist

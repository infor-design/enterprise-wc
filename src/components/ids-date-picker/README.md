# Ids Date Picker Component

## Description
The `ids-date-picker` is a web component to support date entry

## Use Cases
- Display date form field with input attributes (value, label, placeholder, disabled, readonly) and validation
- Display date picker in calendar toolbar (`ids-week-view`, `ids-month-view`)

## Settings (Attributes)
- `value` {string|null} - Input value
- `placeholder` {string|null} - Input placeholder
- `label` {string|null} - Input label
- `id` {string} - Input ID
- `disabled` {true|false} - Whether or not the input should be disabled
- `readonly` {true|false} - Whether or not the input should be readonly
- `tabbable` {true|false} - Whether or not the trigger button should be tabbable
- `size` {'xs'|'sm'|'mm'|'md'|'lg'|'full'} - Size (width) of the field
- `validate` {'required'|string} - Input validation rules
- `validation-events` {string} - Input validation events, `change blur` as default
- `format` {'locale'|string|null} - Input date format, if not set defaults to locale calendar date format. Examples: `yyyy-MM-dd`, `d/M/yyyy`, `dd/MM/yyyy`
- `is-calendar-toolbar` {true|false} - Whether or not the component is used in calendar toolbar. Uses text instead of input
- `is-dropdown` {true|false} - Whether or not the component is dropdown with year/month picker
- `month` `{string|number|null}` - Specifies a month for the popup calendar (`ids-month-view` attribute)
- `day` `{string|number|null}` - Specifies a day for the popup calendar (`ids-month-view` attribute)
- `year` `{string|number|null}` - Specifies a year for the popup calendar (`ids-month-view` attribute)
- `first-day-of-week` `{string|number|null}` - Specifies first day of the week for the popup calendar, if not set the information comes from the locale (`ids-month-view` attribute)
- `show-today` `{true|false}` - Whether or not to show the today button in the popup calendar (`ids-month-view` attribute)

## Events
- `dayselected` - Fires when a day is selected

## Themeable Parts
- `container` allows you to further style the container element of the component
- `trigger-field` allows you to further style the trigger container
- `trigger-button` allows you to further style the trigger button
- `icon` allows you to further style the icon in the trigger button
- `input` allows you to further style the input element
- `popup` allows you to further style the popup element
- `footer` - allows you to further style the popup footer
- `start-button` - allows you to further style the clear/cancel button in the popup footer
- `end-button` - allows you to further style the apply button in the popup footer

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

## Accessibility
The Date Picker is a complex control to code for accessibility.

- Always associate labels to the input field
- Add an `aria` label to the calendar element
- Add `aria-selected=true` to selected day
- Add instructional information like "Use down arrow to select" to the input as an audible label
- Each calendar item should have an audible label to announce the day of week while arrowing through days
- For comparison, see a similar <a href="http://oaa-accessibility.org/example/15/" target="_blank">example</a>

# Ids Month View Component

## Description
The `ids-month-view` component is a web component that provides calendar view with navigation

## Use Cases
- Display one month full size or compact view calendar
- Display a day range more than one month

## Settings (Attributes)
- `month` `{string|number|null}` - Specifies a month to show from 0 to 11 range. 0 is January, 11 is December. Defaults to current date month if no specified or out of the range
- `day` `{string|number|null}` - Specifies a day to initially set as active. Defaults to current date day if no specified or the day value is bigger than the month days
- `year` `{string|number|null}` - Specifies a year to show. Defaults to current date year if no specified
- `start-date` `{string|null}` - Specifies start of the range as a string date format.
Examples of the format:
  - Tue Nov 16 2021
  - 2021-11-10T22:00:00.000Z
  - 11/17/2021
- `end-date` `{string|null}` - Specifies end of the range as a string date format.
If both start and end dates are set calendar toolbar will not be displayed.
- `first-day-of-week` `{string|number|null}` - Specifies first day of the week from 0 to 6 range. 0 is Sunday, 1 is Monday. Defaults to 0 if no specified or out of the range
- `show-today` `{true|false}` - Whether or not to show the today button in the toolbar
- `compact` `{true|false}` - Whether or not the component should be compact view
- `is-date-picker` `{true|false}` - Whether or not the component is used in a date picker component popup

## Events
- `dayselected` - Fires when a day is selected

## Methods
- `focus` - Focuses the active/selected day

## Features (With Code Examples)
With no settings. Month/Day/Year defaults to current date. First day of the week is 0 - Sunday.

```html
<ids-month-view></ids-month-view>
```

Specified date. First day of the week is 1 - Monday. Showing Today button in the toolbar.

```html
<ids-month-view
  show-today="true"
  month="10"
  year="2021"
  day="15"
  first-day-of-week="1"
></ids-month-view>
```

Specified date range. Showing more than one month of days. Calendar toolbar is hidden

```html
<ids-month-view
  start-date="07/14/2021"
  end-date="02/03/2022"
></ids-month-view>
```

The component can be controlled dynamically

```js
const monthView = document.querySelector('ids-month-view');

// Changing month (March)
monthView.month = 2;

// Changing day
monthView.day = 4;

// Changing year
monthView.year = 2016;

// Changing first day of the week (Monday)
monthView.firstDayOfWeek = 1;

// Make it compact
monthView.compact = true;

// Showing date range
monthView.startDate = '07/14/2021';
monthView.endDate = '02/02/2022';
```

## Accessibility

The monthview is a very complex component to code for accessibility. We take the following approach:

- Add an `aria-label` to the calendar element
- Add `aria-selected=true` to selected day
- Each calendar item should have an audible label to announce the day of week while arrowing through days
- For comparison, see a similar <a href="http://oaa-accessibility.org/example/15/" target="_blank">example</a>

# ids-month-view

## Description
The `ids-month-view` component is a web component that provides calendar view with navigation

## Use Cases
- Display one month full size or compact view calendar
- Display a day range more than one month

## Settings (Attributes)
- `month` `{string|number|null}` - Specifies a month to show from 0 to 11 range. 0 is January, 11 is December. Defaults to current date month if no specified or out of the range
- `day` `{string|number|null}` - Specifies a day to initially set as active. Defaults to current date day if no specified or the day value is bigger than the month days
- `year` `{string|number|null}` - Specifies a year to show. Defaults to current date year if no specified
- `activeDate` - `{Date}` - Read only property to get selected day in a date format
- `start-date` `{string|null}` - Specifies start of the range as a string date format.
Examples of the format:
  - Tue Nov 16 2021
  - 2021-11-10T22:00:00.000Z
  - 11/17/2021
- `end-date` `{string|null}` - Specifies end of the range as a string date format.
If both start and end dates are set calendar toolbar will not be displayed.
- `first-day-of-week` `{string|number|null}` - Specifies first day of the week from 0 to 6 range. 0 is Sunday, 1 is Monday. Defaults to 0 if no specified or out of the range
- `show-today` `{true|false}` - Specifies whether or not to show the today button in the toolbar
- `compact` `{true|false}` - Specifies whether or not the component should be compact view
- `is-date-picker` `{true|false}` - Specifies whether or not the component is used in a date picker component popup
- `legend` - Set array of legend items:
  - `name` `{string}` - The name of the legend (required)
  - `color` `{string}` - The color of the legend, either hex or IDS variable excluding `--ids-color-` part i.e. `green-60` (required)
  - `dates` `{Array}` - Array of dates (either dates or dayOfWeek is required)
  - `dayOfWeek` `{Array}` - Array of days of week where 0 is Sunday (either dates or dayOfWeek is required)
- `disable` `{Object}` - Disable dates settings:
  - `dates` `{Array}` - Disable specific dates (in a format that can be converted to a date)
  - `years` `{Array}` - Disable specific years
  - `minDate` `{string}` - Disable up to a minimum date
  - `maxDate` `{string}` - Disable up to a maximum date
  - `dayOfWeek` `{Array}` - Disable a specific of days of the week 0-6
  - `isEnable` `{boolean}` - Enables the disabled dates. Default is false
- `show-picklist-year` `{true|false}` Whether or not to show a list of years in the toolbar datepicker picklist, default if true
- `show-picklist-month` `{true|false}` Whether or not to show a list of months in the toolbar datepicker picklist, default is true
- `show-picklist-week` `{true|false}` Whether or not to show week numbers in the toolbar datepicker picklist

## Settings (Properties)
- `eventsData` `{Array<CalendarEventData>}` - Array of calendar event data to populate the month view
- `eventTypesData` `{Array<CalendarEventTypeData>}` - Array of calendar event types used to categorize calendar events

## Events
- `dayselected` - Fires when a day is selected
- `beforeeventrendered` Fires for each event rendered (full day or in day) before the element is added to the DOM
- `aftereventrendered` Fires for each event rendered (full day or in day) after the element is added to the DOM

## Methods
- `isDisabledByDate(date: Date): boolean` - Defines if a date is in disabled settings

## Keyboard Guidelines
- <kbd>Tab</kbd> - Tabbing will tab across the header elements and into the monthview.
- <kbd>Shift + Tab</kbd> reverses the direction of the tab order.
- <kbd>Up</kbd> and <kbd>Down</kbd> goes to the same day of the week in the previous or next week respectively. If the user advances past the end of the month they continue into the next or previous month as appropriate
- <kbd>Left</kbd> and <kbd>Right</kbd> advances one day to the next, also in a continuum. Visually, focus is moved from day to day and wraps from row to row in a grid of days and weeks
- <kbd>Control + Page Up</kbd> moves to the same date in the previous year
- <kbd>Control + Page Down</kbd> moves to the same date in the next year
- <kbd>Home</kbd> moves to the first day of the current month
- <kbd>End</kbd> moves to the last day of the current month
- <kbd>Page Up</kbd> moves to the same date in the previous month
- <kbd>Page Down</kbd> moves to the same date in the next month
- <kbd>T</kbd> moves to today's date

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

// Set legend
monthView.legend = [
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
monthView.legend = null;

// Add disabled dates
monthView.disableSettings = {
  dates: ['2/7/2018', '2/9/2018', '2/10/2018', '2/11/2018'],
  dayOfWeek: [0, 6],
  minDate: '2/6/2018',
  maxDate: '2/12/2018',
  years: [2017, 2018],
  isEnable: true
}
```

## Accessibility

The monthview is a very complex component to code for accessibility. We take the following approach:

- Add an `aria-label` to the calendar element
- Add `aria-selected=true` to selected day
- Each calendar item should have an audible label to announce the day of week while arrowing through days
- For comparison, see a similar <a href="http://oaa-accessibility.org/example/15/" target="_blank">example</a>

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- This is a new component for 4.x

**4.x to 5.x**

- MonthView is now a custom element `<ids-month-view></ids-month-view>`
- Events are now just plain JS events
- Some options and events are not converted yet
- To set range of dates now there are `start-date` and `end-date` attributes instead of `displayRange` setting

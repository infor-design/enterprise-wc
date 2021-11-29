# Ids Week View Component

## Description
The `ids-week-view` component is a web component that provides calendar view that displays weeks and days
with navigation and current time indicator

## Use Cases
- Display one day calendar in selected dates
- Display a week calendar in selected dates
- Display multiple weeks calendar in selected dates
- Display current time indicator

## Settings (Attributes)
- `start-date` `{string|null}` - Specifies start of the week as a string date format
First day of the week from current date will be set if not valid date or no specified. Examples of the format:
  - Tue Nov 16 2021
  - 2021-11-10T22:00:00.000Z
  - 11/17/2021
- `end-date` `{string|null}` - Specifies end of the week as a string date format. Last day of the week from current date will be set if not valid date or no specified. See `start-date` for examples of the format
- `start-hour` `{string|number|null}` - Specifies the hour to start on each day from 0 to 24 range. Defaults to 7 if no specified or out of the range
- `end-hour` `{string|number|null}` - Specifies the hour to end on each day from 0 to 24 range. Defaults to 19 if no specified or out of the range
- `first-day-of-week` `{string|number|null}` - Specifies first day of the week from 0 to 6 range. 0 is Sunday, 1 is Monday. Defaults to 0 if no specified or out of the range. The setting is used if no `start-date` or `end-date` specified and when Today button is clicked
- `show-today` `{true|false}` - Whether or not to show the today button in the toolbar
- `show-timeline` `{true|false}` - Whether or not to show current time indicator
- `timeline-interval` {string|number|null} - Specifies how often timeline should update it's position (in milliseconds). Defaults to 30000 (30 seconds)

## Features (With Code Examples)

With no settings. Regular week 7 days to show. First day of the week is Sunday, last day of the week is Saturday. 7 AM - 7 PM hours.
Today button doesn't appear in the toolbar. Current time indicator appears if the time is in range of 7 AM - 7 PM hours. Today's day is highlighted

```html
<ids-week-view></ids-week-view>
```

With `first-day-of-week` setting. Regular week 7 days to show. First day of the week is Monday, last day of the week is Sunday. 7 AM - 7 PM hours.
Today button doesn't appear in the toolbar. Current time indicator appears if the time is in range of 7 AM - 7 PM hours. Today's day is highlighted

```html
<ids-week-view first-day-of-week="1"></ids-week-view>
```

One day calendar. Start date is equal to end date. 7 AM - 7 PM hours. Today button appears. Current time indicator doesn't appear

```html
<ids-week-view
  start-date="11/11/2021"
  end-date="11/11/2021"
  show-today="true"
  show-timeline="false"
></ids-week-view>
```

Multiple week calendar with start/end hours settings. Start hour is `10` - 10 AM. End hour is `15` - 3 PM

```html
<ids-week-view
  start-date="11/01/2021"
  end-date="11/14/2021"
  start-hour="10"
  end-hour="15"
></ids-week-view>
```

The component can be controlled dynamically

```js
const weekView = document.querySelector('ids-week-view');

// Changing start/end date
weekView.startDate = 'Tue Nov 16 2021';
weekView.endDate = '11/17/2021';

// Changing start/end hours
weekView.startHour = 6;
weekView.endHour = 21;

// Set current date week with Sunday first day of the week
weekView.startDate = null;
weekView.endDate = null;
weekView.firstDayOfWeek = 0;

// Remove today button from the toolbar
weekView.showToday = false;

// Remove timeline
weekView.showTimeline = false;

// Change timeline interval to 1 second
weekView.timelineInterval = 1000;
```

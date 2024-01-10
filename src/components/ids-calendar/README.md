# Ids Calendar Component

## Description
The `ids-calendar` component is a web component that provides calendar view that displays month, week, and day views.
User can switch between month, week, and day views using menu button inside the toolbar.

## Use Cases
- Displays month view in selected date
- Display a week calendar in selected date
- Display one day calendar in selected date

## Settings (Attributes)
- `date` `{string|null}` - Specifies active date in a string date format. Defaults to current date.
- `show-details` `{string|null}` - Specifies whether detail pane is shown
- `show-legend` `{string|null}` - Specifies whether legend pane is shown
- `suppress-form` `{boolean}` - Disables built in calendar event forms which handle creating/updating calendar events.

## Settings (Properties)
- `eventsData` `{Array<CalendarEventData>}` - Array of calendar event data to populate the week view
- `eventTypesData` `{Array<CalendarEventTypeData>}` - Array of calendar event types used to categorize calendar events

## Events
- `eventadded` - Fires when new event is added to calendar. Detail contains new event and calendar element.
- `eventupdated` - Fires when existing event is updated. Detail contains updated event and calendar element.
- `beforeeventrendered` Fires for each event rendered (full day or in day) before the element is added to the DOM. This event can fire frequently or more than expected as the component does re-rendering.
- `aftereventrendered` Fires for each event rendered (full day or in day) after the element is added to the DOM. This event can fire frequently or more than expected as the component does re-rendering.
- `daydblclick` - Fires when a day cell in month view is double clicked.
- `clickcalendarevent` - Fires when a calendar event is clicked. Detail contains IdsCalendarEvent element.
- `dblclickcalendarevent` - Fires when a calendar event is double clicked. Detail contains IdsCalendarEvent element.
- `eventsrendered` - Fires when calendar events are rendered in current view. Detail contains calendar events data.

## Methods
- `addEvent(eventData: CalendarEventData)` - Add an event to the calendar.
- `updateEvent(eventData: CalendarEventData)` - Update an existing calendar event.

## Features (With Code Examples)

With no settings. Calendar shows month view set to current date without legend or detail panes.

```html
<ids-calendar></ids-calendar>
```

With `date` setting. Calendar shows month/week/day view of provided date.

```html
<ids-calendar date="11/11/2021"></ids-calendar>
```

With `show-legend` setting. Calendar shows legend pane. By default, legend pane contains calendar event type checkboxes
used to filter populated calendar events by event type.

```html
<ids-calendar
  date="11/11/2021"
  show-legend="true"
></ids-calendar>
```

With `show-details` setting. Calendar shows details pane. Detail pane shows detailed list of calendar event within the active date.
Detail pane is only visible when month view is active.

```html
<ids-calendar
  date="11/01/2021"
  show-details="true"
></ids-calendar>
```

The component can be controlled dynamically

```js
const calendar = document.querySelector('ids-calendar');

// Changing date
calendar.date = 'Tue Nov 16 2021';
calendar.date = '11/17/2021';

// Changing pane visibility
calendar.showLegend = false;
calendar.showDetails = true;

// Setting calendar event data
calendar.eventsData = [...eventsData];
calendar.eventsData = [];

// Setting calendar event types data
calendar.eventTypesData = [...eventTypesData];
calendar.eventTypesData = [];
```

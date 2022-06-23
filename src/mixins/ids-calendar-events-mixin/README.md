# Ids Calendar Events Mixin

This mixin add shared API to manage calendar events and event types.
It adds function to create view picker template used in month and week views.
It also adds reusable utility functions to sort, remove, and generate date strings for 
calendar events.

This mixin adds one observed attribute to component:

- `viewPicker` `{string|boolean}` - Specifies whether to include view picker popup in month/week view

This mixin adds three setting (properties) to component

- `eventsData` `{Array<CalendarEventData>}` - Array of calendar event data to populate the week view
- `eventTypesData` `{Array<CalendarEventTypeData>}` - Array of calendar event types used to categorize calendar events
- `beforeEventsRender` `Promise<CalendarEventsData[]>` - Async Function invoked to fetch calendar events data with provided start/end dates when date changes occur

To use this mixin in your component:

1. Import `IdsCalendarEventsMixin`
2. Add `IdsCalendarEventsMixin` to the mixes() section
3. Add `IdsCalendarEventsMixin` to the @mixes comment section
4. Ensure your components has a `renderEventsData` to handle rendering calendar event data
5. Set `eventsData` with an array of calendar event data
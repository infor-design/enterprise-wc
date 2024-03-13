import '../../ids-action-panel/ids-action-panel';
import '../../ids-textarea/ids-textarea';
import eventsJSON from '../../../assets/data/events.json';
import eventTypesJSON from '../../../assets/data/event-types.json';
import type IdsActionPanel from '../../ids-action-panel/ids-action-panel';
import type IdsCalendar from '../ids-calendar';
import type IdsInput from '../../ids-input/ids-input';
import type IdsDropdown from '../../ids-dropdown/ids-dropdown';
import type IdsDatePicker from '../../ids-date-picker/ids-date-picker';
import type IdsTextarea from '../../ids-textarea/ids-textarea';
import IdsCalendarEvent, { CalendarEventData, CalendarEventTypeData } from '../ids-calendar-event';

const eventsURL: any = eventsJSON;
const eventTypesURL: any = eventTypesJSON;
let eventsData: CalendarEventData[] = [];
let eventTypesData: CalendarEventTypeData[] = [];
let calendar: IdsCalendar | null = null;
let actionPanel: IdsActionPanel | null = null;

/**
 * Fetch events.json
 * @returns {Promise} events.json content
 */
function getCalendarEvents(): Promise<any> {
  return fetch(eventsURL).then((res) => res.json());
}

/**
 * Fetch event-types.json
 * @returns {Promise} event-types.json content
 */
function getEventTypes(): Promise<any> {
  return fetch(eventTypesURL).then((res) => res.json());
}

/**
 * Creates toolbar template for action panel
 * @param {CalendarEventData} eventData event data
 * @returns {string} toolbar template
 */
function formToolbarTemplate(eventData: CalendarEventData | null): string {
  return `<ids-toolbar slot="toolbar">
    <ids-toolbar-section type="title">
      <ids-text font-size="20" type="h2">${eventData?.subject || 'Create Event'}</ids-text>
    </ids-toolbar-section>
    <ids-toolbar-section type="buttonset" align="end">
      <ids-button id="btn-save" icon="save" no-padding data-action="${eventData ? 'save' : 'create'}">
        <ids-text font-weight="semi-bold">${eventData ? 'Save' : 'Create'}</ids-text>
      </ids-button>
    </ids-toolbar-section>
  </ids-toolbar>`;
}

/**
 * Creates content template for action panel
 * @param {CalendarEventData} eventData event data
 * @param {Date} selectedDay date of selected day
 * @returns {string} content template
 */
function formContentTemplate(eventData: CalendarEventData | null, selectedDay?: Date): string {
  const subjectValue = eventData?.subject || 'New Event';
  const startDate = new Date(eventData?.starts || selectedDay || Date.now());
  const endDate = new Date(eventData?.ends || (selectedDay?.getTime() || Date.now()) + (24 * 60 * 60 * 1000));
  const startValue = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;
  const endValue = `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;

  return `<ids-layout-grid cols="1" gap="md" min-col-width="150px" padding-x="md" padding-y="sm">
    <ids-layout-grid-cell>
      <ids-input id="event-subject" value="${subjectValue}" label="Subject">${subjectValue}</ids-input>
      <ids-dropdown id="event-type" label="Event Type" value="${eventData?.type || eventTypesData[0].id}">
        <ids-list-box>
          ${eventTypesData.map((et) => `<ids-list-box-option value="${et.id}">${et.label}</ids-list-box-option>`).join('')}
        </ids-list-box>
      </ids-dropdown>
      <ids-date-picker id="event-dates"label="Date Range" use-range="true" mask value="${startValue} - ${endValue}" size="md"></ids-date-picker>
      <ids-textarea id="event-comments" label="Comments">${eventData?.comments || ''}</ids-textarea>
    </ids-layout-grid-cell>
  </ids-layout-grid>`;
}

/**
 * Populates and shows calendar event action panel form
 * @param {CalendarEventData} eventData event data
 * @param {Date} selectedDay date of selected day
 */
function showEventForm(eventData: CalendarEventData | null, selectedDay?: Date): void {
  const toolbarTemplate = formToolbarTemplate(eventData);
  const contentTemplate = formContentTemplate(eventData, selectedDay);
  actionPanel!.innerHTML = toolbarTemplate + contentTemplate;
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  actionPanel!.show();
}

document.addEventListener('DOMContentLoaded', async () => {
  let currEventData: CalendarEventData | null = null;
  calendar = document.querySelector<IdsCalendar>('ids-calendar');
  actionPanel = document.querySelector<IdsActionPanel>('ids-action-panel');

  eventsData = await getCalendarEvents();
  eventTypesData = await getEventTypes();
  calendar!.eventTypesData = eventTypesData;
  calendar!.eventsData = eventsData;

  calendar!.addEventListener('daydblclick', ((evt: CustomEvent) => {
    currEventData = null;
    showEventForm(null, new Date(evt.detail.value));
  }) as EventListener);

  calendar!.addEventListener('clickcalendarevent', ((evt: CustomEvent) => {
    const elem: IdsCalendarEvent = evt.detail.elem;
    currEventData = elem.eventData || null;
    showEventForm(currEventData);
  }) as EventListener);

  actionPanel!.onButtonClick = (btn: any) => {
    const isNewEvent = btn.getAttribute('data-action') === 'create';
    const subject = actionPanel?.querySelector<IdsInput>('#event-subject')?.value;
    const eventType = actionPanel?.querySelector<IdsDropdown>('#event-type')?.value;
    const dates = actionPanel?.querySelector<IdsDatePicker>('#event-dates')?.value;
    const comments = actionPanel?.querySelector<IdsTextarea>('#event-comments')?.value;
    const [start, end] = (dates as string).split(' - ').map((dateStr) => new Date(dateStr));
    const currStartDate = currEventData ? new Date(currEventData.starts) : null;
    const currEndDate = currEventData ? new Date(currEventData.ends) : null;
    const startDate = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      currStartDate?.getHours() || 0,
      currStartDate?.getMinutes() || 0,
      currStartDate?.getSeconds() || 0
    );
    const endDate = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate(),
      currEndDate?.getHours() || 23,
      currEndDate?.getMinutes() || 59,
      currEndDate?.getSeconds() || 59
    );

    const eventData = {
      ...(currEventData || {}),
      id: currEventData?.id || `newEvent${Date.now()}`,
      subject: subject || 'New Event',
      type: eventType || 'dto',
      starts: startDate.toISOString(),
      ends: endDate.toISOString(),
      comments: comments || '',
      isAllDay: (endDate.getTime() - startDate.getTime()) >= 86400000
    };

    if (isNewEvent) {
      calendar?.addEvent(eventData);
    } else {
      calendar?.updateEvent(eventData);
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    actionPanel?.hide();
  };
});

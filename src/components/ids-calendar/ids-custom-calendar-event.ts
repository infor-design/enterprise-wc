import IdsCalendarEvent, { CalendarEventTypeData } from './ids-calendar-event';
import styles from './ids-custom-calendar-event.scss';
import { customElement, scss } from '../../core/ids-decorators';

interface CustomCalendarEventTypeData extends CalendarEventTypeData {
  noOfAttributes?: number;
  attrs?: [];
}

const eventPositionMap = new Map();

const eventPillAttributesMap = new Map();

@customElement('ids-custom-calendar-event')
@scss(styles)
export default class IdsCustomCalendarEvent extends IdsCalendarEvent {
  #cssClass: string[] = [];

  eventTypesJson: CustomCalendarEventTypeData[] | any = [];

  eventPillHeight = '20px';

  constructor() {
    super();
  }

  /**
   * Invoked when ids-custom-calendar-event is added to the DOM
   */
  connectedCallback(): void {
    super.connectedCallback();

    if (this.container) {
      this.container.style.borderTop = '2px solid white';
      this.container.style.paddingTop = '2px';
      this.container.style.paddingBottom = '2px';
      const order = this.order;
      if (this.eventData && order <= 3) {
        // space between event pills
        this.manageEventPillsPosition(this.dateKey, order, this.eventTypeData);
        // position event element vertically
        if (order === 0) {
          this.container.style.top = '20px';
        } else if (eventPositionMap.get(`${this.dateKey}_${order}`)) {
          this.container.style.top = `${eventPositionMap.get(`${this.dateKey}_${order}`)}px`;
        } else {
          // if event-types data doesn't contain noOfAttributes and atts values
          this.container.style.top = `${(order * 18) + 25}px`;
        }
        this.container.style.height = this.eventPillHeight;
      }
    }
  }

  template(): string {
    // Customized Layout
    const cssClass = this.#cssClass.join(' ');
    return `
      <a class='ids-calendar-event ${cssClass}' href='#' color='${this.color}'>
          ${this.contentTemplate()}
      </a>
    `;
  }

  /**
   * Creates template for calendar event content
   * @returns {string} content html
   */
  contentTemplate(): string {
    if (!this.eventData) return ``;

    let text = `<span line='1' class='custom-calendar-event-title'>${this.eventData.shortSubject || this.eventData.subject}</span>`;
    const tooltip = this.eventData.subject;
    const overflow = this.overflow;
    const icon = this.eventData.icon ? `<ids-icon class='calendar-event-icon' icon='${this.eventData.icon}' height='16' width='16'></ids-icon>` : '';
    this.eventTypesJson.push(this.eventTypeData);

    if (this.eventTypesJson) {
      const eventPillsAttr = this.eventTypesJson.filter((item: any) => item.id === this.eventData?.type);
      if (eventPillsAttr.length > 0 && eventPillsAttr[0].attrs) {
        if (eventPillsAttr[0].id === 'dto' || eventPillsAttr[0].id === 'admin' || eventPillsAttr[0].id === 'sick') {
          eventPillsAttr[0]?.attrs.forEach((attr: string) => {
            if (attr === 'time' && this.eventData?.starts && this.eventData?.ends) {
              text += `<br /><span line='2' class='custom-calendar-event-details'>${this.getHourRange(new Date(this.eventData.starts), new Date(this.eventData.ends))}</span>`;
              this.eventPillHeight = '33px';
            }
          });
        } else if (eventPillsAttr[0].id === 'team') {
          eventPillsAttr[0].attrs.forEach((attr: string) => {
            if (attr === 'time' && this.eventData?.starts && this.eventData?.ends) {
              text += `<br /><span line='2' class='custom-calendar-event-details'>${this.getHourRange(new Date(this.eventData.starts), new Date(this.eventData.ends))}</span>`;
              this.eventPillHeight = '33px';
            } else if (attr === 'location' && this.eventData?.location) {
              text += `<br /><span line="3" class="custom-calendar-event-details">${this.eventData.location}</span>`;
              this.eventPillHeight = '48px';
            }
          });
        }
      }
    }
    let content = `<div class='calendar-event-content'>
                    <ids-text class='calendar-event-title' inline overflow='${overflow}' tooltip='${tooltip}'>
                      ${icon} ${text}
                    </ids-text>
                  </div>`;
    if (icon) {
      content = `<div class='calendar-event-content'>
                  <ids-text class='calendar-event-title' inline overflow='${overflow}' tooltip='${tooltip}'>
                    <div class='custom-calendar-event-icon'>${icon}</div>
                    <div>${text}</div>
                  </ids-text>
                </div>`;
    }
    return content;
  }

  /**
   * Sets extra css classes to calendar event
   * @param {Array<string>} value array of css classes
   */
  set cssClass(value: string[]) {
    this.#cssClass = this.#cssClass.concat(value);
    this.container?.classList.add(...value);
  }

  /**
   * Gets the start and end time format for each event
   * @param {Date} start Event Start Date
   * @param {Date} end Event End Date
   * @returns {string} Formatted Hour Range
   */
  getHourRange(start: Date, end: Date) {
    const startHours = start.getHours() + start.getMinutes() / 60;
    const endHours = end.getHours() + start.getMinutes() / 60;
    return this.locale?.formatHourRange(startHours, endHours, {});
  }

  /**
   * Manage event pill position vetically based on the number of attributes displayed in first event pill
   * @param {string} dateKey generated date key
   * @param {number} eventOrder Events order
   * @param {CalendarEventTypeData} eventType Event
   */
  manageEventPillsPosition(dateKey: string, eventOrder: number, eventType: CalendarEventTypeData | any): void {
    const MAX_EVENT_PILL_ATTR_COUNT = 4;
    if (eventOrder === 0) {
      if (eventType.noOfAttributes === 3) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 60);
      } else if (eventType.noOfAttributes === 2) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 54);
      } else if (eventType.noOfAttributes === 1) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 40);
      }
      eventPillAttributesMap.set(`${dateKey}_${eventOrder}`, eventType.noOfAttributes);
    } else if (eventOrder === 1) {
      const attributesCount = eventPillAttributesMap.get(`${dateKey}_${eventOrder - 1}`);
      if ((attributesCount + eventType.noOfAttributes) > MAX_EVENT_PILL_ATTR_COUNT) {
        this.CUSTOM_EVENT_COUNT = 1;
      } else {
        this.CUSTOM_EVENT_COUNT = 2;
      }

      if (attributesCount === 3) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 100);
      } else if (attributesCount === 2) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 100);
      } else if (attributesCount === 1) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 60);
      }
      eventPillAttributesMap.set(`${dateKey}_${eventOrder}`, eventType.noOfAttributes);
    } else if (eventOrder === 2) {
      const firstPillAttributesCount = eventPillAttributesMap.get(`${dateKey}_${eventOrder - 2}`);
      const secondPillAttributesCount = eventPillAttributesMap.get(`${dateKey}_${eventOrder - 1}`);
      if ((firstPillAttributesCount + secondPillAttributesCount + eventType.noOfAttributes) > MAX_EVENT_PILL_ATTR_COUNT) {
        this.CUSTOM_EVENT_COUNT = 2;
      } else {
        this.CUSTOM_EVENT_COUNT = 3;
      }

      if (secondPillAttributesCount === 3) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 70);
      } else if (secondPillAttributesCount === 2) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 85);
      } else if (secondPillAttributesCount === 1) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 75);
      }
      eventPillAttributesMap.set(`${dateKey}_${eventOrder}`, eventType.noOfAttributes);
    } else if (eventOrder === 3) {
      const firstPillAttributesCount = eventPillAttributesMap.get(`${dateKey}_${eventOrder - 3}`);
      const secondPillAttributesCount = eventPillAttributesMap.get(`${dateKey}_${eventOrder - 2}`);
      const thirdPillAttributesCount = eventPillAttributesMap.get(`${dateKey}_${eventOrder - 1}`);

      if ((firstPillAttributesCount + secondPillAttributesCount + thirdPillAttributesCount
        + eventType.noOfAttributes) > MAX_EVENT_PILL_ATTR_COUNT) {
        this.CUSTOM_EVENT_COUNT = 2;
      } else {
        this.CUSTOM_EVENT_COUNT = 3;
      }

      if (thirdPillAttributesCount === 3) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 65);
      } else if (thirdPillAttributesCount === 2) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 85);
      } else if (thirdPillAttributesCount === 1) {
        eventPositionMap.set(`${dateKey}_${eventOrder + 1}`, 100);
      }
    }
  }
}

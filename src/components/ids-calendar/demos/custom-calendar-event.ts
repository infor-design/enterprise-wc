import IdsCalendarEvent, { CalendarEventTypeData } from '../ids-calendar-event';
import styles from './custom-calendar-event.scss';
import { customElement, scss } from '../../../core/ids-decorators';

interface CustomCalendarEventTypeData extends CalendarEventTypeData {
  noOfAttributes?: number;
  attrs?: [];
}

@customElement('ids-custom-calendar-event')
@scss(styles)
export default class IdsCustomCalendarEvent extends IdsCalendarEvent {
  #cssClass: string[] = [];

  eventTypesJson: CustomCalendarEventTypeData[] | any = [];

  eventPillHeight = '20px'; // Default height for 1 line event pill

  constructor() {
    super();
  }

  /**
   * Invoked when ids-custom-calendar-event is added to the DOM
   */
  connectedCallback(): void {
    super.connectedCallback();

    if (this.container) {
      this.container.style.height = this.eventPillHeight;
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
    const icon = this.eventData.icon ? `<ids-icon class='calendar-event-icon' icon='${this.eventData.icon}' height='12' width='12'></ids-icon>` : '';
    this.eventTypesJson.push(this.eventTypeData);

    if (this.eventTypesJson) {
      const eventPillsAttr = this.eventTypesJson.filter((item: any) => item.id === this.eventData?.type);
      if (eventPillsAttr.length > 0 && eventPillsAttr[0].attrs) {
        if (eventPillsAttr[0].id === 'dto' || eventPillsAttr[0].id === 'admin' || eventPillsAttr[0].id === 'sick') {
          eventPillsAttr[0]?.attrs.forEach((attr: string) => {
            if (attr === 'time' && this.eventData?.starts && this.eventData?.ends) {
              text += `<br /><span line='2' class='custom-calendar-event-details'>${this.getHourRange(new Date(this.eventData.starts), new Date(this.eventData.ends))}</span>`;
              this.eventPillHeight = '32px';
            }
          });
        } else if (eventPillsAttr[0].id === 'team') {
          eventPillsAttr[0].attrs.forEach((attr: string) => {
            if (attr === 'time' && this.eventData?.starts && this.eventData?.ends) {
              text += `<br /><span line='2' class='custom-calendar-event-details'>${this.getHourRange(new Date(this.eventData.starts), new Date(this.eventData.ends))}</span>`;
              this.eventPillHeight = '32px';
            } else if (attr === 'location' && this.eventData?.location) {
              text += `<br /><span line="3" class="custom-calendar-event-details">${this.eventData.location}</span>`;
              this.eventPillHeight = '40px';
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
                    <div class='custom-calendar-event'>${text}</div>
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
}

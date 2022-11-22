import IdsCalendarEvent from '../ids-calendar-event';
import { customElement } from '../../../core/ids-decorators';

@customElement('ids-custom-calendar-event')
export default class IdsCustomCalendarEvent extends IdsCalendarEvent {
  #cssClass: string[] = [];

  constructor() {
    super();
  }

  /**
   * Invoked when ids-custom-calendar-event is added to the DOM
   */
  connectedCallback(): void {
    super.connectedCallback();
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

    const displayTime = this.getDisplayTime();
    const text = this.eventData.shortSubject || this.eventData.subject;
    const tooltip = this.eventData.subject;
    const overflow = this.overflow;
    const icon = this.eventData.icon ? `<ids-icon class="calendar-event-icon" icon="${this.eventData.icon}" height="11" width="11"></ids-icon>` : '';

    return `<div class="calendar-event-content">
      <ids-text class="calendar-event-title" inline font-size="12" overflow="${overflow}" tooltip="${tooltip}">
        ${icon} ${text} ${displayTime}
      </ids-text>
    </div>`;
  }

  /**
   * Sets extra css classes to calendar event
   * @param {Array<string>} value array of css classes
   */
  set cssClass(value: string[]) {
    this.#cssClass = this.#cssClass.concat(value);
    this.container?.classList.add(...value);
  }
}

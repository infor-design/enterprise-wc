import Base from './ids-calendar-event-base';
import styles from './ids-calendar-event.scss';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { attributes } from '../../core/ids-attributes';

export type CalendarEventData = {
  id: string;
  subject: string;
  shortSubject?: string;
  icon?: string;
  comments?: string;
  location?: string;
  status?: string;
  starts: string;
  ends: string;
  type: string;
  isAllDay: string;
};

export type CalendarEventTypeData = {
  id: string;
  label: string;
  translationKey: string;
  color: 'amber' | 'amethyst' | 'azure' | 'emerald' | 'ruby' | 'slate' | 'turquoise';
  checked: boolean;
};

@customElement('ids-calendar-event')
@scss(styles)
export default class IdsCalendarEvent extends Base {
  constructor() {
    super();
  }

  /**
   * Returns array of observed attributes
   * @returns {Array<string>} attribute names
   */
  static get attributes(): string[] {
    return [
      ...super.attributes,
      attributes.DISPLAY_TIME,
      attributes.HEIGHT,
      attributes.WIDTH,
      attributes.OVERFLOW,
      attributes.X_OFFSET,
      attributes.Y_OFFSET
    ];
  }

  /**
   * Invoked when ids-calendar-event is added to the DOM
   */
  connectedCallback(): void {
    this.#attachEventHandlers();
    this.setDirection();
    super.connectedCallback();
  }

  /**
   * Creates template for ids calendar event
   * @returns {string} html
   */
  template(): string {
    return `<a class="ids-calendar-event" href="#">${this.contentTemplate()}</a>`;
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
      <ids-text class="calendar-event-title" inline font-size="12" color="unset" overflow="${overflow}" tooltip="${tooltip}">
        ${icon} ${text} ${displayTime}
      </ids-text>
    </div>`;
  }

  /**
   * Attach calendar-event event handlers
   */
  #attachEventHandlers(): void {
    const triggerFn = (clickType: 'click' | 'dblclick') => {
      this.triggerEvent(`${clickType}-calendar-event`, this, {
        detail: { calendarEvent: this },
        bubbles: true,
        cancelable: true,
        composed: true
      });
    };
    let timer: number | undefined;

    this.onEvent('click', this.container, (evt: MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      clearTimeout(timer);
      timer = <any>setTimeout(() => triggerFn('click'), 350);
    });

    this.onEvent('dblclick', this.container, (evt: MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      clearTimeout(timer);
      triggerFn('dblclick');
    });

    this.onEvent('languagechange.calendar-event', this.closest('ids-container'), () => {
      this.refreshContent();
    });
  }

  /**
   * Refreshses calendar event content with current settings
   */
  refreshContent(): void {
    this.container.innerHTML = this.contentTemplate();
  }

  /**
   * Creates localized hour range string (ex. 12-5:00pm)
   * @returns {string} localized hour range
   */
  getDisplayTime(): string {
    if (this.displayTime) {
      const startHours = this.startDate.getHours() + (this.startDate.getMinutes() / 60);
      const endHours = this.endDate.getHours() + (this.startDate.getMinutes() / 60);

      return this.locale?.formatHourRange(startHours, endHours, {});
    }

    return '';
  }

  /**
   * Sets calendar event data
   * @param {CalendarEventData} data Event data
   */
  set eventData(data: CalendarEventData) {
    this.cachedEvent = data;
    this.setAttribute('data-id', data.id);
    this.refreshContent();
  }

  /**
   * Gets calendar event data
   * @returns {CalendarEventData} Event data
   */
  get eventData(): CalendarEventData {
    return this.cachedEvent;
  }

  /**
   * Sets calendar event type
   * @param {CalendarEventTypeData | undefined} data Event type
   */
  set eventTypeData(data: CalendarEventTypeData | undefined) {
    this.cachedEventType = data;
    if (this.cachedEvent) this.cachedEvent.type = data?.id;

    if (data?.color) {
      this.container.setAttribute('color', data?.color);
    } else {
      this.container.removeAttribute('color');
    }
  }

  /**
   * Gets calendar event type
   * @returns {CalendarEventTypeData} Event type
   */
  get eventTypeData(): CalendarEventTypeData {
    return this.cachedEventType;
  }

  /**
   * Sets top style of calendar event
   * @param {string | null} value css top value
   */
  set yOffset(value: string | null) {
    this.setAttribute(attributes.Y_OFFSET, value);
    this.container.style.top = value;
  }

  /**
   * Gets y offset
   * @returns {string | null} yOffset value
   */
  get yOffset(): string | null {
    return this.getAttribute(attributes.Y_OFFSET);
  }

  /**
   * Sets horizontal position of calendar event
   * Styles left or right depending on rtl flag
   * @param {string | null} value css left/right value
   */
  set xOffset(value: string | null) {
    this.setAttribute(attributes.X_OFFSET, value);

    if (this.locale?.isRTL()) {
      this.container.style.right = value;
      this.container.style.left = null;
    } else {
      this.container.style.right = null;
      this.container.style.left = value;
    }
  }

  /**
   * @returns {string | null} xOffset value
   */
  get xOffset(): string | null {
    return this.getAttribute(attributes.X_OFFSET);
  }

  /**
   * Sets height of calendar event (Defaults to 20px)
   * @param {string | null} value css height value
   */
  set height(value: string | null) {
    this.setAttribute(attributes.HEIGHT, value);
    this.container.style.height = value;
  }

  /**
   * Gets height
   * @returns {string | null} height value
   */
  get height(): string | null {
    return this.getAttribute(attributes.HEIGHT);
  }

  /**
   * Sets width of calendar event (Defaults to width of container)
   * @param {string | null} value css width value
   */
  set width(value: string | null) {
    this.setAttribute(attributes.WIDTH, value);
    this.container.style.width = value;
  }

  /**
   * Gets width
   * @returns {string | null} width value
   */
  get width(): string | null {
    return this.getAttribute(attributes.WIDTH);
  }

  /**
   * Sets extra css classes to calendar event
   * @param {Array<string>} value array of css classes
   */
  set cssClass(value: string[]) {
    this.container.classList.add(...value);
  }

  /**
   * Gets start date of calendar event
   * @returns {Date} start date
   */
  get startDate(): Date {
    return new Date(this.cachedEvent.starts);
  }

  /**
   * Gets end date of calendar event
   * @returns {Date} end date
   */
  get endDate(): Date {
    return new Date(this.cachedEvent.ends);
  }

  /**
   * Gets duration of event in hours
   * @returns {number} duration in hours
   */
  get duration(): number {
    const hoursInMs: number = (1000 * 60 * 60);
    return (this.endDate.getTime() - this.startDate.getTime()) / hoursInMs;
  }

  /**
   * Sets whether hour range should be displayed in content
   * @param {string | boolean} value shows hour range if true
   */
  set displayTime(value: string | boolean) {
    if (stringToBool(value)) {
      this.setAttribute('display-time', '');
    } else {
      this.removeAttribute('display-time');
    }

    this.refreshContent();
  }

  /**
   * Gets displayTime setting value
   * @returns {boolean} return true if displayTime is set
   */
  get displayTime(): boolean {
    return this.hasAttribute('display-time');
  }

  /**
   * Sets overflow type for IdsText
   * @param {string} value Overflow values for IdsText
   */
  set overflow(value: string | null) {
    this.setAttribute(attributes.OVERFLOW, value);
    this.refreshContent();
  }

  /**
   * Gets overflow value of IdsText
   * @returns {string} IdsText overflow setting value
   */
  get overflow(): string {
    return this.getAttribute(attributes.OVERFLOW) || 'ellipsis';
  }
}

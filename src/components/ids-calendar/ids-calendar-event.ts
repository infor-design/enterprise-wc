import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
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
  disabled?: boolean
};

const Base = IdsLocaleMixin(
  IdsEventsMixin(
    IdsElement
  )
);

@customElement('ids-calendar-event')
@scss(styles)
export default class IdsCalendarEvent extends Base {
  // Property used to position overlapping events in month view
  #order = 0;

  #cssClass: string[] = [];

  #dateKey = '';

  cachedEvent: CalendarEventData | null = null;

  cachedEventType: CalendarEventTypeData | null = null;

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
    super.connectedCallback();
    this.#attachEventHandlers();
    this.refreshContent();
    this.recalc();
  }

  /**
   * Creates template for ids calendar event
   * @returns {string} html
   */
  template(): string {
    const cssClass = this.#cssClass.join(' ');

    return `
      <a class="ids-calendar-event ${cssClass}" href="#" color="${this.color}">
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
   * Attach calendar-event event handlers
   */
  #attachEventHandlers(): void {
    const triggerFn = (clickType: 'click' | 'dblclick') => {
      this.triggerEvent(`${clickType}-calendar-event`, this, {
        detail: { elem: this },
        bubbles: true,
        cancelable: true,
        composed: true
      });
    };

    this.onEvent('click', this.container, (evt: MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      triggerFn('click');
    });
  }

  /** Respond to language changes */
  onLanguageChange = () => {
    this.refreshContent();
  };

  /**
   * Refreshses calendar event content with current settings
   */
  refreshContent(): void {
    if (this.container) {
      this.container.innerHTML = this.contentTemplate();
    }
  }

  /**
   * Updates calendar event dimensions and position
   */
  recalc(): void {
    if (!this.container) return;

    // resize
    if (this.height) {
      this.container.style.height = this.height;
    }

    if (this.width) {
      this.container.style.width = this.width;
    }

    // reposition
    if (this.yOffset) {
      this.container.style.top = this.yOffset;
    }

    if (this.localeAPI?.isRTL()) {
      this.container.style.right = this.xOffset || '';
      this.container.style.removeProperty('left');
    } else {
      this.container.style.removeProperty('right');
      this.container.style.left = this.xOffset || '';
    }
  }

  /**
   * Creates localized hour range string (ex. 12-5:00pm)
   * @returns {string} localized hour range
   */
  getDisplayTime(): string {
    if (this.displayTime) {
      const startHours = this.startDate.getHours() + (this.startDate.getMinutes() / 60);
      const endHours = this.endDate.getHours() + (this.startDate.getMinutes() / 60);

      return this.localeAPI?.formatHourRange(startHours, endHours, {});
    }

    return '';
  }

  /**
   * Sets calendar event data
   * @param {CalendarEventData} data Event data
   */
  set eventData(data: CalendarEventData | undefined | null) {
    this.cachedEvent = data ?? null;
    if (data) this.setAttribute('data-id', data.id);
    this.refreshContent();
  }

  /**
   * Gets calendar event data
   * @returns {CalendarEventData} Event data
   */
  get eventData(): CalendarEventData | null {
    return this.cachedEvent;
  }

  /**
   * Sets calendar event type
   * @param {CalendarEventTypeData} data Event type
   */
  set eventTypeData(data: CalendarEventTypeData | undefined | null) {
    this.cachedEventType = data ?? null;

    // update cached event data
    if (this.cachedEvent && data?.id) {
      this.cachedEvent.type = data?.id;
    }

    if (data?.color) {
      this.container?.setAttribute('color', data?.color);
    } else {
      this.container?.removeAttribute('color');
    }
  }

  /**
   * Gets calendar event type
   * @returns {CalendarEventTypeData} Event type
   */
  get eventTypeData(): CalendarEventTypeData | null {
    return this.cachedEventType;
  }

  /**
   * Sets top style of calendar event
   * @param {string | null} value css top value
   */
  set yOffset(value: string | null) {
    if (value) {
      this.setAttribute(attributes.Y_OFFSET, value);
    } else {
      this.removeAttribute(attributes.Y_OFFSET);
    }

    this.recalc();
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
    if (value) {
      this.setAttribute(attributes.X_OFFSET, value);
    } else {
      this.removeAttribute(attributes.X_OFFSET);
    }

    this.recalc();
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
    if (value) {
      this.setAttribute(attributes.HEIGHT, value);
    } else {
      this.removeAttribute(attributes.HEIGHT);
    }

    this.recalc();
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
    if (value) {
      this.setAttribute(attributes.WIDTH, value);
    } else {
      this.removeAttribute(attributes.WIDTH);
    }

    this.recalc();
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
    this.#cssClass = this.#cssClass.concat(value);
    this.container?.classList.add(...value);
  }

  /**
   * Gets start date of calendar event
   * @returns {Date} start date
   */
  get startDate(): Date {
    return new Date(this.cachedEvent?.starts ?? '');
  }

  /**
   * Gets end date of calendar event
   * @returns {Date} end date
   */
  get endDate(): Date {
    return new Date(this.cachedEvent?.ends ?? '');
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
    this.setAttribute(attributes.OVERFLOW, value ?? 'ellipsis');
    this.refreshContent();
  }

  /**
   * Gets overflow value of IdsText
   * @returns {string} IdsText overflow setting value
   */
  get overflow(): string {
    return this.getAttribute(attributes.OVERFLOW) || 'ellipsis';
  }

  /**
   * Sets order property
   * @param {number} val order number
   */
  set order(val: number) {
    this.#order = val;
  }

  /**
   * Gets order property
   * @returns {number} order number
   */
  get order(): number {
    return this.#order;
  }

  /**
   * Gets color property from event type data
   * @returns {string} color
   */
  get color(): string {
    return this.eventTypeData?.color || 'azure';
  }

  /**
   * Sets dateKey property
   * @param {string} val dateKey string
   */
  set dateKey(val: string) {
    this.#dateKey = val;
  }

  /**
   * Gets dateKey property
   * @returns {string} dateKey string
   */
  get dateKey(): string {
    return this.#dateKey;
  }
}

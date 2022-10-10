import { attributes } from '../../core/ids-attributes';
import { IdsDatePickerCommonAttributes } from './ids-date-picker-common';
import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-date-picker-popup-base';
import {
  subtractDate, isValidDate, hoursTo24
} from '../../utils/ids-date-utils/ids-date-utils';

import IdsModalButton from '../ids-modal-button/ids-modal-button';
import '../ids-month-view/ids-month-view';
import '../ids-text/ids-text';

import styles from './ids-date-picker-popup.scss';

/**
 * IDS Date Picker Popup Component
 * @type {IdsDatePickerPopup}
 * @inherits IdsPopup
 */
@customElement('ids-date-picker-popup')
@scss(styles)
class IdsDatePickerPopup extends Base {
  constructor() {
    super();
  }

  /**
   * Elements for internal usage
   * @private
   */
  #monthView: any;

  connectedCallback() {
    super.connectedCallback();
    this.#monthView = this.container?.querySelector('ids-month-view');
    this.#attachEventListeners();
  }

  disconnectedCallback(): void {
    this.disconnectedCallback?.();
    this.#monthView = null;
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      ...IdsDatePickerCommonAttributes
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<ids-popup class="ids-date-picker-popup" type="menu" align="bottom, left" arrow="bottom" tabIndex="-1" y="12" animated>
      <ids-month-view
        compact="true"
        is-date-picker="true"
        show-today=${this.showToday}
        first-day-of-week="${this.firstDayOfWeek}"
        year="${this.year}"
        month="${this.month}"
        day="${this.day}"
        use-range="${this.useRange}"
        slot="content"
      ></ids-month-view>
      <div class="popup-footer" part="footer" slot="content">
        <ids-modal-button class="popup-btn popup-btn-cancel" cancel>
          <ids-text translate-text="true" font-weight="bold" part="btn-cancel">Cancel</ids-text>
        </ids-modal-button>
        <ids-modal-button class="popup-btn popup-btn-clear" part="btn-clear">
          <ids-text translate-text="true" font-weight="bold">Clear</ids-text>
        </ids-modal-button>
        <ids-modal-button class="popup-btn popup-btn-apply"${this.useRange ? ' disabled' : ''} part="btn-apply" type="primary">
          <ids-text translate-text="true" font-weight="bold">Apply</ids-text>
        </ids-modal-button>
      </div>
    </ids-popup>`;
  }

  /**
   * @returns {Array<string>} Date Picker vetoable events
   */
  vetoableEventTypes: Array<string> = ['beforeshow'];

  /**
   * format attributes
   * @returns {string} format param. Default is locale - gets format from the calendar
   */
  get format(): string {
    const attrVal = this.getAttribute(attributes.FORMAT);

    return !attrVal || attrVal === 'locale' ? this.locale?.calendar().dateFormat.short : attrVal;
  }

  /**
   * Sets the value date format and applies ids-mask
   * @param {string|null} val format attribute
   */
  set format(val: string | null) {
    if (val) {
      this.setAttribute(attributes.FORMAT, val);
      this.target?.setAttribute(attributes.FORMAT, val);
    } else {
      this.removeAttribute(attributes.FORMAT);
      this.target?.removeAttribute(attributes.FORMAT);
    }

    if (this.placeholder) {
      this.placeholder = this.format;
    }

    this.container?.querySelector('ids-time-picker')?.remove();

    if (this.#hasTime()) {
      this.#monthView?.insertAdjacentHTML('afterend', `
        <ids-time-picker
          embeddable="true"
          value="${this.value}"
          format="${this.format}"
          minute-interval="${this.minuteInterval}"
          second-interval="${this.secondInterval}"
          use-current-time="${this.useCurrentTime}"
        ></ids-time-picker>
      `);
    }

    this.container?.classList.toggle('has-time', this.#hasTime());

    // @TODO Fix mask
    // this.#applyMask();
  }

  #attachEventListeners() {
    this.offEvent('click.date-picker-footer');
    this.onEvent('click.date-picker-footer', this.container?.querySelector('.popup-footer'), (e: MouseEvent) => {
      if (!e.target) return;
      e.stopPropagation();

      if ((e.target as HTMLElement).closest('.popup-btn-apply')) {
        this.#handleApplyEvent(e);
        return;
      }

      if ((e.target as HTMLElement).closest('.popup-btn-clear')) {
        this.clear();
        this.hide();
        return;
      }

      if ((e.target as HTMLElement).closest('.popup-btn-cancel')) {
        this.#resetPickList();
        this.hide();
      }
    });
  }

  /**
   * Click to apply button event handler
   * @param {MouseEvent} e click event
   */
  #handleApplyEvent(e: MouseEvent): void {
    e.stopPropagation();

    const picklist = this.#monthView?.container?.querySelector('ids-date-picker');

    if (picklist?.expanded) {
      const { month, year, day } = picklist;

      this.#monthView.year = year;
      this.#monthView.month = month;
      this.#monthView.day = day;

      picklist.expanded = false;

      return;
    }

    const close = () => {
      this.hide();
      this.target?.focus();
      this.#triggerSelectedEvent();
    };

    if (this.useRange) {
      if (this.rangeSettings.end || (this.rangeSettings.start && !this.rangeSettings.end)) {
        if (this.rangeSettings.minDays && (this.rangeSettings.start === this.rangeSettings.end)) {
          this.rangeSettings.start = subtractDate(this.rangeSettings.start, this.rangeSettings.minDays, 'days');
        }

        if (this.target) {
          this.target.value = [
            this.locale.formatDate(this.#setTime(this.rangeSettings.start), { pattern: this.format }),
            this.rangeSettings.separator,
            this.locale.formatDate(
              this.#setTime(this.rangeSettings.end ?? this.#monthView.activeDate),
              { pattern: this.format }
            ),
          ].filter(Boolean).join('');
        }

        close();
      } else {
        if (this.target) {
          this.target.value = this.locale.formatDate(
            this.#setTime(this.rangeSettings.start ?? this.#monthView.activeDate),
            { pattern: this.format }
          );
        }
        this.rangeSettings = {
          start: this.#monthView.activeDate
        };
      }

      return;
    }

    if (this.target) {
      this.target.value = this.locale.formatDate(
        this.#setTime(this.#monthView.activeDate),
        { pattern: this.format }
      );
    }

    close();
  }

  /**
   * Clears the contents of
   * @returns {void}
   */
  clear() {
    this.#resetPickList();
    if (!this.isCalendarToolbar) {
      this.rangeSettings = {
        start: null,
        end: null
      };
      if (this.target) {
        this.target.value = '';
        this.target.focus();
      }
      this.#triggerSelectedEvent();
    }
  }

  #resetPickList() {
    const picklist = this.#monthView?.container.querySelector('ids-date-picker');
    if (picklist?.expanded) {
      picklist.expanded = false;
    }
  }

  /**
   * Defines if the format has hours/minutes/seconds pattern to show time picker
   * @returns {boolean} whether or not to show time picker
   */
  #hasTime(): boolean {
    return this.format.includes('h') || this.format.includes('m') || this.format.includes('s');
  }

  /**
   * Helper to set the date with time from time picker
   * @param {any} val date to add time values
   * @returns {Date} date with time values
   */
  #setTime(val: any): Date {
    const date = isValidDate(val) ? val : new Date(val);
    const timePicker = this.container?.querySelector('ids-time-picker');

    if (!this.#hasTime() || !timePicker) return date;

    const hours: number = timePicker.hours;
    const minutes: number = timePicker.minutes;
    const seconds: number = timePicker.seconds;
    const period: string = timePicker.period;
    const dayPeriodIndex = this.locale?.calendar().dayPeriods?.indexOf(period);

    date.setHours(hoursTo24(hours, dayPeriodIndex), minutes, seconds);

    return date;
  }

  /**
   * Trigger selected event with current params
   * @returns {void}
   */
  #triggerSelectedEvent(): void {
    const args = {
      detail: {
        elem: this,
        date: this.#monthView.activeDate,
        useRange: this.useRange,
        rangeStart: this.useRange && this.rangeSettings.start ? new Date(this.rangeSettings.start as string) : null,
        rangeEnd: this.useRange && this.rangeSettings.end ? new Date(this.rangeSettings.end as string) : null
      }
    };

    if (this.target) {
      this.target.triggerEvent('dayselected', this, args);
    }
  }

  /**
   * Hides this menu and any of its submenus.
   * @returns {void}
   */
  async hide(): Promise<void> {
    if (!this.popup.visible) return;

    this.removeOpenEvents();

    // Hide the Ids Popup and all Submenus
    this.popup.visible = false;
    await this.popup.hide();

    // Do other stuff
    this.container?.querySelectorAll('.popup-footer ids-modal-button')?.forEach((button: IdsModalButton) => {
      button.removeRipples();
    });

    this.hidden = true;
  }

  /**
   * @returns {void}
   */
  show(): void {
    if (this.popup.visible) return;

    // Trigger a veto-able `beforeshow` event.
    if (!this.triggerVetoableEvent('beforeshow')) {
      return;
    }

    this.hidden = false;

    // Do other stuff

    // Show the popup and do placement
    this.popup.visible = true;
    this.popup.show();

    this.addOpenEvents();
  }

  /**
   * Toggles visibility of the popup on/off depending on its current state
   * @returns {void}
   */
  toggleVisibility() {
    if (!this.popup.visible) {
      this.show();
    } else {
      this.hide();
    }
  }

  onTriggerClick() {
    this.toggleVisibility();
  }

  onOutsideClick(e: Event) {
    if (!this.contains(e.target as HTMLElement)) {
      this.hide();
    }
  }
}

export default IdsDatePickerPopup;

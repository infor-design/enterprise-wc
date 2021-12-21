import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-month-view-base';

// Import Utils
import {
  addDate,
  firstDayOfWeek,
  weeksInMonth,
} from '../../utils/ids-date-utils/ids-date-utils';
import { stringToBool, stringToNumber, buildClassAttrib } from '../../utils/ids-string-utils/ids-string-utils';

// Supporting components
import IdsButton from '../ids-button/ids-button';
import IdsIcon from '../ids-icon/ids-icon';
import IdsText from '../ids-text/ids-text';
import IdsToolbar from '../ids-toolbar/ids-toolbar';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';

// Import Styles
import styles from './ids-month-view.scss';

/**
 * IDS Month View Component
 * @type {IdsMonthView}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-month-view')
@scss(styles)
class IdsMonthView extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    this.#attachEventHandlers();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DAY,
      attributes.FIRST_DAY_OF_WEEK,
      attributes.MONTH,
      attributes.SHOW_TODAY,
      attributes.YEAR,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-month-view"></div>`;
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   */
  #attachEventHandlers() {
    // Respond to parent changing language
    this.offEvent('languagechange.month-view-container');
    this.onEvent('languagechange.month-view-container', this.closest('ids-container'), async () => {
      this.#renderToolbar();
      this.#renderMonth();
    });

    // Respond to parent changing locale
    this.offEvent('localechange.month-view-container');
    this.onEvent('localechange.month-view-container', this.closest('ids-container'), async () => {
      this.#setDirection();
      this.#renderMonth();
      this.#attachDatepickerText();
    });

    return this;
  }

  /**
   * Add toolbar HTML to shadow
   * @private
   */
  #renderToolbar() {
    const toolbarTemplate = `<ids-toolbar class="month-view-header" tabbable="true">
      <ids-toolbar-section type="buttonset">
        <ids-button class="month-view-btn-previous">
          <ids-text audible="true" translate-text="true">PreviousMonth</ids-text>
          <ids-icon slot="icon" icon="chevron-left"></ids-icon>
        </ids-button>
        <ids-button class="month-view-btn-next">
          <ids-text audible="true" translate-text="true">NextMonth</ids-text>
          <ids-icon slot="icon" icon="chevron-right"></ids-icon>
        </ids-button>
        <span class="datepicker" tabindex="0">
          <ids-text font-size="20" class="datepicker-text">${this.#formatMonthText()}</ids-text>
          <ids-text audible="true" translate-text="true">SelectDay</ids-text>
          <ids-trigger-button>
            <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
            <ids-icon slot="icon" icon="schedule" class="datepicker-icon"></ids-icon>
          </ids-trigger-button>
        </span>
        ${this.showToday ? `
          <ids-button css-class="no-padding" class="month-view-btn-today">
            <ids-text
              class="month-view-today-text"
              font-size="16"
              translate-text="true"
              font-weight="bold"
            >Today</ids-text>
          </ids-button>` : ''}
      </ids-toolbar-section>
    </ids-toolbar>`;

    // Clear/add HTML
    this.container.querySelector('ids-toolbar')?.remove();
    this.container.insertAdjacentHTML('afterbegin', toolbarTemplate);

    // Toolbar events
    this.#attachToolbarEvents();
  }

  /**
   * Add next/previous/today click events when toolbar attached to shadow
   * @private
   */
  #attachToolbarEvents() {
    this.offEvent('click.month-view-previous');
    this.onEvent('click.month-view-previous', this.container.querySelector('.month-view-btn-previous'), () => {
      this.#changeDate('previous');
      this.#attachDatepickerText();
    });

    this.offEvent('click.month-view-next');
    this.onEvent('click.month-view-next', this.container.querySelector('.month-view-btn-next'), () => {
      this.#changeDate('next');
      this.#attachDatepickerText();
    });

    if (this.showToday) {
      this.offEvent('click.month-view-today');
      this.onEvent('click.month-view-today', this.container.querySelector('.month-view-btn-today'), () => {
        this.#changeDate('today');
        this.#attachDatepickerText();
      });
    } else {
      this.offEvent('click.month-view-today');
    }
  }

  /**
   * Helper to format datepicker text in the toolbar
   * @returns {string} locale formatted month year
   * @private
   */
  #formatMonthText() {
    const dayOfMonth = new Date(this.year, this.month);

    return this.locale.formatDate(dayOfMonth, { month: 'long', year: 'numeric' });
  }

  /**
   * Datepicker changing text
   * @private
   */
  #attachDatepickerText() {
    const text = this.#formatMonthText();

    this.container.querySelector('.datepicker-text').innerText = text;
  }

  /**
   * Change month/year by event type
   * @param {'next'|'previous'|'today'} type of event to be called
   * @private
   */
  #changeDate(type) {
    if (type === 'next') {
      this.year = this.month === 11 ? this.year + 1 : this.year;
      this.month = this.month === 11 ? 0 : this.month + 1;
    }

    if (type === 'previous') {
      this.year = this.month === 0 ? this.year - 1 : this.year;
      this.month = this.month === 0 ? 11 : this.month - 1;
    }

    if (type === 'today') {
      this.year = new Date().getFullYear();
      this.month = new Date().getMonth();
    }
  }

  /**
   * Add month HTML to shadow including weekdays header
   * @private
   */
  #renderMonth() {
    // Get locale loaded calendars and days of the week
    const calendars = this.locale.locale.options.calendars;

    if (!calendars) return;

    const days = (calendars || [])[0]?.days.abbreviated;
    const firstDayOfMonth = new Date(this.year, this.month, 1);
    const lastDayOfMonth = new Date(this.year, this.month + 1, 0);
    const firstWeekDay = firstDayOfWeek(firstDayOfMonth, this.firstDayOfWeek);
    const weeksCount = weeksInMonth(this.year, this.month, this.firstDayOfWeek);

    const weekDaysTemplate = days.map((_, index) => {
      const weekday = days[(index + this.firstDayOfWeek) % 7];

      return `
        <th>
          <ids-text
            class="month-view-weekday-text"
            font-size="14"
          >${weekday}</ids-text>
        </th>
      `;
    }).join('');

    const daysTemplate = (week) => Array.from({ length: 7 }).map((_, index) => {
      const date = addDate(firstWeekDay, (week * 7) + index, 'days');
      const dayNumeric = this.locale.formatDate(date, { day: 'numeric' });
      const classes = buildClassAttrib(
        date < firstDayOfMonth && 'alternate prev-month',
        date > lastDayOfMonth && 'alternate next-month'
      );

      return `<td
        aria-label="${this.locale.formatDate(date, { dateStyle: 'full' })}"
        role="link" ${classes}><ids-text class="month-view-day-text" font-size="14"
      >${dayNumeric}</ids-text></td>`;
    }).join('');

    const weeksTemplate = Array.from({ length: weeksCount }).map((_, index) =>
      `<tr>${daysTemplate(index)}</tr>`).join('');

    const container = `<div class="month-view-container">
      <table class="month-view-table" aria-label="${this.locale.translate('Calendar')}" role="application">
        <thead class="month-view-table-header">
          <tr>${weekDaysTemplate}</tr>
        </thead>
        <tbody>${weeksTemplate}</tbody>
      </table>
    </div>`;

    // Clear/add HTML
    this.container.querySelector('.month-view-container')?.remove();
    this.container.insertAdjacentHTML('beforeend', container);
  }

  /**
   * show-today attribute
   * @returns {boolean} showToday param converted to boolean from attribute value
   */
  get showToday() {
    const attrVal = this.getAttribute(attributes.SHOW_TODAY);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the today button should be shown
   * @param {string|boolean|null} val showToday param value
   */
  set showToday(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.SHOW_TODAY, boolVal);
    } else {
      this.removeAttribute(attributes.SHOW_TODAY);
    }

    this.#renderToolbar();
  }

  /**
   * month attribute
   * @returns {number} month param converted to number from attribute value with range (0-11)
   */
  get month() {
    const attrVal = this.getAttribute(attributes.MONTH);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal) && numberVal >= 0 && numberVal <= 11) {
      return numberVal;
    }

    // Default is current month
    return new Date().getMonth();
  }

  /**
   * Set month param and render month table/toolbar
   * @param {string|number|null} val month param value
   */
  set month(val) {
    if (val !== null) {
      this.setAttribute(attributes.MONTH, val);
    } else {
      this.removeAttribute(attributes.MONTH);
    }

    this.#renderMonth();
    this.#renderToolbar();
  }

  /**
   * year attribute
   * @returns {number} year param converted to number from attribute value with 4-digit check
   */
  get year() {
    const attrVal = this.getAttribute(attributes.YEAR);
    const numberVal = stringToNumber(attrVal);

    if (attrVal && attrVal.length === 4) {
      return numberVal;
    }

    // Default is current year
    return new Date().getFullYear();
  }

  /**
   * Set year param and render month table/toolbar
   * @param {string|number|null} val year param value
   */
  set year(val) {
    if (val) {
      this.setAttribute(attributes.YEAR, val);
    } else {
      this.removeAttribute(attributes.YEAR);
    }

    this.#renderMonth();
    this.#renderToolbar();
  }

  /**
   * fist-day-of-week attribute
   * @returns {number} firstDayOfWeek param converted to number from attribute value with range (0-6)
   */
  get firstDayOfWeek() {
    const attrVal = this.getAttribute(attributes.FIRST_DAY_OF_WEEK);
    const numberVal = stringToNumber(attrVal);

    if (attrVal && numberVal >= 0 && numberVal <= 6) {
      return numberVal;
    }

    // Default value
    return 0;
  }

  /**
   * Set first day of the week (0-6)
   * @param {string|number|null} val firstDayOfWeek param value
   */
  set firstDayOfWeek(val) {
    if (val !== null) {
      this.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
    } else {
      this.removeAttribute(attributes.FIRST_DAY_OF_WEEK);
    }

    this.#renderMonth();
    this.#renderToolbar();
  }

  /**
   * Set the direction attribute
   */
  #setDirection() {
    if (this.locale?.isRTL()) {
      this.setAttribute('dir', 'rtl');
    } else {
      this.removeAttribute('dir');
    }
  }
}

export default IdsMonthView;

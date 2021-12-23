import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-month-view-base';

// Import Utils
import {
  addDate,
  firstDayOfWeek,
  weeksInMonth,
  firstDayOfMonth,
  lastDayOfMonth
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

const MIN_MONTH = 0;
const MAX_MONTH = 11;
const WEEK_LENGTH = 7;

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
   * Change month/year/day by event type
   * @param {'next'|'previous'|'today'} type of event to be called
   * @private
   */
  #changeDate(type) {
    if (type === 'next') {
      this.year = this.month === MAX_MONTH ? this.year + 1 : this.year;
      this.month = this.month === MAX_MONTH ? MIN_MONTH : this.month + 1;
    }

    if (type === 'previous') {
      this.year = this.month === MIN_MONTH ? this.year - 1 : this.year;
      this.month = this.month === MIN_MONTH ? MAX_MONTH : this.month - 1;
    }

    if (type === 'today') {
      const now = new Date();

      this.day = now.getDate();
      this.year = now.getFullYear();
      this.month = now.getMonth();
    }
  }

  /**
   *
   * @param {number} weekIndex number of week in month starting from 0
   * @returns {string} table cell template
   */
  #getCellTemplate(weekIndex) {
    const firstDay = firstDayOfMonth(this.year, this.month, this.day, this.locale.isIslamic());
    const lastDay = lastDayOfMonth(this.year, this.month, this.day, this.locale.isIslamic());
    const rangeStartsOn = firstDayOfWeek(firstDay, this.firstDayOfWeek);

    return Array.from({ length: WEEK_LENGTH }).map((_, index) => {
      const date = addDate(rangeStartsOn, (weekIndex * WEEK_LENGTH) + index, 'days');
      const dayNumeric = this.locale.formatDate(date, { day: 'numeric', numberingSystem: 'latn' });
      const ariaLabel = this.locale.formatDate(date, { dateStyle: 'full' });
      const isSelected = date.getDate() === this.day
        && date.getFullYear() === this.year
        && date.getMonth() === this.month;
      const classes = buildClassAttrib(
        (date < firstDay || date > lastDay) && 'alternate',
        isSelected && 'is-selected'
      );
      const selectedAttr = isSelected ? 'aria-selected="true" tabindex="0" role="gridcell"' : 'role="link"';
      const dataAttr = [
        `data-year="${date.getFullYear()}"`,
        `data-month="${date.getMonth()}"`,
        `data-day="${date.getDate()}"`
      ].join(' ');

      return `<td aria-label="${ariaLabel}" ${dataAttr} ${classes} ${selectedAttr}>
        <ids-text
          aria-hidden="true"
          class="month-view-day-text"
          font-size="14"
        >${dayNumeric}</ids-text>
      </td>`;
    }).join('');
  }

  /**
   * Add month HTML to shadow including weekdays header
   * @private
   */
  #renderMonth() {
    // Get locale loaded calendars and days of the week
    const calendars = this.locale.locale.options.calendars;

    if (!calendars) return;

    // const weekDays = (calendars || [])[0]?.days.abbreviated;
    const weekDays = calendars[0].days.abbreviated;

    const weekDaysTemplate = weekDays.map((_, index) => {
      const weekday = weekDays[(index + this.firstDayOfWeek) % WEEK_LENGTH];

      return `
        <th>
          <ids-text
            class="month-view-weekday-text"
            font-size="14"
          >${weekday}</ids-text>
        </th>
      `;
    }).join('');

    const weeksCount = weeksInMonth(this.year, this.month, this.day, this.firstDayOfWeek, this.locale.isIslamic());

    const rowsTemplate = Array.from({ length: weeksCount }).map((_, weekIndex) =>
      `<tr>${this.#getCellTemplate(weekIndex)}</tr>`).join('');

    const container = `<div class="month-view-container">
      <table class="month-view-table" aria-label="${this.locale.translate('Calendar')}" role="application">
        <thead class="month-view-table-header">
          <tr>${weekDaysTemplate}</tr>
        </thead>
        <tbody>${rowsTemplate}</tbody>
      </table>
    </div>`;

    // Clear/add HTML
    this.container.querySelector('.month-view-container')?.remove();
    this.container.insertAdjacentHTML('beforeend', container);

    // Related events
    this.offEvent('click.month-view-select');
    this.onEvent('click.month-view-select', this.container.querySelector('tbody'), (e) => {
      if (
        e.target.getAttribute('role') === 'link'
        && !e.target.classList.contains('is-selected')
        && !e.target.classList.contains('is-disabled')
      ) {
        const { month, year, day } = e.target.dataset;

        this.#selectDay(stringToNumber(year), stringToNumber(month), stringToNumber(day));
      }
    });
  }

  /**
   *
   * @param {number} year
   * @param {number} month
   * @param {number} day
   */
  #selectDay(year, month, day) {
    if (day !== this.day) {
      this.day = day;
    }

    if (month !== this.month) {
      this.year = year;
      this.month = month;
    }

    const clearable = this.container.querySelector('td.is-selected');

    // Clear before
    clearable?.removeAttribute('aria-selected');
    clearable?.removeAttribute('tabindex');
    clearable?.setAttribute('role', 'link');
    clearable?.classList.remove('is-selected');

    const selectedQuery = `td[data-year="${year}"][data-month="${month}"][data-day="${day}"]`;
    const selected = this.container.querySelector(selectedQuery);

    // Selectable attributes
    selected?.setAttribute('tabindex', 0);
    selected?.setAttribute('aria-selected', true);
    selected?.setAttribute('role', 'gridcell');
    selected?.classList.add('is-selected');
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
   * @returns {number} month param converted to number from attribute value with range (MIN_MONTH - MAX_MONTH)
   */
  get month() {
    const attrVal = this.getAttribute(attributes.MONTH);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal) && numberVal >= MIN_MONTH && numberVal <= MAX_MONTH) {
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

  get day() {
    const attrVal = this.getAttribute(attributes.DAY);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal)) {
      return numberVal;
    }

    // Default is current day
    return new Date().getDate();
  }

  set day(val) {
    if (val) {
      this.setAttribute(attributes.DAY, val);
      this.#selectDay(this.year, this.month, stringToNumber(val));
    } else {
      this.removeAttribute(attributes.DAY);
      this.#selectDay(this.year, this.month, this.day);
    }
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

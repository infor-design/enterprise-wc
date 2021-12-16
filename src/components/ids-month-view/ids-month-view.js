import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

// Import Utils
import {
  IdsStringUtils as stringUtils,
  IdsDateUtils as dateUtils
} from '../../utils';

// Supporting components
import IdsButton from '../ids-button';
import IdsIcon from '../ids-icon';
import IdsText from '../ids-text';
import IdsToolbar from '../ids-toolbar';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';

// Import Mixins
import {
  IdsEventsMixin,
  IdsLocaleMixin,
  IdsThemeMixin
} from '../../mixins';

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
class IdsMonthView extends mix(IdsElement).with(IdsLocaleMixin, IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachEventHandlers();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.END_DATE,
      attributes.FIRST_DAY_OF_WEEK,
      attributes.SHOW_TODAY,
      attributes.START_DATE,
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
  attachEventHandlers() {
    // Respond to parent changing language
    this.offEvent('languagechange.month-view-container');
    this.onEvent('languagechange.month-view-container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
    });

    // Respond to parent changing locale
    this.offEvent('localechange.month-view-container');
    this.onEvent('localechange.month-view-container', this.closest('ids-container'), async (e) => {
      await this.setLocale(e.detail.locale.name);
    });

    // Respond to the element changing language
    this.offEvent('languagechange.month-view');
    this.onEvent('languagechange.month-view', this, async (e) => {
      await this.locale.setLanguage(e.detail.language.name);

      this.#renderToolbar();
      this.#renderMonth();
    });

    // Respond to the element changing locale
    this.offEvent('localechange.month-view');
    this.onEvent('localechange.month-view', this, async (e) => {
      if (!e.detail.locale.name) {
        return;
      }

      await this.locale.setLocale(e.detail.locale.name);

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
          <ids-text font-size="20" class="datepicker-text">${this.#formatMonthRange()}</ids-text>
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
   * Helper to format startDate/endDate to month range
   * @returns {string} locale formatted month range
   */
  #formatMonthRange() {
    const startMonth = this.locale.formatDate(this.startDate, { month: 'long' });
    const endMonth = this.locale.formatDate(this.endDate, { month: 'long' });
    const startYear = this.locale.formatDate(this.startDate, { year: 'numeric' });
    const endYear = this.locale.formatDate(this.endDate, { year: 'numeric' });

    if (endYear !== startYear) {
      return `${this.locale.formatDate(this.startDate, {
        month: 'short',
        year: 'numeric',
      })} - ${this.locale.formatDate(this.endDate, {
        month: 'short',
        year: 'numeric',
      })}`;
    }

    if (endMonth !== startMonth) {
      return `${this.locale.formatDate(this.startDate, { month: 'short' })} - ${endMonth} ${startYear}`;
    }

    return this.locale.formatDate(this.startDate, { month: 'long', year: 'numeric' });
  }

  /**
   * Datepicker changing text
   * @private
   */
  #attachDatepickerText() {
    const text = this.#formatMonthRange();

    this.container.querySelector('.datepicker-text').innerText = text;
  }

  /**
   * Change startDate/endDate by event type
   * @param {'next'|'previous'|'today'} type of event to be called
   * @private
   */
  #changeDate(type) {
    const daysDiff = dateUtils.daysDiff(this.startDate, this.endDate);
    const hasIrregularDays = daysDiff !== 7;

    if (type === 'next') {
      this.startDate = dateUtils.add(this.startDate, daysDiff, 'days');
      this.endDate = dateUtils.add(this.endDate, daysDiff - 1, 'days');
    }

    if (type === 'previous') {
      this.startDate = dateUtils.subtract(this.startDate, daysDiff, 'days');
      this.endDate = dateUtils.subtract(this.endDate, daysDiff + 1, 'days');
    }

    if (type === 'today') {
      this.startDate = hasIrregularDays ? new Date() : dateUtils.firstDayOfWeek(new Date(), this.firstDayOfWeek);
      this.endDate = dateUtils.add(this.startDate, daysDiff - 1, 'days');
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

    const daysTemplate = days.map((item, index) => {
      const weekday = days[(index + this.firstDayOfWeek) % 7];

      return `
        <th>
          <ids-text
            class="month-view-header-day-of-week"
            font-size="14"
          >${weekday}</ids-text>
        </th>
      `;
    }).join('');

    const monthTemplate = `<div class="month-view-container">
      <table class="month-view-table" aria-label="${this.locale.translate('Calendar')}" role="application">
        <thead class="month-view-table-header">
          <tr>${daysTemplate}</tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>`;

    // Clear/add HTML
    this.container.querySelector('.month-view-container')?.remove();
    this.container.insertAdjacentHTML('beforeend', monthTemplate);
  }

  /**
   * show-today attribute
   * @returns {boolean} showToday param converted to boolean from attribute value
   */
  get showToday() {
    const attrVal = this.getAttribute(attributes.SHOW_TODAY);

    return stringUtils.stringToBool(attrVal);
  }

  /**
   * Set whether or not the today button should be shown
   * @param {string|boolean|null} val showToday param value
   */
  set showToday(val) {
    const boolVal = stringUtils.stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.SHOW_TODAY, boolVal);
    } else {
      this.removeAttribute(attributes.SHOW_TODAY);
    }

    this.#renderToolbar();
  }

  /**
   * start-date attribute
   * @returns {Date} startDate date parsed from attribute value
   */
  get startDate() {
    const attrVal = this.getAttribute(attributes.START_DATE);
    const attrDate = new Date(attrVal);

    if (attrVal && dateUtils.isValidDate(attrDate)) {
      return attrDate;
    }

    // If no start-date attribute is set or not valid date
    // set startDate as first day of the week from current date
    return dateUtils.firstDayOfWeek(new Date(), this.firstDayOfWeek);
  }

  /**
   * Set start of the week to show
   * @param {string|null} val startDate param value
   */
  set startDate(val) {
    if (val) {
      this.setAttribute(attributes.START_DATE, val);
    } else {
      this.removeAttribute(attributes.START_DATE);
    }

    this.#renderMonth();
    this.#renderToolbar();
  }

  /**
   * end-date attribute
   * @returns {Date} endDate date parsed from attribute value
   */
  get endDate() {
    const attrVal = this.getAttribute(attributes.END_DATE);
    const attrDate = new Date(attrVal);

    if (attrVal && dateUtils.isValidDate(attrDate)) {
      // Adding one day to include end date to the range
      return dateUtils.add(attrDate, 1, 'days');
    }

    // If no end-date attribute is set or not valid date
    // set endDate as last day of the week from current date
    return dateUtils.lastDayOfWeek(new Date(), this.firstDayOfWeek);
  }

  /**
   * Set end of the week to show
   * @param {string|null} val endDate param value
   */
  set endDate(val) {
    if (val) {
      this.setAttribute(attributes.END_DATE, val);
    } else {
      this.removeAttribute(attributes.END_DATE);
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
    const numberVal = stringUtils.stringToNumber(attrVal);

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
    if (val) {
      this.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
    } else {
      this.removeAttribute(attributes.FIRST_DAY_OF_WEEK);
    }

    this.#renderMonth();
    this.#renderToolbar();
  }
}

export default IdsMonthView;

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

// Import Mixins
import {
  IdsEventsMixin,
  IdsLocaleMixin,
  IdsThemeMixin
} from '../../mixins';

// Import Styles
import styles from './ids-week-view.scss';

/**
 * IDS Week View Component
 * @type {IdsWeekView}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-week-view')
@scss(styles)
class IdsWeekView extends mix(IdsElement).with(IdsLocaleMixin, IdsEventsMixin, IdsThemeMixin) {
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
      attributes.END_HOUR,
      attributes.FIRST_DAY_OF_WEEK,
      attributes.SHOW_TODAY,
      attributes.START_DATE,
      attributes.START_HOUR
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-week-view"></div>`;
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   */
  attachEventHandlers() {
    // Respond to parent changing language
    this.offEvent('languagechange.week-view-container');
    this.onEvent('languagechange.week-view-container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
    });

    // Respond to parent changing locale
    this.offEvent('localechange.week-view-container');
    this.onEvent('localechange.week-view-container', this.closest('ids-container'), async (e) => {
      await this.setLocale(e.detail.locale.name);
    });

    // Respond to the element changing language
    this.offEvent('languagechange.week-view');
    this.onEvent('languagechange.week-view', this, async (e) => {
      await this.locale.setLanguage(e.detail.language.name);

      this.#renderToolbar();
      this.#renderWeek();
    });

    // Respond to the element changing locale
    this.offEvent('localechange.week-view');
    this.onEvent('localechange.week-view', this, async (e) => {
      if (!e.detail.locale.name) {
        return;
      }

      await this.locale.setLocale(e.detail.locale.name);

      this.#renderWeek();
    });

    return this;
  }

  #renderToolbar() {
    const toolbarTemplate = `<ids-toolbar>
      <ids-toolbar-section type="buttonset">
        <ids-button part="previous">
          <ids-text audible="true" translate-text="true">PreviousMonth</ids-text>
          <ids-icon slot="icon" icon="chevron-left"></ids-icon>
        </ids-button>
        <ids-button part="next">
          <ids-text audible="true" translate-text="true">NextMonth</ids-text>
          <ids-icon slot="icon" icon="chevron-right"></ids-icon>
        </ids-button>
        ${this.showToday ? `
          <ids-button part="today">
            <ids-text font-size="16" translate-text="true">Today</ids-text>
          </ids-button>` : ''}
      </ids-toolbar-section>
    </ids-toolbar>`;

    this.container.querySelector('ids-toolbar')?.remove();
    this.container.insertAdjacentHTML('afterbegin', toolbarTemplate);
    this.#attachToolbarEvents();
  }

  #attachToolbarEvents() {
    this.offEvent('click.week-view-previous');
    this.onEvent('click.week-view-previous', this.container.querySelector('[part="previous"]'), () => {
      this.#changeDate('previous');
    });

    this.offEvent('click.week-view-next');
    this.onEvent('click.week-view-next', this.container.querySelector('[part="next"]'), () => {
      this.#changeDate('next');
    });

    if (this.showToday) {
      this.offEvent('click.week-view-today');
      this.onEvent('click.week-view-today', this.container.querySelector('[part="today"]'), () => {
        this.#changeDate('today');
      });
    } else {
      this.offEvent('click.week-view-today');
    }
  }

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

  #renderWeek() {
    const daysDiff = dateUtils.daysDiff(this.startDate, this.endDate);
    const hoursDiff = this.endHour - this.startHour;
    const daysTemplate = Array.from({ length: daysDiff }, (_, index) => {
      const date = this.startDate.setDate(this.startDate.getDate() + index);
      const dayNumeric = this.locale.formatDate(date, { day: 'numeric' });
      const weekday = this.locale.formatDate(date, { weekday: 'short' });
      const isToday = dateUtils.isToday(new Date(date));

      return `
        <th>
          <div class="week-view-header-wrapper${isToday ? ' is-today' : ''}">
            <ids-text font-size="20"${isToday ? ' font-weight="bold"' : ''}>${dayNumeric}</ids-text>
            <ids-text font-size="16"${isToday ? ' font-weight="bold"' : ''}>${weekday}</ids-text>
          </div>
          <div class="week-view-all-day-wrapper"></div>
        </th>
      `;
    }).join('');

    const cellTemplate = Array.from({ length: daysDiff }).map(() => `
      <td>
        <div class="week-view-cell-wrapper"></div>
      </td>
    `).join('');

    const hoursTemplate = Array.from({ length: hoursDiff }).map((_, index) => `
      <tr class="week-view-hour-row">
        <td>
          <div class="week-view-cell-wrapper">
            <ids-text font-size="12">${this.locale.formatHour(this.startHour + index)}</ids-text>
          </div>
        </td>
        ${cellTemplate}
      </tr>
      <tr class="week-view-half-hour-row">
        <td>
          <div class="week-view-cell-wrapper"></div>
        </td>
        ${cellTemplate}
      </tr>
    `).join('');

    const weekTemplate = `<div class="week-view-container">
      <table class="week-view-table">
        <thead class="week-view-table-header">
          <tr>
            <th>
              <div class="week-view-header-wrapper">
                <ids-text translate-text="true" audible="true">Hour</ids-text>
              </div>
              <div class="week-view-all-day-wrapper">
                <ids-text font-size="12" translate-text="true">AllDay</ids-text>
              </div>
            </th>
            ${daysTemplate}
          </tr>
        </thead>
        <tbody>
          ${hoursTemplate}
        </tbody>
      </table>
    </div>`;

    this.container.querySelector('.week-view-container')?.remove();
    this.container.insertAdjacentHTML('beforeend', weekTemplate);
  }

  /**
   * show-today attribute
   * @returns {boolean} showToday attribute value converted to boolean
   */
  get showToday() {
    const attrVal = this.getAttribute(attributes.SHOW_TODAY);

    return stringUtils.stringToBool(attrVal);
  }

  /**
   * Set whether or not the today button should be shown
   * @param {string|boolean|null} val showToday attribute value
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

  set startDate(val) {
    if (val) {
      this.setAttribute(attributes.START_DATE, val);
    } else {
      this.removeAttribute(attributes.START_DATE);
    }

    this.#renderWeek();
  }

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

  set endDate(val) {
    if (val) {
      this.setAttribute(attributes.END_DATE, val);
    } else {
      this.removeAttribute(attributes.END_DATE);
    }

    this.#renderWeek();
  }

  get firstDayOfWeek() {
    const attrVal = this.getAttribute(attributes.FIRST_DAY_OF_WEEK);
    const numberVal = stringUtils.stringToNumber(attrVal);

    if (attrVal && numberVal >= 0 && numberVal <= 6) {
      return numberVal;
    }

    return 0;
  }

  set firstDayOfWeek(val) {
    if (val) {
      this.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
    } else {
      this.removeAttribute(attributes.FIRST_DAY_OF_WEEK);
    }

    this.#renderWeek();
  }

  get startHour() {
    const attrVal = this.getAttribute(attributes.START_HOUR);
    const numberVal = stringUtils.stringToNumber(attrVal);

    if (attrVal && numberVal >= 0 && numberVal <= 24) {
      return numberVal;
    }

    return 7;
  }

  set startHour(val) {
    if (val) {
      this.setAttribute(attributes.START_HOUR, val);
    } else {
      this.removeAttribute(attributes.START_HOUR);
    }

    this.#renderWeek();
  }

  get endHour() {
    const attrVal = this.getAttribute(attributes.END_HOUR);
    const numberVal = stringUtils.stringToNumber(attrVal);

    if (attrVal && numberVal >= 0 && numberVal <= 24) {
      return numberVal;
    }

    return 19;
  }

  set endHour(val) {
    if (val) {
      this.setAttribute(attributes.END_HOUR, val);
    } else {
      this.removeAttribute(attributes.END_HOUR);
    }

    this.#renderWeek();
  }
}

export default IdsWeekView;

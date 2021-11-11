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
import IdsIcon from '../ids-icon';
import IdsText from '../ids-text';

// Import Mixins
import {
  IdsThemeMixin,
  IdsLocaleMixin,
  IdsEventsMixin
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
      attributes.FIRST_DAY_OF_WEEK,
      attributes.SHOW_TODAY,
      attributes.START_DATE
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return '<div class="ids-week-view"></div>';
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

      this.#render();
    });

    // Respond to the element changing locale
    this.offEvent('localechange.week-view');
    this.onEvent('localechange.week-view', this, async (e) => {
      if (!e.detail.locale.name) {
        return;
      }

      await this.locale.setLocale(e.detail.locale.name);

      this.#render();
    });

    return this;
  }

  #render() {
    const daysDiff = dateUtils.daysDiff(this.startDate, this.endDate);
    const daysHeader = Array.from({ length: daysDiff }, (_, index) => {
      const day = this.startDate.setDate(this.startDate.getDate() + index);
      const dayNumeric = this.locale.formatDate(day, { day: 'numeric' });
      const weekday = this.locale.formatDate(day, { weekday: 'short' });
      const isToday = dateUtils.isToday(new Date(day));

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

    const layout = `<div class="week-view-container">
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
            ${daysHeader}
          </tr>
        </thead>
        <tbody>
          ${Array.from({ length: 12 }).map(() => `
            <tr class="week-view-hour-row">
              <td>
                <div class="week-view-cell-wrapper"><ids-text font-size="12">7:00 AM</ids-text></div>
              </td>
              ${Array.from({ length: daysDiff }).map(() => `
                <td>
                  <div class="week-view-cell-wrapper"></div>
                </td>
              `).join('')}
            </tr>
            <tr class="week-view-half-hour-row">
              <td>
                <div class="week-view-cell-wrapper"></div>
              </td>
              ${Array.from({ length: daysDiff }).map(() => `
                <td>
                  <div class="week-view-cell-wrapper"></div>
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;

    this.container.querySelector('.week-view-container')?.remove();
    this.container.insertAdjacentHTML('beforeend', layout);
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

      return;
    }

    this.removeAttribute(attributes.SHOW_TODAY);
  }

  get startDate() {
    const attrVal = this.getAttribute(attributes.START_DATE);
    const attrDate = new Date(attrVal);

    if (attrVal && dateUtils.isValidDate(attrDate)) {
      return attrDate;
    }

    // If no start-date attribute is set or not valid
    // set startDate as first day of the week from current date
    return dateUtils.firstDayOfWeek(new Date(), this.firstDayOfWeek);
  }

  set startDate(val) {
    if (val) {
      this.setAttribute(attributes.START_DATE, val);
    } else {
      this.removeAttribute(attributes.START_DATE);
    }

    this.#render();
  }

  get endDate() {
    const attrVal = this.getAttribute(attributes.END_DATE);
    const attrDate = new Date(attrVal);

    if (attrVal && dateUtils.isValidDate(attrDate)) {
      return attrDate;
    }

    // If no end-date attribute is set or not valid
    // set endDate as last day of the week from current date
    return dateUtils.lastDayOfWeek(new Date(), this.firstDayOfWeek);
  }

  set endDate(val) {
    if (val) {
      this.setAttribute(attributes.END_DATE, val);
    } else {
      this.removeAttribute(attributes.END_DATE);
    }

    this.#render();
  }

  get firstDayOfWeek() {
    const attrVal = this.getAttribute(attributes.FIRST_DAY_OF_WEEK);
    const numberVal = stringUtils.stringToNumber(attrVal);

    if (numberVal >= 0 && numberVal <= 6) {
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

    this.#render();
  }
}

export default IdsWeekView;

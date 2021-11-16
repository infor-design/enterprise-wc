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
import { renderLoop, IdsRenderLoopItem } from '../ids-render-loop';

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
 * @mixes IdsEventsMixin
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
      attributes.SHOW_TIMELINE,
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
      this.#renderTimeline();
    });

    // Respond to the element changing locale
    this.offEvent('localechange.week-view');
    this.onEvent('localechange.week-view', this, async (e) => {
      if (!e.detail.locale.name) {
        return;
      }

      await this.locale.setLocale(e.detail.locale.name);

      this.#renderWeek();
      this.#renderTimeline();
    });

    return this;
  }

  /**
   * Add toolbar HTML to shadow
   */
  #renderToolbar() {
    const toolbarTemplate = `<ids-toolbar>
      <ids-toolbar-section type="buttonset">
        <ids-button class="week-view-btn-previous">
          <ids-text audible="true" translate-text="true">PreviousMonth</ids-text>
          <ids-icon slot="icon" icon="chevron-left"></ids-icon>
        </ids-button>
        <ids-button class="week-view-btn-next">
          <ids-text audible="true" translate-text="true">NextMonth</ids-text>
          <ids-icon slot="icon" icon="chevron-right"></ids-icon>
        </ids-button>
        ${this.showToday ? `
          <ids-button class="week-view-btn-today">
            <ids-text
              class="week-view-today-text"
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
   */
  #attachToolbarEvents() {
    this.offEvent('click.week-view-previous');
    this.onEvent('click.week-view-previous', this.container.querySelector('.week-view-btn-previous'), () => {
      this.#changeDate('previous');
    });

    this.offEvent('click.week-view-next');
    this.onEvent('click.week-view-next', this.container.querySelector('.week-view-btn-next'), () => {
      this.#changeDate('next');
    });

    if (this.showToday) {
      this.offEvent('click.week-view-today');
      this.onEvent('click.week-view-today', this.container.querySelector('.week-view-btn-today'), () => {
        this.#changeDate('today');
      });
    } else {
      this.offEvent('click.week-view-today');
    }
  }

  /**
   * Change startDate/endDate by event type
   * @param {'next'|'previous'|'today'} type of event to be called
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
   * Add week HTML to shadow including day/weekday header, hour rows, event cells
   */
  #renderWeek() {
    const daysDiff = dateUtils.daysDiff(this.startDate, this.endDate);
    const hoursDiff = this.endHour - this.startHour + 1;
    const isDayView = daysDiff === 1 || daysDiff === 0;
    // Get locale loaded calendars and dayOfWeek calendar setting
    const calendars = this.locale.locale.options.calendars;
    const dayOfWeekSetting = (calendars || [])[0]?.dateFormat?.dayOfWeek;
    // Determinate day/weekday order based on calendar settings (d EEE or EEE)
    const emphasis = dayOfWeekSetting && dayOfWeekSetting.split(' ')[0] === 'EEE';
    // Helper to define day/weekday font sizes
    const getTextFontSize = (isHeading) => {
      if (!isHeading) return 16;

      return isDayView ? 32 : 20;
    };
    const daysTemplate = Array.from({ length: daysDiff }, (_, index) => {
      const date = this.startDate.setDate(this.startDate.getDate() + index);
      const dayNumeric = this.locale.formatDate(date, { day: 'numeric' });
      const weekday = this.locale.formatDate(date, { weekday: 'short' });
      const isToday = dateUtils.isToday(new Date(date));

      return `
        <th>
          <div class="week-view-header-wrapper${isToday ? ' is-today' : ''}${isDayView ? ' is-day-view' : ''}">
            <ids-text
              class="week-view-header-day-of-week${emphasis ? '' : ' is-emphasis'}"
              font-size="${getTextFontSize(!emphasis)}"
              ${isToday ? 'font-weight="bold"' : ''}
            >${emphasis ? weekday : dayNumeric}</ids-text>
            <ids-text
              class="week-view-header-day-of-week${emphasis ? ' is-emphasis' : ''}"
              font-size="${getTextFontSize(emphasis)}"
              ${isToday ? 'font-weight="bold"' : ''}
            >${emphasis ? dayNumeric : weekday}</ids-text>
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
            <ids-text font-size="12">${calendars ? this.locale.formatHour(this.startHour + index) : ''}</ids-text>
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
              <div class="week-view-header-wrapper${isDayView ? ' is-day-view' : ''}">
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

    // Clear/add HTML
    this.container.querySelector('.week-view-container')?.remove();
    this.container.insertAdjacentHTML('beforeend', weekTemplate);
  }

  /**
   * Add/remove timeline HTML to hour row
   * Update timeline position every 30 seconds
   */
  #renderTimeline() {
    // Clear before rerender
    this.container.querySelectorAll('.week-view-time-marker')
      .forEach((item) => item.remove());

    if (this.timer) this.timer.destroy(true);

    if (!this.showTimeline) {
      return;
    }

    // Add timeline element
    this.container.querySelectorAll('.week-view-hour-row:nth-child(1) td')
      .forEach((item) => item.insertAdjacentHTML(
        'afterbegin',
        '<div class="week-view-time-marker"></div>'
      ));

    // Add/remove timeline based on current hour and startHour/endHour parameters
    const setTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();
      const diff = hours - this.startHour + (mins / 60);

      // 53 is the size of one whole hour (25 + two borders)
      this.container.querySelector('.week-view-hour-row').style = `--timeline-shift: ${diff * 52}px`;
    };

    setTime();

    // Update timeline top shift every 30 seconds
    this.timer = new IdsRenderLoopItem({
      id: 'week-view-timer',
      updateDuration: 30000,
      updateCallback() {
        setTime();
      }
    });

    renderLoop.register(this.timer);
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

    this.#renderWeek();
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

    this.#renderWeek();
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

    this.#renderWeek();
  }

  /**
   * start-hour attribute
   * @returns {number} startHour param converted to number from attribute value with range (0-24)
   */
  get startHour() {
    const attrVal = this.getAttribute(attributes.START_HOUR);
    const numberVal = stringUtils.stringToNumber(attrVal);

    if (attrVal && numberVal >= 0 && numberVal <= 24) {
      return numberVal;
    }

    // Default value
    return 7;
  }

  /**
   * Set start hour of the day (0-24)
   * @param {string|number|null} val startHour param value
   */
  set startHour(val) {
    if (val) {
      this.setAttribute(attributes.START_HOUR, val);
    } else {
      this.removeAttribute(attributes.START_HOUR);
    }

    this.#renderWeek();
    this.#renderTimeline();
  }

  /**
   * end-hour attribute
   * @returns {number} endHour param converted to number from attribute value with range (0-24)
   */
  get endHour() {
    const attrVal = this.getAttribute(attributes.END_HOUR);
    const numberVal = stringUtils.stringToNumber(attrVal);

    if (attrVal && numberVal >= 0 && numberVal <= 24) {
      return numberVal;
    }

    // Default value
    return 19;
  }

  /**
   * Set end hour of the day (0-24)
   * @param {string|number|null} val endHour param value
   */
  set endHour(val) {
    if (val) {
      this.setAttribute(attributes.END_HOUR, val);
    } else {
      this.removeAttribute(attributes.END_HOUR);
    }

    this.#renderWeek();
    this.#renderTimeline();
  }

  /**
   * show-timeline attribute
   * @returns {boolean} showTimeline param converted to boolean from attribute value
   */
  get showTimeline() {
    const attrVal = this.getAttribute(attributes.SHOW_TIMELINE);

    if (attrVal) {
      return stringUtils.stringToBool(attrVal);
    }

    // Default value
    return true;
  }

  /**
   * Set whether or not to show a bar across the current time
   * @param {string|boolean|null} val showTimeline param value
   */
  set showTimeline(val) {
    const boolVal = stringUtils.stringToBool(val);
    this.setAttribute(attributes.SHOW_TIMELINE, boolVal);

    this.#renderTimeline();
  }
}

export default IdsWeekView;

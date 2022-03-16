import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-date-picker-base';

import {
  buildClassAttrib,
  stringToBool,
  stringToNumber
} from '../../utils/ids-string-utils/ids-string-utils';
import { addDate, subtractDate } from '../../utils/ids-date-utils/ids-date-utils';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

// Supporting components
import IdsButton from '../ids-button/ids-button';
import IdsToggleButton from '../ids-toggle-button/ids-toggle-button';
import IdsExpandableArea from '../ids-expandable-area/ids-expandable-area';
import IdsDropdown from '../ids-dropdown/ids-dropdown';
import IdsIcon from '../ids-icon/ids-icon';
import IdsInput from '../ids-input/ids-input';
// eslint-disable-next-line import/no-cycle
import IdsMonthView from '../ids-month-view/ids-month-view';
import IdsPopup from '../ids-popup/ids-popup';
import IdsText from '../ids-text/ids-text';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';

// Import Styles
import styles from './ids-date-picker.scss';

const MIN_MONTH = 0;
const MAX_MONTH = 11;

/**
 * IDS Date Picker Component
 * @type {IdsDatePicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @part container - the container of the component
 * @part trigger-field - the trigger container
 * @part trigger-button - the trigger button
 * @part icon - the icon in the trigger button
 * @part input - the input element
 * @part popup - the popup with calendar
 * @part footer - footer of the popup
 * @part start-button - clear/cancel button in the popup footer
 * @part end-button - apply button in the popup footer
 */
@customElement('ids-date-picker')
@scss(styles)
class IdsDatePicker extends Base {
  constructor() {
    super();
  }

  /**
   * Elements for internal usage
   * @private
   */
  #monthView = this.container.querySelector('ids-month-view');

  #popup = this.container.querySelector('ids-popup');

  #triggerButton = this.container.querySelector('ids-trigger-button');

  #triggerField = this.container.querySelector('ids-trigger-field');

  connectedCallback() {
    this.#attachEventHandlers();
    this.#attachExpandedListener();
    this.#attachKeyboardListeners();
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
      attributes.DISABLED,
      attributes.EXPANDED,
      attributes.FIRST_DAY_OF_WEEK,
      attributes.FORMAT,
      attributes.ID,
      attributes.IS_CALENDAR_TOOLBAR,
      attributes.IS_DROPDOWN,
      attributes.LABEL,
      attributes.MONTH,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.SHOW_TODAY,
      attributes.SIZE,
      attributes.TABBABLE,
      attributes.VALIDATE,
      attributes.VALIDATION_EVENTS,
      attributes.VALUE,
      attributes.YEAR,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const classAttr = buildClassAttrib(
      'ids-date-picker',
      this.isCalendarToolbar && 'is-calendar-toolbar',
      this.isDropdown && 'is-dropdown'
    );

    return `
      <div ${classAttr} ${this.isCalendarToolbar ? ' tabindex="0"' : ''} part="container">
        ${this.isCalendarToolbar ? `
          <ids-text font-size="20" class="datepicker-text">${this.value}</ids-text>
          <ids-text audible="true" translate-text="true">SelectDay</ids-text>
          <ids-trigger-button>
            <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
            <ids-icon slot="icon" icon="schedule" class="datepicker-icon"></ids-icon>
          </ids-trigger-button>
        ` : ``}
        ${this.isDropdown ? `
          <ids-toggle-button icon-off="dropdown" icon-align="end" class="dropdown-btn">
            <ids-icon slot="icon" icon="dropdown" class="dropdown-btn-icon"></ids-icon>
            <ids-text slot="text" class="dropdown-btn-text" font-size="20">${this.value}</ids-text>
          </ids-toggle-button>
          <ids-expandable-area type="toggle-btn" expanded="${this.expanded}">
            <div class="picklist" slot="pane" role="application"></div>
          </ids-expandable-area>
        ` : ''}
        ${(!(this.isDropdown || this.isCalendarToolbar)) ? `
          <ids-trigger-field
            part="trigger-field"
            mask="date"
            ${this.id ? `id="${this.id}"` : ''}
            ${this.label ? `label="${this.label}"` : ''}
            placeholder="${this.placeholder}"
            size="${this.size}"
            ${this.validate ? `validate="${this.validate}"` : ''}
            value="${this.value}"
          >
            <ids-trigger-button slot="trigger-end" part="trigger-button">
              <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
              <ids-icon part="icon" slot="icon" icon="schedule"></ids-icon>
            </ids-trigger-button>
          </ids-trigger-field>
        ` : ``}
        ${!this.isDropdown ? `
          <ids-popup
            part="popup"
            type="menu"
          >
            <section slot="content">
              <ids-month-view
                compact="true"
                is-date-picker="true"
                show-today=${this.showToday}
                first-day-of-week="${this.firstDayOfWeek}"
                year="${this.year}"
                month="${this.month}"
                day="${this.day}"
              ></ids-month-view>
              <div class="popup-footer" part="footer">
                <ids-button class="popup-btn popup-btn-start" part="start-button">
                  <ids-text
                    translate-text="true"
                    font-weight="bold"
                  >${this.isCalendarToolbar ? 'Cancel' : 'Clear'}</ids-text>
                </ids-button>
                <ids-button class="popup-btn popup-btn-end" part="end-button">
                  <ids-text translate-text="true" font-weight="bold">Apply</ids-text>
                </ids-button>
              </div>
            </section>
          </ids-popup>
        ` : ''}
      </div>
    `;
  }

  /**
   * @returns {IdsPopup} reference to the Popup component
   */
  get popup() {
    return this.#popup;
  }

  /**
   * Click event is propagated to the window.
   * @param {PointerEvent} e native pointer event
   * @returns {void}
   */
  onOutsideClick(e) {
    if (e.target !== this) {
      this.#togglePopup(false);
    }
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   */
  #attachEventHandlers() {
    // Respond to container changing locale
    this.offEvent('localechange.date-picker-container');
    this.onEvent('localechange.date-picker-container', getClosest(this, 'ids-container'), () => {
      this.setDirection();
      this.#applyMask();

      // Locale change first day of week only if it's not set as attribute
      if (this.firstDayOfWeek === null) {
        this.firstDayOfWeek = this.locale?.calendar().firstDayofWeek || 0;
      }
    });

    if (!this.isDropdown) {
      this.offEvent('click.date-picker-popup');
      this.onEvent('click.date-picker-popup', this.#triggerButton, () => {
        this.#togglePopup(!this.#popup.visible);
      });

      this.offEvent('dayselected.date-picker-calendar');
      this.onEvent('dayselected.date-picker-calendar', this.#monthView, (e) => {
        if (!this.isCalendarToolbar) {
          this.value = this.locale.formatDate(e.detail.date);
          this.#triggerField?.focus();
        }

        this.#togglePopup(false);
        this.focus();
        this.#triggerSelectedEvent();
      });

      this.offEvent('click.date-picker-clear');
      this.onEvent('click.date-picker-clear', this.container.querySelector('.popup-btn-start'), (e) => {
        e.stopPropagation();

        const picklist = this.#monthView?.container.querySelector('ids-date-picker');

        if (picklist?.expanded) {
          picklist.expanded = false;

          return;
        }

        if (!this.isCalendarToolbar) {
          this.value = '';
          this.#triggerField?.focus();
          this.#triggerSelectedEvent();
        }

        this.#togglePopup(false);
      });

      this.offEvent('click.date-picker-apply');
      this.onEvent('click.date-picker-apply', this.container.querySelector('.popup-btn-end'), (e) => {
        e.stopPropagation();

        const picklist = this.#monthView?.container?.querySelector('ids-date-picker');

        if (picklist?.expanded) {
          const { month, year } = picklist;

          this.#monthView.year = year;
          this.#monthView.month = month;

          picklist.expanded = false;

          return;
        }

        this.value = this.locale.formatDate(this.#monthView.activeDate);
        this.#togglePopup(false);
        this.#triggerField?.focus();
        this.#triggerSelectedEvent();
      });
    }

    if (this.isDropdown) {
      this.offEvent('click.date-picker-dropdown');
      this.onEvent('click.date-picker-dropdown', this.container.querySelector('ids-toggle-button'), (e) => {
        e.stopPropagation();

        this.expanded = !this.expanded;
      });

      this.offEvent('click.date-picker-picklist');
      this.onEvent('click.date-picker-picklist', this.container.querySelector('.picklist'), (e) => {
        if (!e.target) return;
        const btnUp = e.target.closest('.is-btn-up');
        const btnDown = e.target.closest('.is-btn-down');
        const monthItem = e.target.closest('.is-month');
        const yearItem = e.target.closest('.is-year');

        if (btnUp) {
          this.#picklistYearPaged(false);
        }

        if (btnDown) {
          this.#picklistYearPaged(true);
        }

        if (monthItem) {
          e.stopPropagation();

          this.#unselectPicklist('month');

          this.#selectPicklistEl(monthItem);

          monthItem.focus();

          this.month = monthItem.dataset.month;
        }

        if (yearItem) {
          e.stopPropagation();

          this.#unselectPicklist('year');

          this.#selectPicklistEl(yearItem);

          yearItem.focus();

          this.year = yearItem.dataset.year;
        }
      });
    }

    return this;
  }

  /**
   * Expanded/collapsed event for date picker (picklist) in calendar popup
   */
  #attachExpandedListener() {
    if (this.isDropdown) {
      this.offEvent('expanded.date-picker-expand');
    } else {
      this.offEvent('expanded.date-picker-expand');
      this.onEvent('expanded.date-picker-expand', this.#monthView?.container?.querySelector('ids-date-picker'), (e) => {
        const btnText = this.container.querySelector('.popup-btn-start ids-text');

        if (btnText && !this.isCalendarToolbar) {
          btnText.textContent = this.locale?.translate(e.detail.expanded ? 'Cancel' : 'Clear');
        }
      });
    }
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @returns {object} this class-instance object for chaining
   */
  #attachKeyboardListeners() {
    this.offEvent('keydown.date-picker-keyboard');
    this.onEvent('keydown.date-picker-keyboard', this, (e) => {
      const key = e.keyCode;
      const stopEvent = () => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
      };

      // Date Picker Dropdown keyboard events
      if (this.isDropdown) {
        const btnUp = this.container.querySelector('.is-btn-up');
        const btnDown = this.container.querySelector('.is-btn-down');
        const monthSelected = this.container.querySelector('.is-month.is-selected');
        const yearSelected = this.container.querySelector('.is-year.is-selected');

        // Enter on picklist year btn up
        if (key === 13 && btnUp?.matches(':focus')) {
          this.#picklistYearPaged(false);
        }

        // Enter on picklist year btn down
        if (key === 13 && btnDown?.matches(':focus')) {
          this.#picklistYearPaged(true);
        }

        // Arrow Up on picklist month
        if (key === 38 && monthSelected?.matches(':focus')) {
          const month = this.month === MIN_MONTH ? MAX_MONTH : this.month - 1;
          const el = this.container.querySelector(`.is-month[data-month="${month}"]`);

          this.#unselectPicklist('month');

          this.#selectPicklistEl(el);
          this.month = month;
          el?.focus();
        }

        // Arrow Down on picklist month
        if (key === 40 && monthSelected?.matches(':focus')) {
          const month = this.month === MAX_MONTH ? MIN_MONTH : this.month + 1;
          const el = this.container.querySelector(`.is-month[data-month="${month}"]`);

          this.#unselectPicklist('month');

          this.#selectPicklistEl(el);
          this.month = month;
          el?.focus();
        }

        // Arrow Up on picklist year
        if (key === 38 && yearSelected?.matches(':focus')) {
          const year = this.year - 1;

          const el = this.container.querySelector(`.is-year[data-year="${year}"]`);

          this.#unselectPicklist('year');

          if (!el) {
            btnUp?.focus();

            return;
          }

          this.#selectPicklistEl(el);
          this.year = year;
          el?.focus();
        }

        // Arrow Down on picklist year
        if (key === 40 && yearSelected?.matches(':focus')) {
          const year = this.year + 1;

          const el = this.container.querySelector(`.is-year[data-year="${year}"]`);

          this.#unselectPicklist('year');

          if (!el) {
            btnDown?.focus();

            return;
          }

          this.#selectPicklistEl(el);
          this.year = year;
          el?.focus();
        }

        // Arrow Up on btn up
        if (key === 38 && btnUp?.matches(':focus')) {
          btnDown?.focus();

          return;
        }

        // Arrow Down on btn down
        if (key === 40 && btnDown?.matches(':focus')) {
          btnUp?.focus();

          return;
        }

        // Arrow Up on btn down
        if (key === 38 && btnDown?.matches(':focus')) {
          const el = this.container.querySelector('.is-year.is-last');

          this.#unselectPicklist('year');
          this.#selectPicklistEl(el);
          this.year = el?.dataset.year;
          el?.focus();
        }

        // Arrow Down on btn up
        if (key === 40 && btnUp?.matches(':focus')) {
          const el = this.container.querySelector('.is-year');

          this.#unselectPicklist('year');
          this.#selectPicklistEl(el);
          this.year = el.dataset.year;
          el?.focus();
        }
      // Regular date picker keyboard events
      } else {
        // Arrow Down opens calendar popup
        if (key === 40 && !this.#popup?.visible) {
          stopEvent();

          this.#togglePopup(true);
        }

        // Escape closes calendar popup
        if (key === 27) {
          stopEvent();

          this.#togglePopup(false);
          this.focus();
        }

        // Tab will loop focus inside calendar popup
        if (key === 9 && this.#popup?.visible) {
          // First focusable in the calendar popup is dropdown datepicker
          const firstFocusable = this.#monthView?.container?.querySelector('ids-date-picker');
          // Last focusable in the calendar popup is Apply button
          const lastFocusable = this.container.querySelector('.popup-btn-end')?.container;

          if (!e.shiftKey && lastFocusable?.matches(':focus')) {
            stopEvent();

            firstFocusable.focus();
          }

          if (e.shiftKey && firstFocusable.hasFocus) {
            stopEvent();

            lastFocusable.focus();
          }
        }

        // 't' sets today date
        if (key === 84 && !this.isCalendarToolbar) {
          stopEvent();

          this.#changeDate('today');
        }

        if (!this.isCalendarToolbar && !this.value.includes('-')) {
          // '+' increments day
          if (key === 187 || key === 107) {
            stopEvent();

            this.#changeDate('next-day');
          }

          // '-' decrements day
          if (key === 189 || key === 109) {
            stopEvent();

            this.#changeDate('previous-day');
          }
        }
      }
    });

    return this;
  }

  /**
   * Open/close popup with month view
   * @param {boolean} isOpen should be opened or closed
   */
  #togglePopup(isOpen) {
    if (this.isDropdown) return;

    if (isOpen && !this.readonly) {
      this.addOpenEvents();

      this.#popup.visible = true;
      this.#popup.alignTarget = this.isCalendarToolbar ? this.container : this.#triggerField;
      this.#popup.arrowTarget = this.#triggerButton;
      this.#popup.align = `bottom, ${this.locale.isRTL() ? 'right' : 'left'}`;
      this.#popup.arrow = 'bottom';
      this.#popup.y = 16;

      this.container.classList.add('is-open');
      this.#parseInputDate();

      this.#monthView.focus();

      if (this.isCalendarToolbar) {
        this.container.removeAttribute('tabindex');
      }
    } else {
      this.removeOpenEvents();
      this.#popup.visible = false;

      this.container.classList.remove('is-open');

      if (this.isCalendarToolbar) {
        this.container.setAttribute('tabindex', 0);
      }

      // Close and reset month/year picker when main popup is closed
      const picklist = this.#monthView?.container?.querySelector('ids-date-picker');

      if (picklist) {
        picklist.expanded = false;
        picklist.month = this.month;
        picklist.year = this.year;
      }
    }
  }

  /**
   * Render month/year picklist
   */
  #attachPicklist() {
    if (!this.isDropdown) return;

    const calendarMonths = this.locale?.calendar()?.months.wide;
    const startYear = this.year - 4;
    const months = calendarMonths?.map((item, index) =>
      `<li
        role="link"
        data-month="${index}"
        class="picklist-item is-month"
      ><ids-text>${item}</ids-text></li>`).join('');
    const years = Array.from({ length: 10 }).map((_, index) =>
      `<li
        data-year="${startYear + index}"
        role="link"
        class="picklist-item is-year${index === 9 ? ' is-last' : ''}"
      ><ids-text>${startYear + index}</ids-text></li>`).join('');

    const template = `
      <div class="picklist-section">
        <ul class="picklist-list">${months}</ul>
      </div>
      <div class="picklist-section">
        <ul class="picklist-list">
          <li role="button" class="picklist-item is-btn-up">
            <ids-text audible="true" translate-text="true">PreviousYear</ids-text>
            <ids-icon icon="chevron-up"></ids-icon>
          </li>
          ${years}
          <li role="button" class="picklist-item is-btn-down">
            <ids-text audible="true" translate-text="true">NextYear</ids-text>
            <ids-icon icon="chevron-down"></ids-icon>
          </li>
        </ul>
      </div>
    `;

    this.container.querySelectorAll('.picklist-section').forEach((el) => el?.remove());
    this.container.querySelector('.picklist')?.insertAdjacentHTML('afterBegin', template);
  }

  /**
   * Helper to loop through the year list and increase/descrese year depends on the param
   * @param {boolean} isNext increase/descrese picklist year
   */
  #picklistYearPaged(isNext) {
    this.#unselectPicklist('year');

    this.container.querySelectorAll('.picklist-item.is-year').forEach((el, index) => {
      const elYear = stringToNumber(el.dataset.year);

      el.dataset.year = isNext ? elYear + 10 : elYear - 10;
      el.querySelector('ids-text').textContent = isNext ? elYear + 10 : elYear - 10;

      if (index === 4) {
        this.#selectPicklistEl(el);

        this.year = el.dataset.year;
      }
    });
  }

  /**
   * Add selectable/tabbable attributes to picklist element
   * @param {HTMLElement} el element to handle
   */
  #selectPicklistEl(el) {
    el?.classList.add('is-selected');
    el?.setAttribute('tabindex', 0);
    el?.setAttribute('aria-selected', true);
    el?.setAttribute('role', 'gridcell');
  }

  /**
   * Reset picklist selectable/tabbable attributes
   * @param {'month'|'year'|'all'} type of panel to unselect
   */
  #unselectPicklist(type) {
    const selector = `.picklist-item${type !== 'all' ? `.is-${type}` : ''}`;

    this.container.querySelectorAll(selector).forEach((el) => {
      el.removeAttribute('tabindex');
      el.classList.remove('is-selected');
      el.removeAttribute('aria-selected');

      if (el.getAttribute('role') === 'gridcell') {
        el.setAttribute('role', 'link');
      }
    });
  }

  /**
   * Trigger selected event with current params
   * @returns {void}
   */
  #triggerSelectedEvent() {
    const args = {
      detail: {
        elem: this,
        date: this.#monthView.activeDate
      }
    };

    this.triggerEvent('dayselected', this, args);
  }

  /**
   * Trigger expanded event with current params
   * @param {boolean} expanded expanded or collapsed
   * @returns {void}
   */
  #triggerExpandedEvent(expanded) {
    const args = {
      detail: {
        elem: this,
        expanded
      }
    };

    this.triggerEvent('expanded', this, args);
  }

  /**
   * Parse date from value and pass as year/month/day params what triggers month view to rerender
   */
  #parseInputDate() {
    if (this.isCalendarToolbar) return;

    const date = new Date(this.#triggerField?.value);
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();

    if (this.year !== year) {
      this.year = year;
    }

    if (this.month !== month) {
      this.month = month;
    }

    if (this.day !== day) {
      this.day = day;
    }
  }

  /**
   * Applying ids-mask to the input when changing locale or format
   */
  #applyMask() {
    const format = this.format === 'locale' ? this.locale.calendar().dateFormat.short : this.format;

    if (this.#triggerField) {
      this.#triggerField.maskOptions = { format };
      this.#triggerField.value = this.value;
    }
  }

  /**
   * Change input date based on type
   * @param {string} type of event
   */
  #changeDate(type) {
    const date = this.#triggerField?.value ? new Date(this.#triggerField.value) : new Date();

    if (type === 'today') {
      const now = new Date();

      this.value = this.locale.formatDate(now);
    }

    if (type === 'next-day') {
      this.value = this.locale.formatDate(addDate(date, 1, 'days'));
    }

    if (type === 'previous-day') {
      this.value = this.locale.formatDate(subtractDate(date, 1, 'days'));
    }
  }

  /**
   * Focuses input or dropdown
   * @returns {void}
   */
  focus() {
    this.#triggerField?.focus();
    this.container.querySelector('ids-toggle-button')?.container?.focus();

    if (this.isCalendarToolbar) {
      this.container.focus();
    }
  }

  /**
   * Indicates if input, dropdown or the calendar toolbar has focus
   * @returns {boolean} whether or not an element has focus
   */
  get hasFocus() {
    const input = this.#triggerField?.container.querySelector('input');
    const dropdown = this.container.querySelector('.dropdown-btn')?.shadowRoot.querySelector('button');

    return input?.matches(':focus') || dropdown?.matches(':focus');
  }

  /**
   * value attribute
   * @returns {string} value param
   */
  get value() {
    return this.getAttribute(attributes.VALUE) ?? '';
  }

  /**
   * Set input value. Should parse a date from the value
   * Set dropdown button text if the component is dropdown
   * Set text if the component is used in calendar toolbar
   * @param {string|null} val value param
   */
  set value(val) {
    const textEl = this.container.querySelector('.datepicker-text');
    const dropdownEl = this.container.querySelector('.dropdown-btn-text');

    if (!this.disabled && !this.readonly) {
      this.setAttribute(attributes.VALUE, val);
      this.#triggerField?.setAttribute(attributes.VALUE, val);

      if (textEl) {
        textEl.innerText = val;
      }

      if (dropdownEl) {
        dropdownEl.innerText = val;
      }
    }

    this.#attachPicklist();
  }

  /**
   * placeholder attribute
   * @returns {string} placeholder param
   */
  get placeholder() {
    return this.getAttribute(attributes.PLACEHOLDER) ?? '';
  }

  /**
   * Set input placeholder
   * @param {string|null} val of placeholder to be set
   */
  set placeholder(val) {
    if (val) {
      this.setAttribute(attributes.PLACEHOLDER, val);
      this.#triggerField?.setAttribute(attributes.PLACEHOLDER, val);
    } else {
      this.removeAttribute(attributes.PLACEHOLDER);
      this.#triggerField?.removeAttribute(attributes.PLACEHOLDER);
    }
  }

  /**
   * label attribute
   * @returns {string} label param
   */
  get label() {
    return this.getAttribute(attributes.LABEL) ?? '';
  }

  /**
   * Set trigger field label
   * @param {string|null} val of label to be set
   */
  set label(val) {
    if (val) {
      this.setAttribute(attributes.LABEL, val);
      this.#triggerField?.setAttribute(attributes.LABEL, val);
    } else {
      this.removeAttribute(attributes.LABEL);
      this.#triggerField?.removeAttribute(attributes.LABEL);
    }
  }

  /**
   * disabled attribute
   * @returns {boolean} disabled param
   */
  get disabled() {
    const attrVal = this.getAttribute(attributes.DISABLED);

    return stringToBool(attrVal);
  }

  /**
   * Set trigger field disabled attribute
   * @param {string|boolean|null} val disabled param value
   */
  set disabled(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.DISABLED, boolVal);
      this.#triggerField?.setAttribute(attributes.DISABLED, boolVal);
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.#triggerField?.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * readonly attribute
   * @returns {boolean} readonly param
   */
  get readonly() {
    const attrVal = this.getAttribute(attributes.READONLY);

    return stringToBool(attrVal);
  }

  /**
   * Set trigger field readonly attribute
   * @param {string|boolean|null} val readonly param value
   */
  set readonly(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.READONLY, boolVal);
      this.#triggerField?.setAttribute(attributes.READONLY, boolVal);
    } else {
      this.removeAttribute(attributes.READONLY);
      this.#triggerField?.removeAttribute(attributes.READONLY);
    }
  }

  /**
   * size attribute
   * @returns {string} size param
   */
  get size() { return this.getAttribute(attributes.SIZE); }

  /**
   * Set the size (width) of input
   * @param {string} val [xs, sm, mm, md, lg, full]
   */
  set size(val) {
    this.setAttribute(attributes.SIZE, val);
    this.#triggerField?.setAttribute(attributes.SIZE, val);
  }

  /**
   * tabbable attribute
   * @returns {boolean} tabbable param
   */
  get tabbable() {
    const attrVal = this.getAttribute(attributes.TABBABLE);

    // tabbable by default
    return attrVal !== null ? stringToBool(attrVal) : true;
  }

  /**
   * Set trigger field tabbable attribute
   * @param {boolean|string|null} val true of false depending if the trigger field is tabbable
   */
  set tabbable(val) {
    this.setAttribute(attributes.TABBABLE, val);
    this.#triggerButton?.setAttribute(attributes.TABBABLE, val);
  }

  /**
   * id attribute
   * @returns {string} id param
   */
  get id() { return this.getAttribute(attributes.ID) ?? ''; }

  /**
   * Set trigger field/input id attribute
   * @param {string} val id
   */
  set id(val) {
    if (val) {
      this.setAttribute(attributes.ID, val);
      this.#triggerField?.setAttribute(attributes.ID, val);
    } else {
      this.removeAttribute(attributes.ID);
      this.#triggerField?.removeAttribute(attributes.ID);
    }
  }

  /**
   * validate attribute
   * @returns {string|null} validate param
   */
  get validate() { return this.getAttribute(attributes.VALIDATE); }

  /**
   * Set trigger field/input validation
   * @param {string|null} val validate param
   */
  set validate(val) {
    if (val) {
      this.setAttribute(attributes.VALIDATE, val);
      this.#triggerField?.setAttribute(attributes.VALIDATE, val);
      this.#triggerField?.setAttribute(attributes.VALIDATION_EVENTS, this.validationEvents);
      this.#triggerField?.handleValidation();
    } else {
      this.removeAttribute(attributes.VALIDATE);
      this.#triggerField?.removeAttribute(attributes.VALIDATE);
      this.#triggerField?.removeAttribute(attributes.VALIDATION_EVENTS);
      this.#triggerField?.handleValidation();
    }
  }

  /**
   * validation-events attributes
   * @returns {string} validationEvents param. Default is 'change blur'
   */
  get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS) ?? 'change blur'; }

  /**
   * Set which input events to fire validation on
   * @param {string|null} val validation-events attribute
   */
  set validationEvents(val) {
    if (val) {
      this.setAttribute(attributes.VALIDATION_EVENTS, val);
      this.#triggerField?.setAttribute(attributes.VALIDATION_EVENTS, val);
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      this.#triggerField?.removeAttribute(attributes.VALIDATION_EVENTS);
    }
  }

  /**
   * format attributes
   * @returns {string|'locale'} format param. Default is locale - gets format from the calendar
   */
  get format() {
    return this.getAttribute(attributes.FORMAT) ?? 'locale';
  }

  /**
   * Sets the value date format and applies ids-mask
   * @param {string|null} val format attribute
   */
  set format(val) {
    if (val) {
      this.setAttribute(attributes.FORMAT, val);
    } else {
      this.removeAttribute(attributes.FORMAT);
    }

    this.#applyMask();
  }

  /**
   * is-calendar-toolbar attribute
   * @returns {boolean} isCalendarToolbar param converted to boolean from attribute value
   */
  get isCalendarToolbar() {
    const attrVal = this.getAttribute(attributes.IS_CALENDAR_TOOLBAR);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component is used in calendar toolbar
   * @param {string|boolean|null} val is-calendar-toolbar attribute
   */
  set isCalendarToolbar(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.IS_CALENDAR_TOOLBAR, boolVal);
    } else {
      this.removeAttribute(attributes.IS_CALENDAR_TOOLBAR);
    }

    // Toggle container CSS class
    this.container.classList.toggle('is-calendar-toolbar', boolVal);
  }

  /**
   * is-dropdown attribute
   * @returns {boolean} isDropdown param converted to boolean from attribute value
   */
  get isDropdown() {
    const attrVal = this.getAttribute(attributes.IS_DROPDOWN);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component is dropdown type
   * @param {string|boolean|null} val is-dropdown attribute value
   */
  set isDropdown(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.IS_DROPDOWN, boolVal);
    } else {
      this.removeAttribute(attributes.IS_DROPDOWN);
    }

    // Toggle container CSS class
    this.container.classList.toggle('is-dropdown', boolVal);
  }

  /**
   * show-today attribute
   * @returns {boolean} showToday param converted to boolean from attribute value
   */
  get showToday() {
    const attrVal = this.getAttribute(attributes.SHOW_TODAY);

    // true by default if no attribute
    return attrVal !== null ? stringToBool(attrVal) : true;
  }

  /**
   * Set whether or not month view today button should be show
   * @param {string|boolean|null} val show-today attribute value
   */
  set showToday(val) {
    this.setAttribute(attributes.SHOW_TODAY, val);
    this.#monthView?.setAttribute(attributes.SHOW_TODAY, val);
    this.#attachExpandedListener();
  }

  /**
   * fist-day-of-week attribute for calendar popup
   * If not set the information comes from the locale. If not set in the locale defaults to 0
   * @returns {number} firstDayOfWeek param
   */
  get firstDayOfWeek() {
    const attrVal = this.getAttribute(attributes.FIRST_DAY_OF_WEEK);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal)) {
      return numberVal;
    }

    return this.locale?.calendar().firstDayofWeek || 0;
  }

  /**
   * Set month view first day of the week
   * @param {string|number|null} val fist-day-of-week attribute value
   */
  set firstDayOfWeek(val) {
    this.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
    this.#monthView?.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
  }

  /**
   * month attribute
   * @returns {number} month param
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
   * Set month view month attribute
   * @param {string|number|null} val month param value
   */
  set month(val) {
    if (!Number.isNaN(stringToNumber(val))) {
      this.setAttribute(attributes.MONTH, val);
      this.#monthView?.setAttribute(attributes.MONTH, val);
    } else {
      this.removeAttribute(attributes.MONTH);
      this.#monthView?.removeAttribute(attributes.MONTH);
    }

    if (this.isCalendarToolbar) {
      this.#togglePopup(false);
    }
  }

  /**
   * year attribute
   * @returns {number} year param converted to number from attribute value
   */
  get year() {
    const attrVal = this.getAttribute(attributes.YEAR);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal) && attrVal.length === 4) {
      return numberVal;
    }

    // Default is current year
    return new Date().getFullYear();
  }

  /**
   * Set month view year attribute
   * @param {string|number|null} val year attribute value
   */
  set year(val) {
    if (val) {
      this.setAttribute(attributes.YEAR, val);
      this.#monthView?.setAttribute(attributes.YEAR, val);
    } else {
      this.removeAttribute(attributes.YEAR);
      this.#monthView?.removeAttribute(attributes.YEAR);
    }

    if (this.isCalendarToolbar) {
      this.#togglePopup(false);
    }
  }

  /**
   * day attribute
   * @returns {number} day param converted to number from attribute value
   */
  get day() {
    const attrVal = this.getAttribute(attributes.DAY);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal) && numberVal > 0) {
      return numberVal;
    }

    // Default is current day
    return new Date().getDate();
  }

  /**
   * Set month view day attribute
   * @param {string|number|null} val day attribute value
   */
  set day(val) {
    if (val) {
      this.setAttribute(attributes.DAY, val);
      this.#monthView?.setAttribute(attributes.DAY, val);
    } else {
      this.removeAttribute(attributes.DAY);
      this.#monthView?.removeAttribute(attributes.DAY);
    }

    if (this.isCalendarToolbar) {
      this.#togglePopup(false);
    }
  }

  /**
   * Overrides the standard "focus" behavior to instead pass focus to the inner IdsTriggerField element.
   */
  focus() {
    this.#triggerField.focus();
  }

  /**
   * Set the direction attribute
   */
  get expanded() {
    return stringToBool(this.getAttribute(attributes.EXPANDED));
  }

  /**
   * Set whether or not the month/year picker should be expanded
   * @param {string|boolean|null} val expanded attribute value
   */
  set expanded(val) {
    if (!this.isDropdown) return;

    const boolVal = stringToBool(val);

    this.container.querySelector('ids-expandable-area').expanded = boolVal;
    this.container.classList.toggle('is-expanded', boolVal);
    this.#triggerExpandedEvent(boolVal);

    if (boolVal) {
      const height = getClosest(this, 'ids-month-view')?.container.scrollHeight;

      this.container.querySelector('.picklist').style.height = `${height - 44}px`;

      const monthEl = this.container.querySelector(`.picklist-item.is-month[data-month="${this.month}"]`);
      const yearEl = this.container.querySelector(`.picklist-item.is-year[data-year="${this.year}"]`);
      const btnUp = this.container.querySelector('.picklist-item.is-btn-up');
      const btnDown = this.container.querySelector('.picklist-item.is-btn-down');

      this.#selectPicklistEl(monthEl);
      this.#selectPicklistEl(yearEl);
      btnUp.setAttribute('tabindex', 0);
      btnDown.setAttribute('tabindex', 0);
      monthEl?.focus();

      this.setAttribute(attributes.EXPANDED, boolVal);
    } else {
      this.#unselectPicklist('all');
      this.removeAttribute(attributes.EXPANDED);
    }
  }
}

export default IdsDatePicker;

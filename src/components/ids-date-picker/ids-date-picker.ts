import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-date-picker-base';

import {
  buildClassAttrib,
  stringToBool,
  stringToNumber
} from '../../utils/ids-string-utils/ids-string-utils';
import {
  addDate, subtractDate, isValidDate, umalquraToGregorian, weekNumberToDate, weekNumber, hoursTo24
} from '../../utils/ids-date-utils/ids-date-utils';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

// Supporting components
import '../ids-button/ids-button';
import '../ids-toggle-button/ids-toggle-button';
import '../ids-expandable-area/ids-expandable-area';
import '../ids-dropdown/ids-dropdown';
import '../ids-icon/ids-icon';
import '../ids-input/ids-input';
import '../ids-month-view/ids-month-view';
import '../ids-popup/ids-popup';
import '../ids-text/ids-text';
import '../ids-time-picker/ids-time-picker';
import '../ids-trigger-field/ids-trigger-field';

// Types
import type {
  IdsRangeSettings,
  IdsDisableSettings,
  IdsDayselectedEvent,
  IdsLegend
} from '../ids-month-view/ids-month-view';

// Import Styles
import styles from './ids-date-picker.scss';

const MIN_MONTH = 0;
const MAX_MONTH = 11;
const MONTH_KEYS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PICKLIST_LENGTH = 6;

/**
 * IDS Date Picker Component
 * @type {IdsDatePicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsDirtyTrackerMixin
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
 * @part btn-clear - the clear button in the calendar popup
 * @part btn-cancel - the cancel button in the calendar popup
 * @part btn-apply - the apply button in the calendar popup
 */
@customElement('ids-date-picker')
@scss(styles)
class IdsDatePicker extends Base {
  constructor() {
    super();
  }

  isFormComponent = true;

  /**
   * Elements for internal usage
   * @private
   */
  #monthView: any;

  #popup: any;

  #triggerButton: any;

  #triggerField: any;

  connectedCallback(): void {
    super.connectedCallback();
    this.#monthView = this.container?.querySelector('ids-month-view');
    this.#popup = this.container?.querySelector('ids-popup');
    this.#triggerButton = this.container?.querySelector('ids-trigger-button');
    this.#triggerField = this.container?.querySelector('ids-trigger-field');
    this.#attachEventHandlers();
    this.#attachExpandedListener();
    this.#attachKeyboardListeners();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
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
      attributes.MASK,
      attributes.MINUTE_INTERVAL,
      attributes.MONTH,
      attributes.NO_MARGINS,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.SECOND_INTERVAL,
      attributes.SHOW_CANCEL,
      attributes.SHOW_CLEAR,
      attributes.SHOW_PICKLIST_MONTH,
      attributes.SHOW_PICKLIST_WEEK,
      attributes.SHOW_TODAY,
      attributes.SIZE,
      attributes.TABBABLE,
      attributes.USE_CURRENT_TIME,
      attributes.USE_RANGE,
      attributes.VALIDATE,
      attributes.VALIDATION_EVENTS,
      attributes.VALUE,
      attributes.YEAR,
    ];
  }

  /**
   * List of available color variants for this component
   * @returns {Array<string>}
   */
  colorVariants = ['alternate-formatter'];

  /**
   * Push color variant to the trigger-field element
   * @returns {void}
   */
  onColorVariantRefresh(): void {
    this.#triggerField.colorVariant = this.colorVariant;
  }

  /**
   * Push label-state to the trigger-field element
   * @returns {void}
   */
  onlabelStateChange(): void {
    if (this.#triggerField) this.#triggerField.labelState = this.labelState;
  }

  /**
   * Push field-height/compact to the trigger-field element
   * @param {string} val the new field height setting
   */
  onFieldHeightChange(val: string) {
    if (!this.#triggerField) return;
    if (val) {
      const attr = val === 'compact' ? { name: 'compact', val: '' } : { name: 'field-height', val };
      this.#triggerField.setAttribute(attr.name, attr.val);
    } else {
      this.#triggerField.removeAttribute('compact');
      this.#triggerField.removeAttribute('field-height');
    }
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    const colorVariant = this.colorVariant ? ` color-variant="${this.colorVariant}"` : '';
    const fieldHeight = this.fieldHeight ? ` field-height="${this.fieldHeight}"` : '';
    const labelState = this.labelState ? ` label-state="${this.labelState}"` : '';
    const compact = this.compact ? ' compact' : '';
    const noMargins = this.noMargins ? ' no-margins' : '';
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
          <ids-toggle-button icon-off="dropdown" icon-on="dropdown" icon="dropdown" icon-align="end" class="dropdown-btn">
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
            ${this.id ? `id="${this.id}"` : ''}
            ${this.label ? `label="${this.label}"` : ''}
            placeholder="${this.placeholder}"
            size="${this.size}"
            ${this.validate ? `validate="${this.validate}"` : ''}
            validation-events="${this.validationEvents}"
            value="${this.value}"
            ${colorVariant}${fieldHeight}${compact}${noMargins}${labelState}
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
            tabindex="-1"
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
                use-range="${this.useRange}"
              ></ids-month-view>
              <div class="popup-footer" part="footer">
                <ids-button class="popup-btn popup-btn-cancel" hidden>
                  <ids-text translate-text="true" font-weight="bold" part="btn-cancel">Cancel</ids-text>
                </ids-button>
                <ids-button class="popup-btn popup-btn-clear" hidden part="btn-clear">
                  <ids-text translate-text="true" font-weight="bold">Clear</ids-text>
                </ids-button>
                <ids-button class="popup-btn popup-btn-apply" ${this.useRange ? 'disabled' : 'hidden'} part="btn-apply">
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
   * Callback for dirty tracker setting change
   * @param {boolean} value The changed value
   * @returns {void}
   */
  onDirtyTrackerChange(value: boolean) {
    if (value) {
      this.#triggerField?.setAttribute(attributes.DIRTY_TRACKER, value);
    } else {
      this.#triggerField?.removeAttribute(attributes.DIRTY_TRACKER);
    }
  }

  /**
   * @returns {HTMLElement} reference to the IdsPopup component
   */
  get popup(): HTMLElement {
    return this.#popup;
  }

  /**
   * Click event is propagated to the window.
   * @param {PointerEvent} e native pointer event
   * @returns {void}
   */
  onOutsideClick(e: any): void {
    if (!e.composedPath()?.includes(this.#popup)) {
      this.#togglePopup(false);
    }
  }

  /**
   * Expanded/collapsed event for date picker (picklist) in calendar popup
   */
  #attachExpandedListener() {
    this.offEvent('expanded.date-picker-expand');
    this.onEvent('expanded.date-picker-expand', this.#monthView?.container?.querySelector('ids-date-picker'), (e: any) => {
      const btnApply = this.container?.querySelector('.popup-btn-apply');
      const btnCancel = this.container?.querySelector('.popup-btn-cancel');

      btnApply?.setAttribute('hidden', `${!(e.detail.expanded || (this.useRange && !this.rangeSettings.selectWeek))}`);
      btnApply?.classList.toggle('is-visible', e.detail.expanded || (this.useRange && !this.rangeSettings.selectWeek));

      if (e.detail.expanded) {
        btnApply?.removeAttribute('disabled');

        if (this.showCancel) {
          btnCancel?.removeAttribute('hidden');
        }
      } else {
        btnApply?.setAttribute('disabled', `${!(this.rangeSettings.start && this.rangeSettings.end)}`);
        btnCancel?.setAttribute('hidden', `${!e.detail.expanded}`);
      }
    });
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   */
  #attachEventHandlers(): object {
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

    // Respond to container changing language
    this.offEvent('languagechange.date-picker-container');
    this.onEvent('languagechange.date-picker-container', getClosest(this, 'ids-container'), () => {
      this.#setDateValidation();
      this.#setAvailableDateValidation();
    });

    if (!this.isDropdown) {
      this.offEvent('click.date-picker-popup');
      this.onEvent('click.date-picker-popup', this.#triggerButton, () => {
        this.#togglePopup(!this.#popup.visible);
      });

      this.offEvent('dayselected.date-picker-calendar');
      this.onEvent('dayselected.date-picker-calendar', this.#monthView, (e: IdsDayselectedEvent) => {
        this.#handleDaySelectedEvent(e);
      });

      this.offEvent('click.date-picker-footer');
      this.onEvent('click.date-picker-footer', this.container?.querySelector('.popup-footer'), (e: MouseEvent) => {
        if (!e.target) return;
        e.stopPropagation();

        if ((e.target as HTMLElement).closest('.popup-btn-apply')) {
          this.#handleApplyEvent(e);
        }

        if ((e.target as HTMLElement).closest('.popup-btn-clear')) {
          if (!this.isCalendarToolbar) {
            this.value = '';
            this.rangeSettings = {
              start: null,
              end: null
            };
            this.#triggerField?.focus();
            this.#triggerSelectedEvent();
          }

          this.#togglePopup(false);
        }

        if ((e.target as HTMLElement).closest('.popup-btn-cancel')) {
          const picklist = this.#monthView?.container.querySelector('ids-date-picker');

          if (picklist?.expanded) {
            picklist.expanded = false;
          }
        }
      });
    }

    if (this.isDropdown) {
      this.offEvent('click.date-picker-dropdown');
      this.onEvent('click.date-picker-dropdown', this.container?.querySelector('ids-toggle-button'), (e: MouseEvent) => {
        e.stopPropagation();

        this.expanded = !this.expanded;
      });

      this.offEvent('click.date-picker-picklist');
      this.onEvent('click.date-picker-picklist', this.container?.querySelector('.picklist'), (e: MouseEvent) => {
        this.#handlePicklistEvent(e);
      });
    }

    // Input value change triggers component value change
    this.offEvent('change.date-picker-input');
    this.onEvent('change.date-picker-input', this.#triggerField, (e: any) => {
      this.setAttribute(attributes.VALUE, e.detail.value);
    });

    // Closes popup on input focus
    this.offEvent('focus.date-picker-input');
    this.onEvent('focus.date-picker-input', this.#triggerField, () => {
      this.#togglePopup(false);
    });

    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @returns {IdsDatePicker} this class-instance object for chaining
   */
  #attachKeyboardListeners(): IdsDatePicker {
    this.offEvent('keydown.date-picker-keyboard');
    this.onEvent('keydown.date-picker-keyboard', this, (e: KeyboardEvent) => {
      this.#handleKeyDownEvent(e);
    });

    return this;
  }

  /**
   * Open/close popup with month view
   * @param {boolean} isOpen should be opened or closed
   */
  #togglePopup(isOpen: boolean) {
    if (this.isDropdown) return;

    if (isOpen && !this.readonly && !this.disabled) {
      this.#parseInputDate();
      if (this.value) {
        this.#monthView?.selectDay(this.year, this.month, this.day);
      }

      this.addOpenEvents();
      this.#attachExpandedListener();
      this.#popup.removeAttribute('tabindex');

      this.#popup.alignTarget = this.isCalendarToolbar
        ? this.container
        : this.#triggerField?.container.querySelector('.field-container');
      this.#popup.arrowTarget = this.#triggerButton;
      this.#popup.align = `bottom, ${this.locale.isRTL() || ['lg', 'full'].includes(this.size) ? 'right' : 'left'}`;
      this.#popup.arrow = 'bottom';
      this.#popup.positionStyle = this.isCalendarToolbar ? 'fixed' : 'absolute';
      this.#popup.y = 16;
      this.#popup.visible = true;

      this.container?.classList.add('is-open');

      this.#monthView.focus();

      if (this.isCalendarToolbar) {
        this.container?.removeAttribute('tabindex');
      }
    } else {
      if (this.#monthView.selectDay) {
        this.#monthView.selectDay();
      }
      this.removeOpenEvents();
      this.#popup.visible = false;
      this.#popup.setAttribute('tabindex', -1);

      this.container?.classList.remove('is-open');

      if (this.isCalendarToolbar) {
        this.container?.setAttribute('tabindex', '0');
      }

      // Close and reset month/year picker when main popup is closed
      const picklist = this.#monthView?.container?.querySelector('ids-date-picker');

      if (picklist?.expanded) {
        picklist.expanded = false;
        picklist.month = this.month;
        picklist.year = this.year;
      }
    }
  }

  /**
   * Get a list of years to be attached to the picklist
   * @returns {string|undefined} years list items
   */
  #getPicklistYears(): string | undefined {
    const disabledSettings: IdsDisableSettings = getClosest(this, 'ids-month-view')?.disable;
    const startYear: number = this.year - 2;
    const years: string = Array.from({ length: PICKLIST_LENGTH }).map((_, index) => {
      const year: number = startYear + index;
      const isDisabled: boolean | undefined = disabledSettings?.years?.includes(year);

      return `<li
        data-year="${year}"
        class="picklist-item is-year${index === PICKLIST_LENGTH - 1 ? ' is-last' : ''}${isDisabled ? ' is-disabled' : ''}"
      ><ids-text${isDisabled ? ' disabled="true"' : ''}>${year}</ids-text></li>`;
    }).join('');

    return years;
  }

  /**
   * Get a list of months to be attached to the picklist
   * @returns {string|undefined} months list items
   */
  #getPicklistMonths(): string | undefined {
    const monthsList: Array<string> = MONTH_KEYS.map((item) => this.locale?.translate(`MonthWide${item}`));

    const months: string = monthsList?.map((item: string, index: number) => `<li
        data-month="${index}"
        class="picklist-item is-month${index === PICKLIST_LENGTH - 1 || index === 11 ? ' is-last' : ''}"
      ><ids-text>${item}</ids-text></li>`).filter(
      (_, index: number) => (this.month <= PICKLIST_LENGTH - 1 && index <= PICKLIST_LENGTH - 1)
        || (this.month > PICKLIST_LENGTH - 1 && index > PICKLIST_LENGTH - 1)
    ).join('');

    return months;
  }

  /**
   * Get a list of week numbers to be attached to the picklist
   * @returns {string|undefined} week numbers items
   */
  #getPicklistWeeks(): string | undefined {
    const currentWeek: number = weekNumber(new Date(this.year, this.month, this.day));
    const startWeek: number = currentWeek <= PICKLIST_LENGTH ? 1 : currentWeek - 2;
    const weeks: string = Array.from({ length: PICKLIST_LENGTH }).map((_, index) => {
      const weekIndex: number = startWeek + index;
      const week: number = this.#getWeekNumber(weekIndex);

      return `<li
        data-week="${week}"
        class="picklist-item is-week${index === PICKLIST_LENGTH - 1 ? ' is-last' : ''}"
      ><ids-text>${week}</ids-text></li>`;
    }).join('');

    return weeks;
  }

  /**
   * Render month/year picklist
   */
  #attachPicklist() {
    if (!this.isDropdown) return;

    const template = `
      ${this.showPicklistWeek ? `
        <div class="picklist-section">
          <ul class="picklist-list">
            <li class="picklist-item is-btn-up is-week-nav">
              <ids-text audible="true" translate-text="true">PreviousWeek</ids-text>
              <ids-icon icon="chevron-up"></ids-icon>
            </li>
            ${this.#getPicklistWeeks()}
            <li class="picklist-item is-btn-down is-week-nav">
              <ids-text audible="true" translate-text="true">NextWeek</ids-text>
              <ids-icon icon="chevron-down"></ids-icon>
            </li>
          </ul>
        </div>
      ` : ''}
      ${this.showPicklistMonth && !this.showPicklistWeek ? `
        <div class="picklist-section">
          <ul class="picklist-list">
            <li class="picklist-item is-btn-up is-month-nav">
              <ids-text audible="true" translate-text="true">PreviousMonth</ids-text>
              <ids-icon icon="chevron-up"></ids-icon>
            </li>
            ${this.#getPicklistMonths()}
            <li class="picklist-item is-btn-down is-month-nav">
              <ids-text audible="true" translate-text="true">NextMonth</ids-text>
              <ids-icon icon="chevron-down"></ids-icon>
            </li>
          </ul>
        </div>
      ` : ''}
      ${this.showPicklistYear ? `
        <div class="picklist-section">
          <ul class="picklist-list">
            <li class="picklist-item is-btn-up is-year-nav">
              <ids-text audible="true" translate-text="true">PreviousYear</ids-text>
              <ids-icon icon="chevron-up"></ids-icon>
            </li>
            ${this.#getPicklistYears()}
            <li class="picklist-item is-btn-down is-year-nav">
              <ids-text audible="true" translate-text="true">NextYear</ids-text>
              <ids-icon icon="chevron-down"></ids-icon>
            </li>
          </ul>
        </div>
      ` : ''}
    `;

    this.container?.querySelectorAll('.picklist-section').forEach((el: Element) => el?.remove());
    this.container?.querySelector('.picklist')?.insertAdjacentHTML('afterbegin', template);
  }

  /**
   * Loop through the year list and increase/descrese year depends on the param
   * @param {boolean} isNext increase/descrese picklist year
   */
  #picklistYearPaged(isNext: boolean) {
    const disabledSettings: IdsDisableSettings = getClosest(this, 'ids-month-view')?.disable;

    this.container?.querySelectorAll('.picklist-item.is-year').forEach((el: any) => {
      const elYear: number = stringToNumber(el.dataset.year);
      const year: number = isNext ? elYear + PICKLIST_LENGTH : elYear - PICKLIST_LENGTH;
      const isDisabled: boolean | undefined = disabledSettings?.years?.includes(year);

      el.dataset.year = year;
      el.querySelector('ids-text').textContent = year;

      el.classList.toggle('is-disabled', isDisabled);
      el.querySelector('ids-text').disabled = isDisabled;

      if (el.classList.contains('is-selected') && !isDisabled) {
        this.#selectPicklistEl(el);

        this.year = year;
      }
    });
  }

  /**
   * Loop through the entire list of the months
   */
  #picklistMonthPaged() {
    const monthsList: Array<string> = MONTH_KEYS.map((item) => this.locale?.translate(`MonthWide${item}`));

    this.container?.querySelectorAll('.picklist-item.is-month').forEach((el: any, index: number) => {
      const elMonth: number = stringToNumber(el.dataset.month);
      const month: number = elMonth > PICKLIST_LENGTH - 1 ? 0 + index : PICKLIST_LENGTH + index;

      el.dataset.month = month;
      el.querySelector('ids-text').textContent = monthsList[month];

      if (el.classList.contains('is-selected')) {
        this.#selectPicklistEl(el);

        this.month = month;
      }
    });
  }

  /**
   * Loop through the week list and increase/descrese week depends on the param
   * @param {boolean} isNext increase/descrese picklist week
   */
  #picklistWeekPaged(isNext: boolean) {
    this.container?.querySelectorAll('.picklist-item.is-week').forEach((el: any) => {
      const elWeek: number = stringToNumber(el.dataset.week);
      const weekIndex: number = isNext ? elWeek + PICKLIST_LENGTH : elWeek - PICKLIST_LENGTH;
      const week = this.#getWeekNumber(weekIndex);

      el.dataset.week = week;
      el.querySelector('ids-text').textContent = week;

      if (el.classList.contains('is-selected')) {
        this.#selectPicklistEl(el);
      }
    });
  }

  /**
   * Helper to get week number from paginated index
   * @param {number} weekIndex index number as it comes from the paged loop
   * @returns {number} week number
   */
  #getWeekNumber(weekIndex: number) {
    // Get total number of weeks in the year by getting week number of the last day of the year
    const totalWeeks = weekNumber(new Date(this.year, 11, 31), this.firstDayOfWeek);

    if (weekIndex > totalWeeks) {
      return weekIndex % totalWeeks;
    }

    if (weekIndex < 1) {
      return totalWeeks + weekIndex;
    }

    return weekIndex;
  }

  /**
   * Set month and day params based on week number
   * @param {number} week number of a week
   */
  #setWeekDate(week: number) {
    const date = weekNumberToDate(this.year, week, this.firstDayOfWeek);

    this.month = date.getMonth();
    this.day = date.getDate();
  }

  /**
   * Add selectable/tabbable attributes to picklist element
   * @param {HTMLElement} el element to handle
   */
  #selectPicklistEl(el: HTMLElement | null) {
    el?.classList.add('is-selected');
    el?.setAttribute('tabindex', '0');
    el?.setAttribute('aria-selected', 'true');
    el?.setAttribute('role', 'gridcell');
  }

  /**
   * Reset picklist selectable/tabbable attributes
   * @param {'month'|'year'|'all'} type of panel to unselect
   */
  #unselectPicklist(type: string) {
    const selector = `.picklist-item${type !== 'all' ? `.is-${type}` : ''}`;

    this.container?.querySelectorAll(selector).forEach((el: Element) => {
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

    this.triggerEvent('dayselected', this, args);
  }

  /**
   * Selected event handler
   * @param {IdsDayselectedEvent} e event from the calendar day selection
   */
  #handleDaySelectedEvent(e: IdsDayselectedEvent): void {
    const inputDate: Date = this.locale.parseDate(this.value, { dateFormat: this.format });

    // Clear action
    // Deselect the selected date by clicking to the selected date
    if (isValidDate(inputDate) && inputDate.getTime() === e.detail.date.getTime()) {
      this.value = '';
      if (this.#monthView.selectDay) {
        this.#monthView.selectDay();
      }
      this.#triggerSelectedEvent();

      return;
    }

    if (this.useRange) {
      if (this.rangeSettings.selectWeek) {
        this.value = [
          this.locale.formatDate(this.#setTime(e.detail.rangeStart as Date), { pattern: this.format }),
          this.rangeSettings.separator,
          e.detail.rangeEnd && this.locale.formatDate(this.#setTime(e.detail.rangeEnd), { pattern: this.format })
        ].filter(Boolean).join('');

        this.#togglePopup(false);
        this.focus();
        this.#triggerSelectedEvent();

        return;
      }

      const btnApply = this.container?.querySelector('.popup-btn-apply');

      if (e.detail.rangeStart && e.detail.rangeEnd) {
        btnApply?.removeAttribute('disabled');
      } else {
        btnApply?.setAttribute('disabled', 'true');
      }
    } else {
      this.value = this.locale.formatDate(
        this.#setTime(e.detail.date),
        { pattern: this.format }
      );
      this.#togglePopup(false);
      this.focus();
      this.#triggerSelectedEvent();
    }
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

    if (this.useRange) {
      if (this.rangeSettings.end || (this.rangeSettings.start && !this.rangeSettings.end)) {
        if (this.rangeSettings.minDays && (this.rangeSettings.start === this.rangeSettings.end)) {
          this.rangeSettings.start = subtractDate(this.rangeSettings.start, this.rangeSettings.minDays, 'days');
        }

        this.value = [
          this.locale.formatDate(this.#setTime(this.rangeSettings.start), { pattern: this.format }),
          this.rangeSettings.separator,
          this.locale.formatDate(
            this.#setTime(this.rangeSettings.end ?? this.#monthView.activeDate),
            { pattern: this.format }
          ),
        ].filter(Boolean).join('');

        this.#togglePopup(false);
        this.#triggerField?.focus();
        this.#triggerSelectedEvent();
      } else {
        this.value = this.locale.formatDate(
          this.#setTime(this.rangeSettings.start ?? this.#monthView.activeDate),
          { pattern: this.format }
        );
        this.rangeSettings = {
          start: this.#monthView.activeDate
        };
      }

      return;
    }

    this.value = this.locale.formatDate(
      this.#setTime(this.#monthView.activeDate),
      { pattern: this.format }
    );
    this.#togglePopup(false);
    this.#triggerField?.focus();
    this.#triggerSelectedEvent();
  }

  /**
   * Click to picklist elements event handler
   * @param {MouseEvent} e click event
   */
  #handlePicklistEvent(e: MouseEvent) {
    if (!e.target) return;
    e.stopPropagation();
    const btnUpYear: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-up.is-year-nav');
    const btnDownYear: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-down.is-year-nav');
    const btnUpMonth: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-up.is-month-nav');
    const btnDownMonth: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-down.is-month-nav');
    const btnUpWeek: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-up.is-week-nav');
    const btnDownWeek: HTMLElement | null = (e.target as HTMLElement).closest('.is-btn-down.is-week-nav');
    const monthItem: HTMLElement | null = (e.target as HTMLElement).closest('.is-month');
    const yearItem: HTMLElement | null = (e.target as HTMLElement).closest('.is-year');
    const weekItem: HTMLElement | null = (e.target as HTMLElement).closest('.is-week');

    if (btnUpYear) {
      this.#picklistYearPaged(false);
    }

    if (btnDownYear) {
      this.#picklistYearPaged(true);
    }

    if (btnUpMonth || btnDownMonth) {
      this.#picklistMonthPaged();
    }

    if (btnUpWeek) {
      this.#picklistWeekPaged(false);
    }

    if (btnDownWeek) {
      this.#picklistWeekPaged(true);
    }

    if (monthItem) {
      this.#unselectPicklist('month');
      this.#selectPicklistEl(monthItem);
      monthItem.focus();

      this.month = monthItem.dataset.month as string;
    }

    if (yearItem) {
      const disabledSettings: IdsDisableSettings = getClosest(this, 'ids-month-view')?.disable;
      const isDisabled: boolean | undefined = disabledSettings?.years?.includes(stringToNumber(yearItem.dataset.year));

      if (isDisabled) return;

      this.#unselectPicklist('year');
      this.#selectPicklistEl(yearItem);
      yearItem.focus();

      this.year = yearItem.dataset.year as string;
    }

    if (weekItem) {
      this.#unselectPicklist('week');
      this.#selectPicklistEl(weekItem);
      weekItem.focus();

      const week = stringToNumber(weekItem.dataset.week);
      const date = weekNumberToDate(this.year, week, this.firstDayOfWeek);

      this.month = date.getMonth();
      this.day = date.getDate();
    }
  }

  /**
   * Keyboard events handler
   * @param {KeyboardEvent} e keyboard event
   */
  #handleKeyDownEvent(e: KeyboardEvent): void {
    const key = e.keyCode;
    const stopEvent = () => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    };

    if (!this.container) return;

    // Date Picker Dropdown keyboard events
    if (this.isDropdown) {
      const btnUpYear = this.container.querySelector('.is-btn-up.is-year-nav');
      const btnDownYear = this.container.querySelector('.is-btn-down.is-year-nav');
      const btnUpMonth = this.container.querySelector('.is-btn-up.is-month-nav');
      const btnDownMonth = this.container.querySelector('.is-btn-down.is-month-nav');
      const btnUpWeek = this.container.querySelector('.is-btn-up.is-week-nav');
      const btnDownWeek = this.container.querySelector('.is-btn-down.is-week-nav');
      const monthSelected = this.container.querySelector('.is-month.is-selected');
      const yearSelected = this.container.querySelector('.is-year.is-selected');
      const weekSelected = this.container.querySelector('.is-week.is-selected');

      // Enter on picklist year btn up
      if (key === 13 && btnUpYear?.matches(':focus')) {
        this.#picklistYearPaged(false);
      }

      // Enter on picklist year btn down
      if (key === 13 && btnDownYear?.matches(':focus')) {
        this.#picklistYearPaged(true);
      }

      // Enter on picklist month btn up/down
      if (key === 13 && (btnUpMonth?.matches(':focus') || btnDownMonth?.matches(':focus'))) {
        this.#picklistMonthPaged();
      }

      // Enter on picklist week btn up
      if (key === 13 && btnUpWeek?.matches(':focus')) {
        this.#picklistWeekPaged(false);
      }

      // Enter on picklist week btn down
      if (key === 13 && btnDownWeek?.matches(':focus')) {
        this.#picklistWeekPaged(true);
      }

      // Arrow Up on picklist month
      if (key === 38 && monthSelected?.matches(':focus')) {
        const month = this.month - 1;
        const el = this.container.querySelector(`.is-month[data-month="${month}"]`);

        this.#unselectPicklist('month');

        if (!el) {
          btnUpMonth?.focus();

          return;
        }

        this.#selectPicklistEl(el);
        this.month = month;
        el?.focus();
      }

      // Arrow Down on picklist month
      if (key === 40 && monthSelected?.matches(':focus')) {
        const month = this.month + 1;
        const el = this.container.querySelector(`.is-month[data-month="${month}"]`);

        this.#unselectPicklist('month');

        if (!el) {
          btnDownMonth?.focus();

          return;
        }

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
          btnUpYear?.focus();

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
          btnDownYear?.focus();

          return;
        }

        this.#selectPicklistEl(el);
        this.year = year;
        el?.focus();
      }

      // Arrow Up on picklist week
      if (key === 38 && weekSelected?.matches(':focus')) {
        const weekIndex: number = stringToNumber(weekSelected.dataset.week) - 1;
        const week: number = this.#getWeekNumber(weekIndex);
        const el = this.container.querySelector(`.is-week[data-week="${week}"]`);

        this.#unselectPicklist('week');

        if (!el) {
          btnUpWeek?.focus();

          return;
        }

        this.#selectPicklistEl(el);
        this.#setWeekDate(week);

        el?.focus();
      }

      // Arrow Down on picklist year
      if (key === 40 && weekSelected?.matches(':focus')) {
        const weekIndex: number = stringToNumber(weekSelected.dataset.week) + 1;
        const week: number = this.#getWeekNumber(weekIndex);
        const el = this.container.querySelector(`.is-week[data-week="${week}"]`);

        this.#unselectPicklist('week');

        if (!el) {
          btnDownWeek?.focus();

          return;
        }

        this.#selectPicklistEl(el);
        this.#setWeekDate(week);

        el?.focus();
      }

      // Arrow Up on year btn up
      if (key === 38 && btnUpYear?.matches(':focus')) {
        btnDownYear?.focus();

        return;
      }

      // Arrow Down on year btn down
      if (key === 40 && btnDownYear?.matches(':focus')) {
        btnUpYear?.focus();

        return;
      }

      // Arrow Up on year btn down
      if (key === 38 && btnDownYear?.matches(':focus')) {
        const el = this.container.querySelector('.is-year.is-last');

        this.#unselectPicklist('year');
        this.#selectPicklistEl(el);
        this.year = el?.dataset?.year || null;
        el?.focus();
      }

      // Arrow Down on year btn up
      if (key === 40 && btnUpYear?.matches(':focus')) {
        const el = this.container.querySelector('.is-year');

        this.#unselectPicklist('year');
        this.#selectPicklistEl(el);
        this.year = el?.dataset.year || null;
        el?.focus();
      }

      // Arrow Up on month btn up
      if (key === 38 && btnUpMonth?.matches(':focus')) {
        btnDownMonth?.focus();

        return;
      }

      // Arrow Down on month btn down
      if (key === 40 && btnDownMonth?.matches(':focus')) {
        btnUpMonth?.focus();

        return;
      }

      // Arrow Up on month btn down
      if (key === 38 && btnDownMonth?.matches(':focus')) {
        const el = this.container.querySelector('.is-month.is-last');

        this.#unselectPicklist('month');
        this.#selectPicklistEl(el);
        this.month = el?.dataset.month || null;
        el?.focus();
      }

      // Arrow Down on month btn up
      if (key === 40 && btnUpMonth?.matches(':focus')) {
        const el = this.container.querySelector('.is-month');

        this.#unselectPicklist('month');
        this.#selectPicklistEl(el);
        this.month = el?.dataset.month || null;
        el?.focus();
      }

      // Arrow Up on week btn up
      if (key === 38 && btnUpWeek?.matches(':focus')) {
        btnDownWeek?.focus();

        return;
      }

      // Arrow Down on week btn down
      if (key === 40 && btnDownWeek?.matches(':focus')) {
        btnUpWeek?.focus();

        return;
      }

      // Arrow Up on week btn down
      if (key === 38 && btnDownWeek?.matches(':focus')) {
        const el = this.container.querySelector('.is-week.is-last');

        this.#unselectPicklist('month');
        this.#selectPicklistEl(el);
        this.#setWeekDate(stringToNumber(el?.dataset.week));
        el?.focus();
      }

      // Arrow Down on week btn up
      if (key === 40 && btnUpWeek?.matches(':focus')) {
        const el = this.container.querySelector('.is-week');

        this.#unselectPicklist('week');
        this.#selectPicklistEl(el);
        this.#setWeekDate(stringToNumber(el?.dataset.week));
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
        // Last focusable element
        const btnClear = this.container.querySelector('.popup-btn-clear.is-visible')?.container;
        const btnApply = this.container.querySelector('.popup-btn-apply.is-visible')?.container;
        const dateSelected = this.#monthView?.container.querySelector('td.is-selected');
        const lastFocusable = btnApply || btnClear || dateSelected;

        if (!e.shiftKey && lastFocusable?.matches(':focus')) {
          stopEvent();

          firstFocusable.focus();
        }

        if (e.shiftKey && firstFocusable.hasFocus) {
          stopEvent();

          lastFocusable.focus();
        }
      }

      // 't' sets today date excluding cases where wide/abbreviated months in the input
      if (key === 84 && !this.isCalendarToolbar && !this.format.includes('MMM')) {
        stopEvent();

        this.#changeDate('today');
      }

      if (!this.isCalendarToolbar && !this.value.includes('-')) {
        // '+' increments day
        if (key === 187 || key === 107 || key === 61) {
          stopEvent();

          this.#changeDate('next-day');
        }

        // '-' decrements day
        if (key === 189 || key === 109 || key === 173) {
          stopEvent();

          this.#changeDate('previous-day');
        }
      }

      const btnApply = this.container.querySelector('.popup-btn-apply');
      const yearState = this.#monthView.container?.querySelector('ids-date-picker').shadowRoot?.querySelector('.is-year.is-selected');
      const monthState = this.#monthView.container?.querySelector('ids-date-picker').shadowRoot?.querySelector('.is-month.is-selected');

      // Enter on selected month will move focus to picklist year
      // Enter on selected year will move focus to Apply button
      if (key === 13 && monthState?.matches(':focus')) {
        yearState?.focus();
      } else if (key === 13 && yearState?.matches(':focus')) {
        stopEvent();
        btnApply?.focus();
      }
    }
  }

  /**
   * Trigger expanded event with current params
   * @param {boolean} expanded expanded or collapsed
   * @returns {void}
   */
  #triggerExpandedEvent(expanded: any): void {
    const args = {
      bubbles: true,
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

    const parsedDate = this.locale.parseDate(
      this.#triggerField?.value,
      { dateFormat: this.format }
    );
    const inputDate = this.locale.isIslamic() ? (parsedDate && umalquraToGregorian(
      parsedDate[0],
      parsedDate[1],
      parsedDate[2]
    )) : parsedDate;
    const setDateParams = (date: Date) => {
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
    };

    // Set time picker value
    if (this.#hasTime()) {
      const timePicker = this.container?.querySelector('ids-time-picker');

      if (timePicker) {
        (timePicker as any).value = this.#triggerField?.value;
      }
    }

    if (!this.useRange) {
      setDateParams(inputDate || new Date());

      return;
    }

    const rangeParts: Array<string> = this.#triggerField.value?.split(this.rangeSettings.separator) || [];
    const rangeStart = rangeParts[0] ? this.locale.parseDate(
      rangeParts[0],
      { dateFormat: this.format }
    ) : null;
    const rangeEnd = rangeParts[1] ? this.locale.parseDate(
      rangeParts[1],
      { dateFormat: this.format }
    ) : null;

    if (this.#monthView) {
      this.#monthView.rangeSettings = {
        start: rangeStart,
        end: rangeEnd
      };
    }

    setDateParams(rangeStart ?? new Date());
  }

  /**
   * Applying ids-mask to the input when changing locale or format
   */
  #applyMask() {
    if (this.#triggerField && this.mask) {
      this.#triggerField.maskOptions = { format: this.format, delimeter: this.rangeSettings.separator };
      this.#triggerField.value = this.value;
    }
  }

  /**
   * Change input date based on type
   * @param {string} type of event
   */
  #changeDate(type: string) {
    const date = this.#triggerField?.value
      ? this.locale.parseDate(this.#triggerField.value, { dateFormat: this.format })
      : new Date();

    if (type === 'today') {
      const now = new Date();

      this.value = this.useRange
        ? `${this.locale.formatDate(this.#setTime(now), { pattern: this.format })}${this.rangeSettings.separator}${this.locale.formatDate(this.#setTime(now), { pattern: this.format })}`
        : this.locale.formatDate(this.#setTime(now), { pattern: this.format });
    }

    if (type === 'next-day' && !this.useRange) {
      this.value = this.locale.formatDate(addDate(date, 1, 'days'), { pattern: this.format });
    }

    if (type === 'previous-day' && !this.useRange) {
      this.value = this.locale.formatDate(subtractDate(date, 1, 'days'), { pattern: this.format });
    }
  }

  /**
   * Valid date validation extend validation mixin
   */
  #setDateValidation(): void {
    if (this.validate?.includes('date')) {
      this.#triggerField?.addValidationRule({
        id: 'date',
        type: 'error',
        message: this.locale?.translate('InvalidDate'),
        check: (input: any) => {
          if (!input.value) return true;

          const date: Date | undefined = this.locale.parseDate(
            input.value,
            this.format
          );

          return isValidDate(date);
        }
      });
    }
  }

  /**
   * Available date validation extend validation mixin
   * Uses month view to define if date is available
   */
  #setAvailableDateValidation(): void {
    if (this.validate?.includes('availableDate')) {
      this.#triggerField.addValidationRule({
        id: 'availableDate',
        type: 'error',
        message: this.locale?.translate('UnavailableDate'),
        check: (input: any) => {
          if (!input.value) return true;

          const date: Date | undefined = this.locale.parseDate(
            input.value,
            this.format
          );

          return isValidDate(date) && !this.#monthView?.isDisabledByDate(date);
        }
      });
    }
  }

  /**
   * Focuses input or dropdown
   * @returns {void}
   */
  focus(): void {
    this.#triggerField?.focus();
    this.container?.querySelector('ids-toggle-button')?.container?.focus();

    if (this.isCalendarToolbar) {
      this.container?.focus();
    }
  }

  /**
   * Public method to open calendar popup
   * @returns {void}
   */
  open(): void {
    this.#togglePopup(true);
  }

  /**
   * Public method to close calendar popup
   * @returns {void}
   */
  close(): void {
    this.#togglePopup(false);
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
   * Indicates if input, dropdown or the calendar toolbar has focus
   * @returns {boolean} whether or not an element has focus
   */
  get hasFocus(): boolean {
    const input = this.#triggerField?.container.querySelector('input');
    const dropdown = this.container?.querySelector('.dropdown-btn')?.shadowRoot?.querySelector('button');

    return input?.matches(':focus') || dropdown?.matches(':focus');
  }

  /**
   * value attribute
   * @returns {string} value param
   */
  get value(): string {
    return this.getAttribute(attributes.VALUE) ?? '';
  }

  /**
   * Set input value. Should parse a date from the value
   * Set dropdown button text if the component is dropdown
   * Set text if the component is used in calendar toolbar
   * @param {string|null} val value param
   */
  set value(val: string | null) {
    const textEl = this.container?.querySelector('.datepicker-text');
    const dropdownEl = this.container?.querySelector('.dropdown-btn-text');

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
  }

  /**
   * placeholder attribute
   * @returns {string} placeholder param
   */
  get placeholder(): string {
    const boolVal = stringToBool(this.getAttribute(attributes.PLACEHOLDER));

    return boolVal ? this.format : '';
  }

  /**
   * Set input placeholder
   * @param {boolean|string|null} val of placeholder to be set
   */
  set placeholder(val: boolean | string | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.PLACEHOLDER, this.placeholder);
      this.#triggerField?.setAttribute(attributes.PLACEHOLDER, this.placeholder);
    } else {
      this.removeAttribute(attributes.PLACEHOLDER);
      this.#triggerField?.removeAttribute(attributes.PLACEHOLDER);
    }
  }

  /**
   * label attribute
   * @returns {string} label param
   */
  get label(): string {
    return this.getAttribute(attributes.LABEL) ?? '';
  }

  /**
   * Set trigger field label
   * @param {string|null} val of label to be set
   */
  set label(val: string | null) {
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
  get disabled(): boolean {
    const attrVal = this.getAttribute(attributes.DISABLED);

    return stringToBool(attrVal);
  }

  /**
   * Set trigger field disabled attribute
   * @param {string|boolean|null} val disabled param value
   */
  set disabled(val: string | boolean | null) {
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
  get readonly(): boolean {
    const attrVal = this.getAttribute(attributes.READONLY);

    return stringToBool(attrVal);
  }

  /**
   * Set trigger field readonly attribute
   * @param {string|boolean|null} val readonly param value
   */
  set readonly(val: string | boolean | null) {
    const boolVal: boolean = stringToBool(val);

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
   * default is sm
   * @returns {string} size param
   */
  get size(): string { return this.getAttribute(attributes.SIZE) ?? 'sm'; }

  /**
   * Set the size (width) of input
   * @param {string|null} val [xs, sm, mm, md, lg, full]
   */
  set size(val: string | null) {
    if (val) {
      this.setAttribute(attributes.SIZE, val);
      this.#triggerField?.setAttribute(attributes.SIZE, val);
    } else {
      this.removeAttribute(attributes.SIZE);
      this.#triggerField?.setAttribute(attributes.SIZE, 'sm');
    }
  }

  /**
   * tabbable attribute
   * @returns {boolean} tabbable param
   */
  get tabbable(): boolean {
    const attrVal = this.getAttribute(attributes.TABBABLE);

    // tabbable by default
    return attrVal !== null ? stringToBool(attrVal) : true;
  }

  /**
   * Set trigger field tabbable attribute
   * @param {boolean|string|null} val true of false depending if the trigger field is tabbable
   */
  set tabbable(val: boolean | string | null) {
    this.setAttribute(attributes.TABBABLE, val);
    this.#triggerButton?.setAttribute(attributes.TABBABLE, val);
  }

  /**
   * id attribute
   * @returns {string} id param
   */
  get id(): string { return this.getAttribute(attributes.ID) ?? ''; }

  /**
   * Set trigger field/input id attribute
   * @param {string} val id
   */
  set id(val: string) {
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
  get validate(): string | null { return this.getAttribute(attributes.VALIDATE); }

  /**
   * Set trigger field/input validation
   * @param {string|null} val validate param
   */
  set validate(val: string | null) {
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

    this.#setDateValidation();
    this.#setAvailableDateValidation();
  }

  /**
   * validation-events attributes
   * @returns {string} validationEvents param. Default is 'change blur'
   */
  get validationEvents(): string { return this.getAttribute(attributes.VALIDATION_EVENTS) ?? 'change blur'; }

  /**
   * Set which input events to fire validation on
   * @param {string|null} val validation-events attribute
   */
  set validationEvents(val: string | null) {
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
      this.#triggerField?.setAttribute(attributes.FORMAT, val);
    } else {
      this.removeAttribute(attributes.FORMAT);
      this.#triggerField?.removeAttribute(attributes.FORMAT);
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

    this.#applyMask();
  }

  /**
   * is-calendar-toolbar attribute
   * @returns {boolean} isCalendarToolbar param converted to boolean from attribute value
   */
  get isCalendarToolbar(): boolean {
    const attrVal = this.getAttribute(attributes.IS_CALENDAR_TOOLBAR);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component is used in calendar toolbar
   * @param {string|boolean|null} val is-calendar-toolbar attribute
   */
  set isCalendarToolbar(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.IS_CALENDAR_TOOLBAR, boolVal);
    } else {
      this.removeAttribute(attributes.IS_CALENDAR_TOOLBAR);
    }

    // Toggle container CSS class
    this.container?.classList.toggle('is-calendar-toolbar', boolVal);
  }

  /**
   * is-dropdown attribute
   * @returns {boolean} isDropdown param converted to boolean from attribute value
   */
  get isDropdown(): boolean {
    const attrVal = this.getAttribute(attributes.IS_DROPDOWN);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component is dropdown type
   * @param {string|boolean|null} val is-dropdown attribute value
   */
  set isDropdown(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.IS_DROPDOWN, boolVal);
    } else {
      this.removeAttribute(attributes.IS_DROPDOWN);
    }

    // Toggle container CSS class
    this.container?.classList.toggle('is-dropdown', boolVal);
  }

  /**
   * show-today attribute
   * @returns {boolean} showToday param converted to boolean from attribute value
   */
  get showToday(): boolean {
    const attrVal = this.getAttribute(attributes.SHOW_TODAY);

    // true by default if no attribute
    return attrVal !== null ? stringToBool(attrVal) : true;
  }

  /**
   * Set whether or not month view today button should be show
   * @param {string|boolean|null} val show-today attribute value
   */
  set showToday(val: string | boolean | null) {
    this.setAttribute(attributes.SHOW_TODAY, val);
    this.#monthView?.setAttribute(attributes.SHOW_TODAY, val);
    this.#attachExpandedListener();
  }

  /**
   * fist-day-of-week attribute for calendar popup
   * If not set the information comes from the locale. If not set in the locale defaults to 0
   * @returns {number} firstDayOfWeek param
   */
  get firstDayOfWeek(): number {
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
  set firstDayOfWeek(val: string | number | null) {
    this.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
    this.#monthView?.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
  }

  /**
   * month attribute
   * @returns {number} month param
   */
  get month(): number {
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
  set month(val: string | number | null) {
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
   * Sets the no margins attribute
   * @param {boolean} value The value for no margins attribute
   */
  set noMargins(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.NO_MARGINS, '');
      this.#triggerField?.setAttribute(attributes.NO_MARGINS, '');
      return;
    }
    this.removeAttribute(attributes.NO_MARGINS);
    this.#triggerField?.removeAttribute(attributes.NO_MARGINS);
  }

  get noMargins() {
    return stringToBool(this.getAttribute(attributes.NO_MARGINS));
  }

  /**
   * year attribute
   * @returns {number} year param converted to number from attribute value
   */
  get year(): number {
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
  set year(val: string | number | null) {
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
  get day(): number {
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
  set day(val: string | number | null) {
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
   * @returns {HTMLInputElement} Reference to the IdsTriggerField
   */
  get input() {
    return this.#triggerField;
  }

  /**
   * expanded attribute
   * @returns {boolean} whether the month/year picker expanded or not
   */
  get expanded(): boolean {
    return stringToBool(this.getAttribute(attributes.EXPANDED));
  }

  /**
   * Set whether or not the month/year picker should be expanded
   * @param {string|boolean|null} val expanded attribute value
   */
  set expanded(val: string | boolean | null) {
    if (!this.isDropdown || !this.container) return;

    const boolVal = stringToBool(val);

    this.container.querySelector('ids-expandable-area').expanded = boolVal;
    this.container.classList.toggle('is-expanded', boolVal);
    this.#triggerExpandedEvent(boolVal);

    if (boolVal) {
      this.#attachPicklist();
      const monthViewHeight: number = getClosest(this, 'ids-month-view')?.container.offsetHeight || 0;
      const timePickerHeight: number = getClosest(this, 'ids-month-view')?.parentElement
        ?.querySelector('ids-time-picker')?.container.offsetHeight || 0;

      this.container.querySelector('.picklist')?.style.setProperty('height', `${monthViewHeight + timePickerHeight - 48}px`);

      const monthEl = this.container.querySelector(`.picklist-item.is-month[data-month="${this.month}"]`);
      const yearEl = this.container.querySelector(`.picklist-item.is-year[data-year="${this.year}"]`);
      const week = weekNumber(new Date(this.year, this.month, this.day), this.firstDayOfWeek);
      const weekEl = this.container.querySelector(`.picklist-item.is-week[data-week="${week}"]`);
      const picklistBtns: any = this.container.querySelectorAll('.picklist-item.is-btn-up, .picklist-item.is-btn-down');

      this.#selectPicklistEl(monthEl);
      this.#selectPicklistEl(yearEl);
      this.#selectPicklistEl(weekEl);

      picklistBtns.forEach((item: HTMLElement) => {
        item.setAttribute('tabindex', '0');
      });

      this.container.querySelector('.picklist-item.is-selected')?.focus();

      this.setAttribute(attributes.EXPANDED, boolVal);
    } else {
      this.#unselectPicklist('all');
      this.removeAttribute(attributes.EXPANDED);
    }
  }

  /**
   * @returns {Array<IdsLegend>} array of legend items
   */
  get legend(): Array<IdsLegend> {
    return this.#monthView?.legend;
  }

  /**
   * Set array of legend items to month view component
   * Validation of data is provided by the month view component
   * @param {Array<IdsLegend>|null} val array of legend items
   */
  set legend(val: Array<IdsLegend> | null) {
    if (this.#monthView) {
      this.#monthView.legend = val;
    }
  }

  /**
   * Get range settings for month view component
   * @returns {object} month view range settings
   */
  get rangeSettings(): IdsRangeSettings {
    return this.#monthView?.rangeSettings;
  }

  /**
   * Pass range selection settings for month view component
   * and update input value if passed settings contain start/end
   * @param {object} val settings to be assigned to default range settings
   */
  set rangeSettings(val: IdsRangeSettings) {
    if (this.#monthView) {
      const btnApply = this.container?.querySelector('.popup-btn-apply');
      this.#monthView.rangeSettings = val;

      if (val?.start && val?.end) {
        this.value = `${this.locale.formatDate(this.#setTime(val.start), { pattern: this.format })}${this.rangeSettings.separator}${this.locale.formatDate(this.#setTime(val.end), { pattern: this.format })}`;
        btnApply?.removeAttribute('disabled');
      }

      if (val?.selectWeek) {
        btnApply?.setAttribute('hidden', 'true');
      }
    }
  }

  /**
   * use-range attribute
   * @returns {boolean} useRange param converted to boolean from attribute value
   */
  get useRange(): boolean {
    const attrVal = this.getAttribute(attributes.USE_RANGE);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component should be a range picker
   * @param {string|boolean|null} val useRange param value
   */
  set useRange(val: string | boolean | null) {
    const boolVal = stringToBool(val);
    const btnApply = this.container?.querySelector('.popup-btn-apply');

    if (boolVal) {
      this.setAttribute(attributes.USE_RANGE, boolVal);
      this.#monthView?.setAttribute(attributes.USE_RANGE, boolVal);
      btnApply?.removeAttribute('hidden');
      btnApply?.setAttribute('disabled', 'true');
    } else {
      this.removeAttribute(attributes.USE_RANGE);
      this.#monthView?.removeAttribute(attributes.USE_RANGE);
      btnApply?.setAttribute('hidden', 'true');
      btnApply?.removeAttribute('disabled');
    }
  }

  /**
   * @returns {IdsDisableSettings} disable settings object
   */
  get disable(): IdsDisableSettings {
    return this.#monthView?.disable;
  }

  /**
   * Set disable settings
   * @param {IdsDisableSettings} val settings to be assigned to default disable settings
   */
  set disable(val: IdsDisableSettings) {
    if (this.#monthView) {
      this.#monthView.disable = val;
    }
  }

  /**
   * mask attribute
   * @returns {boolean} if date mask is enabled
   */
  get mask(): boolean {
    const attrVal = this.getAttribute(attributes.MASK);

    return stringToBool(attrVal);
  }

  /**
   * Enable/disable date mask for the input
   * @param {string|boolean|null} val mask param value
   */
  set mask(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.MASK, boolVal);
      this.#triggerField?.setAttribute(attributes.MASK, this.useRange ? 'rangeDate' : 'date');
    } else {
      this.removeAttribute(attributes.MASK);
      this.#triggerField?.removeAttribute(attributes.MASK);
    }
  }

  /**
   * minute-interval attribute
   * @returns {number} minuteInterval value
   */
  get minuteInterval(): number {
    return stringToNumber(this.getAttribute(attributes.MINUTE_INTERVAL));
  }

  /**
   * Set interval in minutes dropdown
   * @param {string|number|null} val minute-interval attribute value
   */
  set minuteInterval(val: string | number | null) {
    const numberVal = stringToNumber(val);
    const timePicker = this.container?.querySelector('ids-time-picker');

    if (numberVal) {
      this.setAttribute(attributes.MINUTE_INTERVAL, numberVal);
      timePicker?.setAttribute(attributes.MINUTE_INTERVAL, numberVal.toString());
    } else {
      this.removeAttribute(attributes.MINUTE_INTERVAL);
      timePicker?.removeAttribute(attributes.MINUTE_INTERVAL);
    }
  }

  /**
   * second-interval attribute
   * @returns {number} secondInterval value
   */
  get secondInterval(): number {
    return stringToNumber(this.getAttribute(attributes.SECOND_INTERVAL));
  }

  /**
   * Set interval in seconds dropdown
   * @param {string|number|null} val second-interval attribute value
   */
  set secondInterval(val: string | number | null) {
    const numberVal = stringToNumber(val);
    const timePicker = this.container?.querySelector('ids-time-picker');

    if (numberVal) {
      this.setAttribute(attributes.SECOND_INTERVAL, numberVal);
      timePicker?.setAttribute(attributes.SECOND_INTERVAL, numberVal.toString());
    } else {
      this.removeAttribute(attributes.SECOND_INTERVAL);
      timePicker?.removeAttribute(attributes.SECOND_INTERVAL);
    }
  }

  /**
   * show-clear attribute
   * @returns {boolean} showClear param converted to boolean from attribute value
   */
  get showClear(): boolean {
    return stringToBool(this.getAttribute(attributes.SHOW_CLEAR));
  }

  /**
   * Set whether or not to show clear button in the calendar popup
   * @param {string|boolean|null} val show-clear attribute value
   */
  set showClear(val: string | boolean | null) {
    const boolVal = stringToBool(val);
    const btn = this.container?.querySelector('.popup-btn-clear');

    if (boolVal) {
      this.setAttribute(attributes.SHOW_CLEAR, boolVal);
      btn?.removeAttribute('hidden');
    } else {
      this.removeAttribute(attributes.SHOW_CLEAR);
      btn?.setAttribute('hidden', (!boolVal).toString());
    }

    btn?.classList.toggle('is-visible', boolVal);
  }

  /**
   * show-cancel attribute
   * @returns {boolean} showCancel param converted to boolean from attribute value
   */
  get showCancel(): boolean {
    return stringToBool(this.getAttribute(attributes.SHOW_CANCEL));
  }

  /**
   * Set whether or not to show cancel button when the picker is expanded
   * @param {string|boolean|null} val show-cancel attribute value
   */
  set showCancel(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.SHOW_CANCEL, boolVal);
    } else {
      this.removeAttribute(attributes.SHOW_CANCEL);
    }
  }

  /**
   * show-picklist-year attribute, default is true
   * @returns {boolean} showPicklistYear param converted to boolean from attribute value
   */
  get showPicklistYear(): boolean {
    const attrVal = this.getAttribute(attributes.SHOW_PICKLIST_YEAR);

    if (attrVal) {
      return stringToBool(attrVal);
    }

    return true;
  }

  /**
   * Whether or not to show a list of years in the picklist
   * @param {string | boolean | null} val value to be set as show-picklist-year attribute converted to boolean
   */
  set showPicklistYear(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    this.setAttribute(attributes.SHOW_PICKLIST_YEAR, boolVal);
    this.#monthView?.setAttribute(attributes.SHOW_PICKLIST_YEAR, boolVal);
  }

  /**
   * show-picklist-month attribute, default is true
   * @returns {boolean} showPicklistMonth param converted to boolean from attribute value
   */
  get showPicklistMonth(): boolean {
    const attrVal = this.getAttribute(attributes.SHOW_PICKLIST_MONTH);

    if (attrVal) {
      return stringToBool(attrVal);
    }

    return true;
  }

  /**
   * Whether or not to show a list of months in the picklist
   * @param {string | boolean | null} val value to be set as show-picklist-month attribute converted to boolean
   */
  set showPicklistMonth(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    this.setAttribute(attributes.SHOW_PICKLIST_MONTH, boolVal);
    this.#monthView?.setAttribute(attributes.SHOW_PICKLIST_MONTH, boolVal);
  }

  /**
   * show-picklist-week attribute
   * @returns {boolean} showPicklistWeek param converted to boolean from attribute value
   */
  get showPicklistWeek(): boolean {
    return stringToBool(this.getAttribute(attributes.SHOW_PICKLIST_WEEK));
  }

  /**
   * Whether or not to show week numbers in the picklist
   * @param {string | boolean | null} val value to be set as show-picklist-week attribute converted to boolean
   */
  set showPicklistWeek(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.SHOW_PICKLIST_WEEK, boolVal);
      this.#monthView?.setAttribute(attributes.SHOW_PICKLIST_WEEK, boolVal);
    } else {
      this.removeAttribute(attributes.SHOW_PICKLIST_WEEK);
      this.#monthView?.removeAttribute(attributes.SHOW_PICKLIST_WEEK);
    }
  }

  /**
   * use-current-time attribute
   * @returns {number} useCurrentTime param converted to boolean from attribute value
   */
  get useCurrentTime(): boolean {
    return stringToBool(this.getAttribute(attributes.USE_CURRENT_TIME));
  }

  /**
   * Set whether or not to show current time in the time picker
   * @param {string|boolean|null} val useCurrentTime param value
   */
  set useCurrentTime(val: string | boolean | null) {
    const boolVal = stringToBool(val);
    const timePicker = this.container?.querySelector('ids-time-picker');

    if (boolVal) {
      this.setAttribute(attributes.USE_CURRENT_TIME, boolVal.toString());
      timePicker?.setAttribute(attributes.USE_CURRENT_TIME, boolVal.toString());
    } else {
      this.removeAttribute(attributes.USE_CURRENT_TIME);
      timePicker?.removeAttribute(attributes.USE_CURRENT_TIME);
    }
  }
}

export default IdsDatePicker;

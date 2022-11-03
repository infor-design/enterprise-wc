import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-date-picker-popup-base';
import {
  subtractDate, isValidDate, weekNumberToDate, weekNumber, hoursTo24
} from '../../utils/ids-date-utils/ids-date-utils';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import IdsButton from '../ids-button/ids-button';
import IdsModalButton from '../ids-modal-button/ids-modal-button';
import '../ids-expandable-area/ids-expandable-area';
import './ids-month-year-picklist';
import '../ids-month-view/ids-month-view';
import '../ids-text/ids-text';
import IdsToggleButton from '../ids-toggle-button/ids-toggle-button';
import IdsToolbar from '../ids-toolbar/ids-toolbar';
import IdsToolbarSection from '../ids-toolbar/ids-toolbar-section';

import { IdsPickerPopupCallbacks } from '../ids-picker-popup/ids-picker-popup';

import {
  IdsDatePickerCommonAttributes,
} from './ids-date-picker-common';

// Types
import type {
  IdsRangeSettings,
  IdsDayselectedEvent,
  IdsLegend
} from '../ids-month-view/ids-month-view';

import styles from './ids-date-picker-popup.scss';

type IdsDatePickerPopupButton = IdsToggleButton | IdsModalButton | IdsButton;

/**
 * IDS Date Picker Popup Component
 * @type {IdsDatePickerPopup}
 * @inherits IdsPopup
 * @mixes IdsDateAttributeMixin
 * @mixes IdsLocaleMixin
 */
@customElement('ids-date-picker-popup')
@scss(styles)
class IdsDatePickerPopup extends Base implements IdsPickerPopupCallbacks {
  constructor() {
    super();
  }

  protected expandableArea: any;

  protected monthView: any;

  protected monthYearPicklist: any;

  protected toolbar: IdsToolbar | null | undefined;

  connectedCallback() {
    super.connectedCallback();
    this.expandableArea = this.container?.querySelector('ids-expandable-area');
    this.monthView = this.container?.querySelector('ids-month-view');
    this.monthYearPicklist = this.container?.querySelector('ids-month-year-picklist');
    this.toolbar = this.container?.querySelector<IdsToolbar>('ids-toolbar');
    this.#attachEventListeners();
    this.#attachExpandedListener();
  }

  disconnectedCallback(): void {
    this.disconnectedCallback?.();
    this.expandableArea = null;
    this.monthView = null;
    this.monthYearPicklist = null;
    this.toolbar = null;
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      ...IdsDatePickerCommonAttributes,
      attributes.EXPANDED
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<ids-popup class="ids-date-picker-popup" type="menu" align="bottom, left" arrow="bottom" tabIndex="-1" y="12" animated>
      <slot slot="content" name="toolbar">
        ${this.toolbarTemplate()}
      </slot>
      <div class="ids-date-picker-content" slot="content">
        <ids-expandable-area
          expand-style="fill"
          expanded="${this.expanded}"
        >
          <ids-month-year-picklist slot="pane"></ids-month-year-picklist>
        </ids-expandable-area>
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
      </div>
      <div
        slot="content"
        class="popup-footer"
        part="footer">
        <ids-modal-button class="popup-btn popup-btn-cancel" cancel ${this.showCancel ? '' : ' hidden'}>
          <ids-text translate-text="true" font-weight="bold" part="btn-cancel">Cancel</ids-text>
        </ids-modal-button>
        <ids-modal-button class="popup-btn popup-btn-clear" part="btn-clear" ${this.showClear ? '' : ' hidden'}>
          <ids-text translate-text="true" font-weight="bold">Clear</ids-text>
        </ids-modal-button>
        <ids-modal-button class="popup-btn popup-btn-apply"${this.useRange || this.expanded ? ' disabled' : ' hidden'} part="btn-apply" type="primary">
          <ids-text translate-text="true" font-weight="bold">Apply</ids-text>
        </ids-modal-button>
      </div>
    </ids-popup>`;
  }

  /**
   * @returns {string} containing the inner Toolbar's template
   */
  private toolbarTemplate(): string {
    const prevNextBtn = `<ids-button class="btn-previous">
      <ids-text audible="true" translate-text="true">PreviousMonth</ids-text>
      <ids-icon slot="icon" icon="chevron-left"></ids-icon>
    </ids-button>
    <ids-button class="btn-next">
      <ids-text audible="true" translate-text="true">NextMonth</ids-text>
      <ids-icon slot="icon" icon="chevron-right"></ids-icon>
    </ids-button>`;
    const todayBtn = this.showToday ? `<ids-button css-class="no-padding" class="btn-today">
      <ids-text
        class="month-view-btn-text"
        font-size="16"
        translate-text="true"
        font-weight="bold"
      >Today</ids-text>
    </ids-button>` : '';

    return `<ids-toolbar class="month-view-header" tabbable="true">
      <ids-toolbar-section favor>
        <ids-toggle-button id="month-year-view-trigger" icon-off="dropdown" icon-on="dropdown" icon="dropdown" icon-align="end" no-padding class="dropdown-btn">
          <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
          <ids-text slot="text" class="dropdown-btn-text" font-size="20">${this.formatMonthText()}</ids-text>
          <ids-icon slot="icon" icon="dropdown" class="dropdown-btn-icon"></ids-icon>
        </ids-toggle-button>
      </ids-toolbar-section>
      <ids-toolbar-section class="toolbar-buttonset monthview-nav" align="end" type="fluid"${this.expanded ? ' inactive' : ''}>
        ${todayBtn}
        ${prevNextBtn}
      </ids-toolbar-section>
    </ids-toolbar>`;
  }

  /**
   * @returns {Array<string>} Date Picker vetoable events
   */
  vetoableEventTypes: Array<string> = ['beforeshow'];

  /**
   * @returns {NodeList<IdsDatePickerPopupButton>} containing all buttons in the Date Picker Popup
   */
  get buttons() {
    return this.container?.querySelectorAll<IdsDatePickerPopupButton>('ids-button, ids-modal-button, ids-toggle-button');
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
    const doShow = stringToBool(val);
    if (doShow) {
      this.setAttribute(attributes.SHOW_TODAY, 'true');
      this.todayBtnEl?.removeAttribute(attributes.HIDDEN);
    } else {
      this.setAttribute(attributes.SHOW_TODAY, 'false');
      this.todayBtnEl?.setAttribute(attributes.HIDDEN, 'true');
    }
  }

  onFirstDayOfWeekChange(newValue: number) {
    this.monthView?.setAttribute(attributes.FIRST_DAY_OF_WEEK, newValue);
    this.monthYearPicklist?.setAttribute(attributes.FIRST_DAY_OF_WEEK, newValue);
  }

  onMonthChange(newValue: number, isValid: boolean) {
    if (isValid) {
      this.monthView?.setAttribute(attributes.MONTH, newValue);
      this.monthYearPicklist?.setAttribute(attributes.MONTH, newValue);
    } else {
      this.monthView?.removeAttribute(attributes.MONTH);
      this.monthYearPicklist?.removeAttribute(attributes.MONTH);
    }
  }

  onYearChange(newValue: number, isValid: boolean) {
    if (isValid) {
      this.monthView?.setAttribute(attributes.YEAR, newValue);
      this.monthYearPicklist?.setAttribute(attributes.MONTH, newValue);
    } else {
      this.monthView?.removeAttribute(attributes.YEAR);
      this.monthYearPicklist?.removeAttribute(attributes.YEAR);
    }
  }

  onDayChange(newValue: number, isValid: boolean) {
    if (isValid) {
      this.monthView?.setAttribute(attributes.DAY, newValue);
      this.monthYearPicklist?.setAttribute(attributes.DAY, newValue);
    } else {
      this.monthView?.removeAttribute(attributes.DAY);
      this.monthYearPicklist?.removeAttribute(attributes.DAY);
    }
  }

  hideIfAble(): void {
    // if (this.isCalendarToolbar) {
    if (!this.expanded && this.popup?.visible) {
      this.hide();
    }
  }

  get applyBtnEl(): IdsModalButton | null | undefined {
    return this.container?.querySelector<IdsModalButton>('.popup-btn-apply');
  }

  get cancelBtnEl(): IdsModalButton | null | undefined {
    return this.container?.querySelector<IdsModalButton>('.popup-btn-cancel');
  }

  get todayBtnEl(): IdsButton | null | undefined {
    return this.container?.querySelector<IdsButton>('.btn-today');
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
    const boolVal = stringToBool(val);
    if (boolVal) {
      this.setAttribute(attributes.EXPANDED, `${boolVal}`);
      this.expandableArea?.setAttribute(attributes.EXPANDED, `${boolVal}`);
      this.toolbar?.querySelector<IdsToolbarSection>('.monthview-nav')?.setAttribute(attributes.INACTIVE, 'true');
    } else {
      this.removeAttribute(attributes.EXPANDED);
      this.expandableArea?.removeAttribute(attributes.EXPANDED);
      this.toolbar?.querySelector<IdsToolbarSection>('.monthview-nav')?.removeAttribute(attributes.INACTIVE);
    }
  }

  /**
   * @returns {Array<IdsLegend>} array of legend items
   */
  get legend(): Array<IdsLegend> {
    return this.monthView?.legend;
  }

  /**
   * Set array of legend items to month view component
   * Validation of data is provided by the month view component
   * @param {Array<IdsLegend>|null} val array of legend items
   */
  set legend(val: Array<IdsLegend> | null) {
    if (this.monthView) {
      this.monthView.legend = val;
    }
  }

  /**
   * Get range settings for month view component
   * @returns {object} month view range settings
   */
  get rangeSettings(): IdsRangeSettings {
    return this.monthView?.rangeSettings;
  }

  /**
   * Pass range selection settings for month view component
   * and update input value if passed settings contain start/end
   * @param {object} val settings to be assigned to default range settings
   */
  set rangeSettings(val: IdsRangeSettings) {
    if (this.monthView) {
      const btnApply = this.container?.querySelector('.popup-btn-apply');
      this.monthView.rangeSettings = val;

      if (val?.start && val?.end) {
        this.value = `${this.locale.formatDate(this.#setTime(val.start), { pattern: this.format })}${this.rangeSettings.separator}${this.locale.formatDate(this.#setTime(val.end), { pattern: this.format })}`;
        btnApply?.removeAttribute(attributes.DISABLED);
      }

      if (val?.selectWeek) {
        btnApply?.setAttribute(attributes.HIDDEN, 'true');
      }
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
      this.setAttribute(attributes.SHOW_CLEAR, boolVal.toString());
      btn?.removeAttribute(attributes.HIDDEN);
    } else {
      this.removeAttribute(attributes.SHOW_CLEAR);
      btn?.setAttribute(attributes.HIDDEN, (!boolVal).toString());
    }
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
    const btn = this.container?.querySelector('.popup-btn-cancel');

    if (boolVal) {
      this.setAttribute(attributes.SHOW_CANCEL, String(boolVal));
      btn?.removeAttribute(attributes.HIDDEN);
    } else {
      this.removeAttribute(attributes.SHOW_CANCEL);
      btn?.setAttribute(attributes.HIDDEN, (!boolVal).toString());
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

    this.setAttribute(attributes.SHOW_PICKLIST_YEAR, String(boolVal));
    this.monthYearPicklist?.setAttribute(attributes.SHOW_PICKLIST_YEAR, boolVal);
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

    this.setAttribute(attributes.SHOW_PICKLIST_MONTH, String(boolVal));
    this.monthYearPicklist?.setAttribute(attributes.SHOW_PICKLIST_MONTH, boolVal);
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
      this.setAttribute(attributes.SHOW_PICKLIST_WEEK, String(boolVal));
      this.monthView?.setAttribute(attributes.SHOW_PICKLIST_WEEK, boolVal);
    } else {
      this.removeAttribute(attributes.SHOW_PICKLIST_WEEK);
      this.monthView?.removeAttribute(attributes.SHOW_PICKLIST_WEEK);
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
      this.setAttribute(attributes.USE_RANGE, String(boolVal));
      this.monthView?.setAttribute(attributes.USE_RANGE, boolVal);
      btnApply?.removeAttribute('hidden');
      btnApply?.setAttribute('disabled', 'true');
    } else {
      this.removeAttribute(attributes.USE_RANGE);
      this.monthView?.removeAttribute(attributes.USE_RANGE);
      btnApply?.setAttribute('hidden', 'true');
      btnApply?.removeAttribute('disabled');
    }
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
    if (!val) {
      this.removeAttribute(attributes.VALUE);
    } else {
      const safeValue = this.getFormattedDate(val);
      if (safeValue !== this.value) {
        this.setAttribute(attributes.VALUE, safeValue);
      }

      const dropdownEl = this.container?.querySelector<HTMLElement>('.dropdown-btn-text');
      if (dropdownEl) {
        dropdownEl.innerText = this.formatMonthText();
      }
    }
  }

  private onPicklistExpand() {
    const btnApply = this.applyBtnEl;
    const btnCancel = this.cancelBtnEl;

    this.monthYearPicklist.activatePicklist();
    btnApply?.removeAttribute(attributes.HIDDEN);
    btnApply?.removeAttribute(attributes.DISABLED);

    if (this.showCancel) {
      btnCancel?.removeAttribute(attributes.HIDDEN);
    }
  }

  private onPicklistCollapse() {
    this.monthYearPicklist.deactivatePicklist();
    if (!this.useRange) {
      const btnApply = this.applyBtnEl;
      if (btnApply) {
        btnApply.removeRipples();
        btnApply.setAttribute(attributes.HIDDEN, 'true');
        btnApply.setAttribute(attributes.DISABLED, `${!(this.rangeSettings.start && this.rangeSettings.end)}`);
      }
      if (this.showCancel) {
        const btnCancel = this.cancelBtnEl;
        btnCancel?.removeAttribute(attributes.HIDDEN);
      }
    }
  }

  /**
   * Helper to format datepicker text in the toolbar
   * @returns {string} locale formatted month year
   */
  private formatMonthText(): string {
    const monthKeys = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = this.locale?.translate(`MonthWide${monthKeys[this.activeDate.getMonth()]}`);

    return `${month} ${this.activeDate.getFullYear()}`;
  }

  /**
   * Expanded/Collapsed event for Month/Year Picklist
   */
  #attachExpandedListener() {
    this.offEvent('afterexpand');
    this.onEvent('afterexpand', this.container?.querySelector('ids-expandable-area'), () => {
      this.onPicklistExpand();
    });

    this.offEvent('beforecollapse');
    this.onEvent('beforecollapse', this.container?.querySelector('ids-expandable-area'), () => {
      this.onPicklistCollapse();
    });
  }

  #attachEventListeners() {
    // Selects day from the monthView
    this.offEvent('dayselected.date-picker-calendar');
    this.onEvent('dayselected.date-picker-calendar', this.monthView, (e: IdsDayselectedEvent) => {
      this.#handleDaySelectedEvent(e);
    });

    this.offEvent('datechange');
    this.onEvent('datechange', this.monthView, () => {
      this.captureValueFromMonthView();
    });

    // Handles input from header buttons
    this.offEvent('click.date-picker-header');
    this.onEvent('click.date-picker-header', this.container?.querySelector<IdsToolbar>('ids-toolbar'), (e: Event) => {
      const target = e.target as HTMLElement;

      const dropdownBtn: IdsToggleButton | null = target.closest('.dropdown-btn');
      if (dropdownBtn) {
        if (!dropdownBtn.disabled) {
          this.expanded = !this.expanded;
        }
        return;
      }

      const navBtn: IdsButton | null = target.closest('.btn-previous, .btn-next, .btn-today');
      if (navBtn) {
        if (!navBtn.disabled) {
          if (navBtn.classList.contains('btn-next')) {
            this.monthView.changeDate('next-month');
          } else if (navBtn.classList.contains('btn-previous')) {
            this.monthView.changeDate('previous-month');
          } else if (navBtn.classList.contains('btn-today')) {
            this.monthView.changeDate('today');
          }
        }
      }
    });

    // Handles input from footer buttons
    this.offEvent('click.date-picker-footer');
    this.onEvent('click.date-picker-footer', this.container?.querySelector('.popup-footer'), (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      e.stopPropagation();

      if (target.closest('.popup-btn-apply')) {
        this.#handleApplyEvent(e);
        return;
      }

      if (target.closest('.popup-btn-clear')) {
        this.clear();
        this.hide();
        return;
      }

      if (target.closest('.popup-btn-cancel')) {
        this.expanded = false;
        this.hide();
      }
    });

    // Input value change triggers component value change
    if (this.target) {
      this.offEvent('change.date-picker-input');
      this.onEvent('change.date-picker-input', this.target, (e: any) => {
        this.setAttribute(attributes.VALUE, e.detail.value);
      });

      // Closes popup on input focus
      /*
      this.offEvent('focus.date-picker-input');
      this.onEvent('focus.date-picker-input', this.target, () => {
        this.hide();
      });
      */
    }
  }

  /**
   * Click to apply button event handler
   * @param {MouseEvent} e click event
   */
  #handleApplyEvent(e: MouseEvent): void {
    e.stopPropagation();

    if (this.expanded) {
      this.captureValueFromPicklist();
      this.expanded = false;
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

        this.value = [
          this.locale.formatDate(this.#setTime(this.rangeSettings.start), { pattern: this.format }),
          this.rangeSettings.separator,
          this.locale.formatDate(
            this.#setTime(this.rangeSettings.end ?? this.monthView.activeDate),
            { pattern: this.format }
          ),
        ].filter(Boolean).join('');

        close();
      } else {
        this.value = this.locale.formatDate(
          this.#setTime(this.rangeSettings.start ?? this.monthView.activeDate),
          { pattern: this.format }
        );
        this.rangeSettings = {
          start: this.monthView.activeDate
        };
      }

      return;
    }

    if (this.target) {
      this.value = this.locale.formatDate(
        this.#setTime(this.monthView.activeDate),
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
    this.expanded = false;

    this.rangeSettings = {
      start: null,
      end: null
    };
    this.value = '';
    if (this.target) {
      this.target.focus();
    }
    this.#triggerSelectedEvent();
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
      if (this.monthView.selectDay) {
        this.monthView.selectDay();
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

        this.hide();
        this.focus();
        this.#triggerSelectedEvent();

        return;
      }

      const btnApply = this.container?.querySelector('.popup-btn-apply');
      if (e.detail.rangeStart && e.detail.rangeEnd) {
        btnApply?.removeAttribute(attributes.DISABLED);
      } else {
        btnApply?.setAttribute(attributes.DISABLED, 'true');
      }
    } else {
      this.value = this.locale.formatDate(
        this.#setTime(e.detail.date),
        { pattern: this.format }
      );
      this.year = e.detail.date.getFullYear();
      this.month = e.detail.date.getMonth();
      this.day = e.detail.date.getDate();
      this.hide();
      this.focus();
      this.#triggerSelectedEvent();
    }
  }

  /**
   * Gets the value from the selected items in the Month/Year Picklist
   * and sets them in the Date Picker Popup
   * @returns {void}
   */
  private captureValueFromPicklist() {
    const { month, year } = this.monthYearPicklist;
    this.year = year;
    this.month = month;
    this.value = this.getFormattedDate(this.activeDate.toString());
  }

  /**
   * Captures the day/month/year values from the currently-selected date in the Month View
   * @returns {void}
   */
  private captureValueFromMonthView() {
    const { month, year, day } = this.monthView;
    this.day = day;
    this.year = year;
    this.month = month;
    this.value = this.getFormattedDate(this.activeDate.toString());
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
        date: this.monthView.activeDate,
        useRange: this.useRange,
        rangeStart: this.useRange && this.rangeSettings.start ? new Date(this.rangeSettings.start as string) : null,
        rangeEnd: this.useRange && this.rangeSettings.end ? new Date(this.rangeSettings.end as string) : null
      }
    };

    if (this.target) {
      const event = new CustomEvent('dayselected', args);
      this.target.dispatchEvent(event);
    }
  }

  /**
   * Removes all button ripples in the component
   * @returns {void}
   */
  private removeRipples() {
    this.buttons?.forEach((button: IdsDatePickerPopupButton) => {
      button.removeRipples();
    });
  }

  /**
   * Runs when this picker component hides
   * @returns {void}
   */
  onHide() {
    if (this.monthView.selectDay) {
      this.monthView.selectDay();
    }
    this.container?.setAttribute(htmlAttributes.TABINDEX, '-1');
    this.expanded = false;
    this.removeRipples();
  }

  /**
   * Runs when this picker component shows
   * @returns {void}
   */
  onShow(): void {
    this.#attachEventListeners();
    this.monthView?.selectDay(this.year, this.month, this.day);
    this.container?.removeAttribute(htmlAttributes.TABINDEX);
    this.monthView.focus();
  }
}

export default IdsDatePickerPopup;

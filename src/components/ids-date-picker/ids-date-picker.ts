import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLabelStateParentMixin from '../../mixins/ids-label-state-mixin/ids-label-state-parent-mixin';
import IdsDateAttributeMixin from '../../mixins/ids-date-attribute-mixin/ids-date-attribute-mixin';
import IdsMonthViewAttributeMixin from '../ids-month-view/ids-month-view-attribute-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsFieldHeightMixin from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsValidationInputMixin from '../../mixins/ids-validation-mixin/ids-validation-input-mixin';
import IdsElement from '../../core/ids-element';

import { onPickerPopupXYSwitch } from '../ids-picker-popup/ids-picker-popup-common';

import {
  buildClassAttrib,
  stringToBool,
  stringToNumber
} from '../../utils/ids-string-utils/ids-string-utils';
import {
  isValidDate, umalquraToGregorian, hoursTo24
} from '../../utils/ids-date-utils/ids-date-utils';
// Supporting components
import './ids-date-picker-popup';
import '../ids-button/ids-button';
import '../ids-toggle-button/ids-toggle-button';
import '../ids-icon/ids-icon';
import '../ids-text/ids-text';
import '../ids-trigger-field/ids-trigger-field';

// Datepicker Shared
import {
  IdsDatePickerCommonAttributes,
} from './ids-date-picker-common';

// Types
import type {
  IdsRangeSettings,
  IdsDisableSettings,
  IdsLegend
} from '../ids-month-view/ids-month-view-common';
import type { IdsDayselectedEvent } from '../ids-month-view/ids-month-view';
import type IdsDatePickerPopup from './ids-date-picker-popup';
import type IdsTimePicker from '../ids-time-picker/ids-time-picker';
import type IdsToggleButton from '../ids-toggle-button/ids-toggle-button';

// Styles
import styles from './ids-date-picker.scss';

const Base = IdsDirtyTrackerMixin(
  IdsLabelStateParentMixin(
    IdsFieldHeightMixin(
      IdsColorVariantMixin(
        IdsValidationInputMixin(
          IdsMonthViewAttributeMixin(
            IdsDateAttributeMixin(
              IdsLocaleMixin(
                IdsKeyboardMixin(
                  IdsEventsMixin(
                    IdsElement
                  )
                )
              )
            )
          )
        )
      )
    )
  )
);

/**
 * IDS Date Picker Component
 * @type {IdsDatePicker}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsDateAttributeMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsEventsMixin
 * @mixes IdsFieldHeightMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLabelStateParentMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsMonthViewAttributeMixin
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

  #picker?: IdsDatePickerPopup;

  #triggerButton: any;

  #triggerField: any;

  connectedCallback(): void {
    super.connectedCallback();
    this.#picker = this.container?.querySelector<IdsDatePickerPopup>('ids-date-picker-popup') || undefined;
    this.#triggerButton = this.container?.querySelector('ids-trigger-button');
    this.#triggerField = this.container?.querySelector('ids-trigger-field');
    this.#configurePicker();
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
    this.#applyMask();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      ...IdsDatePickerCommonAttributes,
      attributes.DISABLED,
      attributes.EXPANDED,
      attributes.ID,
      attributes.LABEL,
      attributes.MASK,
      attributes.NO_MARGINS,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.SIZE,
      attributes.TABBABLE,
      attributes.VALIDATE,
      attributes.VALIDATION_EVENTS,
      attributes.VALUE,
    ];
  }

  /**
   * List of available color variants for this component
   * @returns {Array<string>}
   */
  colorVariants = ['alternate-formatter', 'borderless', 'in-cell'];

  /**
   * Push color variant to the trigger-field element
   * @returns {void}
   */
  onColorVariantRefresh(): void {
    if (this.#triggerField) {
      this.#triggerField.colorVariant = this.colorVariant;
    }
  }

  /**
   * Push label-state to the trigger-field element
   * @returns {void}
   */
  onLabelRequiredChange(): void {
    if (this.#triggerField) this.#triggerField.labelRequired = this.labelRequired;
  }

  /**
   * Push label-state to the trigger-field element
   * @returns {void}
   */
  onLabelChange(): void {
    if (this.#triggerField) this.#triggerField.label = this.label;
  }

  /**
   * Push label-state to the trigger-field element
   * @returns {void}
   */
  onLabelStateChange(): void {
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
   * Optional callback that can be used to adjust the Popup's placement
   * after all internal adjustments are made.
   * @param {DOMRect} popupRect a Rect object representing the current state of the popup.
   * @returns {object} an adjusted Rect object with "nudged" coordinates.
   */
  onPlace(popupRect: DOMRect): DOMRect {
    return popupRect;
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
    const strPressDown = this.#translate('PressDown') || 'Press Down arrow to select';
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
            <ids-icon icon="schedule" class="datepicker-icon"></ids-icon>
          </ids-trigger-button>
        ` : ``}
        ${this.isDropdown ? `
          <ids-toggle-button icon-off="dropdown" icon-on="dropdown" icon="dropdown" icon-align="end" class="dropdown-btn">
            <ids-icon icon="dropdown" class="dropdown-btn-icon"></ids-icon>
            <ids-text class="dropdown-btn-text" font-size="20">${this.value}</ids-text>
          </ids-toggle-button>
          <ids-expandable-area type="toggle-btn" expanded="${this.expanded}">
            <div class="picklist" slot="pane" role="application"></div>
          </ids-expandable-area>
        ` : ''}
        ${(!(this.isDropdown || this.isCalendarToolbar)) ? `
          <ids-trigger-field
            part="trigger-field"
            ${this.id ? `id-"${this.id}"` : ''}
            ${this.label ? `label="${this.label}"` : ''}
            placeholder="${this.placeholder}"
            size="${this.size}"
            format="${this.format}"
            ${this.validate ? `validate="${this.validate}"` : ''}
            validation-events="${this.validationEvents}"
            value="${this.value}"
            ${this.disabled ? `disabled="${this.disabled}"` : ''}
            ${this.readonly ? `readonly="${this.readonly}"` : ''}
            ${this.dirtyTracker ? `dirty-tracker="${this.dirtyTracker}"` : ''}
            ${colorVariant}${fieldHeight}${compact}${noMargins}${labelState}
          >
            <span slot="label-post" class="audible">, ${strPressDown}</span>
            <ids-trigger-button
              id="triggerBtn-${this.id ? this.id : ''}"
              slot="trigger-end" part="trigger-button">
              <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
              <ids-icon part="icon" icon="schedule"></ids-icon>
            </ids-trigger-button>
          </ids-trigger-field>
        ` : ``}
        ${!this.isDropdown ? `
          <ids-date-picker-popup
            id="popup-${this.id ? this.id : ''}"
            expanded="${this.expanded}"
            show-today="${this.showToday}"
            show-week-numbers="${this.showWeekNumbers}"
            first-day-of-week="${this.firstDayOfWeek}"
            year="${this.year}"
            month="${this.month}"
            day="${this.day}"
            use-range="${this.useRange}"
          ></ids-date-picker-popup>
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
   * @returns {IdsDatePickerPopup} reference to the IdsPopup component
   */
  get popup(): IdsDatePickerPopup | undefined {
    return this.#picker;
  }

  #configurePicker() {
    if (this.#picker) {
      this.#picker.appendToTargetParent();
      this.#picker.popupOpenEventsTarget = document.body;
      this.#picker.onOutsideClick = (e: Event) => {
        if (this.#picker) {
          if (!e.composedPath()?.includes(this.#picker)) {
            this.triggerEvent('outsideclick.datepicker', this);
            this.#togglePopup(false);
          }
        }
      };
      this.#picker.onTriggerClick = () => {
        if (this.disabled || this.readonly) return;
        this.#picker?.toggleVisibility();
      };
      this.#picker.setAttribute(attributes.TRIGGER_TYPE, 'click');
      this.#picker.setAttribute(attributes.TARGET, `#${this.#triggerField.getAttribute('id')}`);
      this.#picker.setAttribute(attributes.TRIGGER_ELEM, `#${this.#triggerButton.getAttribute('id')}`);

      // Configure inner IdsPopup
      if (this.#picker.popup) {
        this.#picker.popup.setAttribute(attributes.ARROW_TARGET, `#${this.#triggerButton.getAttribute('id')}`);

        // In some cases switch alignment for RTL purposes
        if (this.localeAPI && this.localeAPI.isRTL) {
          const rtlAdjustedAlignValue = `${this.localeAPI.isRTL() || ['lg', 'full'].includes(this.size) ? 'right' : 'left'}`;
          this.#picker.popup.setAttribute(attributes.ALIGN, `bottom, ${rtlAdjustedAlignValue}`);
        }

        // Detect switch of X/Y values due to alignment settings,
        // and account for extra width needed to be displayed outside of IdsDatePicker fields
        this.#picker.popup.onXYSwitch = onPickerPopupXYSwitch;
      }

      this.#picker.refreshTriggerEvents();

      if (this.#triggerField) {
        this.#picker.format = this.format;
        this.#picker.value = this.#triggerField.value;
      }
    }
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   */
  #attachEventHandlers(): object {
    // Input value change triggers component value change
    this.offEvent('change.date-picker-input');
    this.onEvent('change.date-picker-input', this.#triggerField, (e: any) => {
      this.setAttribute(attributes.VALUE, e.detail.value);
      this.#picker?.setAttribute(attributes.VALUE, e.detail.value);
    });

    // Date Picker Popup's `dayselected` event causes the trigger field value to the change
    this.offEvent('dayselected.date-picker-popup');
    this.onEvent('dayselected.date-picker-popup', this.container, (e: IdsDayselectedEvent) => {
      this.setAttribute(attributes.VALUE, e.detail.value);
      this.parseEventDate(e.detail.date);
      this.#triggerField?.setAttribute(attributes.VALUE, e.detail.value);
    });

    // Date Picker Popup's `hide` event can cause the field to become focused
    this.offEvent('hide.date-picker-popup');
    this.onEvent('hide.date-picker-popup', this.#picker, (e: CustomEvent) => {
      e.stopPropagation();
      if (e.detail.doFocus) {
        this.#triggerField?.focus();
      }
      this.#triggerSelectedEvent();
    });

    // Closes popup on input focus
    this.offEvent('focus.date-picker-input');
    this.onEvent('focus.date-picker-input', this.#triggerField, () => {
      this.#togglePopup(false);
    });

    return this;
  }

  // Respond to changing locale
  onLocaleChange = () => {
    requestAnimationFrame(() => {
      if (this.#picker) {
        this.#picker.format = this.format;
      }
      this.#triggerField.format = this.format;
      this.#applyMask();

      // Locale change first day of week only if it's not set as attribute
      if (this.firstDayOfWeek === null) {
        this.firstDayOfWeek = this.localeAPI?.calendar().firstDayofWeek || 0;
      }
    });
  };

  // Respond to changing language
  onLanguageChange = () => {
    this.#setAvailableDateValidation();
  };

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
        this.#picker?.setAttribute('value', this.value);
      }

      this.#picker?.show();

      this.container?.classList.add('is-open');

      this.#picker?.focus();

      if (this.isCalendarToolbar) {
        this.container?.removeAttribute('tabindex');
      }
    } else {
      this.#picker?.hide();

      this.container?.classList.remove('is-open');

      if (this.isCalendarToolbar) {
        this.container?.setAttribute('tabindex', '0');
      }
    }
  }

  /**
   * Defers `activeDate` to the inner IdsDatePickerPopup's active date,
   * otherwise fallback to the one generated by this one's date props
   * @returns {Date} activeDate from the inner monthView component
   */
  getActiveDate() {
    return this.#picker?.getActiveDate() || this.activeDate;
  }

  /**
   * Trigger selected event with current params
   * @returns {void}
   */
  #triggerSelectedEvent(): void {
    const targetDate = this.getActiveDate();

    const args = {
      detail: {
        elem: this,
        date: targetDate,
        useRange: this.useRange,
        rangeStart: this.useRange && this.rangeSettings.start ? new Date(this.rangeSettings.start as string) : null,
        rangeEnd: this.useRange && this.rangeSettings.end ? new Date(this.rangeSettings.end as string) : null,
        value: this.getFormattedDate(targetDate)
      }
    };

    this.triggerEvent('dayselected', this, args);
  }

  /**
   * Keyboard events handler
   * @param {KeyboardEvent} e keyboard event
   */
  #handleKeyDownEvent(e: KeyboardEvent): void {
    if (!this.container) return;

    const key = e.key;
    const stopEvent = () => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    };

    // Arrow Down opens calendar popup
    if (key === 'ArrowDown' && !this.#picker?.popup?.visible) {
      stopEvent();
      this.#togglePopup(true);
    }

    // Escape closes calendar popup
    if (key === 'Escape') {
      stopEvent();
      this.#togglePopup(false);
      this.focus();
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

    const parsedDate = this.localeAPI.parseDate(
      this.#triggerField?.value,
      { dateFormat: this.format }
    );
    const inputDate = this.localeAPI.isIslamic() ? (parsedDate && umalquraToGregorian(
      (parsedDate as number[])[0],
      (parsedDate as number[])[1],
      (parsedDate as number[])[2]
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
      setDateParams((inputDate as Date) || new Date());

      return;
    }

    const rangeParts: Array<string> = this.#triggerField.value?.split(this.rangeSettings.separator) || [];
    const rangeStart = rangeParts[0] ? this.localeAPI.parseDate(
      rangeParts[0],
      { dateFormat: this.format }
    ) : null;
    const rangeEnd = rangeParts[1] ? this.localeAPI.parseDate(
      rangeParts[1],
      { dateFormat: this.format }
    ) : null;

    if (this.#picker) {
      this.#picker.rangeSettings.start = rangeStart;
      this.#picker.rangeSettings.end = rangeEnd;
    }

    setDateParams((rangeStart as Date) ?? new Date());
  }

  /**
   * Takes a date string value (presumably passed from an event) and converts
   * the value to day/month/year attributes
   * @param {Date} val stringified date
   */
  parseEventDate(val: Date) {
    if (!val || typeof val !== 'string') return;

    const date = new Date(val);
    if (!isValidDate(date)) return;

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
    if (this.#triggerField && this.mask) {
      const prevFormat = this.#triggerField.maskOptions.format;
      const prevDelimeter = this.#triggerField.maskOptions.delimiter;
      this.#triggerField.mask = this.useRange ? 'rangeDate' : 'date';
      this.#triggerField.maskOptions = { format: this.format, delimiter: this.rangeSettings.separator };

      if (this.useRange && this.value) {
        // parse date values from range using previous format
        const [start, end] = this.value.split(prevDelimeter || this.rangeSettings.separator).map((dateStr: string) => {
          const parsedDate = this.localeAPI.parseDate(dateStr?.trim(), { pattern: prevFormat || this.format }) as Date;
          return parsedDate;
        });

        // format date range in new format
        this.#triggerField.value = [
          this.getFormattedDate(start ?? ''),
          this.rangeSettings.separator,
          this.getFormattedDate(end ?? '')
        ].join('');
      } else {
        this.#triggerField.value = this.getFormattedDate(this.dateValue ?? '');
      }
    }
  }

  /**
   * Available date validation extend validation mixin
   * Uses month view to define if date is available
   */
  #setAvailableDateValidation(): void {
    if (this.validate?.includes('availableDate')) {
      this.#triggerField?.addValidationRule({
        id: 'availableDate',
        type: 'error',
        message: this.localeAPI?.translate('UnavailableDate'),
        check: (input: any) => {
          if (!input.value) return true;

          const date = this.localeAPI.parseDate(
            input.value,
            this.format
          ) as Date;

          return isValidDate(date) && !this.#picker?.isDisabledByDate(date);
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
    this.container?.querySelector<IdsToggleButton>('ids-toggle-button')?.container?.focus();

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
    return this.format?.includes('h') || this.format?.includes('m') || this.format?.includes('s');
  }

  /**
   * Get translate text for given key from current locale
   * @param {string} value The key
   * @returns {string} The translate text
   */
  #translate(value: string): string {
    return this.localeAPI?.translate?.(value);
  }

  /**
   * Helper to set the date with time from time picker
   * @param {any} val date to add time values
   * @returns {Date} date with time values
   */
  #setTime(val: any): Date {
    const date = isValidDate(val) ? val : new Date(val);
    const timePicker = this.container?.querySelector<IdsTimePicker>('ids-time-picker');

    if (!this.#hasTime() || !timePicker) return date;

    const hours: number = timePicker.hours;
    const minutes: number = timePicker.minutes;
    const seconds: number = timePicker.seconds;
    const period: string = timePicker.period;
    const dayPeriodIndex = this.localeAPI?.calendar().dayPeriods?.indexOf(period);

    date.setHours(hoursTo24(hours, dayPeriodIndex), minutes, seconds);

    return date;
  }

  /**
   * Handles id attribute changes
   * @param {string} value id value
   */
  onIdChange(value: string | null) {
    if (value) {
      this.#triggerField?.setAttribute(attributes.ID, value);
    } else {
      this.removeAttribute(attributes.ID);
      this.#triggerField?.removeAttribute(attributes.ID);
    }
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
    const textEl = this.container?.querySelector<HTMLElement>('.datepicker-text');
    const dropdownEl = this.container?.querySelector<HTMLElement>('.dropdown-btn-text');
    this.dateValue = this.getDateValue(val);

    if (!this.disabled && !this.readonly) {
      this.setAttribute(attributes.VALUE, String(val));
      this.#triggerField?.setAttribute(attributes.VALUE, val);

      if (textEl) {
        textEl.innerText = val ?? '';
      }

      if (dropdownEl) {
        dropdownEl.innerText = val ?? '';
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
      this.setAttribute(attributes.DISABLED, 'true');
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
      this.setAttribute(attributes.READONLY, 'true');
      this.#triggerField?.setAttribute(attributes.READONLY, 'true');
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
      if (val === 'full') this.container?.classList.add('full');
    } else {
      this.removeAttribute(attributes.SIZE);
      this.#triggerField?.setAttribute(attributes.SIZE, 'sm');
      this.container?.classList.remove('full');
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
    this.setAttribute(attributes.TABBABLE, String(val));
    this.#triggerButton?.setAttribute(attributes.TABBABLE, val);
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

  onFormatChange(newValue: string) {
    if (newValue) {
      this.#picker?.setAttribute(attributes.FORMAT, newValue);
      this.#triggerField?.setAttribute(attributes.FORMAT, newValue);
    } else {
      this.#picker?.removeAttribute(attributes.FORMAT);
      this.#triggerField?.removeAttribute(attributes.FORMAT);
    }

    if (this.placeholder) {
      this.placeholder = this.format;
    }

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
      this.setAttribute(attributes.IS_CALENDAR_TOOLBAR, 'true');
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
      this.setAttribute(attributes.IS_DROPDOWN, 'true');
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
    this.setAttribute(attributes.SHOW_TODAY, String(val));
    this.#picker?.setAttribute(attributes.SHOW_TODAY, String(val));
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

  onFirstDayOfWeekChange(newValue: number) {
    this.#picker?.setAttribute(attributes.FIRST_DAY_OF_WEEK, String(newValue));
  }

  onMonthChange(newValue: number, isValid: boolean) {
    if (isValid) {
      this.#picker?.setAttribute(attributes.MONTH, String(newValue));
    } else {
      this.#picker?.removeAttribute(attributes.MONTH);
    }

    if (this.isCalendarToolbar) this.#togglePopup(isValid);
  }

  onYearChange(newValue: number, isValid: boolean) {
    if (isValid) {
      this.#picker?.setAttribute(attributes.YEAR, String(newValue));
    } else {
      this.#picker?.removeAttribute(attributes.YEAR);
    }

    if (this.isCalendarToolbar) this.#togglePopup(isValid);
  }

  onDayChange(newValue: number, isValid: boolean) {
    if (isValid) {
      this.#picker?.setAttribute(attributes.DAY, String(newValue));
    } else {
      this.#picker?.removeAttribute(attributes.DAY);
    }

    if (this.isCalendarToolbar) this.#togglePopup(isValid);
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
    if (boolVal) {
      this.setAttribute(attributes.EXPANDED, `${boolVal}`);
      this.#picker?.setAttribute(attributes.EXPANDED, String(val));
      this.#triggerExpandedEvent(boolVal);
    } else {
      this.removeAttribute(attributes.EXPANDED);
      this.#picker?.removeAttribute(attributes.EXPANDED);
    }
    this.container.classList.toggle('is-expanded', boolVal);
  }

  onDisableSettingsChange(val: IdsDisableSettings) {
    if (this.#picker) this.#picker.disableSettings = val;
  }

  onLegendSettingsChange(val: Array<IdsLegend>) {
    if (this.#picker) this.#picker.legend = val;
  }

  onRangeSettingsChange(val: IdsRangeSettings) {
    if (this.#picker) {
      this.#picker.rangeSettings = val;

      if (val?.start && val?.end) {
        const startDate = this.localeAPI.formatDate(this.#setTime(val.start), { pattern: this.format });
        const endDate = this.localeAPI.formatDate(this.#setTime(val.end), { pattern: this.format });
        this.value = `${startDate}${this.rangeSettings.separator}${endDate}`;
      }
    }
  }

  onUseRangeChange(val: boolean) {
    const btnApply = this.container?.querySelector('.popup-btn-apply');
    if (val) {
      this.#picker?.setAttribute(attributes.USE_RANGE, String(val));
      btnApply?.removeAttribute('hidden');
      btnApply?.setAttribute('disabled', 'true');
    } else {
      this.#picker?.removeAttribute(attributes.USE_RANGE);
      btnApply?.setAttribute('hidden', 'true');
      btnApply?.removeAttribute('disabled');
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
      this.setAttribute(attributes.MASK, 'true');
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
    if (numberVal) {
      this.setAttribute(attributes.MINUTE_INTERVAL, String(numberVal));
    } else {
      this.removeAttribute(attributes.MINUTE_INTERVAL);
    }
    if (this.#picker) this.#picker.secondInterval = numberVal;
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
    if (numberVal) {
      this.setAttribute(attributes.SECOND_INTERVAL, String(numberVal));
    } else {
      this.removeAttribute(attributes.SECOND_INTERVAL);
    }
    if (this.#picker) this.#picker.secondInterval = numberVal;
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
    if (boolVal) {
      this.setAttribute(attributes.SHOW_CLEAR, 'true');
    } else {
      this.removeAttribute(attributes.SHOW_CLEAR);
    }
    if (this.#picker) this.#picker.showClear = boolVal;
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
      this.setAttribute(attributes.SHOW_CANCEL, 'true');
    } else {
      this.removeAttribute(attributes.SHOW_CANCEL);
    }
    if (this.#picker) this.#picker.showCancel = boolVal;
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
    if (this.#picker) this.#picker.showPicklistYear = boolVal;
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
    if (this.#picker) this.#picker.showPicklistMonth = boolVal;
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
    this.setAttribute(attributes.SHOW_PICKLIST_WEEK, String(boolVal));
    if (this.#picker) this.#picker.showPicklistWeek = boolVal;
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

    if (boolVal) {
      this.setAttribute(attributes.USE_CURRENT_TIME, boolVal.toString());
    } else {
      this.removeAttribute(attributes.USE_CURRENT_TIME);
    }

    if (this.#picker) this.#picker.useCurrentTime = boolVal;
  }

  set showWeekNumbers(val: boolean | null) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.SHOW_WEEK_NUMBERS, '');
    } else {
      this.removeAttribute(attributes.SHOW_WEEK_NUMBERS);
    }
  }

  get showWeekNumbers(): boolean {
    return stringToBool(this.getAttribute(attributes.SHOW_WEEK_NUMBERS));
  }
}

export default IdsDatePicker;

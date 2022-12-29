import { attributes } from '../../core/ids-attributes';
import { deepClone } from '../../utils/ids-deep-clone-utils/ids-deep-clone-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { IdsConstructor } from '../../core/ids-element';

import type {
  IdsRangeSettings,
  IdsRangeSettingsInterface,
  IdsLegend,
  IdsLegendSettings,
  IdsDisableSettings
} from './ids-month-view-common';

export interface MonthViewAttributeMixinInterface {
  // as instance functions
  onDisableSettingsChange?(newValue: IdsDisableSettings): void;
  onLegendSettingsChange?(newValue: IdsLegendSettings): void;
  onRangeSettingsChange?(newValue: IdsRangeSettings): void;
  onUseRangeChange?(newValue: boolean): void;
}

type Constraints = IdsConstructor<MonthViewAttributeMixinInterface & IdsRangeSettingsInterface>;

const isValidLegendArray = (val: IdsLegendSettings) => Array.isArray(val)
  && val.length > 0
  && val.every(
    (item: any) => item.name && item.color && (item.dates || item.dayOfWeek)
  );

/**
 * A mixin that adds shared attribute setters/getters/callbacks related to IdsMonthView behaviors.
 * @mixin IdsMonthViewAttributeMixin
 * @param {any} superclass Accepts a superclass and creates a new subclass from it.
 * @returns {any} The extended object
 */
const IdsMonthViewAttributeMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  #disableSettings: IdsDisableSettings = {
    dates: [],
    years: [],
    minDate: '',
    maxDate: '',
    dayOfWeek: [],
    isEnable: false
  };

  #currentLegend: IdsLegendSettings = [];

  #rangeSettings: IdsRangeSettings = {
    start: null,
    end: null,
    separator: ' - ',
    minDays: 0,
    maxDays: 0,
    selectForward: false,
    selectBackward: false,
    includeDisabled: false,
    selectWeek: false
  };

  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.RANGE_SETTINGS,
      attributes.USE_RANGE
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
  }

  /**
   * @returns {IdsDisableSettings} disable settings object
   */
  get disableSettings(): IdsDisableSettings {
    return this.#disableSettings;
  }

  /**
   * Set disable settings
   * @param {IdsDisableSettings} val settings to be assigned to default disable settings
   */
  set disableSettings(val: IdsDisableSettings) {
    this.#disableSettings = {
      ...this.#disableSettings,
      ...deepClone(val)
    };

    if (typeof this.onDisableSettingsChange === 'function') this.onDisableSettingsChange(this.#disableSettings);
  }

  /**
   * @returns {IdsLegendSettings} array of legend items
   */
  get legend(): IdsLegendSettings {
    return this.#currentLegend;
  }

  /**
   * Set array of legend items to month view component
   * Validation of data is provided by the month view component
   * @param {IdsLegendSettings} val array of legend items
   */
  set legend(val: IdsLegendSettings) {
    if (val === null || (Array.isArray(val) && !val.length)) {
      this.#currentLegend = [];
    } else if (isValidLegendArray(val)) {
      this.#currentLegend = deepClone(val);
    } else {
      throw new Error('ids-month-view: Invalid legend data provided');
    }

    if (typeof this.onLegendSettingsChange === 'function') this.onLegendSettingsChange(this.#currentLegend);
  }

  /**
   * Find legend object by date provided
   * @param {Date} date to check if has any legend
   * @returns {IdsLegend | undefined} legend object for a specific date
   */
  getLegendByDate(date: Date): IdsLegend | undefined {
    if (!this.#currentLegend) return;

    return this.#currentLegend.find((legend: IdsLegend) => {
      const ifDayOfWeek = legend.dayOfWeek?.includes(date.getDay());
      const ifDate = legend.dates?.some((item: any) => new Date(item).getTime() === date.getTime());
      return ifDayOfWeek || ifDate;
    });
  }

  /**
   * @returns {IdsRangeSettings} range settings object
   */
  get rangeSettings(): IdsRangeSettings {
    return this.#rangeSettings;
  }

  /**
   * Set range selection settings
   * @param {IdsRangeSettings} val settings to be assigned to default range settings
   */
  set rangeSettings(val: IdsRangeSettings) {
    if (!val || val === null) this.resetRangeSettings();
    else {
      this.#rangeSettings = {
        ...this.#rangeSettings,
        ...deepClone(val)
      };
    }

    if (typeof this.onRangeSettingsChange === 'function') this.onRangeSettingsChange(val);
  }

  /**
   * Sets the `rangeSettings` object back to its original defaults
   */
  resetRangeSettings() {
    this.rangeSettings = {
      start: null,
      end: null,
      separator: ' - ',
      minDays: 0,
      maxDays: 0,
      selectForward: false,
      selectBackward: false,
      includeDisabled: false,
      selectWeek: false
    };
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

    if (boolVal) {
      this.setAttribute(attributes.USE_RANGE, 'true');
    } else {
      this.removeAttribute(attributes.USE_RANGE);
    }

    if (typeof this.onUseRangeChange === 'function') this.onUseRangeChange(boolVal);
  }
};

export default IdsMonthViewAttributeMixin;

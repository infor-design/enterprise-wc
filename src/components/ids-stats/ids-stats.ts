import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { attributes } from '../../core/ids-attributes';

import '../ids-box/ids-box';
import '../ids-icon/ids-icon';
import '../ids-layout-flex/ids-layout-flex';
import type IdsBox from '../ids-box/ids-box';
import type IdsIcon from '../ids-icon/ids-icon';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';

import styles from './ids-stats.scss';

/**
 * IDS Stats Component
 * @type {IdsStats}
 * @inherits IdsElement
 * @part stats - the stats container element
 */
@customElement('ids-stats')
@scss(styles)
export default class IdsStats extends IdsLocaleMixin(IdsEventsMixin(IdsElement)) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
    this.actionable = this.actionable;
  }

  /**
   * Setup the Event Handling
   * @private
   */
  #attachEventHandlers(): void {
    this.onEvent('click.stats', this, () => this.toggleSelection());
    this.onLocaleChange = () => {
      this.#applyKpiFormat();
      this.#applyTrendFormat();
    };

    this.onLanguageChange = () => {
      this.#applyKpiFormat();
      this.#applyTrendFormat();
    };
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.ACTIONABLE,
      attributes.COL_SPAN,
      attributes.ICON,
      attributes.KPI,
      attributes.KPI_FORMAT,
      attributes.MAIN_LABEL,
      attributes.TREND_LABEL,
      attributes.KPI_FORMAT,
      attributes.SELECTED,
      attributes.STATUS_COLOR,
      attributes.SUBTITLE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    const isNegative = (this.trendLabel || '').indexOf('-') > -1;
    const isPositive = !isNegative && this.trendLabel !== '';
    const isBorderless = !!this.closest('ids-widget')?.hasAttribute('borderless');

    const markup = `<ids-box padding-x="0" padding-y="0"${isBorderless ? ` shadowed` : ` borderless`}${this.actionable ? ` actionable` : ``}>
      <div class="ids-stats" part="stats">
        <ids-layout-flex direction="column">
          <ids-layout-flex justify-content="space-between" align-items="center">
            <ids-layout-flex-item>
              <div class="trend-label${isPositive ? ' is-positive' : ''}${isNegative ? ' is-negative' : ''}"></div>
            </ids-layout-flex-item>
            <ids-layout-flex-item>
              <div class="main-icon"><ids-icon icon="${this.icon}" status-color="${this.statusColor}"></ids-icon></div>
            </ids-layout-flex-item>
          </ids-layout-flex>
          <ids-layout-flex-item>
            <ids-text font-size="40" class="kpi-label" font-weight="semi-bold" overflow="ellipsis" tooltip="true">${this.kpi}</ids-text>
          </ids-layout-flex-item>
          <ids-layout-flex-item>
            <ids-text font-size="14" class="main-label" font-weight="semi-bold" overflow="ellipsis"  tooltip="true">${this.mainLabel}</ids-text>
          </ids-layout-flex-item>
          <ids-layout-flex-item>
            <ids-text font-size="12" class="subtitle" overflow="ellipsis" tooltip="true">${this.subtitle}</ids-text>
          </ids-layout-flex-item>
        </ids-layout-flex>
      </div>
    </ids-box>`;
    return markup;
  }

  trendingUpIcon = `<svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.4 12L0 10.6L7.4 3.15L11.4 7.15L16.6 2H14V0H20V6H18V3.4L11.4 10L7.4 6L1.4 12Z" fill="#2AC371"/>
  </svg>`;

  /**
   * Toggle the current selection state
   */
  toggleSelection() {
    if (!this.actionable) return;
    this.selected = !stringToBool(this.selected);
  }

  /**
   * Set the selected state on the stat, any other states will be toggled
   * @param {boolean} value true if this stat should appear "selected"
   */
  set selected(value: boolean) {
    const currentValue = stringToBool(this.selected);
    const isValueTruthy = stringToBool(value);

    if (currentValue !== isValueTruthy) {
      this.closest('ids-widget')?.querySelectorAll('ids-stats').forEach((elem) => {
        if (!elem.isSameNode(this)) {
          (elem as IdsStats).removeAttribute(attributes.SELECTED);
          ((elem as IdsStats).container?.parentElement as IdsBox)?.removeAttribute(attributes.SELECTED);
          ((elem as IdsStats).container?.parentElement as IdsBox).container?.classList.remove('is-selected');
        }
      });
      if (isValueTruthy) {
        this.setAttribute(attributes.SELECTED, `${value}`);
        (this.container?.parentElement as IdsBox)?.setAttribute(attributes.SELECTED, 'true');
        (this.container?.parentElement as IdsBox).container?.classList.add('is-selected');
      } else {
        this.removeAttribute(attributes.SELECTED);
        (this.container?.parentElement as IdsBox)?.removeAttribute(attributes.SELECTED);
        (this.container?.parentElement as IdsBox).container?.classList.remove('is-selected');
      }
    }
  }

  get selected() { return stringToBool(this.getAttribute(attributes.SELECTED)); }

  /**
   * If actionable one stat can be toggled trigging an event
   * @param {boolean} value set to true for actionable
   */
  set actionable(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.ACTIONABLE, value.toString());
      (this.container?.parentElement as IdsBox)?.setAttribute(attributes.SELECTED, 'true');
    } else {
      this.removeAttribute(attributes.ACTIONABLE);
      (this.container?.parentElement as IdsBox)?.removeAttribute(attributes.SELECTED);
    }
  }

  get actionable(): boolean {
    return stringToBool(this.getAttribute(attributes.ACTIONABLE));
  }

  /**
   * Used to showcase price or amount trending up or down (Optional).
   * @param {string} value Trend label text
   */
  set trendLabel(value: string) {
    const elem = this.container?.querySelector('.trend-label');
    if (value) {
      this.setAttribute(attributes.TREND_LABEL, value);
      this.#applyTrendFormat();
    } else if (!value && elem) {
      elem.setAttribute('hidden', 'true');
    }
  }

  get trendLabel(): string {
    return this.getAttribute(attributes.TREND_LABEL) || '';
  }

  /**
   * Use to call attention to status of the KPI.
   * Can be colored to bring attention (via statusColor)
   * (Optional in larger KPI format).
   * @param {string} value Trend label text
   */
  set icon(value: string | null) {
    const elem = this.container?.querySelector<IdsIcon>('.main-icon ids-icon');
    if (stringToBool(value) && elem && value) {
      this.setAttribute(attributes.ICON, value);
      elem.icon = value;
    } else if (elem) {
      elem.setAttribute('hidden', 'true');
    }
  }

  get icon(): string | null {
    return this.getAttribute(attributes.ICON);
  }

  /**
   * Color that can be used for embellishment or to indicate status or bring attention
   * @param {string} value Any pallete color reference
   */
  set statusColor(value: string | null) {
    if (value) {
      this.setAttribute(attributes.STATUS_COLOR, value);
      this.container?.querySelector('.main-icon ids-icon')?.setAttribute('status-color', value);
    } else {
      this.removeAttribute(attributes.STATUS_COLOR);
    }
  }

  get statusColor(): string {
    return this.getAttribute(attributes.STATUS_COLOR) || 'blue';
  }

  /**
   * Large center label. Show up to 6 characters in small size in the KPI area
   * @param {string} value Numbers or percentages or dollar amount
   */
  set kpi(value: string | null) {
    if (value) {
      this.setAttribute(attributes.KPI, value);
      this.#applyKpiFormat();
    } else {
      this.removeAttribute(attributes.KPI);
    }
  }

  get kpi(): string {
    return this.getAttribute(attributes.KPI) || '';
  }

  /**
   * Main KPI Label. Will truncate if too big
   * @param {string} value label value as text
   */
  set mainLabel(value: string | null) {
    const elem = this.container?.querySelector('.main-label');
    if (value && elem) {
      this.setAttribute(attributes.MAIN_LABEL, value);
      elem.textContent = value;
    } else if (elem) {
      this.removeAttribute(attributes.MAIN_LABEL);
    }
  }

  get mainLabel(): string {
    return this.getAttribute(attributes.MAIN_LABEL) || '';
  }

  /**
   * Extra details on the KPI. Single line. Auto truncates.
   * @param {string} value label value as text
   */
  set subtitle(value: string | null) {
    const elem = this.container?.querySelector('.subtitle');
    if (value && elem) {
      this.setAttribute(attributes.SUBTITLE, value);
      elem.textContent = value;
    } else if (elem) {
      this.removeAttribute(attributes.SUBTITLE);
    }
  }

  get subtitle(): string {
    return this.getAttribute(attributes.SUBTITLE) || '';
  }

  /**
   * Set the col-span attribute
   * @param {string | null} value If 2 will span 2 columns, nothing else is valid
   */
  set colSpan(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN, value);
      this.container?.classList.add('colspan');
    } else {
      this.removeAttribute(attributes.COL_SPAN);
      this.container?.classList.remove('colspan');
    }
  }

  /**
   * Get col-span attribute
   * @returns {string | null} The number value for the columns to span in the grid
   */
  get colSpan(): string | null {
    return this.getAttribute(attributes.COL_SPAN);
  }

  formats: {
    kpi?: Intl.NumberFormatOptions | undefined | string,
    trend?: Intl.NumberFormatOptions | undefined | string
  } = {
      kpi: undefined,
      trend: { signDisplay: 'exceptZero' }
    };

  /**
   * Set the locale format for the kpi
   * @param {Intl.NumberFormatOptions | undefined | string} value If 2 will span 2 columns, nothing else is valid
   */
  set kpiFormat(value: Intl.NumberFormatOptions | undefined | string) {
    if (value !== undefined && typeof value !== 'string') {
      this.formats.kpi = value;
    } else {
      this.formats.kpi = typeof value === 'string' ? '' : undefined;
    }
    this.#applyKpiFormat();
  }

  /**
   * Get col-span attribute
   * @returns {Intl.NumberFormatOptions | undefined | string} The number value for the columns to span in the grid
   */
  get kpiFormat(): Intl.NumberFormatOptions | undefined | string {
    return this.formats.kpi;
  }

  /**
   * Apply the format on the field
   */
  #applyKpiFormat() {
    const elem = this.container?.querySelector('.kpi-label');
    if (elem && typeof this.kpiFormat === 'string') {
      elem.textContent = this.kpi;
      return;
    }
    if (elem && typeof this.kpiFormat !== 'string') {
      elem.textContent = new Intl.NumberFormat(this.locale || 'en', this.kpiFormat).format(Number(this.kpi));
    }
  }

  /**
   * Set the locale format for the kpi
   * @param {Intl.NumberFormatOptions | undefined} value If 2 will span 2 columns, nothing else is valid
   */
  set trendFormat(value: Intl.NumberFormatOptions | undefined | string) {
    if (value !== undefined && typeof value !== 'string') {
      this.formats.trend = value;
    } else {
      this.formats.trend = typeof value === 'string' ? '' : undefined;
    }
    this.#applyTrendFormat();
  }

  /**
   * Get col-span attribute
   * @returns {Intl.NumberFormatOptions | undefined | string} The number value for the columns to span in the grid
   */
  get trendFormat(): Intl.NumberFormatOptions | undefined | string {
    return this.formats.trend;
  }

  /**
   * Apply the format on the field
   */
  #applyTrendFormat() {
    const elem = this.container?.querySelector('.trend-label');
    if (elem && typeof this.trendFormat === 'string') {
      elem.textContent = this.trendLabel;
      return;
    }
    if (typeof this.trendFormat !== 'string') {
      const formatted = new Intl.NumberFormat(this.locale || 'en', this.trendFormat).format(Number(this.trendLabel));
      const isNegative = (formatted || '').indexOf('-') > -1;
      const isPositive = !isNegative && formatted !== '';
      const trendIcon = `${isPositive ? this.trendingUpIcon : ''}`;
      if (elem && formatted !== '0') elem.innerHTML = `${formatted}${trendIcon}`;
    }
  }
}

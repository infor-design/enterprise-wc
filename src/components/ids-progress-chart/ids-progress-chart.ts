import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-progress-chart.scss';
import type IdsIcon from '../ids-icon/ids-icon';
import type IdsText from '../ids-text/ids-text';

// Defaults
const DEFAULT_PROGRESS = 0;
const DEFAULT_TOTAL = 100;
const DEFAULT_SIZE = 'normal';

const Base = IdsEventsMixin(
  IdsElement
);

/**
 * IDS Progress Chart Component
 * @type {IdsProgressChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-progress-chart')
@scss(styles)
export default class IdsProgressChart extends Base {
  percentage = NaN;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#updateProgress();
    this.#updateColor();
    this.#updateSize();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      attributes.COLOR,
      attributes.ICON,
      attributes.LABEL,
      attributes.LABEL_PROGRESS,
      attributes.LABEL_TOTAL,
      attributes.PROGRESS,
      attributes.SIZE,
      attributes.TOTAL,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-progress-chart" part="chart">
      <div class="labels">
        <ids-text class="label-main">${this.label || ''}</ids-text>
        <ids-icon class="icon" icon="${this.icon || ''}" size="${this.size || DEFAULT_SIZE}"></ids-icon>
        <ids-text class="label-progress">${this.progressLabel || ''}</ids-text>
        <div class="label-end">
          <ids-text class="label-total">${this.totalLabel || ''}</ids-text>
        </div>
      </div>
      <div class="bar">
        <div class="bar-total">
          <div class="bar-progress"></div>
        </div>
      </div>
    </div>`;
  }

  /**
   * Sets the icon inside the label
   * @param {string} value The icon name
   */
  set icon(value: string | null) {
    const icon = this.container?.querySelector<IdsIcon>('.icon');
    if (value) {
      this.setAttribute(attributes.ICON, value);

      icon?.setAttribute(attributes.ICON, value);
      icon?.style.setProperty('display', '');
      icon?.style.setProperty('margin', '0 4px');
    } else {
      this.setAttribute(attributes.ICON, '');
      icon?.setAttribute(attributes.ICON, '');
      icon?.style.setProperty('display', 'none');
    }
  }

  get icon(): string | null { return this.getAttribute(attributes.ICON); }

  /**
   * Set the color of the bar
   * @param {string} value The color value, this can be a hex code with the #
   */
  set color(value: string | null) {
    this.setAttribute(attributes.COLOR, String(value));
    this.#updateColor();
  }

  get color(): string | null { return this.getAttribute(attributes.COLOR); }

  /**
   * Updates the UI when color attribute is set
   * @private
   */
  #updateColor(): void {
    if (!this.color) return;

    let prop = this.color;

    const includesAlert = this.color?.includes('error') || this.color?.includes('caution') || this.color?.includes('warning');

    if (includesAlert || this.color?.includes('base') || this.color?.includes('success')) {
      prop = `var(--ids-color-${this.color === 'base' ? 'primary' : `${this.color}-default`})`;

      // only color the icons and progress labels if it's error, caution, or warning
      if (includesAlert) {
        const progressLabel = this.container?.querySelector<IdsText>('.label-progress');
        progressLabel?.style?.setProperty('color', prop);

        const icon = this.container?.querySelector<IdsIcon>('ids-icon');
        icon?.style.setProperty('color', prop);
      }
    } else if (this.color?.substring(0, 1) !== '#') {
      prop = `var(--ids-color-${this.color})`;
    }

    const bar = this.container?.querySelector<HTMLElement>('.bar-progress');
    bar?.style.setProperty('background-color', prop);
  }

  /**
   * Updates the UI when the main/progress/total label is set
   * @param {string} labelType The type of label being set
   * @private
   */
  #updateLabel(labelType: string): void {
    if (!this.container) return;

    if (labelType === attributes.LABEL) {
      const labelMain = this.container?.querySelector('.label-main');
      if (labelMain) labelMain.innerHTML = this.label ?? '';
    } else if (labelType === attributes.LABEL_PROGRESS) {
      const labelProgress = this.container?.querySelector('.label-progress');
      if (labelProgress) labelProgress.innerHTML = this.progressLabel ?? '';
    } else {
      const labelTotal = this.container?.querySelector('.label-total');
      if (labelTotal) labelTotal.innerHTML = this.totalLabel ?? '';
    }
  }

  /**
   * Updates the UI when the progress value/total is set
   * @private
   */
  #updateProgress(): void {
    const prog = parseFloat(this.progress ?? '') || DEFAULT_PROGRESS;
    const tot = parseFloat(this.total ?? '') || DEFAULT_TOTAL;
    // make sure that prog / tot doesn't exceed 1 -- will happen if prog > tot
    const percentage = Math.floor((prog / tot > 1 ? 1 : prog / tot) * 100);
    this.percentage = percentage;

    const progressBar = this.container?.querySelector<HTMLElement>('.bar-progress');
    progressBar?.style.setProperty('width', `${percentage}%`);
  }

  /**
   * Updates the UI when the chart size is set
   * @private
   */
  #updateSize(): void {
    const bar = this.container?.querySelector<HTMLElement>('.bar');
    bar?.style.setProperty('min-height', this.size === 'small' ? '10px' : '28px');
    bar?.style.setProperty('border-radius', this.size === 'small' ? '0px' : '2px');
  }

  /**
   * Set the numeric value of progress that has been completed
   * @param {string} value The progress value, between 0 and the total
   */
  set progress(value: string | null) {
    const prop = (parseFloat(value ?? '') < 0 || Number.isNaN(parseFloat(value ?? '')))
      ? DEFAULT_PROGRESS
      : value;

    this.setAttribute(attributes.PROGRESS, String(prop));
    this.#updateProgress();
  }

  get progress(): string | null { return this.getAttribute(attributes.PROGRESS); }

  /**
   * Set the total value of possible progress that can be completed
   * @param {string} value The total value, must be greater than or equal to the progress value
   */
  set total(value: string | null) {
    const prop = (parseFloat(value ?? '') < 0 || Number.isNaN(parseFloat(value ?? '')))
      ? DEFAULT_TOTAL
      : value;

    this.setAttribute(attributes.TOTAL, String(prop));
    this.#updateProgress();
  }

  get total(): string | null { return this.getAttribute(attributes.TOTAL); }

  /**
   * Set the label title of the bar
   * @param {string} value The title value, whatever you want to name the bar
   */
  set label(value: string | null) {
    this.setAttribute(attributes.LABEL, value || '');
    this.#updateLabel(attributes.LABEL);
  }

  get label(): string | null { return this.getAttribute(attributes.LABEL); }

  /**
   * Set the label of completed progress--useful for displaying units
   * @param {string} value The label for completed progress (i.e. 13 hours)
   */
  set progressLabel(value: string | null) {
    this.setAttribute(attributes.LABEL_PROGRESS, value || '');
    this.#updateLabel(attributes.LABEL_PROGRESS);
  }

  get progressLabel(): string | null { return this.getAttribute(attributes.LABEL_PROGRESS); }

  /**
   * Set the label of total possible progress--useful for displaying units
   * @param {string} value The label for total progress (i.e. 26 hours)
   */
  set totalLabel(value: string | null) {
    this.setAttribute(attributes.LABEL_TOTAL, value || '');
    this.#updateLabel(attributes.LABEL_TOTAL);
  }

  get totalLabel(): string | null { return this.getAttribute(attributes.LABEL_TOTAL); }

  /**
   * Set the size of the progress bar (small, or normal (default)
   * @param {string} value The size of the progress bar
   */
  set size(value: string | null) {
    const prop = value === 'small' ? value : DEFAULT_SIZE;
    this.setAttribute(attributes.SIZE, prop);
    const icon = this.container?.querySelector('.icon');
    icon?.setAttribute('size', prop);
    this.#updateSize();
  }

  get size(): string | null { return this.getAttribute(attributes.SIZE); }
}

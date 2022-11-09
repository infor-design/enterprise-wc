import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-color-base';

import styles from './ids-color.scss';
import IdsTooltip from '../ids-tooltip/ids-tooltip';
import IdsIcon from '../ids-icon/ids-icon';

const SwatchSizes = ['xs', 'sm', 'mm', 'md', 'lg'] as const;
export type SwatchSizesType = typeof SwatchSizes[number];

/**
 * IDS Color
 * @type {IdsColor}
 * @inherits IdsElement
 * @part color - the color swatch element
 * @part check - the checkbox element
 */
@customElement('ids-color')
@scss(styles)
export default class IdsColor extends Base {
  swatch: HTMLDivElement | null = null;

  icon: IdsIcon | null = null;

  popup: IdsTooltip | null = null;

  constructor() {
    super();
  }

  /** Invoked each time the custom element is added to the DOM */
  connectedCallback(): void {
    super.connectedCallback();
    this.#attachEventHandlers();

    const shadowRoot = this.shadowRoot as ShadowRoot;
    this.swatch = shadowRoot.querySelector('.ids-color');
    this.icon = shadowRoot.querySelector('ids-icon');
    this.popup = shadowRoot.querySelector('ids-tooltip');

    if (this.hex) this.hex = this.getAttribute(attributes.HEX) as string;
  }

  /** Invoked each time the custom element is removed from the DOM */
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#detachEventHandlers();
  }

  /** @returns {string[]} this component's observable attributes */
  static get attributes(): string[] {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.HEX,
      attributes.MODE,
      attributes.SIZE,
      attributes.TOOLTIP
    ];
  }

  /**
   * HTML for IdsColor.shadowRoot
   * @returns {string} - html for the template
   */
  template(): string {
    return `
      <ids-tooltip>${this.tooltip} ${this.hex}</ids-tooltip>
      <div class="ids-color ${this.size} no-color" tabindex="0" part="color">
        <ids-icon class="color-check" icon="check" size="small" part="hex"></ids-icon>
      </div>
    `;
  }

  /**
   * Sets the disabled attribute
   * @param {boolean | string} value - true if color-swatch is disabled
   */
  set disabled(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * Gets the disabled attribute
   * @returns {boolean} - true if color-swatch disabled should show
   */
  get disabled(): boolean {
    return this.hasAttribute(attributes.DISABLED);
  }

  /** @param {string} value The hex code color to use */
  set hex(value: string) {
    this.setAttribute(attributes.HEX, value?.trim());
    this.container?.classList.remove('no-color');

    if (!value || value.toLowerCase() === 'transparent') {
      value = '';
      this.container?.classList.add('no-color');
      this.container?.style.setProperty('background-color', 'transparent');
    } else {
      this.container?.style.setProperty('background-color', value?.trim());
    }
  }

  /** @returns {string} The hex code being used */
  get hex(): string {
    return this.getAttribute(attributes.HEX) || '';
  }

  /** @param {string} value Text for this color swatch's label */
  set label(value: string) {
    this.setAttribute(attributes.LABEL, value);
  }

  /** @returns {string} The label for this color swatch */
  get label(): string {
    return this.getAttribute(attributes.LABEL) || this.hex;
  }

  /** @param {string} value Text for this color swatch's tooltip */
  set tooltip(value: string) {
    this.setAttribute(attributes.TOOLTIP, value);
  }

  /** @returns {string} The tooltip for this color swatch */
  get tooltip(): string {
    if (this.disabled) {
      return '';
    }

    return String(this.getAttribute(attributes.TOOLTIP) ?? '').trim();
  }

  /** @param {SwatchSizesType} value The color swatch's size (xs, sm, mm, md, lg) */
  set size(value: SwatchSizesType) {
    this.swatch?.classList.remove(...SwatchSizes);
    if (SwatchSizes.includes(value)) {
      this.swatch?.classList.add(value);
      this.setAttribute(attributes.SIZE, value);
    }
  }

  /** @returns {SwatchSizesType} The size of this color swatch (xs, sm, mm, md, lg) */
  get size(): SwatchSizesType {
    return (this.getAttribute(attributes.SIZE) as SwatchSizesType) ?? '';
  }

  /** Show this color swatch's tooltip */
  showTooltip(): void {
    if (this.disabled || !this.popup || !this.tooltip) return;

    this.popup.target = this;
    this.popup.innerText = String(this.tooltip).toLowerCase();

    if (this.popup.popup) {
      this.popup.popup.positionStyle = 'fixed';
    }

    this.popup.innerText = String(this.tooltip).trim();
    this.popup.visible = true;
  }

  /** Hide this color swatch's tooltip */
  hideTooltip(): void {
    if (this.popup) this.popup.visible = false;
  }

  /** Handle events */
  #attachEventHandlers(): void {
    this.#detachEventHandlers();

    this.onEvent('mouseenter.ids-color-tooltip', this, this.showTooltip);
    this.onEvent('mouseover.ids-color-tooltip', this, this.showTooltip);
    this.onEvent('mouseout.ids-color-tooltip', this, this.hideTooltip);
    this.onEvent('mouseleave.ids-color-tooltip', this, this.hideTooltip);
    this.onEvent('click.ids-color-tooltip', this, this.hideTooltip);
  }

  /** Detach event handlers */
  #detachEventHandlers(): void {
    this.offEvent('mouseenter.ids-color-tooltip', this);
    this.offEvent('mouseover.ids-color-tooltip', this);
    this.offEvent('mouseout.ids-color-tooltip', this);
    this.offEvent('mouseleave.ids-color-tooltip', this);
  }
}

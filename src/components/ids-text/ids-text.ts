import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { checkOverflow } from '../../utils/ids-dom-utils/ids-dom-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-text.scss';
import { type IdsColorValue } from '../../utils/ids-color-utils/ids-color-utils';

const fontWeightClasses = ['bold', 'semi-bold', 'lighter'] as const;
type FontWeightClasses = typeof fontWeightClasses[number];

// These types will have a CSS style class appended to them
const typesCssClasses = ['label', 'legend', 'span'];

// Text alignments
const TEXT_ALIGNMENTS = ['start', 'end', 'center', 'justify'];

// Statuses
const STATUSES = ['base', 'error', 'info', 'success', 'warning'];

const fontSizes: Array<object> = [
  { 10: '10px' },
  { 12: '12px' },
  { 14: '14px' },
  { 16: '16px' },
  { 20: '20px' },
  { 24: '24px' },
  { 28: '28px' },
  { 32: '32px' },
  { 40: '40px' },
  { 48: '48px' },
  { 60: '60px' },
  { 72: '72px' }
];

const Base = IdsColorVariantMixin(
  IdsLocaleMixin(
    IdsTooltipMixin(
      IdsEventsMixin(
        IdsElement
      )
    )
  )
);

/**
 * IDS Text Component
 * @type {IdsText}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsTooltipMixin
 * @mixes IdsEventsMixin
 * @part text - the text element
 */
@customElement('ids-text')
@scss(styles)
export default class IdsText extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
    if (this.color) this.color = this.getAttribute('color') as IdsColorValue | 'unset' | 'muted';
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.AUDIBLE,
      attributes.COLOR,
      attributes.DATA,
      attributes.DISABLED,
      attributes.DISPLAY,
      attributes.ERROR,
      attributes.FONT_SIZE,
      attributes.FONT_WEIGHT,
      attributes.LABEL,
      attributes.LINE_CLAMP,
      attributes.MAX_WIDTH,
      attributes.OVERFLOW,
      attributes.STATUS,
      attributes.TEXT_ALIGN,
      attributes.TRANSLATE_TEXT,
      attributes.TYPE,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    const tag = this.type || 'span';
    const fontWeight = this.fontWeight;

    let classList = 'ids-text';
    classList += this.status ? ` ${this.statusClass()}` : '';
    classList += this.textAlign ? ` ${this.textAlignClass()}` : '';
    classList += (this.overflow === 'ellipsis') ? ' ellipsis' : '';
    classList += (this.audible) ? ' audible' : '';
    classList += (this.label) ? ' label' : '';
    classList += this.fontSize ? ` ids-text-${this.fontSize}` : '';
    classList += (fontWeight === 'bold' || fontWeight === 'lighter' || fontWeight === 'semi-bold')
      ? ` ${this.fontWeight}` : '';

    return `<${tag}
      class="${classList}"
      part="text"
    ><slot></slot>
    </${tag}>`;
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate'];

  /**
   * Handle internal events
   * @private
   */
  #attachEventHandlers() {
    if (this.translateText) {
      this.onLanguageChange = async () => {
        await this.#translateAsync();
      };
    }
  }

  /**
   * Set the font size of the text with a class.
   * @param {string | number | null} value The font size in the font scheme
   * i.e. 10, 12, 16 ect increasing by increments of 4
   */
  set fontSize(value: string | number | null) {
    if (value) {
      this.setAttribute(attributes.FONT_SIZE, `${value}`);
    } else {
      this.removeAttribute(attributes.FONT_SIZE);
    }

    if (this.container) {
      fontSizes?.forEach((size) => {
        this.container?.classList.remove(`ids-text-${Object.keys(size)}`);
      });
      if (value) {
        this.container.classList.add(`ids-text-${value}`);
      }
    }
  }

  get fontSize(): string | null { return this.getAttribute(attributes.FONT_SIZE); }

  /**
   * Adjust font weight; can be either "bold" or "lighter"
   * @param {string | null} value (if bold)
   */
  set fontWeight(value: 'lighter' | 'bold' | 'semi-bold' | null) {
    this.container?.classList.remove(...fontWeightClasses);

    if (value && fontWeightClasses.includes(value)) {
      this.setAttribute(attributes.FONT_WEIGHT, value);
      this.container?.classList.add(value);
    } else {
      this.removeAttribute(attributes.FONT_WEIGHT);
    }
  }

  get fontWeight(): FontWeightClasses | null {
    return this.getAttribute(attributes.FONT_WEIGHT) as FontWeightClasses | null;
  }

  /**
   * Set the type of HTML element is (h1-h6, p, span (default))
   * @param {string | null} value  The type of element
   */
  set type(value: string | null) {
    if (value) {
      this.setAttribute(attributes.TYPE, value);
    } else {
      this.removeAttribute(attributes.TYPE);
    }

    this.render(true);
    this.#setTypeClass(value ?? '');
  }

  get type(): string | null { return this.getAttribute(attributes.TYPE); }

  /**
   * Sets a CSS Class on the container element for some Text types
   * @param {string} value the class type to check/add
   * @returns {void}
   */
  #setTypeClass(value: string): void {
    this.container?.classList.remove(...typesCssClasses);
    if (typesCssClasses.includes(value)) {
      this.container?.classList.add(value);
    }
  }

  /**
   * If set to "unset", color can be controlled by parent container
   * If set to "muted" will apply as disabled color
   * @param {IdsColorValue} value  "unset" or undefined/null
   */
  set color(value: IdsColorValue | 'unset' | 'muted') {
    const unsetClass = 'ids-text-color-unset';
    const mutedClass = 'ids-text-color-muted';
    this.container?.classList.remove(unsetClass, mutedClass);

    if (typeof value === 'string' && value !== '') {
      this.setAttribute(attributes.COLOR, value);
      if (value === 'unset') {
        this.container?.classList.add(unsetClass);
        this.container?.style.removeProperty('color');
      } else if (value === 'muted') {
        this.setAttribute(attributes.COLOR, value);
        this.container?.classList.add(mutedClass);
      } else this.container?.style.setProperty('color', `var(--ids-color-${value})`);
      return;
    }
    this.removeAttribute(attributes.COLOR);
  }

  get color(): IdsColorValue | 'unset' | 'muted' {
    return this.getAttribute(attributes.COLOR) as IdsColorValue;
  }

  /**
   * Set audible as screen reader only text
   * @param {boolean | string} value The audible value
   */
  set audible(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.AUDIBLE, value.toString());
      if (this.container && !this.container.classList.contains(attributes.AUDIBLE)) {
        this.container.classList.add('audible');
      }
    } else {
      this.removeAttribute(attributes.AUDIBLE);
      this.container?.classList.remove('audible');
    }
  }

  get audible(): boolean { return stringToBool(this.getAttribute(attributes.AUDIBLE)); }

  /**
   * Set the text to disabled color.
   * @param {boolean} value True if disabled
   */
  set disabled(value: boolean) {
    this.toggleAttribute(attributes.DISABLED, stringToBool(value));
  }

  get disabled(): boolean { return stringToBool(this.getAttribute(attributes.DISABLED)); }

  /**
   * Set the text to error color.
   * @param {boolean} value True if error text
   */
  set error(value: boolean) {
    const val = stringToBool(value);
    if (val) {
      if (this.container) this.container.classList.add('error');
      this.setAttribute(attributes.ERROR, val.toString());
      return;
    }
    this.removeAttribute(attributes.ERROR);
    if (this.container) this.container.classList.remove('error');
  }

  get error(): boolean { return stringToBool(this.getAttribute(attributes.ERROR)); }

  /**
   * Set the text to label color.
   * @param {boolean} value True if label text
   */
  set label(value: boolean) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.LABEL, val.toString());
      this.container?.classList.add('label');
      return;
    }
    this.removeAttribute(attributes.LABEL);
    if (this.container) this.container.classList.remove('label');
  }

  get label(): boolean { return stringToBool(this.getAttribute(attributes.LABEL)); }

  /**
   * Set the text to data color.
   * @param {boolean|string} value True if data text
   */
  set data(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.container?.classList.add('data');
      this.setAttribute(attributes.DATA, val.toString());
      return;
    }
    this.removeAttribute(attributes.DATA);
    this.container?.classList.remove('data');
  }

  get data(): boolean { return stringToBool(this.getAttribute(attributes.DATA)); }

  /**
   * Set the maxWidth of the text (used for ellipsis)
   * @param {string | null} value The value of the max-width
   */
  set maxWidth(value: string | null) {
    if (value) {
      this.setAttribute(attributes.MAX_WIDTH, value);
      this.container?.style.setProperty('max-width', `${parseInt(value)}px`, 'important');
    } else {
      this.removeAttribute(attributes.MAX_WIDTH);
      this.container?.style.removeProperty('max-width');
    }
  }

  get maxWidth(): string | null { return this.getAttribute(attributes.MAX_WIDTH); }

  /**
   * Truncates text at a specific number of lines.
   * @param {string | number | null} value The number of lines
   */
  set lineClamp(value: string | number | null) {
    if (value) {
      this.setAttribute(attributes.LINE_CLAMP, `${value}`);
      this.container?.style.setProperty('-webkit-line-clamp', `${value}`);
      this.container?.classList.add('has-line-clamp');
    } else {
      this.removeAttribute(attributes.LINE_CLAMP);
      this.container?.style.removeProperty('-webkit-line-clamp');
      this.container?.classList.remove('has-line-clamp');
    }
  }

  get lineClamp(): string | null { return this.getAttribute(attributes.LINE_CLAMP); }

  /**
   * Set how content overflows; can specify 'ellipsis', or undefined or 'none'
   * @param {string | null} value how content is overflow
   */
  set overflow(value: string | null) {
    const isEllipsis = value === 'ellipsis';

    if (isEllipsis) {
      this.container?.classList.add('ellipsis');
      this.setAttribute('overflow', 'ellipsis');
    } else {
      this.container?.classList.remove('ellipsis');
      this.removeAttribute('overflow');
    }
  }

  get overflow(): string | null {
    return this.getAttribute('overflow');
  }

  /**
   * Set the given text align
   * @param {string} value The value
   */
  set textAlign(value: string) {
    this.container?.classList.remove(...this.textAlignClass(true));

    if (TEXT_ALIGNMENTS.includes(value)) {
      this.setAttribute(attributes.TEXT_ALIGN, value);
      this.container?.classList.add(this.textAlignClass() as string);
    } else {
      this.removeAttribute(attributes.TEXT_ALIGN);
    }
  }

  get textAlign(): string {
    return this.getAttribute(attributes.TEXT_ALIGN) ?? '';
  }

  /**
   * Get text-align class name/s with prefixed value
   * @param {boolean|undefined} isAll If true, will return all classes as array
   * @returns {string|Array<string>} The class name with prefix
   */
  textAlignClass(isAll?: boolean): string | Array<string> {
    const prefixed = (v: string) => `text-align-${v}`;
    return isAll ? TEXT_ALIGNMENTS.map((v) => prefixed(v)) : prefixed(this.textAlign);
  }

  /**
   * Set the given status
   * @param {string} value The value
   */
  set status(value: string | null) {
    this.container?.classList.remove(...this.statusClass(true));

    if (STATUSES.includes(value ?? '')) {
      this.setAttribute(attributes.STATUS, value ?? '');
      this.container?.classList.add(this.statusClass() as string);
    } else {
      this.removeAttribute(attributes.STATUS);
    }
  }

  get status(): string | null {
    return this.getAttribute(attributes.STATUS);
  }

  /**
   * Get status class name/s with prefixed value
   * @param {boolean|undefined} isAll If true, will return all classes as array
   * @returns {string|Array<string>} The class name with prefix
   */
  statusClass(isAll?: boolean): string | Array<string> {
    const prefixed = (v: string) => `status-${v}`;
    return isAll ? STATUSES.map((v) => prefixed(v)) : prefixed(this.status ?? '');
  }

  /**
   * If set to true the value in the text will be considered a key and
   * sent to the translation function
   * @param {boolean} value If true translate this value
   */
  set translateText(value: boolean) {
    const val = stringToBool(value);
    if (val && !this.getAttribute('translation-key')) {
      this.setAttribute(attributes.TRANSLATE_TEXT, val.toString());
      this.setAttribute('translation-key', this.textContent ?? '');
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.#translateAsync();
    }
  }

  get translateText(): boolean {
    return stringToBool(this.getAttribute(attributes.TRANSLATE_TEXT));
  }

  /**
   * Translate the contents asyncronously
   * @private
   */
  async #translateAsync() {
    const translationKey = this.getAttribute('translation-key');

    if (!this.localeAPI || !translationKey) {
      return;
    }

    this.textContent = this.localeAPI.translate(translationKey);
  }

  canTooltipShow() {
    if (this.tooltip && this.tooltip !== 'false' && this.container) {
      return ((checkOverflow(this.container) || checkOverflow(this.parentElement))) || false;
    }
    return false;
  }
}

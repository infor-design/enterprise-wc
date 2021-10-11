import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix,
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

// Import Mixins
import {
  IdsEventsMixin,
  IdsRenderLoopMixin,
  IdsRenderLoopItem,
  IdsColorVariantMixin,
  IdsTooltipMixin,
  IdsThemeMixin,
  IdsLocaleMixin
} from '../../mixins';

import styles from './ids-text.scss';

const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 60, 72];
const fontWeightClasses = ['bold', 'lighter'];

// These types will have a CSS style class appended to them
const typesCssClasses = ['label', 'legend', 'span'];

/**
 * IDS Text Component
 * @type {IdsText}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsRenderLoopMixin
 * @mixes IdsEventsMixin
 * @mixes IdsTooltipMixin
 * @mixes IdsLocaleMixin
 * @part text - the text element
 */
@customElement('ids-text')
@scss(styles)
class IdsText extends mix(IdsElement).with(
    IdsRenderLoopMixin,
    IdsEventsMixin,
    IdsThemeMixin,
    IdsTooltipMixin,
    IdsLocaleMixin,
    IdsColorVariantMixin
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#attachEventHandlers();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
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
      attributes.LANGUAGE,
      attributes.LOCALE,
      attributes.MODE,
      attributes.OVERFLOW,
      attributes.TRANSLATE_TEXT,
      attributes.TYPE,
      attributes.VERSION,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const tag = this.type || 'span';

    let classList = 'ids-text';
    classList += this.color === 'unset' ? ' ids-text-color-unset' : '';
    classList += (this.overflow === 'ellipsis') ? ' ellipsis' : '';
    classList += ((this.audible)) ? ' audible' : '';
    classList += this.fontSize ? ` ids-text-${this.fontSize}` : '';
    classList += (this.fontWeight === 'bold' || this.fontWeight === 'lighter')
      ? ` ${this.fontWeight}` : '';

    return `<${tag}
      class="${classList}"
      mode="${this.mode}"
      version="${this.version}"
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
      this.offEvent('languagechange.text-container');
      this.onEvent('languagechange.text-container', this.closest('ids-container'), async (e) => {
        await this.setLanguage(e.detail.language.name);
        this.#translateAsync();
      });

      this.offEvent('languagechange.text');
      this.onEvent('languagechange.text', this, async (e) => {
        await this.locale.setLanguage(e.detail.language.name);
        this.#translateAsync();
      });
    }
  }

  /**
   * Set the font size/style of the text with a class.
   * @param {string | null} value The font size in the font scheme
   * i.e. 10, 12, 16 or xs, sm, base, lg, xl
   */
  set fontSize(value) {
    fontSizes.forEach((size) => this.container?.classList.remove(`ids-text-${size}`));

    if (value) {
      this.setAttribute(attributes.FONT_SIZE, value);
      this.container?.classList.add(`ids-text-${value}`);
      return;
    }

    this.removeAttribute(attributes.FONT_SIZE);
  }

  get fontSize() { return this.getAttribute(attributes.FONT_SIZE); }

  /**
   * Adjust font weight; can be either "bold" or "lighter"
   * @param {string | null} value (if bold)
   */
  set fontWeight(value) {
    let hasValue = false;

    switch (value) {
    case 'bold':
    case 'lighter':
      hasValue = true;
      break;
    default:
      break;
    }

    this.container?.classList.remove(...fontWeightClasses);

    if (hasValue) {
      this.setAttribute(attributes.FONT_WEIGHT, value);
      this.container?.classList.add(value);
      return;
    }

    this.removeAttribute(attributes.FONT_WEIGHT);
  }

  get fontWeight() {
    return this.getAttribute(attributes.FONT_WEIGHT);
  }

  /**
   * Set the type of element it is (h1-h6, span (default))
   * @param {string | null} value  The type of element
   */
  set type(value) {
    if (value) {
      this.setAttribute(attributes.TYPE, value);
    } else {
      this.removeAttribute(attributes.TYPE);
    }

    this.render();
    this.#setTypeClass(value);
  }

  get type() { return this.getAttribute(attributes.TYPE); }

  /**
   * Sets a CSS Class on the container element for some Text types
   * @param {string} value the class type to check/add
   * @returns {void}
   */
  #setTypeClass(value) {
    this.container.classList.remove(...typesCssClasses);
    if (typesCssClasses.includes(value)) {
      this.container.classList.add(value);
    }
  }

  /**
   * If set to "unset", color can be controlled by parent container
   * @param {string | null} value  "unset" or undefined/null
   */
  set color(value) {
    if (value === 'unset') {
      this.setAttribute(attributes.COLOR, value);
      this.container.classList.add('ids-text-color-unset');
      return;
    }
    if (typeof value === 'string') {
      this.setAttribute(attributes.COLOR, value);
      this.container.classList.remove('ids-text-color-unset');
      this.container.style.color = `var(--ids-color-palette-${value})`;
      return;
    }
    this.removeAttribute(attributes.COLOR);
    this.container.classList.remove('ids-text-color-unset');
  }

  get color() {
    return this.getAttribute(attributes.COLOR);
  }

  /**
   * Set `audible` string (screen reader only text)
   * @param {string | null} value The `audible` attribute
   */
  set audible(value) {
    const isValueTruthy = IdsStringUtils.stringToBool(value);

    if (isValueTruthy && this.container && !this.container?.classList.contains('audible')) {
      this.container.classList.add('audible');
      this.setAttribute(attributes.AUDIBLE, value);
    }

    if (!isValueTruthy && this.container?.classList.contains('audible')) {
      this.container.classList.remove('audible');
      this.removeAttribute(attributes.AUDIBLE);
    }
  }

  get audible() { return this.getAttribute(attributes.AUDIBLE); }

  /**
   * Set the text to disabled color.
   * @param {boolean} value True if disabled
   */
  set disabled(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, value);
      return;
    }
    this.removeAttribute(attributes.DISABLED);
  }

  get disabled() { return this.getAttribute(attributes.DISABLED); }

  /**
   * Set the text to error color.
   * @param {boolean} value True if error text
   */
  set error(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.container.classList.add('error');
      this.setAttribute(attributes.ERROR, value);
      return;
    }
    this.removeAttribute(attributes.ERROR);
    this.container.classList.remove('error');
  }

  get error() { return this.getAttribute(attributes.ERROR); }

  /**
   * Set the text to label color.
   * @param {boolean} value True if label text
   */
  set label(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.container.classList.add('label');
      this.setAttribute(attributes.LABEL, value);
      return;
    }
    this.removeAttribute(attributes.LABEL);
    this.container.classList.remove('label');
  }

  get label() { return this.getAttribute(attributes.LABEL); }

  /**
   * Set the text to data color.
   * @param {boolean} value True if data text
   */
  set data(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.container.classList.add('data');
      this.setAttribute(attributes.DATA, value);
      return;
    }
    this.removeAttribute(attributes.DATA);
    this.container.classList.remove('data');
  }

  get data() { return this.getAttribute(attributes.DATA); }

  /**
   * Set how content overflows; can specify 'ellipsis', or undefined or 'none'
   * @param {string | null} [value=null] how content is overflow
   */
  set overflow(value) {
    const isEllipsis = value === 'ellipsis';

    if (isEllipsis) {
      this.container?.classList.add('ellipsis');
      this.setAttribute('overflow', 'ellipsis');
    } else {
      this.container?.classList.remove('ellipsis');
      this.removeAttribute('overflow');
    }
  }

  get overflow() {
    return this.getAttribute('overflow');
  }

  /**
   * If set to true the value in the text will be considered a key and
   * sent to the translation function
   * @param {boolean} value If true translate this value
   */
  set translateText(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (val && !this.getAttribute('translation-key')) {
      this.setAttribute(attributes.TRANSLATE_TEXT, value);
      this.setAttribute('translation-key', this.textContent);
      this.#translateAsync();
    }
  }

  /**
   * Translate the contents asyncronously
   * @private
   */
  async #translateAsync() {
    await this.locale.setLanguage(this.language.name);
    this.textContent = this.locale.translate(this.getAttribute('translation-key') || this.textContent);
  }

  get translateText() {
    return this.getAttribute(attributes.TRANSLATE_TEXT);
  }
}

export default IdsText;

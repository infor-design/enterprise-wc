import {
  IdsElement,
  customElement,
  scss,
  props,
  mix,
  stringUtils
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsTooltipMixin,
  IdsThemeMixin,
  IdsLocaleMixin
} from '../ids-mixins';

import styles from './ids-text.scss';

const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 60, 72];
const fontWeightClasses = ['bold', 'bolder'];

/**
 * IDS Text Component
 * @type {IdsText}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @mixes IdsTooltipMixin
 * @mixes IdsLocaleMixin
 * @part text - the text element
 */
@customElement('ids-text')
@scss(styles)
class IdsText extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsThemeMixin,
    IdsTooltipMixin,
    IdsLocaleMixin
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.handleEvents();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      ...super.properties,
      props.COLOR,
      props.AUDIBLE,
      props.DISABLED,
      props.ERROR,
      props.FONT_SIZE,
      props.FONT_WEIGHT,
      props.LABEL,
      props.MODE,
      props.OVERFLOW,
      props.TYPE,
      props.TRANSLATE_TEXT,
      props.VERSION
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
    classList += (this.fontWeight === 'bold' || this.fontWeight === 'bolder')
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
   * Handle internal events
   * @private
   */
  handleEvents() {
    if (this.translateText) {
      this.offEvent('languagechanged.container');
      this.onEvent('languagechanged.container', this.closest('ids-container'), async (e) => {
        await this.locale.setLanguage(e.detail.language.name);
        this.#translateAsync();
      });

      this.offEvent('languagechanged.this');
      this.onEvent('languagechanged.this', this, async (e) => {
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
      this.setAttribute(props.FONT_SIZE, value);
      this.container?.classList.add(`ids-text-${value}`);
      return;
    }

    this.removeAttribute(props.FONT_SIZE);
  }

  get fontSize() { return this.getAttribute(props.FONT_SIZE); }

  /**
   * Adjust font weight; can be either "bold" or "bolder"
   * @param {string | null} value (if bold)
   */
  set fontWeight(value) {
    let hasValue = false;

    switch (value) {
    case 'bold':
    case 'bolder':
      hasValue = true;
      break;
    default:
      break;
    }

    this.container?.classList.remove(...fontWeightClasses);

    if (hasValue) {
      this.setAttribute(props.FONT_WEIGHT, value);
      this.container?.classList.add(value);
      return;
    }

    this.removeAttribute(props.FONT_WEIGHT);
  }

  get fontWeight() {
    return this.getAttribute(props.FONT_WEIGHT);
  }

  /**
   * Set the type of element it is (h1-h6, span (default))
   * @param {string | null} value  The type of element
   */
  set type(value) {
    if (value) {
      this.setAttribute(props.TYPE, value);
    } else {
      this.removeAttribute(props.TYPE);
    }

    this.render();
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * If set to "unset", color can be controlled by parent container
   * @param {string | null} value  "unset" or undefined/null
   */
  set color(value) {
    if (value === 'unset') {
      this.setAttribute(props.COLOR, value);
      this.container.classList.add('ids-text-color-unset');
    } else {
      this.removeAttribute(props.COLOR);
      this.container.classList.remove('ids-text-color-unset');
    }

    this.render();
  }

  get color() {
    return this.getAttribute(props.COLOR);
  }

  /**
   * Set `audible` string (screen reader only text)
   * @param {string | null} value The `audible` attribute
   */
  set audible(value) {
    const isValueTruthy = stringUtils.stringToBool(value);

    if (isValueTruthy && this.container && !this.container?.classList.contains('audible')) {
      this.container.classList.add('audible');
      this.setAttribute(props.AUDIBLE, value);
    }

    if (!isValueTruthy && this.container?.classList.contains('audible')) {
      this.container.classList.remove('audible');
      this.removeAttribute(props.AUDIBLE);
    }
  }

  get audible() { return this.getAttribute(props.AUDIBLE); }

  /**
   * Set the text to disabled color.
   * @param {boolean} value True if disabled
   */
  set disabled(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.DISABLED, value);
      return;
    }
    this.removeAttribute(props.DISABLED);
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Set the text to error color.
   * @param {boolean} value True if error text
   */
  set error(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.container.classList.add('error');
      this.setAttribute(props.ERROR, value);
      return;
    }
    this.removeAttribute(props.ERROR);
    this.container.classList.remove('error');
  }

  get error() { return this.getAttribute(props.ERROR); }

  /**
   * Set the text to label color.
   * @param {boolean} value True if error text
   */
  set label(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.container.classList.add('label');
      this.setAttribute(props.LABEL, value);
      return;
    }
    this.removeAttribute(props.LABEL);
    this.container.classList.remove('label');
  }

  get label() { return this.getAttribute(props.LABEL); }

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
    const val = stringUtils.stringToBool(value);
    if (val && !this.getAttribute('translation-key')) {
      this.setAttribute(props.TRANSLATE_TEXT, value);
      this.setAttribute('translation-key', this.textContent);
      this.#translateAsync();
      return;
    }
    this.removeAttribute(props.TRANSLATE_TEXT);
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
    return this.getAttribute(props.TRANSLATE_TEXT);
  }
}

export default IdsText;

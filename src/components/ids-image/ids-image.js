import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

// Supporting components
import IdsIcon from '../ids-icon';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

// Import Styles
import styles from './ids-image.scss';

/**
 * IDS Image Component
 * @type {IdsImage}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 */
@customElement('ids-image')
@scss(styles)
class IdsImage extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachEventHandlers();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.SRC,
      attributes.ALT,
      attributes.SIZE,
      attributes.PLACEHOLDER,
      attributes.FALLBACK
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    // placeholder attribute or no src attribute provided
    if (this.placeholder || !this.src) {
      return `
        <div class="ids-image placeholder" tabindex="0">
          <span class="audible">Placeholder Image</span>
          <ids-icon icon="insert-image"></ids-icon>
        </div>
      `;
    }

    return `<img class="ids-image" src="${this.src}" alt="${this.alt}" tabindex="0" />`;
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   */
  attachEventHandlers() {
    if (this.src && !this.placeholder) {
      this.offEvent('error.image');
      this.onEvent('error.image', this.container, () => {
        if (this.fallback) {
          // Removing img on error loading
          this.shadowRoot.querySelector('img').remove();

          // Adding placeholder element
          const div = document.createElement('div');
          div.classList = 'ids-image placeholder';
          div.setAttribute('tabindex', 0);
          div.innerHTML = `
            <span class="audible">Placeholder Image</span>
            <ids-icon icon="insert-image"></ids-icon>
          `;
          this.shadowRoot.appendChild(div);
        }
      });
    }

    return this;
  }

  /**
   * @returns {string} src attribute value
   */
  get src() {
    return this.getAttribute(attributes.SRC);
  }

  /**
   * Set the src
   * @param {string} val src attribute value
   */
  set src(val) {
    this.setAttribute(attributes.SRC, val);
  }

  /**
   * @returns {string} alt attribute value
   */
  get alt() {
    return this.getAttribute(attributes.ALT);
  }

  /**
   * Set the alt
   * @param {string} val alt attribute value
   */
  set alt(val) {
    this.setAttribute(attributes.ALT, val);
  }

  /**
   * Get one of predefined sizes
   * @param {string} val any incoming value
   * @returns {string} one of predefined sizes
   */
  #getSize(val) {
    // List of sizes to compare with size attribute value
    const sizes = ['auto', 'sm', 'md', 'lg'];

    if (val && sizes.includes(val)) {
      return val;
    }

    // set auto as default or if incorrect attribute value
    return sizes[0];
  }

  /**
   * @returns {string} one of predefined sizes
   */
  get size() {
    const attrVal = this.getAttribute(attributes.SIZE);

    return this.#getSize(attrVal);
  }

  /**
   * Set the size
   * @param {string} val size value
   */
  set size(val) {
    this.setAttribute(attributes.SIZE, this.#getSize(val));
  }

  set placeholder(val) {
    const boolVal = IdsStringUtils.stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.PLACEHOLDER, boolVal);

      return;
    }

    this.removeAttribute(attributes.PLACEHOLDER);
  }

  get placeholder() {
    const attrVal = this.getAttribute(attributes.PLACEHOLDER);

    return IdsStringUtils.stringToBool(attrVal);
  }

  set fallback(val) {
    const boolVal = IdsStringUtils.stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.FALLBACK, boolVal);

      return;
    }

    this.removeAttribute(attributes.FALLBACK);
  }

  get fallback() {
    const attrVal = this.getAttribute(attributes.FALLBACK);

    return IdsStringUtils.stringToBool(attrVal);
  }
}

export default IdsImage;

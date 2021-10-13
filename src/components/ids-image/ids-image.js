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
      attributes.FALLBACK,
      attributes.ROUND
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    // Initially has placeholder attribute or no src attribute provided
    if (this.placeholder || !this.src) {
      return `<div class="ids-image placeholder" tabindex="0"><span class="audible">Placeholder Image</span><ids-icon icon="insert-image"></ids-icon></div>`;
    }

    return `<img class="ids-image" src="${this.src}" tabindex="0" />`;
  }

  /**
   * Add error event when img attached to shadow
   * @param {HTMLElement} img element to attach error event
   */
  #attachOnErrorEvent(img) {
    this.offEvent('error.image');
    this.onEvent('error.image', img, () => {
      // Removing img on error loading
      this.shadowRoot.querySelector('img').remove();

      // Adding placeholder element
      this.shadowRoot.appendChild(this.#getPlaceholderEl());
    });
  }

  /**
   * Remove error event when the image is removed
   */
  #detachOnErrorEvent() {
    this.offEvent('error.image');
  }

  /**
   * @param {string} src attribute value
   * @param {string} alt attribute value
   * @returns {HTMLElement} img element to attach to shadow
   */
  #getImgEl(src, alt) {
    const img = document.createElement('img');
    img.classList = 'ids-image';
    img.setAttribute('tabindex', 0);
    img.setAttribute('src', src);
    if (alt) {
      img.setAttribute('alt', alt);
    }

    return img;
  }

  /**
   * @returns {HTMLElement} placeholder element to attach to shadow
   */
  #getPlaceholderEl() {
    const placeholder = document.createElement('div');
    placeholder.classList = 'ids-image placeholder';
    placeholder.setAttribute('tabindex', 0);
    placeholder.innerHTML = '<span class="audible">Placeholder Image</span><ids-icon icon="insert-image"></ids-icon>';

    return placeholder;
  }

  /**
   * Path to the image
   * @returns {string} src attribute value
   */
  get src() {
    return this.getAttribute(attributes.SRC);
  }

  /**
   * Set the path to the image
   * @param {string} val src attribute value
   */
  set src(val) {
    let img = this.shadowRoot.querySelector('img');

    if (val && !this.placeholder) {
      if (img) {
        img.setAttribute(attributes.SRC, val);
      } else {
        // Removing placeholder
        this.shadowRoot.querySelector('.placeholder')?.remove();

        // Adding image element
        img = this.#getImgEl(val, this.alt);
        this.shadowRoot.appendChild(img);
      }

      if (this.fallback) {
        this.#attachOnErrorEvent(img);
      }

      this.setAttribute(attributes.SRC, val);

      return;
    }

    if (img) {
      // Removing image element
      img.remove();

      this.#detachOnErrorEvent();

      // Adding placeholder element
      this.shadowRoot.appendChild(this.#getPlaceholderEl());
    }

    this.removeAttribute(attributes.SRC);
  }

  /**
   * An alternate text for the image
   * @returns {string} alt attribute value
   */
  get alt() {
    return this.getAttribute(attributes.ALT);
  }

  /**
   * Set an alternate text for the image
   * @param {string} val alt attribute value
   */
  set alt(val) {
    const img = this.shadowRoot.querySelector('img');
    if (val) {
      this.setAttribute(attributes.ALT, val);
      img?.setAttribute(attributes.ALT, val);

      return;
    }

    this.removeAttribute(attributes.ALT, val);
    img?.removeAttribute(attributes.ALT, val);
  }

  /**
   * Get one of the predefined sizes
   * @param {string} val size attribute value
   * @returns {'auto'|'sm'|'md'|'lg'} one of the predefined sizes
   */
  #getSize(val) {
    // List of sizes to compare with size attribute value
    const sizes = ['auto', 'sm', 'md', 'lg'];

    if (val && sizes.includes(val)) {
      return val;
    }

    // Set auto as default or if incorrect attribute value
    return sizes[0];
  }

  /**
   * Size for the image
   * @returns {'auto'|'sm'|'md'|'lg'} one of the predefined sizes
   */
  get size() {
    const attrVal = this.getAttribute(attributes.SIZE);

    return this.#getSize(attrVal);
  }

  /**
   * Set the size for the image
   * @param {string} val size attribute value
   */
  set size(val) {
    this.setAttribute(attributes.SIZE, this.#getSize(val));
  }

  /**
   * Placeholder attribute
   * @returns {boolean} placeholder attribute value converted to boolean
   */
  get placeholder() {
    const attrVal = this.getAttribute(attributes.PLACEHOLDER);

    return IdsStringUtils.stringToBool(attrVal);
  }

  /**
   * Set whether or not to replace image with placeholder initially
   * @param {string} val placeholder attribute value
   */
  set placeholder(val) {
    const boolVal = IdsStringUtils.stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.PLACEHOLDER, boolVal);

      return;
    }

    this.removeAttribute(attributes.PLACEHOLDER);
  }

  /**
   * Fallback attribute
   * @returns {boolean} fallback attribute value converted to boolean
   */
  get fallback() {
    const attrVal = this.getAttribute(attributes.FALLBACK);

    return IdsStringUtils.stringToBool(attrVal);
  }

  /**
   * Set whether or not to replace image with placeholder if the image fails to load
   * @param {string} val fallback attribute value
   */
  set fallback(val) {
    const boolVal = IdsStringUtils.stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.FALLBACK, boolVal);

      return;
    }

    this.removeAttribute(attributes.FALLBACK);
  }

  /**
   * Round attribute
   * @returns {boolean} round attribute value converted to boolean
   */
  get round() {
    const attrVal = this.getAttribute(attributes.ROUND);

    return IdsStringUtils.stringToBool(attrVal);
  }

  /**
   * Set whether or not the image is round
   * @param {string} val round attribute value
   */
  set round(val) {
    const boolVal = IdsStringUtils.stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.ROUND, boolVal);

      return;
    }

    this.removeAttribute(attributes.ROUND);
  }
}

export default IdsImage;

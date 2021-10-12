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
      attributes.FALLBACK
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

    return `<img class="ids-image" src="${this.src}" alt="${this.alt}" tabindex="0" />`;
  }

  /**
   * Add error event when img attached to shadow
   * @param {HTMLElement} img element to attach error event
   */
  #attachOnError(img) {
    this.offEvent('error.image');
    this.onEvent('error.image', img, () => {
      // Removing img on error loading
      this.shadowRoot.querySelector('img').remove();

      // Adding placeholder element
      this.shadowRoot.appendChild(this.#getPlaceholderEl());
    });
  }

  /**
   * Remove error event when img detached from shadow
   */
  #detachOnError() {
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
        this.#attachOnError(img);
      }

      this.setAttribute(attributes.SRC, val);

      return;
    }

    if (img) {
      // Removing image element
      img.remove();

      this.#detachOnError();

      // Adding placeholder element
      this.shadowRoot.appendChild(this.#getPlaceholderEl());
    }

    this.removeAttribute(attributes.SRC);
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
   * Get one of predefined sizes
   * @param {string} val size attribute value
   * @returns {'auto'|'sm'|'md'|'lg'} one of predefined sizes
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
   * @returns {'auto'|'sm'|'md'|'lg'} one of predefined sizes
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

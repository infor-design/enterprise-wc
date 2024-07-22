import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-icon/ids-icon';
import '../ids-text/ids-text';

import styles from './ids-image.scss';
import { IdsColorValueCategories } from '../../utils/ids-color-utils/ids-color-utils';

const Base = IdsEventsMixin(
  IdsElement
);

/**
 * IDS Image Component
 * @type {IdsImage}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-image')
@scss(styles)
export default class IdsImage extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ALT,
      attributes.COLOR,
      attributes.FALLBACK,
      attributes.INITIALS,
      attributes.PLACEHOLDER,
      attributes.ROUND,
      attributes.SIZE,
      attributes.SRC,
      attributes.USER_STATUS
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    // Initially has initials attribute
    if (this.initials) {
      return `<div class="ids-image initials"><ids-text font-size="24" font-weight="semi-bold">${this.initials}</ids-text></div>`;
    }

    // Initially has placeholder attribute or no src attribute provided
    if (this.placeholder || !this.src) {
      return `<div class="ids-image placeholder"><span class="audible">Placeholder Image</span><ids-icon icon="insert-image"></ids-icon></div>`;
    }

    return `<img class="ids-image" src="${this.src}" alt="${this.alt}"/>`;
  }

  /**
   * Add error event when img attached to shadow
   * @param {HTMLImageElement} img element to attach error event
   */
  #attachOnErrorEvent(img: HTMLImageElement) {
    this.offEvent('error.image');
    this.onEvent('error.image', img, () => {
      // Removing img on error loading
      this.shadowRoot?.querySelector('img')?.remove();

      // Adding placeholder element
      this.shadowRoot?.appendChild(this.#getPlaceholderEl());
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
  #getImgEl(src: string, alt: string): HTMLImageElement {
    const element = document.createElement('img');
    element.classList.add('ids-image');
    element.setAttribute('src', src);
    if (alt) {
      element.setAttribute('alt', alt);
    }

    return element;
  }

  /**
   * @returns {HTMLElement} placeholder element to attach to shadow
   */
  #getPlaceholderEl(): HTMLElement {
    const element = document.createElement('div');
    element.classList.add('ids-image', 'placeholder');
    element.innerHTML = '<span class="audible">Placeholder Image</span><ids-icon icon="insert-image"></ids-icon>';

    return element;
  }

  /**
   * Path to the image
   * @returns {string} src attribute value
   */
  get src(): string {
    return this.getAttribute(attributes.SRC) || '';
  }

  /**
   * Set the path to the image
   * @param {string} val src attribute value
   */
  set src(val: string) {
    let img = this.shadowRoot?.querySelector('img');

    if (val && !this.placeholder) {
      if (img) {
        img.setAttribute(attributes.SRC, val);
      } else {
        // Removing placeholder
        this.shadowRoot?.querySelector('.placeholder, .initials')?.remove();
        // Adding image element
        img = this.#getImgEl(val, this.alt);
        this.shadowRoot?.appendChild(img);
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
      this.shadowRoot?.appendChild(this.#getPlaceholderEl());
    }

    this.removeAttribute(attributes.SRC);
  }

  /**
   * An alternate text for the image
   * @returns {string} alt attribute value
   */
  get alt(): string {
    return this.getAttribute(attributes.ALT) || '';
  }

  /**
   * Set an alternate text for the image
   * @param {string} val alt attribute value
   */
  set alt(val: string) {
    const img = this.shadowRoot?.querySelector('img');
    if (val) {
      this.setAttribute(attributes.ALT, val);
      img?.setAttribute(attributes.ALT, val);
      return;
    }

    this.removeAttribute(attributes.ALT);
    img?.removeAttribute(attributes.ALT);
  }

  /**
   * Set the alert color
   * @param {IdsColorValueCategories} value The color to use between:
   * 'red' | 'yellow' | 'orange' | 'green' | 'blue' | 'teal' | 'purple'| 'gray' | 'neutral' | 'white' | 'black';
   */
  set color(value: IdsColorValueCategories) {
    if (value) {
      this.setAttribute(attributes.COLOR, value);
      if (value === 'neutral') value = 'grey';
      (this.shadowRoot?.querySelector('.initials') as HTMLDivElement)?.style.setProperty('background-color', `var(--ids-color-accent-${value}-strong)`);
    } else {
      this.removeAttribute(attributes.COLOR);
    }
  }

  get color(): IdsColorValueCategories {
    return this.getAttribute(attributes.COLOR) as IdsColorValueCategories;
  }

  /**
   * Get one of the predefined sizes
   * @param {string} val size attribute value
   * @returns {'auto'|'sm'|'md'|'lg'} one of the predefined sizes
   */
  #getSize(val: string | null) {
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
  set size(val: string | null) {
    this.setAttribute(attributes.SIZE, this.#getSize(val));
  }

  /**
   * Placeholder attribute
   * @returns {boolean} placeholder attribute value converted to boolean
   */
  get placeholder() {
    const attrVal = this.getAttribute(attributes.PLACEHOLDER);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not to replace image with placeholder initially
   * @param {string} val placeholder attribute value
   */
  set placeholder(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.PLACEHOLDER, String(boolVal));

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

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not to replace image with placeholder if the image fails to load
   * @param {string} val fallback attribute value
   */
  set fallback(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.FALLBACK, String(boolVal));

      return;
    }

    this.removeAttribute(attributes.FALLBACK);
  }

  /**
   * Round attribute
   * @returns {boolean} round attribute value converted to boolean
   */
  get round(): boolean {
    const attrVal = this.getAttribute(attributes.ROUND);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the image is round
   * @param {string} val round attribute value
   */
  set round(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.ROUND, String(boolVal));

      return;
    }

    this.removeAttribute(attributes.ROUND);
  }

  /**
   * Get one of the predefined statuses
   * @param {string} val user status attribute value
   * @returns {'available'|'away'|'busy'|'do-not-disturb'|'unknown'|null} one of the predefined statuses
   */
  #getStatus(val: string | null) {
    // List of available statuses
    const statuses = ['available', 'away', 'busy', 'do-not-disturb', 'unknown'];

    if (val && statuses.includes(val)) {
      return val;
    }

    // No status attribute or status is not in the available
    return null;
  }

  /**
   * Get element to render when adding or changing the status
   * @param {'available'|'away'|'busy'|'do-not-disturb'|'unknown'} status one of predefined statuses
   * @returns {HTMLElement} status element to attach to shadow
   */
  #getStatusEl(status: string) {
    const element = document.createElement('div');
    element.classList.add('user-status', status);
    element.innerHTML = `<ids-icon icon="user-status-${status}" fill="inherit"></ids-icon>`;

    return element;
  }

  /**
   * User status attribute
   * @returns {'available'|'away'|'busy'|'do-not-disturb'|'unknown'|null} one of predefined statuses
   */
  get userStatus() {
    const attrVal = this.getAttribute(attributes.USER_STATUS);

    return this.#getStatus(attrVal);
  }

  /**
   * Set user status and render html element
   * @param {string} val user status parameter value
   */
  set userStatus(val: string | null) {
    const status = this.#getStatus(val);
    const element = this.shadowRoot?.querySelector('.user-status');

    // Clear element before rerender
    element?.remove();

    if (status) {
      this.shadowRoot?.appendChild(this.#getStatusEl(status));
      this.setAttribute(attributes.USER_STATUS, status);
      return;
    }

    this.removeAttribute(attributes.USER_STATUS);
  }

  /**
   * Get element to render when adding or changing the initials
   * @param {string} initials cropped text
   * @returns {HTMLElement} initials element to attach to shadow
   */
  #getInitialsEl(initials: string) {
    const element = document.createElement('div');
    element.classList.add('ids-image', 'initials');
    element.innerHTML = `<ids-text font-size="24" font-weight="semi-bold">${initials}</ids-text>`;

    return element;
  }

  /**
   * Initials attribute
   * @returns {string} initials attribute value
   */
  get initials() {
    return this.getAttribute(attributes.INITIALS);
  }

  /**
   * Set initials and render html element
   * @param {string|null} val initials parameter value
   */
  set initials(val) {
    const element = this.shadowRoot?.querySelector('.ids-image');
    const cropText = val?.substring(0, 2);

    // Clear element before rerender
    element?.remove();

    if (val) {
      this.shadowRoot?.appendChild(this.#getInitialsEl(cropText ?? ''));
      this.setAttribute(attributes.INITIALS, val);
      return;
    }

    // Add placeholder if initials removed
    this.shadowRoot?.appendChild(this.#getPlaceholderEl());
    this.removeAttribute(attributes.INITIALS);
  }
}

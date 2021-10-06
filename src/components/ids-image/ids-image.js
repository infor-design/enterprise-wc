import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

// TODO: supporting components IdsIcon

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
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<img src="${this.src}" alt="${this.alt}" />`;
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   */
  attachEventHandlers() {
    this.offEvent('error.image');
    this.onEvent('error.image', this.container, (e) => {
      console.log('%c error', 'color: green', e)
    });

    // TODO: on load image if placeholder remove

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
}

export default IdsImage;

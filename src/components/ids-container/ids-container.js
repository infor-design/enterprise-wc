import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

import { IdsStringUtils } from '../../utils';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin,
  IdsLocaleMixin,
  IdsColorVariantMixin,
} from '../../mixins';

import styles from './ids-container.scss';

/**
 * IDS Container Component
 * @type {IdsContainer}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @part container - the entire container element
 */
@customElement('ids-container')
@scss(styles)
class IdsContainer extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsLocaleMixin,
    IdsColorVariantMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback?.();

    /* istanbul ignore next */
    if (this.reset) {
      this.#addReset();
    }
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.LANGUAGE,
      attributes.LOCALE,
      attributes.PADDING,
      attributes.RESET,
      attributes.SCROLLABLE,
      attributes.VERSION
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-container" part="container"${this.scrollable === 'true' ? ' tabindex="0"' : ''}><slot></slot></div>`;
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate'];

  /**
   * If set to number the container will have padding added (in pixels)
   * @param {string} value sets the padding to the container
   */
  set padding(value) {
    this.container.style.padding = `${value}px`;
    this.setAttribute(attributes.PADDING, value.toString());
  }

  get padding() {
    return this.getAttribute(attributes.PADDING);
  }

  /**
   * If set to true the container is scrollable
   * @param {boolean|string} value true of false depending if the tag is scrollable
   */
  set scrollable(value) {
    if (IdsStringUtils.stringToBool(value)) {
      this.setAttribute(attributes.SCROLLABLE, 'true');
      this.container.setAttribute(attributes.SCROLLABLE, 'true');
      this.container.setAttribute('tabindex', '0');
      return;
    }

    this.setAttribute(attributes.SCROLLABLE, 'false');
    this.container.setAttribute(attributes.SCROLLABLE, 'false');
    this.container.removeAttribute('tabindex');
  }

  get scrollable() { return this.getAttribute(attributes.SCROLLABLE) || 'true'; }

  /**
   * Add the reset to the body
   * @private
   */
  #addReset() {
    document.querySelector('body').style.margin = '0';
  }

  /**
   * If set to true body element will get reset
   * @param {boolean|string} value true of false
   */
  set reset(value) {
    if (IdsStringUtils.stringToBool(value)) {
      this.#addReset();
      return;
    }
    this.removeAttribute(attributes.RESET);
    document.querySelector('body').style.margin = '';
  }

  get reset() { return this.getAttribute(attributes.RESET) || 'true'; }
}

export default IdsContainer;

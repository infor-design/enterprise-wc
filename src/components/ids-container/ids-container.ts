import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-container.scss';

const Base = IdsLocaleMixin(
  IdsColorVariantMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Container Component
 * @type {IdsContainer}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @part container - the entire container element
 */
@customElement('ids-container')
@scss(styles)
export default class IdsContainer extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    if (this.reset) {
      this.#addReset();
    }

    // Remove hidden for FOUC
    this.onEvent('load.container', window, () => {
      this.removeAttribute('hidden');
      this.offEvent('load.container', window);
    });

    // In some cases the page may be loaded
    if (document.readyState === 'complete') {
      this.removeAttribute('hidden');
    }

    this.container?.style.setProperty('padding', `${this.padding}px`);
    if (this.backgroundColor) {
      this.backgroundColor = this.getAttribute('background-color') || '';
    }
  }

  disconnectedCallback() {
    this.localeAPI.removeLangAttribute();
    super.disconnectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.BACKGROUND_COLOR,
      attributes.LANGUAGE,
      attributes.LOCALE,
      attributes.PADDING,
      attributes.RESET,
      attributes.SCROLLABLE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
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
  set padding(value: string) {
    if (this.container) this.container.style.padding = `${value}px`;
    this.setAttribute(attributes.PADDING, value.toString());
  }

  get padding(): any {
    return this.getAttribute(attributes.PADDING);
  }

  /**
   * If set to true the container is scrollable
   * @param {boolean|string} value true of false depending if the tag is scrollable
   */
  set scrollable(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SCROLLABLE, 'true');
      this.container?.setAttribute(attributes.SCROLLABLE, 'true');
      this.container?.setAttribute('tabindex', '0');
      return;
    }

    this.setAttribute(attributes.SCROLLABLE, 'false');
    this.container?.setAttribute(attributes.SCROLLABLE, 'false');
    this.container?.removeAttribute('tabindex');
  }

  get scrollable(): boolean | string { return this.getAttribute(attributes.SCROLLABLE) || 'true'; }

  /**
   * Add the reset to the body
   * @private
   */
  #addReset() {
    document.querySelector('body')?.style.setProperty('margin', '0');
  }

  /**
   * If set to true body element will get a "css reset"
   * @param {boolean|string} value true of false
   */
  set reset(value: boolean | string) {
    if (stringToBool(value)) {
      this.#addReset();
      return;
    }
    this.removeAttribute(attributes.RESET);
    document.querySelector('body')?.style.setProperty('margin', '');
  }

  get reset(): boolean | string { return this.getAttribute(attributes.RESET) || 'true'; }

  /**
   * Pass in a css variable name to set the background color
   * @param {string} value css variable to use
   */
  set backgroundColor(value: string) {
    if (value) {
      this.container?.style.setProperty('background-color', `var(${value})`);
      return;
    }
    this.container?.style.setProperty('background-color', '');
  }

  get backgroundColor(): string { return this.getAttribute(attributes.BACKGROUND_COLOR) || 'true'; }
}

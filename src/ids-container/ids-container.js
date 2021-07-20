import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes,
  stringUtils
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-container.scss';

/**
 * IDS Container Component
 * @type {IdsContainer}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @part container - the entire container element
 */
@customElement('ids-container')
@scss(styles)
class IdsContainer extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      attributes.MODE,
      attributes.PADDING,
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
   * If set to number the container will have padding added (in pixels)
   * @param {string} value sets the padding to the container
   */
  set padding(value) {
    const double = Number(value) * 2;
    this.style.margin = '-8px';
    this.container.style.padding = `${value}px`;
    this.container.style.height = `calc(100% - ${double}px)`;
    this.container.style.width = `calc(100% - ${double}px)`;
    this.setAttribute('padding', value.toString());
  }

  get padding() {
    return this.getAttribute('padding');
  }

  /**
   * If set to true the container is scrollable
   * @param {boolean|string} value true of false depending if the tag is scrollable
   */
  set scrollable(value) {
    if (stringUtils.stringToBool(value)) {
      this.setAttribute('scrollable', 'true');
      this.container.setAttribute('scrollable', 'true');
      this.container.setAttribute('tabindex', '0');
      return;
    }

    this.setAttribute('scrollable', 'false');
    this.container.setAttribute('scrollable', 'false');
    this.container.removeAttribute('tabindex');
  }

  get scrollable() { return this.getAttribute('scrollable') || 'true'; }
}

export default IdsContainer;

import {
  IdsElement,
  customElement,
  scss,
  mix,
  props
} from '../ids-base/ids-element';

// Import Mixins
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';
import { IdsStringUtils as stringUtils } from '../ids-base/ids-string-utils';

// @ts-ignore Import inline styles
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
  static get properties() {
    return [props.SCROLLABLE, props.MODE, props.VERSION];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-container" part="container"><slot></slot></div>`;
  }

  /**
   * If set to true the container is scollable
   * @param {boolean|string} value true of false depending if the tag is scrollable
   */
  set scrollable(value) {
    if (stringUtils.stringToBool(value)) {
      this.setAttribute('scrollable', value.toString());
      return;
    }

    this.setAttribute('scrollable', 'false');
  }

  get scrollable() { return this.getAttribute('scrollable') || 'true'; }
}

export default IdsContainer;

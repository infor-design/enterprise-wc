import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-loading-indicator.scss';

/**
 * IDS Loader Component
 * @type {IdsLoadingIndicator}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part loader - the loader container element
 */
@customElement('ids-loading-indicator')
@scss(styles)
class IdsLoadingIndicator extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  /**
   * Call the constructor and then initialize
   */
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
    return [attributes.MODE, attributes.VERSION];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-loading-indicator" part="loader">
      <div class="ids-loading-indicator-indeterminate"></div>
    </div>`;
  }
}

export default IdsLoadingIndicator;

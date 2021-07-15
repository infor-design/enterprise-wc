// Import Base and Decorators
import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

// Import Sass to be encapsulated in the component shadowRoot
import styles from './ids-scroll-view.scss';

/**
 * IDS Scroll View Component
 * @type {IdsScrollView}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part wrapper - the parent wrapper element
 * @part container - the parent container element
 */
@customElement('ids-scroll-view')
@scss(styles)
class IdsScrollView extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters and setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
    ];
  }

  /**
   * Create the template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-scroll-view-container" part="container">
        <div class="ids-scroll-view" part="scroll-view">
          <slot name="scroll-view-item"></slot>
        </div>
        <div class="ids-scroll-view-controls" part="controls">
        </div>
    </div>`;
  }
}

export default IdsScrollView;

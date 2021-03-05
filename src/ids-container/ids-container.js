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
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.MODE, props.VERSION];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return '<div class="ids-container" part="container"><slot></slot></div>';
  }
}

export default IdsContainer;

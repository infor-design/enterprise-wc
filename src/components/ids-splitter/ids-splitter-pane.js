import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../../core';

// Import Mixins
import { IdsEventsMixin, IdsLocaleMixin, IdsThemeMixin } from '../../mixins';
import styles from './ids-splitter-pane.scss';

/**
 * IDS SplitterPane Component
 * @type {IdsSplitterPane}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 * @part pane - the splitter pane container element
 */
@customElement('ids-splitter-pane')
@scss(styles)
class IdsSplitterPane extends mix(IdsElement).with(IdsEventsMixin, IdsLocaleMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [...super.attributes];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-splitter-pane" part="pane"><slot></slot></div>`;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
  }
}

export default IdsSplitterPane;

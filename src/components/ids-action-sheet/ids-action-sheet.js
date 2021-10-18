import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

import IdsOverlay from '../ids-modal/ids-overlay';
import styles from './ids-action-sheet.scss';

/**
 * IDS Action Sheet Component
 * @type {IdsActionSheet}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-action-sheet')
@scss(styles)
class IdsActionSheet extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [attributes.HIDE];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-action-sheet">
        <ids-overlay opacity=".7" visible></ids-overlay>
        <div class="ids-action-sheet-inner">
          <slot></slot>
          <ids-button part="cancel-btn">
            <span slot="text">Cancel</span>
          </ids-button>
        </div>
      </div>
    `;
  }
}

export default IdsActionSheet;

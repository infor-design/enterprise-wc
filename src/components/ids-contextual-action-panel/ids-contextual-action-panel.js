import {
  customElement,
  scss,
} from '../../core/ids-element';

import IdsModal from '../ids-modal';
import '../ids-toolbar';

import styles from './ids-contextual-action-panel.scss';

/**
 * IDS Contextual Action Panel
 * @type {IdsContextualActionPanel}
 * @inherits IdsModal
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-contextual-action-panel')
@scss(styles)
class IdsContextualActionPanel extends IdsModal {
  constructor() {
    super();

    if (!this.state) {
      this.state = {};
    }
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#refreshHeader();
  }

  get toolbar() {
    return this.querySelector('[slot="toolbar"]');
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const toolbarHidden = this.toolbar.length ? '' : 'hidden';
    const footerHidden = this.buttons.length ? '' : ' hidden';

    return `<ids-popup part="modal" class="ids-modal ids-contextual-action-panel" type="custom" position-style="viewport">
      <div class="ids-modal-container" slot="content">
        <div class="ids-modal-header">
          <slot name="toolbar" ${toolbarHidden}></slot>
        </div>
        <div class="ids-modal-content">
          <slot></slot>
        </div>
        <div class="ids-modal-footer" ${footerHidden}>
          <slot name="buttons"></slot>
        </div>
      </div>
    </ids-popup>`;
  }

  #refreshHeader() {
    this.container.querySelector('slot[name="toolbar"]').hidden = this.toolbar.length;
  }
}

export default IdsContextualActionPanel;

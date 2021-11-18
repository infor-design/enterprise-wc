import { customElement, scss } from '../../core/ids-decorators';

import IdsModal from '../ids-modal/ids-modal';
import IdsToolbar from '../ids-toolbar/ids-toolbar';
import Base from './ids-contextual-action-pane-base';

import styles from './ids-contextual-action-panel.scss';

/**
 * IDS Contextual Action Panel
 * @type {IdsContextualActionPanel}
 * @inherits IdsModal
 */
@customElement('ids-contextual-action-panel')
@scss(styles)
class IdsContextualActionPanel extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#refreshHeader();

    this.popup.animationStyle = 'slide-from-bottom';
  }

  get toolbar() {
    return this.querySelector('[slot="toolbar"]');
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const toolbarHidden = this.toolbar !== undefined ? '' : 'hidden';
    const footerHidden = this.buttons !== undefined ? '' : ' hidden';

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
    this.container.querySelector('slot[name="toolbar"]').hidden = this.toolbar === undefined;
  }

  /**
   * Overrides `addOpenEvents` from both Modal and the IdsPopupOpenEventsMixin to include
   * a way to tie in Toolbar buttons to the Modal's standard `onButtonClick` callback
   * @returns {void}
   */
  addOpenEvents() {
    super.addOpenEvents();

    // If a Modal Button is clicked, fire an optional callback
    const toolbarSlot = this.container.querySelector('slot[name="toolbar"]');
    this.onEvent('click.toolbar', toolbarSlot, (e) => {
      this.handleButtonClick(e);
    });
  }

  /**
   * Overrides `addOpenEvents` from both Modal and the IdsPopupOpenEventsMixin to include
   * a way to tie in Toolbar buttons to the Modal's standard `onButtonClick` callback
   * @returns {void}
   */
  removeOpenEvents() {
    super.removeOpenEvents();
    this.offEvent('click.toolbar');
  }
}

export default IdsContextualActionPanel;

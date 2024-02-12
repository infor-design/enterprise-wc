import { customElement, scss } from '../../core/ids-decorators';
import IdsModal from '../ids-modal/ids-modal';
import '../ids-toolbar/ids-toolbar';
import styles from './ids-action-panel.scss';

/**
 * IDS Action Panel
 * @type {IdsActionPanel}
 * @inherits IdsModal
 */
@customElement('ids-action-panel')
@scss(styles)
export default class IdsActionPanel extends IdsModal {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#refreshHeader();
    if (this.popup) {
      this.popup.animationStyle = 'slide-from-bottom';
    }
  }

  get toolbar(): HTMLSlotElement | null {
    return this.querySelector<HTMLSlotElement>('[slot="toolbar"]');
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<ids-popup
      part="modal"
      class="ids-modal ids-action-panel"
      type="modal"
      position-style="viewport"
      animated="true"
      animation-style="slide-from-bottom">
      <div class="ids-modal-container" slot="content">
        <div class="ids-modal-header">
          <slot name="toolbar"></slot>
        </div>
        <div class="ids-modal-content">
          <slot></slot>
        </div>
        <div class="ids-modal-footer">
          <slot name="buttons"></slot>
        </div>
      </div>
    </ids-popup>`;
  }

  #refreshHeader() {
    const toolbarSlot = this.container?.querySelector<HTMLSlotElement>('slot[name="toolbar"]');
    if (toolbarSlot) {
      toolbarSlot.hidden = this.toolbar === undefined;
    }
  }

  /**
   * Overrides `addOpenEvents` from both Modal and the IdsPopupOpenEventsMixin to include
   * a way to tie in Toolbar buttons to the Modal's standard `onButtonClick` callback
   * @returns {void}
   */
  addOpenEvents(): void {
    super.addOpenEvents();

    // If a Modal Button is clicked, fire an optional callback
    const toolbarSlot = this.container?.querySelector('slot[name="toolbar"]');
    this.onEvent('click.toolbar', toolbarSlot, (e: MouseEvent) => {
      this.handleButtonClick(e);
    });
  }

  /**
   * Overrides `addOpenEvents` from both Modal and the IdsPopupOpenEventsMixin to include
   * a way to tie in Toolbar buttons to the Modal's standard `onButtonClick` callback
   * @returns {void}
   */
  removeOpenEvents(): void {
    super.removeOpenEvents();
    this.offEvent('click.toolbar');
  }
}

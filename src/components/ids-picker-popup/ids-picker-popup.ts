import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-picker-popup-base';
import styles from './ids-picker-popup.scss';

/**
 * IDS Picker Popup Component
 * @abstract
 * @type {IdsPickerPopup}
 * @inherits IdsPopup
 * @mixes IdsAttachmentMixin
 * @mixes IdsPopupInteractionsMixin
 * @mixes IdsPopupOpenEventsMixin
 */
@customElement('ids-picker-popup')
@scss(styles)
abstract class IdsPickerPopup extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    this.disconnectedCallback?.();
  }

  static get attributes(): Array<string> {
    return [...super.attributes];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<ids-popup class="ids-picker-popup" type="menu" align="bottom, left" arrow="bottom" tabIndex="-1" y="12" animated>
      <slot slot="content"></slot>
    </ids-popup>`;
  }

  /**
   * @returns {Array<string>} Date Picker vetoable events
   */
  vetoableEventTypes: Array<string> = ['beforeshow'];

  /**
   * Component-specific logic that should occur when a picker popup hides
   */
  abstract onHide(): void;

  /**
   * Component-specific logic that should occur when a picker popup is displayed
   */
  abstract onShow(): void;

  /**
   * Hides this menu and any of its submenus.
   * @returns {void}
   */
  async hide(): Promise<void> {
    if (!this.popup.visible) return;

    this.removeOpenEvents();

    // Hide the Ids Popup and all Submenus
    this.popup.visible = false;
    await this.popup.hide();

    if (typeof this.onHide === 'function') this.onHide();

    this.hidden = true;
  }

  /**
   * @returns {void}
   */
  show(): void {
    if (this.popup.visible) return;

    // Trigger a veto-able `beforeshow` event.
    if (!this.triggerVetoableEvent('beforeshow')) {
      return;
    }

    this.hidden = false;

    // Show the popup and do placement
    this.popup.visible = true;
    this.popup.show();

    if (typeof this.onShow === 'function') this.onShow();

    this.addOpenEvents();
  }

  /**
   * Toggles visibility of the popup on/off depending on its current state
   * @returns {void}
   */
  toggleVisibility() {
    if (!this.popup.visible) {
      this.show();
    } else {
      this.hide();
    }
  }

  onTriggerClick() {
    this.toggleVisibility();
  }

  onOutsideClick(e: Event) {
    if (!this.contains(e.target as HTMLElement)) {
      this.hide();
    }
  }
}

export default IdsPickerPopup;

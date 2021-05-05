import {
  IdsElement,
  customElement,
  props,
  scss,
  mix
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../ids-render-loop/ids-render-loop-mixin';
import { IdsResizeMixin } from '../ids-base/ids-resize-mixin';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';

import IdsPopup from '../ids-popup/ids-popup';

// @ts-ignore
import styles from './ids-modal.scss';

const MODAL_PROPS = [];

const appliedMixins = [
  IdsEventsMixin,
  IdsRenderLoopMixin,
  IdsResizeMixin,
  IdsThemeMixin,
];

/**
 * IDS Modal Component
 * @type {IdsModal}
 * @inherits IdsElement
 * @mixes IdsRenderLoopMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part popup - the popup outer element
 */
@customElement('ids-modal')
@scss(styles)
class IdsModal extends mix(IdsElement).with(...appliedMixins) {
  constructor() {
    super();

    this.state = {
      open: false,
      triggerElement: null
    };
  }

  static get properties() {
    return [...super.properties, ...MODAL_PROPS];
  }

  connectedCallback() {
    super.connectedCallback();
    this.popup.type = 'menu';
    this.popup.animated = true;
    this.refresh();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<ids-popup part="popup" type="menu">
      <slot slot="content"></slot>
    </ids-popup>`;
  }

  /**
   * @readonly
   * @returns {IdsPopup} the inner Popup
   */
  get popup() {
    return this.shadowRoot.querySelector('ids-popup');
  }

  /**
   * @returns {boolean} true if the Modal is visible.
   */
  get visible() {
    return this.popup.visible;
  }

  /**
   * @param {boolean} val true if the Modal is visible.
   */
  set visible(val) {
    this.popup.visible = val;
    if (val) {
      this.refresh();
    }
  }

  /**
   * Shows the modal
   * @returns {void}
   */
  show() {
    this.popup.visible = true;
  }

  /**
   * Hides the modal
   * @returns {void}
   */
  hide() {
    this.popup.visible = false;
  }

  /**
   * // @TODO: Temporary - replace this with IdsPopup's proper centering within a container
   * @returns {void}
   */
  refresh() {
    this.popup.alignTarget = null;
    this.popup.align = 'center, center';
    this.popup.x = window.outerWidth / 2;
    this.popup.y = window.outerHeight / 2;
  }
}

export default IdsModal;

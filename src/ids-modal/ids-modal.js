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
class IdsModal extends IdsPopup {
  constructor() {
    super();
  }

  static get properties() {
    return [...super.properties, ...MODAL_PROPS];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-popup ids-modal" part="popup">
      <div class="arrow" part="arrow"></div>
      <div class="content-wrapper">
        <slot name="content"></slot>
      </div>
    </div>`;
  }
}

export default IdsModal;

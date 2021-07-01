import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';

import IdsModal, { IdsModalButton } from '../ids-modal';

import { attributes } from '../ids-base/ids-attributes';
import { IdsStringUtils } from '../ids-base/ids-string-utils';
import IdsDOMUtils from '../ids-base/ids-dom-utils';

// @ts-ignore
import styles from './ids-message.scss';

const MESSAGE_ATTRIBUTES = [
  attributes.MESSAGE,
  attributes.STATUS,
  attributes.TITLE
];

/**
 * IDS Message Component
 * @type {IdsMessage}
 * @inherits IdsModal
 * @part popup - the popup outer element
 * @part overlay - the inner overlay element
 */
@customElement('ids-message')
@scss(styles)
class IdsMessage extends IdsModal {
  constructor() {
    super();
  }

  static get attributes() {
    return [...super.attributes, ...MESSAGE_ATTRIBUTES];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<ids-popup part="modal" class="ids-modal ids-message" type="menu">
      <div class="ids-message-container" slot="content">
        <div class="ids-message-header">
          <slot name="title"></slot>
        </div>
        <div class="ids-message-content">
          <slot></slot>
        </div>
        <div class="ids-message-footer">
          <slot name="buttons"></slot>
        </div>
      </div>
    </ids-popup>`;
  }

  /**
   * @readonly
   * @returns {IdsModal} internal Modal instance
   */
  get modal() {
    return this.container;
  }

  /**
   * Add additional open events
   */
  applyOpenEvents() {
    super.applyOpenEvents();

    // When a cancel button is clicked, hide the Message
    this.onEvent('click.cancel', this.container, (e) => {
      const modalBtn = e.target.closest('ids-modal-button');
      if (modalBtn.cancel) {
        this.hide();
      }
    });
  }

  /**
   * Remove additional Open Events
   */
  removeOpenEvents() {
    super.removeOpenEvents();

    this.offEvent('click.cancel');
  }
}

export default IdsModal;

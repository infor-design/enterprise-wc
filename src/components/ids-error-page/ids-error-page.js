import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core/ids-element';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../../mixins';

import IdsModal from '../ids-modal';
import IdsEmptyMessage from '../ids-empty-message';
import IdsIcon from '../ids-icon/ids-icon';
import styles from './ids-error-page.scss';

const DEFAULT_ICON = 'empty-error-loading';

/**
 * IDS Error Page Component
 * @type {IdsErrorPage}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-error-page')
@scss(styles)
class IdsErrorPage extends mix(IdsModal).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#attachEventHandlers();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.BUTTON_TEXT,
      attributes.DESCRIPTION,
      attributes.ICON,
      attributes.LABEL
    ];
  }

  template() {
    return `<ids-popup part="modal" class="ids-modal ids-error" type="custom" position-style="viewport">
      <div class="ids-modal-container" slot="content">
        <ids-empty-message icon="${!this.icon ? DEFAULT_ICON : this.icon}">
          <ids-text
            type="h2"
            font-size="24"
            font-weight="bold"
            label="true"
            slot="label"
          >
            ${!this.label ? 'Add Label' : this.label}
          </ids-text>
          <ids-text label="true" slot="description">
            ${!this.description ? 'Add Description' : this.description}
          </ids-text>
          <ids-button class="action-button" slot="button" type="primary">
            <span slot="text">${!this.buttonText ? 'Action' : this.buttonText}</span>
          </ids-button>
        </ids-empty-message>
      </div>
    </ids-popup>`;
  }

  /**
   * Set the icon
   * @param {string} value icon id
   * @memberof IdsErrorPage
   */
  set icon(value) {
    if (value) {
      this.setAttribute(attributes.ICON, value);
    } else {
      this.removeAttribute(attributes.ICON);
    }

    const emptyMessage = this.shadowRoot.querySelector('ids-empty-message');
    if (emptyMessage) {
      emptyMessage.icon = value;
    }
  }

  /**
   * Get the icon
   * @returns {string} the icon attribute
   * @readonly
   * @memberof IdsErrorPage
   */
  get icon() {
    return this.getAttribute(attributes.ICON);
  }

  /**
   * Set the label
   * @param {string} value label text
   * @memberof IdsErrorPage
   */
  set label(value) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }

    this.#refreshText('[slot="label"]', value);
  }

  /**
   * Get the label
   * @returns {string} the label text
   * @readonly
   * @memberof IdsErrorPage
   */
  get label() {
    return this.getAttribute(attributes.LABEL);
  }

  /**
   * Set the description text
   * @param {string} value description text
   * @memberof IdsErrorPage
   */
  set description(value) {
    if (value) {
      this.setAttribute(attributes.DESCRIPTION, value);
    } else {
      this.removeAttribute(attributes.DESCRIPTION);
    }

    this.#refreshText('[slot="description"]', value);
  }

  /**
   * Get the description text
   * @returns {string} the description text
   * @readonly
   * @memberof IdsErrorPage
   */
  get description() {
    return this.getAttribute(attributes.DESCRIPTION);
  }

  /**
   * Set the button text
   * @param {string} value button text
   * @memberof IdsErrorPage
   */
  set buttonText(value) {
    if (value) {
      this.setAttribute(attributes.BUTTON_TEXT, value);
    } else {
      this.removeAttribute(attributes.BUTTON_TEXT);
    }

    this.#refreshText('[slot="button"]', value);
  }

  /**
   * Get the button text
   * @returns {string} button text
   * @readonly
   * @memberof IdsErrorPage
   */
  get buttonText() {
    return this.getAttribute(attributes.BUTTON_TEXT);
  }

  /**
   * Attach the error page event handlers
   * @private
   */
  #attachEventHandlers() {
    const button = this.shadowRoot.querySelector('.action-button');
    const actionBtnEvent = 'action-button';

    this.onEvent('click', button, (e) => {
      this.triggerEvent(actionBtnEvent, this, {
        detail: {
          elem: this,
          nativeEvent: e,
        }
      });
    });

    this.onEvent('touchstart', button, (e) => {
      this.triggerEvent(actionBtnEvent, this, {
        detail: {
          elem: this,
          nativeEvent: e,
        }
      });
    });
  }

  /**
   * Used for ARIA Labels and other content
   * @readonly
   * @returns {string} concatenating the label and description.
   */
  get ariaLabelContent() {
    const label = this.querySelector('[slot="label"')?.innerText;
    return `${label || ''} ${this.label || ''} ${this.description || ''}`;
  }

  /**
   * Refresh the text attributes
   * @param {object} el dom element to query
   * @param {string} value attribute value
   * @private
   */
  #refreshText(el, value) {
    const elText = this.shadowRoot.querySelector(el);
    if (elText) {
      elText.innerHTML = value ? value.toString() : '';
    }
  }
}

export default IdsErrorPage;

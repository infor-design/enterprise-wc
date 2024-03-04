import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsModal from '../ids-modal/ids-modal';

import '../ids-empty-message/ids-empty-message';
import '../ids-icon/ids-icon';
import styles from './ids-error-page.scss';
import type IdsEmptyMessage from '../ids-empty-message/ids-empty-message';

const DEFAULT_ICON = 'empty-error-loading';

/**
 * IDS Error Page Component
 * @type {IdsErrorPage}
 * @inherits IdsElement
 */
@customElement('ids-error-page')
@scss(styles)
export default class IdsErrorPage extends IdsModal {
  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#attachEventHandlers();
    this.overlay.visible = true;
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.BUTTON_TEXT,
      attributes.DESCRIPTION,
      attributes.ICON,
      attributes.LABEL
    ];
  }

  template(): string {
    return `<ids-popup part="modal" class="ids-modal ids-error" type="modal" position-style="viewport">
      <div class="ids-modal-container" slot="content">
        <ids-empty-message icon="${this.icon ?? DEFAULT_ICON}">
          <ids-text
            type="h2"
            font-size="24"
            font-weight="semi-bold"
            label="true"
            slot="label"
          >
          ${this.label ?? 'Add Label'}
          </ids-text>
          <ids-text label="true" slot="description">
            ${this.description ?? 'Add Description'}
          </ids-text>
          <ids-button class="action-button" slot="button" appearance="primary">
            <span>${this.buttonText ?? 'Action'}</span>
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
  set icon(value: string | null) {
    if (value) {
      this.setAttribute(attributes.ICON, value);
    } else {
      this.removeAttribute(attributes.ICON);
    }

    if (!this.container) return;

    const emptyMessage = this.container.querySelector<IdsEmptyMessage>('ids-empty-message');
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
  set label(value: string | null) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }

    this.#refreshText('[slot="label"]', value);
    this.refreshAriaLabel();
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
  set description(value: string | null) {
    if (value) {
      this.setAttribute(attributes.DESCRIPTION, value);
    } else {
      this.removeAttribute(attributes.DESCRIPTION);
    }

    this.#refreshText('[slot="description"]', value);
    this.refreshAriaLabel();
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
  set buttonText(value: string | null) {
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
  #attachEventHandlers(): void {
    const button = this.container?.querySelector('.action-button');
    const actionBtnEvent = 'action-button';

    this.onEvent('click', button, (e:Event) => {
      this.triggerEvent(actionBtnEvent, this, {
        detail: {
          elem: this,
          nativeEvent: e,
        }
      });
    });

    this.onEvent('touchend', button, (e:Event) => {
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
    const label = this.querySelector<HTMLElement>('[slot="label"')?.innerText;
    return `${label || ''} ${this.label || ''} ${this.description || ''}`;
  }

  /**
   * Refresh the text attributes
   * @param {string} el dom element selector to query
   * @param {string} value attribute value
   * @private
   */
  #refreshText(el: string, value: string | null): void {
    if (!this.container) return;
    const elText = this.container.querySelector(el);
    if (elText) {
      elText.innerHTML = value ? value.toString() : '';
    }
  }
}

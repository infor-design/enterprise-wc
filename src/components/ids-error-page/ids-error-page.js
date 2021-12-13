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
            ${this.label}
          </ids-text>
          <ids-text label="true" slot="description">${this.description}</ids-text>
          <ids-button class="action-button" slot="button" type="primary">
            <span slot="text">${!this.buttonText ? 'Action' : this.buttonText}</span>
          </ids-button>
        </ids-empty-message>
      </div>
    </ids-popup>`;
  }

  set icon(value) {
    if (value) {
      this.setAttribute(attributes.ICON, value);
    } else {
      this.removeAttribute(attributes.ICON);
    }
  }

  get icon() {
    return this.getAttribute(attributes.ICON);
  }

  set label(value) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }
  }

  get label() {
    return this.getAttribute(attributes.LABEL);
  }

  set description(value) {
    if (value) {
      this.setAttribute(attributes.DESCRIPTION, value);
    } else {
      this.removeAttribute(attributes.DESCRIPTION);
    }
  }

  get description() {
    return this.getAttribute(attributes.DESCRIPTION);
  }

  set buttonText(value) {
    if (value) {
      this.setAttribute(attributes.BUTTON_TEXT, value);
    } else {
      this.removeAttribute(attributes.BUTTON_TEXT);
    }
  }

  get buttonText() {
    return this.getAttribute(attributes.BUTTON_TEXT);
  }

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
}

export default IdsErrorPage;

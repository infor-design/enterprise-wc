import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-tag-base';

import styles from './ids-tag.scss';

/**
 * IDS Tag Component
 * @type {IdsTag}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @part tag - the tag element
 * @part icon - the icon element
 */
@customElement('ids-tag')
@scss(styles)
export default class IdsTag extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
    this.#setContainerColor(this.color);
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      attributes.COLOR,
      attributes.CLICKABLE,
      attributes.DISMISSIBLE,
      attributes.DISABLED,
      attributes.MODE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return '<span class="ids-tag" part="tag"><slot></slot></span>';
  }

  /**
   * Set the tag color
   * @param {string} value The color value, this can be not provided,
   * secondary (white), error, success, danger, caution or a hex code with the #
   */
  set color(value: string) {
    if (value) {
      this.setAttribute(attributes.COLOR, value);
    } else {
      this.removeAttribute(attributes.COLOR);
    }
    this.#setContainerColor(value);
    this.#addDimissibleIcon();
  }

  get color(): string { return this.getAttribute(attributes.COLOR); }

  /**
   * Set the tag color on the element style
   * @param {string} value The color value
   */
  #setContainerColor(value: string) {
    if (this.container) {
      this.container?.classList.remove('secondary', 'info', 'success', 'warning', 'error');
      this.container.style.backgroundColor = '';
      this.container.style.borderColor = '';
      this.container.style.color = '';

      if (value) {
        if (value.substring(0, 1) === '#') {
          this.container.style.backgroundColor = value;
          this.container.style.borderColor = value;
        } else {
          this.container.classList.add(value);
        }
      }
    }
  }

  /**
   * Check if an icon exists if not add it
   * @param {string} iconName The icon name to check
   * @private
   */
  #appendIcon(iconName: string) {
    const icon = this.querySelector(`[icon="${iconName}"]`);
    if (!icon) {
      this.insertAdjacentHTML(
        'beforeend',
        `<ids-icon part="icon" icon="${iconName}" size="xsmall" class="ids-icon"></ids-icon>`
      );
      this.#attachEventHandlers();
    }
  }

  /**
   * Check if an icon exists if so, remove it
   * @param {string} iconName The icon name to check
   * @private
   */
  #removeIcon(iconName: string) {
    const icon = this.querySelector(`[icon="${iconName}"]`);
    if (icon) {
      icon.remove();
    }
  }

  /**
   * If set to true the tag has an x to dismiss
   * @param {boolean|string} value true of false depending if the tag is dismissed
   */
  set dismissible(value: boolean) {
    const isDismissible = stringToBool(value);
    if (isDismissible) {
      this.setAttribute(attributes.DISMISSIBLE, value.toString());
    } else {
      this.removeAttribute(attributes.DISMISSIBLE);
    }

    this.#addDimissibleIcon();
  }

  get dismissible(): boolean { return stringToBool(this.getAttribute(attributes.DISMISSIBLE)); }

  /**
   * Add the dismissible icon if the tag is dismissible
   * @private
   */
  #addDimissibleIcon() {
    if (this.container) {
      if (this.dismissible) {
        this.container.classList.add(attributes.FOCUSABLE);
        this.#appendIcon('close');
        this.#attachKeyboardListeners();
      } else {
        this.#removeIcon('close');
        this.container.classList.remove(attributes.FOCUSABLE);
      }
    }
  }

  /**
   * If set to true the tag has focus state and becomes a clickable link
   * @param {boolean} value true of false depending if the tag is clickable
   */
  set clickable(value: boolean) {
    const isClickable = stringToBool(value);
    if (isClickable) {
      this.setAttribute(attributes.CLICKABLE, value.toString());
    } else {
      this.removeAttribute(attributes.CLICKABLE);
    }

    if (this.container) {
      if (isClickable) {
        this.container.classList.add(attributes.FOCUSABLE);
        this.container.setAttribute(attributes.TABINDEX, '0');
        this.#attachKeyboardListeners();
      } else {
        this.container.removeAttribute(attributes.TABINDEX);
        this.container.classList.remove(attributes.FOCUSABLE);
      }
    }
  }

  get clickable(): boolean { return this.getAttribute(attributes.CLICKABLE); }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #attachEventHandlers(): this {
    // Handle Clicking the x for dismissible
    const closeIcon = this.querySelector('ids-icon[icon="close"]');
    if (closeIcon) {
      this.offEvent('click', closeIcon);
      this.onEvent('click', closeIcon, () => {
        if (!this.disabled) {
          this.dismiss();
        }
      });
    }

    // Ensure icon is always last
    let isChanging = false;
    this.offEvent('slotchange', this.shadowRoot?.querySelector('slot'));
    this.onEvent('slotchange', this.shadowRoot?.querySelector('slot'), () => {
      if (this.dismissible && !isChanging && this.lastElementChild?.nodeName !== 'IDS-ICON') {
        isChanging = true;
        this.#removeIcon('close');
        this.#appendIcon('close');
        isChanging = false;
      }
    });
    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #attachKeyboardListeners(): object {
    if (this.dismissible) {
      this.listen(['Delete', 'Backspace'], this, () => {
        this.dismiss();
      });
    }

    if (this.clickable) {
      this.listen('Enter', this, () => {
        this.click();
      });
    }

    return this;
  }

  /**
   * Remove the tag from the page
   */
  dismiss() {
    if (!this.dismissible) {
      return;
    }

    let canDismiss = true;
    const response = (veto: any) => {
      canDismiss = !!veto;
    };
    this.triggerEvent('beforetagremove', this, { bubbles: true, detail: { elem: this, response } });

    if (!canDismiss) {
      return;
    }

    this.triggerEvent('tagremove', this, { bubbles: true, detail: { elem: this } });
    this.remove();
    this.triggerEvent('aftertagremove', this, { detail: { elem: this } });
  }
}

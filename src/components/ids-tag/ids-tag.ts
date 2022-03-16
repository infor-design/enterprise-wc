import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

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
    super.connectedCallback?.();
    this
      .#attachEventHandlers()
      .#attachKeyboardListeners();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [
      attributes.COLOR,
      attributes.CLICKABLE,
      attributes.DISMISSIBLE,
      attributes.MODE,
      attributes.VERSION
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
      this.setAttribute('color', value);
      if (value.substring(0, 1) === '#') {
        this.container.style.backgroundColor = value;
        this.container.style.borderColor = value;
        return;
      }

      this.container.classList.add(value);
      return;
    }

    this.removeAttribute('color');
    this.container.style.backgroundColor = '';
    this.container.style.borderColor = '';
    this.container.style.color = '';
  }

  get color() { return this.getAttribute('color'); }

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
    if (value) {
      this.setAttribute('dismissible', value.toString());
      this.container.classList.add('focusable');
      this.container.setAttribute('tabindex', '0');
      this.#appendIcon('close');
      this.#attachKeyboardListeners();
      return;
    }

    this.removeAttribute('dismissible');
    this.#removeIcon('close');
    this.container.removeAttribute('tabindex');
    this.container.classList.remove('focusable');
  }

  get dismissible() { return this.getAttribute('dismissible'); }

  /**
   * If set to true the tag has focus state and becomes a clickable linnk
   * @param {boolean|string} value true of false depending if the tag is clickable
   */
  set clickable(value: boolean) {
    if (value) {
      this.setAttribute('clickable', value.toString());
      this.container.classList.add('focusable');
      this.container.setAttribute('tabindex', '0');
      this.#attachKeyboardListeners();
      return;
    }

    this.removeAttribute('clickable');
    this.container.removeAttribute('tabindex');
    this.container.classList.remove('focusable');
  }

  get clickable() { return this.getAttribute('clickable'); }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #attachEventHandlers() {
    // Handle Clicking the x for dismissible
    const closeIcon = this.querySelector('ids-icon[icon="close"]');
    if (closeIcon) {
      this.onEvent('click', closeIcon, () => this.dismiss());
    }

    // Ensure icon is always last
    let isChanging = false;
    this.onEvent('slotchange', this.shadowRoot.querySelector('slot'), () => {
      if (this.dismissible && !isChanging && this.lastElementChild.nodeName !== 'IDS-ICON') {
        isChanging = true;
        this.#removeIcon('close');
        this.#appendIcon('close');
        isChanging = false;
      }
    });

    this.offEvent('languagechange.container');
    this.onEvent('languagechange.container', getClosest(this, 'ids-container'), () => {
      this.setDirection();
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
    this.triggerEvent('beforetagremove', this, { detail: { elem: this, response } });

    if (!canDismiss) {
      return;
    }

    this.triggerEvent('tagremove', this, { detail: { elem: this } });
    this.remove();
    this.triggerEvent('aftertagremove', this, { detail: { elem: this } });
  }
}

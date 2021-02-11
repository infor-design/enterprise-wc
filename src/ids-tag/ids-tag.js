import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsExampleMixin } from '../ids-base/ids-example-mixin';
import { IdsExampleMixin2 } from '../ids-base/ids-example2-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';

// @ts-ignore
import styles from './ids-tag.scss';

/**
 * IDS Tag Component
 * @type {IdsTag}
 * @inherits IdsElement
 * @mixes IdsExampleMixin
 * @mixes IdsExampleMixin2
 * @part background-color - the tag background color
 * @part color - the text color
 */
@customElement('ids-tag')
@scss(styles)
class IdsTag extends mix(IdsElement).with(IdsExampleMixin, IdsExampleMixin2) {
  constructor() {
    super();
  }

  connectedCallback() {
    this.example1();

    this
      .handleEvents()
      .handleKeys();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return ['color', 'clickable', 'dismissible'];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return '<span class="ids-tag"><slot></slot></span>';
  }

  /**
   * Set the color of the tag
   * @param {string} value The color value, this can be not provided,
   * secondary (white), error, success, danger, caution or a hex code with the #
   */
  set color(value) {
    if (value) {
      this.setAttribute('color', value);
      const prop = value.substr(0, 1) === '#' ? value : `var(--ids-color-status-${value === 'error' ? 'danger' : value})`;
      this.container.style.backgroundColor = prop;
      this.container.style.borderColor = value === 'secondary' ? '' : prop;

      if (value === 'error' || value === 'danger') {
        this.container.classList.add('ids-white');
      }

      if (value === 'secondary') {
        this.container.classList.add('ids-secondary');
      }
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
  appendIcon(iconName) {
    const icon = this.querySelector(`[icon="${iconName}"]`);
    if (!icon) {
      this.insertAdjacentHTML('beforeend', `<ids-icon icon="${iconName}" size="small" class="ids-icon"></ids-icon>`);
      this.handleEvents();
    }
  }

  /**
   * Check if an icon exists if not add it
   * @param {string} iconName The icon name to check
   * @private
   */
  removeIcon(iconName) {
    const icon = this.querySelector(`[icon="${iconName}"]`);
    if (icon) {
      icon.remove();
    }
  }

  /**
   * If set to true the tag has an x to dismiss
   * @param {boolean|string} value true of false depending if the tag is dismissed
   */
  set dismissible(value) {
    if (value) {
      this.setAttribute('dismissible', value.toString());
      this.container.classList.add('ids-focusable');
      this.container.setAttribute('tabindex', '0');
      this.appendIcon('close');
      this.handleKeys();
      return;
    }

    this.removeAttribute('dismissible');
    this.removeIcon('close');
    this.container.removeAttribute('tabindex');
    this.container.classList.remove('ids-focusable');
  }

  get dismissible() { return this.getAttribute('dismissible'); }

  /**
   * If set to true the tag has focus state and becomes a clickable linnk
   * @param {boolean|string} value true of false depending if the tag is clickable
   */
  set clickable(value) {
    if (value) {
      this.setAttribute('clickable', value.toString());
      this.container.classList.add('ids-focusable');
      this.container.setAttribute('tabindex', '0');
      this.handleKeys();
      return;
    }

    this.removeAttribute('clickable');
    this.container.removeAttribute('tabindex');
    this.container.classList.remove('ids-focusable');
  }

  get clickable() { return this.getAttribute('clickable'); }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  handleEvents() {
    this.eventHandlers = new IdsEventsMixin();

    // Handle Clicking the x for dismissible
    /** @type {any} */
    const closeIcon = this.querySelector('ids-icon[icon="close"]');
    if (closeIcon) {
      this.eventHandlers.addEventListener('click', closeIcon, () => this.dismiss());
    }

    // Ensure icon is always last
    let isChanging = false;
    this.eventHandlers.addEventListener('slotchange', this.shadowRoot.querySelector('slot'), () => {
      if (this.dismissible && !isChanging && this.lastElementChild.nodeName !== 'IDS-ICON') {
        isChanging = true;
        this.removeIcon('close');
        this.appendIcon('close');
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
  handleKeys() {
    if (this.dismissible || this.clickable) {
      this.keyboard = new IdsKeyboardMixin();
    }

    if (this.dismissible) {
      this.keyboard.listen(['Delete', 'Backspace'], this.container, () => {
        this.dismiss();
      });
    }

    if (this.clickable) {
      this.keyboard.listen('Enter', this.container, () => {
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
    const response = (/** @type {any} */ veto) => {
      canDismiss = !!veto;
    };
    this.eventHandlers.dispatchEvent('beforetagremoved', this.container, { detail: { elem: this, response } });

    if (!canDismiss) {
      return;
    }

    this.eventHandlers.dispatchEvent('tagremoved', this.container, { detail: { elem: this } });
    this.remove();
    this.eventHandlers.dispatchEvent('aftertagremoved', this.container, { detail: { elem: this } });
  }
}

export default IdsTag;

import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsExampleMixin } from '../ids-base/ids-example-mixin';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import styles from './ids-tag.scss';

/**
 * IDS Tag Component
 */
@customElement('ids-tag')
@scss(styles)
@mixin(IdsExampleMixin)
@mixin(IdsEventsMixin)
class IdsTag extends IdsElement {
  constructor() {
    super();
  }

  connectedCallBack() {
    this.handleEvents();
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
      this.root.style.backgroundColor = prop;
      this.root.style.borderColor = value === 'secondary' ? '' : prop;

      // TODO: Do this with css classes
      if (value === 'error' || value === 'success' || value === 'danger') {
        this.root.style.color = 'var(--ids-color-palette-white)';
      }

      if (value === 'secondary') {
        this.root.style.borderColor = 'var(--ids-color-palette-graphite-30)';
      }
      return;
    }

    this.removeAttribute('color');
    this.root.style.backgroundColor = '';
    this.root.style.borderColor = '';
    this.root.style.color = '';
  }

  get color() { return this.getAttribute('color'); }

  /**
   * Set if the tag may be dismissed
   * @param {boolean} value True of false depending if the tag may be dismissed
   */
  set dismissible(value) {
    const hasProp = this.hasAttribute('dismissible');

    if (value) {
      this.setAttribute('dismissible', value);
      this.root.classList.add('ids-dismissible');
      this.appendIcon('close');
      return;
    }

    this.removeAttribute('dismissible');
    this.removeIcon('close');
    this.root.classList.remove('ids-dismissible');
  }

  get dismissible() { return this.getAttribute('dismissible'); }

  /**
   * Check if an icon exists if not add it
   * @param {string} iconName The icon name to check
   * @private
   */
  appendIcon(iconName) {
    if (this.root.querySelectorAll(`[icon="${iconName}"]`).length === 0) {
      this.root.insertAdjacentHTML('beforeend', `<ids-icon icon="${iconName}" size="small" class="ids-icon"></ids-icon>`);
      this.handleEvents();
    }
  }

  /**
   * Check if an icon exists if not add it
   * @param {string} iconName The icon name to check
   * @private
   */
  removeIcon(iconName) {
    if (this.querySelectorAll(`[icon="${iconName}"]`).length > 0) {
      this.root.querySelector(`[icon="${iconName}"]`).remove();
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  handleEvents() {
    const closeIcon = this.root.querySelector('ids-icon[icon="close"]');
    if (closeIcon) {
      this.eventHandlers.addEventListener('click', closeIcon, () => this.dismiss());
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
    const response = (veto) => {
      canDismiss = !!veto;
    };
    this.eventHandlers.dispatchEvent('beforetagremoved', this, { elem: this, response });

    if (!canDismiss) {
      return;
    }

    this.eventHandlers.dispatchEvent('tagremoved', this, { elem: this });
    this.remove();
    this.eventHandlers.dispatchEvent('aftertagremoved', this, { elem: this });
  }
}

export default IdsTag;

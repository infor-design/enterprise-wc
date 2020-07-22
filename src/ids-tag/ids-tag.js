import { IdsElement, customElement, mixin } from '../ids-base/ids-element';
import { IdsExampleMixin } from '../ids-base/ids-example-mixin';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import './ids-tag.scss';

/**
 * IDS Tag Component
 */
@customElement('ids-tag')
@mixin(IdsExampleMixin)
@mixin(IdsEventsMixin)
class IdsTag extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  connectedCallBack() {
    this
      .render()
      .handleEvents();
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
    return '<span class="ids-tag-text"><slot></slot></span>';
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
      this.style.backgroundColor = prop;
      this.style.borderColor = value === 'secondary' ? '' : prop;

      // TODO: Do this with css classes
      if (value === 'error' || value === 'success' || value === 'danger') {
        this.style.color = 'var(--ids-color-palette-white)';
      }

      if (value === 'secondary') {
        this.style.borderColor = 'var(--ids-color-palette-graphite-30)';
      }
      return;
    }

    this.removeAttribute('color');
    this.style.backgroundColor = '';
    this.style.borderColor = '';
    this.style.color = '';
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
      this.classList.add('ids-dismissible');
      this.appendIcon('close');
      return;
    }

    this.removeAttribute('dismissible');
    this.removeIcon('close');
    this.classList.remove('ids-dismissible');
  }

  get dismissible() { return this.getAttribute('dismissible'); }

  /**
   * Check if an icon exists if not add it
   * @param {string} iconName The icon name to check
   * @private
   */
  appendIcon(iconName) {
    if (this.querySelectorAll(`[icon="${iconName}"]`).length === 0) {
      this.insertAdjacentHTML('beforeend', `<ids-icon icon="${iconName}" compactness="condensed" class="ids-icon"></ids-icon>`);
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
      this.querySelector(`[icon="${iconName}"]`).remove();
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  handleEvents() {
    const closeIcon = this.querySelector('ids-icon[icon="close"]');
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

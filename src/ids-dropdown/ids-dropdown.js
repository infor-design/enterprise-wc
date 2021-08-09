import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../ids-mixins';

import '../ids-trigger-field/ids-trigger-field';
import '../ids-trigger-field/ids-trigger-button';
import '../ids-popup/ids-popup';

import styles from './ids-dropdown.scss';

/**
 * IDS Dropdown Component
 * @type {IdsDropdown}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @part dropdown - the tag element
 */
@customElement('ids-dropdown')
@scss(styles)
class IdsDropdown extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    this
      .#handleEvents()
      .#handleKeys();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.LABEL,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
    <ids-trigger-field>
      <ids-input label="${this.label}" size="md"></ids-input>
      <ids-trigger-button tabbable="false">
        <ids-text audible="true">Dropdown Button</ids-text>
        <ids-icon slot="icon" icon="dropdown"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>
    `;
  }

  /**
   * If set to true the tag has an x to dismiss
   * @param {boolean|string} value true of false depending if the tag is dismissed
   */
  set label(value) {
    if (value) {
      this.setAttribute('label', value);
      this.shadowRoot.querySelector('ids-input').setAttribute('label', value);
    }
  }

  get label() { return this.getAttribute('label'); }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #handleEvents() {
    // Handle Clicking the x for dismissible
    const closeIcon = this.querySelector('ids-icon[icon="close"]');
    if (closeIcon) {
      this.onEvent('click', closeIcon, () => this.dismiss());
    }

    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #handleKeys() {
    this.listen(['Delete', 'Backspace'], this, () => {
      this.dismiss();
    });
    return this;
  }
}

export default IdsDropdown;

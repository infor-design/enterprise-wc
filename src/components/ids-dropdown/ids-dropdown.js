import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsPopupOpenEventsMixin,
  IdsThemeMixin,
  IdsLocaleMixin
} from '../../mixins';

import '../ids-trigger-field/ids-trigger-field';
import '../ids-trigger-field/ids-trigger-button';
import '../ids-popup/ids-popup';
import '../ids-list-box/ids-list-box';

import styles from './ids-dropdown.scss';

/**
 * IDS Dropdown Component
 * @type {IdsDropdown}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsPopupOpenEventsMixin
 * @part dropdown - the tag element
 */
@customElement('ids-dropdown')
@scss(styles)
class IdsDropdown extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsPopupOpenEventsMixin,
    IdsThemeMixin,
    IdsLocaleMixin
  ) {
  constructor() {
    super();
    this.state = { selectedIndex: 0 };
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();

    this.popup = this.shadowRoot.querySelector('ids-popup');
    this.fieldContainer = this.container.querySelector('ids-input').shadowRoot.querySelector('.field-container');
    this.trigger = this.container.querySelector('ids-trigger-button');
    this.input = this.shadowRoot.querySelector('ids-input').shadowRoot.querySelector('input');

    this
      .#handleEvents()
      .#handleKeys()
      .#addAria();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.LABEL,
      attributes.LANGUAGE,
      attributes.MODE,
      attributes.VALUE,
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
      <ids-input label="${this.label}" size="md" cursor="pointer" readonly bg-transparent="true" user-select="none"></ids-input>
      <ids-trigger-button tabbable="false">
        <ids-text audible="true">Dropdown Button</ids-text>
        <ids-icon slot="icon" icon="dropdown"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>
    <ids-popup type="menu">
      <slot slot="content">
      </slot>
    </ids-popup>
    `;
  }

  /**
   * Add internal aria attributes
   * @private
   * @returns {object} This API object for chaining
   */
  #addAria() {
    const attrs = {
      role: 'combobox',
      'aria-expanded': 'false',
      'aria-autocomplete': 'list',
      'aria-haspopup': 'listbox',
      'aria-description': this.locale.translate('PressDown'),
      'aria-controls': 'ids-list-box-id'
    };

    this.querySelector('ids-list-box').setAttribute('id', 'ids-list-box-id');
    Object.keys(attrs).forEach((key) => this.input.setAttribute(key, attrs[key]));
    return this;
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
   * Set the value of the dropdown using the value/id attribute if present
   * @param {boolean|string} value The value/id to use
   */
  set value(value) {
    const elem = this.selectedOption;
    this.#clearSelected();
    this.#selectOption(elem);
    this.shadowRoot.querySelector('ids-input').value = elem?.textContent || '';
    this.state.selectedIndex = [...elem.parentElement.children].indexOf(elem);
    this.setAttribute('value', value);
  }

  get value() { return this.getAttribute('value'); }

  /**
   * Return the selected option dom element
   * @returns {HTMLElement} the selected option
   */
  get selectedOption() {
    return this.querySelector(`ids-list-box-option[value="${this.value}"]`);
  }

  /**
   * Set the selected option by index
   * @param {number} value the index to use
   */
  set selectedIndex(value) {
    if (Number.isInteger(value)) {
      const elem = this.options[value] ? this.options[value] : this.options[0];
      this.value = elem.getAttribute('id');
      this.state.selectedIndex = value;
    }
  }

  get selectedIndex() { return this.state.selectedIndex; }

  /**
   * Return the currently available options
   * @returns {Array} the array of options
   */
  get options() {
    return this.querySelectorAll('ids-list-box-option');
  }

  /**
   * Set the aria and state on the element
   * @param {HTMLElement} option the option to select
   */
   #selectOption(option) {
    option.setAttribute('aria-selected', 'true');
    option.classList.add('is-selected');
  }

  /**
   * Remove the aria and state from the currently selected element
   */
  #clearSelected() {
     const option = this.querySelector('ids-list-box-option[aria-selected]');
     if (option) {
       option.removeAttribute('aria-selected');
       option.classList.remove('is-selected');
     }
   }

  /**
   * Open the dropdown list
   */
  open() {
    // Open the popup and add a class
    this.popup.alignTarget = this.container.querySelector('ids-input').shadowRoot.querySelector('.field-container');
    this.popup.align = 'bottom, left';
    this.popup.arrow = 'none';
    this.popup.y = -5;
    this.popup.visible = true;
    this.popup.type = 'dropdown';
    this.addOpenEvents();
    this.input.classList.add('is-active');
    this.input.setAttribute('aria-expanded', 'false');

    // Add aria for the open state
    this.setAttribute('aria-activedescendant', this.selectedOption.id || this.selectedIndex);
  }

  /**
   * Inherited from the Popup Open Events Mixin.
   * Runs when a click event is propagated to the window.
   * @returns {void}
   */
  onOutsideClick() {
    this.close();
  }

  /**
   * Close the dropdown popup
   */
  close() {
    this.popup.visible = false;
    this.input.classList.remove('is-active');
    this.input.setAttribute('aria-expanded', 'false');
    const selected = this.querySelector('ids-list-box-option.is-selected');
    selected.classList.remove('is-selected');
    this.selectedOption.classList.add('is-selected');
    this.removeOpenEvents();
  }

  /**
   * Toggle dropdown list state
   * @private
   */
  toggle() {
    if (!this.popup.visible) {
      this.open();
    } else {
      this.close();
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #handleEvents() {
    // Handle Clicking the x for dismissible
    this.onEvent('mouseup', this.fieldContainer, () => {
      this.toggle();
    });

    this.onEvent('mouseup', this.trigger, () => {
      this.toggle();
    });

    // Handle Clicking with the mouse on options
    this.onEvent('click', this, (e) => {
      if (e.target.nodeName === 'IDS-LIST-BOX-OPTION') {
        this.value = e.target.getAttribute('id');
      }
    });

    // Respond to parent changing language
    this.onEvent('languagechange.container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
      this.input.setAttribute('aria-description', this.locale.translate('PressDown'));
    });

    // Respond to the element changing language
    this.onEvent('languagechange.this', this, async (e) => {
      await this.locale.setLanguage(e.detail.language.name);
      this.input.setAttribute('aria-description', this.locale.translate('PressDown'));
    });

    // Disable text selection on tab (extra info in the screen reader)
    this.onEvent('focus', this.shadowRoot.querySelector('ids-input'), () => {
      window.getSelection().removeAllRanges();
    });

    // Send the change event up
    this.onEvent('change', this.input, (e) => {
      this.triggerEvent(e.type, this, {
        detail: {
          elem: this,
          nativeEvent: e,
          value: this.value
        }
      });
    });
    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #handleKeys() {
    // Handle up and down arrow
    this.listen(['ArrowDown', 'ArrowUp'], this, (e) => {
      if (!this.popup.visible) {
        this.open();
        return;
      }

      const selected = this.querySelector('ids-list-box-option.is-selected');
      if (e.key === 'ArrowUp' && e.altKey) {
        this.value = selected.getAttribute('id');
        this.close();
        return;
      }

      if (e.key === 'ArrowDown' && selected.nextElementSibling) {
        selected.classList.remove('is-selected');
        selected.nextElementSibling.classList.add('is-selected');
      }
      if (e.key === 'ArrowUp' && selected.previousElementSibling) {
        selected.classList.remove('is-selected');
        selected.previousElementSibling.classList.add('is-selected');
      }
    });

    // Close on escape
    this.listen(['Escape'], this, () => {
      this.close();
    });

    // Select or Open on space/enter
    this.listen([' ', 'Enter'], this, () => {
      if (!this.popup.visible) {
        this.open();
        return;
      }

      const selected = this.querySelector('ids-list-box-option.is-selected');
      this.value = selected.getAttribute('id');
      this.close();
    });
    return this;
  }
}

export default IdsDropdown;

import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

// Import Mixins
import {
  IdsDirtyTrackerMixin,
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsPopupOpenEventsMixin,
  IdsThemeMixin,
  IdsValidationMixin,
  IdsLocaleMixin
} from '../../mixins';

// Import Utils
import { IdsStringUtils as stringUtils } from '../../utils';

// Supporting components
import { IdsTriggerButton, IdsTriggerField } from '../ids-trigger-field';
import IdsInput from '../ids-input';
import IdsPopup from '../ids-popup';
import IdsListBox from '../ids-list-box';
import IdsText from '../ids-text';
import IdsIcon from '../ids-icon';

// Import Styles
import styles from './ids-dropdown.scss';

/**
 * IDS Dropdown Component
 * @type {IdsDropdown}
 * @inherits IdsElement
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsValidationMixin
 * @part dropdown - the tag element
 */
@customElement('ids-dropdown')
@scss(styles)
class IdsDropdown extends mix(IdsElement).with(
    IdsDirtyTrackerMixin,
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsPopupOpenEventsMixin,
    IdsThemeMixin,
    IdsLocaleMixin,
    IdsValidationMixin
  ) {
  constructor() {
    super();
    this.state = { selectedIndex: 0 };
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    // Empty Dropdown
    if (!this.container.querySelector) {
      this.container = document.createElement('ids-trigger-field');
    }
    this.popup = this.shadowRoot.querySelector('ids-popup');
    this.inputRoot = this.shadowRoot.querySelector('ids-input');
    this.fieldContainer = this.container.querySelector('ids-input')?.shadowRoot.querySelector('.field-container');
    this.trigger = this.shadowRoot.querySelector('ids-trigger-button');
    this.input = this.inputRoot?.shadowRoot?.querySelector('input');
    this.triggerContent = this.container.shadowRoot.querySelector('.ids-trigger-field-content');
    this.triggerField = this.container.shadowRoot.querySelector('.ids-trigger-field');
    this.listBox = this.querySelector('ids-list-box');
    this.labelEl = this.inputRoot?.shadowRoot.querySelector('label');

    this
      .#addAria()
      .#attachEventHandlers()
      .#attachKeyboardListeners();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...attributes.DISABLED,
      attributes.LABEL,
      attributes.LANGUAGE,
      attributes.MODE,
      attributes.READONLY,
      attributes.VALUE,
      attributes.VERSION
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    this.hasIcons = this.querySelector('ids-list-box-option ids-icon');

    return `
    <ids-trigger-field
      label="${this.label}"
      ${this.disabled ? ' disabled="true"' : ''}
      ${this.readonly ? ' readonly="true"' : ''}
      ${this.validate ? ` validate="${this.validate}"` : ''}
      ${this.validationEvents ? ` validation-events="${this.validationEvents}"` : ''}>
      ${this.hasIcons ? '<span class="icon-container"><ids-icon icon="user-profile"></ids-icon></span>' : ''}
      <ids-input
        part="container"
        disabled="${this.disabled}"
        readonly="true"
        label-hidden="true" ${!this.disabled && !this.readonly ? 'cursor="pointer"' : ''}
        ${this.readonly ? 'cursor="text"' : ''}
        readonly bg-transparent="${!this.readonly && !this.disabled}"
        user-select="none" triggerfield="true"></ids-input>
      <ids-trigger-button part="trigger-button" tabbable="false" disabled="${this.disabled}"
      readonly="${this.readonly}">
        <ids-text audible="true">Dropdown Button</ids-text>
        <ids-icon slot="icon" icon="dropdown" part="icon"></ids-icon>
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
      'aria-description': this.locale?.translate('PressDown'),
      'aria-controls': this.listBox?.getAttribute('id') || 'ids-list-box-id'
    };
    this.listBox?.setAttribute('id', 'ids-list-box-id');
    Object.keys(attrs).forEach((key) => this.setAttribute(key, attrs[key]));
    return this;
  }

  /**
   * If set to true the tag has an x to dismiss
   * @param {boolean|string} value true of false depending if the tag is dismissed
   */
  set label(value) {
    this.setAttribute('label', value);
    this.shadowRoot.querySelector('ids-input').setAttribute('label', value);
  }

  get label() { return this.getAttribute('label'); }

  /**
   * Set the value of the dropdown using the value/id attribute if present
   * @param {boolean|string} value The value/id to use
   */
  set value(value) {
    const elem = this.selectedOption;
    if (!elem) {
      return;
    }
    this.#clearSelected();
    this.#selectOption(elem);
    this.#selectIcon(elem);
    this.shadowRoot.querySelector('ids-input').value = elem.textContent.trim();
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
   * Sets the readonly attribute
   * @param {string|boolean} value string value from the readonly attribute
   */
  set readonly(value) {
    const isReadonly = stringUtils.stringToBool(value);
    if (isReadonly) {
      if (this.input) {
        this.removeAttribute('disabled');
        this.inputRoot.readonly = true;
        this.inputRoot.disabled = false;
        this.inputRoot.cursor = 'text';
        this.inputRoot.bgTransparent = false;
        this.trigger.readonly = true;
        this.trigger.disabled = false;
      }
      this.setAttribute('readonly', 'true');
      return;
    }

    if (this.input) {
      this.inputRoot.readonly = false;
      this.inputRoot.disabled = false;
      this.inputRoot.cursor = 'pointer';
      this.inputRoot.bgTransparent = true;
      this.trigger.readonly = false;
      this.trigger.disabled = false;
    }
    this.removeAttribute('readonly');
  }

  get readonly() {
    return stringUtils.stringToBool(this.getAttribute('readonly')) || false;
  }

  /**
   * Sets the disabled attribute
   * @param {string|boolean} value string value from the disabled attribute
   */
  set disabled(value) {
    const isDisabled = stringUtils.stringToBool(value);
    if (isDisabled) {
      if (this.inputRoot) {
        this.removeAttribute('readonly');
        this.inputRoot.disabled = true;
        this.inputRoot.readonly = false;
        this.inputRoot.cursor = 'initial';
        this.inputRoot.bgTransparent = true;
        this.trigger.disabled = true;
        this.trigger.readonly = false;
      }
      this.setAttribute('disabled', 'true');
      return;
    }

    if (this.input) {
      this.inputRoot.disabled = false;
      this.inputRoot.readonly = false;
      this.inputRoot.cursor = 'pointer';
      this.inputRoot.bgTransparent = false;
      this.trigger.disabled = false;
      this.trigger.readonly = false;
    }
    this.removeAttribute('disabled');
  }

  get disabled() {
    return stringUtils.stringToBool(this.getAttribute('disabled')) || false;
  }

  /**
   * Set the aria and state on the element
   * @private
   * @param {HTMLElement} option the option to select
   */
   #selectOption(option) {
    option?.setAttribute('aria-selected', 'true');
    option?.classList.add('is-selected');
  }

  /**
   * Set the icon to be visible (if used)
   * @private
   * @param {HTMLElement} option the option to select
   */
  #selectIcon(option) {
     if (!this.hasIcons) {
       return;
     }
     const icon = option.querySelector('ids-icon');
     if (!icon) {
       return;
     }
     this.shadowRoot.querySelector('.icon-container ids-icon').setAttribute('icon', icon.getAttribute('icon'));
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
    if (this.disabled || this.readonly) {
      return;
    }

    // Open the popup and add a class
    this.popup.alignTarget = this.triggerContent;
    this.popup.align = 'bottom, left';
    this.popup.arrow = 'none';
    this.popup.y = -1;
    this.popup.visible = true;
    this.popup.type = 'dropdown';
    this.addOpenEvents();
    this.triggerField.classList.add('is-active');
    this.input.setAttribute('aria-expanded', 'true');

    // Add aria for the open state
    this.listBox?.setAttribute('aria-activedescendant', this.selectedOption?.id || this.selectedIndex);
    const selected = this.listBox?.querySelector('.is-selected');
    if (selected) {
      selected.setAttribute('tabindex', 0);
      selected.focus();
    }
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
   * @param {boolean} noFocus if true do not focus on close
   */
  close(noFocus) {
    this.popup.visible = false;
    this.triggerField.classList.remove('is-active');
    this.input.setAttribute('aria-expanded', 'false');
    const selected = this.querySelector('ids-list-box-option.is-selected');

    if (selected) {
      selected.classList.remove('is-selected');
      this.selectedOption.classList.add('is-selected');
    }

    this.removeOpenEvents();

    if (!noFocus) {
      this.input.focus();
    }
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
  #attachEventHandlers() {
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
        return;
      }

      if (e.target.closest('ids-list-box-option')) {
        this.value = e.target.closest('ids-list-box-option').getAttribute('id');
      }
    });

    // Respond to parent changing language
    this.onEvent('languagechange.container', this.closest('ids-container'), async (e) => {
      if (!this.setLanguage) {
        return;
      }
      await this.setLanguage(e.detail.language.name);
      this.setAttribute('aria-description', this.locale.translate('PressDown'));
    });

    // Respond to the element changing language
    this.onEvent('languagechange.this', this, async (e) => {
      await this.locale.setLanguage(e.detail.language.name);
      this.setAttribute('aria-description', this.locale.translate('PressDown'));
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
  #attachKeyboardListeners() {
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

      if (e.key === 'ArrowDown' && selected?.nextElementSibling) {
        selected.classList.remove('is-selected');
        selected.setAttribute('tabindex', '-1');
        selected.nextElementSibling.classList.add('is-selected');
        selected.nextElementSibling.setAttribute('tabindex', '0');
        selected.nextElementSibling.focus();
      }
      if (e.key === 'ArrowUp' && selected?.previousElementSibling) {
        selected.classList.remove('is-selected');
        selected.setAttribute('tabindex', '-1');
        selected.previousElementSibling.classList.add('is-selected');
        selected.previousElementSibling.focus();
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

    // Move to Next on Tab
    this.listen(['Tab'], this, (e) => {
      if (!this.popup.visible) {
        return;
      }

      if (e.shiftKey) {
        this.input.focus();
      }

      const selected = this.querySelector('ids-list-box-option.is-selected');
      this.value = selected.getAttribute('id');
      this.close(true);
    });
    return this;
  }

  /**
   * Set the dirty tracking feature on to indicate a changed dropdown
   * @param {boolean|string} value If true will set `dirty-tracker` attribute
   */
  set dirtyTracker(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DIRTY_TRACKER, val.toString());
    } else {
      this.removeAttribute(attributes.DIRTY_TRACKER);
    }

    this.handleDirtyTracker();
  }

  get dirtyTracker() { return this.getAttribute(attributes.DIRTY_TRACKER); }

  /**
   * Sets the validation check to use
   * @param {string} value The `validate` attribute
   */
  set validate(value) {
    if (value) {
      this.setAttribute(attributes.VALIDATE, value.toString());
      this.container.setAttribute(attributes.VALIDATE, value.toString());
    } else {
      this.removeAttribute(attributes.VALIDATE);
      this.container.removeAttribute(attributes.VALIDATE);
    }
    this.handleValidation();
  }

  get validate() { return this.getAttribute(attributes.VALIDATE); }

  /**
   * Set `validation-events` attribute
   * @param {string} value The `validation-events` attribute
   */
  set validationEvents(value) {
    if (value) {
      this.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
      this.container.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      this.container.removeAttribute(attributes.VALIDATION_EVENTS);
    }
    this.handleValidation();
  }

  get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS) || 'change'; }
}

export default IdsDropdown;

import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-dropdown-base';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import IdsInput from '../ids-input/ids-input';
import IdsPopup from '../ids-popup/ids-popup';
import IdsListBox from '../ids-list-box/ids-list-box';
import IdsText from '../ids-text/ids-text';
import IdsIcon from '../ids-icon/ids-icon';

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
 * @mixes IdsTooltipMixin
 * @part dropdown - the tag element
 */
@customElement('ids-dropdown')
@scss(styles)
export default class IdsDropdown extends Base {
  constructor() {
    super();
    this.state = { selectedIndex: 0 };
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    if (!this.container?.querySelector) {
      // Empty Dropdown
      this.container = document.createElement('ids-trigger-field');
    }
    this.popup = this.shadowRoot?.querySelector('ids-popup');
    this.inputRoot = this.shadowRoot?.querySelector('ids-input');
    this.fieldContainer = this.container?.querySelector('ids-input')?.shadowRoot?.querySelector('.field-container');
    this.trigger = this.shadowRoot?.querySelector('ids-trigger-button');
    this.input = this.inputRoot?.shadowRoot?.querySelector('input');
    this.triggerContent = this.container?.shadowRoot?.querySelector('.ids-trigger-field-content');
    this.triggerField = this.container?.shadowRoot?.querySelector('.ids-trigger-field');
    this.listBox = this.querySelector('ids-list-box');
    this.labelEl = this.inputRoot?.shadowRoot?.querySelector('label');

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
    this.hasIcons = this.querySelector('ids-list-box-option ids-icon') !== null;
    this.size = this.getAttribute(attributes.SIZE) || 'md';

    return `
    <ids-trigger-field
      no-margins
      size="${this.size}"
      label="${this.label}"
      part="trigger-field"
      ${this.disabled ? ' disabled="true"' : ''}
      ${this.readonly ? ' readonly="true"' : ''}
      ${this.validate ? ` validate="${this.validate}"` : ''}
      ${this.validate && this.validationEvents ? ` validation-events="${this.validationEvents}"` : ''}>
      ${this.hasIcons ? '<span class="icon-container"><ids-icon icon="user-profile"></ids-icon></span>' : ''}
      <ids-input
        size="${this.size}"
        part="input"
        disabled="${this.disabled}"
        label-hidden="true" ${!this.disabled && !this.readonly ? 'cursor="pointer"' : ''}
        readonly
        ${this.readonly ? 'cursor="text"' : ''}
        bg-transparent="${!this.readonly && !this.disabled}"
        user-select="none" triggerfield="true"></ids-input>
      <ids-trigger-button
        part="trigger-button"
        tabbable="false"
        disabled="${this.disabled}"
        readonly="${this.readonly}"
      >
        <ids-text audible="true">Dropdown Button</ids-text>
        <ids-icon slot="icon" icon="dropdown" part="icon"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>
    <ids-popup type="menu" part="popup">
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
      'aria-controls': this.listBox?.getAttribute('id') || `ids-list-box-${this.id}`
    };

    this.listBox?.setAttribute('id', `ids-list-box-${this.id}`);
    Object.keys(attrs).forEach((key) => this.setAttribute(key, attrs[key]));
    return this;
  }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
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
    this.#selectTooltip(elem);
    this.shadowRoot.querySelector('ids-input').value = elem.textContent.trim();
    this.state.selectedIndex = [...elem.parentElement.children].indexOf(elem);

    // Send the change event
    if (this.value === value) {
      this.triggerEvent('change', this, {
        bubbles: true,
        detail: {
          elem: this,
          value: this.value
        }
      });
    }
    this.setAttribute('value', value);
  }

  get value() { return this.getAttribute('value'); }

  /**
   * Returns the selected option DOM element
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
    if (Number.isInteger(value) && this.options[value]) {
      const elem = this.options[value];
      this.value = elem.getAttribute('value');
      this.state.selectedIndex = value;
    }
  }

  get selectedIndex() { return this.state.selectedIndex; }

  /**
   * Returns the currently available options
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
    const isReadonly = stringToBool(value);
    if (isReadonly) {
      if (this.input) {
        this.removeAttribute('disabled');
        this.container.readonly = true;
        this.container.disabled = false;
        this.inputRoot.cursor = 'text';
        this.inputRoot.bgTransparent = false;
      }
      this.setAttribute('readonly', 'true');
      return;
    }

    if (this.input) {
      this.container.readonly = false;
      this.container.disabled = false;
      this.inputRoot.cursor = 'pointer';
      this.inputRoot.bgTransparent = true;
    }
    this.removeAttribute('readonly');
  }

  get readonly() {
    return stringToBool(this.getAttribute('readonly')) || false;
  }

  /**
   * Sets the disabled attribute
   * @param {string|boolean} value string value from the disabled attribute
   */
  set disabled(value) {
    const isDisabled = stringToBool(value);
    if (isDisabled) {
      if (this.inputRoot) {
        this.removeAttribute('readonly');
        this.container.disabled = true;
        this.container.readonly = false;
        this.inputRoot.cursor = 'initial';
        this.inputRoot.bgTransparent = false;
      }
      this.setAttribute('disabled', 'true');
      return;
    }

    if (this.input) {
      this.container.disabled = false;
      this.inputRoot.cursor = 'pointer';
      this.inputRoot.bgTransparent = true;
    }
    this.removeAttribute('disabled');
  }

  get disabled() {
    return stringToBool(this.getAttribute('disabled')) || false;
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
    this.shadowRoot.querySelector('.icon-container ids-icon').setAttribute('icon', icon.getAttribute('icon'));
  }

  /**
   * Set the tooltip to be visible for the selected option
   * @private
   * @param {HTMLElement} option the option to select
   */
  #selectTooltip(option) {
    const tooltip = option.getAttribute('tooltip');
    if (tooltip) {
      this.tooltip = tooltip;
    }
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
  async open() {
    if (this.disabled || this.readonly) {
      return;
    }

    // Trigger an async callback for contents
    if (this.state.beforeShow) {
      const stuff = await this.state.beforeShow();
      this.#loadDataSet(stuff);
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
   * Populate the DOM with the dataset
   * @param {Function} dataset The dataset to use with value, label ect...
   * @private
   */
  #loadDataSet(dataset) {
    let html = '';
    const listbox = this.querySelector('ids-list-box');
    listbox.innerHTML = '';
    dataset.forEach((option) => {
      html += `<ids-list-box-option
        value="${option.value}">${option.label}
        </ids-list-box-option>`;
    });
    listbox.insertAdjacentHTML('afterbegin', html);
    this.value = this.getAttribute('value');
  }

  /**
   * An async function that fires as the dropdown is opening allowing you to set contents.
   * @param {Function} func The async function
   */
  set beforeShow(func) {
    this.state.beforeShow = func;
  }

  get beforeShow() { return this.state.beforeShow; }

  /**
   * Inherited from the Popup Open Events Mixin.
   * Runs when a click event is propagated to the window.
   * @private
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
   * Toggle the dropdown list open/closed state
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
    // Handle Clicking to open
    this.onEvent('mouseup', this.input, () => {
      this.toggle();
    });

    // Handle Key Typeahead
    this.onEvent('keydownend', this, (e) => {
      this.#typeAhead(e.detail.keys);
    });

    // Handle Clicking to open over the trigger part
    this.onEvent('mouseup', this.trigger, () => {
      this.toggle();
    });

    // Handle Clicking with the mouse on options
    this.onEvent('click', this, (e) => {
      if (e.target.nodeName === 'IDS-LIST-BOX-OPTION') {
        this.value = e.target.getAttribute('value');
        return;
      }

      if (e.target.closest('ids-list-box-option')) {
        this.value = e.target.closest('ids-list-box-option').getAttribute('value');
      }
    });

    // Disable text selection on tab (extra info in the screen reader)
    this.onEvent('focus', this.shadowRoot.querySelector('ids-input'), () => {
      window.getSelection().removeAllRanges();
    });

    // Handle the Locale Change
    this.offEvent('languagechange.data-grid-container');
    this.onEvent('languagechange.data-grid-container', this.closest('ids-container'), async () => {
      this.#addAria();
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
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      const selected = this.querySelector('ids-list-box-option.is-selected');
      if (e.key === 'ArrowUp' && e.altKey) {
        this.value = selected.getAttribute('value');
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
        selected.previousElementSibling.setAttribute('tabindex', '0');
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
      this.value = selected.getAttribute('value');
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
      this.value = selected.getAttribute('value');
      this.close(true);
    });
    return this;
  }

  /**
   * Open the list and move to the key pressed item
   * @param {string} keyString The last pressed key to use
   */
  #typeAhead(keyString) {
    if (this.readonly || this.disabled) {
      return;
    }

    const matches = [].slice.call(this.querySelectorAll('ids-list-box-option'))
      .filter((a) => a.textContent.toLowerCase().indexOf(keyString.toLowerCase()) === 0);

    if (matches[0]) {
      const selected = this.querySelector('ids-list-box-option.is-selected');
      selected?.classList.remove('is-selected');
      selected?.setAttribute('tabindex', '-1');
      matches[0].classList.add('is-selected');

      if (!this.popup.visible) {
        this.value = matches[0].getAttribute('value');
      } else {
        matches[0].focus();
      }
    }
  }

  /**
   * Set the dirty tracking feature on to indicate a changed dropdown
   * @param {boolean|string} value If true will set `dirty-tracker` attribute
   */
  set dirtyTracker(value) {
    const val = stringToBool(value);
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

import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-dropdown-base';
import '../ids-trigger-field/ids-trigger-field';
import '../ids-trigger-field/ids-trigger-button';
import '../ids-input/ids-input';
import '../ids-popup/ids-popup';
import '../ids-list-box/ids-list-box';
import '../ids-text/ids-text';
import '../ids-icon/ids-icon';

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
    this.popup = this.container.querySelector('ids-popup');
    this.trigger = this.container.querySelector('ids-trigger-button');
    this.listBox = this.querySelector('ids-list-box');
    this.labelEl = this.input?.querySelector('label');

    this
      .#addAria()
      .#attachEventHandlers()
      .#attachKeyboardListeners();

    super.connectedCallback();
    this.#configurePopup();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.LABEL,
      attributes.NO_MARGINS,
      attributes.READONLY,
      attributes.SIZE,
      attributes.VALUE
    ];
  }

  /**
   * List of available color variants for this component
   * @returns {Array<string>}
   */
  colorVariants: Array<string> = ['alternate-formatter'];

  /**
   * Push color variant to the container element
   * @returns {void}
   */
  onColorVariantRefresh(): void {
    this.input.colorVariant = this.colorVariant;
  }

  /**
   * Push label-state to the container element
   * @returns {void}
   */
  onlabelStateChange(): void {
    this.input.labelState = this.labelState;
  }

  /**
   * Push field-height/compact to the container element
   * @param {string} val the new field height setting
   */
  onFieldHeightChange(val: string) {
    if (val) {
      const attr = val === 'compact' ? { name: 'compact', val: '' } : { name: 'field-height', val };
      this.input.setAttribute(attr.name, attr.val);
    } else {
      this.input.removeAttribute('compact');
      this.input.removeAttribute('field-height');
    }
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    const colorVariant = this.colorVariant ? ` color-variant="${this.colorVariant}"` : '';
    const fieldHeight = this.fieldHeight ? ` field-height="${this.fieldHeight}"` : '';
    const labelState = this.labelState ? ` label-state="${this.labelState}"` : '';
    const compact = this.compact ? ' compact' : '';
    const noMargins = this.noMargins ? ' no-margins' : '';
    this.hasIcons = this.querySelector('ids-list-box-option ids-icon') !== null;

    return `
      <div class="ids-dropdown">
        <ids-trigger-field
        ${this.disabled ? ' disabled="true"' : ' readonly="true"'}
        ${this.readonly ? '' : ' readonly-background'}

        cursor="pointer"
        size="${this.size}"
        label="${this.label}"
        part="trigger-field"
        ${colorVariant}${fieldHeight}${compact}${noMargins}${labelState}

        ${this.validate ? ` validate="${this.validate}"` : ''}
        ${this.validate && this.validationEvents ? ` validation-events="${this.validationEvents}"` : ''}>
        <ids-trigger-button
          slot="trigger-end"
          part="trigger-button"
          tabbable="false"
          disabled="${this.disabled}"
        >
          <ids-text audible="true">Dropdown Button</ids-text>
          <ids-icon slot="icon" icon="dropdown" part="icon"></ids-icon>
        </ids-trigger-button>
      </ids-trigger-field>
      <ids-popup type="menu" part="popup">
        <slot slot="content">
        </slot>
      </ids-popup>
    </div>`;
  }

  /**
   * Add internal aria attributes
   * @private
   * @returns {object} This API object for chaining
   */
  #addAria() {
    const attrs: any = {
      role: 'combobox',
      'aria-expanded': 'false',
      'aria-autocomplete': 'list',
      'aria-haspopup': 'listbox',
      'aria-description': this.locale?.translate('PressDown'),
      'aria-controls': this.listBox?.getAttribute('id') || `ids-list-box-${this.id}`
    };

    if (this.listBox) {
      this.listBox.setAttribute('id', `ids-list-box-${this.id}`);
      this.listBox.setAttribute('aria-label', `Listbox`);
    }
    Object.keys(attrs).forEach((key: any) => this.setAttribute(key, attrs[key]));
    return this;
  }

  /**
   * Add internal aria attributes while open
   * @private
   * @returns {void}
   */
  #setAriaOnMenuOpen(): void {
    this.setAttribute('aria-expanded', 'true');

    // Add aria for the open state
    const selected = this.selectedOption;
    this.listBox?.setAttribute('tabindex', '0');
    this.listBox?.setAttribute('aria-activedescendant', selected?.id || this.selectedIndex);
    if (selected) {
      selected.setAttribute('tabindex', '0');
      selected.focus();
    }
  }

  /**
   * Add internal aria attributes while closed
   * @private
   * @returns {void}
   */
  #setAriaOnMenuClose() {
    this.setAttribute('aria-expanded', 'false');
    this.listBox?.removeAttribute('tabindex');

    const selected = this.selected;
    if (selected) {
      selected.classList.remove('is-selected');
      selected.setAttribute('tabindex', '-1');
      this.selectedOption?.classList.add('is-selected');
    }
  }

  get input() {
    return this.container.querySelector('ids-trigger-field');
  }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value: string) {
    this.setAttribute('label', value);
    this.input.setAttribute('label', value);
  }

  get label(): string { return this.getAttribute('label'); }

  /**
   * Set the value of the dropdown using the value/id attribute if present
   * @param {string} value The value/id to use
   */
  set value(value: string) {
    const elem = this.selectedOption;
    if (!elem) {
      return;
    }
    this.#clearSelected();
    this.#selectOption(elem);
    this.#selectIcon(elem);
    this.#selectTooltip(elem);
    this.input.value = (elem as any).textContent.trim();
    this.state.selectedIndex = [...(elem.parentElement as any).children].indexOf(elem);

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

  get value(): string { return this.getAttribute('value'); }

  /**
   * Returns the selected Listbox option based on the Dropdown's value.
   * @returns {HTMLElement| null} the selected option
   */
  get selectedOption(): HTMLElement | null {
    return this.querySelector(`ids-list-box-option[value="${this.value}"]`);
  }

  /**
   * Returns the currently-selected Listbox option
   * (may be different from the Dropdown's value because of user input)
   * @readonly
   * @returns {HTMLElement|null} Reference to a selected Listbox option if one is present
   */
  get selected(): HTMLElement | null {
    return this.querySelector('ids-list-box-option.is-selected');
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

    // NOTE: IdsTriggerField is ALWAYS `readonly` when used in IdsDropdown
    // @TODO: revisit this when we implement filtering
    if (!this.input.readonly) {
      this.container.readonly = true;
    }

    if (isReadonly) {
      this.removeAttribute(attributes.DISABLED);
      this.input.disabled = false;
      this.input.cursor = 'initial';
      this.input.readonlyBackground = false;
      this.setAttribute(attributes.READONLY, 'true');
      return;
    }
    this.input.disabled = false;
    this.input.cursor = 'pointer';
    this.input.readonlyBackground = true;
    this.removeAttribute(attributes.READONLY);
  }

  get readonly() {
    return stringToBool(this.getAttribute(attributes.READONLY)) || false;
  }

  /**
   * Sets the disabled attribute
   * @param {string|boolean} value string value from the disabled attribute
   */
  set disabled(value) {
    const isDisabled = stringToBool(value);
    if (isDisabled) {
      this.input.disabled = true;
      this.input.readonly = false;
      this.input.cursor = 'initial';
      this.input.bgTransparent = false;
      this.setAttribute(attributes.DISABLED, 'true');
      return;
    }
    if (!this.input.readonly) {
      this.input.readonly = true;
    }
    this.input.disabled = false;
    this.input.cursor = 'pointer';
    this.input.bgTransparent = true;
    this.removeAttribute(attributes.DISABLED);
  }

  get disabled() {
    return stringToBool(this.getAttribute(attributes.DISABLED)) || false;
  }

  /**
   * Set the aria and state on the element
   * @private
   * @param {HTMLElement} option the option to select
   */
  #selectOption(option: HTMLElement) {
    option?.setAttribute('aria-selected', 'true');
    option?.classList.add('is-selected');
  }

  /**
   * Set the icon to be visible (if used)
   * @private
   * @param {HTMLElement} option the option to select
   */
  #selectIcon(option: HTMLElement) {
    let dropdownIcon = this.input?.querySelector('ids-icon[slot="trigger-start"]');
    if (!this.hasIcons) {
      if (dropdownIcon) {
        dropdownIcon.remove();
      }
      return;
    }
    const icon: any = option.querySelector('ids-icon');

    if (!dropdownIcon) {
      const dropdownIconContainer = document.createElement('span');
      dropdownIconContainer.slot = 'trigger-start';
      dropdownIconContainer.classList.add('icon-container');
      dropdownIcon = document.createElement('ids-icon');
      dropdownIcon.icon = icon.icon;
      dropdownIcon.setAttribute('slot', 'trigger-start');
      dropdownIconContainer.append(dropdownIcon);
      this.input?.appendChild(dropdownIconContainer);
    } else {
      dropdownIcon.icon = icon.icon;
    }
  }

  /**
   * Set the tooltip to be visible for the selected option
   * @private
   * @param {HTMLElement} option the option to select
   */
  #selectTooltip(option: HTMLElement) {
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

  #configurePopup() {
    this.popup.alignTarget = this.input.fieldContainer;
    this.popup.align = 'bottom, left';
    this.popup.arrow = 'none';
    this.popup.y = -1;
    this.popup.type = 'dropdown';

    // Fix aria if the menu is closed
    if (!this.popup.visible) {
      this.#setAriaOnMenuClose();
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
    this.popup.visible = true;
    this.addOpenEvents();
    this.input.active = true;
    this.#setAriaOnMenuOpen();
  }

  /**
   * Populate the DOM with the dataset
   * @param {Function} dataset The dataset to use with value, label ect...
   * @private
   */
  #loadDataSet(dataset: any) {
    let html = '';
    const listbox = this.querySelector('ids-list-box');
    listbox.innerHTML = '';
    dataset.forEach((option: any) => {
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
  onOutsideClick(): void {
    this.close(true);
  }

  /**
   * Close the dropdown popup
   * @param {boolean} noFocus if true do not focus on close
   */
  close(noFocus?: boolean) {
    this.popup.visible = false;
    this.input.active = false;
    this.#setAriaOnMenuClose();
    this.removeOpenEvents();

    if (!noFocus) {
      this.input.focus();
    }
  }

  /**
   * Toggle the dropdown list open/closed state
   * @private
   */
  toggle(): void {
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
    // Handle Key Typeahead
    this.onEvent('keydownend', this, (e: CustomEvent) => {
      this.#typeAhead(e.detail.keys);
    });

    // Handle Clicking with the mouse on options
    this.onEvent('click', this, (e: any) => {
      if (e.target.nodeName === 'IDS-LIST-BOX-OPTION') {
        this.value = e.target.getAttribute('value');
        return;
      }

      if (e.target.closest('ids-list-box-option')) {
        this.value = e.target.closest('ids-list-box-option').getAttribute('value');
      }
    });

    this.onEvent('click', this.input.fieldContainer, () => {
      this.toggle();
    });

    // Disable text selection on tab (extra info in the screen reader)
    this.onEvent('focus', this.input, () => {
      (window.getSelection() as any).removeAllRanges();
    });

    // Handle the Locale Change
    this.offEvent('languagechange.data-grid-container');
    this.onEvent('languagechange.data-grid-container', this.closest('ids-container'), () => {
      this.#addAria();
    });

    // Listen to IdsPopup's `hide/show` events and control some attributes
    // on ListBox items for accessibility purposes.
    this.onEvent('hide', this.popup, () => {

    });
    this.onEvent('show', this.popup, () => {

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
    this.listen(['ArrowDown', 'ArrowUp'], this, (e: KeyboardEvent) => {
      if (!this.popup.visible) {
        this.open();
        return;
      }
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      const selected: any = this.selected;
      if (e.key === 'ArrowUp' && e.altKey) {
        this.value = selected?.getAttribute('value') || '';
        this.close();
        return;
      }

      if (e.key === 'ArrowDown' && selected?.nextElementSibling) {
        selected.classList.remove('is-selected');
        selected.setAttribute('tabindex', '-1');
        selected.nextElementSibling.classList.add('is-selected');
        selected.nextElementSibling.setAttribute('tabindex', '0');
        (selected.nextElementSibling as any).focus();
      }
      if (e.key === 'ArrowUp' && selected?.previousElementSibling) {
        selected.classList.remove('is-selected');
        selected.setAttribute('tabindex', '-1');
        selected.previousElementSibling.classList.add('is-selected');
        selected.previousElementSibling.setAttribute('tabindex', '0');
        (selected.previousElementSibling as any).focus();
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

      const selected = this.selected;
      this.value = selected?.getAttribute('value') || '';
      this.close();
    });

    // Move to Next on Tab
    this.listen(['Tab'], this, (e: KeyboardEvent) => {
      if (!this.popup.visible) {
        return;
      }

      if (e.shiftKey) {
        this.input.focus();
      }

      const selected = this.selected;
      this.value = selected?.getAttribute('value') || '';
      this.close(true);
    });
    return this;
  }

  /**
   * Open the list and move to the key pressed item
   * @param {string} keyString The last pressed key to use
   */
  #typeAhead(keyString: string) {
    if (this.readonly || this.disabled) {
      return;
    }

    const matches: any = [].slice.call(this.querySelectorAll('ids-list-box-option'))
      .filter((a: any) => a.textContent.toLowerCase().indexOf(keyString.toLowerCase()) === 0);

    if (matches[0]) {
      const selected = this.selected;
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
  set dirtyTracker(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DIRTY_TRACKER, val.toString());
    } else {
      this.removeAttribute(attributes.DIRTY_TRACKER);
    }

    this.handleDirtyTracker();
  }

  get dirtyTracker(): string { return this.getAttribute(attributes.DIRTY_TRACKER); }

  /**
   * Pass down `validate` attribute into IdsTriggerField
   * @param {string} value The `validate` attribute
   */
  set validate(value: string) {
    if (value) {
      this.setAttribute(attributes.VALIDATE, value.toString());
      this.input.setAttribute(attributes.VALIDATE, value.toString());
    } else {
      this.removeAttribute(attributes.VALIDATE);
      this.input.removeAttribute(attributes.VALIDATE);
    }
  }

  get validate(): string { return this.getAttribute(attributes.VALIDATE); }

  /**
   * Pass down `validation-events` attribute into IdsTriggerField
   * @param {string} value The `validation-events` attribute
   */
  set validationEvents(value: string) {
    if (value) {
      this.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
      this.input.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      this.input.removeAttribute(attributes.VALIDATION_EVENTS);
    }
  }

  get validationEvents(): string { return this.getAttribute(attributes.VALIDATION_EVENTS) || 'change'; }

  /**
   * Sets the no margins attribute
   * @param {boolean} value The value for no margins attribute
   */
  set noMargins(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.NO_MARGINS, '');
      this.input.setAttribute(attributes.NO_MARGINS, '');
      return;
    }
    this.removeAttribute(attributes.NO_MARGINS);
    this.input.removeAttribute(attributes.NO_MARGINS);
  }

  get noMargins(): boolean {
    return stringToBool(this.getAttribute(attributes.NO_MARGINS));
  }

  /**
   * Set the dropdown size
   * @param {string} value The value
   */
  set size(value: string) {
    if (value) {
      this.setAttribute(attributes.SIZE, value);
    } else {
      this.removeAttribute(attributes.SIZE);
    }
    this.input.setAttribute(attributes.SIZE, this.size);
  }

  get size(): string { return this.getAttribute(attributes.SIZE) ?? 'md'; }
}

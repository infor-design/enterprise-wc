import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, escapeRegExp } from '../../utils/ids-string-utils/ids-string-utils';
import IdsDropdownAttributeMixin from './ids-dropdown-attributes-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsFieldHeightMixin from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsElement from '../../core/ids-element';
import IdsValidationInputMixin from '../../mixins/ids-validation-mixin/ids-validation-input-mixin';
import IdsLabelStateParentMixin from '../../mixins/ids-label-state-mixin/ids-label-state-parent-mixin';
import IdsLoadingIndicatorMixin from '../../mixins/ids-loading-indicator-mixin/ids-loading-indicator-mixin';
import IdsXssMixin from '../../mixins/ids-xss-mixin/ids-xss-mixin';

import '../ids-trigger-field/ids-trigger-field';
import '../ids-trigger-field/ids-trigger-button';
import '../ids-input/ids-input';
import './ids-dropdown-list';
import '../ids-list-box/ids-list-box';
import '../ids-text/ids-text';
import '../ids-icon/ids-icon';

import styles from './ids-dropdown.scss';
import type IdsDropdownList from './ids-dropdown-list';
import type IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import type IdsListBox from '../ids-list-box/ids-list-box';
import type IdsListBoxOption from '../ids-list-box/ids-list-box-option';
import type IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import type IdsIcon from '../ids-icon/ids-icon';
import type IdsCheckbox from '../ids-checkbox/ids-checkbox';
import { IdsPopupElementRef } from '../ids-popup/ids-popup-attributes';
import { getClosestContainerNode } from '../../utils/ids-dom-utils/ids-dom-utils';
import { IdsDropdownOption, IdsDropdownOptions } from './ids-dropdown-common';

const Base = IdsDropdownAttributeMixin(
  IdsDirtyTrackerMixin(
    IdsValidationInputMixin(
      IdsLoadingIndicatorMixin(
        IdsLabelStateParentMixin(
          IdsFieldHeightMixin(
            IdsColorVariantMixin(
              IdsTooltipMixin(
                IdsXssMixin(
                  IdsLocaleMixin(
                    IdsKeyboardMixin(
                      IdsEventsMixin(
                        IdsElement
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
);

/**
 * IDS Dropdown Component
 * @type {IdsDropdown}
 * @inherits IdsElement
 * @mixes IdsDropdownAttributeMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsValidationInputMixin
 * @mixes IdsLoadingIndicatorMixin
 * @mixes IdsFieldHeightMixin
 * @mixes IdsColorVariantMixin
 * @mixes IdsTooltipMixin
 * @mixes IdsXssMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsEventsMixin
 * @part dropdown - the tag element
 */
@customElement('ids-dropdown')
@scss(styles)
export default class IdsDropdown extends Base {
  isFormComponent = true;

  hasIcons = false;

  dropdownList?: IdsDropdownList | null;

  trigger?: IdsTriggerButton | null;

  listBox?: IdsListBox | null;

  labelClicked: boolean;

  labelEl?: HTMLLabelElement | null;

  /** Sets to true when a keyboard operation opens the dropdown (prevents extraneous event triggering) */
  openedByKeyboard = false;

  /** Sets to true when a keyboard operation closes the dropdown (prevents extraneous event triggering) */
  closedByKeyboard = false;

  constructor() {
    super();
    this.state = { selectedIndex: 0 };
    this.labelClicked = false;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.trigger = this.container?.querySelector('ids-trigger-button');
    this.labelEl = this.input?.labelEl;

    this.configureDropdownList();
    this.listBox = this.dropdownList?.querySelector('ids-list-box');

    this
      .#addAria()
      .#attachEventHandlers()
      .#attachKeyboardListeners();

    this.value = this.getAttribute('value');
    this.resetDirtyTracker();
    this.container?.classList.toggle('typeahead', this.typeahead);
    this.listBox?.setAttribute(attributes.SIZE, this.size);
    if (this.getAttribute('disabled')) this.disabled = stringToBool(this.getAttribute('disabled'));
    if (this.getAttribute('readonly')) this.readonly = stringToBool(this.getAttribute('readonly'));
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes
    ];
  }

  #optionsData: IdsDropdownOptions = [];

  #isMultiSelect: boolean = this.nodeName === 'IDS-MULTISELECT';

  /**
   * List of available color variants for this component
   * @returns {Array<string>}
   */
  colorVariants: Array<string> = ['alternate-formatter', 'borderless', 'in-cell'];

  /**
   * Push color variant to the container element
   * @returns {void}
   */
  onColorVariantRefresh(): void {
    if (this.input) this.input.colorVariant = this.colorVariant;
  }

  onLabelChange(): void {
    if (this.input) this.input.label = this.label;
  }

  /**
   * Push label-state to the container element
   * @returns {void}
   */
  onLabelStateChange(): void {
    if (this.input) this.input.labelState = this.labelState;
  }

  onLabelRequiredChange(): void {
    if (this.input) this.input.labelRequired = this.labelRequired;
  }

  /**
   * Push field-height/compact to the container element
   * @param {string} val the new field height setting
   */
  onFieldHeightChange(val: string) {
    if (val) {
      const attr = val === attributes.COMPACT ? { name: attributes.COMPACT, val: '' } : { name: attributes.FIELD_HEIGHT, val };
      this.input?.setAttribute(attr.name, attr.val);
      this.dropdownList?.setAttribute(attr.name, attr.val);
    } else {
      this.input?.removeAttribute(attributes.COMPACT);
      this.input?.removeAttribute(attributes.FIELD_HEIGHT);
      this.dropdownList?.removeAttribute(attributes.COMPACT);
      this.dropdownList?.removeAttribute(attributes.FIELD_HEIGHT);
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
    const builtInDropdown = !this.list ? this.templateDropdownList() : '';
    const cssParts = 'container: triggerfield-container, field-container: triggerfield-field-container, content-area: triggerfield-content-area, input: triggerfield-input, popup: triggerfield-popup';

    this.hasIcons = this.querySelector('ids-list-box-option ids-icon') !== null;

    return `
    <div class="ids-dropdown">
      <ids-trigger-field
        id="triggerField-${this.id ? this.id : ''}"
        ${!this.typeahead && !this.disabled ? ' readonly="true"' : ''}
        ${this.disabled ? ' disabled="true"' : ''}
        ${this.readonly ? '' : ' readonly-background'}
        ${!this.readonly && !this.disabled ? '' : ' cursor="pointer"'}
        size="${this.size}"
        label="${this.label}"
        placeholder="${this.placeholder}"
        part="trigger-field"
        exportparts="${cssParts}"
        ${colorVariant}${fieldHeight}${compact}${noMargins}${labelState}
        ${this.validate ? ` validate="${this.validate}"` : ''}
        ${this.validate && this.validationEvents ? ` validation-events="${this.validationEvents}"` : ''}
      >
        <ids-trigger-button
          id="triggerBtn-${this.id ? this.id : ''}"
          slot="trigger-end"
          part="trigger-button"
          tabbable="false"
          disabled="${this.disabled}"
        >
          <ids-text audible="true" translate-text="true">DropdownTriggerButton</ids-text>
          <ids-icon icon="dropdown" part="icon"></ids-icon>
        </ids-trigger-button>
      </ids-trigger-field>
      ${builtInDropdown}
    </div>`;
  }

  private templateDropdownList(): string {
    const fieldHeight = this.fieldHeight && this.fieldHeight !== 'compact' ? ` field-height="${this.fieldHeight}"` : '';
    const compact = this.compact || this.fieldHeight === 'compact' ? ' compact' : '';
    const size = this.size ? ` size="${this.size}"` : '';
    const value = this.value ? ` value="${this.value}"` : '';

    return `<ids-dropdown-list
      id="dropdownList-${this.id ? this.id : ''}"
      ${fieldHeight}
      ${compact}
      ${size}
      ${value}>
      <slot></slot>
    </ids-dropdown-list>`;
  }

  /**
   * Add internal aria attributes
   * @private
   * @returns {object} This API object for chaining
   */
  #addAria() {
    const targetListboxId = this.listBox?.getAttribute('id') || `ids-list-box-${this.id}`;

    const attrs: any = {
      role: 'combobox',
      'aria-expanded': 'false',
      'aria-autocomplete': 'list',
      'aria-haspopup': 'listbox',
      'aria-description': this.localeAPI?.translate('PressDown'),
      'aria-controls': targetListboxId
    };

    this.dropdownList?.listBox?.setAttribute('id', targetListboxId);
    this.dropdownList?.listBox?.setAttribute('aria-label', `Listbox`);

    Object.keys(attrs).forEach((key: any) => this.setAttribute(key, attrs[key]));
    return this;
  }

  get input() {
    return this.container?.querySelector<IdsTriggerField>('ids-trigger-field');
  }

  get popup() {
    return this.dropdownList?.popup;
  }

  /**
   * Set the value of the dropdown using the value/id attribute if present
   * @param {string} value The value/id to use
   */
  set value(value: string | null) {
    let selector = `ids-list-box-option[value="${value}"]`;
    if (value === ' ' || !value) selector = `ids-list-box-option:not([value])`;
    const elem = this.dropdownList?.listBox?.querySelector<IdsListBoxOption>(selector);
    if (!elem) return;

    this.clearSelected();
    this.selectOption(elem);
    this.selectIcon(elem);
    this.selectTooltip(elem);
    if (this.input) this.input.value = elem.textContent?.trim();
    this.state.selectedIndex = [...((elem?.parentElement as any)?.children || [])].indexOf(elem);

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
    this.setAttribute(attributes.VALUE, String(value));
  }

  get value(): string | null {
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * Returns the selected Listbox option based on the Dropdown's value.
   * @returns {HTMLElement| null} the selected option
   */
  get selectedOption(): HTMLElement | null {
    return this.dropdownList?.listBox?.querySelector(`ids-list-box-option[value="${this.value}"]`) || null;
  }

  /**
   * Returns the currently-selected Listbox option
   * (may be different from the Dropdown's value because of user input)
   * @readonly
   * @returns {HTMLElement|null} Reference to a selected Listbox option if one is present
   */
  get selected(): HTMLElement | null {
    return this.dropdownList?.selected || null;
  }

  /**
   * Set the selected option by index
   * @param {number} value the index to use
   */
  set selectedIndex(value:number) {
    if (Number.isInteger(value) && this.options[value]) {
      const elem = this.options[value];
      this.value = elem.getAttribute(attributes.VALUE);
      this.state.selectedIndex = value;
    }
  }

  get selectedIndex() { return this.state.selectedIndex; }

  /**
   * Returns the currently available options
   * @returns {Array<IdsListBoxOption>} the array of options
   */
  get options() {
    if (!this.dropdownList || !this.dropdownList.listBox) return [];
    return [...this.dropdownList.listBox.querySelectorAll<IdsListBoxOption>('ids-list-box-option')];
  }

  /**
   * Sets the readonly attribute
   * @param {string|boolean} value string value from the readonly attribute
   */
  set readonly(value) {
    const isReadonly = stringToBool(value);

    if (isReadonly) {
      this.removeAttribute(attributes.DISABLED);
      if (this.input) {
        this.input.disabled = false;
        this.input.cursor = 'text';
        this.input.readonlyBackground = false;
      }
      this.setAttribute(attributes.READONLY, 'true');
      return;
    }
    if (this.input) {
      this.input.disabled = false;
      this.input.cursor = 'pointer';
      this.input.readonlyBackground = true;
    }
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
      this.removeAttribute(attributes.READONLY);
      if (this.input) {
        this.input.disabled = true;
        this.input.readonly = false;
        this.input.cursor = 'initial';
        this.input.bgTransparent = false;
      }
      this.setAttribute(attributes.DISABLED, 'true');
      return;
    }

    if (this.input) {
      this.input.disabled = false;
      this.input.cursor = 'pointer';
      this.input.bgTransparent = true;
    }

    this.removeAttribute(attributes.DISABLED);
  }

  get disabled() {
    return stringToBool(this.getAttribute(attributes.DISABLED)) || false;
  }

  onAllowBlankChange(val: boolean) {
    if (this.dropdownList) this.dropdownList.allowBlank = val;
    if (!val && this.value === 'blank') this.removeAttribute(attributes.VALUE);
  }

  /**
   * Set the aria and state on the element
   * @param {HTMLElement} option the option to select
   * @private
   */
  selectOption(option: IdsListBoxOption) {
    if (this.dropdownList) {
      this.dropdownList.selectOption(option);
    }
  }

  /**
   * Removes selected attributes from an option
   * @param {HTMLElement} option element to remove attributes
   */
  deselectOption(option: HTMLElement | undefined | null) {
    this.dropdownList?.deselectOption(option);
  }

  /**
   * Set the icon to be visible (if used)
   * @private
   * @param {HTMLElement} option the option to select
   */
  selectIcon(option: HTMLElement | undefined | null) {
    let dropdownIcon = this.input?.querySelector<IdsIcon>('ids-icon[slot="trigger-start"]');
    if (!dropdownIcon && !option) return;

    if (!this.hasIcons) {
      if (dropdownIcon) {
        dropdownIcon.remove();
      }
      return;
    }
    const icon: any = option?.querySelector('ids-icon');

    if (!dropdownIcon) {
      const dropdownIconContainer = document.createElement('span');
      dropdownIconContainer.slot = 'trigger-start';
      dropdownIconContainer.classList.add('icon-container');
      dropdownIcon = document.createElement('ids-icon') as IdsIcon;
      dropdownIcon.icon = icon?.icon;
      dropdownIcon.setAttribute('slot', 'trigger-start');
      dropdownIconContainer.append(dropdownIcon);
      this.input?.appendChild(dropdownIconContainer);
    } else {
      dropdownIcon.icon = icon?.icon;
    }
  }

  /**
   * Set the tooltip to be visible for the selected option
   * @private
   * @param {HTMLElement} option the option to select
   */
  selectTooltip(option: HTMLElement | undefined | null) {
    const tooltip = option?.getAttribute('tooltip');
    if (tooltip) {
      this.tooltip = tooltip;
    }
  }

  /**
   * Remove the aria and state from the currently selected element
   */
  clearSelected() {
    this.dropdownList?.clearSelected();
  }

  /**
   * Configures the Dropdown component's attached IdsDropdownList/IdsPopup
   */
  configurePopup() {
    if (this.dropdownList?.popup && this.trigger) {
      this.dropdownList.removeTriggerEvents();
      this.dropdownList.appendToTargetParent();
      this.dropdownList.popupOpenEventsTarget = (this.list ? this : this.container as IdsPopupElementRef);
      this.dropdownList.onOutsideClick = (e: Event) => {
        if (this.dropdownList) {
          if (!e.composedPath()?.includes(this.dropdownList)) {
            this.close(true);
          }
        }
      };
      this.dropdownList.onTriggerClick = () => {
        if (this.labelClicked) {
          this.labelClicked = false;
          return;
        }
        if (!this.disabled && !this.readonly) {
          this.toggle(this.typeahead);
        }
      };

      // Associate the Dropdown List component with this Dropdown component's trigger button
      const targetElemId = (this.list ? this : this.input?.input)?.getAttribute('id');
      const triggerElemId = (this.list ? this : this.trigger)?.getAttribute('id');

      this.dropdownList.setAttribute(attributes.TARGET, `#${targetElemId}`);
      this.dropdownList.setAttribute(attributes.TRIGGER_ELEM, `#${triggerElemId}`);
      this.dropdownList.popup.alignTarget = this.input?.fieldContainer || null;

      this.dropdownList.popupOpenEventsTarget = document.body;

      // Configure inner IdsPopup
      const isRTL = this.localeAPI.isRTL();
      if (this.locale && isRTL) {
        this.dropdownList.popup?.setAttribute(attributes.ALIGN, `bottom, ${isRTL || ['lg', 'full'].includes(this.size) ? 'right' : 'left'}`);
      }

      if (this.input) this.dropdownList.value = this.input.value;

      if (this.#isMultiSelect) this.dropdownList.isMultiSelect = true;
    }
  }

  /**
   * Open the dropdown list
   * @param {boolean} shouldSelect whether or not the input text should be selected
   */
  async open(shouldSelect = false) {
    if (!this.dropdownList || this.disabled || this.readonly) {
      return;
    }

    // Trigger an async callback for contents
    if (typeof this.state.beforeShow === 'function') {
      const stuff = await this.state.beforeShow();
      this.loadDataSet(stuff);
      if (this.typeahead) {
        this.#optionsData = stuff;
      }
    }

    if (this.value) {
      this.dropdownList.value = this.value;
    }

    // Open the Dropdown List
    this.dropdownList?.show();

    if (this.input) this.input.active = true;

    // Focus and select input when typeahead is enabled
    if (this.typeahead) {
      this.input?.removeAttribute(attributes.READONLY);
      this.input?.focus();
    }

    if (shouldSelect) {
      this.input?.input?.select();
    }

    this.container?.classList.add('is-open');

    this.attachOpenEvents();
  }

  /**
   * Populate the DOM with the dataset
   * @param {IdsDropdownOptions} dataset The dataset to use with value, label ect...
   * @private
   */
  loadDataSet(dataset: IdsDropdownOptions) {
    let html = '';

    const listbox = this.querySelector('ids-list-box');
    if (listbox) listbox.innerHTML = '';

    dataset.forEach((option: IdsDropdownOption) => {
      html += this.#templatelistBoxOption(this.#sanitizeOption(option));
    });
    listbox?.insertAdjacentHTML('afterbegin', html);
    this.dropdownList?.configureBlank();
    const currentValue = this.getAttribute(attributes.VALUE);
    if (this.value !== currentValue) {
      this.value = currentValue;
    }
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
   * Close the dropdown popup
   * @param {boolean} noFocus if true do not focus on close
   */
  close(noFocus?: boolean) {
    this.removeOpenEvents();

    if (this.dropdownList) {
      if (this.dropdownList?.popup?.visible) this.dropdownList.hide(!noFocus);
      if (this.input) this.input.active = false;
    }

    if (!noFocus) {
      this.input?.focus();
    }

    if (this.typeahead) {
      // In case unfinished typeahead (typing is in process)
      // closing popup will reset dropdown to the initial value
      this.input?.setAttribute(attributes.READONLY, 'true');
      const initialValue: string | null | undefined = this.selectedOption?.textContent?.trim();
      if (this.input) this.input.value = initialValue || '';
      this.loadDataSet(this.#optionsData);
      (window.getSelection() as Selection).removeAllRanges();
      this.#triggerIconChange('dropdown');
    }

    this.container?.classList.remove('is-open');
  }

  /**
   * Toggle the dropdown list open/closed state
   * @param {boolean} shouldSelect whether or not the input text should be selected
   * @private
   */
  toggle(shouldSelect = false): void {
    if (!this.dropdownList) return;
    if (!this.dropdownList.popup?.visible) {
      this.open(shouldSelect);
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
    this.attachClickEvent();

    // Should not open if clicked on label
    this.offEvent('click.dropdown-label');
    this.onEvent('click.dropdown-label', this.labelEl, (e: MouseEvent) => {
      e.preventDefault();
      this.labelClicked = true;
      this.input?.focus();
    });

    // Dropdown List's `hide` event can cause the field to become focused
    this.offEvent('hide.dropdown-list');
    this.onEvent('hide.dropdown-list', this.container, () => {
      if (this.dropdownList?.popup?.visible) this.close();
    });

    // Disable text selection on tab (extra info in the screen reader)
    this.offEvent('focus.dropdown-input');
    this.onEvent('focus.dropdown-input', this.input, () => {
      (window.getSelection() as Selection).removeAllRanges();
    });

    // Handle the Locale Change
    this.offEvent('languagechange.dropdown-container');
    this.onEvent('languagechange.dropdown-container', this.closest('ids-container'), () => {
      this.#addAria();
    });

    this.attachKeyboardOpenEvent();

    return this;
  }

  /**
   * Attach a keyboard event for Enter/Spacebar that opens the dropdown.
   * This needs to happen separately from the other event handlers because this
   * one is rebound every time the list is closed.
   */
  private attachKeyboardOpenEvent() {
    this.listen([' ', 'Enter'], this, (e: KeyboardEvent) => {
      if (this.closedByKeyboard) {
        this.closedByKeyboard = false;
        return;
      }

      this.openedByKeyboard = true;
      if (this.dropdownList?.popup?.visible) return;
      if (e.key === ' ' && this.typeahead) return;
      this.open(this.typeahead);
    });
  }

  /** Handle the Locale Change */
  onLanguageChange = () => {
    this.#addAria();
  };

  /**
   * Connects event handlers related to activation of the Dropdown List
   */
  attachClickEvent() {
    this.offEvent('click.dropdown-input');
    if (!this.list) {
      this.onEvent('click.dropdown-input', this.input, (e: MouseEvent) => {
        if (!this.dropdownList?.visible) {
          this.dropdownList?.onTriggerClick?.(e);
        }
      });
    }

    // Respond to open/close events from an external IdsDropdownList component
    this.offEvent('open.dropdown-list');
    this.offEvent('close.dropdown-list');
    if (this.dropdownList) {
      this.onEvent('open.dropdown-list', this.dropdownList, (e: CustomEvent) => {
        e.stopPropagation();
        this.open();
      });
      this.onEvent('close.dropdown-list', this.dropdownList, (e: CustomEvent) => {
        e.stopPropagation();
        this.close(e.detail.operation === 'cancel');
      });
    }

    this.offEvent('selected.dropdown-list');
    if (this.input?.fieldContainer) {
      this.onEvent('selected.dropdown-list', this.input.fieldContainer, (e: CustomEvent) => {
        e.stopPropagation();
        this.value = e.detail.value;
        if (this.dropdownList?.popup?.visible) this.close();
      });
    }

    // Close the list on change, if applicable
    this.offEvent('change.list');
    this.onEvent('change.list', this, () => {
      if (this.dropdownList?.popup?.visible) {
        this.close();
      }
    });
  }

  /**
   * Connects interaction events that should only be present when the
   * dropdown list is open
   */
  private attachOpenEvents() {
    this.unlisten(' ');
    this.unlisten('Enter');
    this.attachKeyboardSelectionEvent();

    // Select on Tab
    this.listen(['Tab'], this, (e: KeyboardEvent) => {
      if (!this.dropdownList?.popup?.visible || this.#isMultiSelect) {
        return;
      }

      if (e.shiftKey) {
        this.input?.focus();
      }

      const selected = this.selected;
      this.value = selected?.getAttribute(attributes.VALUE) || '';
      this.close(true);
    });
  }

  /**
   * Establish selection event for keyboard interactions.
   * Overrides a similiar method from IdsDropdown for Multiselect-specific behavior.
   */
  attachKeyboardSelectionEvent() {
    if (!this.#isMultiSelect) {
      // Select or Open on space/enter
      this.listen([' ', 'Enter'], this, () => {
        if (!this.dropdownList?.popup?.visible) return;
        if (this.openedByKeyboard) {
          this.openedByKeyboard = false;
          return;
        }

        const value = this.selected?.getAttribute(attributes.VALUE) || '';
        this.value = value;
        this.closedByKeyboard = true;
        this.close();
      });
    }
  }

  private removeOpenEvents() {
    this.unlisten(' ');
    this.unlisten('Enter');
    this.unlisten('Tab');

    this.openedByKeyboard = false;
    this.attachKeyboardOpenEvent();
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #attachKeyboardListeners() {
    this.offEvent('keydownend.dropdown-typeahead');
    this.onEvent('keydownend.dropdown-typeahead', this, (e: CustomEvent) => {
      if (this.typeahead) {
        this.#typeAhead(e.detail.keys);
      } else {
        this.#selectMatch(e.detail.keys);
      }
    });

    // Handle up and down arrow
    this.listen(['ArrowDown', 'ArrowUp'], this, (e: KeyboardEvent) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      if (!this.dropdownList?.popup?.visible) {
        this.open(this.typeahead);
        return;
      }

      const selected: any = this.selected;
      const next = selected?.nextElementSibling;
      const prev = selected?.previousElementSibling;

      if (e.key === 'ArrowUp' && e.altKey) {
        if (!this.#isMultiSelect) {
          this.value = selected?.getAttribute(attributes.VALUE) || '';
        }
        this.close();
        return;
      }

      if (e.key === 'ArrowDown' && next) {
        if (next.hasAttribute(attributes.GROUP_LABEL) && !next.nextElementSibling) return;
        this.deselectOption(selected);
        this.selectOption(next.hasAttribute(attributes.GROUP_LABEL) ? next.nextElementSibling : next);
      }

      // Handles a case when the value is cleared
      if (e.key === 'ArrowDown' && !selected) {
        this.#selectFirstOption();
      }

      if (e.key === 'ArrowUp' && prev) {
        if (prev.hasAttribute(attributes.GROUP_LABEL) && !prev.previousElementSibling) return;
        this.deselectOption(selected);
        this.selectOption(prev.hasAttribute(attributes.GROUP_LABEL) ? prev.previousElementSibling : prev);
      }
    });

    // Close on escape
    this.listen(['Escape'], this, () => {
      this.close();
    });

    // Delete/backspace should clear the value
    this.listen(['Backspace', 'Delete'], this, () => {
      if (!this.clearable || (this.clearable && this.typeahead && this.dropdownList?.popup?.visible)) return;

      if (this.allowBlank) {
        this.value = 'blank';
      } else {
        // ids-multiselect shared
        (this.value as any) = this.#isMultiSelect ? [] : '';
        if (this.input) this.input.value = '';
        this.selectIcon(null);
        this.selectTooltip(null);
      }

      this.input?.focus();
    });

    return this;
  }

  /**
   * Handle typeahead functionality
   * @param {string} text keydownend event detail keys
   * @returns {void}
   */
  #typeAhead(text: string) {
    // Accepts the keyboard input while closed
    const excludeKeys = ['Backspace', 'Delete'];

    if (!this.dropdownList?.popup?.visible) {
      if (!excludeKeys.some((item) => text?.includes(item))) {
        if (this.input) this.input.value = text;
        this.open(false);
      } else {
        return;
      }
    }

    const inputValue = this.input?.value ?? '';
    const resultsArr = this.#findMatches(inputValue);
    const results = resultsArr.map((item: IdsDropdownOption) => {
      const regex = new RegExp(inputValue, 'gi');
      const optionText = item.groupLabel ? item.label : item.label?.replace(
        regex,
        `<span class="highlight">${inputValue?.toLowerCase()}</span>`
      );

      return this.#templatelistBoxOption({
        ...item,
        label: optionText
      });
    }).join('');

    if (this.dropdownList) {
      if (this.dropdownList.listBox) {
        if (results) {
          this.dropdownList.listBox.innerHTML = results;
          this.#selectFirstOption();
        } else {
          this.dropdownList.listBox.innerHTML = `<ids-list-box-option>${this.localeAPI.translate('NoResults')}</ids-list-box-option>`;
        }
      }

      // Change location of the popup after results are populated and the popup's height change
      this.dropdownList.popup?.place();
    }

    this.#triggerIconChange('search');

    // Remove selected input icon when start typing
    this.input?.querySelector('.icon-container')?.remove();
  }

  /**
   * Find and select the only option by input text provided
   * @param {string} input the text to find by
   */
  #selectMatch(input: string) {
    const term: string = escapeRegExp(input)?.trim();

    if (!term) return;

    const option = this.options
      .filter((item: IdsListBoxOption) => !item.hasAttribute(attributes.GROUP_LABEL))
      .find((item: IdsListBoxOption) => {
        const regex = new RegExp(`^(${term})`, 'i');
        const label = this.#isMultiSelect ? item.querySelector<IdsCheckbox>('ids-checkbox')?.label : item.textContent?.trim();

        return label?.match(regex);
      });

    if (this.dropdownList?.popup?.visible && option) {
      this.deselectOption(this.selected);
      this.selectOption(option as IdsListBoxOption);

      return;
    }

    const value = option?.getAttribute(attributes.VALUE);

    if (value) {
      if (this.#isMultiSelect) {
        const filtered: string[] = (this.value as any).filter((item: string) => item !== value);

        (this.value as any) = [...filtered, value];
      } else {
        this.value = value;
      }
    }
  }

  /**
   * Helper to replace trigger button icon
   * @param {string} icon ids-icon icon value
   */
  #triggerIconChange(icon: string) {
    const triggerIcon = this.container?.querySelector<IdsTriggerButton>('ids-trigger-button')?.querySelector<IdsIcon>('ids-icon');

    if (triggerIcon?.icon && triggerIcon.icon !== icon) {
      triggerIcon.icon = icon;
    }
  }

  /**
   * Select first no blank with value option
   */
  #selectFirstOption() {
    this.clearSelected();

    if (this.options.length > 0) {
      const firstWithValue = [...this.options].filter((item) => {
        const value = item.getAttribute(attributes.VALUE);
        const groupLabel = item.hasAttribute(attributes.GROUP_LABEL);

        return value && value !== 'blank' && !groupLabel;
      })[0];

      this.selectOption(firstWithValue);
    }
  }

  /**
   * Create the list box option template.
   * @param {IdsDropdownOption} option data object
   * @returns {string} ids-list-box-option template
   */
  #templatelistBoxOption(option: IdsDropdownOption): string {
    return `<ids-list-box-option
      ${option.id ? `id=${option.id}` : ''}
      ${option.value ? `value="${option.value}"` : 'value=""'}
      ${option.groupLabel ? 'group-label' : ''}>${option.icon ? `<ids-icon icon="${option.icon}"></ids-icon>` : ''}${option.label || ''}</ids-list-box-option>`;
  }

  /**
   * Helper to get group index for given option index in the options list
   * @param {Array<number>} groupLabels group label indexes in the options list
   * @param {number} optionIndex option index in the options list
   * @returns {number} group label index for given option
   */
  #getGroupIndex(groupLabels: Array<number>, optionIndex: number) {
    return groupLabels.reduce((initialIndex: number, groupIndex: number, index: number) => {
      if (groupIndex < optionIndex && (groupLabels[index + 1] > optionIndex || !groupLabels[index + 1])) {
        return groupIndex;
      }

      return initialIndex;
    }, -1);
  }

  /**
   * Helper to get group option for given option index in the options list
   * @param {number} optionIndex option index in the options list
   * @returns {IdsDropdownOption | undefined} group label for given option index
   */
  #getGroupLabelOption(optionIndex: number): IdsDropdownOption | undefined {
    // Get group labels indexes in the all options list
    const groupLabels: Array<number> = this.#optionsData.reduce(
      (result: Array<number>, option: IdsDropdownOption, index: number) => {
        if (option?.groupLabel) {
          return [...result, index];
        }

        return result;
      },
      []
    );
    const groupLabelIndex = this.#getGroupIndex(groupLabels, optionIndex);

    return this.#optionsData[groupLabelIndex];
  }

  /**
   * Find matches between the input value and the dataset
   * @param {string} inputValue value of the input field
   * @returns {IdsDropdownOptions} containing matched values
   */
  #findMatches(inputValue: string): IdsDropdownOptions {
    return this.#optionsData.reduce((options: Array<IdsDropdownOption>, option: IdsDropdownOption, index: number) => {
      const regex = new RegExp(`(${escapeRegExp(inputValue)})`, 'gi');

      if (option.label?.match(regex) && !option.groupLabel) {
        const groupLabelOption = this.#getGroupLabelOption(index);
        // Check if group label option is already added to the list
        const groupLabelAdded = options.some(
          (item: IdsDropdownOption) => item.label === groupLabelOption?.label
        );

        if (groupLabelOption && !groupLabelAdded) {
          return [...options, groupLabelOption, option];
        }

        return [...options, option];
      }

      return options;
    }, []);
  }

  /**
   * Map slotted ids-list-box-option elements to the dataset
   */
  #setOptionsData() {
    this.#optionsData = [...this.options].map((item) => ({
      id: item.id,
      label: item.textContent?.trim() ?? '',
      value: item.getAttribute(attributes.VALUE) as string,
      icon: item.querySelector<IdsIcon>('ids-icon')?.icon,
      groupLabel: item.hasAttribute(attributes.GROUP_LABEL)
    }));
  }

  #sanitizeOption(option: IdsDropdownOption): IdsDropdownOption {
    return ({
      ...option,
      id: this.xssSanitize(option?.id ?? '') as string,
      value: this.xssSanitize(option.value) as string,
      label: this.xssSanitize(option.label) as string
    });
  }

  /**
   * Pass down `validate` attribute into IdsTriggerField
   * @param {string} value The `validate` attribute
   */
  set validate(value: string | null) {
    if (value) {
      this.setAttribute(attributes.VALIDATE, value.toString());
      if (this.input) this.input.setAttribute(attributes.VALIDATE, value.toString());
    } else {
      this.removeAttribute(attributes.VALIDATE);
      if (this.input) this.input.removeAttribute(attributes.VALIDATE);
    }
  }

  get validate(): string | null {
    return this.getAttribute(attributes.VALIDATE);
  }

  /**
   * Pass down `validation-events` attribute into IdsTriggerField
   * @param {string} value The `validation-events` attribute
   */
  set validationEvents(value: string) {
    if (value) {
      this.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
      if (this.input) this.input.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      if (this.input) this.input.removeAttribute(attributes.VALIDATION_EVENTS);
    }
  }

  get validationEvents(): string { return this.getAttribute(attributes.VALIDATION_EVENTS) || 'change'; }

  /**
   * Configures the connected Dropdown list component
   */
  private configureDropdownList() {
    let targetNode = this.container?.querySelector<IdsDropdownList>('ids-dropdown-list');

    if (this.hasAttribute(attributes.LIST)) {
      if (this.dropdownList && this.container?.contains(this.dropdownList)) {
        this.dropdownList.remove();
        this.dropdownList = null;
      }
      const containerNode = getClosestContainerNode(this);

      // Try to find an external node, default to a built-in if we can't find one
      targetNode = containerNode.querySelector<IdsDropdownList>(`${this.getAttribute(attributes.LIST)}`);
      if (!targetNode) {
        this.removeAttribute(attributes.LIST);
        this.container?.insertAdjacentHTML('beforeend', this.templateDropdownList());
        targetNode = this.container?.querySelector<IdsDropdownList>('ids-dropdown-list');
      }
    }
    this.dropdownList = targetNode;
    this.configurePopup();
    this.attachClickEvent();
  }

  /**
   * Defines the existence of an external IdsDropdownList component, and connects this IdsDropdown
   * to the component via events.
   * @param {string | null} val ID attribute name
   */
  set list(val: string | null) {
    if (val && typeof val === 'string') {
      this.setAttribute(attributes.LIST, val);
    } else {
      this.removeAttribute(attributes.LIST);
    }
    this.configureDropdownList();
  }

  get list(): string | null { return this.getAttribute(attributes.LIST); }

  /**
   * Sets the no margins attribute
   * @param {boolean} value The value for no margins attribute
   */
  set noMargins(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.NO_MARGINS, '');
      if (this.input) this.input.setAttribute(attributes.NO_MARGINS, '');
      return;
    }
    this.removeAttribute(attributes.NO_MARGINS);
    if (this.input) this.input.removeAttribute(attributes.NO_MARGINS);
  }

  get noMargins(): boolean {
    return stringToBool(this.getAttribute(attributes.NO_MARGINS));
  }

  onSizeChange(value: string) {
    if (value) this.dropdownList?.setAttribute(attributes.SIZE, value);
    else this.dropdownList?.removeAttribute(attributes.SIZE);
    this.input?.setAttribute(attributes.SIZE, value);
  }

  /**
   * Set typeahead attribute
   * @param {string | boolean | null} value typeahead value
   */
  set typeahead(value: string | boolean | null) {
    const val = stringToBool(value);

    if (val) {
      this.setAttribute(attributes.TYPEAHEAD, String(val));
      this.#setOptionsData();
    } else {
      this.removeAttribute(attributes.TYPEAHEAD);
    }

    this.container?.classList.toggle('typeahead', val);
  }

  /**
   * Get the typeahead attribute
   * @returns {boolean} typeahead attribute value converted to boolean
   */
  get typeahead(): boolean {
    return stringToBool(this.getAttribute(attributes.TYPEAHEAD));
  }

  onClearableTextChange(val: string | null) {
    if (this.dropdownList) this.dropdownList.clearableText = val;
  }

  /**
   * Sets the placeholder attribute
   * @param {string} value - the placeholder's text
   */
  set placeholder(value: string) {
    if (value) {
      this.setAttribute(attributes.PLACEHOLDER, value);
      this.input?.setAttribute(attributes.PLACEHOLDER, value);
    } else {
      this.removeAttribute(attributes.PLACEHOLDER);
      this.input?.removeAttribute(attributes.PLACEHOLDER);
    }
  }

  /**
   * Get the placeholder attribute
   * @returns {string} default is ""
   */
  get placeholder(): string {
    return this.getAttribute(attributes.PLACEHOLDER) ?? '';
  }

  /**
   * Pass focus internally
   */
  focus() {
    this.input?.focus();
  }

  /**
   * Set whether or not to show loading indicator. Disabled by default
   * @param {boolean|string|null} value show-loading-indicator attribute value
   */
  set showLoadingIndicator(value: string | boolean | null) {
    const boolVal = stringToBool(value);
    if (boolVal) {
      this.setAttribute(attributes.SHOW_LOADING_INDICATOR, boolVal.toString());
      this.input?.setAttribute(attributes.SHOW_LOADING_INDICATOR, boolVal.toString());
      this.close(true);
    } else {
      this.removeAttribute(attributes.SHOW_LOADING_INDICATOR);
      this.input?.removeAttribute(attributes.SHOW_LOADING_INDICATOR);
    }
  }

  /**
   * show-loading-indicator attribute
   * @returns {boolean} showLoadingIndicator param converted to boolean from attribute value. Defaults to false
   */
  get showLoadingIndicator() { return stringToBool(this.getAttribute(attributes.SHOW_LOADING_INDICATOR)); }
}

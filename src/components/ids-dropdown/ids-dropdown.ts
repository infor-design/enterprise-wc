import IdsElement from '../../core/ids-element';

import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { stringToBool, escapeRegExp } from '../../utils/ids-string-utils/ids-string-utils';
import {
  getClosestContainerNode,
  checkOverflow,
  validMaxHeight,
  getClosest
} from '../../utils/ids-dom-utils/ids-dom-utils';

import IdsDropdownAttributeMixin from './ids-dropdown-attributes-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsFieldHeightMixin from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
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

import type IdsDropdownList from './ids-dropdown-list';
import type IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import type IdsListBox from '../ids-list-box/ids-list-box';
import type IdsListBoxOption from '../ids-list-box/ids-list-box-option';
import type IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import type IdsTooltip from '../ids-tooltip/ids-tooltip';
import type IdsIcon from '../ids-icon/ids-icon';
import IdsCheckbox from '../ids-checkbox/ids-checkbox';
import type IdsSearchField from '../ids-search-field/ids-search-field';

import styles from './ids-dropdown.scss';
import {
  IdsDropdownColorVariants,
  IdsDropdownOption,
  IdsDropdownOptions
} from './ids-dropdown-common';

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
    if (this.maxHeight && this.listBox) {
      this.listBox.maxHeight = this.maxHeight;
    }

    this
      .#addAria()
      .#attachEventHandlers()
      .#attachKeyboardListeners();

    if (this.hasAttribute(attributes.VALUE)) this.value = this.getAttribute(attributes.VALUE);

    this.container?.classList.toggle('typeahead', this.typeahead);
    this.listBox?.setAttribute(attributes.SIZE, this.size);
    if (this.getAttribute('disabled')) this.disabled = stringToBool(this.getAttribute('disabled'));
    if (this.getAttribute('readonly')) this.readonly = stringToBool(this.getAttribute('readonly'));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.dropdownList?.hide();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.MAX_HEIGHT,
      attributes.VALIDATE
    ];
  }

  optionsData: IdsDropdownOptions = [];

  #isMultiSelect: boolean = this.nodeName === 'IDS-MULTISELECT';

  /**
   * List of available color variants for this component
   * @returns {Array<string>}
   */
  colorVariants: Array<string> = IdsDropdownColorVariants;

  /**
   * Push color variant to the container element
   * @returns {void}
   */
  onColorVariantRefresh(): void {
    if (this.input) this.input.colorVariant = this.colorVariant;
    if (this.dropdownList) {
      this.dropdownList.colorVariant = this.colorVariant;
      if (this.dropdownList.popup) {
        this.dropdownList.popup.type = this.colorVariant !== null ? this.colorVariant : 'dropdown';
      }
    }
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
    <div class="ids-dropdown" part="container">
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
          class="ids-trigger-field-slot-trigger-end"
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
      ${value}
      tabindex="-1">
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
      'aria-controls': targetListboxId
    };

    this.dropdownList?.listBox?.setAttribute('id', targetListboxId);
    this.dropdownList?.listBox?.setAttribute('aria-label', `Listbox`);

    Object.keys(attrs).forEach((key: any) => this.setAttribute(key, attrs[key]));
    return this;
  }

  get input(): IdsTriggerField | null {
    return this.container?.querySelector<IdsTriggerField>('ids-trigger-field') ?? null;
  }

  get popup() {
    return this.dropdownList?.popup;
  }

  /**
   * Set the value of the dropdown using the value/id attribute if present
   * @param {string} value The value/id to use
   */
  set value(value: string | null) {
    value = (Array.isArray(value) ? value[0] : value) || String(value ?? '');
    const labels = this.labels;
    const label = String(value);
    if (labels.includes(label)) {
      value = this.optionValues[labels.indexOf(label)];
    }

    this.#syncInputTextWithOption(value);
  }

  /**
   * Get the current value of the dropdown
   * @returns {string | null} value
   */
  get value(): string | null {
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * Get all available option-values for the dropdown
   * @returns {string[]} value
   */
  get optionValues(): string[] {
    return this.options.map((item) => item.value ?? '');
  }

  /**
   * Get all availabe labels of the dropdown
   * @returns {string[]} value
   */
  get labels(): string[] {
    return this.options.map((item) => item.innerText ?? item.textContent ?? '');
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
   * @returns {IdsListBoxOption|null} Reference to a selected Listbox option if one is present
   */
  get selected(): IdsListBoxOption | null {
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
    return [...this.dropdownList?.listBox?.querySelectorAll<IdsListBoxOption>('ids-list-box-option') ?? []];
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
        this.input.readonly = true;
      }
      this.setAttribute(attributes.READONLY, 'true');
      return;
    }
    if (this.input) {
      this.input.disabled = false;
      this.input.cursor = 'pointer';
      this.input.readonlyBackground = true;
      this.input.readonly = false;
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

  /**
   * @returns {string | null} The max height value
   */
  get maxHeight(): string | null {
    return this.getAttribute(attributes.MAX_HEIGHT);
  }

  /**
   * Set the max height value
   * @param {string | number | null} value The value
   */
  set maxHeight(value: string | number | null) {
    const val = validMaxHeight(value);
    if (val) {
      this.setAttribute(attributes.MAX_HEIGHT, val);
    } else {
      this.removeAttribute(attributes.MAX_HEIGHT);
    }

    if (this.popup) this.popup.maxHeight = value;
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
   * @readonly
   * @returns {IdsIcon | null} currently-displayed IdsIcon in the trigger field, if applicable
   */
  get dropdownIconEl() {
    if (!this.input) return null;
    return this.input.querySelector<IdsIcon>('ids-icon[slot="trigger-start"]');
  }

  /**
   * Set the icon to be visible (if used)
   * @private
   * @param {HTMLElement} option the option to select
   */
  selectIcon(option: HTMLElement | undefined | null) {
    const dropdownIcon = this.dropdownIconEl;
    if (!dropdownIcon && !option) return;

    if (!this.hasIcons && !this.showListItemIcon) {
      if (dropdownIcon) dropdownIcon.remove();
      return;
    }

    const icon: any = option?.querySelector('ids-icon');
    if (!icon) return;

    if (!dropdownIcon) {
      if (this.showListItemIcon) this.generateIcon(icon.icon);
    } else {
      dropdownIcon.icon = icon?.icon;
    }
  }

  /**
   * Creates and appends the IdsIcon for the dropdown list's trigger button
   * @param {string} val name of the IdsIcon to use
   */
  private generateIcon(val: string) {
    if (!this.input) return;
    this.input.insertAdjacentHTML('beforeend', `<ids-icon slot="trigger-start" class="trigger-icon" icon="${val}"></ids-icon>`);
  }

  /**
   * Set the tooltip to be visible for the selected option
   * @private
   * @param {HTMLElement} option the option to select
   */
  selectTooltip(option: HTMLElement | undefined | null) {
    if (!option) return;

    const tooltip = option?.getAttribute('tooltip');
    if (tooltip) {
      this.tooltip = tooltip;
    } else {
      this.tooltip = option.textContent?.trim() || '';
    }

    if (this.tooltipEl) this.tooltipEl.target = option;
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
    if (!this.dropdownList?.popup || !this.trigger) return;

    this.dropdownList.removeTriggerEvents();
    this.dropdownList.appendToTargetParent();
    if (this.dropdownList?.popup) {
      this.dropdownList.popup.onOutsideClick = this.onOutsideClick.bind(this);
    }
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
    if (this.dropdownList?.popup) {
      this.dropdownList.popup.alignTarget = this.input?.fieldContainer || this.dropdownList || this;
    }

    // Configure inner IdsPopup
    const isRTL = this.localeAPI.isRTL();
    this.dropdownList.popup.align = `bottom, ${isRTL || ['lg', 'full'].includes(this.size) ? 'right' : 'left'}`;
    this.dropdownList.popup.alignEdge = 'bottom';

    if (this.input) this.dropdownList.value = this.input.value;
    if (this.#isMultiSelect) this.dropdownList.isMultiSelect = true;
  }

  onOutsideClick(e: Event) {
    if (this.dropdownList) {
      if (!e.composedPath()?.includes(this.dropdownList)) {
        this.close(true);
      }
    }
  }

  /**
   * Attach events for typeahead
   */
  #attachTypeaheadEvents() {
    this.onEvent('input.dropdown', this.input?.input, (e: any) => {
      if (this.typeahead) {
        this.#typeAhead(e.target?.value);
      } else {
        this.#selectMatch(e.target?.value);
      }
    });
  }

  /**
   * Open the dropdown list
   * @param {boolean} shouldSelect whether or not the input text should be selected
   */
  async open(shouldSelect = false) {
    if (!this.dropdownList || this.disabled || this.readonly) {
      return;
    }

    // Trigger an async callback for contents and refresh data
    if (typeof this.state.beforeShow === 'function') {
      const data = await this.state.beforeShow();
      if (data) {
        this.loadDataSet(data);
        if (this.typeahead) {
          this.optionsData = data;
        }
      }
    } else {
      this.setOptionsData();
    }

    if (this.value) {
      this.dropdownList.value = this.value;
    }

    // Open the Dropdown List
    this.configurePopup();
    this.dropdownList.setAttribute(htmlAttributes.ARIA_EXPANDED, 'true');
    this.dropdownList.removeAttribute(attributes.TABINDEX);
    this.dropdownList.show();

    if (this.input) this.input.active = true;

    // Focus and select input when typeahead is enabled
    if (this.typeahead) {
      this.#attachTypeaheadEvents();
      this.input?.removeAttribute(attributes.READONLY);
      this.input?.focus();
      this.searchField?.input?.focus();
      this.#connectSearchField();
    }

    if (shouldSelect) {
      this.input?.input?.select();
    }

    this.container?.classList.add('is-open');

    this.attachOpenEvents();

    this.triggerOpenEvent();
  }

  /**
   * Populate the DOM with the dataset
   * @param {IdsDropdownOptions} dataset The dataset to use with value, label ect...
   * @private
   */
  loadDataSet(dataset: IdsDropdownOptions) {
    let html = '';

    let listbox = this.dropdownList?.querySelector('ids-list-box') || this.querySelector('ids-list-box');
    if (listbox) listbox.innerHTML = '';

    if (!listbox) {
      listbox = document.createElement('ids-list-box');
      this.dropdownList?.insertAdjacentElement('afterbegin', listbox);
      this.dropdownList?.configureListBox();
      this.configureDropdownList();
    }

    dataset.forEach((option: IdsDropdownOption) => {
      html += this.#templateListBoxOption(this.#sanitizeOption(option));
    });
    listbox?.insertAdjacentHTML('afterbegin', html);
    this.dropdownList?.configureBlank();
    if (!this.#isMultiSelect) {
      const currentValue = this.getAttribute(attributes.VALUE);
      if (this.value !== currentValue) {
        this.value = currentValue;
      }
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

  set data(val: IdsDropdownOptions) {
    if (Array.isArray(val)) {
      this.optionsData = val;
      this.loadDataSet(val);
    }
  }

  get data(): IdsDropdownOptions {
    return this.optionsData;
  }

  /**
   * Close the dropdown popup
   * @param {boolean} noFocus if true do not focus on close
   */
  close(noFocus?: boolean) {
    this.removeOpenEvents();

    if (this.dropdownList) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      if (this.dropdownList?.popup?.visible) this.dropdownList.hide(!noFocus);
      if (this.input) this.input.active = false;
      this.dropdownList.setAttribute(attributes.TABINDEX, '-1');
      this.dropdownList.removeAttribute(htmlAttributes.ARIA_EXPANDED);
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
      (window.getSelection() as Selection).removeAllRanges();
      this.replaceTriggerIcon(this.dropdownIcon || 'dropdown');
    }

    this.container?.classList.remove('is-open');

    this.selectTooltip(this.selectedOption);

    this.triggerCloseEvent(noFocus);
  }

  /**
   * Toggle the dropdown list open/closed state
   * @param {boolean} shouldSelect whether or not the input text should be selected
   * @private
   */
  toggle(shouldSelect = false): void {
    if (!this.dropdownList) return;
    if (!this.dropdownList.popup?.visible) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

    const slot = this.container?.querySelector('slot');
    this.offEvent('slotchange.dropdown', slot);
    this.onEvent('slotchange.dropdown', slot, () => {
      this.configureDropdownList();
      if (this.value) this.#syncInputTextWithOption(this.value);
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

      const dropdownListVisible = !!this.dropdownList?.popup?.visible;
      if (dropdownListVisible) return;
      if (e.key === 'Enter' && !dropdownListVisible) return;
      if (e.key === ' ' && this.typeahead) return;

      this.openedByKeyboard = true;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
    if (!this.list) {
      this.offEvent('click.dropdown-input');
      this.onEvent('click.dropdown-input', this.input, (e) => {
        if (e instanceof MouseEvent) {
          this.dropdownList?.onTriggerClick?.(e);
        }
      });
    }

    // Respond to open/close events from an external IdsDropdownList component
    if (this.dropdownList) {
      this.offEvent('open.dropdown-list');
      this.offEvent('close.dropdown-list');
      this.onEvent('open.dropdown-list', this.dropdownList, async (e: CustomEvent) => {
        e.stopPropagation();
        await this.open();
      });
      this.onEvent('close.dropdown-list', this.dropdownList, (e: CustomEvent) => {
        e.stopPropagation();
        this.close(e.detail.operation === 'cancel');
      });
    }

    if (this.input?.fieldContainer) {
      this.offEvent('selected.dropdown-list');
      this.onEvent('selected.dropdown-list', this.input.fieldContainer, (e: CustomEvent) => {
        e.stopPropagation();
        this.value = e.detail.value;
        if (this.dropdownList?.popup?.visible) this.close();
        this.triggerSelectedEvent(e);
      });
    }

    this.offEvent('change.list', this.input);
    this.onEvent('change.list', this.input, () => {
      if (this.dropdownList?.popup?.visible && !this.typeahead) this.close();
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
      this.listen(['Enter'], this, (e: Event) => {
        if (!this.dropdownList?.popup?.visible) return;
        if (this.openedByKeyboard) {
          this.openedByKeyboard = false;
          return;
        }

        if (!this.selected) this.#selectFirstOption();
        const value = this.selected?.getAttribute(attributes.VALUE) || '';

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

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
    this.onEvent('keydown.dropdown-typeahead', this, (e: KeyboardEvent) => {
      const key = e.key || 'Space';
      if (['Backspace', 'Delete', 'Enter', 'Escape', 'Shift', 'Tab'].includes(key)) return;

      if (!this.dropdownList?.popup?.visible) {
        const doNotOpen = ['Alt', 'Backspace', 'CapsLock', 'Control', 'Delete', 'Enter', 'Escape', 'Meta', 'Shift', 'Tab'];
        if (doNotOpen.includes(key)) return;

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.open(true);
      }
    });

    // Handle up and down arrow
    this.listen(['ArrowDown', 'ArrowUp'], this, (e: KeyboardEvent) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      if (!this.dropdownList?.popup?.visible) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
   * Syncs selected option text with dropdown input
   * @param {string|null} value option value
   */
  #syncInputTextWithOption(value: string | null) {
    let selector = `ids-list-box-option[value="${value}"]`;
    if (value === ' ' || !value) {
      selector = `ids-list-box-option[value=""]:not([group-label]), ids-list-box-option:not([value]):not([group-label])`;
    }

    const listBoxOption = [...this.dropdownList?.listBox?.querySelectorAll<IdsListBoxOption>(selector) ?? []].at(0);
    if (!listBoxOption) {
      if (value) this.setAttribute(attributes.VALUE, String(value));
      return;
    }

    // NOTE: setAttribute() must be called here, before the internal input.value is set below
    this.setAttribute(attributes.VALUE, String(value));

    this.clearSelected();
    this.selectOption(listBoxOption);
    this.selectIcon(listBoxOption);
    this.selectTooltip(listBoxOption);
    if (this.input?.input) {
      const textContent = listBoxOption.textContent?.trim() ?? '';
      this.input.value = textContent;
      this.input.input.value = textContent;
    }
    this.state.selectedIndex = [...((listBoxOption?.parentElement as any)?.children || [])].indexOf(listBoxOption);
  }

  /**
   * Handle typeahead functionality
   * @param {string} text keydownend event detail keys
   * @returns {void}
   */
  #typeAhead(text: string) {
    const resultsArr = this.#findMatches(text);
    const results = resultsArr.map((item: IdsDropdownOption) => {
      const regex = new RegExp(text, 'gi');
      const optionText = item.groupLabel ? item.label : item.label?.replace(
        regex,
        (matched) => {
          if (matched) {
            return `<span class="highlight">${matched}</span>`;
          }
          return '';
        }
      );

      return this.#templateListBoxOption({
        ...item,
        label: optionText
      });
    }).join('');

    if (this.dropdownList) {
      if (this.dropdownList.listBox) {
        if (results) {
          this.dropdownList.listBox.innerHTML = results;
        } else {
          this.dropdownList.listBox.innerHTML = `<ids-list-box-option>${this.localeAPI.translate('NoResults')}</ids-list-box-option>`;
        }
      }

      // Change location of the popup after results are populated and the popup's height change
      this.dropdownList.popup?.place();
    }

    this.replaceTriggerIcon('search');

    // Remove selected input icon when start typing
    this.input?.querySelector('.trigger-icon')?.remove();
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
   * Helper to replace icon on the trigger button
   * @param {string} icon ids-icon icon value
   */
  replaceTriggerIcon(icon: string) {
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
  #templateListBoxOption(option: IdsDropdownOption): string {
    return `<ids-list-box-option
      ${this.#isMultiSelect ? 'class="multiselect-option multiselect-loaded"' : ''}
      ${!this.#isMultiSelect && option.icon ? 'class="icon-option"' : ''}
      ${option.id ? `id=${option.id}` : ''}
      ${option.value ? `value="${option.value}"` : ''}
      ${option.tooltip ? `tooltip="${option.tooltip}"` : ''}
      ${option.groupLabel ? 'group-label' : ''}>${option.icon ? `
        <ids-icon icon="${option.icon}"></ids-icon>
      ` : ''}${option.isCheckbox ? `
        <ids-checkbox no-margin no-animation class="justify-center multiselect-checkbox multiselect-loaded"${option.selected ? ' checked' : ''}></ids-checkbox><ids-text>${option.label || ''}</ids-text>
      ` : `<ids-text>${(option.label || '')}</ids-text>`}</ids-list-box-option>`;
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
    const groupLabels: Array<number> = this.optionsData.reduce(
      (result: Array<number>, option: IdsDropdownOption, index: number) => {
        if (option?.groupLabel) {
          return [...result, index];
        }

        return result;
      },
      []
    );
    const groupLabelIndex = this.#getGroupIndex(groupLabels, optionIndex);

    return this.optionsData[groupLabelIndex];
  }

  /**
   * Find matches between the input value and the dataset
   * @param {string} inputValue value of the input field
   * @returns {IdsDropdownOptions} containing matched values
   */
  #findMatches(inputValue: string): IdsDropdownOptions {
    return this.optionsData.reduce((options: Array<IdsDropdownOption>, option: IdsDropdownOption, index: number) => {
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
  setOptionsData() {
    this.optionsData = [...this.options].map((item) => ({
      id: item.id,
      label: item.textContent?.trim() || item.querySelector<IdsCheckbox>('ids-checkbox')?.label || '',
      value: item.getAttribute(attributes.VALUE) as string,
      icon: item.querySelector<IdsIcon>('ids-icon')?.icon,
      groupLabel: item.hasAttribute(attributes.GROUP_LABEL),
      isCheckbox: Boolean(item.querySelector<IdsCheckbox>('ids-checkbox')),
      selected: item.querySelector<IdsCheckbox>('ids-checkbox')?.checked,
    }));
  }

  #sanitizeOption(option: IdsDropdownOption): IdsDropdownOption {
    return ({
      ...option,
      id: this.xssSanitize(option?.id ?? '') as string,
      value: this.xssSanitize(option.value) as string,
      label: this.xssSanitize(option.label) as string,
      tooltip: this.xssSanitize(option.tooltip ?? '') as string
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
    if (this.dropdownList && this.value) {
      this.dropdownList.setAttribute(attributes.VALUE, this.value);
    }

    // sync size setting
    this.onSizeChange(this.size);

    // set dropdown list's popup to `fixed` if dropdown exists in popup component
    if (getClosest(this, 'ids-modal, ids-popup, ids-action-panel')) {
      this.dropdownList?.setAttribute(attributes.POSITION_STYLE, 'fixed');
    }

    if (getClosest(this, '.modal')) {
      this.dropdownList?.setAttribute(attributes.POSITION_STYLE, 'fixed');
      this.dropdownList?.popup?.setAttribute(attributes.OFFSET_CONTAINER, '.modal');
    }

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
    this.input?.setAttribute(attributes.SIZE, value || 'md');
  }

  /**
   * Set typeahead attribute
   * @param {string | boolean | null} value typeahead value
   */
  set typeahead(value: string | boolean | null) {
    const val = stringToBool(value);

    if (val) {
      this.setAttribute(attributes.TYPEAHEAD, String(val));
      this.container?.classList.add('typeahead');
      this.setOptionsData();
    } else {
      this.setAttribute(attributes.TYPEAHEAD, 'false');
      this.input?.setAttribute(attributes.READONLY, 'true');
      this.container?.classList.remove('typeahead');
    }
  }

  /**
   * Get the typeahead attribute
   * @returns {boolean} typeahead attribute value converted to boolean
   */
  get typeahead(): boolean {
    return this.hasAttribute(attributes.TYPEAHEAD) ? stringToBool(this.getAttribute(attributes.TYPEAHEAD)) : true;
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

  /**
   * Triggers a `selected` event that propagates to the target element (usually an IdsDropdown)
   * @param {CustomEvent} [e] optional event handler to pass arguments
   * @returns {void}
   */
  private triggerSelectedEvent(e?: CustomEvent): void {
    let args: any;
    if (e) args = e;
    else {
      args = {
        bubbles: true,
        detail: {
          elem: this,
          label: this.selected?.textContent,
          value: this.value,
        }
      };
    }
    this.dispatchEvent(new CustomEvent('selected', args));
  }

  private triggerOpenEvent() {
    this.triggerEvent('open', this, {
      bubbles: true,
      detail: {
        elem: this
      }
    });
  }

  private triggerCloseEvent(doCancel?: boolean) {
    this.triggerEvent('close', this, {
      bubbles: true,
      detail: {
        elem: this,
        operation: doCancel ? 'cancel' : 'default'
      }
    });
  }

  onDropdownIconChange(val: string | null) {
    if (typeof val === 'string' && val.length) {
      this.replaceTriggerIcon(this.dropdownIcon || 'dropdown');
      if (this.dropdownList) this.dropdownList.dropdownIcon = this.dropdownIcon;
    }
  }

  onShowListItemIcon(val: boolean) {
    if (!val) this.dropdownIconEl?.remove();
  }

  onTooltipTargetDetection(): HTMLElement | SVGElement {
    if (this.dropdownList?.visible) {
      return this.dropdownList?.lastHovered || this;
    }
    return this.input?.fieldContainer || this;
  }

  canTooltipShow(tooltipEl: IdsTooltip, tooltipContent: string) {
    if (this.dropdownList?.visible) {
      return this.dropdownList?.canTooltipShow(tooltipEl, tooltipContent);
    }
    if (tooltipContent) {
      if (tooltipContent !== this.input?.value?.trim()) return true;
      return checkOverflow(this.input?.input) || false;
    }
    return false;
  }

  get searchField(): IdsSearchField | null {
    return this.popup?.querySelector('ids-search-field') || null;
  }

  /**
   * Attaches IdsSearchField component to the typeahead functionality
   */
  #connectSearchField() {
    if (this.searchField) {
      this.searchField.onSearch = (value: string) => {
        this.#typeAhead(value);
      };
    }
  }
}

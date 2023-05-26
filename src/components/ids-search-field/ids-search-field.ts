import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';

import '../ids-trigger-field/ids-trigger-button';
import '../ids-input/ids-input';
import '../ids-icon/ids-icon';
import '../ids-menu-button/ids-menu-button';
import '../ids-popup-menu/ids-popup-menu';

import styles from './ids-search-field.scss';

const DEFAULT_LABEL = 'Search';
const DEFAULT_PLACEHOLDER = 'Type to search';

/**
 * IDS Search Field Component
 * @type {IdsSearchField}
 * @inherits IdsElement
 */
@customElement('ids-search-field')
@scss(styles)
export default class IdsSearchField extends IdsTriggerField {
  constructor() {
    super();
  }

  isFormComponent = true;

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate', 'app-menu', 'card'];

  /**
   * Inherited from `IdsColorVariantMixin`. If the Color Variant on Search Fields are changed,
   * switch trigger buttons to the "alternate" style instead of an `app-menu` style.
   * @param {string} variantName the new color variant being applied to the Search Field
   */
  onColorVariantRefresh(variantName?: string) {
    let btnVariantName = variantName || '';
    if (variantName === 'app-menu') {
      btnVariantName = 'alternate';
    }
    const adjustBtnVariant = (btn: any) => {
      btn.setAttribute(attributes.COLOR_VARIANT, btnVariantName);
    };

    this.buttons.forEach(adjustBtnVariant);
    if (this.fieldContainer) {
      [...this.fieldContainer.querySelectorAll('ids-trigger-button')].forEach(adjustBtnVariant);
    }
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.CATEGORY,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
    this.#attachKeyboardListener();

    if (!this.placeholder) {
      this.placeholder = DEFAULT_PLACEHOLDER;
    }
    if (!this.label) {
      this.label = DEFAULT_LABEL;
    }
  }

  template(): string {
    this.templateHostAttributes();
    const {
      ariaLabel,
      containerClass,
      inputClass,
      inputState,
      labelHtml,
      placeholder,
      type,
      value
    } = this.templateVariables();

    const searchIcon = `<ids-icon class="ids-icon search-icon starting-icon" size="medium" icon="search"></ids-icon>`;

    return `<div id="ids-search-field" class="ids-search-field ids-trigger-field ${containerClass}" part="container">
      ${labelHtml}
      <div class="fieldset">
        <div class="field-container" part="field-container">
          ${this.categories.length ? '' : searchIcon}
          <slot name="trigger-start"></slot>
          ${this.templateCategoriesMenu()}
          <input
            part="input"
            id="${this.id}-input"
            ${type}${inputClass}${placeholder}${inputState}
            ${ariaLabel}
            ${value}
            ></input>
          <slot name="trigger-end"></slot>
        </div>
        ${this.templateCategoriesButton()}
      </div>
      ${this.autocomplete ? `
        <ids-popup
          type="menu"
          align="bottom, left"
          align-target="#${this.id}-input"
          part="popup"
        >
          <ids-list-box slot="content"></ids-list-box>
        </ids-popup>` : ''}
    </div>`;
  }

  templateCategoriesButton(): string {
    if (!this.action) return ``;

    return `
      <ids-button id="category-action-button" appearance="secondary">
        <span>${this.action}</span>
      </ids-button>
    `;
  }

  templateCategoriesMenu(): string {
    if (!this.categories.length) return ``;

    const menuButtonText = this.category
      ? `<span>${this.category}</span>`
      : `<span class="audible">Select Search Category</span>`;

    return `
      <ids-menu-button id="menu-button" appearance="tertiary" menu="category-menu" icon="search" dropdown-icon>
        ${menuButtonText}
      </ids-menu-button>
      <ids-popup-menu id="category-menu" target="menu-button" trigger-type="click" align="bottom, right">
        <ids-menu-group select="${this.multiple ? 'multiple' : 'single'}" keep-open="true">
          ${this.categories.map((category, idx) => `<ids-menu-item value="${idx}">${category}</ids-menu-item>`).join('')}
        </ids-menu-group>
      </ids-popup-menu>
    `;
  }

  #updateCategoriesMenu() {
    const category = this.category;
    const menuButton = this.#categoriesMenuButton;
    if (!category || !menuButton) return;

    const selectedCategories = this.selectedCategories;

    if (selectedCategories.length === 1) {
      menuButton.text = selectedCategories[0];
    } else if (selectedCategories.length > 1) {
      menuButton.text = `${selectedCategories.length} ${this.localeAPI?.translate?.('Selected')}`;
    } else {
      menuButton.text = category;
    }

    const popup = this.#categoriesPopup?.popup;
    const popupWidth = parseInt(popup?.style?.getProperty?.('min-width') ?? 155);
    const popupMinWidth = this.#categoriesMenuButton?.getBoundingClientRect().width ?? popupWidth;
    popup?.style?.setProperty?.('min-width', `${Math.max(popupMinWidth, popupWidth)}px`);

    if (!this.multiple) {
      this.#categoriesPopup?.hide?.();
    }
  }

  get #categoriesPopup(): any {
    return this.shadowRoot?.querySelector('ids-popup-menu');
  }

  get #categoriesMenuButton(): any {
    return this.shadowRoot?.querySelector('ids-menu-button');
  }

  get #categoriesActionButton(): any {
    return this.shadowRoot?.querySelector('ids-button#category-action-button');
  }

  #categories: string[] = [];

  /**
   * @returns {string[]} returns an array of all the categories that appear in the category dropdown
   */
  get categories(): string[] { return this.#categories; }

  /**
   * @param {string[]} value = sets a list of categories that should appear in the category dropdown
   */
  set categories(value: string[]) {
    this.#categories = value;
    this.#rerender();
  }

  /**
   * @param {string} value - sets the initial text that appears in the categories dropdown menu
   */
  set category(value: string) {
    if (value) {
      this.setAttribute(attributes.CATEGORY, value);
    } else {
      this.removeAttribute(attributes.CATEGORY);
    }
    this.#rerender();
  }

  /**
   * @returns {string} - gets the initial text that appears in the categories dropdown menu
   */
  get category(): string {
    return this.getAttribute(attributes.CATEGORY) ?? '';
  }

  /**
   * @returns {string[]} returns an array of the currently selected categories
   */
  get selectedCategories(): string[] {
    const categories = this.categories;
    const selectedValues = this.#categoriesPopup?.getSelectedValues?.() ?? [];
    const selectedCategories = selectedValues.map((categoryKey: number) => categories[categoryKey]);
    return selectedCategories;
  }

  /**
   * @param {string} value - sets title on the search field action-button
   */
  set action(value: string) {
    if (value) {
      this.setAttribute(attributes.ACTION, value);
    } else {
      this.removeAttribute(attributes.ACTION);
    }
    this.#rerender();
  }

  /**
   * @returns {string} - gets the title that appears on the search field action-button
   */
  get action(): string {
    return this.getAttribute(attributes.ACTION) ?? '';
  }

  /**
   * @param {boolean} value - allows multiple categories to be selected
   */
  set multiple(value: boolean) {
    if (value) {
      this.setAttribute(attributes.MULTIPLE, '');
    } else {
      this.removeAttribute(attributes.MULTIPLE);
    }
  }

  /**
   * @returns {boolean} determines whether multiple categories to be selected or not
   */
  get multiple(): boolean {
    return this.hasAttribute(attributes.MULTIPLE);
  }

  /**
   * Programmatically sets the search field's value and performs an optional search function
   * @param {any} val the incoming value to search for
   * @returns {Array<any>} containing search results, if applicable
   */
  async search(val: any): Promise<any> {
    let ret: any = [];
    const safeVal: any = stripHTML(val);
    if (this.#previousSearchValue !== safeVal) {
      if (this.input) this.input.value = safeVal;
      this.#previousSearchValue = safeVal;

      if (typeof this.onSearch === 'function') {
        ret = await this.onSearch(safeVal);
      }
    }
    return ret;
  }

  /**
   * @param {string} val the new value to set
   */
  set value(val: string) {
    super.value = val;

    const newValue = super.value;
    this.#previousSearchValue = newValue;

    if (typeof this.onSearch === 'function') {
      this.onSearch(newValue);
    }
  }

  get value(): string {
    return super.value;
  }

  /**
   * Define this method to carry out search functionality
   * (override this method when implementing an IdsSearchField).
   * @param {any} [val] the value to be searched for
   * @returns {Array<any>} containing matching search results
   */
  onSearch(val: any = undefined): any {
    return [`${stripHTML(val)}`];
  }

  /**
   * @param {any} value
   */
  #previousSearchValue: any = null;

  /**
   * Adds Search Field specific event handlers
   */
  #attachEventHandlers() {
    const handleSearchEvent = (e: any) => {
      this.search(e.target?.value);
    };

    this.offEvent('change', this.input);
    this.onEvent('change', this.input, handleSearchEvent);

    this.offEvent('input', this.input);
    this.onEvent('input', this.input, handleSearchEvent);

    this.offEvent('click', this.#categoriesActionButton);
    this.onEvent('click', this.#categoriesActionButton, () => {
      this.search(this.value);
      this.#triggerCategoriesEvent('search');
    });

    this.offEvent('selected', this.#categoriesPopup);
    this.onEvent('selected', this.#categoriesPopup, () => {
      this.#updateCategoriesMenu();
      this.#triggerCategoriesEvent('selected');
    });

    this.offEvent('deselected', this.#categoriesPopup);
    this.onEvent('deselected', this.#categoriesPopup, () => {
      this.#updateCategoriesMenu();
      this.#triggerCategoriesEvent('deselected');
    });
  }

  /**
   * Listen for enter key to perform search function
   */
  #attachKeyboardListener() {
    this.offEvent('keydown', this.input);
    this.onEvent('keydown', this.input, (event: any) => {
      const shouldSearchOnReturn = !event?.path?.length || !event.path[0].classList || !event.path[0].classList.contains('ids-icon-button');
      if (['Enter'].indexOf(event.code) > -1 && shouldSearchOnReturn) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'Enter':
          if (shouldSearchOnReturn) {
            this.onSearch(this.input?.value);
            this.#triggerCategoriesEvent('search');
          }
          break;
        default:
          break;
      }
    });
  }

  /**
   * Helper to trigger CustomEvent for various event-types
   * @param {'input' | 'search' | 'deselected' | 'selected'} eventType - the type of event to trigger
   */
  #triggerCategoriesEvent(eventType: 'input' | 'search' | 'deselected' | 'selected') {
    this.triggerEvent(eventType, this, {
      detail: {
        elem: this,
        categories: this.categories,
        categoriesSelected: this.selectedCategories,
        value: this.value,
      },
      bubbles: true,
      cancelable: false,
      composed: false
    });
  }

  #rerender() {
    if (this.container) {
      this.container.innerHTML = this.template();
      this.connectedCallback();
    }
  }
}

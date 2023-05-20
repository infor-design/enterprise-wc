import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

// import IdsPickerPopup from '../ids-picker-popup/ids-picker-popup';
// import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';

// import '../ids-picker-popup/ids-picker-popup';
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
          ${this.templateCategories()}
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

  templateCategories(): string {
    if (!this.categories.length) return ``;

    const menuButtonText = this.category
      ? `<span>${this.category}</span>`
      : `<span class="audible">Icon Only Button</span>`;

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

  get selectedCategories(): string[] {
    const categories = this.categories;
    const selectedValues = this.#categoriesPopup?.getSelectedValues?.() ?? [];
    const selectedCategories = selectedValues.map((categoryKey: number) => categories[categoryKey]);
    return selectedCategories;
  }

  #updateMenuButton() {
    const category = this.category;
    const menuButton = this.#categoriesMenuButton;
    if (!category || !menuButton) return;

    const selectedValues = this.#categoriesPopup?.getSelectedValues?.() ?? [];
    // const selectedCategories = this.selectedCategories;

    if (selectedValues.length === 1) {
      const categoryKey = selectedValues[0];
      menuButton.text = this.categories[categoryKey];
    } else if (selectedValues.length > 1) {
      menuButton.text = `${selectedValues.length} [Selected]`;
    } else {
      menuButton.text = category;
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

  get categories(): string[] { return this.#categories; }

  set categories(value: string[]) { this.#categories = value; }

  set category(value: string) {
    if (value) {
      this.setAttribute(attributes.CATEGORY, value);
    } else {
      this.removeAttribute(attributes.CATEGORY);
    }
  }

  get category(): string {
    return this.getAttribute(attributes.CATEGORY) ?? '';
  }

  set action(value: string) {
    if (value) {
      this.setAttribute(attributes.ACTION, value);
    } else {
      this.removeAttribute(attributes.ACTION);
    }
  }

  get action(): string {
    return this.getAttribute(attributes.ACTION) ?? '';
  }

  set multiple(value: boolean) {
    if (value) {
      this.setAttribute(attributes.MULTIPLE, '');
    } else {
      this.removeAttribute(attributes.MULTIPLE);
    }
  }

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
      this.search(e.target.value);
    };

    this.onEvent('change', this.input, handleSearchEvent);
    this.onEvent('input', this.input, handleSearchEvent);

    this.onEvent('selected', this.#categoriesPopup, () => this.#updateMenuButton());
    this.onEvent('deselected', this.#categoriesPopup, () => this.#updateMenuButton());

    this.onEvent('click', this.#categoriesActionButton, () => {
      this.triggerEvent('search', this, {
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
    });
  }

  /**
   * Listen for enter key to perform search function
   */
  #attachKeyboardListener() {
    this.onEvent('keydown', this.input, (event: any) => {
      const shouldSearchOnReturn = !event?.path?.length || !event.path[0].classList || !event.path[0].classList.contains('ids-icon-button');
      if (['Enter'].indexOf(event.code) > -1 && shouldSearchOnReturn) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'Enter':
          if (shouldSearchOnReturn) {
            this.onSearch(this.input?.value);
          }
          break;
        default:
          break;
      }
    });
  }
}

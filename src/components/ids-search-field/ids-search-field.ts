import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';

import '../ids-trigger-field/ids-trigger-button';
import '../ids-input/ids-input';
import '../ids-icon/ids-icon';

import styles from './ids-search-field.scss';

const DEFAULT_LABEL = 'Search';
const DEFAULT_PLACEHOLDER = 'Type to search';

/**
 * IDS Search Field Component
 * @type {IdsSearchField}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsColorVariantMixin
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

    return `<div id="ids-search-field" class="ids-search-field ids-trigger-field ${containerClass}" part="container">
      ${labelHtml}
      <div class="field-container" part="field-container">
        <ids-icon class="ids-icon search-icon starting-icon" size="medium" icon="search"></ids-icon>
        <slot name="trigger-start"></slot>
        <input
          part="input"
          id="${this.id}-input"
          ${type}${inputClass}${placeholder}${inputState}
          ${ariaLabel}
          ${value}
          ></input>
        <slot name="trigger-end"></slot>
      </div>
      ${this.autocomplete ? `
        <ids-popup
          type="dropdown"
          align="bottom, left"
          align-target="#${this.id}-input"
          part="popup"
        >
          <ids-list-box slot="content"></ids-list-box>
        </ids-popup>` : ''}
    </div>`;
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

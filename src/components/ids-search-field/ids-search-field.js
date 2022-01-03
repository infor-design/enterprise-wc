import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';

import Base from './ids-search-field-base';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import IdsInput from '../ids-input/ids-input';
import IdsIcon from '../ids-icon/ids-icon';

import styles from '../ids-input/ids-input.scss';

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
export default class IdsSearchField extends Base {
  DEFAULT_LABEL = DEFAULT_LABEL;

  DEFAULT_PLACEHOLDER = DEFAULT_PLACEHOLDER;

  constructor() {
    super();
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate', 'app-menu'];

  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.LABEL,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.VALUE,
    ];
  }

  connectedCallback() {
    this.#attachEventHandlers();
    this.#attachKeyboardListener();
    super.connectedCallback();
  }

  template() {
    this.templateHostAttributes();
    const {
      containerClass,
      inputClass,
      inputState,
      labelHtml,
      placeholder,
      type
    } = this.templateVariables();

    return (
      `<div id="ids-search-field" class="ids-search-field ids-trigger-field ${containerClass}" part="container">
        ${labelHtml}
        <div class="field-container" part="field-container">
          <ids-icon class="ids-icon search-icon" size="medium" icon="search"></ids-icon>
          <slot name="trigger-start"></slot>
          <input
            part="input"
            id="${this.id}-input"
            ${type}${inputClass}${placeholder}${inputState}
            ${this.getAttribute(attributes.LABEL_HIDDEN) && this.label ? `aria-label="${this.label}"` : ''}
            ${this.hasAttribute(attributes.VALUE) ? ` value="${this.getAttribute(attributes.VALUE)}" ` : ''}
            ></input>
          <slot name="trigger-end"></slot>
        </div>
      </div>`
    );

    /*
    return `
      <div
        class="ids-search-field"
        id="ids-search-field"
      >
        <ids-trigger-field
          tabbable="false"
          label="${this.label}"
          ${this.disabled && 'disabled'}
          ${this.readonly && 'readonly'}
          no-margins
        >
          <ids-icon part="search-icon" class="search-icon" size="medium" icon="search"></ids-icon>
          <ids-input
            color-variant="${this.colorVariant}"
            ${!this.readonly && !this.disabled && 'clearable'}
            ${this.readonly && 'readonly'}
            value="${this.value}"
            placeholder="${this.placeholder}"
          >
          </ids-input>
      </div>
    `;
    */
  }

  /**
   * Programmatically sets the search field's value and performs an optional search function
   * @param {any} val the incoming value to search for
   * @returns {Array<any>} containing search results, if applicable
   */
  async search(val) {
    let ret = [];
    const safeVal = stripHTML(val);

    if (this.#previousSearchValue !== safeVal) {
      this.#previousSearchValue = safeVal;
      if (this.input) {
        this.input.value = safeVal;
      }
      if (typeof this.onSearch === 'function') {
        ret = await this.onSearch(safeVal);
      }
    }
    return ret;
  }

  /**
   * Define this method to carry out search functionality
   * (override this method when implementing an IdsSearchField).
   * @param {any} [val] the value to be searched for
   * @returns {Array<any>} containing matching search results
   */
  onSearch(val = undefined) {
    return [`${stripHTML(val)}`];
  }

  /**
   * @param {any} value
   */
  #previousSearchValue = null;

  /**
   * Adds Search Field specific event handlers
   */
  #attachEventHandlers() {
    const handleSearchEvent = (e) => {
      if (this.#previousSearchValue !== e.target.value) {
        this.value = e.target.value;
        this.#previousSearchValue = this.value;
        if (typeof this.onSearch === 'function') {
          this.onSearch(this.value);
        }
      }
    };

    this.onEvent('change', this.input, handleSearchEvent);
    this.onEvent('input', this.input, handleSearchEvent);
  }

  /**
   * Listen for enter key to perform search function
   */
  #attachKeyboardListener() {
    this.onEvent('keydown', this.input, (event) => {
      const shouldSearchOnReturn = !event?.path?.length || !event.path[0].classList || !event.path[0].classList.contains('ids-icon-button');
      if (['Enter'].indexOf(event.code) > -1 && shouldSearchOnReturn) {
        event.preventDefault();
      }

      switch (event.key) {
      case 'Enter':
        if (shouldSearchOnReturn) {
          this.onSearch(this.input.value);
        }
        break;
      default:
        break;
      }
    });
  }
}

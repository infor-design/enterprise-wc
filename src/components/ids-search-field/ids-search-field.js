import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

import Base from './ids-search-field-base';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import IdsInput from '../ids-input/ids-input';
import IdsIcon from '../ids-icon/ids-icon';

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
export default class IdsSearchField extends Base {
  DEFAULT_LABEL = DEFAULT_LABEL;

  DEFAULT_PLACEHOLDER = DEFAULT_PLACEHOLDER;

  input;

  triggerField;

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
    this.input = this.container.querySelector('ids-input');
    this.triggerField = this.container.querySelector('ids-trigger-field');

    this.#attachEventHandlers();
    this.#attachKeyboardListener();
    super.connectedCallback();
  }

  template() {
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
  }

  /**
   * Set the color variant to alternate or default style
   */
  set colorVariant(value) {
    super.colorVariant = value;
    this.container.querySelector('ids-input').colorVariant = value;
  }

  get colorVariant() {
    return super.colorVariant;
  }

  /**
   * Sets the value inside the input
   * @param {string} value The input value
   */
  set value(value) {
    this.setAttribute(attributes.VALUE, value);
    this.search(value);
  }

  get value() {
    return this.getAttribute(attributes.VALUE) || '';
  }

  /**
   * Set the placeholder text inside the input
   * @param {string} value The placeholder text
   */
  set placeholder(value) {
    this.setAttribute(attributes.PLACEHOLDER, value);

    if (this.input) {
      this.input.placeholder = value;
    }
  }

  get placeholder() {
    const a = this.getAttribute(attributes.PLACEHOLDER);
    if (typeof a === 'string') {
      return this.getAttribute(attributes.PLACEHOLDER);
    }
    return DEFAULT_PLACEHOLDER;
  }

  /**
   * Set the label text that rests above the input field
   * @param {string} value The name for the label
   */
  set label(value) {
    this.setAttribute(attributes.LABEL, value);

    if (this.input) {
      this.triggerField.label = value;
    }
  }

  get label() {
    const a = this.getAttribute(attributes.LABEL);
    if (typeof a === 'string') {
      return this.getAttribute(attributes.LABEL);
    }
    return DEFAULT_LABEL;
  }

  /**
   * Sets the input state to disabled so the field is uneditable or accessible through tabbing
   * @param {boolean} value True or False
   */
  set disabled(value) {
    const val = stringToBool(value);
    this.setAttribute(attributes.DISABLED, val);
    this.triggerField.disabled = val;
    this.input.disabled = val;
  }

  get disabled() {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Sets the input state to readonly so the field is uneditable but accessible through tabbing
   */
  set readonly(value) {
    const val = stringToBool(value);
    this.setAttribute(attributes.READONLY, val);
    this.input.readonly = val;
    this.triggerField.readonly = val;
  }

  get readonly() {
    return stringToBool(this.getAttribute(attributes.READONLY));
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

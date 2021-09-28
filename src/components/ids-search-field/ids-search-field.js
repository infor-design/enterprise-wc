import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

import {
  IdsEventsMixin,
  IdsThemeMixin,
  IdsKeyboardMixin,
  IdsColorVariantMixin
} from '../../mixins';

import { IdsStringUtils } from '../../utils';

import styles from './ids-search-field.scss';

import IdsTriggerField from '../ids-trigger-field';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import IdsInput from '../ids-input';
import IdsIcon from '../ids-icon';

const appliedMixins = [
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin,
  IdsColorVariantMixin
];

/**
 * IDS Search Field Component
 * @type {IdsSearchField}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsColorVariantMixin
 */

const DEFAULT_LABEL = 'Search';
const DEFAULT_PLACEHOLDER = 'Type to search';

@customElement('ids-search-field')
@scss(styles)
class IdsSearchField extends mix(IdsElement).with(...appliedMixins) {
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
  colorVariants = ['alternate'];

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
          <ids-icon class="search-icon" size="medium" icon="search"></ids-icon>
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

    /* istanbul ignore else */
    if (this.input) {
      this.input.value = value;
    }
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

    /* istanbul ignore else */
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

    /* istanbul ignore else */
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
    const val = IdsStringUtils.stringToBool(value);
    this.setAttribute(attributes.DISABLED, val);
    this.triggerField.disabled = val;
    this.input.disabled = val;
  }

  get disabled() {
    return IdsStringUtils.stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Sets the input state to readonly so the field is uneditable but accessible through tabbing
   */
  set readonly(value) {
    const val = IdsStringUtils.stringToBool(value);
    this.setAttribute(attributes.READONLY, val);
    this.input.readonly = val;
    this.triggerField.readonly = val;
  }

  get readonly() {
    return IdsStringUtils.stringToBool(this.getAttribute(attributes.READONLY));
  }

  /**
   * TODO: search function that gets triggered upon 'Enter' key or clicking the trigger button
   */
  #searchFunction() {
    // const searchParam = this.value;
    // query the searchParm in some list/database
  }

  #attachEventHandlers() {
    this.onEvent('change', this.input, (e) => {
      this.value = e.target.value;
      // TODO: pop up autocomplete suggestions
    });

    this.onEvent('input', this.input, (e) => {
      this.value = e.target.value;
      // TODO: pop up autocomplete suggestions
    });

    // this.onEvent('click', this.triggerButton, () => {
    //   this.#searchFunction();
    // });
  }

  /**
   * Listen for enter key to perform search function
   */
  #attachKeyboardListener() {
    this.onEvent('keydown', this.input, (event) => {
      /* istanbul ignore next */
      if (['Enter'].indexOf(event.code) > -1) {
        event.preventDefault();
      }

      switch (event.key) {
      case 'Enter':
        this.#searchFunction();
        break;
      default:
        break;
      }
    });
  }
}

export default IdsSearchField;

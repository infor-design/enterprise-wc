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
];

/**
 * IDS Search Field Component
 * @type {IdsSearchField}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 */

@customElement('ids-search-field')
@scss(styles)
class IdsSearchField extends mix(IdsElement).with(...appliedMixins) {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.VALUE,
      attributes.PLACEHOLDER,
      // attributes.ID,
      // attributes.COMPACT,
      attributes.DISABLED,
      // attributes.LABEL,
      // attributes.LABEL_HIDDEN,
      // attributes.LABEL_REQUIRED,
      // attributes.MODE,
      // attributes.SIZE,
      attributes.READONLY,
      // attributes.TEXT_ALIGN,
      // attributes.TEXT_ELLIPSIS,
      // attributes.TRIGGERFIELD,
      // attributes.TYPE,
      // attributes.VALUE,
      // attributes.VERSION
    ];
  }

  input;

  triggerButton;

  triggerButtonIcon;

  triggerField;

  connectedCallback() {
    this.input = this.container.querySelector('ids-input');
    this.triggerField = this.container.querySelector('ids-trigger-field');
    this.triggerButton = this.container.querySelector('ids-trigger-button');
    // this.triggerButtonIcon = this.container.querySelector('ids-trigger-button ids-icon');

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
        >
          <ids-icon class="search-icon" size="medium" icon="search"></ids-icon>
          <ids-input
            ${!this.readyonly && !this.disabled && 'clearable'}
            ${this.readonly && 'readonly'}
            value="${this.value}"
            placeholder="${this.placeholder}"
          >
          </ids-input>
            <ids-trigger-button>
            <ids-text audible="true">Search trigger</ids-text>
            <ids-icon slot="icon" icon="arrow-right" size="medium"></ids-icon>
            </ids-trigger-button>
        </ids-trigger-field>
      </div>
    `;
  }


  set value(value) {
    this.setAttribute(attributes.VALUE, value);

    if (this.input) {
      this.input.value = value;
    }
  }

  get value() {
    return this.getAttribute(attributes.VALUE) || '';
  }

  set placeholder(value) {
    this.setAttribute(attributes.PLACEHOLDER, value);

    if (this.input) {
      this.input.placeholder = value;
    }
  }

  get placeholder() {
    return this.getAttribute(attributes.PLACEHOLDER) || 'Type to search';
  }

  set label(value) {
    this.setAttribute(attributes.LABEL, value);

    if (this.input) {
      this.triggerField.label = value;
    }
  }

  get label() {
    return this.getAttribute(attributes.LABEL) || 'Search';
  }

  set disabled(value) {
    const val = IdsStringUtils.stringToBool(value);
    this.setAttribute(attributes.DISABLED, val);
    this.triggerField.disabled = val;
    this.input.disabled = val;
  }

  get disabled() {
    return IdsStringUtils.stringToBool(this.getAttribute(attributes.DISABLED));
  }

  set readonly(value) {
    const val = IdsStringUtils.stringToBool(value);
    this.setAttribute(attributes.READONLY, val);
    this.input.readonly = val;
    this.triggerField.readonly = val;
  }

  get readonly() {
    return IdsStringUtils.stringToBool(this.getAttribute(attributes.READONLY));
  }

  #searchFunction() {
    // TODO: query something, probably
    // const searchParam = this.value;
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

    this.onEvent('click', this.triggerButton, (e) => {
      this.#searchFunction();
    });
  }

  #attachKeyboardListener() {
    this.onEvent('keydown', this.input, (event) => {
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

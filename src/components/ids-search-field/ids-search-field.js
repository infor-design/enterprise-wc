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
  IdsClearableMixin,
} from '../../mixins';

import { IdsStringUtils } from '../../utils';

import styles from './ids-search-field.scss';

import IdsTriggerField from '../ids-trigger-field';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import IdsInput from '../ids-input';
import IdsIcon from '../ids-icon';

const appliedMixins = [
  IdsEventsMixin,
  IdsThemeMixin,
  IdsKeyboardMixin,
  IdsClearableMixin
];

/**
 * IDS Search Field Component
 * @type {IdsSearchField}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsClearableMixin
 */

@customElement('ids-search-field')
@scss(styles)
class IdsSearchField extends mix(IdsElement).with(...appliedMixins) {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...attributes.VALUE,
      attributes.PLACEHOLDER,
      attributes.ID,
      // and other ids-input settings
      // attributes.BG_TRANSPARENT,
      // attributes.CLEARABLE,
      // attributes.CLEARABLE_FORCED,
      // attributes.COMPACT,
      attributes.DISABLED,
      // attributes.FIELD_HEIGHT,
      // attributes.LABEL,
      // attributes.LABEL_HIDDEN,
      // attributes.LABEL_REQUIRED,
      // attributes.ID,
      // attributes.MODE,
      // attributes.PLACEHOLDER,
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
    // this.triggerButton = this.container.querySelector('ids-trigger-button');
    // this.triggerButtonIcon = this.container.querySelector('ids-trigger-button ids-icon');

    this.#attachEventHandlers();
    this.#attachKeyboardListener();
    super.connectedCallback();

    console.log(this.attributes)
  }

  template() {
    return `
      <div class="ids-search-field">
        <ids-trigger-field
          id="${this.id}"
          label="Search Field"
          tabbable="false"
          ${this.disabled && 'disabled'}
        >
          <ids-icon class="search-icon" size="medium" icon="search"></ids-icon>
          <ids-input
            clearable="${this.clearable}"
            value="${this.value}"
            placeholder="Search"
            readonly="${this.readonly}"
          >
          </ids-input>
        </ids-trigger-field>
      </div>
    `;
  }

//   <ids-trigger-button disabled>
//   <ids-text audible="true">Search trigger</ids-text>
//   <ids-icon slot="icon" icon="search" size="medium"></ids-icon>
// </ids-trigger-button>

  set value(value) {
    this.setAttribute(attributes.VALUE, value);

    if (this.input) {
      this.input.value = value;
    }
  }

  get value() {
    // console.log('getting value ' + this.getAttribute(attributes.VALUE));
    return this.getAttribute(attributes.VALUE) || '';
  }

  set clearable(value) {
    const val = IdsStringUtils.stringToBool(value);
    this.setAttribute(attributes.CLEARABLE, val);
    this.input.clearable = val;
  }

  get clearable() {
    return IdsStringUtils.stringToBool(this.getAttribute(attributes.CLEARABLE));
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
  }

  get readonly() {
    return IdsStringUtils.stringToBool(this.getAttribute(attributes.READONLY));
  }

  #searchFunction() {
    console.log('some search function');
  }

  #attachEventHandlers() {
    this.onEvent('change', this.input, (e) => {
      this.value = e.target.value;
      // search function
    });

    this.onEvent('input', this.input, (e) => {
      this.value = e.target.value;
      // pop up autocomplete suggestions
    });

    // this.onEvent('keydown', this.input, (e) => {
    //   this.value = e.target.value;
    //   // pop up autocomplete suggestions
    // });

    // key press
    // on change
    // search (enter or finish typing)
  }

  #attachKeyboardListener() {
    this.onEvent('keydown', this, (event) => {
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

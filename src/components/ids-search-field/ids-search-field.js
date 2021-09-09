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
 */

@customElement('ids-search-field')
@scss(styles)
class IdsSearchField extends mix(IdsElement).with(...appliedMixins) {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      attributes.VALUE,
      attributes.PLACEHOLDER,
      attributes.ID,
      // and other ids-input settings
      // attributes.BG_TRANSPARENT,
      attributes.CLEARABLE,
      // attributes.CLEARABLE_FORCED,
      // attributes.COMPACT,
      attributes.DISABLED,
      // attributes.FIELD_HEIGHT,
      // attributes.LABEL,
      // attributes.LABEL_HIDDEN,
      // attributes.LABEL_REQUIRED,
      // attributes.ID,
      // attributes.MODE,
      attributes.PLACEHOLDER,
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
    this.triggerButtonIcon = this.container.querySelector('ids-trigger-button ids-icon');
    this.#attachEventHandlers();
    super.connectedCallback();
  }

  template() {
    return `
    <div class="ids-search-field">
      <ids-trigger-field
        id="${this.id}"
        label="Search Field"
        tabbable="false"
        >
        <ids-input
          value="${this.value}"
          placeholder="Search"
        >
        </ids-input>
        <ids-trigger-button>
          <ids-text audible="true">Search trigger</ids-text>
          <ids-icon slot="icon" icon="search" size="medium"></ids-icon>
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
    // console.log('getting value ' + this.getAttribute(attributes.VALUE));
    return this.getAttribute(attributes.VALUE) || '';
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

    // key press
    // on change
    // search (enter or finish typing)
  }
}

export default IdsSearchField;

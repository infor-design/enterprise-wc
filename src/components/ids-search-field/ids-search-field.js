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
      // attributes.CLEARABLE,
      // attributes.CLEARABLE_FORCED,
      // attributes.COMPACT,
      // attributes.DISABLED,
      // attributes.FIELD_HEIGHT,
      // attributes.LABEL,
      // attributes.LABEL_HIDDEN,
      // attributes.LABEL_REQUIRED,
      // attributes.ID,
      // attributes.MODE,
      // attributes.PLACEHOLDER,
      // attributes.SIZE,
      // attributes.READONLY,
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
    return(
      `
      <div class="ids-search-field" id=${this.id}>
        <ids-trigger-field 
          size="md"
          tabbable="false"
          label="Search Field"
          validate="required"
        >
          <ids-input 
            id=""
            placeholder="hi"
          >
          </ids-input>
          <ids-trigger-button>
            <ids-text audible="true">Icon trigger</ids-text>
            <ids-icon
              slot="icon"
              icon="close"
              size="small"
            ></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
      </div>
      `
    )
  }

  #attachEventHandlers() {
    // key press
    // on change
    // search (enter or finish typing)
  }
}

export default IdsSearchField;
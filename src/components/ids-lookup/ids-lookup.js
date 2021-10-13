import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

// Import Mixins
import {
  IdsDirtyTrackerMixin,
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsPopupOpenEventsMixin,
  IdsThemeMixin,
  IdsValidationMixin,
  IdsLocaleMixin,
  IdsTooltipMixin
} from '../../mixins';

// Import Utils
import { IdsStringUtils as stringUtils } from '../../utils';

// Supporting components
import { IdsTriggerButton, IdsTriggerField } from '../ids-trigger-field';

// Import Styles
import styles from './ids-lookup.scss';

/**
 * IDS Lookup Component
 * @type {IdsLookup}
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsValidationMixin
 * @mixes IdsTooltipMixin
 * @part trigger-field - the trigger container
 * @part input - the input element
 * @part trigger-button - the trigger button
 * @part icon - the icon in the trigger button
 */
@customElement('ids-lookup')
@scss(styles)
class IdsLookup extends mix(IdsElement).with(
    IdsDirtyTrackerMixin,
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsPopupOpenEventsMixin,
    IdsThemeMixin,
    IdsLocaleMixin,
    IdsValidationMixin,
    IdsTooltipMixin
  ) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    this.input = this.shadowRoot?.querySelector('ids-input');
    this.triggerField = this.shadowRoot?.querySelector('ids-trigger-field');

    this
      .#handleEvents()
      .#handleKeys();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.DISABLED,
      attributes.LABEL,
      attributes.MODE,
      attributes.READONLY,
      attributes.TABBABLE,
      attributes.VALUE,
      attributes.VERSION
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
    <ids-trigger-field
      label="${this.label}"
      part="trigger-field"
      size="md"
      ${this.disabled ? ' disabled="true"' : ''}
      ${this.readonly ? ' readonly="true"' : ''}
      ${this.validate ? ` validate="${this.validate}"` : ''}
      ${this.validate && this.validationEvents ? ` validation-events="${this.validationEvents}"` : ''}>
      <ids-input
        part="input"
        disabled="${this.disabled}"
        triggerfield="true"></ids-input>
      <ids-trigger-button
        part="trigger-button"
        tabbable="${this.tabbable}"
        disabled="${this.disabled}"
        readonly="${this.readonly}">
        <ids-text audible="true">Lookup Button</ids-text>
        <ids-icon slot="icon" icon="search-list" part="icon"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>
    <ids-modal>
      <slot slot="content">
      </slot>
    </ids-modal>
    `;
  }

  /**
   * Set the value of the dropdown using the value/id attribute if present
   * @param {boolean|string} value The value/id to use
   */
  set value(value) {
    this.shadowRoot.querySelector('ids-input').value = value;

    // Send the change event
    if (this.value === value) {
      this.triggerEvent('change', this, {
        detail: {
          elem: this,
          value: this.value
        }
      });
    }
    this.setAttribute('value', value);
  }

  get value() { return this.getAttribute('value'); }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value) {
    this.setAttribute('label', value);
    this.shadowRoot.querySelector('ids-input').setAttribute('label', value);
  }

  get label() { return this.getAttribute('label') || ''; }

  /**
   * Sets the readonly attribute
   * @param {string|boolean} value string value from the readonly attribute
   */
  set readonly(value) {
    const isReadonly = stringUtils.stringToBool(value);
    if (!this.triggerField) {
      return;
    }

    if (isReadonly) {
      this.removeAttribute('disabled');
      this.triggerField.readonly = true;
      this.triggerField.disabled = false;
      this.setAttribute('readonly', 'true');
      return;
    }

    this.triggerField.readonly = false;
    this.triggerField.disabled = false;
    this.removeAttribute('readonly');
  }

  get readonly() {
    return stringUtils.stringToBool(this.getAttribute('readonly')) || false;
  }

  /**
   * Sets the disabled attribute
   * @param {string|boolean} value string value from the disabled attribute
   */
  set disabled(value) {
    const isDisabled = stringUtils.stringToBool(value);
    if (!this.triggerField) {
      return;
    }

    if (isDisabled) {
      this.removeAttribute('readonly');

      this.triggerField.disabled = true;
      this.triggerField.readonly = false;
      this.setAttribute('disabled', 'true');
      return;
    }

    this.triggerField.disabled = false;
    this.removeAttribute('disabled');
  }

  get disabled() {
    return stringUtils.stringToBool(this.getAttribute('disabled')) || false;
  }

  /**
   * Set the trigger button to tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = stringUtils.stringToBool(value);
    if (!this.triggerField) {
      return;
    }

    this.setAttribute(attributes.TABBABLE, isTabbable);
    this.triggerField.setAttribute(attributes.TABBABLE, isTabbable);
  }

  get tabbable() {
    const attr = this.getAttribute(attributes.TABBABLE);
    if (attr === null) {
      return true;
    }
    return stringUtils.stringToBool(this.getAttribute(attributes.TABBABLE));
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #handleEvents() {
    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #handleKeys() {
    this.listen(['ArrowDown'], this, () => {
      // TODO
    });
    return this;
  }
}

export default IdsLookup;

import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';

import Base from './ids-lookup-base';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import IdsModal from '../ids-modal/ids-modal';
import IdsDataGrid from '../ids-data-grid/ids-data-grid';

import styles from './ids-lookup.scss';

/**
 * IDS Lookup Component
 * @type {IdsLookup}
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsTooltipMixin
 * @part trigger-field - the trigger container
 * @part input - the input element
 * @part trigger-button - the trigger button
 * @part icon - the icon in the trigger button
 * @part modal - the modal dialog container
 * @part data-grid - the dataGrid element
 */
@customElement('ids-lookup')
@scss(styles)
export default class IdsLookup extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    // Setup some internal refs
    this.input = this.shadowRoot?.querySelector('ids-input');
    this.triggerField = this.shadowRoot?.querySelector('ids-trigger-field');
    this.triggerButton = this.shadowRoot?.querySelector('ids-trigger-button');
    this.state = {};

    // Setup Attached Datagrid
    this.dataGrid = this.shadowRoot?.querySelector('ids-data-grid');
    this.dataGrid.listStyle = true;

    // Link the Modal to its trigger button (sets up click/focus events)
    this.modal = this.querySelector('[slot="lookup-modal"]');
    if (!this.modal) {
      this.modal = this.shadowRoot?.querySelector('ids-modal');
    }
    this.modal.target = this.triggerButton;
    this.modal.trigger = 'click';

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
      attributes.FIELD,
      attributes.LABEL,
      attributes.MODE,
      attributes.READONLY,
      attributes.TABBABLE,
      attributes.TITLE,
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
        <ids-text audible="true">LookupTriggerButton</ids-text>
        <ids-icon slot="icon" icon="search-list" part="icon"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>
    <slot name="lookup-modal">
      <ids-modal id="lookup-modal" aria-labelledby="lookup-modal-title" part="modal">
        <ids-text slot="title" font-size="24" type="h2" id="lookup-modal-title">${this.title}</ids-text>
        <ids-layout-grid class="data-grid-container" auto="true" gap="md" no-margins="true" min-col-width="600px">
          <ids-layout-grid-cell>
            <ids-data-grid id="lookup-data-grid" label="${this.label}" part="data-grid">
            </ids-data-grid>
          </ids-layout-grid-cell>
        </ids-layout-grid>

      <ids-modal-button slot="buttons" id="modal-cancel-btn" type="secondary">
        <span slot="text">Cancel</span>
        </ids-modal-button>
        <ids-modal-button slot="buttons" id="modal-apply-btn" type="primary">
          <span slot="text">Apply</span>
        </ids-modal-button>
      </ids-modal>
    </slot>
    `;
  }

  /**
   * Set the value of the dropdown using the value/id attribute if present
   * @param {boolean|string} value The value/id to use
   */
  set value(value) {
    this.shadowRoot.querySelector('ids-input').value = value;
    this.setAttribute('value', value);

    if (this.value === value) {
      // Send the change event{
      this.triggerEvent('change', this, {
        detail: {
          elem: this,
          value: this.value
        }
      });
    }
  }

  get value() { return this.getAttribute('value'); }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value) {
    this.setAttribute('label', value);
    this.shadowRoot.querySelector('ids-input').setAttribute('label', value);
    this.triggerField.shadowRoot.querySelector('.ids-label-text ids-text').textContent = value;
  }

  get label() { return this.getAttribute('label') || ''; }

  /**
   * Sets the readonly state of the field
   * @param {string|boolean} value string value from the readonly attribute
   */
  set readonly(value) {
    const isReadonly = stringToBool(value);
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
    return stringToBool(this.getAttribute('readonly')) || false;
  }

  /**
   * Sets the disabled attribute
   * @param {string|boolean} value string value from the disabled attribute
   */
  set disabled(value) {
    const isDisabled = stringToBool(value);
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
    return stringToBool(this.getAttribute('disabled')) || false;
  }

  /**
   * Set the trigger button to tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = stringToBool(value);
    if (!this.triggerField) {
      return;
    }

    this.setAttribute(attributes.TABBABLE, isTabbable);
    this.triggerField.setAttribute(attributes.TABBABLE, isTabbable);
  }

  get tabbable() {
    const attr = this.getAttribute(attributes.TABBABLE);
    if (this.readonly || this.disabled) {
      return false;
    }
    if (attr === null) {
      return true;
    }
    return stringToBool(this.getAttribute(attributes.TABBABLE));
  }

  /**
   * Set the columns array of the data grid
   * @param {Array} value The array to use
   */
  set columns(value) {
    this.dataGrid.columns = value;
  }

  get columns() { return this.dataGrid.columns; }

  /**
   * Set the data array of the data grid
   * @param {Array} value The array to use
   */
  set data(value) {
    this.dataGrid.data = value;

    if (value && this.dataGrid.selectedRows.length === 0) {
      // Sync the dataGrid selected rows
      this.#syncSelectedRows();
    }
  }

  get data() { return this.dataGrid.data; }

  /**
   * Sync the selected rows in the dataGrid
   * @private
   */
  #syncSelectedRows() {
    if (!this.value) {
      return;
    }

    const selectedIds = this.value.split(this.delimiter);
    for (let i = 0; i < selectedIds.length; i++) {
      const foundIndex = this.dataGrid.data.findIndex((row) => row[this.field] === selectedIds[i]);
      if (foundIndex > -1) {
        this.dataGrid.selectRow(foundIndex);
      }
    }
  }

  /**
   * Set any number of dataGrid settings
   * @param {object} settings The settings to use
   */
  set dataGridSettings(settings) {
    this.state.dataGridSettings = settings;

    // Apply the settings to the grid
    for (const [setting, settingValue] of Object.entries(settings)) {
      this.dataGrid[setting] = settingValue;
    }
    this.dataGrid.listStyle = true;
  }

  get dataGridSettings() { return this.state.dataGridSettings; }

  /**
   * Sets the validation check to use
   * @param {string} value The `validate` attribute
   */
  set validate(value) {
    if (value) {
      this.setAttribute(attributes.VALIDATE, value.toString());
      this.triggerField.setAttribute(attributes.VALIDATE, value.toString());
      this.triggerField.setAttribute(attributes.VALIDATION_EVENTS, this.validationEvents);
      this.triggerField.handleValidation();
      this.input.setLabelElement(this.triggerField.shadowRoot?.querySelector('[slot="ids-trigger-field-label"]'));
    } else {
      this.removeAttribute(attributes.VALIDATE);
      this.triggerField.removeAttribute(attributes.VALIDATE);
      this.triggerField.removeAttribute(attributes.VALIDATION_EVENTS);
      this.triggerField.handleValidation();
      this.input.setLabelElement(undefined);
    }
  }

  get validate() { return this.getAttribute(attributes.VALIDATE); }

  /**
   * Set `validation-events` attribute
   * @param {string} value The `validation-events` attribute
   */
  set validationEvents(value) {
    if (value) {
      this.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
      this.input.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      this.input.removeAttribute(attributes.VALIDATION_EVENTS);
    }
  }

  get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS) || 'change blur'; }

  /**
   * Set the modal title
   * @param {string} value The modal title attribute
   */
  set title(value) {
    if (value) {
      this.setAttribute(attributes.TITLE, value);
      this.modal.querySelector('[slot="title"]').innerText = value;
      this.input.setAttribute(attributes.TITLE, value);
    }
  }

  get title() { return this.getAttribute(attributes.TITLE) || `${this.label}`; }

  /**
   * Set the field to use when populating the input
   * @param {string} value The field name
   */
  set field(value) {
    if (value) {
      this.setAttribute(attributes.FIELD, value);
    }
  }

  get field() { return this.getAttribute(attributes.FIELD) || 'id'; }

  /**
   * Set the string delimiter on selection
   * @param {string} value The field name
   */
  set delimiter(value) {
    if (value) {
      this.setAttribute(attributes.DELIMITER, value);
    }
  }

  get delimiter() { return this.getAttribute(attributes.DELIMITER) || ','; }

  /**
   * Set the value in the input for the selected row(s)
   * @private
   */
  #setInputValue() {
    let value = '';
    const length = this.dataGrid.selectedRows.length;

    this.dataGrid.selectedRows.forEach((row, i) => {
      value += `${row.data[this.field]}${i < length - 1 ? this.delimiter : ''}`;
    });
    this.value = value;
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #handleEvents() {
    this.onEvent('click.lookup', this.modal, (e) => {
      if (e.target.getAttribute('id') === 'modal-cancel-btn') {
        this.modal.hide();
      }
      if (e.target.getAttribute('id') === 'modal-apply-btn') {
        this.modal.hide();
        this.#setInputValue();
      }
    });

    this.modal.addEventListener('beforeshow', (e) => {
      // In the case of readonly/disabled or no data do not show the modal
      if (this.readonly || this.disabled) {
        e.detail.response(false);
      }
      // Show always for custom modals
      if (this.querySelectorAll('[slot="lookup-modal"]').length === 1) {
        return;
      }
      // In the case of no data do not show the modal
      if (this.data.length === 0 && this.columns.length === 1 && this.columns[0].id === '') {
        e.detail.response(false);
      }
    });

    // Propagate a few events to the parent
    this.dataGrid.addEventListener('rowselected', (e) => {
      this.triggerEvent('rowselected', this, { detail: e.detail });
    });

    this.dataGrid.addEventListener('rowdeselected', (e) => {
      this.triggerEvent('rowdeselected', this, { detail: e.detail });
    });

    this.dataGrid.addEventListener('selectionchanged', (e) => {
      this.triggerEvent('selectionchanged', this, { detail: e.detail });
    });

    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #handleKeys() {
    this.listen(['ArrowDown'], this, () => {
      this.modal.show();
    });
    return this;
  }
}

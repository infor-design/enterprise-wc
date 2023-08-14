import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';

import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsFieldHeightMixin from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsValidationInputMixin from '../../mixins/ids-validation-mixin/ids-validation-input-mixin';
import IdsElement from '../../core/ids-element';
import IdsLabelStateParentMixin from '../../mixins/ids-label-state-mixin/ids-label-state-parent-mixin';
import { IdsPopupElementRef } from '../ids-popup/ids-popup-attributes';
import { IdsDataGridColumn } from '../ids-data-grid/ids-data-grid-column';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import '../ids-trigger-field/ids-trigger-field';
import '../ids-modal/ids-modal';
import '../ids-data-grid/ids-data-grid';

import type IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import type IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import type IdsDataGrid from '../ids-data-grid/ids-data-grid';
import type IdsModal from '../ids-modal/ids-modal';
import type IdsText from '../ids-text/ids-text';
import styles from './ids-lookup.scss';

const Base = IdsDirtyTrackerMixin(
  IdsLabelStateParentMixin(
    IdsLocaleMixin(
      IdsKeyboardMixin(
        IdsValidationInputMixin(
          IdsFieldHeightMixin(
            IdsTooltipMixin(
              IdsEventsMixin(
                IdsElement
              )
            )
          )
        )
      )
    )
  )
);

/**
 * IDS Lookup Component
 * @type {IdsLookup}
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLabelStateParentMixin
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
  triggerField?: IdsTriggerField | null;

  triggerButton?: IdsTriggerButton | null;

  dataGrid?: IdsDataGrid | null;

  modal?: IdsModal | null;

  listBox?: any;

  constructor() {
    super();

    // Setup some defaults
    this.state = {
      ...this.state,
      clearable: true,
      dataGridSettings: { rowSelection: 'multiple' },
      value: ''
    };

    // Override global html title
    Object.defineProperty(this, 'title', {
      get: () => this.#title,
      set: (value) => { this.#title = value; },
      enumerable: true,
      configurable: true
    });
  }

  isFormComponent = true;

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();

    this.triggerField = this.shadowRoot?.querySelector('ids-trigger-field');
    this.triggerButton = this.shadowRoot?.querySelector('ids-trigger-button[part="trigger-lookup"]');

    // Setup Attached Datagrid
    this.dataGrid = this.shadowRoot?.querySelector('ids-data-grid');
    this.dataGrid?.setAttribute(attributes.LIST_STYLE, 'true');

    // Link the Modal to its trigger button (sets up click/focus events)
    this.modal = this.querySelector('[slot="lookup-modal"]') || this.shadowRoot?.querySelector('ids-modal');
    if (this.modal) {
      this.modal.target = this.triggerButton as IdsPopupElementRef;
      this.modal.triggerType = 'click';
    }

    this
      .#handleEvents()
      .#handleKeys();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();

    this.dataGrid = undefined;
    this.modal = undefined;
    this.triggerField = undefined;
    this.triggerButton = undefined;
    this.state = {};
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.AUTOCOMPLETE,
      attributes.CLEARABLE,
      attributes.DISABLED,
      attributes.FIELD,
      attributes.READONLY,
      attributes.SIZE,
      attributes.TABBABLE,
      attributes.TITLE,
      attributes.VALUE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `
    <ids-trigger-field
      label="${this.label}"
      part="trigger-field"
      value="${this.value}"
      ${this.autocomplete ? ` autocomplete search-field="${this.field}"` : ''}
      ${this.clearable ? ' clearable="true"' : ''}
      ${this.disabled ? ' disabled="true"' : ''}
      ${this.readonly ? ' readonly="true"' : ''}
      ${this.dirtyTracker ? ' dirty-tracker="true"' : ''}
      ${this.compact ? ' compact' : ''}
      ${this.size ? ` size="${this.size}"` : ''}
      ${this.fieldHeight ? ` field-height="${this.fieldHeight}"` : ''}
      ${this.validate ? ` validate="${this.validate}"` : ''}
      ${this.validate && this.validationEvents ? ` validation-events="${this.validationEvents}"` : ''}>
      <ids-trigger-button
        slot="trigger-end"
        part="trigger-lookup"
        tabbable="${this.tabbable}"
        disabled="${this.disabled}"
        readonly="${this.readonly}">
        <ids-text audible="true">LookupTriggerButton</ids-text>
        <ids-icon icon="search-list" part="icon"></ids-icon>
      </ids-trigger-button>
    </ids-trigger-field>
    <slot name="lookup-modal">
      <ids-modal id="lookup-modal" aria-labelledby="lookup-modal-title" part="modal">
        <ids-text slot="title" font-size="24" type="h2" id="lookup-modal-title">${this.title}</ids-text>
        <ids-layout-grid class="data-grid-container" auto-fit="true" gap="md" no-margins="true" min-col-width="600px">
          <ids-layout-grid-cell>
            <ids-data-grid id="lookup-data-grid" label="${this.label}" part="data-grid">
            </ids-data-grid>
          </ids-layout-grid-cell>
        </ids-layout-grid>

      <ids-modal-button slot="buttons" id="modal-cancel-btn" appearance="secondary">
        <span>Cancel</span>
        </ids-modal-button>
        <ids-modal-button slot="buttons" id="modal-apply-btn" appearance="primary">
          <span>Apply</span>
        </ids-modal-button>
      </ids-modal>
    </slot>
    `;
  }

  /**
   * Set autocomplete attribute
   * @param {string | boolean | null} value autocomplete value
   */
  set autocomplete(value: string | boolean | null) {
    const val = stringToBool(value);
    if (val) this.setAttribute(attributes.AUTOCOMPLETE, '');
    else this.removeAttribute(attributes.AUTOCOMPLETE);
  }

  /**
   * Get the autocomplete attribute
   * @returns {boolean} autocomplete attribute value
   */
  get autocomplete(): boolean | null {
    return this.hasAttribute(attributes.AUTOCOMPLETE);
  }

  /**
   * Callback for dirty tracker setting change
   * @param {boolean} value The changed value
   * @returns {void}
   */
  onDirtyTrackerChange(value: boolean) {
    if (value) this.container?.setAttribute(attributes.DIRTY_TRACKER, value.toString());
    else this.container?.removeAttribute(attributes.DIRTY_TRACKER);
  }

  /**
   * Set the value of the dropdown using the value/id attribute if present
   * @param {string} value The value/id to use
   */
  set value(value: string) {
    if (value !== this.state.value) {
      this.state.value = (value ?? '').toString();
      this.setAttribute(attributes.VALUE, this.state.value);

      // Update trigger field value
      if (this.triggerField) {
        const tfValue = this.triggerField.value;
        if (tfValue !== this.state.value) {
          this.triggerField.value = this.state.value;
          this.triggerField?.input?.dispatchEvent(new Event('change'));
        }
      }

      // Send the change event
      this.triggerEvent('change', this, { detail: { elem: this, value: this.state.value } });
    }
  }

  get value(): string { return this.state.value; }

  onLabelChange(): void {
    if (this.input) this.input.label = this.label;
  }

  /**
   * Push label-state to the container element
   * @returns {void}
   */
  onLabelStateChange(): void {
    if (this.input) this.input.labelState = this.labelState;
  }

  onLabelRequiredChange(): void {
    if (this.input) this.input.labelRequired = this.labelRequired;
  }

  /**
   * Sets the readonly state of the field
   * @param {string|boolean} value string value from the readonly attribute
   */
  set readonly(value: string | boolean) {
    const isReadonly = stringToBool(value);
    if (!this.triggerField) {
      return;
    }

    if (isReadonly) {
      this.removeAttribute('disabled');
      this.triggerField.readonly = true;
      this.setAttribute('readonly', 'true');
      return;
    }

    this.triggerField.readonly = false;
    this.removeAttribute('readonly');
  }

  get readonly(): string | boolean {
    return stringToBool(this.getAttribute('readonly')) || false;
  }

  /**
   * Sets the disabled attribute
   * @param {string|boolean} value string value from the disabled attribute
   */
  set disabled(value: string | boolean) {
    const isDisabled = stringToBool(value);
    if (!this.triggerField) {
      return;
    }

    if (isDisabled) {
      this.removeAttribute('readonly');

      this.triggerField.disabled = true;
      this.setAttribute('disabled', 'true');
      return;
    }

    this.triggerField.disabled = false;
    this.removeAttribute('disabled');
  }

  get disabled(): string | boolean {
    return stringToBool(this.getAttribute('disabled')) || false;
  }

  /**
   * Set the trigger button to tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value: string | boolean) {
    const isTabbable = stringToBool(value);
    if (!this.triggerField) {
      return;
    }

    this.setAttribute(attributes.TABBABLE, String(isTabbable));
    this.triggerField.setAttribute(attributes.TABBABLE, String(isTabbable));
  }

  get tabbable(): string | boolean {
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
   * @param {IdsDataGridColumn[] | undefined} value The array to use
   */
  set columns(value: IdsDataGridColumn[] | undefined) {
    if (this.dataGrid) this.dataGrid.columns = value;
  }

  get columns(): any[] | undefined { return this.dataGrid?.columns; }

  /**
   * Set the data array of the data grid
   * @param {Array<Record<string, any>>} value The array to use
   */
  set data(value: Array<Record<string, any>>) {
    if (this.dataGrid) this.dataGrid.data = value;
    this.#syncSelectedRows();
  }

  get data(): Array<Record<string, any>> { return this.dataGrid ? this.dataGrid.data : []; }

  /**
   * Sync the selected rows in the dataGrid
   * @private
   * @param {string} value The value to be set
   * @returns {void}
   */
  #syncSelectedRows(value: string = this.value): void {
    // Deselect all rows, if given value is empty
    if (value === '') {
      if (this.dataGrid?.selectedRows.length) this.dataGrid.deSelectAllRows();
      if (this.value !== value) this.value = value;
      return;
    }

    // Select the rows, if not selected already for given value split with delimiter
    const findIndex = (d: any, v: string) => (d.findIndex((r: any) => r[this.field] === v));
    const values = value?.split(this.delimiter) || [];
    let notFound: number[] = [];
    values.forEach((v: string, i: number) => {
      const dataIndex = findIndex(this.dataGrid?.data, v);
      if (dataIndex > -1) {
        if (findIndex(this.dataGrid?.selectedRows.map((d: any) => d.data), v) === -1) {
          this.dataGrid?.selectRow(dataIndex);
        }
      } else {
        notFound.push(i);
      }
    });
    notFound.forEach((i: number) => values.splice(i, 1));

    // Deselect rows, if any extra previously selected in grid
    notFound = [];
    if (this.dataGrid?.selectedRows && this.dataGrid?.selectedRows.length > values.length) {
      this.dataGrid?.selectedRows.forEach((d: any) => {
        if (!values.includes(d.data[this.field])) notFound.push(d.index);
      });
    }
    notFound.forEach((i: number) => this.dataGrid?.deSelectRow(i));

    // Update the value
    if (this.value !== value) this.value = value;
  }

  /**
   * Set any number of dataGrid settings
   * @param {object} settings The settings to use
   */
  set dataGridSettings(settings: any) {
    this.state.dataGridSettings = settings;

    // Apply the settings to the grid
    for (const [setting, settingValue] of Object.entries(settings)) {
      (this.dataGrid as any)[setting] = settingValue;
    }
    if (this.dataGrid) this.dataGrid.listStyle = true;
  }

  get dataGridSettings(): any { return this.state.dataGridSettings; }

  /**
   * Sets the validation check to use
   * @param {string} value The `validate` attribute
   */
  set validate(value: string | null) {
    if (value) {
      this.setAttribute(attributes.VALIDATE, value.toString());
      this.triggerField?.setAttribute(attributes.VALIDATE, value.toString());
      this.triggerField?.setAttribute(attributes.VALIDATION_EVENTS, this.validationEvents);
      this.triggerField?.handleValidation();
    } else {
      this.removeAttribute(attributes.VALIDATE);
      this.triggerField?.removeAttribute(attributes.VALIDATE);
      this.triggerField?.removeAttribute(attributes.VALIDATION_EVENTS);
      this.triggerField?.handleValidation();
    }
  }

  get validate(): string | null { return this.getAttribute(attributes.VALIDATE); }

  /**
   * Set `validation-events` attribute
   * @param {string} value The `validation-events` attribute
   */
  set validationEvents(value: string) {
    if (value) {
      this.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
      this.triggerField?.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      this.triggerField?.removeAttribute(attributes.VALIDATION_EVENTS);
    }
  }

  get validationEvents(): string { return this.getAttribute(attributes.VALIDATION_EVENTS) || 'change blur'; }

  /**
   * Set the modal title
   * @param {string} value The modal title attribute
   */
  set #title(value: string) {
    if (value) {
      this.setAttribute(attributes.TITLE, value);
      const titleElem = this.modal?.querySelector<IdsText>('[slot="title"]');
      if (titleElem) titleElem.innerText = value;
      this.triggerField?.setAttribute(attributes.TITLE, value);
    }
  }

  get #title(): string { return this.getAttribute(attributes.TITLE) || `${this.label}`; }

  /**
   * Set the field to use when populating the input
   * @param {string} value The field name
   */
  set field(value: string) {
    if (value) {
      this.setAttribute(attributes.FIELD, value);
    }
  }

  get field(): string { return this.getAttribute(attributes.FIELD) || 'id'; }

  /**
   * Set the dropdown size
   * @param {string} value The value
   */
  set size(value: string) {
    if (value) {
      this.setAttribute(attributes.SIZE, value);
    } else {
      this.removeAttribute(attributes.SIZE);
    }
    if (this.triggerField) this.triggerField.setAttribute(attributes.SIZE, this.size);
  }

  get size(): string { return this.getAttribute(attributes.SIZE) ?? 'md'; }

  /**
   * Set the string delimiter on selection
   * @param {string} value The field name
   */
  set delimiter(value: string) {
    if (value) {
      this.setAttribute(attributes.DELIMITER, value);
    }
  }

  get delimiter(): string { return this.getAttribute(attributes.DELIMITER) || ','; }

  /**
   * @returns {IdsTriggerField} Reference to the IdsTriggerField
   */
  get input() {
    return this.container as IdsTriggerField;
  }

  /**
   * Sets the clearable x button
   * @param {boolean|string} value If true will set to clearable
   */
  set clearable(value: boolean | string) {
    const val = stringToBool(value);
    if (val !== this.state.clearable) {
      this.state.clearable = val;
      this.setAttribute(attributes.CLEARABLE, String(val));
      this.triggerField?.setAttribute(attributes.CLEARABLE, String(val));
    }
  }

  get clearable(): boolean { return this.state.clearable; }

  /**
   * Push field-height/compact to the container element
   * @param {string} val the new field height setting
   */
  onFieldHeightChange(val: string) {
    if (val) {
      const attr = val === 'compact' ? { name: 'compact', val: '' } : { name: 'field-height', val };
      this.triggerField?.setAttribute(attr.name, attr.val);
    } else {
      this.triggerField?.removeAttribute('compact');
      this.triggerField?.removeAttribute('field-height');
      this.listBox?.removeAttribute('compact');
    }
  }

  /**
   * Set the value in the input for the selected row(s)
   * @private
   */
  #setInputValue(): void {
    this.value = this.dataGrid?.selectedRows.map((r: any) => r.data[this.field]).join(this.delimiter) || '';
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #handleEvents() {
    this.onEvent('click.lookup', this.modal, (e: any) => {
      const btnId = e.target?.getAttribute('id');

      // Cancel
      if (btnId === 'modal-cancel-btn') {
        this.modal?.hide();
        this.#syncSelectedRows();
      }

      // Apply
      if (btnId === 'modal-apply-btn') {
        this.modal?.hide();
        this.#setInputValue();
      }
    });

    this.onEvent('change.lookup', this.triggerField, () => {
      const tfValue = this.triggerField?.value;
      let isSynced = tfValue !== this.value;
      if (!isSynced) {
        const selected = this.dataGrid?.selectedRows?.map((d: any) => d?.data?.[this.field]) || [];
        const values = this.value?.split(this.delimiter) || [];
        if (selected.length !== values.length) isSynced = true;
        if (!isSynced) {
          for (let i = 0, l = values.length; i < l; i++) {
            if (!selected.includes(values[i])) {
              isSynced = true;
              break;
            }
          }
        }
      }
      if (isSynced) this.#syncSelectedRows(tfValue);
    });

    this.modal?.addEventListener('beforeshow', ((e: CustomEvent) => {
      // In the case of readonly/disabled or no data do not show the modal
      if (this.readonly || this.disabled) {
        e.detail.response(false);
      }
      // Show always for custom modals
      if (this.querySelectorAll('[slot="lookup-modal"]').length === 1) {
        return;
      }
      // In the case of no data do not show the modal
      if (this.data?.length === 0 && this.columns?.length === 1 && (this.columns[0] as any).id === '') {
        e.detail.response(false);
      }
    }) as EventListener);

    // Propagate a few events to the parent
    this.dataGrid?.addEventListener('beforerowselected', ((e: CustomEvent) => {
      this.triggerEvent('beforerowselected', this, { detail: e.detail });
    }) as EventListener);

    this.dataGrid?.addEventListener('rowselected', ((e: CustomEvent) => {
      this.triggerEvent('rowselected', this, { detail: e.detail });
    }) as EventListener);

    this.dataGrid?.addEventListener('beforerowdeselected', ((e: CustomEvent) => {
      this.triggerEvent('beforerowdeselected', this, { detail: e.detail });
    }) as EventListener);

    this.dataGrid?.addEventListener('rowdeselected', ((e: CustomEvent) => {
      this.triggerEvent('rowdeselected', this, { detail: e.detail });
    }) as EventListener);

    this.dataGrid?.addEventListener('selectionchanged', ((e: CustomEvent) => {
      this.triggerEvent('selectionchanged', this, { detail: e.detail });
    }) as EventListener);

    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #handleKeys() {
    this.listen(['ArrowDown'], this, () => {
      this.modal?.show();
    });
    return this;
  }
}

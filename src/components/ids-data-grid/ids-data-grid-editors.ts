// eslint-disable-next-line max-classes-per-file
import IdsCheckbox from '../ids-checkbox/ids-checkbox';
import IdsInput from '../ids-input/ids-input';
import IdsDropdown from '../ids-dropdown/ids-dropdown';
import type IdsDataGridCell from './ids-data-grid-cell';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';

export interface IdsDataGridEditorOptions {
  /** The type of editor (i.e. text, data, time, dropdown, checkbox, number ect) */
  type: string;
  /** The field in the data set to show */
  field: string;
  /** If true the editor will remain visible */
  inline: boolean;
}

export interface IdsDataGridSaveValue {
  // value to be saved in data set
  value?: string | number | boolean | null;
  // (optional) value used for dirty checking
  dirtyCheckValue?: string | number | boolean | null;
}

export interface IdsDataGridEditor {
  /** The type of editor (i.e. input, dropdown, checkbox ect) */
  type: string;
  /** The main editor element */
  input?: IdsInput | IdsCheckbox | IdsDropdown;
  /** The function that invokes and sets values on the input */
  init: (cell?: IdsDataGridCell) => void;
  /** The function that transforms and saved the editor */
  save: (cell?: IdsDataGridCell) => IdsDataGridSaveValue | undefined | null;
  /** The function that tears down all aspects of the editor */
  destroy: (cell?: IdsDataGridCell) => void;
  /** Indicates click was used to edit */
  isClick?: boolean;
}

const applySettings = (elem: any, settings?: Record<string, any> | undefined) => {
  // eslint-disable-next-line guard-for-in
  for (const setting in settings) {
    elem[setting] = settings[setting];
  }
};
export class InputEditor implements IdsDataGridEditor {
  /** The type of editor (i.e. input, dropdown, checkbox ect) */
  type = 'input';

  /** Holds the Editor */
  input?: IdsInput;

  /**
   * Create an input and set the value and focus states
   * @param {IdsDataGridCell} cell the cell element
   */
  init(cell?: IdsDataGridCell) {
    const isInline = cell?.column.editor?.inline;
    this.input = <IdsInput> document.createElement('ids-input');
    this.input.colorVariant = isInline ? 'in-cell' : 'borderless';
    this.input.size = isInline ? 'full' : '';
    this.input.fieldHeight = String(cell?.dataGrid?.rowHeight);
    this.input.labelState = 'collapsed';

    // Clear cell and set value
    const value = cell?.innerText;
    cell!.innerHTML = '';
    cell?.appendChild(this.input as any);
    this.input.value = value;

    if (this.input instanceof IdsInput && cell) {
      if (!isInline) this.input.shadowRoot?.querySelector('input')?.style.setProperty('width', `${cell.offsetWidth - 5}px`);
      applySettings(this.input, cell?.column.editor?.editorSettings);
    }
    this.input.focus();
  }

  /* Transform the value */
  save() {
    return { value: this.input?.value };
  }

  /* Destroy the editor */
  destroy() {
    this.input = undefined;
  }
}

export class CheckboxEditor implements IdsDataGridEditor {
  /** The type of editor (i.e. input, dropdown, checkbox ect) */
  type = 'checkbox';

  /** Holds the Editor */
  input?: IdsCheckbox;

  /** Indicates if keyboard was used to init the editor */
  isClick?: boolean;

  /**
   * Create an input and set the value and focus states
   * @param {IdsDataGridCell} cell the cell element
   */
  init(cell?: IdsDataGridCell) {
    // const isInline = cell?.column.editor?.inline;
    this.input = <IdsCheckbox> document.createElement('ids-checkbox');

    // Clear cell and set value
    const value = stringToBool(cell?.querySelector('[aria-checked]')?.getAttribute('aria-checked'));
    cell!.innerHTML = '';
    if (!this.isClick) this.input.noAnimation = true;
    this.input.checked = this.isClick ? !value : value;

    cell?.appendChild(this.input as any);
    this.input.focus();
  }

  /* Transform the value */
  save() {
    return { value: this.input?.checked };
  }

  /* Destroy the editor */
  destroy() {
    this.input?.offEvent('keydown');
    this.input = undefined;
  }
}

export class DropdownEditor implements IdsDataGridEditor {
  /** The type of editor (i.e. input, dropdown, checkbox ect) */
  type = 'dropdown';

  /** Holds the Editor */
  input?: IdsDropdown;

  /** Cache dropdown value */
  #value?: string | null;

  /** Callback reference to handle blur event propagation */
  #stopPropagationCb = this.stopPropagation.bind(this);

  init(cell?: IdsDataGridCell): void {
    this.#value = cell?.querySelector('[data-value]')?.getAttribute('data-value') ?? null;
    const isInline = cell?.column.editor?.inline;
    const settings = { ...cell?.column?.editor?.editorSettings };
    const dataset = <any[]>settings?.options ?? [];

    this.input = <IdsDropdown>document.createElement('ids-dropdown');
    this.input.insertAdjacentHTML('beforeend', '<ids-list-box></ids-list-box>');
    this.input.loadDataSet(dataset);

    // apply user settings
    delete settings.options;
    applySettings(this.input, settings);
    this.input.typeahead = false;

    cell!.innerHTML = '';
    cell!.classList.add('is-dropdown');
    cell!.appendChild(this.input);

    this.input.value = this.#value;
    this.input.size = 'full';
    this.input.labelState = 'collapsed';
    this.input.colorVariant = isInline ? 'in-cell' : 'borderless';
    this.input.fieldHeight = String(cell?.dataGrid?.rowHeight);
    this.input.container?.querySelector<IdsTriggerField>('ids-trigger-field')?.focus();
    this.#attchEventListeners();

    if (isInline) {
      this.input.open();
    }
  }

  /**
   * Overrides data grid cell's focusout event handling
   * @param {FocusEvent} evt focus event
   */
  stopPropagation(evt: FocusEvent) {
    const tagName = evt.relatedTarget instanceof HTMLElement ? evt.relatedTarget.tagName : evt.relatedTarget;

    if (tagName === 'IDS-DROPDOWN' || tagName === 'IDS-LIST-BOX-OPTION') {
      evt.stopPropagation();
      evt.stopImmediatePropagation();
    }
  }

  /**
   * Attach dropdown event handlers
   */
  #attchEventListeners() {
    this.input?.onEvent('change', this.input, (evt) => { this.#value = evt.detail.value; });
    this.input?.onEvent('focusout', this.input, this.#stopPropagationCb);
  }

  /* Save selected dropdown value */
  save() {
    return { value: this.#value, dirtyCheckValue: this.input?.input?.value };
  }

  /**
   * Destroy dropdown editor
   */
  destroy(): void {
    this.input?.offEvent('change');
    this.input?.offEvent('focusout', this.input, this.#stopPropagationCb);
    this.#value = undefined;
  }
}

export const editors: Array<{ type: string, editor?: IdsDataGridEditor }> = [];

editors.push({
  type: 'input',
  editor: new InputEditor()
});

editors.push({
  type: 'checkbox',
  editor: new CheckboxEditor()
});

editors.push({
  type: 'dropdown',
  editor: new DropdownEditor()
});

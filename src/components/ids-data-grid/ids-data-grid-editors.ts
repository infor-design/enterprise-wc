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

export interface IdsDataGridEditor {
  /** The type of editor (i.e. input, dropdown, checkbox ect) */
  type: string;
  /** The main editor element */
  input?: IdsInput | IdsCheckbox | IdsDropdown;
  /** The function that invokes and sets values on the input */
  init: (cell?: IdsDataGridCell) => void;
  /** The function that transforms and saved the editor */
  save: (cell?: IdsDataGridCell) => void;
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
    return this.input?.value;
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
    return this.input?.checked;
  }

  /* Destroy the editor */
  destroy() {
    this.input?.offEvent('keydown');
    this.input = undefined;
  }
}

export class DropdownEditor implements IdsDataGridEditor {
  type = 'dropdown';

  input?: IdsDropdown;

  #value?: string | null;

  #stopPropagation = false;

  #stopPropagationCb = this.stopPropagation.bind(this);

  init(cell?: IdsDataGridCell): void {
    const settings = cell?.column?.editor?.editorSettings ?? {};
    const dataset = <any[]>settings?.options ?? [];

    this.#value = cell?.querySelector('[data-value]')?.getAttribute('data-value') ?? null;

    this.input = <IdsDropdown>document.createElement('ids-dropdown');
    this.input.insertAdjacentHTML('beforeend', '<ids-list-box></ids-list-box>');
    this.input.loadDataSet(dataset);
    this.input.typeahead = true;
    this.input.dirtyTracker = true;

    cell!.innerHTML = '';
    cell!.style.setProperty('overflow', 'visible');
    cell!.appendChild(this.input);

    this.input.value = this.#value;
    this.input.size = 'full';
    this.input.labelState = 'collapsed';
    this.input.colorVariant = 'borderless';

    // add styling for trigger field > .field-container

    this.input.container?.querySelector<IdsTriggerField>('ids-trigger-field')?.focus();
    this.#attchEventListeners(cell);
  }

  stopPropagation(evt: CustomEvent) {
    // try stop propgation if target isn't within cell
    if (this.#stopPropagation) {
      evt.stopImmediatePropagation();
    }
  }

  #attchEventListeners(cell?: IdsDataGridCell) {
    this.input?.onEvent('outside-click.dropdown', this.input, () => { cell?.cancelCellEdit(); });
    this.input?.onEvent('open', this.input, () => { this.#stopPropagation = true; });
    this.input?.onEvent('close', this.input, () => { this.#stopPropagation = false; });
    this.input?.onEvent('change', this.input, (evt) => { this.#value = evt.detail.value; });
    this.input?.onEvent('blur', this.input, this.#stopPropagationCb);
  }

  save() {
    return this.#value;
  }

  destroy(cell?: IdsDataGridCell | undefined): void {
    // remove event listeners
    this.input?.offEvent('change');
    this.input?.offEvent('open');
    this.input?.offEvent('close');
    this.input?.offEvent('blur', this.input, this.#stopPropagationCb);
    this.input?.offEvent('outside-click.dropdown');

    // revert cell style changes
    cell?.style.removeProperty('overflow');

    // unassign cache
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

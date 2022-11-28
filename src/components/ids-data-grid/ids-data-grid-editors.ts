import IdsCheckbox from '../ids-checkbox/ids-checkbox';
import IdsInput from '../ids-input/ids-input';
import type IdsDataGridCell from './ids-data-grid-cell';

export interface IdsDataGridEditorOptions {
  /** The type of editor (i.e. text, data, time, dropdown, checkbox, number ect) */
  type: string;
  /** The field in the data set to show */
  field: string;
  /** If true the editor will remain visible */
  inline: boolean;
}

export interface IdsDataGridEditor {
  /** The type of editor (i.e. text, data, time, dropdown, checkbox, number ect) */
  type: string;
  /** The main editor element */
  input?: IdsInput | IdsCheckbox;
  /** The function that invokes and sets values on the input */
  init: (cell?: IdsDataGridCell) => void;
  /** The function that transforms and saved the editor */
  save: () => void;
  /** The function that tears down all aspects of the editor */
  destroy: () => void;
}
export class TextEditor implements IdsDataGridEditor {
  /** The type of editor (i.e. text, data, time, dropdown, checkbox, number ect) */
  type = 'text';

  /** Holds the Editor */
  input?: IdsInput;

  /**
   * Create an input and set the value and focus states
   * @param {IdsDataGridCell} cell the cell element
   */
  init(cell?: IdsDataGridCell) {
    this.input = <IdsInput> document.createElement('ids-input');
    this.input.colorVariant = 'borderless';
    this.input.fieldHeight = String(cell?.dataGrid?.rowHeight);
    this.input.labelState = 'collapsed';

    // Clear cell and set value
    const value = cell?.innerText;
    cell!.innerHTML = '';
    cell?.appendChild(this.input as any);
    this.input.value = value;

    if (this.input instanceof IdsInput && cell) {
      this.input.shadowRoot?.querySelector('input')?.style.setProperty('width', `${cell.offsetWidth - 5}px`);
      this.input.padding = cell.dataGrid.cellPadding;
      this.input.select();
    }
    this.input.focus();
  }

  /* Transform the value */
  save() {
    return this.input?.value;
  }

  /* Destroy the editor */
  destroy() {
    this.input?.remove();
  }
}

export const editors: Array<{ type: string, editor?: IdsDataGridEditor }> = [];
editors.push({
  type: 'input',
  editor: new TextEditor()
});

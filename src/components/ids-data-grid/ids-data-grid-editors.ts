import IdsCheckbox from '../ids-checkbox/ids-checkbox';
import IdsInput from '../ids-input/ids-input';

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
  init: () => void;
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

  /** Create an input and set the value and focus states */
  init() {
    this.input = <IdsInput> document.createElement('ids-input');
    this.input.colorVariant = 'borderless';
    this.input.fieldHeight = 'lg';
    this.input.labelState = 'collapsed';
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
  type: 'text',
  editor: new TextEditor()
});

// eslint-disable-next-line max-classes-per-file
import IdsCheckbox from '../ids-checkbox/ids-checkbox';
import IdsInput from '../ids-input/ids-input';
import IdsDropdown from '../ids-dropdown/ids-dropdown';
import '../ids-time-picker/ids-time-picker';
import '../ids-date-picker/ids-date-picker';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import type IdsDatePicker from '../ids-date-picker/ids-date-picker';
import type IdsDatePickerPopup from '../ids-date-picker/ids-date-picker-popup';
import type IdsTimePicker from '../ids-time-picker/ids-time-picker';
import type IdsTimePickerPopup from '../ids-time-picker/ids-time-picker-popup';
import type IdsDataGridCell from './ids-data-grid-cell';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { isValidDate } from '../../utils/ids-date-utils/ids-date-utils';

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
  input?: IdsInput | IdsCheckbox | IdsDropdown | IdsDatePicker | IdsTimePicker;
  /** Optional Popup interface for some cell types */
  popup?: IdsDatePickerPopup | IdsTimePickerPopup;
  /** The function that invokes and sets values on the input */
  init: (cell?: IdsDataGridCell) => void;
  /** The function that transforms and saved the editor */
  save: (cell?: IdsDataGridCell) => IdsDataGridSaveValue | undefined | null;
  /** The function that tears down all aspects of the editor */
  destroy: (cell?: IdsDataGridCell) => void;
  /** MouseEvent if click was used to edit */
  clickEvent?: MouseEvent;
  /** The function that returns the input-element's value */
  value: () => boolean | number | string;
  /** The function that changes the input-element's value */
  change: (newValue: boolean | number | string) => void;
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
    this.input.fieldHeight = String(cell?.dataGrid?.rowHeight) === 'xxs' ? `xs` : String(cell?.dataGrid?.rowHeight);
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

  value() {
    return this.input?.value ?? '';
  }

  change(newValue: boolean | number | string) {
    if (this.input) this.input.value = String(newValue);
  }
}
export class CheckboxEditor implements IdsDataGridEditor {
  /** The type of editor (i.e. input, dropdown, checkbox ect) */
  type = 'checkbox';

  /** Holds the Editor */
  input?: IdsCheckbox;

  /** MouseEvent if click was used to edit */
  clickEvent?: MouseEvent;

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
    if (!this.clickEvent) this.input.noAnimation = true;
    this.input.checked = this.clickEvent ? !value : value;

    cell?.appendChild(this.input as any);
    this.input.focus();
    if (this.clickEvent) {
      requestAnimationFrame(() => {
        cell?.endCellEdit();
        cell?.focus();
      });
    }
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

  value() {
    return !!this.input?.checked;
  }

  change(newValue: boolean | number | string) {
    if (this.input) this.input.checked = Boolean(newValue);
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

  /** MouseEvent if click was used to edit */
  clickEvent?: MouseEvent;

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
    cell!.appendChild(this.input);

    this.input.value = this.#value;
    this.input.size = 'full';
    this.input.labelState = 'collapsed';
    this.input.colorVariant = isInline ? 'in-cell' : 'borderless';
    this.input.fieldHeight = String(cell?.dataGrid?.rowHeight) === 'xxs' ? `xs` : String(cell?.dataGrid?.rowHeight);
    this.input.container?.querySelector<IdsTriggerField>('ids-trigger-field')?.focus();
    this.#attchEventListeners();
    this.input.open();
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

  value() {
    return this.input?.value ?? '';
  }

  change(newValue: boolean | number | string) {
    if (this.input) this.input.value = String(newValue);
  }
}

export class DatePickerEditor implements IdsDataGridEditor {
  public type = 'datepicker';

  public input?: IdsTriggerField;

  public popup?: IdsDatePickerPopup;

  clickEvent?: MouseEvent;

  #value?: Date;

  #displayValue = '';

  init(cell?: IdsDataGridCell) {
    this.input = this.#buildDatePickerTriggerField(cell!);
    this.popup = this.#buildDatePickerPopup(cell!);
    const autoOpen = (<HTMLElement> this.clickEvent?.target)?.classList?.contains('editor-cell-icon');

    // parse date string
    this.#update(cell!, cell!.originalValue as string);

    // insert datepicker component and focus
    cell!.innerHTML = '';
    cell!.appendChild(this.input);
    cell!.appendChild(this.popup);

    this.input.value = this.#displayValue;
    this.popup?.syncDateAttributes(this.#value ?? new Date());
    if (this.input) this.input.autoselect = true;

    if (this.popup) {
      const popup = this.popup;
      this.popup.value = this.#displayValue;
      this.popup.attachment = '.ids-data-grid-wrapper';
      this.popup.slot = 'menu-container';

      this.popup.appendToTargetParent();
      this.popup.popupOpenEventsTarget = document.body;
      this.popup.onOutsideClick = (e: MouseEvent) => {
        if (!e.composedPath().includes(popup)) { popup.hide(); }
      };

      // apply popup required settings
      this.popup.id = `${cell!.column.field}-date-picker-popup`;
      this.popup.triggerType = 'click';
      this.popup.triggerElem = `#${cell!.column.field}-date-picker-btn`;
      this.popup.target = `#${cell!.column.field}-date-picker`;

      this.popup.popup!.arrowTarget = `#${cell!.column.field}-date-picker-btn`;
      this.popup.popup!.y = 16;
      this.popup.refreshTriggerEvents();

      if (autoOpen) {
        this.popup.show();
        this.popup.focus();
      } else {
        this.input.focus();
      }
    }

    this.#attachEventListeners(cell);
  }

  #buildDatePickerTriggerField(cell: IdsDataGridCell): IdsTriggerField {
    const component = <IdsTriggerField>document.createElement('ids-trigger-field');

    // apply user settings
    applySettings(component, cell?.column.editor?.editorSettings);

    component.id = `${cell.column.field}-date-picker`;
    component.fieldHeight = String(cell?.dataGrid?.rowHeight) === 'xxs' ? `xs` : String(cell?.dataGrid?.rowHeight);
    component.labelState = 'collapsed';
    component.colorVariant = 'borderless';
    component.size = 'full';
    component.mask = true;

    component.insertAdjacentHTML(
      'beforeend',
      `<ids-trigger-button
        class="ids-trigger-field-slot-trigger-end"
        id="${cell.column.field}-date-picker-btn"
        slot="trigger-end"
        icon="calendar"></ids-trigger-button>`
    );

    return component;
  }

  #buildDatePickerPopup(cell: IdsDataGridCell): IdsDatePickerPopup {
    const component = <IdsDatePickerPopup>document.createElement('ids-date-picker-popup');

    // apply user settings
    applySettings(component, cell?.column.editor?.editorSettings);

    return component;
  }

  #update(cell: IdsDataGridCell, dateString: string) {
    const inputDate = cell?.dataGrid.localeAPI.parseDate(dateString) as Date;

    if (!dateString || !isValidDate(inputDate)) {
      this.#displayValue = dateString;
      this.#value = undefined;
      return;
    }

    // update orignial date value to retain hours, minutes, seconds
    if (this.#value instanceof Date) {
      this.#value.setFullYear(inputDate.getFullYear());
      this.#value.setMonth(inputDate.getMonth());
      this.#value.setDate(inputDate.getDate());
    } else {
      this.#value = inputDate;
    }

    this.#displayValue = cell!.dataGrid.localeAPI.formatDate(this.#value);
  }

  #stopPropagation(evt: FocusEvent): void {
    const isOpen = this.input?.popup?.hidden === false;
    if (isOpen) evt.stopImmediatePropagation();
  }

  #attachEventListeners(cell?: IdsDataGridCell | undefined) {
    const focusOutHandler = (evt: FocusEvent) => this.#stopPropagation(evt);
    this.input?.onEvent('focusout', this.input, focusOutHandler, { capture: true });
    this.popup?.onEvent('hide', this.popup, () => {
      if (cell!.contains(cell!.dataGrid!.shadowRoot!.activeElement)) return;
      cell?.focus();
    });
  }

  save(cell?: IdsDataGridCell) {
    this.#update(cell!, cell?.value);

    return {
      value: this.#value?.toISOString() ?? '',
      dirtyCheckValue: this.#displayValue
    };
  }

  destroy() {
    this.input?.offEvent('focusout');
    this.input?.offEvent('outsideclick.datepicker');
    this.popup?.offEvent('hide');
    this.popup?.remove();

    this.#value = undefined;
    this.#displayValue = '';
  }

  value() {
    return this.input?.input?.value ?? '';
  }

  change(newValue: boolean | number | string) {
    if (this.input?.input) this.input.input.value = String(newValue);
  }
}

export class TimePickerEditor implements IdsDataGridEditor {
  type = 'timepicker';

  input?: IdsTriggerField;

  popup?: IdsTimePickerPopup;

  clickEvent?: MouseEvent;

  #originalDate?: Date;

  init(cell?: IdsDataGridCell | undefined) {
    this.input = this.#buildTimePickerTriggerField(cell!);
    this.popup = this.#buildTimePickerPopup(cell!);
    const autoOpen = (<HTMLElement> this.clickEvent?.target)?.classList?.contains('editor-cell-icon');

    // parse date string
    const dateString = cell!.originalValue as string ?? '';
    const date = cell!.dataGrid!.localeAPI!.parseDate(dateString, undefined, true) as Date;
    const isValid = isValidDate(date);
    this.#originalDate = isValid ? date : undefined;
    this.input.value = isValid ? cell!.dataGrid!.localeAPI!.formatDate(this.#originalDate, { pattern: this.input.format }) : '';

    // insert time picker and focus
    cell!.innerHTML = '';
    cell!.appendChild(this.input);
    cell!.appendChild(this.popup);

    this.input.autoselect = true;

    if (this.popup) {
      const popup = this.popup;
      this.popup.attachment = '.ids-data-grid-wrapper';
      this.popup.slot = 'menu-container';

      this.popup.appendToTargetParent();
      this.popup.popupOpenEventsTarget = document.body;
      this.popup.onOutsideClick = (e: MouseEvent) => {
        if (!e.composedPath().includes(popup)) { popup.hide(); }
      };

      // apply popup required settings
      this.popup.id = `${cell!.column.field}-time-picker-popup`;
      this.popup.triggerType = 'click';
      this.popup.triggerElem = `#${cell!.column.field}-time-picker-btn`;
      this.popup.target = `#${cell!.column.field}-time-picker`;

      this.popup.popup!.arrowTarget = `#${cell!.column.field}-time-picker-btn`;
      this.popup.popup!.y = 16;
      this.popup.refreshTriggerEvents();

      if (this.#originalDate) {
        const hours = this.#originalDate.getHours();
        this.popup.hours = hours > 11 ? hours - 12 : hours;
        this.popup.minutes = this.#originalDate.getMinutes();
        this.popup.seconds = this.#originalDate.getSeconds();
        this.popup.period = hours > 11 ? 'PM' : 'AM';
      }

      if (autoOpen) {
        this.popup.show();
        this.popup.focus();
      } else {
        this.input.focus();
      }
    }

    this.#attachEventListeners(cell);
  }

  #buildTimePickerTriggerField(cell: IdsDataGridCell): IdsTriggerField {
    const component = <IdsTriggerField>document.createElement('ids-trigger-field');

    // apply user settings
    applySettings(component, cell?.column.editor?.editorSettings);

    // apply required settings
    component.id = `${cell.column.field}-time-picker`;
    component.fieldHeight = String(cell?.dataGrid?.rowHeight) === 'xxs' ? `xs` : String(cell?.dataGrid?.rowHeight);
    component.labelState = 'collapsed';
    component.colorVariant = 'borderless';
    component.size = 'full';
    component.mask = true;

    component.insertAdjacentHTML(
      'beforeend',
      `<ids-trigger-button
        class="ids-trigger-field-slot-trigger-end"
        id="${cell.column.field}-time-picker-btn"
        slot="trigger-end"
        icon="clock"></ids-trigger-button>`
    );

    return component;
  }

  #buildTimePickerPopup(cell: IdsDataGridCell): IdsTimePickerPopup {
    const popup = <IdsTimePickerPopup>document.createElement('ids-time-picker-popup');

    // apply user settings
    applySettings(popup, cell?.column.editor?.editorSettings);

    return popup;
  }

  #stopPropagation(evt: FocusEvent | CustomEvent) {
    const target = (evt instanceof FocusEvent ? evt.relatedTarget : evt.target) as HTMLElement | null;
    const isOpen = this.input?.container?.classList.contains('is-open');
    if (target?.tagName === 'IDS-DATA-GRID-CELL' || isOpen) {
      evt.stopImmediatePropagation();
    }
  }

  #attachEventListeners(cell?: IdsDataGridCell | undefined) {
    const tabHandler = (evt: CustomEvent) => this.#stopPropagation(evt);
    const focusOutHandler = (evt: FocusEvent) => this.#stopPropagation(evt);

    this.input?.onEvent('focusout', this.input, focusOutHandler, { capture: true });
    this.input?.listen(['Tab', 'Enter'], this.input, tabHandler);
    this.popup?.onEvent('hide', this.popup, () => {
      if (cell!.contains(cell!.dataGrid!.shadowRoot!.activeElement)) return;
      cell?.focus();
    });
  }

  save(cell?: IdsDataGridCell) {
    let date;
    const inputValue = this.input!.value;
    if (inputValue) {
      date = cell!.dataGrid.localeAPI!.parseDate(inputValue, { pattern: this.input!.format }, true) as Date;

      // Timepicker formats don't include the "date" portion,
      // So this fills in the missing parts from the `#originalDate` if possible to save a valid date value.
      if (this.#originalDate && (
        this.#originalDate.getMonth() !== date.getMonth()
        || this.#originalDate.getFullYear() !== date.getFullYear()
        || this.#originalDate.getDate() !== date.getDate()
      )) {
        date.setMonth(this.#originalDate.getMonth());
        date.setFullYear(this.#originalDate.getFullYear());
        date.setDate(this.#originalDate.getDate());
      }
    }

    return {
      value: date && isValidDate(date) ? date.toISOString() : undefined,
      dirtyCheckValue: inputValue
    };
  }

  destroy() {
    this.input?.offEvent('focusout');
    this.input?.detachAllListeners();
    this.input?.remove();
    this.popup?.offEvent('hide');
    this.popup?.detachAllListeners();
    this.popup?.remove();
    this.#originalDate = undefined;
  }

  value() {
    return this.input?.value ?? '';
  }

  change(newValue: boolean | number | string) {
    if (this.input) this.input.value = String(newValue);
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

editors.push({
  type: 'datepicker',
  editor: new DatePickerEditor()
});

editors.push({
  type: 'timepicker',
  editor: new TimePickerEditor()
});

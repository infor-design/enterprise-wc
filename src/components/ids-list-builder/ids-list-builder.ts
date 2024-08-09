import { customElement, scss } from '../../core/ids-decorators';
import IdsInput from '../ids-input/ids-input';
import '../ids-toolbar/ids-toolbar';
import IdsListView from '../ids-list-view/ids-list-view';

import styles from './ids-list-builder.scss';
import IdsSwappableItem from '../ids-swappable/ids-swappable-item';

import type IdsToolbar from '../ids-toolbar/ids-toolbar';
import type IdsSwappable from '../ids-swappable/ids-swappable';
import type IdsListViewItem from '../ids-list-view/ids-list-view-item';

/**
 * IDS ListBuilder Component
 * @type {IdsListBuilder}
 * @inherits IdsListView
 * @part container - the container element
 */
@customElement('ids-list-builder')
@scss(styles)
export default class IdsListBuilder extends IdsListView {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * A clone of the list item being dragged,
   * it appears during drag to help visualize where the dragged item's position
   */
  placeholder: any;

  /**
   * List of actions can be performed
   */
  actions = {
    ADD: 'add',
    EDIT: 'edit',
    DELETE: 'delete',
    MOVE_UP: 'move-up',
    MOVE_DOWN: 'move-down',
  };

  connectedCallback() {
    this.sortable = true;
    this.#initToolbar();
    super.connectedCallback();
    this.#attachEventListeners();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array<string>} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <div class="ids-list-builder">
        <div class="toolbar-container" part="toolbar-container">
          <slot name="toolbar"></slot>
        </div>
        ${super.template()}
      </div>
    `;
  }

  /**
   * Get toolbar template
   * @returns {string} The template
   */
  toolbarTemplate(): string {
    const actions = this.actions;
    return `
      <ids-toolbar slot="toolbar" type="formatter" tabbable="true">
        <ids-toolbar-section type="buttonset">
          ${this.buttonTemplate({ action: actions.ADD, icon: 'add', text: 'Add New' })}
          <ids-separator vertical></ids-separator>
          ${this.buttonTemplate({ action: actions.MOVE_UP, icon: 'arrow-up', text: 'Move Up' })}
          ${this.buttonTemplate({ action: actions.MOVE_DOWN, icon: 'arrow-down', text: 'Move Down' })}
          <ids-separator vertical></ids-separator>
          ${this.buttonTemplate({ action: actions.EDIT, icon: 'edit', text: 'Edit' })}
          ${this.buttonTemplate({ action: actions.DELETE, icon: 'delete', text: 'Delete' })}
        </ids-toolbar-section>
      </ids-toolbar>
    `;
  }

  /**
   * Get toolbar button template
   * @param {object} [options] The button options
   * @param {string} [options.action] The button action
   * @param {string} [options.icon] The button icon
   * @param {string} [options.text] The button text
   * @returns {string} The template
   */
  buttonTemplate(options: { action: string, icon: string, text: string }): string {
    const { action, icon, text } = options;
    return `
      <ids-button list-builder-action="${action}" tooltip="${text}" color-variant="alternate-formatter">
        <span class="audible">${text}</span>
        <ids-icon icon="${icon}"></ids-icon>
      </ids-button>
    `;
  }

  /**
   * Init the toolbar
   * @private
   * @returns {void}
   */
  #initToolbar(): void {
    const slot = this.querySelector('[slot="toolbar"]');
    if (!slot) {
      this.insertAdjacentHTML('afterbegin', this.toolbarTemplate());
    }
  }

  /**
   * Get the parent element
   * @returns {IdsToolbar|null} the parent element
   */
  get parentEl(): IdsSwappable | null | undefined {
    return this.shadowRoot?.querySelector('ids-swappable');
  }

  /**
   * Get the toolbar element
   * @returns {IdsToolbar|null} the toolbar element
   */
  get toolbar(): IdsToolbar | null {
    return this.querySelector('ids-toolbar');
  }

  get dataKeys(): Array<any> {
    return super.dataKeys;
  }

  set dataKeys(val: Array<any>) {
    super.dataKeys = val;
  }

  get data(): Array<any> {
    return super.data;
  }

  /**
   * Set the data set of the list
   * @param {Array<any>} val The list of items
   */
  set data(val: Array<any>) {
    super.data = val;

    // need to reattach event listeners when new data set dynamically adds list items
    this.#attachEventListeners();
  }

  /**
   * Attaches all the listeners which allow for clicking,
   * dragging, and keyboard interaction with the list items
   * @private
   * @returns {void}
   */
  #attachEventListeners(): void {
    this.#attachClickListeners(); // for toolbar buttons
    this.#attachKeyboardListeners();
  }

  /**
   * Handle given action.
   * @private
   * @param {string} action The action
   * @returns {void}
   */
  #handleAction(action: string): void {
    if (action === this.actions.ADD) this.add();
    if (action === this.actions.EDIT) this.edit();
    if (action === this.actions.DELETE) this.delete();
    if (action === this.actions.MOVE_UP) this.moveUp();
    if (action === this.actions.MOVE_DOWN) this.moveDown();
  }

  /**
   * Add new item after selected item(s) or at the very end of list
   */
  add() {
    const lastItem = this.itemsSelected.at(-1) ?? this.items.at(-1);
    const newItem = document.createElement('ids-list-view-item') as IdsListViewItem;

    const swappable = document.createElement('ids-swappable-item') as IdsSwappableItem;
    swappable.append(newItem);

    const swappableParent = lastItem?.swappableParent ?? this.shadowRoot?.querySelector('ids-swappable');
    swappableParent?.after(swappable);

    if (lastItem?.swappableParent && this.selectable === 'single') lastItem.swappableParent.selected = false;

    newItem.activated = true;
    newItem.selected = true;
    swappable.selected = true;

    this.triggerEvent('itemAdd', this, { detail: newItem.rowData });
    this.edit();
  }

  /**
   * Edit selected item
   */
  edit() {
    const itemFocused = this.itemsSelected.at(0);
    if (!itemFocused) return;

    if (itemFocused.swappableParent) itemFocused.swappableParent.selected = true;

    this.triggerEvent('itemChange', this, { detail: itemFocused.rowData });

    const editableElements = itemFocused.templateElements();
    const firstFieldName = Object.keys(editableElements)[0] ?? 'unknownField';
    const firstEditableField = editableElements[firstFieldName] ?? itemFocused?.querySelector('ids-text') ?? itemFocused;

    const originalValue = (firstEditableField?.textContent ?? '').trim() || 'New Value';
    firstEditableField.innerHTML = originalValue;

    const input = new IdsInput();
    input.name = firstFieldName;
    input.value = originalValue;
    input.autoselect = 'true';
    input.noMargins = 'true';
    input.colorVariant = 'list-builder';

    itemFocused?.classList.add('is-editing');
    itemFocused?.prepend(input); // insert into DOM
    input.focus();

    this.onEvent('keydown.listbuilder-editor', input, (evt) => {
      const code = evt.code || 'Space';
      if (code === 'Space') evt.stopImmediatePropagation(); // keep spacebar working
    });

    this.onEvent('keyup.listbuilder-editor', input, (evt) => {
      evt.stopImmediatePropagation();
      firstEditableField.innerHTML = input.value ?? '';
    });

    this.onEvent('blur.listbuilder-editor', input, () => {
      itemFocused.rowData = { [firstFieldName]: firstEditableField.textContent };
      itemFocused?.classList.remove('is-editing');

      input.remove();
      itemFocused.focus();
    });

    this.listen('Escape', input, () => {
      input.value = originalValue;
      firstEditableField.innerHTML = originalValue;
      input.blur();
    });

    input.addEventListener('keydown', (evt: KeyboardEvent) => {
      const keyCode = evt.code || 'Space';
      if (['Backspace', 'Delete', 'Enter'].includes(keyCode)) {
        evt.stopImmediatePropagation();
      }
      if (evt.code === 'Enter') input.blur();
    });
  }

  /**
   * Delete selected item(s)
   */
  delete() {
    const itemsSelected = this.itemsSelected;
    const lastSelected = itemsSelected.at(-1);
    const nextEnabled = lastSelected?.nextEnabled;

    itemsSelected.forEach((item) => {
      const isLastSelected = item === lastSelected;
      const deletedData = item.rowData;
      if (this.data[item.rowIndex]) this.data[item.rowIndex] = null;

      this.triggerEvent('itemDelete', this, { detail: deletedData });
      item.swappableParent?.remove();
      item?.remove();

      // TODO: after deleteing, I cannot arrowUp past this focused item @see item.prevEnabled/item.nextEnabled
      if (isLastSelected) nextEnabled?.focus();
    });
  }

  /**
   * Move up selected item(s)
   */
  moveUp() {
    const selected = this.itemsSelected;
    const firstSelected = selected[0];
    if (firstSelected) {
      const parents = selected.map((item) => item.swappableParent!);
      firstSelected.swappableParent?.previousElementSibling?.before(...parents);
      this.triggerEvent('itemMoveUp', this, { detail: { dataSet: this.data } });

      // this.resetIndices();
    }
  }

  /**
   * Move down selected item(s)
   */
  moveDown() {
    const selected = this.itemsSelected;
    const lastSelected = selected.at(-1);
    if (lastSelected) {
      const parents = selected.map((item) => item.swappableParent!);
      lastSelected.swappableParent?.nextElementSibling?.after(...parents);
      this.triggerEvent('itemMoveDown', this, { detail: { dataSet: this.data } });
    }
  }

  /**
   * Attaches functionality for toolbar button interaction
   * @private
   * @returns {void}
   */
  #attachClickListeners(): void {
    // Attach toolbar events
    this.onEvent('selected.list-builder-toolbar', this.toolbar, (e: CustomEvent) => {
      e.stopImmediatePropagation();
      const action = e.detail?.elem?.getAttribute('list-builder-action');
      this.#handleAction(action);
    });

    // After drag end
    this.offEvent('afterdragend.listbuilder', this.container);
    this.onEvent('afterdragend.listbuilder', this.container, (e) => {
      const editableItem = e.detail?.elem?.querySelector('.is-editing');
      if (editableItem) editableItem?.querySelector('ids-input')?.focus();
    });
  }

  #attachKeyboardListeners(): void {
    this.unlisten('Enter');
    this.unlisten('ArrowUp');
    this.unlisten('ArrowDown');
    this.unlisten('Delete');
    this.offEvent('keydown', this);

    this.onEvent('keydown', this, (event: KeyboardEvent) => {
      const keyCode = String(event.key).trim() || 'Space';
      switch (keyCode) {
        case 'Enter': // edits the list item
          event.stopImmediatePropagation();
          if (!this.itemFocused?.classList.contains('is-editing')) this.edit();
          break;
        case 'Space': // selects the list item
          break;
        case 'Tab':
        case 'ArrowUp':
        case 'ArrowDown':
          break;
        case 'Backspace':
        case 'Delete':
          this.delete();
          break;
        default:
          break;
      }
    });
  }

  set virtualScroll(value: string | boolean) {
    // Do nothing
  }

  /**
   * List builder does not support VS
   * @returns {boolean} false
   */
  get virtualScroll(): boolean {
    return false;
  }
}

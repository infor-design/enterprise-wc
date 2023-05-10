import { customElement, scss } from '../../core/ids-decorators';
import IdsInput from '../ids-input/ids-input';
import '../ids-toolbar/ids-toolbar';
import IdsListView from '../ids-list-view/ids-list-view';

import styles from './ids-list-builder.scss';
import IdsSwappableItem from '../ids-swappable/ids-swappable-item';

import type IdsToolbar from '../ids-toolbar/ids-toolbar';
import type IdsSwappable from '../ids-swappable/ids-swappable';

/**
 * IDS ListBuilder Component
 * @type {IdsListBuilder}
 * @inherits IdsListView
 * @mixes IdsEventsMixin
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

  /** Active editor of the selected list item */
  #selectedLiEditor: IdsInput | null = null;

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
    const a = this.actions;
    return `
      <ids-toolbar slot="toolbar" type="formatter" tabbable="true">
        <ids-toolbar-section type="buttonset">
          ${this.buttonTemplate({ action: a.ADD, icon: 'add', text: 'Add New' })}
          <ids-separator vertical></ids-separator>
          ${this.buttonTemplate({ action: a.MOVE_UP, icon: 'arrow-up', text: 'Move Up' })}
          ${this.buttonTemplate({ action: a.MOVE_DOWN, icon: 'arrow-down', text: 'Move Down' })}
          <ids-separator vertical></ids-separator>
          ${this.buttonTemplate({ action: a.EDIT, icon: 'edit', text: 'Edit' })}
          ${this.buttonTemplate({ action: a.DELETE, icon: 'delete', text: 'Delete' })}
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

  /**
   * Set the selection mode of the listview
   * @param {string} value true to use virtual scrolling
   */
  set selectable(value: string | null) {
    super.selectable = value;
  }

  get selectable(): string | null {
    return super.selectable;
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
   * Removes and unfocuses any active list item editor after updating the list item's value
   * @private
   * @returns {void}
   */
  #unfocusAnySelectedLiEditor(): void {
    if (this.#selectedLiEditor) {
      this.#removeSelectedLiEditor();
      this.updateDataFromDOM();
    }
  }

  /**
   * Helper function to update the list item inner text with the editor's input value
   * @private
   * @returns {void}
   */
  #updateSelectedLiWithEditorValue(): void {
    const listItem = this.selectedLi?.querySelector('div[part="list-item"]');
    const textElem = listItem?.querySelector('ids-text');
    if (textElem) textElem.innerHTML = this.#selectedLiEditor?.value ?? '';
  }

  /**
   * Helper function to remove the editor element from the DOM
   * @private
   * @returns {void}
   */
  #removeSelectedLiEditor(): void {
    this.offEvent('keyup', this.#selectedLiEditor);
    if (this.#selectedLiEditor) {
      (this.#selectedLiEditor?.parentNode as HTMLElement)?.classList.remove('is-editing');
      this.#selectedLiEditor.remove();
    }
    this.#selectedLiEditor = null;
  }

  /**
   * Helper function to insert an editor into the DOM and hide the inner text of the list item
   * @param {boolean | null} newEntry whether or not this is an editor for a new or pre-existing list item
   * @private
   * @returns {void}
   */
  #insertSelectedLiWithEditor(newEntry: boolean | null = false): void {
    if (this.selectedLi) {
      this.triggerEvent('itemChange', this, {
        detail: this.getListItemData(this.selectedLi)
      });

      if (!this.#selectedLiEditor) {
        const i = new IdsInput();
        const selectorStr = this.selectable === 'single' ? 'div[part="list-item"]' : '.list-item-content';
        const listItem = this.selectedLi.querySelector(selectorStr);

        // insert into DOM
        listItem?.insertBefore(i, listItem.querySelector('ids-text'));

        // hide inner text
        listItem?.classList.add('is-editing');

        // set the value of input
        this.#selectedLiEditor = i;
        i.value = newEntry ? 'New Value' : listItem?.querySelector('ids-text')?.innerHTML;
        i.autoselect = 'true';
        i.noMargins = 'true';
        i.colorVariant = 'list-builder';
        i.focus();

        // update inner text on keyup
        this.onEvent('keyup', i, () => this.#updateSelectedLiWithEditorValue());
      } else {
        this.#selectedLiEditor.focus();
      }
    }
  }

  get selectedLi() {
    return this.shadowRoot?.querySelector<IdsSwappableItem>('ids-swappable-item[selected]');
  }

  get allSelectedLi() {
    return this.shadowRoot?.querySelectorAll<IdsSwappableItem>('ids-swappable-item[selected]');
  }

  /**
   * Remove selected list item
   * @private
   * @returns {void}
   */
  #removeAllSelectedLi(): void {
    const items = this.allSelectedLi || [];
    const indexOfItems = [];

    for (const item of items) {
      indexOfItems.push(item.getAttribute('index'));
      this.triggerEvent('itemDelete', this, {
        detail: this.getListItemData(item)
      });

      item.remove();
      if (this.#selectedLiEditor) this.#selectedLiEditor = null;
    }

    this.resetIndices();
    this.updateDataFromDOM();

    for (const index of indexOfItems) {
      const liItem = this.shadowRoot?.querySelector<IdsSwappableItem>(`ids-swappable-item[index="${index}"]`);

      if (liItem) {
        this.toggleSelectedLi(liItem);
      }
    }
  }

  /**
   * Helper function for swapping nodes in the list item -- used when dragging list items or clicking the up/down arrows
   * @param {Node} nodeA the first node
   * @param {Node} nodeB the second node
   */
  swap(nodeA: Node, nodeB: Node) {
    nodeB.parentNode?.insertBefore(nodeA, nodeB);
  }

  /**
   * Add new item
   * @returns {void}
   */
  add(): void {
    // Deselect more than one selection, if selectable multiple or mixed type
    if (this.selectable && this.selectable !== 'single') {
      const items = [...(this.allSelectedLi || [])];
      if (items.length > 1) {
        items.shift(); // Keep selected first in list
        items.forEach((item: any) => this.toggleSelectedAttribute(item, false));
      }
    }
    this.#unfocusAnySelectedLiEditor();
    let newSwappableItem;

    if (!this.data.length) {
      // if list is empty, add new item data to the source data
      const newItemData: { [key: string]: any } = {};
      this.dataKeys.forEach((key: string) => {
        newItemData[key] = 'New Value';
      });
      this.shadowRoot?.querySelector('.ids-list-builder')?.remove();
      this.data = [newItemData];
      this.redraw?.();
      newSwappableItem = this.shadowRoot?.querySelector<IdsSwappableItem>('ids-swappable-item');
    } else {
      const selectionNull = !this.selectedLi;
      // if an item is selected, create a node under it, otherwise create a node above the first item

      let targetDraggableItem = selectionNull ? this.shadowRoot?.querySelector<IdsSwappableItem>('ids-swappable-item') : this.selectedLi;
      if (!targetDraggableItem) {
        targetDraggableItem = new IdsSwappableItem();
      }
      newSwappableItem = targetDraggableItem.cloneNode(true) as HTMLElement;

      const insertionLocation = selectionNull ? targetDraggableItem : targetDraggableItem.nextSibling;
      if (targetDraggableItem.parentNode) {
        targetDraggableItem.parentNode.insertBefore(newSwappableItem, insertionLocation);
        targetDraggableItem.removeAttribute('selected');
      }
    }

    newSwappableItem?.setAttribute('selected', '');
    const listItem = newSwappableItem?.querySelector('div[part="list-item"]');

    const listItemText = listItem?.querySelector('ids-text');
    if (listItemText) listItemText.innerHTML = 'New Value';
    // remove any selected attribute on li that may have propogated from the clone
    if (listItem?.getAttribute('selected')) listItem.removeAttribute('selected');
    this.resetIndices();

    const newEntry = true;
    this.#insertSelectedLiWithEditor(newEntry);
    this.focusLi(newSwappableItem);
    this.#attachClickListenersForLi(newSwappableItem);
    this.#attachKeyboardListenersForLi(newSwappableItem);

    this.triggerEvent('itemAdd', this, { detail: this.getListItemData(newSwappableItem) });
  }

  /**
   * Delete selected
   * @returns {void}
   */
  delete(): void {
    this.#removeAllSelectedLi();
  }

  /**
   * Edit selected item
   * @returns {void}
   */
  edit(): void {
    this.#insertSelectedLiWithEditor();
  }

  /**
   * Move up selected
   * @returns {void}
   */
  moveUp(): void {
    if (this.selectedLi) {
      this.#unfocusAnySelectedLiEditor();
      let isMoved = false;

      const items = [...(this.allSelectedLi || [])];
      const prev = this.selectedLi?.previousElementSibling;

      // Multiple selection
      if (items.length > 1) {
        if (prev) {
          isMoved = true;
          prev.before(...items);
        } else {
          const shouldMove = items.some((item, i) => (String(i + 1) !== item.getAttribute('aria-posinset')));
          if (shouldMove) {
            isMoved = true;
            this.parentEl?.prepend(...items);
          }
        }
      } else if (prev) {
        // Single selection
        isMoved = true;
        this.swap(this.selectedLi, prev);
      }

      if (isMoved) {
        this.resetIndices();
        this.updateDataFromDOM();
        this.triggerEvent('itemMoveUp', this, { detail: { dataSet: this.data } });
      }
    }
  }

  /**
   * Move down selected
   * @returns {void}
   */
  moveDown(): void {
    if (this.selectedLi) {
      this.#unfocusAnySelectedLiEditor();
      let isMoved = false;

      const items = [...(this.allSelectedLi || [])];
      const len = items.length;
      let next = this.selectedLi?.nextElementSibling;

      // Multiple selection
      if (len > 1) {
        next = items[len - 1]?.nextElementSibling;
        if (next) {
          isMoved = true;
          next.after(...items);
        } else {
          const size = Number.parseInt(items[0].getAttribute('aria-setsize') as string, 10);
          const shouldMove = items.some((item, i) => (
            String((size - (len - 1)) + i) !== item.getAttribute('aria-posinset')
          ));
          if (shouldMove) {
            isMoved = true;
            this.parentEl?.append(...items);
          }
        }
      } else if (next) {
        // Single selection
        isMoved = true;
        this.swap(next, this.selectedLi);
      }

      if (isMoved) {
        this.resetIndices();
        this.updateDataFromDOM();
        this.triggerEvent('itemMoveDown', this, { detail: { dataSet: this.data } });
      }
    }
  }

  /**
   * Handle given action.
   * @private
   * @param {string} action The action
   * @returns {void}
   */
  #handleAction(action: string): void {
    const a = this.actions;
    switch (action) {
      case a.ADD: this.add(); break;
      case a.DELETE: this.delete(); break;
      case a.EDIT: this.edit(); break;
      case a.MOVE_DOWN: this.moveDown(); break;
      case a.MOVE_UP: this.moveUp(); break;
      default: break;
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
      if (editableItem) this.#selectedLiEditor?.focus();
    });

    this.getAllSwappableItems()?.forEach((li: any) => {
      this.#attachClickListenersForLi(li);
    });
  }

  /**
   * Add/remove the editor in one function,
   * used when `Enter` key is hit on a selected list item
   * @private
   * @returns {void}
   */
  #toggleEditor(): void {
    if (this.selectedLi) {
      if (!this.#selectedLiEditor) {
        this.#insertSelectedLiWithEditor();
      } else {
        this.#unfocusAnySelectedLiEditor();
      }
      this.focusLi(this.selectedLi);
    }
  }

  #attachKeyboardListeners(): void {
    this.getAllSwappableItems()?.forEach((li: any) => {
      this.#attachKeyboardListenersForLi(li);
    });
  }

  /**
   * Helper function to attach mouse events to each individual item
   * @private
   * @param {any} li the list item
   * @returns {void}
   */
  #attachClickListenersForLi(li: any): void {
    li.offEvent('click');
    this.offEvent('click', li);

    this.onEvent('click', li, () => {
      this.focusLi(li);
      li.offEvent('click');

      if (!(this.getAllSelectedLiIndex().includes(+this.getFocusedLiIndex()))) {
        this.#unfocusAnySelectedLiEditor();
        this.toggleSelectedLi(li);
      } else if (!this.#selectedLiEditor) {
        this.toggleSelectedLi(li);
      }
    });
  }

  /**
   * Helper function to attach keyboard events to each individual item
   * @private
   * @param {any} li the list item
   * @returns {void}
   */
  #attachKeyboardListenersForLi(li: any): void {
    li.unlisten('Enter');
    li.unlisten('ArrowUp');
    li.unlisten('ArrowDown');
    this.offEvent('keydown', li);

    this.onEvent('keydown', li, (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter': // edits the list item
          event.preventDefault();
          if (!(this.getAllSelectedLiIndex().includes(+this.getFocusedLiIndex()))) {
            this.toggleSelectedLi(li);
          }
          this.#toggleEditor();
          break;
        case ' ': // selects the list item
          if (!this.#selectedLiEditor) {
            event.preventDefault(); // prevent container from scrolling
            this.toggleSelectedLi(li);
          }
          break;
        case 'Tab':
          this.#unfocusAnySelectedLiEditor();
          break;
        case 'ArrowUp':
          this.focusLi(this.getFocusedLi().previousElementSibling);
          this.#unfocusAnySelectedLiEditor();
          break;
        case 'ArrowDown':
          this.focusLi(this.getFocusedLi().nextElementSibling);
          this.#unfocusAnySelectedLiEditor();
          break;
        case 'Delete':
          this.#removeAllSelectedLi();
          break;
        default:
          break;
      }
    });
  }

  /**
   * Get focused Li
   * @returns {any} focused Li
   */
  getFocusedLi(): any {
    const savedFocusedLi = this.container?.querySelector(`ids-swappable-item[role="listitem"][index="${this.getFocusedLiIndex()}"]`);
    const val = savedFocusedLi ?? this.container?.querySelector('ids-swappable-item[role="listitem"][tabindex="0"]');
    return val;
  }

  /**
   * Reset indices
   * @returns {void}
   */
  resetIndices(): void {
    const listItems = this.container?.querySelectorAll<IdsSwappableItem>('ids-swappable-item');
    listItems?.forEach((x, i) => {
      x.setAttribute('index', i.toString());
      x.setAttribute('id', `id_item_${i + 1}`);
      x.setAttribute('aria-posinset', `${i + 1}`);
      x.setAttribute('aria-setsize', listItems.length.toString());
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

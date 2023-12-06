import { customElement, scss } from '../../core/ids-decorators';
import IdsInput from '../ids-input/ids-input';
import '../ids-toolbar/ids-toolbar';
import IdsListView from '../ids-list-view/ids-list-view';

import styles from './ids-list-builder.scss';
import IdsSwappableItem from '../ids-swappable/ids-swappable-item';

import type IdsText from '../ids-text/ids-text';
import type IdsToolbar from '../ids-toolbar/ids-toolbar';
import type IdsSwappable from '../ids-swappable/ids-swappable';
import type IdsListViewItem from '../ids-list-view/ids-list-view-item';
// import IdsListViewItem from '../ids-list-view/ids-list-view-item';

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

  // /**
  //  * Set the selection mode of the listview
  //  * @param {string} value true to use virtual scrolling
  //  */
  // set selectable(value: string | null) {
  //   super.selectable = value;
  // }

  // get selectable(): string | null {
  //   return super.selectable;
  // }

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

  // /**
  //  * Removes and unfocuses any active list item editor after updating the list item's value
  //  * @private
  //  * @returns {void}
  //  */
  // #unfocusAnySelectedLiEditor(): void {
  //   if (this.#selectedLiEditor) {
  //     // this.#removeSelectedLiEditor();
  //     this.offEvent('keyup', this.#selectedLiEditor);
  //     this.#selectedLiEditor.parentElement?.classList.remove('is-editing');
  //     this.#selectedLiEditor.remove();
  //     this.#selectedLiEditor = null;

  //     this.updateDataFromDOM();
  //   }
  // }

  // /**
  //  * Helper function to update the list item inner text with the editor's input value
  //  * @private
  //  * @returns {void}
  //  */
  // #updateSelectedLiWithEditorValue(): void {
  //   const selectedItem = this.itemsSelected[0];
  //   const textElem = selectedItem?.querySelector('ids-text');
  //   if (textElem) textElem.innerHTML = this.#selectedLiEditor?.value ?? '';
  // }

  // /**
  //  * Helper function to remove the editor element from the DOM
  //  * @private
  //  * @returns {void}
  //  */
  // #removeSelectedLiEditor(): void {
  //   this.offEvent('keyup', this.#selectedLiEditor);
  //   if (this.#selectedLiEditor) {
  //     this.#selectedLiEditor.parentElement?.classList.remove('is-editing');
  //     this.#selectedLiEditor.remove();
  //   }
  //   this.#selectedLiEditor = null;
  // }

  // /**
  //  * Helper function to insert an editor into the DOM and hide the inner text of the list item
  //  * @param {boolean | null} newEntry whether or not this is an editor for a new or pre-existing list item
  //  * @private
  //  * @returns {void}
  //  */
  // #insertSelectedLiWithEditor(newEntry: boolean | null = false): void {
  //   const itemFocused = this.itemFocused;
  //   if (itemFocused) {
  //     this.triggerEvent('itemChange', this, {
  //       detail: itemFocused.rowData
  //     });

  //     if (!this.#selectedLiEditor) {
  //       const input = new IdsInput();
  //       // const selectorStr = this.selectable === 'single' ? 'div[part="list-item"]' : '.list-item-content';
  //       // const listItem = this.selectedLi.querySelector(selectorStr);

  //       // insert into DOM
  //       itemFocused?.insertBefore(input, itemFocused.querySelector('ids-text'));

  //       // hide inner text
  //       itemFocused?.classList.add('is-editing');

  //       // set the value of input
  //       this.#selectedLiEditor = input;
  //       input.value = newEntry ? 'New Value' : (itemFocused?.textContent ?? '').trim();
  //       // input.value = newEntry ? 'New Value' : itemFocused?.querySelector('ids-text')?.innerHTML;
  //       input.autoselect = 'true';
  //       input.noMargins = 'true';
  //       input.colorVariant = 'list-builder';
  //       input.focus();

  //       // update inner text on keyup
  //       // this.onEvent('keyup', input, () => this.#updateSelectedLiWithEditorValue());
  //       this.onEvent('keyup', input, () => {
  //         itemFocused.innerHTML = input.value ?? '';
  //         // itemFocused.innerHTML = this.#selectedLiEditor?.value ?? '';
  //       });
  //     } else {
  //       this.#selectedLiEditor.focus();
  //     }
  //   }
  // }

  // get selectedLi(): IdsSwappableItem | undefined {
  //   return this.itemsSelected.at(0)?.swappableParent;
  // }

  // get allSelectedLi(): IdsSwappableItem[] {
  //   return [...this.shadowRoot?.querySelectorAll<IdsSwappableItem>('ids-swappable-item[selected]') ?? []];
  // }

  // /**
  //  * Helper function that toggles the 'selected' attribute of an element, then focuses on that element
  //  * @param {Element} item the item to add/remove the selected attribute
  //  * @param {boolean} switchValue optional switch values to force add/remove the selected attribute
  //  */
  // toggleSelectedAttribute(item: IdsSwappableItem, switchValue?: boolean) {
  //   if (!this.selectable) return;

  //   item.selected = !!(switchValue ?? item.hasAttribute('selected'));
  //   this.focusLi(item);
  // }

  // /**
  //  * Toggles the selected list item
  //  * @param {any} item the selected list item to toggle
  //  */
  // toggleSelectedLi(item: any) {
  //   const swappableItem = item?.swappableParent;
  //   if (!this.selectable || !swappableItem) return;
  //   if (this.selectable === 'single') {
  //     const prevSelectedLi = this.itemsSelected[0]?.swappableParent;
  //     if (swappableItem !== prevSelectedLi && prevSelectedLi) {
  //       // this.toggleSelectedAttribute(prevSelectedLi);
  //       if (this.selectable) {
  //         prevSelectedLi.selected = prevSelectedLi.hasAttribute('selected');
  //         prevSelectedLi.focus();
  //         // this.focusLi(item);
  //       }
  //     }
  //   }
  //   if (this.selectable) {
  //     // this.toggleSelectedAttribute(swappableItem);
  //     swappableItem.selected = swappableItem.hasAttribute('selected');
  //     swappableItem.focus();
  //     // this.focusLi(item);
  //   }
  // }

  // /**
  //  * Remove selected list item
  //  * @private
  //  * @returns {void}
  //  */
  // #removeAllSelectedLi(): void {
  //   const indexOfItems: number[] = [];

  //   for (const item of this.itemsSelected) {
  //     indexOfItems.push(item.rowIndex);
  //     this.triggerEvent('itemDelete', this, {
  //       detail: item.rowData
  //     });

  //     item.swappableParent?.remove?.();
  //     if (this.#selectedLiEditor) this.#selectedLiEditor = null;
  //   }

  //   this.resetIndices();
  //   this.updateDataFromDOM();

  //   for (const index of indexOfItems) {
  //     const liItem = this.itemByIndex(index);

  //     if (liItem) {
  //       this.toggleSelectedLi(liItem);
  //     }
  //   }
  // }

  // /**
  //  * Helper function for swapping nodes in the list item -- used when dragging list items or clicking the up/down arrows
  //  * @param {Node} nodeA the first node
  //  * @param {Node} nodeB the second node
  //  */
  // swap(nodeA: Node, nodeB: Node) {
  //   nodeB.parentNode?.insertBefore(nodeA, nodeB);
  // }

  // /**
  //  * Add new item
  //  * @returns {void}
  //  */
  // add(): void {
  //   // Deselect more than one selection, if selectable multiple or mixed type
  //   if (this.selectable && this.selectable !== 'single') {
  //     const items = this.itemsSelected;
  //     if (items.length > 1) {
  //       items.shift(); // Keep selected first in list
  //       items.forEach((item: any) => this.toggleSelectedAttribute(item, false));
  //     }
  //   }
  //   this.#unfocusAnySelectedLiEditor();
  //   let newSwappableItem;

  //   if (!this.data.length) {
  //     // if list is empty, add new item data to the source data
  //     const newItemData: { [key: string]: any } = {};
  //     this.dataKeys.forEach((key: string) => {
  //       newItemData[key] = 'New Value';
  //     });
  //     this.shadowRoot?.querySelector('.ids-list-builder')?.remove();
  //     this.data = [newItemData];
  //     this.redraw?.();
  //     newSwappableItem = this.shadowRoot?.querySelector<IdsSwappableItem>('ids-swappable-item');
  //   } else {
  //     const selectionNull = !this.itemsSelected[0];
  //     // if an item is selected, create a node under it, otherwise create a node above the first item

  //     let targetDraggableItem = selectionNull ? this.itemsSwappable[0] : this.itemsSelected[0];
  //     if (!targetDraggableItem) {
  //       targetDraggableItem = new IdsSwappableItem();
  //     }
  //     newSwappableItem = targetDraggableItem.cloneNode(true) as HTMLElement;

  //     const insertionLocation = selectionNull ? targetDraggableItem : targetDraggableItem.nextSibling;
  //     if (targetDraggableItem.parentNode) {
  //       targetDraggableItem.parentNode.insertBefore(newSwappableItem, insertionLocation);
  //       targetDraggableItem.removeAttribute('selected');
  //     }
  //   }

  //   newSwappableItem?.setAttribute('selected', '');
  //   const listItem = newSwappableItem?.querySelector('div[part="list-item"]');

  //   const listItemText = listItem?.querySelector('ids-text');
  //   if (listItemText) listItemText.innerHTML = 'New Value';
  //   // remove any selected attribute on li that may have propogated from the clone
  //   if (listItem?.getAttribute('selected')) listItem.removeAttribute('selected');
  //   this.resetIndices();

  //   const newEntry = true;
  //   this.#insertSelectedLiWithEditor(newEntry);
  //   this.focusLi(newSwappableItem);
  //   this.#attachClickListenersForLi(newSwappableItem);
  //   // this.#attachKeyboardListenersForLi(newSwappableItem);

  //   this.triggerEvent('itemAdd', this, { detail: newSwappableItem.rowData });
  // }

  // /**
  //  * Delete selected
  //  * @returns {void}
  //  */
  // delete(): void {
  //   this.#removeAllSelectedLi();
  // }

  // /**
  //  * Edit selected item
  //  * @returns {void}
  //  */
  // edit(): void {
  //   this.#insertSelectedLiWithEditor();
  // }

  // /**
  //  * Move up selected
  //  * @returns {void}
  //  */
  // moveUp(): void {
  //   const selectedItem = this.itemsSelected[0];
  //   if (selectedItem) {
  //     this.#unfocusAnySelectedLiEditor();
  //     let isMoved = false;

  //     const items = this.itemsSelected.map((item) => item.swappableParent!);
  //     const prev = selectedItem.swappableParent?.previousElementSibling;

  //     // Multiple selection
  //     if (items.length > 1) {
  //       if (prev) {
  //         isMoved = true;
  //         prev.before(...items);
  //       } else {
  //         const shouldMove = items.some((item, i) => (String(i + 1) !== item.getAttribute('aria-posinset')));
  //         if (shouldMove) {
  //           isMoved = true;
  //           this.parentEl?.prepend(...items);
  //         }
  //       }
  //     } else if (prev) {
  //       // Single selection
  //       isMoved = true;
  //       this.swap(selectedItem.swappableParent, prev);
  //     }

  //     if (isMoved) {
  //       this.resetIndices();
  //       this.updateDataFromDOM();
  //       this.triggerEvent('itemMoveUp', this, { detail: { dataSet: this.data } });
  //     }
  //   }
  // }

  // /**
  //  * Move down selected
  //  * @returns {void}
  //  */
  // moveDown(): void {
  //   const itemsSelected = this.itemsSelected;
  //   const firstSelected = itemsSelected[0];
  //   if (itemsSelected.length) {
  //     this.#unfocusAnySelectedLiEditor();
  //     let isMoved = false;

  //     const items = this.itemsSelected.map((item) => item.swappableParent!);
  //     const len = items.length;
  //     let next = firstSelected?.nextElementSibling;

  //     // Multiple selection
  //     if (len > 1) {
  //       next = items[len - 1]?.nextElementSibling;
  //       if (next) {
  //         isMoved = true;
  //         next.after(...items);
  //       } else {
  //         const size = Number.parseInt(items[0].getAttribute('aria-setsize') as string, 10);
  //         const shouldMove = items.some((item, i) => (
  //           String((size - (len - 1)) + i) !== item.getAttribute('aria-posinset')
  //         ));
  //         if (shouldMove) {
  //           isMoved = true;
  //           this.parentEl?.append(...items);
  //         }
  //       }
  //     } else if (next) {
  //       // Single selection
  //       isMoved = true;
  //       this.swap(next, firstSelected);
  //     }

  //     if (isMoved) {
  //       this.resetIndices();
  //       this.updateDataFromDOM();
  //       this.triggerEvent('itemMoveDown', this, { detail: { dataSet: this.data } });
  //     }
  //   }
  // }

  /**
   * Handle given action.
   * @private
   * @param {string} action The action
   * @returns {void}
   */
  #handleAction(action: string): void {
    if (action === this.actions.ADD) this.#add();
    if (action === this.actions.EDIT) this.#edit();
    if (action === this.actions.DELETE) this.#delete();
    if (action === this.actions.MOVE_UP) this.#moveUp();
    if (action === this.actions.MOVE_DOWN) this.#moveDown();
  }

  /**
   * Add new item after selected item(s) or at the very end of list
   */
  #add() {
    const lastItem = this.itemsSelected.at(-1) ?? this.items.at(-1);
    // const newItem = (lastItem?.cloneNode(true) ?? document.createElement('ids-list-view-item')) as IdsListViewItem;
    // const newData = lastItem?.rowData ?? {};
    // Object.keys(newData).forEach((key) => { newData[key] = newData[key] ? 'New Value' : ''; });

    const newItem = document.createElement('ids-list-view-item') as IdsListViewItem;
    // newItem.innerHTML = this.templateCustomHTML(newData);
    // newItem.innerHTML = (lastItem?.innerHTML ?? '');
    // newItem.querySelector('ids-input')?.remove();

    // const text = newItem.querySelector('ids-text');
    // if (text) {
    //   text.innerHTML = 'New Value';
    // } else {
    //   newItem.innerHTML = 'New Value';
    // }

    // newItem.disabled = false;
    // newItem.selected = true;
    // newItem.rowIndex = this.items.length;

    const swappableParent = lastItem?.swappableParent ?? this.shadowRoot?.querySelector('ids-swappable');
    const swappable = document.createElement('ids-swappable-item') as IdsSwappableItem;

    swappable.append(newItem);
    swappableParent?.after(swappable);

    // newItem.innerHTML = this.templateCustomHTML(newItem.rowData);
    newItem.active = true;
    newItem.selected = true;
    swappable.selected = true;
    // newItem.focus();
    // newItem.rowIndex = this.itemCount;
    // newItem.rowData = newData;
    // newItem.disabled = false;

    // console.log('newItem', newItem);

    this.triggerEvent('itemAdd', this, { detail: newItem.rowData });
    // this.#insertSelectedLiWithEditor(true);
    this.#edit();
  }

  /**
   * Edit selected item
   * @returns {void}
   */
  #edit(): void {
    const itemFocused = this.itemFocused;
    if (!itemFocused) return;

    if (itemFocused.swappableParent) itemFocused.swappableParent.selected = true;

    this.triggerEvent('itemChange', this, {
      detail: itemFocused.rowData
    });

    const input = new IdsInput();
    input.value = itemFocused?.textContent?.trim() ?? 'New Entry';
    input.autoselect = 'true';
    input.noMargins = 'true';
    input.colorVariant = 'list-builder';

    itemFocused?.classList.add('is-editing');
    itemFocused?.prepend(input); // insert into DOM
    input.focus();

    const text = itemFocused.querySelector('ids-text');
    this.onEvent('keyup.listbuilder-editor', input, (evt) => {
      evt.stopImmediatePropagation();
      if (text) text.innerHTML = input.value ?? '';
    });

    this.onEvent('blur.listbuilder-editor', input, () => {
      if (text) text.innerHTML = input.value ?? '';
      input.remove();
      itemFocused?.classList.remove('is-editing');
      itemFocused.focus();
    });

    this.listen(['Backspace', 'Delete'], input, (evt: KeyboardEvent) => evt.stopImmediatePropagation());
    this.listen('Enter', input, () => input.blur());
  }

  /**
   * Delete selected item(s)
   */
  #delete() {
    this.itemsSelected.forEach((item) => {
      item.swappableParent?.remove();
      this.triggerEvent('itemDelete', this, { detail: item.rowData });
    });

    // this.resetIndices();
    // this.updateDataFromDOM();
  }

  /**
   * Move up selected item(s)
   */
  #moveUp() {
    // console.log('#moveUp()');
    const selected = this.itemsSelected;
    const firstSelected = selected[0];
    if (firstSelected) {
      const parents = selected.map((item) => item.swappableParent!);
      firstSelected.swappableParent?.previousElementSibling?.before(...parents);
      this.triggerEvent('itemMoveUp', this, { detail: { dataSet: this.data } });

      // this.resetIndices();
      // this.updateDataFromDOM();
    }
  }

  /**
   * Move down selected item(s)
   */
  #moveDown() {
    // console.log('#moveDown()');
    const selected = this.itemsSelected;
    const lastSelected = selected.at(-1);
    if (lastSelected) {
      const parents = selected.map((item) => item.swappableParent!);
      lastSelected.swappableParent?.nextElementSibling?.after(...parents);
      this.triggerEvent('itemMoveDown', this, { detail: { dataSet: this.data } });

      // this.resetIndices();
      // this.updateDataFromDOM();
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

    // this.itemsSwappable.forEach((li: any) => {
    //   this.#attachClickListenersForLi(li);
    // });
  }

  // /**
  //  * Add/remove the editor in one function,
  //  * used when `Enter` key is hit on a selected list item
  //  * @private
  //  * @returns {void}
  //  */
  // #toggleEditor(): void {
  //   const selectedItem = this.itemsSelected[0];
  //   if (selectedItem) {
  //     if (!this.#selectedLiEditor) {
  //       this.#insertSelectedLiWithEditor();
  //     } else {
  //       this.#unfocusAnySelectedLiEditor();
  //     }
  //     this.focusLi(selectedItem.swappableParent);
  //   }
  // }

  #attachKeyboardListeners(): void {
    // this.itemsSwappable.forEach((li: any) => {
    //   this.#attachKeyboardListenersForLi(li);
    // });

    this.unlisten('Enter');
    this.unlisten('ArrowUp');
    this.unlisten('ArrowDown');
    this.unlisten('Delete');
    this.offEvent('keydown', this);

    this.onEvent('keydown', this, (event: KeyboardEvent) => {
      const keyCode = String(event.key).trim() || 'Space';
      switch (keyCode) {
        case 'Enter': // edits the list item
          // console.log('idsListBuilder#attachKeyboardListeners');
          break;
        //   event.preventDefault();
        //   // if (!(this.getAllSelectedLiIndex().includes(this.getFocusedLiIndex()))) {
        //   // if (!(this.itemsSelected.includes(this.itemFocused!))) {
        //   //   this.toggleSelectedLi(li);
        //   // }
        //   this.#toggleEditor();
        //   break;
        // case 'Space': // selects the list item
        //   if (!this.#selectedLiEditor) {
        //     event.preventDefault(); // prevent container from scrolling
        //     this.toggleSelectedLi(li);
        //   }
        //   break;
        case 'Tab':
        case 'ArrowUp':
        case 'ArrowDown':
          // this.#unfocusAnySelectedLiEditor();
          // this.updateDataFromDOM();
          break;
        case 'Backspace':
        case 'Delete':
          this.#delete();
          // this.#removeAllSelectedLi();
          break;
        default:
          break;
      }
    });
  }

  // /**
  //  * Helper function to attach mouse events to each individual item
  //  * @private
  //  * @param {any} li the list item
  //  * @returns {void}
  //  */
  // #attachClickListenersForLi(li: any): void {
  //   li.offEvent('click');
  //   this.offEvent('click', li);

  //   this.onEvent('click', li, () => {
  //     this.focusLi(li);
  //     li.offEvent('click');

  //     // if (!(this.getAllSelectedLiIndex().includes(this.getFocusedLiIndex()))) {
  //     if (!this.itemsSelected.includes(this.itemFocused!)) {
  //       this.#unfocusAnySelectedLiEditor();
  //       this.toggleSelectedLi(li);
  //     } else if (!this.#selectedLiEditor) {
  //       this.toggleSelectedLi(li);
  //     }
  //   });
  // }

  // /**
  //  * Helper function to attach keyboard events to each individual item
  //  * @private
  //  * @param {any} li the list item
  //  * @returns {void}
  //  */
  // #attachKeyboardListenersForLi(li: any): void {
  //   li.unlisten('Enter');
  //   li.unlisten('ArrowUp');
  //   li.unlisten('ArrowDown');
  //   this.offEvent('keydown', li);

  //   this.onEvent('keydown', li, (event: KeyboardEvent) => {
  //     const keyCode = event.key || 'Space';
  //     switch (keyCode) {
  //       case 'Enter': // edits the list item
  //         event.preventDefault();
  //         // if (!(this.getAllSelectedLiIndex().includes(this.getFocusedLiIndex()))) {
  //         if (!(this.itemsSelected.includes(this.itemFocused!))) {
  //           this.toggleSelectedLi(li);
  //         }
  //         this.#toggleEditor();
  //         break;
  //       case ' ': // selects the list item
  //         if (!this.#selectedLiEditor) {
  //           event.preventDefault(); // prevent container from scrolling
  //           this.toggleSelectedLi(li);
  //         }
  //         break;
  //       case 'Tab':
  //       case 'ArrowUp':
  //       case 'ArrowDown':
  //         this.#unfocusAnySelectedLiEditor();
  //         break;
  //       case 'Delete':
  //         this.#removeAllSelectedLi();
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  // }

  // /**
  //  * Get focused Li
  //  * @returns {any} focused Li
  //  */
  // getFocusedLi(): any {
  //   // const savedFocusedLi = this.container?.querySelector(`ids-swappable-item[role="listitem"][index="${this.getFocusedLiIndex()}"]`);
  //   // const val = savedFocusedLi ?? this.container?.querySelector('ids-swappable-item[role="listitem"][tabindex="0"]');
  //   // const val = this.itemsActive?.at(0) || this.container?.querySelector('ids-swappable-item[role="listitem"][tabindex="0"]');
  //   // return val;
  //   return this.itemsActive?.at(0);
  // }

  // /**
  //  * Return #focusedLiIndex
  //  * @returns {any} focusedLiIndex
  //  */
  // getFocusedLiIndex(): number {
  //   return this.getFocusedLi()?.rowIndex ?? 0;
  // }

  // /**
  //  * Return all selected Li indexes
  //  * @returns {any} List of selected li index
  //  */
  // getAllSelectedLiIndex(): number[] {
  //   const listOfIndex: number[] = [];
  //   // this.container?.querySelectorAll<IdsSwappableItem>('ids-swappable-item[selected]')
  //   this.itemsSelected.forEach((item) => {
  //     listOfIndex.push(item.rowIndex);
  //   });

  //   return listOfIndex;
  // }

  /**
   * Reset indices
   * @returns {void}
   */
  resetIndices(): void {
    const listItems = this.itemsSwappable;
    this.itemsSwappable?.forEach((item, index) => {
      item.setAttribute('index', index.toString());
      item.setAttribute('id', `id_item_${index + 1}`);
      item.setAttribute('aria-posinset', `${index + 1}`);
      item.setAttribute('aria-setsize', listItems.length.toString());
    });
  }

  /**
   * Update data from DOM
   * @returns {void}
   */
  updateDataFromDOM(): void {
    const newData: any = [];
    this.items.forEach((item) => {
      const objItem: any = {};
      item.querySelectorAll<IdsText>('ids-text').forEach((value, i) => {
        objItem[this.dataKeys[i]] = value.innerHTML;
      });

      newData.push(objItem);
    });

    if (this.datasource) {
      this.datasource.data = newData;
    }
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

import { customElement, scss } from '../../core/ids-decorators';
import IdsInput from '../ids-input/ids-input';
import Base from './ids-list-builder-base';
import styles from './ids-list-builder.scss';

/**
 * IDS ListBuilder Component
 * @type {IdsListBuilder}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-list-builder')
@scss(styles)
export default class IdsListBuilder extends Base {
  constructor() {
    super();
  }

  // any active editor of the selected list item
  #selectedLiEditor;

  // a clone of the list item being dragged -- appears during drag to help visualize where the dragged item's position
  placeholder;

  connectedCallback() {
    this.sortable = true;
    this.selectable = 'single';
    // list-builder is not designed to handle thousands of items, so don't support virtual scroll
    this.virtualScroll = false;
    this.itemHeight = 46; // hard-coded
    this.#attachEventListeners();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-list-builder">
          <div class="header">
            <ids-toolbar tabbable="true">
              <ids-toolbar-section type="buttonset">
                <ids-button id="button-add">
                  <span slot="text" class="audible">Add List Item</span>
                  <ids-icon slot="icon" icon="add"></ids-icon>
                </ids-button>
                <div class="separator"></div>
                <ids-button id="button-up">
                  <span slot="text" class="audible">Move Up List Item</span>
                  <ids-icon slot="icon" icon="arrow-up"></ids-icon>
                </ids-button>
                <ids-button id="button-down">
                  <span slot="text" class="audible">Move Down List Item</span>
                  <ids-icon slot="icon" icon="arrow-down"></ids-icon>
                </ids-button>
                <div class="separator"></div>
                <ids-button id="button-edit">
                  <span slot="text" class="audible">Edit List Item</span>
                  <ids-icon slot="icon" icon="edit"></ids-icon>
                </ids-button>
                <ids-button id="button-delete">
                  <span slot="text" class="audible">Delete Down List Item</span>
                  <ids-icon slot="icon" icon="delete"></ids-icon>
                </ids-button>
              </ids-toolbar-section>
            </ids-toolbar>
          </div>
          ${super.template()}
      </div>
    `;
  }

  get data() {
    return super.data;
  }

  /**
   * Set the data set of the list
   * @param {Array} val The list of items
   */
  set data(val) {
    super.data = val;

    // need to reattach event listeners when new data set dynamically adds list items
    this.#attachEventListeners();
  }

  /**
   * Attaches all the listeners which allow for clicking, dragging, and keyboard interaction with the list items
   */
  #attachEventListeners() {
    this.#attachClickListeners(); // for toolbar buttons
    this.#attachKeyboardListeners(); // for selecting/editing list items

    if (this.virtualScroll) {
      this.onEvent('aftervirtualscroll', this.virtualScrollContainer, () => {
        this.attachDragEventListeners();
        this.#attachKeyboardListeners();
      });
    }
  }

  /**
   * Removes and unfocuses any active list item editor after updating the list item's value
   */
  #unfocusAnySelectedLiEditor() {
    if (this.#selectedLiEditor) {
      this.#removeSelectedLiEditor();
      this.updateDataFromDOM();
    }
  }

  /**
   * Helper function to update the list item inner text with the editor's input value
   */
  #updateSelectedLiWithEditorValue() {
    this.selectedLi.querySelector('ids-text').innerHTML = this.#selectedLiEditor.value;
  }

  /**
   * Helper function to remove the editor element from the DOM
   */
  #removeSelectedLiEditor() {
    this.offEvent('keyup', this.#selectedLiEditor);
    this.#selectedLiEditor.parentNode.classList.remove('is-editing');
    this.#selectedLiEditor.remove();
    this.#selectedLiEditor = null;
  }

  /**
   * Helper function to insert an editor into the DOM and hide the inner text of the list item
   * @param {boolean} newEntry whether or not this is an editor for a new or pre-existing list item
   */
  #insertSelectedLiWithEditor(newEntry = false) {
    if (this.selectedLi) {
      if (!this.#selectedLiEditor) {
        const i = new IdsInput();

        // insert into DOM
        this.selectedLi.insertBefore(i, this.selectedLi.querySelector('ids-text'));

        // hide inner text
        this.selectedLi.classList.add('is-editing');

        // set the value of input
        this.#selectedLiEditor = i;
        i.value = newEntry ? 'New Value' : this.selectedLi.querySelector('ids-text').innerHTML;
        i.autoselect = 'true';
        i.noMargins = 'true';
        i.colorVariant = 'alternate';
        i.focus();

        // update inner text on keyup
        this.onEvent('keyup', i, () => this.#updateSelectedLiWithEditorValue());
      } else {
        this.#selectedLiEditor.focus();
      }
    }
  }

  /**
   * Add/remove the editor in one function -- used when 'Enter' key is hit on a selected list item
   */
  #toggleEditor() {
    if (this.selectedLi) {
      if (!this.#selectedLiEditor) {
        this.#insertSelectedLiWithEditor();
      } else {
        this.#unfocusAnySelectedLiEditor();
      }
      this.focusLi(this.selectedLi);
    }
  }

  /**
   * Overrides the onClick() to include select functionality and unfocus any active editor inputs
   * @param {Element} item the draggable list item
   */
  onClick(item) {
    super.onClick(item);
    this.#unfocusAnySelectedLiEditor();
  }

  /**
   * Attaches functionality for toolbar button interaction
   */
  #attachClickListeners() {
    // Add button
    this.onEvent('click', this.container.querySelector('#button-add'), () => {
      this.#unfocusAnySelectedLiEditor();

      const selectionNull = !this.selectedLi;
      // if an item is selected, create a node under it, otherwise create a node above the first item

      const targetDraggableItem = selectionNull ? this.container.querySelector('ids-draggable') : this.selectedLi.parentNode;
      const newDraggableItem = targetDraggableItem.cloneNode(true);

      const insertionLocation = selectionNull ? targetDraggableItem : targetDraggableItem.nextSibling;
      targetDraggableItem.parentNode.insertBefore(newDraggableItem, insertionLocation);
      this.attachDragEventListenersForDraggable(newDraggableItem);
      this.#attachKeyboardListenersForLi(newDraggableItem.querySelector('div[part="list-item"]'));

      const listItem = newDraggableItem.querySelector('div[part="list-item"]');
      // remove any selected attribute on li that may have propogated from the clone
      listItem.getAttribute('selected') && listItem.removeAttribute('selected');

      this.resetIndices();
      this.toggleSelectedLi(listItem);

      const newEntry = true;
      this.#insertSelectedLiWithEditor(newEntry);
    });

    // Up button
    this.onEvent('click', this.container.querySelector('#button-up'), () => {
      if (this.selectedLi) {
        this.#unfocusAnySelectedLiEditor();

        const prev = this.selectedLi.parentNode.previousElementSibling;
        if (prev) {
          this.swap(this.selectedLi.parentNode, prev);
        }
        this.updateDataFromDOM();
      }
    });

    // Down button
    this.onEvent('click', this.container.querySelector('#button-down'), () => {
      if (this.selectedLi) {
        this.#unfocusAnySelectedLiEditor();

        const next = this.selectedLi.parentNode.nextElementSibling;
        if (next) {
          this.swap(this.selectedLi.parentNode, next);
        }
        this.updateDataFromDOM();
      }
    });

    // Edit button
    this.onEvent('click', this.container.querySelector('#button-edit'), () => {
      this.#insertSelectedLiWithEditor();
    });

    // Delete button
    this.onEvent('click', this.container.querySelector('#button-delete'), () => {
      if (this.selectedLi) {
        this.selectedLi.parentNode.remove();
        if (this.#selectedLiEditor) this.#selectedLiEditor = null;
        this.resetIndices();
        this.updateDataFromDOM();
      }
    });
  }

  /**
   * Attach selection toggling, editing feature, and navigation focus functionality to keyboard events
   */
  #attachKeyboardListeners() {
    this.getAllLi().forEach((l) => {
      this.#attachKeyboardListenersForLi(l);
    });
  }

  /**
   * Helper function to attach keyboard events to each individual item
   * @param {Element} l the list item
   */
  #attachKeyboardListenersForLi(l) {
    this.onEvent('keydown', l, (event) => {
      switch (event.key) {
      case 'Enter': // edits the list item
        this.#toggleEditor();
        break;
      case ' ': // selects the list item
        if (!this.#selectedLiEditor) {
          event.preventDefault(); // prevent container from scrolling
          this.toggleSelectedLi(l);
        }
        break;
      case 'Tab':
        this.#unfocusAnySelectedLiEditor();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.#unfocusAnySelectedLiEditor();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.#unfocusAnySelectedLiEditor();
        break;
      default:
        break;
      }
    });
  }

  /**
   * Overrides the ids-sortable-mixin function to ensure there are no duplicate selected nodes as a result of cloning
   * @param {Node} node the node to be cloned
   * @returns {Node} the cloned node
   */
  createPlaceholderNode(node) {
    const p = super.createPlaceholderNode(node);
    p.querySelector('div[part="list-item"]').removeAttribute('selected');
    return p;
  }

  resetIndices() {
    this.container.querySelectorAll('div[part="list-item"]').forEach((x, i) => {
      x.setAttribute('index', i);
    });
  }
}

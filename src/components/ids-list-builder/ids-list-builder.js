import {
  IdsElement,
  customElement,
  scss,
  mix,
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

import styles from './ids-list-builder.scss';
import IdsListView from '../ids-list-view';
import IdsInput from '../ids-input/ids-input';

/**
 * IDS ListBuilder Component
 * @type {IdsListBuilder}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-list-builder')
@scss(styles)
class IdsListBuilder extends mix(IdsListView).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  // the currently selected list item
  #selectedLi;

  #selectedLiIndex;

  // any active editor of the selected list item
  #selectedLiEditor;

  // a clone of the list item being dragged -- appears during drag to help visualize where the dragged item's position
  placeholder;

  connectedCallback() {
    this.draggable = true;
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

  get selectedLi() {
    const savedSelectedLi = this.container.querySelector(`div[part="list-item"][index="${this.#selectedLiIndex}"]`);
    return savedSelectedLi;
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
   * Helper function that toggles the 'selected' attribute of an element, then focuses on that element
   * @param {Element} item the item to add/remove the selected attribute
   * @param {boolean} switchValue optional switch values to force add/remove the selected attribute
   */
  #toggleSelectedAttribute(item, switchValue) {
    const unselect = () => {
      item.removeAttribute('selected');
      this.#selectedLiIndex = null;
    };

    const select = () => {
      item.setAttribute('selected', 'selected');
      this.#selectedLiIndex = item.getAttribute('index');
    };

    if (switchValue === true) {
      select();
    } else if (switchValue === false) {
      unselect();
    } else {
      // otherwise toggle it depending on whether or not it has the attribute already
      const hasSelectedAttribute = item.getAttribute('selected');
      hasSelectedAttribute ? unselect() : select();
    }
  }

  /**
   * Toggles the selected list item
   * @param {*} item the selected list item to toggle
   */
  #toggleSelectedLi(item) {
    if (item.tagName === 'DIV' && item.getAttribute('part') === 'list-item') {
      const prevSelectedLi = this.selectedLi;
      if (item !== prevSelectedLi) {
        if (prevSelectedLi) {
          // unselect previous item if it's selected
          prevSelectedLi.setAttribute('tabindex', '-1');
          this.#toggleSelectedAttribute(prevSelectedLi);
        }
      }
      this.#toggleSelectedAttribute(item);
    }
  }

  #reselect() {
    const prevSelectedLi = this.selectedLi;
    if (prevSelectedLi) {
      this.#toggleSelectedAttribute(prevSelectedLi, true);
    }
  }

  /**
   * Attaches all the listeners which allow for clicking, dragging, and keyboard interaction with the list items
   */
  #attachEventListeners() {
    this.#attachClickListeners(); // for toolbar buttons
    this.#attachDragEventListeners(); // for dragging list items
    this.#attachKeyboardListeners(); // for selecting/editing list items

    if (this.virtualScroll) {
      this.onEvent('ids-virtual-scroll-afterrender', this.virtualScrollContainer, () => {
        this.#attachDragEventListeners();
        this.#attachKeyboardListeners();
        this.#reselect();
      });
    }
  }

  /**
   * Helper function for swapping nodes in the list item -- used when dragging list items or clicking the up/down arrows
   * @param {Node} nodeA the first node
   * @param {Node} nodeB the second node
   */
  #swap(nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    nodeB.parentNode.insertBefore(nodeA, nodeB);
    parentA.insertBefore(nodeB, siblingA);
  }

  /**
   * Helper function to check if a node is being dragged above another node
   * @param {Node} nodeA the node being dragged
   * @param {Node} nodeB the referred node being checked if nodeA is above
   * @returns {boolean} whether or not nodeA is above nodeB
   */
  #isAbove(nodeA, nodeB) {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    const centerA = rectA.top + rectA.height / 2;
    const centerB = rectB.top + rectB.height / 2;
    return centerA < centerB;
  }

  /**
   * Helper function that creates a placeholder node in place of the node being dragged
   * @param {Node} node the node being dragged around to clone
   * @returns {Node} a clone of the node
   */
  #createPlaceholderClone(node) {
    const p = node.cloneNode(true);
    p.querySelector('div[part="list-item"]').classList.add('placeholder');
    p.querySelector('div[part="list-item"]').removeAttribute('selected');
    return p;
  }

  /**
   * Removes and unfocuses any active list item editor after updating the list item's value
   */
  #unfocusAnySelectedLiEditor() {
    if (this.#selectedLiEditor) {
      this.#updateSelectedLiWithEditorValue();
      this.#removeSelectedLiEditor();
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
    this.selectedLi.querySelector('ids-text').style.display = 'list-item';
    this.selectedLi.parentNode.removeAttribute('disabled');
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
        this.selectedLi.querySelector('ids-text').style.display = `none`;

        // set the value of input
        this.#selectedLiEditor = i;
        i.value = newEntry ? 'New Value' : this.selectedLi.querySelector('ids-text').innerHTML;
        i.autoselect = 'true';
        i.noMargins = 'true';
        i.colorVariant = 'alternate';
        i.focus();
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
      this.#attachDragEventListenersForDraggable(newDraggableItem);
      this.#attachKeyboardListenersForLi(newDraggableItem.querySelector('div[part="list-item"]'));

      const listItem = newDraggableItem.querySelector('div[part="list-item"]');
      // remove any selected attribute on li that may have propogated from the clone
      listItem.getAttribute('selected') && listItem.removeAttribute('selected');
      this.#toggleSelectedLi(listItem);

      const newEntry = true;
      this.#insertSelectedLiWithEditor(newEntry);
    });

    // Up button
    this.onEvent('click', this.container.querySelector('#button-up'), () => {
      if (this.selectedLi) {
        this.#unfocusAnySelectedLiEditor();

        const prev = this.selectedLi.parentNode.previousElementSibling;
        if (prev) {
          this.#swap(this.selectedLi.parentNode, prev);
        }
      }
    });

    // Down button
    this.onEvent('click', this.container.querySelector('#button-down'), () => {
      if (this.selectedLi) {
        this.#unfocusAnySelectedLiEditor();

        const next = this.selectedLi.parentNode.nextElementSibling;
        if (next) {
          this.#swap(this.selectedLi.parentNode, next);
        }
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
        this.selectedLi = null;
        if (this.#selectedLiEditor) this.#selectedLiEditor = null;
      }
    });
  }

  /**
   * Adds dragging functionality to all list items
   */
  #attachDragEventListeners() {
    this.getAllDraggable().forEach((draggable) => {
      this.#attachDragEventListenersForDraggable(draggable);
    });
  }

  /**
   * Helper function for attaching dragging functionality to a list item
   * @param {Element} el the list item to add draggable functionality
   */
  #attachDragEventListenersForDraggable(el) {
    // Toggle selected attribute, create placeholder, edit the css at the beginning of the drag
    this.onEvent('ids-dragstart', el, (event) => {
      this.#unfocusAnySelectedLiEditor();

      // toggle selected item
      const listItem = event.target.querySelector('div[part="list-item"]');
      this.#toggleSelectedLi(listItem);

      // create placeholder
      this.placeholder = this.#createPlaceholderClone(el);

      // need this for draggable to move around
      el.style.position = `absolute`;
      el.style.opacity = `0.95`;
      el.style.zIndex = `100`;

      el.parentNode.insertBefore(
        this.placeholder,
        el.nextSibling
      );
    });

    // Calculate where the dragged list item is in relation to the other list items and move the placeholder accordingly
    this.onEvent('ids-drag', el, () => {
      let prevEle = this.placeholder?.previousElementSibling;
      let nextEle = this.placeholder?.nextElementSibling;

      // skip over checking the original selected node position
      if (prevEle === el) {
        prevEle = prevEle.previousElementSibling;
      }
      // skip over checking the original selected position
      if (nextEle === el) {
        nextEle = nextEle.nextElementSibling;
      }

      if (prevEle && this.#isAbove(el, prevEle)) {
        this.#swap(this.placeholder, prevEle);
        return;
      }

      if (nextEle && this.#isAbove(nextEle, el)) {
        this.#swap(nextEle, this.placeholder);
      }
    });

    // At the end of the drag, return the css properties back to normal and remove the placeholder
    this.onEvent('ids-dragend', el, () => {
      el.style.removeProperty('position');
      el.style.removeProperty('transform');
      el.style.removeProperty('opacity');
      el.style.removeProperty('z-index');

      this.#swap(el, this.placeholder);
      if (this.placeholder) {
        this.placeholder.remove();
      }

      el.querySelector('div[part="list-item"]').focus();
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

  #attachKeyboardListenersForLi(l) {
    this.onEvent('keydown', l, (event) => {
      switch (event.key) {
      case 'Enter': // edits the list item
        this.#toggleEditor();
        break;
      case ' ': // selects the list item
        if (!this.#selectedLiEditor) {
          event.preventDefault(); // prevent container from scrolling
          this.#toggleSelectedLi(l);
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
}

export default IdsListBuilder;

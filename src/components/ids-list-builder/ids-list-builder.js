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

  #selectedLi;

  #selectedLiEditor;

  placeholder;

  connectedCallback() {
    super.connectedCallback();

    this.virtualScroll = true;
    this.itemHeight = 44; // hard-coded

    this.#attachEventListeners();
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
            <ids-toolbar>
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
          <div class="content">
            ${super.template()} 
          </div>
        <slot></slot>
      </div>
    `;
  }

  get data() {
    return super.data;
  }

  set data(val) {
    super.data = val;

    // need to reattach event listeners when new data set dynamically adds list items
    this.#attachEventListeners();
  }

  #toggleSelectedAttribute(item) {
    const hasSelectedAttribute = item.getAttribute('selected');

    if (hasSelectedAttribute) {
      item.removeAttribute('selected');
      this.#selectedLi = null;
    } else if (!hasSelectedAttribute) {
      item.setAttribute('selected', 'selected');
      this.#selectedLi = item;
    }
    item.focus();
  }

  #toggleSelectedLi(item) {
    if (item.tagName === 'DIV' && item.getAttribute('part') === 'list-item') {
      if (item !== this.#selectedLi) {
        if (this.#selectedLi) {
          // unselect previous item if it's selected
          this.#toggleSelectedAttribute(this.#selectedLi);
        }
      }
      this.#toggleSelectedAttribute(item);
      item.focus();
    }
  }

  #attachEventListeners() {
    this.#attachClickListeners(); // for toolbar buttons
    this.#attachDragEventListeners(); // for dragging list items
    this.#attachKeyboardListeners(); // for selecting/editing list items
  }

  // helper method for swapping nodes
  #swap(nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    nodeB.parentNode.insertBefore(nodeA, nodeB);
    parentA.insertBefore(nodeB, siblingA);
  }

  // helper method to determine which node is above
  #isAbove(nodeA, nodeB) {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    const centerA = rectA.top + rectA.height / 2;
    const centerB = rectB.top + rectB.height / 2;
    return centerA < centerB;
  }

  #createPlaceholderClone(node) {
    const p = node.cloneNode(true);
    p.querySelector('div[part="list-item"]').classList.add('placeholder');
    p.querySelector('div[part="list-item"]').removeAttribute('selected');
    return p;
  }

  #unfocusAnySelectedLiEditor() {
    if (this.#selectedLiEditor) {
      this.#updateSelectedLiWithEditorValue();
      this.#removeSelectedLiEditor();
    }
  }

  #updateSelectedLiWithEditorValue() {
    this.#selectedLi.querySelector('ids-text').innerHTML = this.#selectedLiEditor.value;
  }

  #removeSelectedLiEditor() {
    this.#selectedLi.querySelector('ids-text').style.display = 'list-item';
    this.#selectedLi.parentNode.removeAttribute('disabled');
    this.#selectedLiEditor.remove();
    this.#selectedLiEditor = null;
  }

  #insertSelectedLiWithEditor(newEntry = false) {
    if (this.#selectedLi) {
      if (!this.#selectedLiEditor) {
        const i = new IdsInput();

        // insert into DOM
        this.#selectedLi.insertBefore(i, this.#selectedLi.querySelector('ids-text'));

        // hide inner text
        this.#selectedLi.querySelector('ids-text').style.display = `none`;

        // set the value of input
        this.#selectedLiEditor = i;
        i.value = newEntry ? 'New Value' : this.#selectedLi.querySelector('ids-text').innerHTML;
        i.autoselect = 'true';
        i.noMargins = 'true';
        i.colorVariant = 'alternate';
        i.focus();
      } else {
        this.#selectedLiEditor.focus();
      }
    }
  }

  #toggleEditor() {
    if (this.#selectedLi) {
      if (!this.#selectedLiEditor) {
        this.#insertSelectedLiWithEditor();
      } else {
        this.#unfocusAnySelectedLiEditor();
      }
      this.#selectedLi.focus();
    }
  }

  #attachClickListeners() {
    this.onEvent('click', this.container.querySelector('#button-add'), () => {
      this.#unfocusAnySelectedLiEditor();

      const selectionNull = !this.#selectedLi;
      // if an item is selected, create a node under it, otherwise create a node above the first item
      const targetDraggableItem = selectionNull ? this.container.querySelector('ids-draggable') : this.#selectedLi.parentNode;
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

    this.onEvent('click', this.container.querySelector('#button-up'), () => {
      if (this.#selectedLi) {
        this.#unfocusAnySelectedLiEditor();

        const prev = this.#selectedLi.parentNode.previousElementSibling;
        if (prev) {
          this.#swap(this.#selectedLi.parentNode, prev);
        }
      }
    });

    this.onEvent('click', this.container.querySelector('#button-down'), () => {
      if (this.#selectedLi) {
        this.#unfocusAnySelectedLiEditor();

        const next = this.#selectedLi.parentNode.nextElementSibling;
        if (next) {
          this.#swap(this.#selectedLi.parentNode, next);
        }
      }
    });

    this.onEvent('click', this.container.querySelector('#button-edit'), () => {
      this.#insertSelectedLiWithEditor();
    });

    this.onEvent('click', this.container.querySelector('#button-delete'), () => {
      if (this.#selectedLi) {
        this.#selectedLi.parentNode.remove();
        this.#selectedLi = null;
        if (this.#selectedLiEditor) this.#selectedLiEditor = null;
      }
    });
  }

  #attachDragEventListeners() {
    this.container.querySelectorAll('ids-draggable').forEach((draggable) => {
      this.#attachDragEventListenersForDraggable(draggable);
    });
  }

  // helper method for attaching drag events
  #attachDragEventListenersForDraggable(el) {
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

  #attachKeyboardListeners() {
    this.container.querySelectorAll('div[part="list-item"]').forEach((l) => {
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
      default:
        break;
      }
    });
  }
}

export default IdsListBuilder;

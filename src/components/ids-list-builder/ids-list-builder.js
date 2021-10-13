import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
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
    this.itemHeight = 44;

    this.data = [
      {
        id: 1,
        productId: '7439937961',
        productName: '1 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '2 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '3 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '4 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '5 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '6 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '7 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '8 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '9 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '10 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '11 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '12 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: '13 Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
    ];

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
                  <ids-icon slot="icon" icon="add"></ids-icon>
                </ids-button>
                <ids-button id="button-up">
                  <ids-icon slot="icon" icon="arrow-up"></ids-icon>
                </ids-button>
                <ids-button id="button-down">
                  <ids-icon slot="icon" icon="arrow-down"></ids-icon>
                </ids-button>
                <ids-button id="button-edit">
                  <ids-icon slot="icon" icon="edit"></ids-icon>
                </ids-button>
                <ids-button id="button-delete">
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

  #toggleSelectedAttribute(item, isSelected = null) {
    if (isSelected !== null) {
      isSelected ? item.setAttribute('selected', 'selected') : item.removeAttribute('selected');
    } else if (item.getAttribute('selected')) {
      item.removeAttribute('selected');
    } else {
      item.setAttribute('selected', 'selected');
    }
  }

  #toggleSelectedLi(item, val = null) {
    if (item.tagName === 'LI') {
      if (item !== this.#selectedLi) {
        if (this.#selectedLi) {
          // unselect previous item if it's selected
          this.#toggleSelectedAttribute(this.#selectedLi);
        }
        this.#selectedLi = item;
      }
      this.#toggleSelectedAttribute(item, val);
      item.focus();
    }
  }

  #attachEventListeners() {
    this.#attachClickListeners();
    this.#attachDragEventListeners();
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
    p.style.opacity = `0.5`;
    return p;
  }

  #updateSelectedLiWithEditorValue() {
    this.#selectedLi.querySelector('ids-text').innerHTML = this.#selectedLiEditor.value;
  }

  #unfocusAnySelectedLiEditor() {
    if (this.#selectedLiEditor) {
      this.#updateSelectedLiWithEditorValue();
      this.#removeSelectedLiEditor();
    }
  }

  #removeSelectedLiEditor() {
    this.#selectedLi.style.display = 'list-item';
    this.#selectedLi.parentNode.removeAttribute('disabled');
    this.#selectedLiEditor.remove();
    this.#selectedLiEditor = null;
  }

  #replaceSelectedLiWithEditor(newEntry = false) {
    if (this.#selectedLi) {
      if (!this.#selectedLiEditor) {
        const i = new IdsInput();

        // insert into DOM
        this.#selectedLi.parentNode.insertBefore(i, this.#selectedLi);

        // hide & disable IDS draggable
        this.#selectedLi.style.display = `none`;
        this.#selectedLi.parentNode.setAttribute('disabled', '');

        // set the value of input
        this.#selectedLiEditor = i;
        i.value = newEntry ? 'New Value' : this.#selectedLi.querySelector('ids-text').innerHTML;
        i.autoselect = 'true';
      }
    }
  }

  #attachClickListeners() {
    this.onEvent('click', this.container.querySelector('#button-add'), () => {
      this.#unfocusAnySelectedLiEditor();

      const targetDraggableItem = this.#selectedLi ? this.#selectedLi.parentNode : this.container.querySelector('ids-draggable');
      const newDraggableItem = targetDraggableItem.cloneNode(true);

      targetDraggableItem.parentNode.insertBefore(newDraggableItem, targetDraggableItem.nextSibling);
      this.#attachDragEventListenersForDraggable(newDraggableItem);

      const listItem = newDraggableItem.querySelector('li');
      // remove any selected attribute on li that may have propogated from the clone
      listItem.getAttribute('selected') && listItem.removeAttribute('selected');
      this.#toggleSelectedLi(listItem);

      const newEntry = true;
      this.#replaceSelectedLiWithEditor(newEntry);
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
      // const selected = this.container.querySelector('li[selected]');
      if (this.#selectedLi) {
        this.#unfocusAnySelectedLiEditor();

        const next = this.#selectedLi.parentNode.nextElementSibling;
        if (next) {
          this.#swap(this.#selectedLi.parentNode, next);
        }
      }
    });

    this.onEvent('click', this.container.querySelector('#button-edit'), () => {
      this.#replaceSelectedLiWithEditor();
    });

    this.onEvent('click', this.container.querySelector('#button-delete'), () => {
      if (this.#selectedLi) {
        this.#selectedLi.parentNode.remove();
        this.#selectedLi = null;
        if (this.#selectedLiEditor) this.#selectedLiEditor = null;
      }
    });

    // this.onEvent('click', this.container, (event) => {
    //   console.log(event.target)
    // })
  }

  #attachDragEventListeners() {
    this.container.querySelectorAll('ids-draggable').forEach((draggable) => {
      this.#attachDragEventListenersForDraggable(draggable);
    });
  }

  #attachDragEventListenersForDraggable(el) {
    this.onEvent('ids-dragstart', el, (event) => {
      this.#unfocusAnySelectedLiEditor();

      // toggle selected item
      const listItem = event.target.querySelector('li');
      this.#toggleSelectedLi(listItem, true);

      // create placeholder
      this.placeholder = this.#createPlaceholderClone(el);

      // need this for draggable to move around
      el.style.position = `absolute`;
      el.parentNode.style.zIndex = `100`;

      el.parentNode.insertBefore(
        this.placeholder,
        el.nextSibling
      );
    });

    this.onEvent('ids-drag', el, () => {
      let prevEle = this.placeholder?.previousElementSibling;
      let nextEle = this.placeholder?.nextElementSibling;

      // skip over checking the original selected node position
      if (prevEle === this.#selectedLi.parentNode) {
        prevEle = prevEle.previousElementSibling;
      }
      // skip over checking the original selected position
      if (nextEle === this.#selectedLi.parentNode) {
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

      this.#swap(el, this.placeholder);
      if (this.placeholder) {
        this.placeholder.remove();
      }
    });
  }
}

export default IdsListBuilder;

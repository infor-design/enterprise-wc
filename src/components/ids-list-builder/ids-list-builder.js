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

  #selectedItem;

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

  #toggleSelectedAttribute(item) {
    if (item.getAttribute('selected')) {
      item.removeAttribute('selected');
    } else {
      item.setAttribute('selected', 'selected');
    }
  }

  #toggleSelectedListItem(item) {
    if (item.tagName === 'LI') {
      if (item !== this.#selectedItem) {
        if (this.#selectedItem?.getAttribute('selected')) {
          // unselect previous item if it's selected
          this.#toggleSelectedAttribute(this.#selectedItem);
        }
        this.#selectedItem = item;
      }
      this.#toggleSelectedAttribute(item);
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
    // console.log('centerA: ' + centerA);
    // console.log(nodeA)
    // console.log('centerB: ' + centerB);
    // console.log(nodeB);
    return centerA < centerB;
  }

  #createPlaceholder(height) {
    const p = document.createElement('div');
    p.style.height = `${height}px`;
    p.style.border = `solid 1px red`;
    return p;
  }

  #attachClickListeners() {
    this.onEvent('click', this.container.querySelector('#button-add'), (event) => {
    });
    this.onEvent('click', this.container.querySelector('#button-up'), (event) => {
      if (this.#selectedItem) {
        const prev = this.#selectedItem.parentNode.previousElementSibling;
        if (prev) {
          this.#swap(this.#selectedItem.parentNode, prev);
        }
      }
    });

    this.onEvent('click', this.container.querySelector('#button-down'), (event) => {
      // const selected = this.container.querySelector('li[selected]');
      if (this.#selectedItem) {
        const next = this.#selectedItem.parentNode.nextElementSibling;
        if (next) {
          this.#swap(this.#selectedItem.parentNode, next);
        }
      }
    });
    
    this.onEvent('click', this.container.querySelector('#button-edit'), (event) => {
      console.log('button edit clicked');
    });
    
    this.onEvent('click', this.container.querySelector('#button-delete'), (event) => {
      console.log('button delete clicked');
      if (this.#selectedItem) {
        this.#selectedItem.remove();
        this.#selectedItem = null;
      }
    });


    // this.onEvent('click', this.container.querySelector('div[part="list"]'), (event) => {
    //   console.log('click')
    //   let item = event.target;
    //   console.log(item)

    //   if (item && item.tagName === 'ids-text') {
    //     console.log(item)
    //     item = item.tagName === 'ids-text' ? item.parentNode : item.childNode;
    //     console.log(item)
    //   }

    //   // this.#toggleSelectedListItem(item);
    // });

    this.container.querySelectorAll('ids-draggable').forEach((s) => {
      this.onEvent('ids-dragstart', s, (event) => {
        console.log('ids-dragstart')
        const listItem = event.target.querySelector('li');
        console.log(listItem)
        this.#toggleSelectedListItem(listItem);

        this.placeholder = this.#createPlaceholder(s.getBoundingClientRect().height);

        // need this for draggable to move around
        s.style.position = `absolute`;

        s.parentNode.insertBefore(
          this.placeholder,
          s.nextSibling
        );
      });

      this.onEvent('ids-drag', s, (event) => {
        const prevEle = s.previousElementSibling; // might be null for first
        const nextEle = this.placeholder?.nextElementSibling;

        console.log('checking prev el')
        if (prevEle && this.#isAbove(s, prevEle)) {
          this.#swap(this.placeholder, s);
          this.#swap(this.placeholder, prevEle);
          // return;
        }

        console.log('checking next el')
        if (nextEle && this.#isAbove(nextEle, s)) {
          this.#swap(nextEle, this.placeholder);
          this.#swap(nextEle, s);
        }
      });

      this.onEvent('ids-dragend', s, (event) => {
        s.style.position = ``;
        if (this.placeholder) {
          console.log('remove placeholder')
          this.placeholder.remove();
        }
      });
    });
  }

  #attachDragEventListeners() {
    // this.onEvent('ids-drag', liObject, (event) => {
    //   const [x, y] = [e.detail.mouseX, e.detail.mouseY];
    //   console.log(x + ', ' + y);
    //   // const target = event.target;
    //   // console.log(target)
    // })
  }
}

export default IdsListBuilder;

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
                <ids-button id="button-1">
                  <ids-icon slot="icon" icon="add"></ids-icon>
                </ids-button>
                <ids-button id="button-2">
                  <ids-icon slot="icon" icon="arrow-up"></ids-icon>
                </ids-button>
                <ids-button id="button-3">
                  <ids-icon slot="icon" icon="arrow-down"></ids-icon>
                </ids-button>
                <ids-button id="button-4">
                  <ids-icon slot="icon" icon="edit"></ids-icon>
                </ids-button>
                <ids-button id="button-5">
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

  #toggleSelected(item) {
    if (item.getAttribute('selected')) {
      item.removeAttribute('selected');
    } else {
      item.setAttribute('selected', 'selected');
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

    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  }

  #createPlaceholder(height) {
    const p = document.createElement('div');
    p.style.height = `${height}px`;
    p.style.border = `solid 1px red`;
    return p;
  }

  #attachClickListeners() {
    this.onEvent('click', this.container.querySelector('ul'), (event) => {
      let item = event.target;

      if (item && item.tagName !== 'LI') {
        item = item.parentNode;
      }

      if (item.tagName === 'LI') {
        this.#toggleSelected(item);
        item.focus();
      }
    });

    this.container.querySelectorAll('ids-draggable').forEach((s) => {
      this.onEvent('ids-drag', s, (event) => {
        console.log('li span dragged!!')
      });

      let placeholder;
      this.onEvent('ids-dragstart', s, (event) => {
        placeholder = this.#createPlaceholder(s.getBoundingClientRect().height);
        // placeholder = document.createElement('div');
        // placeholder.classList.add('placeholder');
        s.parentNode.insertBefore(
          placeholder,
          s.nextSibling
        );

        // placeholder.style.height = `${s.getBoundingClientRect().height}px`;
        // placeholder.style.border = `solid 1px red`;
      });

      this.onEvent('ids-dragend', s, (event) => {
        placeholder && placeholder.remove();
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

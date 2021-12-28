import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import Base from './ids-swaplist-base';
import IdsCard from '../ids-card/ids-card';
import IdsButton from '../ids-button/ids-button';
import IdsListView from '../ids-list-view/ids-list-view';

import styles from './ids-swaplist.scss';

const DEFAULT_COUNT = 2;

/**
 * IDS SwapList Component
 * @type {IdsSwapList}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */

@customElement('ids-swaplist')
@scss(styles)
export default class IdsSwapList extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // sets up the proper template for each list-view
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
    this.getAllLists().forEach((l) => {
      l.defaultTemplate = this.defaultTemplate;
    });

    this.container.querySelectorAll('ids-button').forEach((b) => {
      this.onEvent('click', b, () => {
        if (b.classList.contains('left-arrow')) {
          this.swapToPreviousList(b);
        } else if (b.classList.contains('right-arrow')) {
          this.swapToNextList(b);
        }
      });
    });
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.COUNT
    ];
  }

  swapToNextList(button) {
    console.log('swapToNextList')
    const currentCard = button.parentElement.parentElement;
    console.log(currentCard)
    const currentList = currentCard.querySelector('ids-list-view');
    console.log(currentList)
    const nextCard = currentCard.nextSibling;
    console.log(nextCard);
    const nextList = nextCard.querySelector('ids-list-view');
    console.log(nextList)
    // query select the next list-view node
    currentList.selectedLi.forEach((x) => {
      nextList.appendChild(x);
    // move selected node(s) into that list-view
    });
  }

  swapToPreviouList(button) {
    // query select the previous list-view node
      // move node(s) into that list-view
  }

  getAllLists() {
    return this.container.querySelectorAll('ids-list-view');
  }

  set count(value) {
    const val = parseInt(value);
    if (!Number.isNaN(val)) this.setAttribute(attributes.COUNT, val);
    else this.setAttribute(attributes.COUNT, DEFAULT_COUNT);
  }

  get count() {
    const val = this.getAttribute(attributes.COUNT);
    return parseInt(val) || DEFAULT_COUNT;
  }

  buttonTemplate(i) {
    const leftArrow = `
      <ids-button id="${i}-left-arrow" class="left-arrow">
        <span slot="text" class="audible">Swap Item Left</span>
        <ids-icon slot="icon" icon="arrow-left"></ids-icon>
      </ids-button>
    `;

    const rightArrow = `
      <ids-button id="${i}-right-arrow" class="right-arrow">
        <span slot="text" class="audible">Swap Item Left</span>
        <ids-icon slot="icon" icon="arrow-right"></ids-icon>
      </ids-button>
    `;
    let html = ``;
    if (i > 0 && i < this.count - 1) {
      // render left and right arrow button
      html = leftArrow + rightArrow;
    } else if (i === 0) {
      // render the right arrow button
      html = rightArrow;
    } else if (i === this.count - 1) {
      // render the left arrow button
      html = leftArrow;
    }

    return html;
  }

  listTemplate() {
    const arr = Array(this.count).fill(0);

    const html = arr.map((v, i) => `
      <ids-card auto-fit>
        <div slot="card-header">
          <ids-text>List #${i}</ids-text>
          ${this.buttonTemplate(i)}
        </div>
        <div slot="card-content">
          <ids-list-view selectable="multiple" sortable>
          </ids-list-view>
        </div>
      </ids-card>
    `.trim()).join('');

    return html;
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-swaplist">
        ${this.listTemplate()}
      </div>
    `;
  }
}

import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import Base from './ids-swaplist-base';
import IdsDataSource from '../../core/ids-data-source';
import { injectTemplate } from '../../utils/ids-string-utils/ids-string-utils';
import '../ids-card/ids-card';
import '../ids-button/ids-button';
import '../ids-list-view/ids-list-view';
import '../ids-swappable/ids-swappable';

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

  datasource = new IdsDataSource();

  defaultTemplate = '';

  connectedCallback() {
    super.connectedCallback();
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
    this.attachEventHandlers();
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

  /**
   * Set the data array of the swaplist
   * @param {any | null} value The array to use
   */
  set data(value: any | null) {
    if (this.datasource) {
      this.datasource.data = value || [];
      this.render();
    }
  }

  get data(): any | null { return this?.datasource?.data || []; }

  /**
   * Swap the list item to the next list
   * @param {any} button htmlElement
   * @private
   * @returns {void}
   */
  #swapToNextList(button: any) {
    const currentCard = button.parentElement.parentElement.parentElement;
    const nextCard = currentCard.nextSibling;
    const nextList = nextCard.querySelector('ids-swappable');
    const selectedItems = currentCard.querySelectorAll('ids-swappable-item[selected]');

    selectedItems.forEach((x: any) => {
      nextList.appendChild(x);
      x.removeAttribute(attributes.SELECTED);
    });
  }

  /**
   * Swap the list item to the previous list
   * @param {any} button htmlElement
   * @private
   * @returns {void}
   */
  #swapToPreviousList(button: any) {
    const currentCard = button.parentElement.parentElement.parentElement;
    const prevCard = currentCard.previousSibling;
    const prevList = prevCard.querySelector('ids-swappable');
    const selectedItems = currentCard.querySelectorAll('ids-swappable-item[selected]');

    selectedItems.forEach((x: any) => {
      prevList.appendChild(x);
      x.removeAttribute(attributes.SELECTED);
    });
  }

  /**
   * Get all selected ids-swappable-item
   * @returns {any} NodeList of ids-swappable-items
   * @readonly
   * @memberof IdsSwapList
   */
  get selectedItems(): any {
    return this.container?.querySelectorAll('ids-swappable-item[selected]');
  }

  /**
   * Set the count of lists
   * @param {any} value number of lists
   * @memberof IdsSwapList
   */
  set count(value: any) {
    const val = parseInt(value);
    if (!Number.isNaN(val)) this.setAttribute(attributes.COUNT, String(val));
    else this.setAttribute(attributes.COUNT, String(DEFAULT_COUNT));
  }

  /**
   * Get the count of lists
   * @returns {number} number of lists
   * @readonly
   * @memberof IdsSwapList
   */
  get count(): number {
    const val = this.getAttribute(attributes.COUNT);
    return val ? parseInt(val) : DEFAULT_COUNT;
  }

  /**
   * Setup the next/prev button template
   * @param {number} i index of the list
   * @returns {object} html element
   * @memberof IdsSwapList
   */
  buttonTemplate(i: number): string {
    const leftArrow = `
      <ids-button id="left-arrow-${i}" class="left-arrow">
        <span slot="text" class="audible">Swap Item Left</span>
        <ids-icon slot="icon" icon="arrow-left" size="xsmall"></ids-icon>
      </ids-button>
    `;

    const rightArrow = `
      <ids-button id="right-arrow-${i}" class="right-arrow">
        <span slot="text" class="audible">Swap Item Left</span>
        <ids-icon slot="icon" icon="arrow-right" size="xsmall"></ids-icon>
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

  /**
   * Item template function that will generate the swappable items
   * @returns {object} function
   * @memberof IdsSwapList
   */
  itemTemplateFunc(): any {
    const func = (item: any) => this.itemTemplate(item);
    return func;
  }

  /**
   * Return an item's html injecting any values from the dataset as needed.
   * @param {any} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item: any): any {
    return injectTemplate(this.defaultTemplate, item);
  }

  /**
   * Set up the list view template
   * @returns {string} html element
   * @memberof IdsSwapList
   */
  listTemplate(): string {
    const arr = Array(this.count).fill(0);
    const arrLen = arr.length;

    const html = arr.map((v, i) => `
      <ids-card class="${arrLen === i + 1 ? `card card-${i} card-last` : `card card-${i}`}">
        <div slot="card-header">
          <ids-text font-size="20">List #${i}</ids-text>
          <div class="swap-buttons">
            ${this.buttonTemplate(i)}
          </div>
        </div>
        <div slot="card-content">
          <ids-swappable selection="multiple">
            ${this.data.length > 0 ? this.data?.map(this.itemTemplateFunc()).join('') : ''}
          </ids-swappable>
        </div>
      </ids-card>
    `.trim()).join('');

    return html;
  }

  /**
   * Handle the item swap logic
   * @param {any} e event paramater
   * @returns {void}
   * @private
   * @memberof IdsSwapList
   */
  #handleItemSwap(e: any) {
    if (e.target.classList.contains('left-arrow')) {
      this.#swapToPreviousList(e.target);
    } else if (e.target.classList.contains('right-arrow')) {
      this.#swapToNextList(e.target);
    }
  }

  /**
   * Attach event handlers
   * @memberof IdsSwapList
   */
  attachEventHandlers() {
    this.offEvent('click', this.container, (e: any) => this.#handleItemSwap(e));
    this.onEvent('click', this.container, (e: any) => this.#handleItemSwap(e));

    this.offEvent('touchend', this.container, (e: any) => this.#handleItemSwap(e));
    this.onEvent('touchend', this.container, (e: any) => this.#handleItemSwap(e));

    this.listen('Enter', this.container, (e: any) => this.#handleItemSwap(e));
  }

  render() {
    super.render(true);

    if (this.data?.length > 0) {
      this.attachEventHandlers();
    }

    return this;
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

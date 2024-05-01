import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import IdsDataSource from '../../core/ids-data-source';
import { injectTemplate, stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import '../ids-card/ids-card';
import '../ids-button/ids-button';
import '../ids-list-view/ids-list-view';
import '../ids-swappable/ids-swappable';

import styles from './ids-swaplist.scss';
import type IdsSwappable from '../ids-swappable/ids-swappable';

const Base = IdsKeyboardMixin(
  IdsLocaleMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

export interface IdsSwaplistData {
  id: number;
  name: string;
  items: IdsSwaplistDataItem[];
}

export interface IdsSwaplistDataItem {
  id: number;
  value: string;
  text: string;
}

/**
 * IDS SwapList Component
 * @type {IdsSwapList}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-swaplist')
@scss(styles)
export default class IdsSwapList extends Base {
  constructor() {
    super();
  }

  datasource = new IdsDataSource();

  state = {
    defaultTemplate: ''
  };

  connectedCallback() {
    super.connectedCallback();
    this.renderLists();
    this.attachEventHandlers();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.COUNT,
      attributes.SEARCHABLE,
    ];
  }

  /**
   * Set the data array of the swaplist
   * @param {any | null} value The array to use
   */
  set data(value: any | null) {
    if (this.datasource) {
      this.datasource.data = value || [];
      this.renderLists();
    }
  }

  get data(): any | null { return this?.datasource?.data || []; }

  /**
   * Set the internal template via JS
   */
  set defaultTemplate(value: any | null) {
    this.state.defaultTemplate = value;
  }

  get defaultTemplate(): any | null { return this.state.defaultTemplate || this.querySelector('template')?.innerHTML; }

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

    // swap list items in UI
    selectedItems.forEach((x: any) => {
      nextList.appendChild(x);
      x.removeAttribute(attributes.SELECTED);
    });

    this.#syncDatasource();

    this.#resetSearch();
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

    // swap list items in UI
    selectedItems.forEach((x: any) => {
      prevList.appendChild(x);
      x.removeAttribute(attributes.SELECTED);
    });

    this.#syncDatasource();

    this.#resetSearch();
  }

  /**
   * Gets swaplist item data by id
   * @param {number}id list item id
   * @returns {IdsSwaplistDataItem} swaplist item data
   */
  getListItemById(id: number): IdsSwaplistDataItem {
    return this.datasource.data
      .map((list) => list.items)
      .flat()
      .find((item) => id === item.id);
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
   * Set searchable which allows list view to be filtered
   * @param {string | boolean | null} value The value
   */
  set searchable(value: string | boolean | null) {
    this.toggleAttribute(attributes.SEARCHABLE, stringToBool(value));
  }

  get searchable(): boolean {
    return this.hasAttribute(attributes.SEARCHABLE);
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
        <span class="audible">Swap Item Left</span>
        <ids-icon icon="swap-list-left"></ids-icon>
      </ids-button>
    `;

    const rightArrow = `
      <ids-button id="right-arrow-${i}" class="right-arrow">
        <span class="audible">Swap Item Left</span>
        <ids-icon icon="swap-list-right"></ids-icon>
      </ids-button>
    `;

    const count = this.data.length;
    let html = ``;

    if (i > 0 && i < count - 1) {
      // render left and right arrow button
      html = leftArrow + rightArrow;
    } else if (i === 0) {
      // render the right arrow button
      html = rightArrow;
    } else if (i === count - 1) {
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
   * @param {IdsSwaplistDataItem} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item: IdsSwaplistDataItem): string {
    return `<ids-swappable-item data-value="${item.value}" data-id="${item.id}">
      ${injectTemplate(this.defaultTemplate, item)}
    </ids-swappable-item>`;
  }

  /**
   * Set up the list view template
   * @returns {string} html element
   * @memberof IdsSwapList
   */
  listTemplate(): string {
    const arr = Array(this.data.length).fill(0);
    const arrLen = arr.length;
    const data = this.data;
    const searchTermCaseSensitive = this.hasAttribute(attributes.SEARCH_TERM_CASE_SENSITIVE) ? attributes.SEARCH_TERM_CASE_SENSITIVE : '';
    const searchable = this.searchable ? `searchable ${searchTermCaseSensitive}` : '';

    return data.map((list: IdsSwaplistData, i: number) => {
      const listTemplate = `<ids-card
        class="list-card ${arrLen === i + 1 ? `card card-${i} card-last` : `card card-${i}`}"
        data-id="${list.id}"
        data-name="${list.name}">
        <div slot="card-header">
          <ids-text font-size="20">${list.name}</ids-text>
          <div class="swap-buttons">
            ${this.buttonTemplate(i)}
          </div>
        </div>
        <div slot="card-content">
          <ids-swappable selection="multiple" ${searchable}>
            ${list.items.length > 0 ? list.items?.map(this.itemTemplateFunc()).join('') : ''}
          </ids-swappable>
        </div>
      </ids-card>`;

      return listTemplate;
    }).join('');
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
   * Reset search term in all lists
   */
  #resetSearch() {
    const listCards = [...this.container!.querySelectorAll('ids-card.list-card')];
    listCards.forEach((listCard) => {
      const swappable = listCard.querySelector<IdsSwappable>('ids-swappable');
      swappable?.resetSearch();
    });
  }

  /**
   * Syncs UI list items with datasource
   * @private
   */
  #syncDatasource() {
    const listCards = [...this.container!.querySelectorAll('ids-card.list-card')];
    const listItems = listCards.map((listCard) => {
      const items = [...listCard.querySelectorAll('ids-swappable-item')]
        .map((item: any) => Number(item.getAttribute('data-id')))
        .map((itemId: any) => this.getListItemById(itemId));
      return items;
    });

    this.data.forEach((list: IdsSwaplistData, idx: number) => {
      list!.items = listItems[idx];
    });

    this.#triggerUpdate();
  }

  #triggerUpdate() {
    this.triggerEvent('updated', this, {
      detail: { data: this.data }
    });
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

    this.offEvent('drop', this.container);
    this.onEvent('drop', this.container, () => {
      this.#syncDatasource();
    });

    this.unlisten('Enter');
    this.listen('Enter', this.container, (e: any) => this.#handleItemSwap(e));
  }

  /**
   * Renders lists from datasource
   */
  renderLists() {
    if (this.container) {
      this.container.innerHTML = this.listTemplate();
    }
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-swaplist"></div>`;
  }
}

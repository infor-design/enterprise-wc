import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

import IdsDataSource from '../../core/ids-data-source';
import { IdsThemeMixin, IdsEventsMixin } from '../../mixins';

import IdsVirtualScroll from '../ids-virtual-scroll';
import styles from './ids-list-view.scss';

/**
 * IDS List View Component
 * @type {IdsListView}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @part container - the root container element
 * @part list - the ul list element
 * @part list-item - the li list element
 */

const DEFAULT_HEIGHT = 310;
@customElement('ids-list-view')
@scss(styles)
class IdsListView extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  datasource = new IdsDataSource();

  connectedCallback() {
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.VIRTUAL_SCROLL,
      attributes.MODE,
      attributes.VERSION,
      attributes.HEIGHT,
      attributes.ITEM_HEIGHT
    ];
  }

  /**
   * Helper method to render the static scrolling template
   * @returns {string} html
   */
  staticScrollTemplate() {
    // TODO: save this variable for list item template (to use in checkTemplateHeight)
    const listItems = this.data?.map((item) => `
      <ids-draggable axis="y">
        <li part="list-item" tabindex="0">
          <span></span>
          ${this.itemTemplate(item)}
        </li>
      </ids-draggable>
    `);

    const html = `
      <div class="ids-list-view" part="container">
        <div part="list">
          ${listItems.length > 0 ? listItems.reduce((htmlA, htmlB) => htmlA + htmlB) : ''}
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Helper method to render the dynamic scrolling template
   * @returns {string} html
   */
  dynamicScrollTemplate() {
    const html = `
      <ids-virtual-scroll height=${this.height} item-height="${this.itemHeight}">
        <div class="ids-list-view" part="container">
          <div slot="contents" part="list">
          </div>
        </div>
      </ids-virtual-scroll>
    `;

    return html;
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      ${this.virtualScroll ? this.dynamicScrollTemplate() : this.staticScrollTemplate()}
    `;
  }

  /**
   * Return an item's html injecting any values from the dataset as needed.
   * @param  {object} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item) {
    return IdsStringUtils.injectTemplate(this.defaultTemplate, item);
  }

  /**
   * Render the list by applying the template
   * @private
   */
  render() {
    super.render();
    if (this.virtualScroll && this?.data.length > 0) {
      /** @type {object} */
      this.virtualScrollContainer = this.shadowRoot.querySelector('ids-virtual-scroll');
      this.virtualScrollContainer.itemTemplate = (item) => `
        <ids-draggable axis="y">  
          <li part="list-item" tabindex="0">
            <span></span>
            ${this.itemTemplate(item)}
          </li>
        </ids-draggable>
      `;
      this.virtualScrollContainer.itemCount = this.data.length;
      this.virtualScrollContainer.itemHeight = this.itemHeight || this.checkTemplateHeight(`<li id="height-tester">${this.itemTemplate(this.datasource.data[0])}</li>`);
      this.virtualScrollContainer.data = this.data;
      this.shadowRoot.querySelector('.ids-list-view').style.overflow = 'initial';
    }

    this.adjustHeight();
  }

  adjustHeight() {
    this.shadowRoot.querySelector('.ids-list-view').style.height = `${this.height}px`;
  }

  /**
   * Calculate the height of a  template element.
   * @private
   * @param  {string} itemTemplate The item template
   * @returns {number} The item height
   */
  checkTemplateHeight(itemTemplate) {
    this.shadowRoot.querySelector('.ids-list-view div').insertAdjacentHTML('beforeEnd', itemTemplate);
    const tester = this.shadowRoot.querySelector('#height-tester');
    const height = tester.offsetHeight;
    tester.remove();

    return height;
  }

  /**
   * Set the data array of the listview
   * @param {Array | null} value The array to use
   */
  set data(value) {
    this.datasource.data = value || [];
    this.render(true);
  }

  get data() { return this?.datasource?.data || []; }

  /**
   * Set the list view to use virtual scrolling for a large amount of elements.
   * @param {boolean|string} value true to use virtual scrolling
   */
  set virtualScroll(value) {
    if (IdsStringUtils.stringToBool(value)) {
      this.setAttribute(attributes.VIRTUAL_SCROLL, value.toString());
    } else {
      this.removeAttribute(attributes.VIRTUAL_SCROLL);
    }
    this.render();
  }

  get virtualScroll() { return IdsStringUtils.stringToBool(this.getAttribute(attributes.VIRTUAL_SCROLL)); }

  set height(value) {
    if (value) {
      this.setAttribute(attributes.HEIGHT, value);
    } else {
      this.setAttribute(attributes.HEIGHT, DEFAULT_HEIGHT);
    }
  }

  get height() {
    return this.getAttribute(attributes.HEIGHT) || DEFAULT_HEIGHT;
  }

  set itemHeight(value) {
    if (value) {
      this.setAttribute(attributes.ITEM_HEIGHT, value);
    } else {
      this.removeAttribute(attributes.ITEM_HEIGHT);
    }
  }

  get itemHeight() {
    return this.getAttribute(attributes.ITEM_HEIGHT) || false;
  }
}

export default IdsListView;

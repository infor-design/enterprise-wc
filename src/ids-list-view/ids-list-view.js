import {
  IdsElement,
  customElement,
  scss,
  props
} from '../ids-base/ids-element';

import { IdsDataSourceMixin } from '../ids-base/ids-data-source-mixin';
import IdsVirtualScroll from '../ids-virtual-scroll/ids-virtual-scroll';

import styles from './ids-list-view.scss';

/**
 * IDS List View Component
 */
@customElement('ids-list-view')
@scss(styles)
class IdsListView extends IdsElement {
  constructor() {
    super();
  }

  connectedCallBack() {
    this.datasource = new IdsDataSourceMixin();
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.DATA, props.VIRTUAL_SCROLL];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    let html = '';

    if (this?.data.length > 0 && this.virtualScroll !== 'true') {
      html = `<div class="ids-list-view"><ul>`;

      this.data.forEach((item) => {
        html += `<li>${this.itemTemplate(item)}</li>`;
      });

      html += `</ul></div>`;
      return html;
    }

    if (this?.data.length > 0 && this.virtualScroll === 'true') {
      // TODO Make 310 dynamic  item-height="43" item-count="1000"
      html = `<ids-virtual-scroll height="310">
          <div class="ids-list-view">
            <ul slot="contents">
            </ul>
          </div>
        </ids-virtual-scroll>`;
      return html;
    }
    return `<div class="ids-list-view"></div>`;
  }

  /**
   * Return a item's html injecting any values from the dataset as needed.
   * @param  {object} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item) {
    return this.injectTemplate(this.defaultTemplate, item);
  }

  /**
   * Rerender the list by re applying the template
   * @private
   */
  rerender() {
    const template = document.createElement('template');
    const html = this.template();

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
    }

    if (html) {
      template.innerHTML = html;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    if (this.virtualScroll === 'true' && this?.data.length > 0) {
      this.virtualScrollContainer = this.shadowRoot.querySelector('ids-virtual-scroll');
      this.virtualScrollContainer.itemTemplate = (item) => `<li>${this.itemTemplate(item)}</li>`;
      this.virtualScrollContainer.itemCount = this.data.length;
      this.virtualScrollContainer.itemHeight = this.checkTemplateHeight(`<li id="height-tester">${this.itemTemplate(this.datasource.data[0] || {})}</li>`);
      this.virtualScrollContainer.data = this.data;

      this.shadowRoot.querySelector('.ids-list-view').style.overflow = 'initial';
    }
  }

  /**
   * Calculate the height of a  template element.
   * @private
   * @param  {string} itemTemplate The item template
   * @returns {number} The item height
   */
  checkTemplateHeight(itemTemplate) {
    this.shadowRoot.querySelector('.ids-list-view ul').insertAdjacentHTML('beforeEnd', itemTemplate);
    const tester = this.shadowRoot.querySelector('#height-tester');
    const height = tester.offsetHeight;
    tester.remove();
    return height;
  }

  /**
   * Set the data array of the listview
   * @param {Array} value The array to use
   */
  set data(value) {
    if (value) {
      this.datasource.data = value;
      this.rerender();
      return;
    }

    this.datasource.data = null;
  }

  get data() { return this?.datasource?.data || []; }

  /**
   * Set the list view to use virtual scrolling for a large amount of elements.
   * @param {boolean} value true to use virtual scrolling
   */
  set virtualScroll(value) {
    if (value) {
      this.setAttribute(props.VIRTUAL_SCROLL, value);
      this.rerender();
      return;
    }

    this.removeAttribute(props.VIRTUAL_SCROLL);
    this.rerender();
  }

  get virtualScroll() { return this.getAttribute(props.VIRTUAL_SCROLL) || 'true'; }
}

export default IdsListView;

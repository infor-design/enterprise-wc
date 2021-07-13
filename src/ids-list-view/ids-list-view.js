import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix,
  stringUtils
} from '../ids-base';

import IdsDataSource from '../ids-base/ids-data-source';
import { IdsThemeMixin, IdsEventsMixin } from '../ids-mixins';

import IdsVirtualScroll from '../ids-virtual-scroll/ids-virtual-scroll';
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
      attributes.VERSION
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    let html = '';

    if (this?.data.length > 0 && this.virtualScroll !== 'true') {
      html = `<div class="ids-list-view" part="container"><ul part="list">`;

      this.data.forEach((item) => {
        html += `<li part="list-item">${this.itemTemplate(item)}</li>`;
      });

      html += `</ul></div>`;
      return html;
    }

    if (this?.data.length > 0 && this.virtualScroll === 'true') {
      html = `<ids-virtual-scroll height="310">
          <div class="ids-list-view" part="container">
            <ul slot="contents" part="list">
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
    return stringUtils.injectTemplate(this.defaultTemplate, item);
  }

  /**
   * Render the list by applying the template
   * @private
   */
  render() {
    super.render();

    if (stringUtils.stringToBool(this.virtualScroll) && this?.data.length > 0) {
      /** @type {object} */
      this.virtualScrollContainer = this.shadowRoot.querySelector('ids-virtual-scroll');
      this.virtualScrollContainer.itemTemplate = (/** @type {object} */ item) => `<li part="listitem">${this.itemTemplate(item)}</li>`;
      this.virtualScrollContainer.itemCount = this.data.length;
      this.virtualScrollContainer.itemHeight = this.checkTemplateHeight(`<li id="height-tester">${this.itemTemplate(this.datasource.data[0])}</li>`);
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
    /** @type {object} */
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
    if (value) {
      this.setAttribute(attributes.VIRTUAL_SCROLL, value.toString());
      if (this?.data.length > 0) {
        this.render();
      }
      return;
    }

    this.removeAttribute(attributes.VIRTUAL_SCROLL);
    this.render();
  }

  get virtualScroll() { return this.getAttribute(attributes.VIRTUAL_SCROLL) || 'false'; }
}

export default IdsListView;

import {
  IdsElement,
  customElement,
  scss,
  props,
  mix,
  stringUtils
} from '../ids-base/ids-element';

import { IdsDataSource } from '../ids-base/ids-data-source';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';

// @ts-ignore
import IdsVirtualScroll from '../ids-virtual-scroll/ids-virtual-scroll';
// @ts-ignore
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
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.VIRTUAL_SCROLL,
      props.MODE,
      props.VERSION
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    let html = '';

    // @ts-ignore
    if (this?.data.length > 0 && this.virtualScroll !== 'true') {
      html = `<div class="ids-list-view" part="container"><ul part="list">`;

      // @ts-ignore
      this.data.forEach((item) => {
        html += `<li part="list-item">${this.itemTemplate(item)}</li>`;
      });

      html += `</ul></div>`;
      return html;
    }

    // @ts-ignore
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
    // @ts-ignore
    return stringUtils.injectTemplate(this.defaultTemplate, item);
  }

  /**
   * Rerender the list by re applying the template
   * @private
   */
  rerender() {
    const template = document.createElement('template');
    const html = this.template();

    // @ts-ignore
    this.shadowRoot.innerHTML = '';
    template.innerHTML = html;
    // @ts-ignore
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // @ts-ignore
    if (stringUtils.stringToBool(this.virtualScroll) && this?.data.length > 0) {
      /** @type {object} */
      // @ts-ignore
      this.virtualScrollContainer = this.shadowRoot.querySelector('ids-virtual-scroll');
      this.virtualScrollContainer.itemTemplate = (/** @type {object} */ item) => `<li part="listitem">${this.itemTemplate(item)}</li>`;
      // @ts-ignore
      this.virtualScrollContainer.itemCount = this.data.length;
      // @ts-ignore
      this.virtualScrollContainer.itemHeight = this.checkTemplateHeight(`<li id="height-tester">${this.itemTemplate(this.datasource.data[0])}</li>`);
      this.virtualScrollContainer.data = this.data;

      // @ts-ignore
      this.shadowRoot.querySelector('.ids-list-view').style.overflow = 'initial';
    }
    this.container = this.shadowRoot.querySelector('.ids-list-view');
  }

  /**
   * Calculate the height of a  template element.
   * @private
   * @param  {string} itemTemplate The item template
   * @returns {number} The item height
   */
  checkTemplateHeight(itemTemplate) {
    // @ts-ignore
    this.shadowRoot.querySelector('.ids-list-view ul').insertAdjacentHTML('beforeEnd', itemTemplate);
    /** @type {object} */
    // @ts-ignore
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
    this.rerender();
  }

  get data() { return this?.datasource?.data || []; }

  /**
   * Set the list view to use virtual scrolling for a large amount of elements.
   * @param {boolean|string} value true to use virtual scrolling
   */
  set virtualScroll(value) {
    if (value) {
      this.setAttribute(props.VIRTUAL_SCROLL, value.toString());
      this.rerender();
      return;
    }

    this.removeAttribute(props.VIRTUAL_SCROLL);
    this.rerender();
  }

  get virtualScroll() { return this.getAttribute(props.VIRTUAL_SCROLL) || 'false'; }
}

export default IdsListView;

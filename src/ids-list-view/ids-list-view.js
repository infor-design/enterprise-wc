import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import { IdsDataSourceMixin } from '../ids-base/ids-data-source-mixin';
import IdsVirtualScroll from '../ids-virtual-scroll/ids-virtual-scroll';

import styles from './ids-list-view.scss';

/**
 * IDS Label Component
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
    return ['data'];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    if (this?.data.length > 0) {
      let html = `<div class="ids-list-view"><ul>`;

      this.data.forEach((item) => {
        html += `<li>${this.itemTemplate(item)}</li>`;
      });

      html += `</ul></div>`;
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
   * Rerender the component
   * @private
   */
  rerender() {
    const template = document.createElement('template');
    const oldRoot = this.shadowRoot?.querySelector('.ids-list-view');
    const html = this.template();

    if (oldRoot) {
      oldRoot.remove();
    }

    if (html) {
      template.innerHTML = html;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
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
}

export default IdsListView;

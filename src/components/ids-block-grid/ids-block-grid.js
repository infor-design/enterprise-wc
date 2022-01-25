import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsDataSource from '../../core/ids-data-source';
import IdsBlockGridItem from './ids-block-grid-item';
import Base from './ids-block-grid-base';

import styles from './ids-block-grid.scss';

/**
 * IDS Block Grid Component
 * @type {IdsBlockgrid}
 * @inherits IdsElement
 */
@customElement('ids-block-grid')
@scss(styles)
export default class IdsBlockgrid extends Base {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      attributes.ALIGN,
      attributes.SELECTION,
    ];
  }

  /** Reference to datasource API */
  datasource = new IdsDataSource();

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template() {
    return `<div class="ids-block-grid-wrapper"><slot></slot></div>`;
  }

  /**
   * Rerender the list by re applying the template
   * @private
   */
  rerender() {
    if (this.data.length === 0) {
      return;
    }

    const template = document.createElement('template');
    const html = this.template();

    // Render and append styles
    this.shadowRoot.innerHTML = '';
    this.hasStyles = false;
    this.appendStyles();
    template.innerHTML = html;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.querySelectorAll('ids-block-grid-item').forEach((item) => item?.remove());
    this.data.forEach((d) => {
      const settings = {};
      if (this.selection) {
        settings.selection = this.selection;
      }

      const gridItem = new IdsBlockGridItem(settings);
      gridItem.innerHTML = `
        <img src="${d.url}" alt="Placeholder 200x200" />
        <ids-text type="p">
          ${d.name}<br/>
          ${d.title}
        </ids-text>
      `;
      this.appendChild(gridItem);
    });
    super.rerender();
  }

  /**
   * Set the data array of the blockgrid
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
   * Return the alignment of blockgrid
   * @returns {string|null} The path data
   */
  get align() { return this.getAttribute(attributes.ALIGN); }

  /**
   * Set the alignment of blockgrid
   * @param {string|null} value The Blockgrid Alignment
   */
  set align(value) {
    if (value) {
      this.setAttribute(attributes.ALIGN, value);
      this.style.textAlign = `${value}`;
    } else {
      this.removeAttribute(attributes.ALIGN);
      this.style.removeProperty('text-align');
    }
  }

  /**
   * Set the selection to a block-grid and it will add selection to all items
   * @param {string} value The selection value
   */
  set selection(value) {
    this.syncSelectionOnItems();
  }

  get selection() {
    return this.getAttribute(attributes.SELECTION);
  }

  /**
   * Add selection value to all block-grid-items
   */
  syncSelectionOnItems() {
    this.querySelectorAll('ids-block-grid-item').forEach((item) => item.setAttribute(attributes.SELECTION, this.selection));
  }
}

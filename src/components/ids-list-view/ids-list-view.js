import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { DEFAULT_HEIGHT } from './ids-list-view-attributes';
import { injectTemplate, stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsDataSource from '../../core/ids-data-source';
import IdsVirtualScroll from '../ids-virtual-scroll/ids-virtual-scroll';
import Base from './ids-list-view-base';

import styles from './ids-list-view.scss';

/**
 * IDS List View Component
 * @type {IdsListView}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsEventsMixin
 * @part container - the root container element
 * @part list - the ul list element
 * @part list-item - the li list element
 */
@customElement('ids-list-view')
@scss(styles)
export default class IdsListView extends Base {
  constructor() {
    super();
  }

  datasource = new IdsDataSource();

  connectedCallback() {
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
    this.#handleKeys();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.DRAGGABLE,
      attributes.HEIGHT,
      attributes.ITEM_HEIGHT,
      attributes.MODE,
      attributes.VERSION,
      attributes.VIRTUAL_SCROLL
    ];
  }

  /**
   * Helper method to render the static scrolling template
   * @returns {string} html
   */
  staticScrollTemplate() {
    // TODO: save this variable for list item template (to use in checkTemplateHeight)
    const listItems = this.data?.map((item, index) => `
      ${this.draggable ? `<ids-draggable axis="y">` : '' }
        <div part="list-item" tabindex="${index === 0 ? '0' : '-1'}">
          ${this.draggable ? `<span></span>` : ``}
          ${this.itemTemplate(item)}
        </div>
      ${this.draggable ? `</ids-draggable>` : '' }
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
   * Helper method to render the virtual scrolling template
   * @returns {string} html
   */
  virtualScrollTemplate() {
    const html = `
      <ids-virtual-scroll height="${this.height}" item-height="${this.itemHeight}">
        <div class="ids-list-view" part="container">
          <div slot="contents" part="list">
          </div>
        </div>
      </ids-virtual-scroll>
    `;

    return html;
  }

  /**
   * Sets up keyboard navigation among list elements
   * @returns {void}
   */
  #handleKeys() {
    // Arrow key navigates up and down
    this.listen(['ArrowUp', 'ArrowDown'], this, (e) => {
      const focused = this.shadowRoot.querySelector('[part="list-item"][tabindex="0"]');
      focused.setAttribute('tabindex', '-1');
      if (e.key === 'ArrowDown') {
        if (this.draggable) {
          focused.parentElement.nextElementSibling.firstElementChild.setAttribute('tabindex', '0');
          focused.parentElement.nextElementSibling.firstElementChild.focus();
        } else {
          focused.nextElementSibling.setAttribute('tabindex', '0');
          focused.nextElementSibling.focus();
        }
        return;
      }

      if (this.draggable) {
        focused.parentElement.previousElementSibling.firstElementChild.setAttribute('tabindex', '0');
        focused.parentElement.previousElementSibling.firstElementChild.focus();
      } else {
        focused.previousElementSibling.setAttribute('tabindex', '0');
        focused.previousElementSibling.focus();
      }
    });
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      ${this.virtualScroll ? this.virtualScrollTemplate() : this.staticScrollTemplate()}
    `;
  }

  /**
   * Return an item's html injecting any values from the dataset as needed.
   * @param  {object} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item) {
    return injectTemplate(this.defaultTemplate, item);
  }

  /**
   * Render the list by applying the template
   * @private
   */
  render() {
    super.render();

    if (this.virtualScroll && this?.data.length > 0) {
      this.virtualScrollContainer = this.shadowRoot.querySelector('ids-virtual-scroll');
      this.virtualScrollContainer.itemTemplate = (item, index) => `
        ${this.draggable ? `<ids-draggable axis="y">` : ``}
          <div part="list-item" tabindex="${index === 0 ? '0' : '-1'}">
            ${this.draggable ? `<span></span>` : ``}
            ${this.itemTemplate(item)}
          </div>
        ${this.draggable ? `</ids-draggable>` : ``}
        `;
      this.virtualScrollContainer.itemCount = this.data.length;
      this.virtualScrollContainer.itemHeight = this.itemHeight || this.checkTemplateHeight(`
        <div part="list-item" tabindex="-1" id="height-tester">
          ${this.itemTemplate(this.datasource.data[0])}
        </div>
      `);
      this.virtualScrollContainer.data = this.data;
      this.shadowRoot.querySelector('.ids-list-view').style.overflow = 'initial';
    }

    this.adjustHeight();
  }

  /**
   * Set the height of the list after loading the template
   * @private
   */
  adjustHeight() {
    this.shadowRoot.querySelector('.ids-list-view').style.height = `${this.height}px`;
  }

  /**
   * Calculate the height of a template element.
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
    if (stringToBool(value)) {
      this.setAttribute(attributes.VIRTUAL_SCROLL, value.toString());
    } else {
      this.removeAttribute(attributes.VIRTUAL_SCROLL);
    }
    this.render();
  }

  get virtualScroll() { return stringToBool(this.getAttribute(attributes.VIRTUAL_SCROLL)); }

  /**
   * Set the expected height of the viewport for virtual scrolling
   * @param {string} value true to use virtual scrolling
   */
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

  /**
   * Set the expected height of each item
   * @param {string} value true to use virtual scrolling
   */
  set itemHeight(value) {
    if (value) {
      this.setAttribute(attributes.ITEM_HEIGHT, value);
    } else {
      this.removeAttribute(attributes.ITEM_HEIGHT);
    }
  }

  get itemHeight() {
    return this.getAttribute(attributes.ITEM_HEIGHT);
  }

  /**
   * Set to true to allow items to be draggable/sortable
   * @param {string} value true to use draggable
   */
  set draggable(value) {
    if (value) {
      this.setAttribute(attributes.DRAGGABLE, value);
    } else {
      this.removeAttribute(attributes.DRAGGABLE);
    }
  }

  get draggable() {
    return stringToBool(this.getAttribute(attributes.DRAGGABLE));
  }

  /**
   * Passes focus from the Panel to its Header component
   * @returns {void}
   */
  focus() {
    this.shadowRoot.querySelector('.ids-list-view [tabindex="0"]')?.focus();
  }
}

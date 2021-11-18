import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

// Import Utils
import { IdsStringUtils as stringUtils } from '../../utils';

import IdsDataSource from '../../core/ids-data-source';
import { IdsThemeMixin, IdsKeyboardMixin, IdsEventsMixin } from '../../mixins';

import IdsVirtualScroll from '../ids-virtual-scroll';
import styles from './ids-list-view.scss';

const DEFAULT_HEIGHT = 310;

/**
 * IDS List View Component
 * @type {IdsListView}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsEventsMixin
 * @part container - the root container element
 * @part list - the list element
 * @part list-item - the li list element
 */
@customElement('ids-list-view')
@scss(styles)
class IdsListView extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  // the currently focused list item
  #focusedLiIndex = 0;

  datasource = new IdsDataSource();

  connectedCallback() {
    this.virtualScroll = true;
    this.itemHeight = 72;
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
    super.connectedCallback();
    if (!this.virtualScroll) this.#attachEventListeners();
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

  getAllLi() {
    return this.container.querySelectorAll('div[part="list-item"]');
  }

  getAllDraggable() {
    return this.draggle ? this.container.querySelectorAll('ids-draggable') : null;
  }

  #attachEventListeners() {
    this.#attachClickListeners();
    this.#attachKeyboardListeners();
  }

  #attachClickListeners() {
    this.getAllLi().forEach((item) => {
      this.#attachClickListenersForItems(item);
    });
  }

  // each click on an item - always set that to focus, toggle the selected feature
  #attachClickListenersForItems(item) {
    this.onEvent('click', item, (event) => {
      if (this.getFocusedLi !== item) {
        this.focusLi(item);
      }
    });
  }

  #attachKeyboardListeners() {
    this.getAllLi().forEach((item) => {
      this.#attachKeyboardListenersForItems(item);
    });

    this.onEvent('keydown', document, (event) => {
      switch (event.key) {
      case 'ArrowUp':
        if (this.#focusedLiIndex && !this.getFocusedLi()) {
          this.virtualScrollContainer.scrollToIndex(this.#focusedLiIndex);
          this.focusLi(this.getPreviousLi(this.getFocusedLi()));
        }
        break;
      case 'ArrowDown':
        if (this.#focusedLiIndex && !this.getFocusedLi()) {
          this.virtualScrollContainer.scrollToIndex(this.#focusedLiIndex);
          this.focusLi(this.getNextLi(this.getFocusedLi()));
        }
        break;
      default:
        break;
      }
    });
  }

  #attachKeyboardListenersForItems(item) {
    this.onEvent('keydown', item, (event) => {
      switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.focusLi(this.getPreviousLi(this.getFocusedLi()));
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusLi(this.getNextLi(this.getFocusedLi()));
        break;
      default:
        break;
      }
    });
  }

  focusLi(li) {
    if (li) {
      // remove tabindex from previous focus
      this.getFocusedLi()?.setAttribute('tabindex', '-1');

      // init new focus
      this.#focusedLiIndex = li.getAttribute('index');
      li.setAttribute('tabindex', '0');
      li.focus();
    }
  }

  getFocusedLi() {
    const savedFocusedLi = this.container.querySelector(`div[part="list-item"][index="${this.#focusedLiIndex}"]`);
    const val = savedFocusedLi ?? this.container.querySelector('div[part="list-item"][tabindex="0"]');
    return val;
  }

  getPreviousLi(li) {
    return this.draggable
      ? li.parentElement.previousElementSibling?.firstElementChild // needs to navigate outside to ids-draggable wrapper
      : li.previousElementSibling;
  }

  getNextLi(li) {
    return this.draggable
      ? li.parentElement.nextElementSibling?.firstElementChild
      : li.nextElementSibling;
  }

  listItemTemplateFunc() {
    const func = (item, index) => `
      ${this.draggable ? `<ids-draggable axis="y">` : '' }
        <div
          part="list-item"
          tabindex="-1"
          index="${index}"
        >
          ${this.draggable ? `<span></span>` : ``}
          ${this.itemTemplate(item)}
        </div>
      ${this.draggable ? `</ids-draggable>` : '' }
    `;

    return func;
  }

  /**
   * Helper method to render the static scrolling template
   * @returns {string} html
   */
  staticScrollTemplate() {
    return `
      <div class="ids-list-view">
        <div class="ids-list-view-body">
          ${this.data.length > 0 ? this.data?.map(this.listItemTemplateFunc()).join('') : ''}
        </div>
      </div>
    `;
  }

  /**
   * Helper method to render the virtual scrolling template
   * @returns {string} html
   */
  virtualScrollTemplate() {
    const html = `
      <div class="ids-list-view">
        <ids-virtual-scroll
          height=${this.height}
          item-height="${this.itemHeight}"
        >
          <div class="ids-list-view-body" part="style-wrapper"></div>
        </ids-virtual-scroll>
      </div>
    `;

    return html;
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
    return stringUtils.injectTemplate(this.defaultTemplate, item);
  }

  #refocus() {
    // this causes a circular loop -- setting the scrollTop calls renderItems()
    // this.virtualScrollContainer.scrollToIndex(this.#focusedLiIndex);

    this.getFocusedLi()?.focus();
  }

  /**
  * Render the list by applying the template
  * @private
  */
  render() {
    super.render();

    if (this.virtualScroll && this?.data.length > 0) {
      // reattach event listeners and refocus any focused list item
      this.onEvent('ids-virtual-scroll-afterrender', this.virtualScrollContainer, () => {
        this.#attachEventListeners();
        if (this.#focusedLiIndex) this.#refocus();
      });

      // set the virtual-scroll item-height attribute
      const itemHeight = this.itemHeight || this.checkTemplateHeight(`
        <div part="list-item" tabindex="-1" id="height-tester">
          ${this.itemTemplate(this.datasource.data[0])}
        </div>
      `);

      this.virtualScrollContainer.itemHeight = itemHeight; // calls renderItems()

      this.virtualScrollContainer.itemTemplate = this.listItemTemplateFunc();
      this.virtualScrollContainer.data = this.data; // calls renderItems()

      // give the first list-item a tabbable index on first render
      this.container.querySelector('div[part="list-item"]').setAttribute('tabindex', '0');
    }

    this.adjustHeight();
  }

  get virtualScrollContainer() {
    return this.container.querySelector('ids-virtual-scroll');
  }

  /**
   * Set the height of the list after loading the template
   * @private
   */
  adjustHeight() {
    const rootContainer = this.virtualScroll ? this.virtualScrollContainer : this.container;
    rootContainer.style.height = `${this.height}px`;
  }

  /**
   * Calculate the height of a template element.
   * @private
   * @param  {string} itemTemplate The item template
   * @returns {number} The item height
   */
  checkTemplateHeight(itemTemplate) {
    this.container.insertAdjacentHTML('beforeEnd', itemTemplate);
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
    if (this.datasource) {
      this.datasource.data = value || [];
      this.render(true);
    }
  }

  get data() { return this?.datasource?.data || []; }

  /**
   * Set the list view to use virtual scrolling for a large amount of elements.
   * @param {boolean|string} value true to use virtual scrolling
   */
  set virtualScroll(value) {
    if (stringUtils.stringToBool(value)) {
      this.setAttribute(attributes.VIRTUAL_SCROLL, value.toString());
    } else {
      this.removeAttribute(attributes.VIRTUAL_SCROLL);
    }
    this.render();
  }

  get virtualScroll() { return stringUtils.stringToBool(this.getAttribute(attributes.VIRTUAL_SCROLL)); }

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
    return stringUtils.stringToBool(this.getAttribute(attributes.DRAGGABLE));
  }
}

export default IdsListView;

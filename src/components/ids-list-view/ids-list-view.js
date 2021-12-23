import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { injectTemplate, stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsDataSource from '../../core/ids-data-source';
import IdsVirtualScroll from '../ids-virtual-scroll/ids-virtual-scroll';
import Base from './ids-list-view-base';

import styles from './ids-list-view.scss';

const DEFAULT_HEIGHT = '100%';

/**
 * IDS List View Component
 * @type {IdsListView}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsEventsMixin
 * @part list-item - the li list element
 */
@customElement('ids-list-view')
@scss(styles)
export default class IdsListView extends Base {
  constructor() {
    super();
  }

  // the currently focused list item
  #focusedLiIndex = 0;

  // the currently selected list item
  #selectedLi;

  #selectedLiIndex;

  datasource = new IdsDataSource();

  connectedCallback() {
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
    super.connectedCallback();
    this.attachEventListeners();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.SORTABLE,
      attributes.SELECTABLE,
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

  addSortableStyles() {
    this.getAllLi().forEach((li) => {
      li.classList.add('sortable');
    });
  }

  attachEventListeners() {
    this.attachKeyboardListeners();

    // attaching both event listeners causes focus issues, so do it conditionally based on the sortable prop
    if (this.sortable) {
      this.attachDragEventListeners(); // for focusing and dragging list items
      this.addSortableStyles();
    } else {
      this.attachClickListeners(); // for focusing list items
    }
  }

  attachClickListeners() {
    this.getAllLi().forEach((item) => {
      this.attachClickListenersForItems(item);
    });
  }

  // each click on an item - always set that to focus, toggle the selected feature
  attachClickListenersForItems(item) {
    this.onEvent('click', item, () => {
      this.onClick(item);
    });
  }

  attachKeyboardListeners() {
    this.getAllLi().forEach((item) => {
      this.attachKeyboardListenersForItems(item);
    });

    this.onEvent('keydown', document, (event) => {
      switch (event.key) {
      case 'Tab':
        this.virtualScrollContainer?.scrollToIndex(this.#focusedLiIndex);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.#focusedLiIndex >= 0 && !this.getFocusedLi()) {
          this.virtualScrollContainer?.scrollToIndex(this.#focusedLiIndex);
          this.focusLi(this.getPreviousLi(this.getFocusedLi()));
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (this.#focusedLiIndex >= 0 && !this.getFocusedLi()) {
          this.virtualScrollContainer?.scrollToIndex(this.#focusedLiIndex);
          this.focusLi(this.getNextLi(this.getFocusedLi()));
        }
        break;
      default:
        break;
      }
    });
  }

  attachKeyboardListenersForItems(item) {
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

  onClick(item) {
    this.focusLi(item);
    if (this.selectable) this.toggleSelectedLi(item);
  }

  focusLi(li) {
    if (li) {
      const prevFocus = this.getFocusedLi();
      // remove tabindex from previous focus
      if (li !== prevFocus) {
        prevFocus?.setAttribute('tabindex', '-1');
        this.#focusedLiIndex = li.getAttribute('index');
      }
      // init new focus
      li.setAttribute('tabindex', '0'); // this clears after every render
      li.focus();
    }
  }

  getFocusedLi() {
    const savedFocusedLi = this.container.querySelector(`div[part="list-item"][index="${this.#focusedLiIndex}"]`);
    const val = savedFocusedLi ?? this.container.querySelector('div[part="list-item"][tabindex="0"]');
    return val;
  }

  getPreviousLi(li) {
    return this.sortable
      ? li.parentElement.previousElementSibling?.firstElementChild // needs to navigate outside to ids-draggable wrapper
      : li.previousElementSibling;
  }

  getNextLi(li) {
    return this.sortable
      ? li.parentElement.nextElementSibling?.firstElementChild
      : li.nextElementSibling;
  }

  listItemTemplateFunc() {
    const func = (item, index) => `
      ${this.sortable ? `<ids-draggable axis="y">` : '' }
        <div
          part="list-item"
          role="listitem"
          tabindex="-1"
          index="${index}"
        >
          ${this.sortable ? `<span></span>` : ``}
          ${this.itemTemplate(item)}
        </div>
      ${this.sortable ? `</ids-draggable>` : '' }
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
        <div class="ids-list-view-body" role="list">
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
          height="${this.height}"
          item-height="${this.itemHeight}"
        >
          <div class="ids-list-view-body" role="list" part="contents"></div>
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
    return injectTemplate(this.defaultTemplate, item);
  }

  #refocus() {
    // focused item is in range
    if (this.getFocusedLi() && this.#focusedLiIndex >= 0) {
      this.focusLi(this.getFocusedLi());
    }
  }

  /**
   * Render the list by applying the template
   * @private
   */
  render() {
    super.render();

    if (!this.virtualScroll && this.data?.length > 0) {
      this.attachEventListeners();
    }

    if (this.virtualScroll && this.data?.length > 0) {
      // reattach event listeners and refocus any focused list item
      this.onEvent('ids-virtual-scroll-afterrender', this.virtualScrollContainer, () => {
        this.attachEventListeners();
        if (this.#focusedLiIndex >= 0) this.#refocus();
        if (this.selectable) this.#reselect();
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
    rootContainer.style.height = `${this.height}`;
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
   * @param {string | number} value true to use virtual scrolling
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
   * @param {string | number} value true to use virtual scrolling
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

  set selectable(value) {
    const val = stringToBool(value);
    this.setAttribute(attributes.SELECTABLE, val);
  }

  get selectable() {
    return this.hasAttribute(attributes.SELECTABLE);
  }

  get selectedLi() {
    const savedSelectedLi = this.container.querySelector(`div[part="list-item"][index="${this.#selectedLiIndex}"]`);
    return savedSelectedLi;
  }

  /**
   * Helper function that toggles the 'selected' attribute of an element, then focuses on that element
   * @param {Element} item the item to add/remove the selected attribute
   * @param {boolean} switchValue optional switch values to force add/remove the selected attribute
   */
  toggleSelectedAttribute(item, switchValue) {
    const unselect = () => {
      item.removeAttribute('selected');
      this.#selectedLiIndex = null;
    };

    const select = () => {
      item.setAttribute('selected', 'selected');
      this.#selectedLiIndex = item.getAttribute('index');
    };

    if (switchValue === true) {
      select();
    } else if (switchValue === false) {
      unselect();
    } else {
      // otherwise toggle it depending on whether or not it has the attribute already
      const hasSelectedAttribute = item.getAttribute('selected');
      hasSelectedAttribute ? unselect() : select();

      this.focusLi(item);
    }
  }

  /**
   * Toggles the selected list item
   * @param {*} item the selected list item to toggle
   */
  toggleSelectedLi(item) {
    if (item.tagName === 'DIV' && item.getAttribute('part') === 'list-item') {
      const prevSelectedLi = this.selectedLi;
      if (item !== prevSelectedLi) {
        if (prevSelectedLi) {
          // unselect previous item if it's selected
          prevSelectedLi.setAttribute('tabindex', '-1');
          this.toggleSelectedAttribute(prevSelectedLi);
        }
      }
      this.toggleSelectedAttribute(item);
    }
  }

  #reselect() {
    const prevSelectedLi = this.selectedLi;
    if (prevSelectedLi) {
      this.toggleSelectedAttribute(prevSelectedLi, true);
    }
  }

  /**
   * Overrides the ids-sortable-mixin function to focus on item
   * @param {Element} el element to be dragged
   */
  onDragStart(el) {
    super.onDragStart(el);

    const li = el.querySelector('div[part="list-item"]');
    this.onClick(li);
  }

  /**
   * Overrides the ids-sortable-mixin function to focus on item
   * @param {Element} el element to be dragged
   */
  onDragEnd(el) {
    super.onDragEnd(el);

    const li = el.querySelector('div[part="list-item"]');
    li.focus();
  }

  /**
   * Overrides the ids-sortable-mixin function to add styling for the placeholder node
   * @param {Node} node the node to be cloned
   * @returns {Node} the cloned node
   */
  createPlaceholderNode(node) {
    const p = super.createPlaceholderNode(node);
    p.querySelector('div[part="list-item"]').classList.add('placeholder'); // for styling the placeholder
    return p;
  }
}

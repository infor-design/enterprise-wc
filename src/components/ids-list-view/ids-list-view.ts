import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { injectTemplate, stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsDataSource from '../../core/ids-data-source';
import '../ids-virtual-scroll/ids-virtual-scroll';
import Base from './ids-list-view-base';
import '../ids-swappable/ids-swappable';
import '../ids-swappable/ids-swappable-item';

import styles from './ids-list-view.scss';

const DEFAULT_HEIGHT = '100%';
const SELECTABLE_OPTIONS = ['single', 'multiple'];

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

  /** The currently focused list item */
  #focusedLiIndex: any = 0;

  /** The currently selected list item */
  #selectedLiIndex: any;

  /** The datasource container */
  datasource: Record<string, any> = new IdsDataSource();

  connectedCallback() {
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
    this.dataKeys = this.#extractTemplateLiteralsFromHTML(this.defaultTemplate);
    super.connectedCallback();
    this.#attachEventListeners();
    this.#attachKeyboardListeners();
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

  #extractTemplateLiteralsFromHTML(string: string) {
    const arr = string.split('${');
    arr.shift();
    const tokens = arr.map((x) => x.split('}')[0]);
    return tokens;
  }

  /**
   * Get list of all elements
   * @returns {any} List of all list item elements
   */
  getAllLi(): any {
    return this.container.querySelectorAll('div[part="list-item"]');
  }

  getAllSwappableItems(): any {
    return this.container.querySelectorAll('ids-swappable-item');
  }

  /**
   * Add the sortable class to the list items
   * @returns {void}
   */
  #addSortableStyles(): void {
    this.getAllLi().forEach((li: HTMLLIElement) => {
      li.classList.add('sortable');
    });
  }

  #attachEventListeners() {
    // attaching both event listeners causes focus issues, so do it conditionally based on the sortable prop
    if (this.sortable) {
      this.#addSortableStyles();
    } else {
      this.#attachClickListeners(); // for focusing list items
    }
  }

  #attachClickListeners() {
    this.getAllLi().forEach((item: HTMLLIElement) => {
      this.#attachClickListenersForItems(item);
    });
  }

  /**
   * Each click on an item - always set that to focus, toggle the selected feature
   * @param {HTMLLIElement} item The item to listen on
   * @returns {void}
   */
  #attachClickListenersForItems(item: HTMLLIElement) {
    this.onEvent('click', item, () => {
      this.onClick(item);
    });
  }

  /**
   * Attach keyboard functinality to the list items
   * @returns {void}
   */
  #attachKeyboardListeners() {
    this.onEvent('keydown', this, (event: KeyboardEvent) => {
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

  focusLi(li: HTMLLIElement) {
    if (li) {
      const prevFocus = this.getFocusedLi();
      // remove tabindex from previous focus
      if (li !== prevFocus) {
        prevFocus?.setAttribute('tabindex', '-1');
        this.#focusedLiIndex = li.getAttribute('index');
      }

      // Set accessbility
      const container = this.container.querySelector('.ids-list-view-body');
      container.setAttribute('aria-activedescendant', li.getAttribute('id'));

      // init new focus
      li.setAttribute('tabindex', '0'); // this clears after every render
      li.focus();
    }
  }

  getFocusedLi() {
    const savedFocusedLi = this.container.querySelector(`ids-swappable-item[role="listitem"][index="${this.#focusedLiIndex}"]`);
    const val = savedFocusedLi ?? this.container.querySelector('ids-swappable-item[role="listitem"][tabindex="0"]');
    return val;
  }

  getPreviousLi(li: any) {
    return li.previousElementSibling;
  }

  getNextLi(li: any) {
    return li.nextElementSibling;
  }

  listItemTemplateFunc() {
    const func = (item: any, index: number) => `
      ${this.sortable ? `<ids-swappable-item
        role="listitem"
        tabindex="-1"
        tabbable="false"
        index="${index}"
        id="id_item_${index + 1}"
        aria-posinset="${index + 1}"
        aria-setsize="${this.data.length}"
      >` : ''}
        <div
          part="list-item"
          tabindex="-1"
        >
          ${this.itemTemplate(item)}
        </div>
      ${this.sortable ? `</ids-swappable-item>` : ''}
    `;

    return func;
  }

  /**
   * Helper method to render the static scrolling template
   * @returns {string} html
   */
  staticScrollTemplate(): string {
    return `
      <div class="ids-list-view">
        <div class="ids-list-view-body" role="list">
          ${this.sortable ? `<ids-swappable selection=${this.selectable}>` : ''}
            ${this.data.length > 0 ? this.data?.map(this.listItemTemplateFunc()).join('') : ''}
          ${this.sortable ? `</ids-swappable>` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Helper method to render the virtual scrolling template
   * @returns {string} html
   */
  virtualScrollTemplate(): string {
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
  template(): string {
    return `
    ${this.virtualScroll ? this.virtualScrollTemplate() : this.staticScrollTemplate()}
  `;
  }

  /**
   * Return an item's html injecting any values from the dataset as needed.
   * @param  {object} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item: any): string {
    return injectTemplate(this.defaultTemplate, item);
  }

  #refocus() {
    // focused item is in range
    if (this.getFocusedLi() && this.#focusedLiIndex >= 0) {
      this.focusLi(this.getFocusedLi());
    }
  }

  /**
   * Update data from DOM
   * @returns {void}
   */
  updateDataFromDOM(): void {
    const newData: any = [];
    this.container.querySelectorAll('div[part="list-item"]').forEach((x: any) => {
      const objItem: any = {};
      x.querySelectorAll('ids-text').forEach((value: any, i: any) => {
        objItem[this.dataKeys[i]] = value.innerHTML;
      });

      newData.push(objItem);
    });

    if (this.datasource) {
      this.datasource.data = newData;
    }
  }

  /**
   * Render the list by applying the template
   * @private
   */
  render(): void {
    super.render();

    if (!this.virtualScroll && this.data?.length > 0) {
      this.#attachEventListeners();
    }

    if (this.virtualScroll && this.data?.length > 0) {
      requestAnimationFrame(() => {
        // reattach event listeners and refocus any focused list item
        this.onEvent('aftervirtualscroll', this.virtualScrollContainer, () => {
          this.#attachEventListeners();
          if (this.#focusedLiIndex >= 0) this.#refocus();
        });

        // set the virtual-scroll item-height attribute
        const itemHeight = this.itemHeight || this.#checkTemplateHeight(`
          <div part="list-item" tabindex="-1" id="height-tester">
            ${this.itemTemplate(this.datasource.data[0])}
          </div>
        `);

        this.virtualScrollContainer.itemHeight = itemHeight; // calls renderItems()
        this.virtualScrollContainer.itemTemplate = this.listItemTemplateFunc();
        this.virtualScrollContainer.data = this.data; // calls renderItems()

        // give the first list-item a tabbable index on first render
        const firstItem = this.container.querySelector('div[part="list-item"]');
        if (firstItem) firstItem.setAttribute('tabindex', '0');

        // reattach event listeners and refocus any focused list item
        this.onEvent('aftervirtualscroll', this.virtualScrollContainer, () => {
          this.#attachEventListeners();
          if (this.#focusedLiIndex >= 0) this.#refocus();
          if (this.selectable) this.#reselect();
        });
      });
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
  #checkTemplateHeight(itemTemplate: string) {
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
  set data(value: any) {
    if (this.datasource) {
      this.datasource.data = value || [];
      this.render();
    }
  }

  get data(): any { return this?.datasource?.data || []; }

  /**
   * Set the data array of the listview
   * @param {Array | null} value The array to use
   */
  set dataKeys(value: any) {
    if (this.datasource) {
      this.datasource.dataKeys = value || [];
    }
  }

  get dataKeys(): any { return this?.datasource?.dataKeys || []; }

  /**
   * Set the list view to use virtual scrolling for a large amount of elements.
   * @param {string | boolean} value true to use virtual scrolling
   */
  set virtualScroll(value: string | boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.VIRTUAL_SCROLL, value.toString());
    } else {
      this.removeAttribute(attributes.VIRTUAL_SCROLL);
    }
    this.render();
  }

  get virtualScroll(): string | boolean { return stringToBool(this.getAttribute(attributes.VIRTUAL_SCROLL)); }

  /**
   * Set the expected height of the viewport for virtual scrolling
   * @param {string | number} value true to use virtual scrolling
   */
  set height(value: string | number) {
    if (value) {
      this.setAttribute(attributes.HEIGHT, value);
    } else {
      this.setAttribute(attributes.HEIGHT, DEFAULT_HEIGHT);
    }
  }

  get height(): string | number {
    return this.getAttribute(attributes.HEIGHT) || DEFAULT_HEIGHT;
  }

  /**
   * Set the expected height of each item
   * @param {string | number} value true to use virtual scrolling
   */
  set itemHeight(value: string | number) {
    if (value) {
      this.setAttribute(attributes.ITEM_HEIGHT, value);
    } else {
      this.removeAttribute(attributes.ITEM_HEIGHT);
    }
  }

  get itemHeight(): string | number {
    return this.getAttribute(attributes.ITEM_HEIGHT);
  }

  /**
   * Set the selection mode of the listview
   * @param {string} value true to use virtual scrolling
   */
  set selectable(value: string) {
    if (SELECTABLE_OPTIONS.includes(value)) {
      this.setAttribute(attributes.SELECTABLE, value);
    } else {
      this.removeAttribute(attributes.SELECTABLE);
    }
  }

  get selectable(): string {
    return this.getAttribute(attributes.SELECTABLE);
  }

  /**
   * Getter that returns the selected list items
   * @returns {NodeList | HTMLElement} a list if multiselect is enabled, else the single selected list item
   */
  get selectedLi(): any {
    const savedSelectedLi = this.selectable === 'multiple'
      ? this.container.querySelector(`ids-swappable-item[selected]`)
      : this.container.querySelector(`ids-swappable-list[role="listitem"][index="${this.#selectedLiIndex}"]`);
    return savedSelectedLi;
  }

  /**
   * Handles the sortable property and reflects it on the DOM
   * @param {string | boolean} value the sortable parameter
   */
  set sortable(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.SORTABLE, val);
    } else {
      this.removeAttribute(attributes.SORTABLE);
    }
  }

  get sortable() {
    return this.hasAttribute(attributes.SORTABLE);
  }

  /*
   * Reset selected list item index
   */
  resetSelectedLiIndex() {
    this.#selectedLiIndex = null;
  }

  /**
   * Helper function that toggles the 'selected' attribute of an element, then focuses on that element
   * @param {Element} item the item to add/remove the selected attribute
   * @param {boolean} switchValue optional switch values to force add/remove the selected attribute
   */
  toggleSelectedAttribute(item: HTMLLIElement, switchValue?: boolean) {
    const unselect = () => {
      item.removeAttribute('selected');
      item.removeAttribute('aria-selected');
      this.#selectedLiIndex = null;
    };

    const select = () => {
      item.setAttribute('selected', 'selected');
      item.setAttribute('aria-selected', 'true');
      this.#selectedLiIndex = item.getAttribute('index');

      this.triggerEvent('itemSelect', this, {
        detail: this.getListItemData(item)
      });
    };

    if (switchValue === true) {
      select();
    } else if (switchValue === false) {
      unselect();
    } else {
      // otherwise toggle it depending on whether or not it has the attribute already
      const hasSelectedAttribute = item.hasAttribute('selected');
      if (hasSelectedAttribute) {
        unselect();
      } else {
        select();
      }

      this.focusLi(item);
    }
  }

  /**
   * Toggles the selected list item
   * @param {any} item the selected list item to toggle
   */
  toggleSelectedLi(item: any) {
    if (item.tagName === 'IDS-SWAPPABLE-ITEM') {
      if (this.selectable === 'single') {
        const prevSelectedLi: HTMLLIElement = this.selectedLi;
        if (item !== prevSelectedLi && prevSelectedLi) {
          // unselect previous item if it's selected
          this.toggleSelectedAttribute(prevSelectedLi);
        }
      }
      this.toggleSelectedAttribute(item);
    }
  }

  /**
   * Select the list item again
   * @returns {void }
   */
  #reselect(): void {
    const prevSelectedLi = this.selectedLi;
    if (prevSelectedLi) {
      this.toggleSelectedAttribute(prevSelectedLi, true);
    } else if (this.selectable === 'multiple') {
      if (prevSelectedLi.length > 0) {
        prevSelectedLi.forEach((l: HTMLLIElement) => {
          this.toggleSelectedAttribute(l, true);
        });
      }
    }
  }

  /**
   * Get data for list item
   * @param {Element} item list item
   * @returns {any} data object
   */
  getListItemData(item: Element) {
    const dataIdx = item.getAttribute('index');
    return dataIdx ? this.data[dataIdx] : {};
  }

  /**
   * Overrides the ids-sortable-mixin function to add styling for the placeholder node
   * @param {Node} node the node to be cloned
   * @returns {Node} the cloned node
   */
  createPlaceholderNode(node: any) {
    const p = super.createPlaceholderNode(node);
    p.querySelector('div[part="list-item"]').classList.add('placeholder'); // for styling the placeholder
    return p;
  }
}

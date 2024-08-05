import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import {
  injectTemplate,
  stringToBool,
  stringToNumber
} from '../../utils/ids-string-utils/ids-string-utils';

import IdsDataSource from '../../core/ids-data-source';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPagerMixin from '../../mixins/ids-pager-mixin/ids-pager-mixin';
import IdsScrollEffectMixin from '../../mixins/ids-scroll-effect-mixin/ids-scroll-effect-mixin';
import IdsListViewSearchMixin from './ids-list-view-search-mixin';

import '../ids-checkbox/ids-checkbox';
import '../ids-search-field/ids-search-field';
import '../ids-swappable/ids-swappable';
import '../ids-swappable/ids-swappable-item';
import '../ids-virtual-scroll/ids-virtual-scroll';
import './ids-list-view-item';
import './ids-list-view-group-header';
import styles from './ids-list-view.scss';

import type IdsSwappableItem from '../ids-swappable/ids-swappable-item';
import type IdsVirtualScroll from '../ids-virtual-scroll/ids-virtual-scroll';
import type IdsListViewItem from './ids-list-view-item';

type IdsListViewSelectableTypes = 'single' | 'mixed' | 'multiple' | '' | null;

const Base = IdsLocaleMixin(
  IdsPagerMixin(
    IdsScrollEffectMixin(
      IdsListViewSearchMixin(
        IdsKeyboardMixin(
          IdsEventsMixin(
            IdsElement
          )
        )
      )
    )
  )
);

export interface IdsListViewActivatedItem {
  /** The index value in current dataset */
  index: number;
  /** The data node in current dataset */
  data: any;
}

export interface IdsListViewSelectedItem {
  /** The index value in current dataset */
  index: number;
  /** The data node in current dataset */
  data: any;
}

export interface IdsListViewItemInfo {
  /** The DOM element, if available */
  item?: HTMLElement;
  /** The index value in current dataset */
  index: number;
  /** The data node in current dataset */
  data: any;
}

const SEARCH_MISMATCH_CLASS = 'search-mismatch';

// Default settings
const LIST_VIEW_DEFAULTS = {
  hideCheckboxes: false, // Only apply to selectable multiple
  height: '100%',
  label: 'Ids list view',
  selectableOptions: ['single', 'multiple', 'mixed'],
  sortable: false,
  suppressDeactivation: false, // Use with Mixed selection only
  suppressDeselection: true, // Use with Single selection only
  virtualScroll: false
};

/**
 * IDS List View Component
 * @type {IdsListView}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsPagerMixin
 * @mixes IdsScrollEffectMixin
 * @mixes IdsListViewSearchMixin
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

  /** Is the component initialized */
  initialized = false;

  /** The currently list size */
  #size = 0;

  /** The datasource container */
  datasource = new IdsDataSource();

  defaultTemplate = '';

  vetoableEventTypes = [
    'beforeactivated',
    'beforedeactivated',
    'beforeselected',
    'beforedeselected'
  ];

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
    this.dataKeys = this.#extractTemplateLiteralsFromHTML(this.defaultTemplate);
    this.#attachEventListeners();
    this.#attachSearchFilterCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.LOADED,
      attributes.HEIGHT,
      attributes.HIDE_CHECKBOXES,
      attributes.ITEM_HEIGHT,
      attributes.LABEL,
      attributes.SELECTABLE,
      attributes.SORTABLE,
      attributes.SUPPRESS_DEACTIVATION,
      attributes.SUPPRESS_DESELECTION,
      attributes.VIRTUAL_SCROLL,
      attributes.MAX_WIDTH,
      attributes.OVERFLOW,
      attributes.TOOLTIP,
      attributes.TOOLTIP_PLAIN_TEXT,
    ];
  }

  itemsSelector<T extends HTMLElement>(cssSelector: string): T[] {
    return [
      ...this.querySelectorAll<T>(cssSelector),
      ...(this.shadowRoot?.querySelectorAll<T>(cssSelector) ?? []),
    ];
  }

  get itemCount(): number { return this.data?.length || this.items?.length || 0; }

  /**
   * Get the list item DOM element.
   * @param {number} rowIndex The value of row-index.
   * @returns {IdsListViewItem|undefined} The DOM element, or undefined if item not found.
   */
  itemByIndex(rowIndex: number): IdsListViewItem | undefined {
    return this.itemsSelector<IdsListViewItem>(`ids-list-view-item[row-index="${rowIndex}"]`)[0] ?? undefined;
  }

  get itemFocused() {
    const activeId = this.body?.getAttribute('aria-activedescendant');
    const rowIndex = Number((this.body?.querySelector(`#${activeId}`) as any)?.rowIndex ?? -1);
    return this.itemByIndex(rowIndex);
  }

  get items(): IdsListViewItem[] { return this.itemsSelector<IdsListViewItem>(`ids-list-view-item`); }

  get itemsActivated(): IdsListViewItem[] { return this.itemsSelector<IdsListViewItem>(`ids-list-view-item[activated]`); }

  get itemsDisabled(): IdsListViewItem[] { return this.itemsSelector<IdsListViewItem>(`ids-list-view-item[disabled]`); }

  get itemsFiltered(): IdsListViewItem[] { return this.itemsSelector<IdsListViewItem>(`ids-list-view-item:not(.${SEARCH_MISMATCH_CLASS}), ids-list-view-group-header`); }

  get itemsChecked(): IdsListViewItem[] { return this.itemsSelector<IdsListViewItem>(`ids-list-view-item[checked]`); }

  get itemsSelected(): IdsListViewItem[] { return this.itemsSelector<IdsListViewItem>(`ids-list-view-item[selected]`); }

  get itemsSlotted(): IdsListViewItem[] { return [...this.querySelectorAll<IdsListViewItem>(`ids-list-view-item`)]; }

  get itemsSwappable(): IdsSwappableItem[] { return this.itemsSelector<IdsSwappableItem>(`ids-swappable-item`); }

  get itemsTabbable(): IdsListViewItem[] { return this.itemsSelector(`ids-list-view-item[tabindex="0"]`); }

  #extractTemplateLiteralsFromHTML(string: string) {
    return Array.from(string?.matchAll(/\${(.*)}/g), ([, token]) => token);
  }

  /**
   * Get the item info for given element.
   * @param {HTMLElement} el The element.
   * @returns {IdsListViewItemInfo|null} Item info, or null if item not found.
   */
  #itemInfo(el: any): IdsListViewItemInfo | null {
    const item = el?.getAttribute('role') === 'option'
      ? el : el?.closest('[role="option"]');
    const index = stringToNumber(item?.getAttribute('index'));
    const output = Number.isNaN(index) ? null : { item, index, data: this.data[index] };
    return output;
  }

  /**
   * Get data index for given page index.
   * @param {number} index The page index value.
   * @returns {number|null} The data index.
   */
  dataIndex(index: number): number | null {
    const idx = stringToNumber(index);
    if (Number.isNaN(idx)) return null;
    return (idx >= 0 && idx < this.#size)
      ? idx + ((this.pageNumber - 1) * this.#size) : null;
  }

  /**
   * Handle on keydown
   * @private
   * @param {KeyboardEvent} evt The event.
   * @returns {void}
   */
  #handleOnKeydown(evt: KeyboardEvent): void {
    const keyCode = evt.code || 'Space';
    switch (keyCode) {
      case 'ArrowUp':
        evt.preventDefault();
        this.itemFocused?.prevEnabled?.focus();
        break;
      case 'ArrowDown':
        evt.preventDefault();
        this.itemFocused?.nextEnabled?.focus();
        break;
      case 'Enter':
        if (this.itemFocused) this.itemFocused.activated = true;
        if (this.itemFocused && (this.selectable === 'single' || this.selectable === 'multiple')) {
          this.itemFocused.selected = this.selectable === 'multiple' ? !this.itemFocused.selected : true;
          this.itemFocused.activated = this.selectable === 'multiple' ? this.itemFocused.selected : true;
        }
        break;
      case 'Space':
        evt.preventDefault(); // prevent container from scrolling
        if (this.itemFocused && this.selectable === 'mixed') {
          const value = !this.itemFocused.selected;
          this.itemFocused.selected = value;
          this.itemFocused.checked = value;
        }
        if (this.itemFocused && this.selectable && this.selectable !== 'mixed') this.itemFocused.activated = true;
        if (this.itemFocused && (this.selectable === 'single' || this.selectable === 'multiple')) {
          this.itemFocused.activated = true;
          this.itemFocused.selected = this.selectable === 'multiple' ? !this.itemFocused.selected : true;
        }

        break;
      default:
        break;
    }
  }

  /**
   * Handle on after virtual scroll
   * @private
   * @param {CustomEvent} e The event.
   * @returns {void}
   */
  #handleOnAfterVirtualScroll(e: CustomEvent): void {
    const { startIndex, endIndex } = e.detail || {};
    this.#adjustVirtualScrollIndexes(startIndex);
    for (let i = startIndex; i < endIndex; i++) {
      if (this.data?.[i]?.itemSelected) {
        const item = this.itemByIndex(i);
        if (item) item.selected = true;
      }
      if (this.data?.[i]?.itemActivated) {
        const item = this.itemByIndex(i);
        if (item) item.activated = true;
      }
    }
  }

  /**
   * Handle all events
   * @private
   */
  #attachEventListeners() {
    const defaultSlot = this.container?.querySelector<HTMLSlotElement>('slot:not([name])') ?? undefined;
    this.offEvent('slotchange.listview', defaultSlot);
    this.onEvent('slotchange.listview', defaultSlot, () => {
      if (this.itemsSlotted.length) this.redrawLazy();
    });

    // Fire click
    this.offEvent('click.listview', this.container);
    this.onEvent('click.listview', this.container, (e: CustomEvent) => {
      e.stopPropagation();
      const args = this.#itemInfo(e.target);
      if (args) this.#triggerEvent('click', { ...args, originalEvent: e });
    });

    // Fire dblclick
    this.offEvent('dblclick.listview', this.container);
    this.onEvent('dblclick.listview', this.container, (e: any) => {
      const itemInfo = this.#itemInfo(e.target);
      if (itemInfo) this.#triggerEvent('dblclick', { ...itemInfo, originalEvent: e });
    });

    // attaching both event listeners causes focus issues, so do it conditionally based on the sortable prop
    this.offEvent('keydown.listview-selection', this);
    this.onEvent('keydown.listview-selection', this, (e: any) => this.#handleOnKeydown(e));

    if (this.virtualScroll && !this.sortable) {
      this.offEvent('aftervirtualscroll.listview', this.virtualScrollContainer);
      this.onEvent('aftervirtualscroll.listview', this.virtualScrollContainer, (e: CustomEvent) => this.#handleOnAfterVirtualScroll(e));
    }
  }

  /**
   * Attach events for the search input
   * @private
   */
  #attachSearchFilterCallback() {
    if (this.itemsSlotted?.length) {
      this.searchFilterCallback = (term: string) => {
        this.itemsSlotted?.forEach((item: any) => {
          // NOTE: using textContent because innerText was causing older jest tests to fail
          // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
          const haystack = String(item?.textContent ?? '').toLowerCase();
          const needle = String(term).toLowerCase();
          if (!term || haystack.includes(needle)) {
            item.classList.remove(SEARCH_MISMATCH_CLASS);
          } else {
            item.classList.add(SEARCH_MISMATCH_CLASS);
            item.setAttribute('slot', SEARCH_MISMATCH_CLASS);
          }
        });

        return () => false;
      };
    }
  }

  /**
   * Reset/Clear the search input and search results
   */
  resetSearch() {
    const kids = this.itemsSlotted;
    if (kids?.length) {
      this.datasource.filtered = true;
      kids.forEach((item) => {
        item.classList.remove(SEARCH_MISMATCH_CLASS);
        item.removeAttribute('slot');
      });
    }

    super.resetSearch();
  }

  /**
   * Get custom HTML for list item.
   * @private
   * @param {number} index - the index from this.data
   * @returns {string} The html for the <ids-list-view-item> template.
   */
  protected generateListItemFromCustomHTML(index: number): string {
    let rowIndex = index;
    const pagination = this.pagination;
    if (pagination && pagination !== 'none') {
      const pageNumber = this.pageNumber || 0;
      const pageSize = this.pageSize || 0;
      rowIndex = (pageNumber * pageSize) - (pageSize - rowIndex);
    }

    const data = this.data[index] ?? {};

    if (data?.isGroupHeader) {
      return `<ids-list-view-group-header>${data?.title}</ids-list-view-group-header>`;
    }

    const activated = data.itemActivated ? ' activated' : '';
    const disabled = data.disabled ? ' disabled' : '';
    const selected = data.itemSelected ? ' selected' : '';
    const sortable = this.sortable ? ' class="sortable"' : '';
    const maxWidth = this.maxWidth ? ` max-width="${this.maxWidth}"` : '';
    const tooltipPlainText = this.hasAttribute(attributes.TOOLTIP_PLAIN_TEXT) ? ` tooltip-plain-text` : '';
    const tooltip = this.tooltip ? ` tooltip="${this.tooltip}"${tooltipPlainText}` : '';
    const overflow = this.overflow ? ` overflow="${this.overflow}"` : '';

    return this.templateListItemWrapper(
      `<ids-list-view-item row-index="${rowIndex}" ${activated}${disabled}${selected}${sortable}${maxWidth}${tooltip}${overflow}>
        ${this.templateCustomHTML(data)}
      </ids-list-view-item>`,
      index
    );
  }

  /**
   * Get custom slot for user-provided list item.
   * @private
   * @param {number} index - the index from this.data
   * @returns {string} The html for the <slot>.
   */
  protected generateListItemSlot(index: number): string {
    const item = this.itemsFiltered.at(index);
    if (!item) return ``;

    const slotName = `slot-child-${index}`;
    item.setAttribute('slot', slotName);
    item.rowIndex = index;
    return this.templateListItemWrapper(`<slot name="${slotName}"></slot>`, index);
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `
      ${this.searchTemplate?.()}
      ${this.virtualScroll ? this.templateVirtualScroll() : this.templateStatic()}
    `;
  }

  /**
   * Helper method to render the list-view-item template
   * @param {string} innerHTML - html to wrap
   * @param {number} index - the index in this.data
   * @returns {string} html
   */
  templateListItemWrapper(innerHTML: string, index: number = -1): string {
    const item = this.itemByIndex(index);
    const data = this.data[index] ?? item?.rowData ?? {};
    const disabled = data.disabled ? ' disabled' : '';
    const sortable = this.sortable ? ' class="sortable"' : '';

    const wrappedInnerHTML = `<div ${disabled}${sortable}>${innerHTML}</div>`;

    if (!sortable) return wrappedInnerHTML;

    return `
      <ids-swappable-item
          role="listitem"
          tabindex="-1"
          tabbable="${index === 0 ? 'true' : 'false'}"
          index="${index}"
          id="id_item_${index + 1}"
          aria-posinset="${index + 1}"
          id = "id-${index + 1}"
          aria-setsize="${this.data?.length || this.itemsFiltered.length}"
          ${disabled}
        >
        ${wrappedInnerHTML}
      </ids-swappable-item>
    `;
  }

  templateCustomHTML(item: object) {
    return injectTemplate(this.defaultTemplate, this.searchHighlight?.(item) ?? item);
  }

  /**
   * Helper method to render the list-view-item template
   * @returns {string} html
   */
  templateListItems(): string {
    if (this.data?.length) {
      return this.data.map((item: any, idx: number) => this.generateListItemFromCustomHTML(idx)).join('');
    }
    return this.itemsFiltered.map((item: any, idx: number) => this.generateListItemSlot(idx)).join('');
  }

  /**
   * Helper method to render the static scrolling template
   * @returns {string} html
   */
  templateStatic(): string {
    const selectable = this.selectable ? ` ${this.selectableClass()}` : '';
    return `
      <div class="ids-list-view${selectable}">
        <div class="ids-list-view-body" role="listbox" aria-label="${this.label}" part="contents">
          ${this.sortable ? `<ids-swappable selection=${this.selectable}>` : ''}
            ${this.templateListItems()}
          ${this.sortable ? `</ids-swappable>` : ''}
          <slot></slot>
        </div>
      </div>
    `;
  }

  /**
   * Helper method to render the virtual scrolling template
   * @returns {string} html
   */
  templateVirtualScroll(): string {
    const selectable = this.selectable ? ` ${this.selectableClass()}` : '';
    const html = `
      <div class="ids-list-view${selectable}">
        <ids-virtual-scroll
          height="${this.height}"
          item-height="${this.itemHeight}">
          <div class="ids-list-view-body" role="listbox" aria-label="${this.label}" part="contents"></div>
        </ids-virtual-scroll>
      </div>
    `;

    return html;
  }

  /**
   * Return an item's html injecting any values from the dataset as needed.
   * @param {object} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item: any): string {
    return item?.matches?.('ids-list-view-item')
      ? `<slot name="${item?.getAttribute?.('slot')}"></slot>`
      : injectTemplate(this.defaultTemplate, this.searchHighlight?.(item) ?? item);
  }

  /**
   * Set the pager template for listview
   * @returns {string} the default pager template for list-view
   */
  pagerTemplate(): string {
    return `
      <ids-pager-button label="Previous page" previous></ids-pager-button>
      <ids-pager-number-list label="Page {num} of {total}"></ids-pager-number-list>
      <ids-pager-button label="Next page" next></ids-pager-button>
    `;
  }

  /**
   * Adjust list items all indexes for virtual scroll
   * @private
   * @param {number} startIndex The starting data index.
   * @returns {void}
   */
  #adjustVirtualScrollIndexes(startIndex: number): void {
    const items = this.items;

    if (startIndex === 0) items?.at(0)?.setAttribute('tabindex', '0');
    items?.forEach((item: any, i: number) => {
      item?.setAttribute('index', i + startIndex);
      item?.setAttribute('aria-posinset', i + 1);
      if (!item.id) item?.setAttribute('id', `id-${i + 1}`);
      item?.setAttribute('aria-setsize', items?.length);
    });
  }

  /** Used in IdsListView.redrawLazy() */
  #redrawLazyRAF = 0;

  /**
   * Calls IdsListView.redraw() asynchronously
   */
  redrawLazy() {
    cancelAnimationFrame(this.#redrawLazyRAF);
    this.#redrawLazyRAF = requestAnimationFrame(() => this.redraw());
  }

  /**
   * Rerender the list by re applying the template
   */
  redraw() {
    if (!this.data || !this.loaded) {
      if (!this.items.length) {
        if (!this.data?.length) this.items?.forEach((li: any) => li?.remove());
        return;
      }
    }

    // Set list size
    this.#size = this.pagination === 'none' ? this.pageTotal : this.pageSize;

    const dir = this.container?.getAttribute('dir');
    const html = this.template();
    if (this.container?.parentElement) {
      this.container?.parentElement.remove();
    } else {
      this.container?.remove();
    }
    this.searchContainer?.remove();

    const referenceElem: any = this.shadowRoot?.querySelector('style');
    if (referenceElem) {
      referenceElem.insertAdjacentHTML('afterend', html);
    } else {
      const template = document.createElement('template');
      template.innerHTML = html;
      this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    this.container = this.shadowRoot?.querySelector('.ids-list-view');

    // Setup virtual scrolling
    if (this.data?.length > 0) {
      if (this.virtualScroll) {
        // set the virtual-scroll item-height attribute
        const itemHeight = this.itemHeight || this.#checkTemplateHeight(`
          <div part="list-item" tabindex="-1" id="height-tester">
            ${this.itemTemplate(this.datasource.data[0])}
          </div>
        `);

        if (this.virtualScrollContainer) {
          this.virtualScrollContainer.itemHeight = itemHeight;

          this.virtualScrollContainer.itemTemplate = (
            item: any,
            idx: number,
            rowIndex: number
          ) => this.generateListItemFromCustomHTML(rowIndex);

          this.virtualScrollContainer.data = this.data;
        }
      }
      this.#attachEventListeners();
    }

    // Set searchable
    this.setSearchable?.();

    // Sync pager
    this.pager?.sync?.apply(this);

    // Adjust height
    this.adjustHeight();

    // Set back direction
    if (dir) {
      this.container?.setAttribute('dir', dir);
    }

    // Setup Scroll Effect
    this.scrollArea = this.shadowRoot?.querySelector('.ids-list-view');
    this.attachScrollEvents();

    // Set aria-activedescendant
    const firstItem = this.body?.querySelector('ids-list-view-item:not([disabled]');
    firstItem?.setAttribute('tabindex', '0');
    this.body?.setAttribute('aria-activedescendant', String(firstItem?.id));
  }

  get virtualScrollContainer(): IdsVirtualScroll | undefined | null {
    return this.container?.querySelector<IdsVirtualScroll>('ids-virtual-scroll');
  }

  get body() {
    return this.container?.querySelector('.ids-list-view-body');
  }

  /**
   * Set the height of the list after loading the template
   * @private
   */
  adjustHeight() {
    if (!this.container) return;

    const rootContainer = this.virtualScroll ? this.virtualScrollContainer : this.container;
    rootContainer?.style.setProperty('height', `${this.height}`);
  }

  /**
   * Calculate the height of a template element.
   * @private
   * @param {string} itemTemplate The item template
   * @returns {number} The item height
   */
  #checkTemplateHeight(itemTemplate: string): number {
    this.container?.insertAdjacentHTML('beforeend', itemTemplate);
    const tester = this.shadowRoot?.querySelector<HTMLElement>('#height-tester');
    const height = tester?.offsetHeight;
    tester?.remove();

    return height ?? NaN;
  }

  /**
   * Get the list of all data from dataset
   * @returns {Array} value The array to use
   */
  get ds(): Array<any> { return this.datasource?.allData || this.data; }

  /**
   * Handle Setting changes of the value has changed by calling the getter
   * in the extending class.
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue === newValue) return;

    if (name === attributes.LOADED) this.redraw();
    if (name === attributes.SELECTABLE) this.#selectable();
    if (name === attributes.VIRTUAL_SCROLL) this.redraw();
    if (name === attributes.PAGE_NUMBER) this.redraw();
    if (name === attributes.PAGE_SIZE) this.redraw();
    if (name === attributes.PAGE_TOTAL) this.redraw();

    // TODO: change the follow to use proper DOM manipulation instead of this.redraw();
    if (name === attributes.MAX_WIDTH) this.redraw();
    if (name === attributes.OVERFLOW) this.redraw();
    if (name === attributes.TOOLTIP) this.redraw();
    if (name === attributes.TOOLTIP_PLAIN_TEXT) this.redraw();
  }

  #selectable() {
    this.redraw();
    this.itemsSlotted.forEach((item) => item.checkbox?.toggleAttribute('hide', !!item?.checkboxHidden));
  }

  /**
   * Set the data array of the listview
   * @param {Array | null} value The array to use
   */
  set data(value: any) {
    const wasInitialized = this.initialized;
    if (value) {
      this.initialized = true;
      this.datasource.data = value;
      this.loaded = true;

      // Reload data when changed
      if (wasInitialized) {
        this.redraw();
      }
    } else {
      this.datasource.data = [];
      this.loaded = false;
    }
  }

  get data(): any { return this?.datasource?.data || ''; }

  /**
   * Add the data array passed in to the bottom of the listview
   * @param {Array | null} data The array to use
   */
  appendToBottom(data: any) {
    const lastIndex = this.datasource.data.length;
    this.datasource.data = [...this.datasource.data, ...data];

    if (data) {
      const newItems = data.map((item: any, idx: number) => this.generateListItemFromCustomHTML(idx + lastIndex)).join('');
      this.body?.insertAdjacentHTML('beforeend', newItems);
    }
  }

  /**
   * Used to determine if data has been loaded into IdsListView
   * @param {Array | null} value The array to use
   */
  set loaded(value: any) { this.setAttribute(attributes.LOADED, String(!!value)); }

  get loaded(): any { return stringToBool(attributes.LOADED); }

  /**
   * Set the data array of the listview
   * @param {Array | null} value The array to use
   */
  set dataKeys(value: any) {
    if (this.datasource) {
      (this.datasource as any).dataKeys = value || [];
    }
  }

  get dataKeys(): any { return (this.datasource as any).dataKeys || []; }

  /**
   * Set the list view to use virtual scrolling for a large amount of elements.
   * @param {string | boolean} value true to use virtual scrolling
   */
  set virtualScroll(value: string | boolean | null) {
    if (/boolean|string/g.test(typeof value)) {
      this.setAttribute(attributes.VIRTUAL_SCROLL, String(value));
    } else {
      this.removeAttribute(attributes.VIRTUAL_SCROLL);
    }
  }

  get virtualScroll(): boolean {
    return stringToBool(this.getAttribute(attributes.VIRTUAL_SCROLL));
  }

  /**
   * Set the expected height of the viewport for virtual scrolling
   * @param {string | number} value true to use virtual scrolling
   */
  set height(value: string | number | undefined | null) {
    if (value) {
      this.setAttribute(attributes.HEIGHT, String(value));
    } else {
      this.setAttribute(attributes.HEIGHT, LIST_VIEW_DEFAULTS.height);
    }
  }

  get height(): string | number {
    return this.getAttribute(attributes.HEIGHT) || LIST_VIEW_DEFAULTS.height;
  }

  /**
   * Set the expected height of each item
   * @param {string | number} value true to use virtual scrolling
   */
  set itemHeight(value: string | number | undefined | null) {
    if (value) {
      this.setAttribute(attributes.ITEM_HEIGHT, String(value));
    } else {
      this.removeAttribute(attributes.ITEM_HEIGHT);
    }
  }

  get itemHeight(): number {
    return parseInt(this.getAttribute(attributes.ITEM_HEIGHT) ?? '');
  }

  /**
   * Set the selection mode of the listview
   * @param {string} value The value
   */
  set selectable(value: IdsListViewSelectableTypes) {
    this.container?.classList.remove(...this.selectableClass(true));

    if (LIST_VIEW_DEFAULTS.selectableOptions.includes(String(value))) {
      this.setAttribute(attributes.SELECTABLE, String(value));
      this.container?.classList.add(this.selectableClass() as string);
    } else {
      this.removeAttribute(attributes.SELECTABLE);
    }
  }

  get selectable(): IdsListViewSelectableTypes {
    return this.getAttribute(attributes.SELECTABLE) as IdsListViewSelectableTypes;
  }

  /**
   * Get class name/s with prefixed value
   * @param {boolean|undefined} isAll If true, will return all classes as array
   * @returns {string|Array<string>} The class name with prefix
   */
  selectableClass(isAll?: boolean): string | Array<string> {
    const prefixed = (v: string) => `selectable-${v}`;
    let r: string | Array<string> = '';
    if (isAll) r = LIST_VIEW_DEFAULTS.selectableOptions.map((v) => prefixed(v));
    if (this.selectable !== null) r = prefixed(this.selectable);
    return r;
  }

  /**
   * Handles the sortable property and reflects it on the DOM.
   * @param {boolean|string} value The sortable parameter.
   */
  set sortable(value: boolean | string | null) {
    this.toggleAttribute(attributes.SORTABLE, stringToBool(value));
  }

  get sortable(): boolean {
    return stringToBool(this.getAttribute(attributes.SORTABLE));
  }

  /**
   * Sets the items to be suppress deactivation for mixed selection only.
   * @param {boolean|string} value The value.
   */
  set suppressDeactivation(value: boolean | string) {
    this.toggleAttribute(attributes.SUPPRESS_DEACTIVATION, stringToBool(value));
  }

  get suppressDeactivation(): boolean {
    return this.selectable === 'mixed' && stringToBool(this.getAttribute(attributes.SUPPRESS_DEACTIVATION));
  }

  /**
   * Sets the items to be suppress deselection for single selection only.
   * @param {boolean|string} value The value.
   */
  set suppressDeselection(value: boolean | string) {
    this.toggleAttribute(attributes.SUPPRESS_DESELECTION, stringToBool(value));
  }

  get suppressDeselection(): boolean {
    return this.selectable === 'single' && stringToBool(this.getAttribute(attributes.SUPPRESS_DESELECTION));
  }

  /**
   * Checkboxes will not render if true, only apply to multiple selection.
   * @param {boolean|string} value The value.
   */
  set hideCheckboxes(value: boolean | string) {
    this.toggleAttribute(attributes.HIDE_CHECKBOXES, stringToBool(value));
    this.items.forEach((item) => {
      item.checkbox?.toggleAttribute('hide', stringToBool(value));
    });
  }

  get hideCheckboxes(): boolean {
    return stringToBool(this.getAttribute(attributes.HIDE_CHECKBOXES));
  }

  /**
   * Set the aria label text
   * @param {string} value The label text
   */
  set label(value: string) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }
    this.body?.setAttribute('aria-label', this.label);
  }

  get label() {
    return this.getAttribute(attributes.LABEL) || LIST_VIEW_DEFAULTS.label;
  }

  /**
   * Set the maxWidth of the text (used for ellipsis)
   * @param {string | null} value The value of the max-width
   */
  set maxWidth(value: string | null) {
    if (value) {
      this.setAttribute(attributes.MAX_WIDTH, value);
      this?.style.setProperty('max-width', `${parseInt(value)}px`, 'important');
    } else {
      this.removeAttribute(attributes.MAX_WIDTH);
      this?.style.removeProperty('max-width');
    }
  }

  get maxWidth(): string | null { return this.getAttribute(attributes.MAX_WIDTH); }

  set tooltip(value: string | null) {
    if (value) {
      this.setAttribute(attributes.TOOLTIP, value);
    } else {
      this.removeAttribute(attributes.TOOLTIP);
    }
  }

  get tooltip(): string | null { return this.getAttribute(attributes.TOOLTIP); }

  set overflow(value: string | null) {
    if (value) {
      this.setAttribute(attributes.OVERFLOW, value);
    } else {
      this.removeAttribute(attributes.OVERFLOW);
    }
  }

  get overflow(): string | null { return this.getAttribute(attributes.OVERFLOW); }

  /**
   * Helper to select all list items.
   * @returns {void}
   */
  selectAll(): void {
    const selectable = this.selectable;
    if (!selectable) return;

    const items = this.items;
    const firstItem = this.items[0];

    if (selectable === 'single' && firstItem) {
      firstItem.selected = true;
    } else if (['multiple', 'mixed'].includes(selectable)) {
      items.forEach((item) => {
        item.selected = true;
        if (item.checkbox) item.checkbox.checked = true;
      });
    }

    this.#triggerEvent('selectionchanged', { selected: this.itemsSelected });
  }

  /**
   * Helper to deselect all list items.
   * @returns {void}
   */
  deselectAll(): void {
    if (this.selectable) {
      this.itemsSelected.forEach((item) => {
        item.selected = false;
        if (item.checkbox) item.checkbox.checked = false;
      });
    }

    this.#triggerEvent('selectionchanged', { selected: this.itemsSelected });
  }

  /**
   * Trigger the given event.
   * @private
   * @param {string} eventName The event name to be trigger.
   * @param {object} args Extra data.
   * @returns {void}
   */
  #triggerEvent(eventName: string, args: object = {}): void {
    this.triggerEvent(eventName, this, { bubbles: true, detail: { elem: this, ...args } });
  }
}

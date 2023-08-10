import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import {
  injectTemplate,
  stringToBool,
  stringToNumber
} from '../../utils/ids-string-utils/ids-string-utils';

import IdsDataSource from '../../core/ids-data-source';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsListViewSearchMixin from './ids-list-view-search-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPagerMixin from '../../mixins/ids-pager-mixin/ids-pager-mixin';
import IdsScrollEffectMixin from '../../mixins/ids-scroll-effect-mixin/ids-scroll-effect-mixin';

import '../ids-checkbox/ids-checkbox';
import '../ids-search-field/ids-search-field';
import '../ids-swappable/ids-swappable';
import '../ids-swappable/ids-swappable-item';
import '../ids-virtual-scroll/ids-virtual-scroll';
import './ids-list-view-item';
import styles from './ids-list-view.scss';

import type IdsSwappableItem from '../ids-swappable/ids-swappable-item';
import type IdsVirtualScroll from '../ids-virtual-scroll/ids-virtual-scroll';
import type IdsText from '../ids-text/ids-text';

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

const SEARCH_FILTER_CLASS = 'search-mismatch';

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

  /** The currently focused list item */
  #focusedLiIndex: any = 0;

  /** The currently activated list item */
  #activatedIndex = -1;

  /** The currently target while selecting */
  #isTargetCheckbox = false;

  /** The currently apply state while single selecting */
  #isApply = false;

  /** The currently list size */
  #size = 0;

  /** The datasource container */
  datasource = new IdsDataSource();

  defaultTemplate = '';

  /**
   * @returns {Array<string>} Drawer vetoable events
   */
  vetoableEventTypes = [
    'beforeitemactivated',
    'beforeitemdeactivated',
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
   * Invoked each time the custom element is removed from a document-connected element.
   */
  disconnectedCallback() {
    if (document.body.contains(this)) {
      // only redraw on disconnect if list-view is still in DOM
      this.redrawLazy();
    }
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
      attributes.VIRTUAL_SCROLL
    ];
  }

  #extractTemplateLiteralsFromHTML(string: string) {
    return Array.from(string?.matchAll(/\${(.*)}/g), ([, token]) => token);
  }

  /**
   * Get list of all elements
   * @returns {NodeListOf<HTMLElement>} List of all list item elements
   */
  getAllLi(): NodeListOf<HTMLElement> | undefined {
    return this.container?.querySelectorAll<HTMLElement>('div[part="list-item"]');
  }

  /**
   * Return all swappable items
   * @returns {NodeListOf<IdsSwappableItem>} List of all swappable items
   */
  getAllSwappableItems(): NodeListOf<IdsSwappableItem> | undefined {
    return this.container?.querySelectorAll<IdsSwappableItem>('ids-swappable-item');
  }

  /**
   * Add the sortable class to the list items
   * @returns {void}
   */
  #addSortableStyles(): void {
    this.getAllLi()?.forEach((li: HTMLElement) => {
      li.classList.add('sortable');
    });
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
    return Number.isNaN(index) ? null : { item, index, data: this.data[index] };
  }

  /**
   * Get the list item DOM element.
   * @param {number} index The value of data index.
   * @returns {HTMLElement|null} The DOM element, or null if item not found.
   */
  #itemByIndex(index: number): HTMLElement | null {
    return Number.isNaN(index) || !this.container ? null
      : this.container.querySelector(`div[part="list-item"][index="${index}"]`);
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
   * Get page index for given data index.
   * @param {number} dataIndex The data index value.
   * @returns {number|null} The paga index.
   */
  pageIndex(dataIndex: number): number | null {
    let idx = stringToNumber(dataIndex);
    if (Number.isNaN(idx)) return null;
    idx -= (this.pageNumber - 1) * this.#size;
    return (idx >= 0 && idx < this.#size) ? idx : null;
  }

  /**
   * Check if given data index in current page.
   * @param {number} dataIndex The data index value.
   * @returns {boolean} True, if data index in current page
   */
  isInPage(dataIndex: number): boolean {
    const idx = stringToNumber(dataIndex);
    if (Number.isNaN(idx)) return false;

    let end = this.pageNumber * this.#size;
    let start = end - this.#size;

    if (this.virtualScroll) {
      end = this.virtualScrollContainer?.lastEnd as number;
      start = this.virtualScrollContainer?.lastStart as number;
    }

    return dataIndex >= start && dataIndex < end;
  }

  /**
   * Handle on click
   * @private
   * @param {any} e The event.
   * @returns {void}
   */
  #handleOnClick(e: any): void {
    const itemInfo = this.#itemInfo(e.target);
    if (itemInfo) {
      this.#isTargetCheckbox = e.target?.classList.contains('list-item-checkbox');
      if (this.#isTargetCheckbox) e.preventDefault();
      this.#setSelection(itemInfo);
    }
  }

  /**
   * Handle on keydown
   * @private
   * @param {KeyboardEvent} e The event.
   * @returns {void}
   */
  #handleOnKeydown(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowUp':
        e.preventDefault();
        this.focusLi(this.getPreviousLi(this.getFocusedLi()));
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.focusLi(this.getNextLi(this.getFocusedLi()));
        break;
      case 'Space':
        e.preventDefault();
        break;
      default:
        break;
    }
  }

  /**
   * Handle on keyup
   * @private
   * @param {KeyboardEvent} e The event.
   * @returns {void}
   */
  #handleOnKeyup(e: KeyboardEvent): void {
    if (/^(Space|Enter)$/g.test(e.code)) {
      e.preventDefault();
      e.stopPropagation();
      const focusedLi = this.getFocusedLi();
      // Mixed selectable, should do selection instead of activation if use keyboard
      if (this.selectable === 'mixed') {
        const cb: any = focusedLi?.querySelector('.list-item-checkbox');
        if (cb) cb.checked = !cb.checked;
        this.#isTargetCheckbox = true;
      }
      this.#setSelection(this.#itemInfo(focusedLi));
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
        const item = this.#itemByIndex(i);
        const cb: any = item?.querySelector('.list-item-checkbox');
        if (cb) cb.checked = true;
        item?.setAttribute('selected', '');
        item?.setAttribute('aria-selected', 'true');
        if (this.selectable === 'mixed') item?.setAttribute('hide-selected-color', '');
      }
      if (this.data?.[i]?.itemActivated) {
        this.#itemByIndex(i)?.setAttribute('activated', '');
      }
    }
  }

  #attachEventListeners() {
    const childSlot = this.#childSlot();
    this.offEvent('slotchange.listview', childSlot);
    this.onEvent('slotchange.listview', childSlot, () => {
      if (this.#childElements()?.length) {
        this.redrawLazy();
      }
    });

    // Fire click
    this.offEvent('click.listview', this.container);
    this.onEvent('click.listview', this.container, (e: any) => {
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
    if (this.sortable) {
      this.#addSortableStyles();
    } else {
      // Set selection/activation by ckick
      this.offEvent('click.listview-selection', this.container);
      this.onEvent('click.listview-selection', this.container, (e: any) => this.#handleOnClick(e));

      this.offEvent('keydown.listview-selection', this.container);
      this.onEvent('keydown.listview-selection', this.container, (e: any) => this.#handleOnKeydown(e));

      this.offEvent('keyup.listview-selection', this.container);
      this.onEvent('keyup.listview-selection', this.container, (e: any) => this.#handleOnKeyup(e));

      this.offEvent('aftervirtualscroll.listview', this.virtualScrollContainer);
      this.onEvent('aftervirtualscroll.listview', this.virtualScrollContainer, (e: CustomEvent) => this.#handleOnAfterVirtualScroll(e));
    }
  }

  #attachSearchFilterCallback() {
    if (this.#childElements()?.length) {
      this.searchFilterCallback = (term: string) => {
        this.#childElements()?.forEach((item: any) => {
          // NOTE: using textContent because innerText was causing jest to fail
          // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
          const haystack = String(item?.textContent ?? '').toLowerCase();
          const needle = String(term).toLowerCase();
          if (!term || haystack.includes(needle)) {
            item.classList.remove(SEARCH_FILTER_CLASS);
          } else {
            item.classList.add(SEARCH_FILTER_CLASS);
            item.setAttribute('slot', SEARCH_FILTER_CLASS);
          }
        });

        return () => false;
      };
    }
  }

  resetSearch() {
    const kids = this.#childElements();
    if (kids.length) {
      this.datasource.filtered = true;
      kids.forEach((item) => {
        item.classList.remove(SEARCH_FILTER_CLASS);
        item.removeAttribute('slot');
      });
    }

    super.resetSearch();
  }

  /**
   * Set the selection for given item
   * @private
   * @param {any} itemInfo The item and index.
   * @returns {void}
   */
  #setSelection(itemInfo: IdsListViewItemInfo | null): void {
    if (!itemInfo) return;

    const { item, index } = itemInfo;
    const dataIndex = this.dataIndex(index);
    let isVeto = true;

    if (this.selectable) {
      const selected: any = this.selected;

      // Single
      if (this.selectable === 'single') {
        isVeto = this.#selectInPage(index);
      }

      // Multiple
      if (this.selectable === 'multiple') {
        if (selected.some((d: any) => d.index === dataIndex)) {
          isVeto = this.#deselectInPage(index);
        } else {
          isVeto = this.#selectInPage(index);
        }
      }

      // Mixed
      if (this.selectable === 'mixed') {
        if (this.#isTargetCheckbox) {
          // Selection
          if (selected.some((d: any) => d.index === dataIndex)) {
            isVeto = this.#deselectInPage(index);
          } else {
            isVeto = this.#selectInPage(index);
          }
        } else {
          // Activation
          this.#activateItemInPage(index);
        }
      }
    }

    if (isVeto) this.focusLi(item);
  }

  /**
   * Set the focus for given list item.
   * @param {any} li The list item.
   * @param {boolean} noFocus do not actually focus
   * @returns {void}
   */
  focusLi(li?: HTMLElement | null, noFocus = false): void {
    if (li) {
      const prevFocus = this.getFocusedLi();
      // remove tabindex from previous focus
      if (li !== prevFocus) {
        prevFocus?.setAttribute('tabindex', '-1');
        this.#focusedLiIndex = li.getAttribute('index');
      }

      // Set accessbility
      const container = this.container?.querySelector('.ids-list-view-body');
      container?.setAttribute('aria-activedescendant', String(li.getAttribute('id')));

      // init new focus
      li.setAttribute('tabindex', '0'); // this clears after every render
      if (!noFocus) li.focus();
    }
  }

  /**
   * Get currently focused list item.
   * @returns {HTMLElement} The focused list item.
   */
  getFocusedLi(): HTMLElement | undefined | null {
    const savedFocusedLi = this.container?.querySelector<HTMLElement>(`div[part="list-item"][index="${this.#focusedLiIndex}"]`);
    const val = savedFocusedLi ?? this.container?.querySelector<HTMLElement>('div[part="list-item"][tabindex="0"]');
    return val;
  }

  /**
   * Get previous list item for a given list item.
   * @param {any} li The list item.
   * @returns {HTMLElement|undefined} The previous list item
   */
  getPreviousLi(li: any): HTMLElement | undefined {
    let idx = li && typeof li.getAttribute === 'function' ? li.getAttribute('index') : null;
    idx = stringToNumber(idx);
    if (Number.isNaN(idx)) return;
    const items = [...this.getAllLi() ?? []].slice(0, (idx + 1));
    const prev = (item: any): any => (
      this.sortable
        ? item.parentElement.previousElementSibling?.firstElementChildwrapper
        : item.previousElementSibling
    );
    let prevLi = li;
    items.reverse().some((item: any) => {
      prevLi = prev(item);
      return !prevLi?.hasAttribute('disabled');
    });
    return prevLi;
  }

  /**
   * Get next list item for a given list item.
   * @param {any} li The list item.
   * @returns {HTMLElement|undefined} The next list item
   */
  getNextLi(li: any): HTMLElement | undefined {
    let idx = li && typeof li.getAttribute === 'function' ? li.getAttribute('index') : null;
    idx = stringToNumber(idx);
    if (Number.isNaN(idx)) return;
    const items = [...this.getAllLi() ?? []].slice(idx);
    const next = (item: any): any => (
      this.sortable
        ? item.parentElement.nextElementSibling?.firstElementChild
        : item.nextElementSibling
    );
    let nextLi = li;
    items.some((item: any) => {
      nextLi = next(item);
      return !nextLi?.hasAttribute('disabled');
    });
    return nextLi;
  }

  /**
   * Get the default <slot> within <ids-list-view>
   * @returns {HTMLSlotElement} The default slot
   */
  #childSlot(): HTMLSlotElement | undefined {
    return this.container?.querySelector<HTMLSlotElement>('slot:not([name])') ?? undefined;
  }

  /**
   * Check if the element is a valid is <ids-list-view-item>
   * @param {any} element - an HTML element
   * @returns {boolean} True if element is a valid <ds-list-view-item>
   */
  #childValidListViewItem(element: any): boolean {
    return String(element?.tagName).toLowerCase() === 'ids-list-view-item';
  }

  /**
   * Get all valid <ids-list-view-item> child elements inside this <ids-list-view>
   * @param {boolean} filtered - if true, show only items that match search filter
   * @returns {Element[]} All <ids-list-view-item> child elements
   */
  #childElements(filtered = false): Element[] {
    return filtered
      ? [...this.querySelectorAll(`ids-list-view-item:not(.${SEARCH_FILTER_CLASS})`)]
      : [...this.querySelectorAll(`ids-list-view-item`)];
  }

  /**
   * Get template function for list item.
   * @returns {Function} The list item template function.
   */
  listItemTemplateFunc(): any {
    const itemTemplate = (item: any, index: number) => {
      if (this.selectable === 'multiple' || this.selectable === 'mixed') {
        const checked = item.itemSelected ? ' checked' : '';
        const disabled = item.disabled ? ' disabled' : '';
        let checkbox = `<ids-checkbox class="list-item-checkbox" label="cb-item-${index}" label-state="hidden"${checked}${disabled}></ids-checkbox>`;
        if (this.selectable === 'multiple' && this.hideCheckboxes) checkbox = '';
        return `
          <div class="list-item-area">
            ${checkbox}
            <div class="list-item-content">
              ${this.itemTemplate(item)}
            </div>
          </div>`;
      }
      return this.itemTemplate(item);
    };

    const kids = this.#childElements(true);
    const func = (item: any, index: number) => {
      if (item?.setAttribute) {
        item?.setAttribute('slot', `slot-child-${index}`);
        item.rowIndex = index;
      }

      const disabled = item.disabled ? ' disabled' : '';
      const tabindex = `tabindex="${typeof index !== 'undefined' && !index ? '0' : '-1'}"`;
      const activated = item.itemActivated ? ' activated' : '';
      let selected = '';
      if (item.itemSelected) {
        selected = ' selected aria-selected="true"';
        if (this.selectable === 'mixed') selected += ' hide-selected-color';
      }

      return `
        ${this.sortable ? `<ids-swappable-item
            role="listitem"
            tabindex="-1"
            tabbable="${index === 0 ? 'true' : 'false'}"
            index="${index}"
            id="id_item_${index + 1}"
            aria-posinset="${index + 1}"
            aria-setsize="${this.data.length ? this.data.length : kids.length}"
            ${disabled}
          >` : ''}
          <div
            part="list-item"
            role="option"
            index="${index}"
            class="${this.sortable ? 'sortable' : ''}"
            aria-posinset="${index + 1}"
            aria-setsize="${this.data.length ? this.#size : kids.length}"
            ${tabindex}${activated}${selected}${disabled}
          >
            ${itemTemplate(item, index)}
          </div>
        ${this.sortable ? `</ids-swappable-item>` : ''}
      `;
    };

    return func;
  }

  /**
   * Helper method to render the static scrolling template
   * @returns {string} html
   */
  staticScrollTemplate(): string {
    const selectable = this.selectable ? ` ${this.selectableClass()}` : '';
    const listItems = this.data?.length ? this.data : this.#childElements(true);
    return `
      <div class="ids-list-view${selectable}">
        <div class="ids-list-view-body" role="listbox" aria-label="${this.label}">
          ${this.sortable ? `<ids-swappable selection=${this.selectable}>` : ''}
            ${listItems?.length > 0 ? listItems.map(this.listItemTemplateFunc()).join('') : ''}
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
  virtualScrollTemplate(): string {
    const selectable = this.selectable ? ` ${this.selectableClass()}` : '';
    const html = `
      <div class="ids-list-view${selectable}">
        <ids-virtual-scroll
          height="${this.height}"
          item-height="${this.itemHeight}"
        >
          <div class="ids-list-view-body" role="listbox" aria-label="${this.label}" part="contents"></div>
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
      ${this.searchTemplate?.()}
      ${this.virtualScroll ? this.virtualScrollTemplate() : this.staticScrollTemplate()}
    `;
  }

  /**
   * Return an item's html injecting any values from the dataset as needed.
   * @param {object} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item: any): string {
    return this.#childValidListViewItem(item)
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
    const items = this.getAllLi();
    const len = items?.length;

    if (startIndex === 0) items?.item(0)?.setAttribute('tabindex', '0');
    items?.forEach((item: any, i: number) => {
      item?.setAttribute('index', i + startIndex);
      item?.setAttribute('aria-posinset', i + 1);
      item?.setAttribute('aria-setsize', len);
    });
  }

  /**
   * Toggle checkboxes
   * @private
   * @returns {void}
   */
  #toggleCheckboxes(): void {
    if (this.selectable === 'multiple') {
      const val = this.hideCheckboxes;
      const isCheckbox = !!(this.body?.querySelector('.list-item-checkbox'));
      if (val && isCheckbox) {
        // remove
        this.body?.querySelectorAll('.list-item-checkbox').forEach((cb: any) => cb?.remove());
      } else if (!val && !isCheckbox) {
        // add
        this.getAllLi()?.forEach((item: any) => {
          if (!item) return;
          const index = item.getAttribute('index');
          const isSelected = item.hasAttribute('selected');
          const isDisabled = item.hasAttribute('disabled');
          const checked = isSelected ? ' checked' : '';
          const disabled = isDisabled ? ' disabled' : '';
          const itemArea = item.querySelector('.list-item-area');
          itemArea?.insertAdjacentHTML('afterbegin', `
            <ids-checkbox
             class="list-item-checkbox"
             label="cb-item-${index}"
             label-state="hidden"${checked}${disabled}></ids-checkbox>
          `);
        });
      }
    }
  }

  /**
   * Helper function that toggles the 'selected' attribute of an element, then focuses on that element
   * @param {Element} item the item to add/remove the selected attribute
   * @param {boolean} switchValue optional switch values to force add/remove the selected attribute
   */
  toggleSelectedAttribute(item: HTMLLIElement, switchValue?: boolean) {
    if (!this.selectable || item?.tagName !== 'IDS-SWAPPABLE-ITEM') return;

    const unselect = () => {
      item.removeAttribute('selected');
      item.removeAttribute('aria-selected');
      this.#activatedIndex = -1;
    };

    const select = () => {
      item.setAttribute('selected', 'selected');
      item.setAttribute('aria-selected', 'true');
      this.#activatedIndex = parseInt(item.getAttribute('index') || '-1');

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
    if (!this.selectable || !item) return;
    if (item.tagName === 'IDS-SWAPPABLE-ITEM') {
      if (this.selectable === 'single') {
        const prevSelectedLi: HTMLLIElement = (this as any).selectedLi;
        if (item !== prevSelectedLi && prevSelectedLi) {
          this.toggleSelectedAttribute(prevSelectedLi);
        }
      }
      this.toggleSelectedAttribute(item);
    }
  }

  /**
   * Update data from DOM
   * @returns {void}
   */
  updateDataFromDOM(): void {
    const newData: any = [];
    this.container?.querySelectorAll<HTMLElement>('div[part="list-item"]').forEach((x) => {
      const objItem: any = {};
      x.querySelectorAll<IdsText>('ids-text').forEach((value, i) => {
        objItem[this.dataKeys[i]] = value.innerHTML;
      });

      newData.push(objItem);
    });

    if (this.datasource) {
      this.datasource.data = newData;
    }
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
      if (!this.#childElements().length) {
        if (!this.data?.length) this.getAllLi()?.forEach((li: HTMLElement) => li?.remove());
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
          this.virtualScrollContainer.itemTemplate = this.listItemTemplateFunc();
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
   * Get boolean property value for given attribute.
   * @param {string} attributeName The attribute name.
   * @param {boolean} defaultValue The default value.
   * @returns {boolean} The property value
   */
  boolVal(attributeName: string, defaultValue: boolean): boolean {
    return this.hasAttribute(attributeName)
      ? stringToBool(this.getAttribute(attributeName))
      : defaultValue;
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

    const shouldRedraw = [
      attributes.LOADED,
      attributes.SELECTABLE,
      attributes.VIRTUAL_SCROLL,
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.PAGE_TOTAL,
    ].includes(name);

    if (shouldRedraw) {
      this.redraw();
    }
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
    return this.boolVal(attributes.VIRTUAL_SCROLL, LIST_VIEW_DEFAULTS.virtualScroll);
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
  set selectable(value: string | null) {
    this.container?.classList.remove(...this.selectableClass(true));

    if (LIST_VIEW_DEFAULTS.selectableOptions.includes(String(value))) {
      this.setAttribute(attributes.SELECTABLE, String(value));
      this.container?.classList.add(this.selectableClass() as string);
    } else {
      this.removeAttribute(attributes.SELECTABLE);
    }
  }

  get selectable(): string | null {
    return this.getAttribute(attributes.SELECTABLE);
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
   * Get the activated item
   * @returns {IdsListViewActivatedItem|null} The activated item
   */
  get activatedItem(): IdsListViewActivatedItem | Array<IdsListViewActivatedItem> | null {
    if (!this.ds || this.selectable !== 'mixed') return null;
    const singleArgs = (index: number) => (index > -1 ? { index, data: this.ds[index] } : null);
    return singleArgs(this.ds.findIndex((d: any) => d.itemActivated));
  }

  /**
   * Get the selected item/s
   * @returns {IdsListViewSelectedItem|Array<IdsListViewSelectedItem>|null} single item, or List of all selected items
   */
  get selected(): IdsListViewSelectedItem | Array<IdsListViewSelectedItem> | null {
    if (!this.ds || !this.selectable) return null;
    const singleArgs = (index: number) => (index > -1 ? { index, data: this.ds[index] } : null);
    return this.selectable === 'single'
      ? singleArgs(this.ds.findIndex((d: any) => d.itemSelected))
      : this.ds.map((data: any, index: number) => ({ index, data })).filter((d: any) => d.data.itemSelected);
  }

  /**
   * Handles the sortable property and reflects it on the DOM.
   * @param {boolean|string} value The sortable parameter.
   */
  set sortable(value: boolean | string | null) {
    if (/boolean|string/g.test(typeof value)) {
      this.setAttribute(attributes.SORTABLE, String(value));
    } else {
      this.removeAttribute(attributes.SORTABLE);
    }
  }

  get sortable(): boolean {
    return this.boolVal(attributes.SORTABLE, LIST_VIEW_DEFAULTS.sortable);
  }

  /**
   * Sets the items to be suppress deactivation for mixed selection only.
   * @param {boolean|string} value The value.
   */
  set suppressDeactivation(value: boolean | string) {
    if (/boolean|string/g.test(typeof value)) {
      this.setAttribute(attributes.SUPPRESS_DEACTIVATION, String(value));
    } else {
      this.removeAttribute(attributes.SUPPRESS_DEACTIVATION);
    }
  }

  get suppressDeactivation(): boolean {
    return this.boolVal(attributes.SUPPRESS_DEACTIVATION, LIST_VIEW_DEFAULTS.suppressDeactivation);
  }

  /**
   * Sets the items to be suppress deselection for single selection only.
   * @param {boolean|string} value The value.
   */
  set suppressDeselection(value: boolean | string) {
    if (/boolean|string/g.test(typeof value)) {
      this.setAttribute(attributes.SUPPRESS_DESELECTION, String(value));
    } else {
      this.removeAttribute(attributes.SUPPRESS_DESELECTION);
    }
  }

  get suppressDeselection(): boolean {
    return this.boolVal(attributes.SUPPRESS_DESELECTION, LIST_VIEW_DEFAULTS.suppressDeselection);
  }

  /**
   * Checkboxes will not render if true, only apply to multiple selection.
   * @param {boolean|string} value The value.
   */
  set hideCheckboxes(value: boolean | string) {
    if (/boolean|string/g.test(typeof value)) {
      this.setAttribute(attributes.HIDE_CHECKBOXES, String(value));
    } else {
      this.removeAttribute(attributes.HIDE_CHECKBOXES);
    }
    this.#toggleCheckboxes();
  }

  get hideCheckboxes(): boolean {
    return this.boolVal(attributes.HIDE_CHECKBOXES, LIST_VIEW_DEFAULTS.hideCheckboxes);
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
   * Set checkbox state in given listview item.
   * @private
   * @param {HTMLElement} item The listview item.
   * @param {boolean} isChecked The value to be set.
   * @returns {void}
   */
  #setCheckbox(item: any, isChecked = false): void {
    const cb = item?.querySelector('.list-item-checkbox');
    if (cb) cb.checked = isChecked;
  }

  /**
   * Trigger the given event.
   * @private
   * @param {string} eventtName The event name to be trigger.
   * @param {object} args Extra data.
   * @returns {void}
   */
  #triggerEvent(eventtName: string, args: object = {}): void {
    this.triggerEvent(eventtName, this, { bubbles: true, detail: { elem: this, ...args } });
  }

  /**
   * Set a list item to be activated, in current page and data.
   * @param {number} index the zero based index.
   * @returns {boolean} Is veto.
   */
  #activateItemInPage(index: number): boolean {
    if (this.data?.[index]?.disabled) return true;

    const dataIndex = this.dataIndex(index) as number;

    if (this.#activatedIndex !== -1) {
      const activatedIndex = this.ds.findIndex((d: any) => d.itemActivated);
      this.#isApply = true;
      if (activatedIndex === dataIndex) {
        if (!this.suppressDeactivation) return true;
        if (this.isInPage(activatedIndex)) {
          return this.#deactivateItemInPage(this.pageIndex(activatedIndex) as number);
        }
        return this.deactivateItem(activatedIndex);
      }
      if (this.isInPage(activatedIndex)) {
        if (!this.#deactivateItemInPage(this.pageIndex(activatedIndex) as number)) {
          return false;
        }
      } else if (!this.deactivateItem(activatedIndex)) return false;
    }

    const item = this.#itemByIndex(index);
    const args = () => ({ item, index, dataIndex, data: this.data[index] }); // eslint-disable-line
    if (!this.triggerVetoableEvent('beforeitemactivated', { ...args() })) {
      return false;
    }
    item?.setAttribute('activated', '');
    this.#activatedIndex = dataIndex;
    this.data[index].itemActivated = true;
    this.#triggerEvent('itemactivated', { ...args() });

    this.focusLi(item, true);
    return true;
  }

  /**
   * Set a list item to be deactivated, in current page and data.
   * @param {number} index the zero based index
   * @returns {boolean} Is veto.
   */
  #deactivateItemInPage(index: number): boolean {
    if (this.data?.[index]?.disabled) return true;
    if (this.#activatedIndex === -1) return true;

    const dataIndex = this.dataIndex(index);

    if (this.#isApply) this.#isApply = false;
    else {
      const activatedIndex = this.ds.findIndex((d: any) => d.itemActivated);
      if (activatedIndex === dataIndex && !this.suppressDeactivation) return false;
    }

    const item = this.#itemByIndex(index);
    const args = () => ({ item, index, dataIndex, data: this.data[index] }); // eslint-disable-line
    if (!this.triggerVetoableEvent('beforeitemdeactivated', { ...args() })) {
      return false;
    }
    delete this.data[index].itemActivated;
    item?.removeAttribute('activated');
    this.#activatedIndex = -1;
    this.#triggerEvent('itemdeactivated', { ...args() });
    this.focusLi(item);
    return true;
  }

  /**
   * Set a list item to be activated, in dataset.
   * @param {number} dataIndex the zero based dataIndex
   * @returns {boolean} Is veto.
   */
  activateItem(dataIndex: number): boolean {
    if (this.ds?.[dataIndex]?.disabled || dataIndex === -1) return true;

    if (this.isInPage(dataIndex)) {
      return this.#activateItemInPage(this.pageIndex(dataIndex) as number);
    }

    if (this.#activatedIndex !== -1) {
      const activatedIndex = this.ds.findIndex((d: any) => d.itemActivated);
      this.#isApply = true;
      if (activatedIndex === dataIndex) {
        if (!this.suppressDeactivation) return true;
        if (this.isInPage(activatedIndex)) {
          return this.#deactivateItemInPage(this.pageIndex(activatedIndex) as number);
        }
        return this.deactivateItem(activatedIndex);
      }
      if (this.isInPage(activatedIndex)) {
        if (!this.#deactivateItemInPage(this.pageIndex(activatedIndex) as number)) {
          return false;
        }
      } else if (!this.deactivateItem(activatedIndex)) return false;
    }

    const args = () => ({ dataIndex, data: this.ds[dataIndex] });
    if (!this.triggerVetoableEvent('beforeitemactivated', { ...args() })) {
      return false;
    }

    this.#activatedIndex = dataIndex;
    this.ds[dataIndex].itemActivated = true;
    this.#triggerEvent('itemactivated', { ...args() });

    return true;
  }

  /**
   * Set a list item to be deactivated, in dataset
   * @param {number} dataIndex the zero based dataIndex
   * @returns {boolean} False, if veto.
   */
  deactivateItem(dataIndex: number): boolean {
    if (this.ds?.[dataIndex]?.disabled) return true;
    if (this.#activatedIndex === -1) return true;

    if (this.isInPage(dataIndex)) {
      return this.#deactivateItemInPage(this.pageIndex(dataIndex) as number);
    }

    if (this.#isApply) this.#isApply = false;
    else {
      const activatedIndex = this.ds.findIndex((d: any) => d.itemActivated);
      if (activatedIndex === dataIndex && !this.suppressDeactivation) return false;
    }

    const args = () => ({ dataIndex, data: this.ds[dataIndex] });
    if (!this.triggerVetoableEvent('beforeitemdeactivated', { ...args() })) {
      return false;
    }
    if (this.ds[dataIndex]?.itemActivated) {
      delete this.ds[dataIndex].itemActivated;
    }
    this.#activatedIndex = -1;
    this.#triggerEvent('itemdeactivated', { ...args() });

    return true;
  }

  /**
   * Set a list item to be selected, in current page and data.
   * @private
   * @param {number} index the zero based index.
   * @returns {boolean} Is veto.
   */
  #selectInPage(index: number): boolean {
    if (this.data?.[index]?.disabled) return true;

    const dataIndex = this.dataIndex(index);
    const selected: any = this.selected;

    if (this.selectable === 'single' && selected) {
      const isSame = selected.index === dataIndex;
      if (isSame && !this.suppressDeselection) return true;
      this.#isApply = true;
      if (this.isInPage(selected.index)) {
        if (!this.#deselectInPage(this.pageIndex(selected.index) as number)) {
          return false;
        }
      } else if (!this.deselect(selected.index)) return false;
      if (isSame) return true;
    }
    const item = this.#itemByIndex(index);
    const cb: any = item?.querySelector('.list-item-checkbox');
    const key = this.selectable === 'single' ? 'selectedItem' : 'selectedItems';
    const args = { item, index, dataIndex, data: this.data[index] };// eslint-disable-line
    this.#isTargetCheckbox = false;
    if (!this.triggerVetoableEvent('beforeselected', { ...args, [key]: this.selected })) {
      this.#setCheckbox(item, false);
      return false;
    }
    this.data[index].itemSelected = true;

    if (cb) cb.checked = true;
    item?.setAttribute('selected', '');
    if (this.selectable === 'mixed') item?.setAttribute('hide-selected-color', '');
    this.#triggerEvent('selected', { ...args, [key]: this.selected });
    this.focusLi(item);

    return true;
  }

  /**
   * Set a list item to be deselected, in current page and data.
   * @private
   * @param {number} index the zero based index.
   * @returns {boolean} Is veto.
   */
  #deselectInPage(index: number): boolean {
    if (this.data?.[index]?.disabled) return true;

    const selected: any = this.selected;
    if (!selected || (/^(multiple|mixed)$/g.test(String(this.selectable)) && !selected.length)) return true;

    if (this.selectable === 'single') {
      if (this.#isApply) this.#isApply = false;
      else if (this.dataIndex(index) === selected.index && !this.suppressDeselection) return false;
    }
    const item = this.#itemByIndex(index);
    const dataIndex = this.dataIndex(index);
    const cb: any = item?.querySelector('.list-item-checkbox');
    const key = this.selectable === 'single' ? 'selectedItem' : 'selectedItems';
    const args = { item, index, dataIndex, data: this.data[index] };// eslint-disable-line
    this.#isTargetCheckbox = false;
    if (!this.triggerVetoableEvent('beforedeselected', { ...args, [key]: this.selected })) {
      this.#setCheckbox(item, true);
      return false;
    }
    delete this.data[index].itemSelected;

    if (cb) cb.checked = false;
    item?.removeAttribute('selected');
    item?.removeAttribute('hide-selected-color');
    this.#triggerEvent('deselected', { ...args, [key]: this.selected });
    this.focusLi(item);

    return true;
  }

  /**
   * Set a list item to be selected, in dataset.
   * @param {number} dataIndex the zero based dataIndex.
   * @returns {boolean} Is veto.
   */
  select(dataIndex: number): boolean {
    if (this.ds?.[dataIndex]?.disabled) return true;

    if (this.isInPage(dataIndex)) {
      return this.#selectInPage(this.pageIndex(dataIndex) as number);
    }

    const selected: any = this.selected;

    if (this.selectable === 'single' && selected) {
      const isSame = selected.index === dataIndex;
      if (isSame && !this.suppressDeselection) return true;
      this.#isApply = true;
      if (this.isInPage(selected.index)) {
        if (!this.#deselectInPage(this.pageIndex(selected.index) as number)) {
          return false;
        }
      } else if (!this.deselect(selected.index)) return false;
      if (isSame) return true;
    }

    const key = this.selectable === 'single' ? 'selectedItem' : 'selectedItems';
    const args = { dataIndex, data: this.ds[dataIndex] };
    if (!this.triggerVetoableEvent('beforeselected', { ...args, [key]: this.selected })) {
      return false;
    }
    this.ds[dataIndex].itemSelected = true;
    this.#triggerEvent('selected', { ...args, [key]: this.selected });

    return true;
  }

  /**
   * Set a list item to be deselected, in dataset.
   * @param {number} dataIndex the zero based dataIndex.
   * @returns {boolean} False, if veto.
   */
  deselect(dataIndex: number): boolean {
    if (this.ds?.[dataIndex]?.disabled) return true;

    const selected: any = this.selected;
    if (!selected || (/^(multiple|mixed)$/g.test(String(this.selectable)) && !selected.length)) return true;

    if (this.isInPage(dataIndex)) {
      return this.#deselectInPage(this.pageIndex(dataIndex) as any);
    }

    if (this.selectable === 'single') {
      if (this.#isApply) this.#isApply = false;
      else if (dataIndex === selected.index && !this.suppressDeselection) return false;
    }
    const key = this.selectable === 'single' ? 'selectedItem' : 'selectedItems';
    const args = { dataIndex, data: this.ds[dataIndex] };
    if (!this.triggerVetoableEvent('beforedeselected', { ...args, [key]: this.selected })) {
      return false;
    }
    delete this.ds[dataIndex].itemSelected;
    this.#triggerEvent('deselected', { ...args, [key]: this.selected });

    return true;
  }

  /**
   * Set a all list items to be selected.
   * @returns {void}
   */
  selectAll(): void {
    this.toggleAll();
  }

  /**
   * Set a all list items to be deselected.
   * @returns {void}
   */
  deselectAll(): void {
    this.toggleAll(true);
  }

  /**
   * Set all list items to be selected or deselected.
   * @param {boolean} isDeselect If true will deselect all items, otherwise select all.
   * @returns {void}
   */
  toggleAll(isDeselect?: boolean): void {
    const action = isDeselect ? 'deselect' : 'select';
    if (this.selectable) {
      const selected: any = this.selected;
      let key: any;
      let len = 0;

      // Single
      if (this.selectable === 'single') {
        key = 'selectedItem';
        len = selected ? 1 : 0;
        if (isDeselect && len) this[action](selected.index);
        if (!isDeselect && !len) this[action](0);
      }

      // Multiple or Mixed
      if (/multiple|mixed/g.test(this.selectable)) {
        key = 'selectedItems';
        len = selected.length;
        this.ds?.forEach((d: any, i: number) => this[action](i));
      }

      if ((this.selected as any)?.length !== len) {
        this.#triggerEvent('selectionchanged', { [key]: this.selected });
      }
    }
  }

  /**
   * Get data for list item
   * @param {Element} item list item
   * @returns {any} data object
   */
  getListItemData(item?: Element | null) {
    const dataIdx = item?.getAttribute('index');
    return dataIdx ? this.data[dataIdx] : {};
  }

  /**
   * Return #focusedLiIndex
   * @returns {any} focusedLiIndex
   */
  getFocusedLiIndex(): any {
    return this.#focusedLiIndex;
  }

  /**
   * Return all selected Li indexes
   * @returns {any} List of selected li index
   */
  getAllSelectedLiIndex(): number[] {
    const listOfIndex: number[] = [];
    this.container?.querySelectorAll<IdsSwappableItem>('ids-swappable-item[selected]')
      .forEach((item) => {
        listOfIndex.push(+(item.getAttribute('index') ?? -1));
      });

    return listOfIndex;
  }
}

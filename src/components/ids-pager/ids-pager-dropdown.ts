import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
import { stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import './ids-pager-button';
import './ids-pager-input';
import './ids-pager-number-list';

import styles from './ids-pager.scss';
import type IdsPager from './ids-pager';

/**
 * IDS Pager Component
 * @type {IdsPagerDropdown}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container the overall ids-pager-dropdown container
 */
@customElement('ids-pager-dropdown')
@scss(styles)
export default class IdsPagerDropdown extends IdsEventsMixin(IdsElement) {
  rootNode: any;

  sizes = [5, 10, 25, 50, 100];

  readonly DEFAULT_PAGE_SIZE = 10;

  constructor() {
    super();
  }

  /**
   * Reference to the pager parent
   * @returns {IdsPager} the parent element
   */
  get pager(): IdsPager {
    if (!this.rootNode) this.rootNode = (this.getRootNode?.() as any)?.host;
    if (this.rootNode?.nodeName !== 'IDS-PAGER') this.rootNode = this.closest('ids-pager');
    return this.rootNode as IdsPager;
  }

  /**
   * Reference to ids-menu-button#pager-size-menu-button
   * @returns {HTMLElement} <ids-menu-button>
   */
  get menuButton(): any { return this.container?.querySelector('ids-menu-button'); }

  /**
   * Reference to ids-popup-menu#pager-size-menu
   * @returns {HTMLElement} <ids-popup-menu>
   */
  get popupMenu(): any { return this.container?.querySelector('ids-popup-menu'); }

  static get attributes(): Array<string> {
    return [
      attributes.DISABLED,
      attributes.LABEL,
      attributes.TOTAL,
      attributes.PAGE_SIZE,
      attributes.PAGE_NUMBER,
    ];
  }

  template(): string {
    return `
      <div class="ids-pager-dropdown">
        <ids-menu-button id="pager-size-menu-button" menu="pager-size-menu" role="button" dropdown-icon no-padding>
          <span>${this.pageSize} ${this.label}</span>
        </ids-menu-button>
        <ids-popup-menu id="pager-size-menu" target="#pager-size-menu-button" trigger-type="click">
          ${this.itemsTemplate()}
        </ids-popup-menu>
      </div>
    `;
  }

  /**
   * Get items template
   * @private
   * @param {number} pageSize The page size value
   * @returns {string} items template
   */
  itemsTemplate(pageSize?: number): string {
    pageSize = pageSize ?? this.pageSize;
    const uniqueSizes = [...new Set([pageSize, ...(this.sizes || [5, 10, 25, 50, 100])])].sort((a, b) => a - b);

    const items = uniqueSizes.map((size) => {
      const selected = size === pageSize ? ' selected' : '';
      return `<ids-menu-item value="${size}"${selected}>${size}</ids-menu-item>`;
    }).join('');

    return `<ids-menu-group select="single">${items}</ids-menu-group>`;
  }

  /**
   * Set the label for the pager-dropdown button
   * @param {string} value - the pager-dropdown's button label
   */
  set label(value: string) { this.setAttribute(attributes.LABEL, value); }

  /**
   * Get the label for the pager-dropdown button
   * @returns {string} - the pager-dropdown's button label
   */
  get label(): string {
    const labelText = this.pageSize > 1 ? 'Records per page' : 'Record per page';
    return this.getAttribute(attributes.LABEL) ?? labelText;
  }

  /**
   * Set the page-size attribute
   * @param {number} value - new the page-size
   */
  set pageSize(value: number) {
    const val = this.isValidPageSize(value);
    if (this.menuButton?.menuEl?.items) {
      this.menuButton.querySelector('span').textContent = `${val} ${this.label}`;
      const item = this.menuButton.menuEl.items.filter((itm: any) => itm.value === String(val))[0];
      if (item) this.menuButton.menuEl.selectItem(item);
      else this.menuButton.menuEl.innerHTML = this.itemsTemplate(val);
    }
    this.setAttribute(attributes.PAGE_SIZE, String(val));
  }

  /**
   * Get the page-size attribute
   * @returns {number} - the current page-size
   */
  get pageSize(): number {
    const size = this.getAttribute(attributes.PAGE_SIZE) || this.pager?.getAttribute(attributes.PAGE_SIZE) || 25;
    return this.isValidPageSize(size);
  }

  /**
   * Check given page size value, if not a number return default
   * @private
   * @param {number | string | null} value The value
   * @returns {number} Given value or default
   */
  isValidPageSize(value?: number | string | null): number {
    const val = stringToNumber(value);
    return !Number.isNaN(val) && val > 0 ? val : this.DEFAULT_PAGE_SIZE;
  }

  /**
   * React to attributes changing on the web-component
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue === newValue) return;

    const shouldRerender = [
      attributes.DISABLED,
      attributes.LABEL,
      attributes.TOTAL,
      attributes.PAGE_SIZE,
      attributes.PAGE_NUMBER
    ].includes(name);

    if (shouldRerender) {
      this.connectedCallback();
    }
  }

  connectedCallback(): void {
    super.connectedCallback?.();

    const pageSize = this.pager?.pageSize ?? this.pageSize;
    if (this.pager) this.pageSize = pageSize;

    const popupMenu: any = this.popupMenu;
    if (popupMenu) {
      popupMenu.style.position = 'relative';
      if (popupMenu.popup) {
        popupMenu.popup.type = 'menu';
      }
    }

    const popupMenuGroup = popupMenu?.querySelector('ids-menu-group');
    if (popupMenuGroup) {
      popupMenuGroup.style.textAlign = 'left';
      const sel = stringToNumber(popupMenu?.getSelectedValues?.()?.[0]);
      if (!Number.isNaN(sel) && sel !== pageSize) {
        popupMenu?.setSelectedValues?.(String(pageSize), popupMenuGroup);
      }
    }

    this.#attachEventListeners();
  }

  updatePageSizes(sizes: number[]): void {
    if (sizes.join('-') === this.sizes.join('-')) return;
    this.sizes = sizes;
    this.popupMenu.innerHTML = this.itemsTemplate(this.pageSize);
  }

  #attachEventListeners() {
    const popupMenu: any = this.popupMenu;
    if (popupMenu) {
      this.offEvent('selected', popupMenu);
      this.onEvent('selected', popupMenu, (evt: CustomEvent) => {
        const oldPageSize = this.pageSize;
        const newPageSize = stringToNumber(evt.detail?.value || oldPageSize);
        if (newPageSize !== oldPageSize) {
          this.triggerEvent('pagesizechange', this, {
            bubbles: true,
            composed: true,
            detail: { elem: this, value: newPageSize }
          });
        }
      });
    }
  }
}

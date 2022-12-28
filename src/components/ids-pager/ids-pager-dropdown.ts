import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
// import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

// Import Utils
import Base from './ids-pager-dropdown-base';

import './ids-pager-button';
import './ids-pager-input';
import './ids-pager-number-list';

import styles from './ids-pager.scss';

/**
 * IDS Pager Component
 * @type {IdsPagerDropdown}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container the overall ids-pager-dropdown container
 */
@customElement('ids-pager-dropdown')
@scss(styles)
export default class IdsPagerDropdown extends Base {
  constructor() {
    super();
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
      attributes.MODE,
      attributes.TOTAL, // has to be in this order
      attributes.PAGE_SIZE,
      attributes.PAGE_NUMBER,
    ];
  }

  template(): string {
    return `
      <div class="ids-pager-dropdown">
        <ids-menu-button id="pager-size-menu-button" menu="pager-size-menu" role="button" dropdown-icon>
          <span slot="text">${this.pageSize} ${this.label}</span>
        </ids-menu-button>
        <ids-popup-menu id="pager-size-menu" target="#pager-size-menu-button" trigger-type="click">
          ${this.#itemsTemplate()}
        </ids-popup-menu>
      </div>
    `;
  }

  /**
   * Get items template
   * @private
   * @returns {string} items template
   */
  #itemsTemplate(): string {
    const sizes = [5, 10, 25, 50, 100];
    const uniqueSizes = [...new Set([this.pageSize, ...sizes])].sort((a, b) => a - b);

    const items = uniqueSizes.map((size) => {
      const selected = size === this.pageSize ? ' selected' : '';
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
    return this.getAttribute(attributes.LABEL) || labelText;
  }

  /**
   * Set the page-size attribute
   * @param {number} value - new the page-size
   */
  set pageSize(value: number) {
    const val = this.#validPageSize(value);
    this.setAttribute(attributes.PAGE_SIZE, String(val));

    if (this.menuButton) {
      this.menuButton.querySelector('[slot="text"]').textContent = `${val} ${this.label}`;
      const item = this.menuButton.menuEl.items.filter((itm: any) => itm.value === String(val))[0];
      if (item) this.menuButton.menuEl.selectItem(item);
      else this.menuButton.menuEl.innerHTML = this.#itemsTemplate();
    }
  }

  /**
   * Get the page-size attribute
   * @returns {number} - the current page-size
   */
  get pageSize(): number {
    return this.#validPageSize(this.getAttribute(attributes.PAGE_SIZE) || '');
  }

  /**
   * Check given page size value, if not a number return default
   * @private
   * @param {number | string} value The value
   * @returns {number} Given value or default
   */
  #validPageSize(value: number | string): number {
    const val = parseInt(value as any);
    return Number.isNaN(val) ? 10 : val;
  }

  connectedCallback(): void {
    super.connectedCallback?.();

    const popupMenu: any = this.popupMenu;
    if (popupMenu) {
      popupMenu.style.position = 'relative';
      if (popupMenu.popup) {
        popupMenu.popup.type = 'menu';
      }
    }

    const popupMenuGroup = popupMenu?.querySelector('ids-menu-group');
    if (popupMenuGroup) {
      popupMenuGroup.style.minWidth = '175px';
      popupMenuGroup.style.textAlign = 'left';
      popupMenu?.setSelectedValues?.(String(this.pageSize), popupMenuGroup);
    }

    this.#attachEventListeners();
  }

  #attachEventListeners() {
    const popupMenu: any = this.popupMenu;
    if (popupMenu) {
      this.offEvent('selected', popupMenu);
      this.onEvent('selected', popupMenu, (evt: CustomEvent) => {
        const oldPageSize = this.pageSize;
        const newPageSize = evt.detail?.value || oldPageSize;
        if (newPageSize !== oldPageSize) {
          this.pageSize = newPageSize;

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

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
    const pageSize = Math.max(this.pageSize || 0, 1);

    return `
      <div class="ids-pager-dropdown">
        <ids-menu-button id="pager-size-menu-button" menu="pager-size-menu" role="button" dropdown-icon>
          <span>${pageSize} ${this.label}</span>
        </ids-menu-button>
        <ids-popup-menu id="pager-size-menu" target="#pager-size-menu-button" trigger-type="click">
          <ids-menu-group select="single">
            <ids-menu-item value="5">5</ids-menu-item>
            <ids-menu-item value="10">10</ids-menu-item>
            <ids-menu-item value="25">25</ids-menu-item>
            <ids-menu-item value="50">50</ids-menu-item>
            <ids-menu-item value="100">100</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      </div>
    `;
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
    this.setAttribute(attributes.PAGE_SIZE, String(value));

    if (this.menuButton) {
      const span = this.menuButton.querySelector('span');
      span.textContent = `${value} ${this.label}`;
    }
  }

  /**
   * Get the page-size attribute
   * @returns {number} - the current page-size
   */
  get pageSize(): number { return parseInt(this.getAttribute(attributes.PAGE_SIZE) ?? '') || 10; }

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
      popupMenu.setSelectedValues(String(this.pageSize), popupMenuGroup);
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

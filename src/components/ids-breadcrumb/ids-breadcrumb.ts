import { customElement, scss } from '../../core/ids-decorators';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-breadcrumb.scss';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import '../ids-hyperlink/ids-hyperlink';
import '../ids-menu-button/ids-menu-button';
import '../ids-menu/ids-menu-group';
import '../ids-menu/ids-menu-item';
import '../ids-popup-menu/ids-popup-menu';
import type IdsMenuButton from '../ids-menu-button/ids-menu-button';
import type IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import type IdsMenuGroup from '../ids-menu/ids-menu-group';
import type IdsHyperlink from '../ids-hyperlink/ids-hyperlink';

const Base = IdsEventsMixin(
  IdsElement
);

/**
 * IDS Breadcrumb Component
 * @type {IdsBreadcrumb}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part breadcrumb
 */
@customElement('ids-breadcrumb')
@scss(styles)
export default class IdsBreadcrumb extends Base {
  onBreadcrumbActivate?: (target: HTMLElement, current: HTMLElement) => void;

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'navigation');
    this.setAttribute('aria-label', 'Breadcrumb');
    this.#attachEventHandlers();

    if (this.truncate) {
      this.#enableTruncation();
    }
    this.#setActiveBreadcrumb();
    this.#setBreadcrumbStates();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.PADDING,
      attributes.TRUNCATE
    ];
  }

  /**
   * Attach the resize observer.
   * @private
   * @type {number}
   */
  #resizeObserver = new ResizeObserver(() => this.#resize());

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['breadcrumb', 'alternate'];

  /**
   * Attaches event handlers
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    this.onEvent('click', this, (e: any) => {
      if (e.target.tagName === 'IDS-HYPERLINK' && typeof this.onBreadcrumbActivate === 'function' && this.current) {
        this.onBreadcrumbActivate(e.target, this.current);
      }
    });

    this.onEvent('slotchange', this.container, () => {
      this.#setActiveBreadcrumb();
      this.#setBreadcrumbStates();
      if (this.truncate) {
        this.#enableTruncation();
        this.#refreshOverflow();
      }
    });

    this.onEvent('beforeshow', this.popupMenuEl, (e: any) => {
      // Reflect this event to the host element
      this.triggerEvent('beforeshow', this, {
        bubbles: e.bubbles,
        detail: e.detail
      });

      this.refreshOverflowedItems();
    });

    this.onEvent('selected', this.popupMenuEl, (e: any) => {
      // Reflect this event to the host element
      this.triggerEvent('beforeshow', this, {
        bubbles: e.bubbles,
        detail: e.detail
      });

      // Reflect selection of a menu item on the corresponding Breadcrumb item
      if (e.target.overflowTarget && typeof this.onBreadcrumbActivate === 'function' && this.current) {
        this.onBreadcrumbActivate(e.target.overflowTarget, this.current);
      }
    });
  }

  /**
   * Constructs the overflow
   */
  #buildOverflowMenu(): void {
    const group = this.popupMenuGroupEl;
    const menuItemHTML = [...this.children].map(this.#buildOverflowMenuItem).join('');
    group?.insertAdjacentHTML('afterbegin', menuItemHTML);

    // Connect all "More Action" items generated from Breadcrumb Links to their
    // real counterparts in the list
    this.overflowMenuItems.forEach((item, i) => {
      item.overflowTarget = this.children[i];
    });
  }

  /**
   * Constructs a single overflow menu item
   * @param {HTMLElement} elem the breadcrumb element to use for creating the menu item
   * @returns {string} representation of an IdsMenuItem
   */
  #buildOverflowMenuItem(elem: any): string {
    const disabled = elem.hasAttribute(attributes.DISABLED) ? ' disabled' : '';
    const hidden = elem.hasAttribute(attributes.HIDDEN) ? ' hidden' : '';
    return `<ids-menu-item${disabled}${hidden}>${elem.textContent}</ids-menu-item>`;
  }

  /**
   * Destroys the overflow
   */
  #emptyOverflowMenu(): void {
    if (this.popupMenuGroupEl) {
      this.popupMenuGroupEl.innerHTML = '';
    }
  }

  /**
   * Resize
   * @private
   * @returns {object} This API object for chaining
   */
  #resize(): any {
    this.#refreshOverflow();
    return this;
  }

  /**
   * Returns the Inner template contents
   * @returns {string} The template
   */
  template(): string {
    const truncated = this.truncate ? ' truncate' : '';
    return `
      <div class="ids-breadcrumb${truncated}">
        <div class="ids-breadcrumb-menu hidden">
          <ids-menu-button id="icon-button" menu="icon-menu">
            <ids-icon icon="more"></ids-icon>
            <span class="audible">Icon Only Button</span>
          </ids-menu-button>
          <ids-popup-menu id="icon-menu" target="#icon-button" trigger-type="click">
            <ids-menu-group>
            </ids-menu-group>
          </ids-popup-menu>
        </div>
        <nav part="breadcrumb">
          <slot></slot>
        </nav>
      </div>`;
  }

  /**
   * Refreshes the state of the Breadcrumb's overflow menu based on whether its items are overflowed
   * @returns {void}
   */
  #refreshOverflow(): void {
    this.refreshOverflowedItems();
    if (this.hasVisibleActions()) {
      this.#showBreadCrumbMenu();
    } else {
      this.#hideBreadCrumbMenu();
    }
  }

  /**
   * contains the render routine for showing truncation and the breadcrumb overflow menu
   * @private
   * @returns {void}
   */
  #showBreadCrumbMenu(): void {
    this.buttonEl?.removeAttribute('hidden');
    this.menuContainerEl?.classList.remove(attributes.HIDDEN);
    this.container?.classList.add('truncate');
    this.container?.querySelector('nav')?.classList.add('truncate');
  }

  /**
   * contains the render routine for removing truncation and hiding the breadcrumb overflow menu
   * @private
   * @returns {void}
   */
  #hideBreadCrumbMenu(): void {
    this.buttonEl?.setAttribute('hidden', '');
    this.menuContainerEl?.classList.add(attributes.HIDDEN);
    this.container?.classList.remove('truncate');
    this.container?.querySelector('nav')?.classList.remove('truncate');
  }

  /**
   * @returns {HTMLElement} the current breadcrumb
   */
  get current(): HTMLElement | null {
    return this.querySelector('[font-weight="semibold"]');
  }

  /**
   * @returns {HTMLElement} reference to the breadcrumb overflow menu button
   */
  get buttonEl(): IdsMenuButton | undefined | null {
    return this.container?.querySelector('ids-menu-button');
  }

  /**
   * @returns {HTMLElement} reference to the breadcrumb overflow menu's container element
   */
  get menuContainerEl(): HTMLElement | undefined | null {
    return this.container?.querySelector('.ids-breadcrumb-menu');
  }

  /**
   * @returns {HTMLElement} reference to the breadcrumb list's container element
   */
  get navElem(): HTMLElement | undefined | null {
    return this.container?.querySelector('nav');
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of menu items that mirror Toolbar items
   */
  get overflowMenuItems(): Array<any> {
    if (this.popupMenuGroupEl) {
      return [...this.popupMenuGroupEl.children];
    }
    return [];
  }

  get popupMenuEl(): IdsPopupMenu | undefined | null {
    return this.container?.querySelector('ids-popup-menu');
  }

  get popupMenuGroupEl(): IdsMenuGroup | undefined | null {
    return this.container?.querySelector('ids-menu-group');
  }

  /**
   * Set if breadcrumb will be truncated if there isn't enough space
   * @param {boolean|null} value truncate if true
   */
  set truncate(value: boolean | null) {
    const currentValue = this.truncate;
    const val = stringToBool(value);

    if (currentValue !== val) {
      if (val) {
        this.setAttribute(attributes.TRUNCATE, String(value));
        this.#enableTruncation();
      } else {
        this.removeAttribute(attributes.TRUNCATE);
        this.#disableTruncation();
      }
    }
  }

  /**
   * @returns {boolean} true if this component is currently configured to truncate
   */
  get truncate(): boolean {
    return stringToBool(this.getAttribute(attributes.TRUNCATE));
  }

  /**
   * contains the render routine for showing truncation and the breadcrumb overflow menu
   * @private
   * @returns {void}
   */
  #enableTruncation(): void {
    // Set observer for resize
    this.#resizeObserver.disconnect();
    if (this.container) this.#resizeObserver.observe(this.container);
    this.#buildOverflowMenu();
    this.#showBreadCrumbMenu();
    this.container?.classList.add('can-truncate');
  }

  /**
   * contains the render routine for removing truncation and hiding the breadcrumb overflow menu
   * @private
   * @returns {void}
   */
  #disableTruncation(): void {
    this.#resizeObserver.disconnect();
    this.#hideBreadCrumbMenu();
    this.#emptyOverflowMenu();
    this.container?.classList.remove('can-truncate');
  }

  /**
   * If set to number the breadcrumb container will have padding added (in pixels)
   * @param {string} value sets the padding to the container
   */
  set padding(value: string | null) {
    if (value) {
      this.container?.style.setProperty('padding', `0 ${value}px`);
      this.setAttribute(attributes.PADDING, value.toString());
    } else {
      this.removeAttribute(attributes.PADDING);
    }
  }

  get padding(): string | null {
    return this.getAttribute(attributes.PADDING);
  }

  /**
   * @param {HTMLElement} item reference to the toolbar item to be checked for overflow
   * @returns {boolean} true if the item is a toolbar member and should be displayed by overflow
   */
  isOverflowed(item: any): boolean {
    if (!this.contains(item)) {
      return false;
    }
    if (item.hidden) {
      return false;
    }

    const itemRect = item.getBoundingClientRect();
    const sectionRect = this.navElem?.getBoundingClientRect();

    const isBeyondRightEdge = itemRect.right > (sectionRect?.right || NaN);
    const isBeyondLeftEdge = itemRect.left < (sectionRect?.left || NaN);

    return isBeyondLeftEdge || isBeyondRightEdge;
  }

  /**
   * Refreshes the visible state of menu items representing "overflowed" elements
   * @returns {void}
   */
  refreshOverflowedItems(): void {
    this.overflowMenuItems.forEach((item) => {
      const doHide = !this.isOverflowed(item.overflowTarget);
      item.hidden = doHide;
      if (doHide) {
        item.overflowTarget?.removeAttribute(attributes.OVERFLOWED);
      } else {
        item.overflowTarget?.setAttribute(attributes.OVERFLOWED, '');
      }
    });

    this.menuContainerEl?.setAttribute(attributes.HIDDEN, String(!this.hasVisibleActions()));
    this.buttonEl?.setAttribute(attributes.HIDDEN, String(!this.hasVisibleActions()));
    this.buttonEl?.setAttribute(attributes.DISABLED, String(!this.hasEnabledActions()));
  }

  /**
   * @returns {boolean} true if there are currently visible actions in this menu
   */
  hasVisibleActions(): boolean {
    return !!this.container?.querySelectorAll('ids-menu-group > ids-menu-item:not([hidden])').length;
  }

  /**
   * @returns {boolean} true if there are currently enabled (read: not disabled) actions in this menu
   */
  hasEnabledActions(): boolean {
    return !!this.container?.querySelectorAll('ids-menu-group > ids-menu-item:not([disabled])').length;
  }

  /**
   * Set internal states on breadcrumbs
   */
  #setBreadcrumbStates() {
    this.querySelectorAll('ids-hyperlink').forEach((el) => {
      const link = el as IdsHyperlink;
      link.fontSize = '14';
      link.textDecoration = link.textDecoration === 'none' ? 'none' : 'hover';
      link.colorVariant = 'breadcrumb';
    });
  }

  /**
   * @param {HTMLElement} el the target breadcrumb link
   * @param {HTMLElement} [previousActiveBreadcrumbEl] a previously-activated Breadcrumb, if applicable
   */
  #setActiveBreadcrumb(el?: any, previousActiveBreadcrumbEl?: any) {
    let targetEl = el;
    if (!this.contains(targetEl)) {
      targetEl = this.lastElementChild;
    }
    if (!previousActiveBreadcrumbEl) {
      previousActiveBreadcrumbEl = this.querySelector('[font-weight="semibold"]');
    }
    if (previousActiveBreadcrumbEl) {
      previousActiveBreadcrumbEl.fontWeight = null;
      previousActiveBreadcrumbEl.textDecoration = null;
    }
    if (targetEl) {
      targetEl.disabled = false;
      targetEl.fontWeight = 'semibold';
      targetEl.fontSize = 14;
      targetEl.textDecoration = 'none';
    }
  }
}

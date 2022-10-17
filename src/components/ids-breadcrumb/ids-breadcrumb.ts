import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-breadcrumb-base';
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

/**
 * IDS Breadcrumb Component
 * @type {IdsBreadcrumb}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
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

    this.setAttribute('role', 'list');
    this.#attachEventHandlers();

    if (this.truncate) {
      this.#enableTruncation();
    }
    this.onColorVariantRefresh();
    this.setActiveBreadcrumb();
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
    this.refreshBreadcrumbMenu();
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
            <ids-icon slot="icon" icon="more"></ids-icon>
            <span class="audible">Icon Only Button</span>
          </ids-menu-button>
          <ids-popup-menu id="icon-menu" target="icon-button" trigger-type="click">
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
   * Adds an individual breadcrumb to the end of the bread crumb list
   * @param {Element} breadcrumb The HTML element to add
   */
  add(breadcrumb: any): void {
    breadcrumb.setAttribute('role', 'listitem');
    breadcrumb.setAttribute('text-decoration', 'hover');
    breadcrumb.setAttribute('color-variant', this.closest('ids-header') ? 'alternate' : 'breadcrumb');
    breadcrumb.setAttribute('hitbox', 'true');
    if (!(breadcrumb.getAttribute('font-size'))) {
      breadcrumb.setAttribute('font-size', 14);
    }
    const lastBreadcrumb = this.lastElementChild;
    this.appendChild(breadcrumb);
    this.setActiveBreadcrumb(breadcrumb, lastBreadcrumb);
    if (this.truncate) {
      this.popupMenuGroupEl?.insertAdjacentHTML('beforeend', this.#buildOverflowMenuItem(breadcrumb));
      const lastElement: any = this.popupMenuGroupEl?.lastElementChild;
      if (lastElement) {
        lastElement.overflowTarget = breadcrumb;
      }
    }

    // Refresh overflow state if needed
    this.refreshBreadcrumbMenu();
  }

  /**
   * Removes the last breadcrumb from the bread crumb list
   * @returns {Element | null} The removed element
   */
  delete(): Element | null {
    if (this.lastElementChild) {
      const breadcrumb = this.removeChild(this.lastElementChild);
      if (this.truncate && this.popupMenuGroupEl?.lastElementChild) {
        this.popupMenuGroupEl?.removeChild(this.popupMenuGroupEl?.lastElementChild);
      }
      if (this.lastElementChild) {
        this.setActiveBreadcrumb();
      }

      // Refresh overflow state if needed
      this.refreshBreadcrumbMenu();

      return breadcrumb;
    }
    return null;
  }

  /**
   * Refreshes the state of the Breadcrumb's overflow menu based on whether its items are overflowed
   * @returns {void}
   */
  refreshBreadcrumbMenu(): void {
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
    return this.querySelector('[font-weight="bold"]');
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
   * @param {HTMLElement} el the target breadcrumb link
   * @param {HTMLElement} [previousActiveBreadcrumbEl] a previously-activated Breadcrumb, if applicable
   */
  setActiveBreadcrumb(el?: any, previousActiveBreadcrumbEl?: any) {
    let targetEl = el;
    if (!this.contains(targetEl)) {
      targetEl = this.lastElementChild;
    }
    if (previousActiveBreadcrumbEl) {
      previousActiveBreadcrumbEl.fontWeight = null;
    }
    if (targetEl) {
      targetEl.fontWeight = 'bold';
    }
  }

  /**
   * Inherited from IdsColorVariantMixin to set child element color variants
   */
  onColorVariantRefresh() {
    const parentHeaderEl = this.closest('ids-header');
    const breadcrumbVariant = parentHeaderEl ? 'alternate' : 'breadcrumb';
    const menuButtonVariant = parentHeaderEl ? 'alternate' : null;

    if (this.buttonEl) this.buttonEl.colorVariant = menuButtonVariant;
    [...this.children].forEach((link) => {
      link.setAttribute(attributes.COLOR_VARIANT, breadcrumbVariant);
    });
  }
}

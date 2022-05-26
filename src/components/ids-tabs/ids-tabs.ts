import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';

import Base from './ids-tabs-base';
import IdsHeader from '../ids-header/ids-header';
import './ids-tab';
import './ids-tab-more';
import './ids-tab-divider';

import styles from './ids-tabs.scss';

/**
 * IDS Tabs Component
 * @type {IdsTabs}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsOrientationMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-tabs')
@scss(styles)
export default class IdsTabs extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.setAttribute(htmlAttributes.ROLE, 'tablist');
    this.#connectMoreTabs();
    this.#detectParentColorVariant();
    this.#attachEventHandlers();
    this.#ro.observe(this.container as any);
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#ro.disconnect();
  }

  rendered() {
    const selected: any = this.querySelector('[selected]') || this.querySelector('[value]');
    this.#selectTab(selected);
    this.#attachAfterRenderEvents();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [
      ...super.attributes,
      attributes.VALUE
    ];
  }

  /**
   * @returns {string} template for Tab List
   */
  template() {
    return `<div class="ids-tabs-container">
      <div class="ids-tabs-list">
        <slot></slot>
      </div>
      <div class="ids-tabs-list-more">
        <slot name="more"></slot>
      </div>
    </div>`;
  }

  /**
   * Watches for changes to the Tab List size and recalculates overflowed tabs, if applicable
   * @private
   * @property {ResizeObserver} ro this Popup component's resize observer
   */
  #ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('ids-tabs-container')) {
        this.#resize();
      }
    }
  });

  /**
   * Runs whenever the Tab List's size is altered
   */
  #resize(): void {
    const moreTab = this.querySelector('ids-tab-more');
    if (moreTab) {
      moreTab.refreshOverflowedItems();
    }
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate', 'module'];

  /**
   * @property {string} value stores a tab's value (used for syncing tab state with displayed content)
   */
  #value = '';

  /**
   * @param {string} value A value which represents a currently selected tab
   */
  set value(value) {
    const currentValue = this.#value;
    const isValidValue = this.hasTab(value);

    if (isValidValue && currentValue !== value) {
      this.#value = value;
      this.setAttribute(attributes.VALUE, value);
      this.#selectTab(this.querySelector(`ids-tab[value="${value}"]`));
      this.triggerEvent('change', this, {
        bubbles: false,
        detail: { elem: this, value }
      });
    } else {
      this.setAttribute(attributes.VALUE, this.value);
    }
  }

  /**
   * @returns {string} The value representing a currently selected tab
   */
  get value() {
    return this.#value;
  }

  /**
   * @returns {HTMLElement} Tab List container element reference from the shadow root
   */
  get tabListContainer() {
    return this.container.querySelector('.ids-tabs-list');
  }

  /**
   * @readonly
   * @returns {any} [IdsTab | null] The last possible tab with a usable value in the list
   */
  get lastNavigableTab(): any {
    return [...this.querySelectorAll('ids-tab[value]:not([actionable]):not([disabled]):not([overflowed])')].pop();
  }

  /**
   * Reference to the currently-selected tab, if applicable
   * @param {string} value the tab value to scan
   * @returns {boolean} true if this tab list contains a tab with the provided value
   */
  hasTab(value: string): boolean {
    return this.querySelector(`ids-tab[value="${value}"]`) !== null;
  }

  /**
   * Traverses parent nodes and scans for parent IdsHeader components.
   * If an IdsHeader is found, adjusts this component's ColorVariant accordingly.
   * @returns {void}
   */
  #detectParentColorVariant() {
    let isHeaderDescendent = false;
    let currentElement = this.host || this.parentNode;

    while (!isHeaderDescendent && currentElement) {
      if (currentElement instanceof IdsHeader) {
        isHeaderDescendent = true;
        break;
      }

      // consider the body the ceiling of where to reach here
      if (currentElement.tagName === 'BODY') {
        break;
      }

      currentElement = currentElement.host || currentElement.parentNode;
    }

    if (isHeaderDescendent) {
      this.colorVariant = 'alternate';
    }
  }

  /**
   * When a child value or this component value changes,
   * called to rebind onclick callbacks to each child
   * @returns {void}
   */
  #attachEventHandlers() {
    // Reusable handlers
    const nextTabHandler = (e: Event) => {
      this.nextTab((e.target as any).closest('ids-tab, ids-tab-more')).focus();
      this.tabListContainer.scrollLeft = 0;
    };
    const prevTabHandler = (e: Event) => {
      this.prevTab((e.target as any).closest('ids-tab, ids-tab-more')).focus();
      this.tabListContainer.scrollLeft = 0;
    };

    // Add key listeners and consider orientation for assignments
    this.listen('ArrowLeft', this, prevTabHandler);
    this.listen('ArrowRight', this, nextTabHandler);
    this.listen('ArrowUp', this, prevTabHandler);
    this.listen('ArrowDown', this, nextTabHandler);

    // Home/End keys should navigate to beginning/end of Tab list respectively
    this.listen('Home', this, () => {
      this.children[0].focus();
    });
    this.listen('End', this, () => {
      this.children[this.children.length - 1].focus();
    });

    // Add Events/Key listeners for Tab Selection via click/keyboard
    this.listen('Enter', this, (e: KeyboardEvent) => {
      const elem: any = e.target;
      if (elem) {
        if (elem.tagName === 'IDS-TAB') {
          this.#selectTab(elem);
        }
        if (elem.tagName === 'IDS-TAB-MORE') {
          if (!elem.menu.visible) {
            elem.menu.showIfAble();
          } else {
            elem.menu.hide();
            elem.focus();
          }
        }
      }
    });

    this.onEvent('tabselect', this, (e: CustomEvent) => {
      const elem: any = e.target;
      if (elem && elem.tagName === 'IDS-TAB') {
        this.#selectTab(elem);
      }
    });

    this.onEvent('click.tabs', this, (e: PointerEvent) => {
      const elem: any = e.target;
      if (elem && elem.tagName === 'IDS-TAB') {
        this.#selectTab(elem);
      }
    });

    this.onEvent('focusin', this, (e: FocusEvent) => {
      const elem: any = e.target;
      if (elem && elem.tagName === 'IDS-TAB') {
        this.#selectTab(elem);
        elem.focus();
      }
    });
  }

  /**
   * Attaches event handlers that should be applied after rendering occurs
   */
  #attachAfterRenderEvents(): void {
    // Refreshes the tab list on change
    this.onEvent('slotchange', this.container, () => {
      this.#connectMoreTabs();
      this.#refreshOverflowedTabs();
      if (!this.hasTab(this.value)) {
        this.#selectTab(this.lastNavigableTab);
      }
    });
  }

  /**
   * Configures any slotted `ids-tab-more` components present
   */
  #connectMoreTabs() {
    this.querySelector('ids-tab-more')?.setAttribute('slot', 'more');
  }

  /**
   * Navigates from a specified Tab to the next-available Tab in the list
   * @param {HTMLElement} currentTab an contained element (usually an IdsTab) to check for siblings
   * @returns {HTMLElement} the next tab in this Tab list's order
   */
  nextTab(currentTab: HTMLElement): HTMLElement {
    let nextTab: any = currentTab.nextElementSibling;

    // If next sibling isn't a tab or is disabled, try this method again on the found sibling
    if (nextTab && (!nextTab.tagName.includes('IDS-TAB') || nextTab.disabled || nextTab.hasAttribute('overflowed'))) {
      return this.nextTab(nextTab);
    }

    // If null, reset back to the first tab (cycling behavior)
    if (!nextTab) {
      nextTab = this.children[0];
    }

    return nextTab;
  }

  /**
   * Navigates from a specified Tab to the previously-available Tab in the list
   * @param {HTMLElement} currentTab an contained element (usually an IdsTab) to check for siblings
   * @returns {HTMLElement} the previous tab in this Tab list's order
   */
  prevTab(currentTab: HTMLElement): HTMLElement {
    let prevTab: any = currentTab.previousElementSibling;

    // If previous sibling isn't a tab or is disabled, try this method again on the found sibling
    if (prevTab && (!prevTab.tagName.includes('IDS-TAB') || prevTab.disabled || prevTab.hasAttribute('overflowed'))) {
      return this.prevTab(prevTab);
    }

    // If null, reset back to the last tab (cycling behavior)
    if (!prevTab) {
      prevTab = this.children[this.children.length - 1];
    }

    return prevTab;
  }

  /**
   * Selects a tab and syncs the entire tab list with the new selection
   * @param {any} tab the new tab to select
   * @returns {void}
   */
  #selectTab(tab: any): void {
    if (!tab || tab.disabled) return;

    if (tab.actionable) {
      if (typeof tab.onAction === 'function') {
        tab.onAction(tab.selected);
      }
      return;
    }

    if (!tab.selected) {
      const current = this.querySelector('[selected]');
      if (!current || (current && tab !== current)) {
        tab.selected = true;
        this.value = tab.value;
        if (current) {
          current.selected = false;
        }
      }
    }
  }

  /**
   * Attempts to refresh state of the Tab List related to overflowed tabs, if applicable
   */
  #refreshOverflowedTabs(): void {
    const moreTab = this.querySelector('ids-tab-more');
    if (moreTab) {
      moreTab.renderOverflowedItems();
      moreTab.refreshOverflowedItems();
    }
  }

  /**
   * Listen for changes to color variant, which updates each child tab.
   * @returns {void}
   */
  onColorVariantRefresh(): void {
    const tabs = [...this.querySelectorAll('ids-tab, ids-tab-more')];
    tabs.forEach((tab) => {
      tab.colorVariant = this.colorVariant;
    });
  }

  /**
   * Listen for changes to orientation, which updates each child tab.
   * @returns {void}
   */
  onOrientationRefresh(): void {
    const tabs = [...this.querySelectorAll('ids-tab, ids-tab-more')];
    tabs.forEach((tab) => {
      tab.orientation = this.orientation;
    });
    this.#resize();
  }
}

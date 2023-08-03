import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsOrientationMixin from '../../mixins/ids-orientation-mixin/ids-orientation-mixin';
import IdsElement from '../../core/ids-element';

import IdsHeader from '../ids-header/ids-header';
import './ids-tab';
import './ids-tab-more';
import './ids-tab-divider';
import type IdsTab from './ids-tab';
import type IdsTabMore from './ids-tab-more';

import styles from './ids-tabs.scss';

const Base = IdsOrientationMixin(
  IdsColorVariantMixin(
    IdsKeyboardMixin(
      IdsEventsMixin(
        IdsElement
      )
    )
  )
);

/**
 * IDS Tabs Component
 * @type {IdsTabs}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsOrientationMixin
 */
@customElement('ids-tabs')
@scss(styles)
export default class IdsTabs extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute(htmlAttributes.ROLE, 'tablist');
    this.#connectMoreTabs();
    this.#detectParentColorVariant();
    this.#attachEventHandlers();
    this.#ro.observe(this.container as any);

    const selected: any = this.querySelector('[selected]') || this.querySelector('[value]');
    this.#selectTab(selected);
    this.#attachAfterRenderEvents();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#ro.disconnect();
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
        <slot name="fixed"></slot>
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
    this.#refreshOverflowedTabs();
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate', 'module', 'header'];

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
    return this.container?.querySelector<HTMLElement>('.ids-tabs-list');
  }

  /**
   * @returns {HTMLElement} More Container
   */
  get moreContainer() {
    return this.container?.querySelector<HTMLElement>('.ids-tabs-list-more');
  }

  /**
   * @returns {Array<HTMLElement>} tabs that are connected to this component's Main slot
   */
  get tabListElements() {
    const mainSlot = this.container?.querySelector<HTMLSlotElement>('slot:not([name])');
    return mainSlot?.assignedElements() as Array<HTMLElement>;
  }

  get lastTab(): IdsTab | undefined {
    return [...this.querySelectorAll<IdsTab>('ids-tab')].pop();
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
    let currentElement = (this as any).host || this.parentNode;

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
      if (this.tabListContainer) this.tabListContainer.scrollLeft = 0;
    };
    const prevTabHandler = (e: Event) => {
      this.prevTab((e.target as any).closest('ids-tab, ids-tab-more')).focus();
      if (this.tabListContainer) this.tabListContainer.scrollLeft = 0;
    };

    // Add key listeners and consider orientation for assignments
    this.listen('ArrowLeft', this, prevTabHandler);
    this.listen('ArrowRight', this, nextTabHandler);
    this.listen('ArrowUp', this, prevTabHandler);
    this.listen('ArrowDown', this, nextTabHandler);

    // Home/End keys should navigate to beginning/end of Tab list respectively
    this.listen('Home', this, () => {
      (this.children[0] as HTMLElement)?.focus();
    });
    this.listen('End', this, () => {
      (this.children[this.children.length - 1] as HTMLElement)?.focus();
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

    // Listen for Delete (Mac) or Backspace (PC) for removal events
    const dismissOnKeystroke = (e: CustomEvent) => {
      const elem: any = e.target;
      if (elem) {
        if (elem.tagName === 'IDS-TAB') {
          this.#dismissTab(elem);
        }
      }
    };
    this.listen('Delete', this, dismissOnKeystroke);
    this.listen('Backspace', this, dismissOnKeystroke);

    this.onEvent('tabselect', this, (e: CustomEvent) => {
      const elem: any = e.target;
      if (elem && elem.tagName === 'IDS-TAB') {
        this.#selectTab(elem);
      }
    });

    this.onEvent('click.tabs', this, (e: PointerEvent) => {
      const elem: any = e.target;
      if (elem) {
        if (elem.tagName === 'IDS-TAB') {
          if (!elem.disabled) {
            this.#selectTab(elem);
          }
        }
        if (elem.tagName === 'IDS-TRIGGER-BUTTON') {
          e.stopPropagation();
          const tab = getClosest(elem, 'ids-tab');
          this.#dismissTab(tab);
        }
      }
    });

    // Removes the tab from the list on `tabremove` events
    this.onEvent('tabremove', this, (e: CustomEvent) => {
      e.detail.elem.remove();
    });

    // Focusing via keyboard on an IdsTab doesn't automatically fire its `focus()` method.
    // This listener applies to all tabs in the list
    this.onEvent('focusin.tabs', this, (e: FocusEvent) => {
      const elem: any = e.target;
      if (elem && elem.tagName === 'IDS-TAB') {
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
      this.#correctSelectedTab();
    });
  }

  /**
   * Configures any slotted `ids-tab-more` components present
   */
  #connectMoreTabs() {
    this.querySelector('ids-tab-more')?.setAttribute('slot', 'fixed');
  }

  /**
   * Navigates from a specified Tab to the next-available Tab in the list
   * @param {HTMLElement} currentTab an contained element (usually an IdsTab) to check for siblings
   * @returns {HTMLElement} the next tab in this Tab list's order
   */
  nextTab(currentTab: HTMLElement): HTMLElement {
    let nextTab: any = currentTab.nextElementSibling;

    // If next sibling isn't a tab or is disabled, try this method again on the found sibling
    if (nextTab && (!nextTab.tagName.includes('IDS-TAB') || nextTab.tagName.includes('IDS-TAB-DIVIDER') || nextTab.disabled || nextTab.hasAttribute('overflowed'))) {
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
    if (prevTab && (!prevTab.tagName.includes('IDS-TAB') || prevTab.tagName.includes('IDS-TAB-DIVIDER') || prevTab.disabled || prevTab.hasAttribute('overflowed'))) {
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
    if (!tab) return;

    if (tab.actionable) {
      if (typeof tab.onAction === 'function') {
        tab.onAction(tab.selected);
      }
      return;
    }

    if (!tab.selected) {
      const current = this.querySelector<IdsTab>('[selected]');
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
   * Dismisses (removes) a Tab from the Tab List
   * @param {any} tab the new tab to select
   * @returns {void}
   */
  #dismissTab(tab: any): void {
    if (!tab) return;

    tab.dismiss();
    this.#correctSelectedTab();
  }

  /**
   * Detects if a Tab no longer exists and selects an available one
   */
  #correctSelectedTab(): void {
    if (!this.hasTab(this.value)) {
      this.#selectTab(this.lastNavigableTab || this.lastTab);
    }
  }

  /**
   * Attempts to refresh state of the Tab List related to overflowed tabs, if applicable
   */
  #refreshOverflowedTabs(): void {
    const moreTab = this.querySelector<IdsTabMore>('ids-tab-more');
    if (moreTab) {
      moreTab.renderOverflowedItems();
      moreTab.refreshOverflowedItems();
      this.container?.classList[!moreTab.hidden ? 'add' : 'remove']('has-more-actions');
    }
  }

  /**
   * Listen for changes to color variant, which updates each child tab.
   * @returns {void}
   */
  onColorVariantRefresh(): void {
    const tabs = [...this.querySelectorAll<IdsTab | IdsTabMore>('ids-tab, ids-tab-more')];
    tabs.forEach((tab) => {
      tab.colorVariant = this.colorVariant;
    });
  }

  /**
   * Listen for changes to orientation, which updates each child tab.
   * @returns {void}
   */
  onOrientationRefresh(): void {
    const tabs = [...this.querySelectorAll<IdsTab | IdsTabMore>('ids-tab, ids-tab-more')];
    tabs.forEach((tab) => {
      tab.orientation = this.orientation;
    });
    this.#resize();
  }
}

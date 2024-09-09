import { customElement, scss } from '../../core/ids-decorators';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';
import IdsModuleNavTextDisplayMixin from './ids-module-nav-text-display-mixin';
import IdsDrawer from '../ids-drawer/ids-drawer';
import IdsLocale from '../ids-locale/ids-locale';
import { checkItemOverflow } from './ids-module-nav-common';

import '../ids-accordion/ids-accordion';
import '../ids-button/ids-button';
import '../ids-empty-message/ids-empty-message';
import '../ids-icon/ids-icon';
import '../ids-separator/ids-separator';
import '../ids-toolbar/ids-toolbar';
import '../ids-tooltip/ids-tooltip';

import { attributes } from '../../core/ids-attributes';
import { setBooleanAttr } from '../../utils/ids-attribute-utils/ids-attribute-utils';
import { getClosest, toggleScrollbar } from '../../utils/ids-dom-utils/ids-dom-utils';
import { cssTransitionTimeout } from '../../utils/ids-timer-utils/ids-timer-utils';

import styles from './ids-module-nav-bar.scss';

import type IdsAccordion from '../ids-accordion/ids-accordion';
import type IdsButton from '../ids-button/ids-button';
import type IdsSearchField from '../ids-search-field/ids-search-field';
import type IdsModuleNav from './ids-module-nav';
import type IdsModuleNavButton from './ids-module-nav-button';
import type IdsModuleNavContent from './ids-module-nav-content';
import type IdsModuleNavItem from './ids-module-nav-item';
import type IdsModuleNavSettings from './ids-module-nav-settings';
import type IdsModuleNavSwitcher from './ids-module-nav-switcher';
import type IdsModuleNavUser from './ids-module-nav-user';
import type IdsTooltip from '../ids-tooltip/ids-tooltip';

const CONTAINER_OPEN_CLASS = 'module-nav-is-open';

const Base = IdsModuleNavDisplayModeMixin(
  IdsModuleNavTextDisplayMixin(
    IdsLocaleMixin(
      IdsKeyboardMixin(
        IdsDrawer
      )
    )
  )
);

type IdsModuleNavTooltipTarget = IdsModuleNavItem | IdsModuleNavButton | IdsModuleNavSettings | IdsModuleNavUser;

/**
 * IDS Module Nav Bar Component
 * @type {IdsModuleNavBar}
 * @inherits IdsDrawer
 * @mixes IdsKeyboardMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsModuleNavTextDisplayMixin
 * @mixes IdsModuleNavDisplayModeMixin
 */
@customElement('ids-module-nav-bar')
@scss(styles)
export default class IdsModuleNavBar extends Base {
  accordionPaneSetting: boolean;

  globalKeydownListener?: (e: KeyboardEvent) => void;

  ro?: ResizeObserver;

  #mo?: MutationObserver;

  constructor() {
    super();
    this.accordionPaneSetting = false;
    this.onOutsideClick = () => {};
  }

  connectedCallback() {
    super.connectedCallback();

    this.edge = 'start';
    this.type = 'module-nav';
    this.visible = true;

    this.#connectSearchField();
    this.#connectAccordion();
    this.#connectTooltip();
    this.#refreshVariants();
    this.setResize();
    this.setScrollable();
    this.#attachEventHandlers();
    this.#observeMutations();
    this.#toggleSeparator();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this.#detachEventHandlers();
    this.#clearContainer();
    this.#disconnectMutationObserver();
  }

  /**
   * Define the observer to detect changes
   * @returns {void}
   */
  #observeMutations() {
    this.#mo = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && this.accordion) {
          this.#applyDisplayModeToItems();
        }
      }
    });

    if (this.accordion) {
      this.#mo.observe(this.accordion, { childList: true, subtree: true });
    }
  }

  // Disconnect the observer
  #disconnectMutationObserver() {
    if (this.#mo) {
      this.#mo.disconnect();
    }
  }

  // Apply display mode to all items
  #applyDisplayModeToItems() {
    this.items?.forEach((item) => {
      if (item.textNode) item.displayMode = this.displayMode;
    });
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes as an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.FILTERABLE,
      attributes.PINNED
    ];
  }

  // Slots:
  // - Role Switcher (IdsModuleNavSwitcher)
  // - Search (IdsSearchField)
  // - Main (IdsAccordionSection)
  // - Footer (IdsAccordionSection)
  // - Settings (IdsModuleNavSettings)
  // - Detail (any)
  template() {
    return `<div class="ids-drawer ids-module-nav-bar type-module-nav">
      <div class="ids-module-nav-bar-main">
        <div class="ids-module-nav-switcher-wrapper">
          <slot name="role-switcher"></slot>
        </div>
        <div class="ids-module-nav-search-wrapper">
          <slot name="search"></slot>
        </div>
        <div class="ids-module-nav-search-no-results">
          <ids-empty-message icon="empty-search-data-new">
            <ids-text font-size="20" label="true" slot="description">No results found</ids-text>
          </ids-empty-message>
        </div>
        <div class="ids-module-nav-main">
          <slot></slot>
        </div>
        <ids-separator class="ids-module-nav-separator" color-variant="module-nav"></ids-separator>
        <div class="ids-module-nav-footer">
          <slot name="footer"></slot>
        </div>
        <div class="ids-module-nav-settings-wrapper">
          <slot name="settings"></slot>
        </div>
        <ids-separator class="ids-module-nav-user-separator" color-variant="module-nav" no-margins></ids-separator>
        <div class="ids-module-nav-user-wrapper">
          <slot name="user"></slot>
        </div>
      </div>
      <div class="ids-module-nav-bar-detail">
        <slot name="detail"></slot>
      </div>
    </div>`;
  }

  /**
   * @readonly
   * @returns {IdsModuleNav | undefined} reference to the Module Nav parent element
   */
  get parent(): IdsModuleNav | undefined {
    const parentEl = getClosest(this, 'ids-module-nav');
    if (parentEl) return (parentEl as IdsModuleNav);
    return undefined;
  }

  /**
   * @readonly
   * @returns {IdsModuleNavContent | undefined} reference to the content pane
   */
  get content() {
    const nextEl = this.nextElementSibling;
    if (nextEl?.tagName === 'IDS-MODULE-NAV-CONTENT') {
      return (nextEl as IdsModuleNavContent);
    }
    return undefined;
  }

  /**
   * @readonly
   * @returns {HTMLElement} container element for the slotted accordion
   */
  get mainEl() {
    return this.container?.querySelector<HTMLElement>('.ids-module-nav-main');
  }

  /**
   * @readonly
   * @returns {IdsAccordion} reference to an optionally-slotted IdsAccordion element
   */
  get accordion(): IdsAccordion | null {
    return this.querySelector<IdsAccordion>(`ids-accordion`);
  }

  /**
   * @readonly
   * @returns {Array<IdsModuleNavItem>} list of all IdsModuleNavItem components
   */
  get items(): Array<IdsModuleNavItem> {
    return [...this.querySelectorAll<IdsModuleNavItem>('ids-module-nav-item')];
  }

  /**
   * @readonly
   * @returns {IdsSearchField} reference to an optionally-slotted IdsSearchField element
   */
  get searchFieldEl(): IdsSearchField | null {
    return this.querySelector<IdsSearchField>('ids-search-field');
  }

  /**
   * @readonly
   * @returns {IdsModuleNavSettings} reference to an optionally-slotted IdsModuleNavSettings element
   */
  get settingsEl(): IdsModuleNavSettings | null {
    return this.querySelector('ids-module-nav-settings');
  }

  /**
   * @readonly
   * @returns {IdsModuleNavSwitcher} reference to an optionally-slotted IdsModuleNavSwitcher element
   */
  get switcherEl(): IdsModuleNavSwitcher | null {
    return this.querySelector('ids-module-nav-switcher');
  }

  /**
   * @readonly
   * @returns {IdsModuleNavUser} reference to an optionally-slotted IdsModuleNavUser element
   */
  get userEl(): IdsModuleNavUser | null {
    return this.querySelector<IdsModuleNavUser>('ids-module-nav-user');
  }

  /**
   * @readonly
   * @returns {IdsTooltip | null} reference to an internal IdsTooltip
   */
  get tooltipEl(): IdsTooltip | null {
    return this.querySelector<IdsTooltip>('ids-tooltip');
  }

  /**
   * @readonly
   * @property {boolean} isFiltered true if the inner navigation accordion is currently being filtered
   */
  isFiltered = false;

  set filterable(val: boolean) {
    setBooleanAttr(attributes.FILTERABLE, this, val);
    if (!val) this.searchFieldEl?.clear();
  }

  get filterable(): boolean {
    return this.hasAttribute(attributes.FILTERABLE);
  }

  set pinned(val: boolean) {
    setBooleanAttr(attributes.PINNED, this, val);
    this.setScrollable();
    this.setResize();
  }

  get pinned(): boolean {
    return this.hasAttribute(attributes.PINNED);
  }

  #refreshVariants() {
    const accordions = [...this.querySelectorAll<IdsAccordion>('ids-accordion')];
    accordions.forEach((acc) => {
      acc.colorVariant = 'module-nav';
    });

    const settingsEl = this.settingsEl;
    if (settingsEl) settingsEl.colorVariant = 'module-nav';

    const btns = [...this.querySelectorAll<IdsButton>('ids-button')];
    btns.forEach((btn) => {
      btn.colorVariant = 'alternate';
    });
  }

  #attachEventHandlers() {
    this.#detachEventHandlers();
    this.onEvent('show.module-nav-show', this, (e) => {
      if (e.target.tagName === 'IDS-MODULE-NAV-BAR') {
        if (this.parent) {
          this.parent?.classList.add(CONTAINER_OPEN_CLASS);
          if (!this.displayMode) this.displayMode = 'collapsed';
        }
      }
    });
    this.onEvent('hide.module-nav-hide', this, (e) => {
      if (e.target.tagName === 'IDS-MODULE-NAV-BAR') {
        if (this.parent) {
          this.parent?.classList.remove(CONTAINER_OPEN_CLASS);
          if (this.displayMode) this.displayMode = false;
        }
      }
    });

    // Listen for accordion panes attempting to expand
    // and stop them while in Module Nav Collapsed Mode
    this.onEvent('beforeexpanded.accordion', this, (e) => {
      const canExpand = this.displayMode === 'expanded';
      return e.detail.response(canExpand);
    });

    // Listen to search field for `cleared` events,
    // which cause the accordion to reset
    this.onEvent('cleared.search', this.searchFieldEl, () => {
      this.accordion?.collapseAll();
    });

    // Listen for hover on key internal elements,
    // in order to re-attach the internal Module Nav tooltip where needed
    this.onEvent('mouseover.tooltip', this, (e: CustomEvent) => {
      this.setTooltipTarget(e.target as IdsModuleNavTooltipTarget);
    });

    // Conditionally veto the tooltip's visibility based on
    // Module Nav Display Mode and each item's text overflow
    this.onEvent('beforeshow.tooltip', this.tooltipEl, (e: CustomEvent) => {
      let allowed = true;
      if (!this.displayMode) allowed = false;
      if (this.displayMode === 'expanded') {
        const target = this.tooltipEl?.popup?.alignTarget;
        if (!target || target.tagName === 'IDS-MODULE-NAV-BUTTON') allowed = false;
        else {
          allowed = checkItemOverflow((target as IdsModuleNavItem)!.textNode);
        }
      }
      e.detail.response(allowed);
    });

    // Check the footer slot for content and conditionally render the separator
    const footerSlot = this.container?.querySelector('slot[name="footer"]') as HTMLSlotElement;
    this.offEvent('slotchange.module-nav-footer');
    this.onEvent('slotchange.module-nav-footer', footerSlot, () => {
      this.#toggleSeparator();
    });
  }

  #detachEventHandlers() {
    this.offEvent('show.module-nav-show');
    this.offEvent('hide.module-nav-hide');
    this.offEvent('beforeexpanded.accordion');
    this.offEvent('cleared.search');
    this.offEvent('mouseover.tooltip');
    this.offEvent('beforeshow.tooltip');
    this.offEvent('slotchange.module-nav-footer');
  }

  #clearContainer() {
    this.parent?.classList.remove(CONTAINER_OPEN_CLASS);
  }

  /**
   * Attaches a slotted IdsSearchField component to the Module Nav
   */
  #connectSearchField() {
    const searchfield = this.searchFieldEl;
    if (searchfield) {
      searchfield.colorVariant = 'module-nav';
      searchfield.onSearch = (value: string) => {
        if (value !== '') {
          const filterResult = this.filterAccordion(value);
          if (!filterResult.length) {
            this.renderNoFilterResults();
          }
          return filterResult;
        }

        this.clearFilterAccordion();
        return [];
      };
      this.offEvent('cleared.search');
      this.onEvent('cleared.search', searchfield, () => this.clearFilterAccordion());
    }
  }

  /**
   * Attaches a slotted IdsAccordion component to the Module Nav
   */
  #connectAccordion() {
    const accordion = this.accordion;
    if (accordion) {
      accordion.colorVariant = 'module-nav';
      this.accordionPaneSetting = accordion.allowOnePane;
    }
  }

  /**
   * Attaches a slotted IdsTooltip component to the Module Nav
   */
  #connectTooltip() {
    const tooltip = this.tooltipEl;
    const locale = this.localeAPI;

    if (!tooltip) {
      this.insertAdjacentHTML('beforeend', `<ids-tooltip
        id="module-nav-tooltip"
        placement="${locale.isRTL() ? 'left' : 'right'}"></ids-tooltip>`);
    }
  }

  /**
   * Inherited from Module Nav Display Mode Mixin.
   * @param {string | false} currentValue current display mode value being changed
   * @param {string | false} newValue new display mode value to be set
   * @returns {void}
   */
  onDisplayModeChange(currentValue: string | false, newValue: string | false): void {
    this.searchFieldEl?.clear();

    if (this.content) this.content.displayMode = this.displayMode;

    if (this.switcherEl) this.switcherEl.displayMode = this.displayMode;

    if (this.accordion) {
      if (newValue !== 'expanded') this.accordion.collapseAll();
      this.#applyDisplayModeToItems();
    }

    if (this.settingsEl) this.settingsEl.displayMode = this.displayMode;

    if (this.userEl) this.userEl.displayMode = this.displayMode;

    this.setOutsideClick();
    this.setScrollable();
    this.setResize();
  }

  /**
   * Inherited from IdsModuleNavTextDisplayMixin
   * @param {string} val text display type
   */
  onTextDisplayChange(val: string) {
    if (!this.accordion) return;
    this.accordion.headers.forEach((header: any) => {
      header.textDisplay = val;
    });
    if (this.settingsEl) this.settingsEl.textDisplay = val;
    if (this.userEl) this.userEl.textDisplay = val;
  }

  /**
   * Performs a filter operation on accordion panels
   * @param {string} value text value with which to filter accordion panels
   * @returns {Array<HTMLElement>} containing matching accordion panels
   */
  filterAccordion = (value = '') => {
    // Do nothing if there is no accordion, or there are no accordion panels
    if (!this.accordion) {
      return [];
    }
    const panels = [...this.accordion.querySelectorAll('ids-accordion-panel')];
    if (!panels.length) {
      return [];
    }

    // Always remove previous highlight before applying a new one
    this.clearFilterAccordion();
    this.accordionPaneSetting = !!this.accordion.allowOnePane;
    this.accordion.allowOnePane = false;

    // Check each accordion panel for a match.
    // Accordion panels are shown/hidden as needed
    const valueRegex = new RegExp(value, 'gi');
    const markParentPanel = (thisPanel: any) => {
      if (thisPanel.hasParentPanel) {
        const parentPanel = thisPanel.parentElement;
        const parentHeader = parentPanel.header;

        if (!parentPanel.expanded) {
          parentPanel.expanded = true;
        }

        parentHeader.childFilterMatch = true;
        markParentPanel(parentPanel);
      }
    };

    return panels.filter((panel: any) => {
      const header = panel.header;
      const textContent = header.textContent.trim();
      const hasTextMatch = textContent.match(valueRegex);
      if (hasTextMatch) {
        // Highlight
        // NOTE: Apply text highlighter here (See #494)
        if (header.hiddenByFilter) {
          header.hiddenByFilter = false;
        }
        markParentPanel(panel);
        this.isFiltered = true;
        return header;
      }

      // Unhighlight
      if (!header.hiddenByFilter) {
        header.hiddenByFilter = true;
      }
    });
  };

  /**
   * @returns {HTMLElement} reference to shadow root element containing an empty state icon
   */
  get emptyIconContainerEl() {
    return this.container?.querySelector('.ids-module-nav-search-no-results');
  }

  renderNoFilterResults() {
    const iconContainer = this.emptyIconContainerEl;
    iconContainer?.classList.add('visible');
    const mainEl = this.mainEl;
    mainEl?.setAttribute(attributes.HIDDEN, '');
  }

  /**
   * Clears a navigation accordion's previous filter result
   * @private
   */
  clearFilterAccordion() {
    const filteredHeaders: any = [...this.accordion?.querySelectorAll('[hidden-by-filter]') ?? []];
    filteredHeaders.map((header: any) => {
      header.hiddenByFilter = false;
      return header;
    });

    const iconContainer = this.emptyIconContainerEl;
    iconContainer?.classList.remove('visible');
    const mainEl = this.mainEl;
    mainEl?.removeAttribute(attributes.HIDDEN);

    // NOTE: Clear text highlighter here (See #494)
    this.#clearChildFilter();
    this.isFiltered = false;
    if (this.accordion) this.accordion.allowOnePane = this.accordionPaneSetting;
  }

  /**
   * Resets the "child-filter-match" attribute on any accordion headers who's children matched a previous filter result
   * @returns {void}
   */
  #clearChildFilter() {
    const childFilterMatches: any = [...this.accordion?.querySelectorAll('[child-filter-match]') ?? []];
    childFilterMatches.map((header: any) => {
      header.childFilterMatch = false;
      return header;
    });
  }

  /**
   * Overrides `addOpenEvents` from IdsPopupOpenEventsMixin to add a global handler
   * for App Menu keyboard events that can cause the menu to close
   */
  addOpenEvents() {
    super.addOpenEvents();

    this.globalKeydownListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        this.hide();
      }
    };
    document.addEventListener('keydown', this.globalKeydownListener);
  }

  /**
   * Overrides `removeOpenEvents` from IdsPopupOpenEventsMixin
   */
  removeOpenEvents() {
    super.removeOpenEvents();
    if (this.globalKeydownListener) document.removeEventListener('keydown', this.globalKeydownListener);
  }

  private setResize() {
    if (typeof ResizeObserver === 'undefined') return;

    this.ro?.disconnect();

    if (!this.ro) {
      this.ro = new ResizeObserver(() => {
        this.setScrollable();
      });
    }

    if (!this.pinned) {
      this.ro.observe(this);
    } else if (this.accordion) {
      this.ro.observe(this.accordion);
    }
  }

  /**
   * Detects if the main accordion element is scrolled (not "optionally-pinned" mode)
   * Toggles a class on/off based on ability to scroll.
   * @returns {void}
   */
  private setScrollable() {
    if (!this.pinned) {
      this.setAccordionScrollable(false);
      this.setBarScrollable();
    } else {
      this.setBarScrollable(false);
      this.setAccordionScrollable();
    }
  }

  /**
   * @private
   * @param {boolean|undefined} [doToggle] if defined, dictates which direction to force toggle (false for off, true for on)
   */
  private setBarScrollable(doToggle?: boolean) {
    const el = this.container;
    if (el) toggleScrollbar(el, undefined, doToggle);
  }

  /**
   * @private
   * @param {boolean|undefined} [doToggle] if defined, dictates which direction to force toggle (false for off, true for on)
   */
  private setAccordionScrollable(doToggle?: boolean) {
    if (!this.accordion) return;

    let sectionHasScrollbar = false;

    const container = this.accordion.container;
    if (container) {
      const didToggle = toggleScrollbar(container, undefined, doToggle);
      if (didToggle) sectionHasScrollbar = true;
    }

    this.container?.classList[sectionHasScrollbar ? 'add' : 'remove']('has-section-scrollbars');
  }

  /**
   * Swaps the element on which the built-in IdsTooltip is attached.
   * @private
   * @param {IdsModuleNavTooltipTarget} target the element receiving the tooltip
   */
  private setTooltipTarget(target: IdsModuleNavTooltipTarget) {
    const allowedElems = [
      'IDS-MODULE-NAV-BUTTON',
      'IDS-MODULE-NAV-ITEM',
      'IDS-MODULE-NAV-SETTINGS',
      'IDS-MODULE-NAV-USER'
    ];
    if (allowedElems.includes(target.tagName)) {
      const id = target.getAttribute('id');
      const text = target.textContent?.trim() || '';

      if (this.tooltipEl) {
        this.tooltipEl.setAttribute(attributes.TARGET, `#${id}`);
        this.tooltipEl.popup?.setAttribute(attributes.ARROW_TARGET, `#${id}`);
        this.tooltipEl.innerHTML = `<span class="ids-module-nav-tooltip-text">${text}</span>`;
      }
    }
  }

  private setOutsideClick() {
    if (this.displayMode === 'expanded') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.establishOutsideClick();
    } else {
      this.removeOutsideClick();
    }
  }

  private async establishOutsideClick() {
    await cssTransitionTimeout(10);
    this.onOutsideClick = (e: MouseEvent) => {
      if (!this.contains(e.target as Node)) {
        this.parent!.handleOutsideClick();
      }
    };
  }

  private removeOutsideClick() {
    this.onOutsideClick = () => {};
  }

  onLanguageChange = (locale?: IdsLocale | undefined) => {
    const rtl = locale?.isRTL() || false;
    const attr = rtl ? 'left' : 'right';
    const popup = this.tooltipEl?.popup;

    this.tooltipEl?.setAttribute(attributes.PLACEMENT, attr);
    if (popup) {
      popup.useRight = rtl;
      popup.setAttribute(attributes.ALIGN, attr);
    }
  };

  /**
   * Toggle the separator based on the footer slot content
   * @returns {void}
   */
  #toggleSeparator() {
    const footerSlot = this.container?.querySelector('slot[name="footer"]') as HTMLSlotElement;
    const footerContent = footerSlot?.assignedElements()?.length > 0;
    const separator = this.container?.querySelector('.ids-module-nav-separator');

    if (footerContent && !separator) {
      const separatorElement = document.createElement('ids-separator');
      separatorElement.classList.add('ids-module-nav-separator');
      separatorElement.setAttribute('color-variant', 'module-nav');
      footerSlot?.insertAdjacentElement('beforebegin', separatorElement);
    } else if (!footerContent && separator) {
      separator?.remove();
    }
  }
}

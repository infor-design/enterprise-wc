import { customElement, scss } from '../../core/ids-decorators';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';
import IdsDrawer from '../ids-drawer/ids-drawer';

import '../ids-accordion/ids-accordion';
import '../ids-button/ids-button';
import '../ids-icon/ids-icon';
import '../ids-text/ids-text';
import '../ids-toolbar/ids-toolbar';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

import styles from './ids-module-nav.scss';

import type IdsAccordion from '../ids-accordion/ids-accordion';
import type IdsButton from '../ids-button/ids-button';
import type IdsSearchField from '../ids-search-field/ids-search-field';
import type IdsContainer from '../ids-container/ids-container';

const CONTAINER_CLASS = 'module-nav';
const CONTAINER_OPEN_CLASS = 'module-nav-is-open';

const Base = IdsModuleNavDisplayModeMixin(
  IdsKeyboardMixin(
    IdsDrawer
  )
);

/**
 * IDS Module Nav Component
 * @type {IdsModuleNav}
 * @inherits IdsDrawer
 */
@customElement('ids-module-nav')
@scss(styles)
export default class IdsModuleNav extends Base {
  globalKeydownListener?: (e: KeyboardEvent) => void;

  constructor() {
    super();
  }

  #container: IdsContainer | undefined | null;

  connectedCallback() {
    super.connectedCallback();
    this.edge = 'start';
    this.type = 'module-nav';
    this.#connectSearchField();
    this.#refreshVariants();
    this.#setContainer();
    this.#attachEventHandlers();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this.#detachEventHandlers();
    this.#clearContainer();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes as an array
   */
  static get attributes() {
    return [
      ...super.attributes
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
    return `<div class="ids-drawer ids-module-nav type-module-nav">
      <div class="ids-module-nav-bar">
        <div class="ids-module-nav-switcher-wrapper">
          <slot name="role-switcher"></slot>
        </div>
        <div class="ids-module-nav-search-wrapper">
          <slot name="search"></slot>
        </div>
        <div class="ids-module-nav-main">
          <slot></slot>
        </div>
        <div class="ids-module-nav-footer">
          <slot name="footer"></slot>
        </div>
        <div class="ids-module-nav-settings-wrapper">
          <slot name="settings"></slot>
        </div>
      </div>
      <div class="ids-module-nav-detail">
        <slot name="detail"></slot>
      </div>
    </div>`;
  }

  /**
   * @readonly
   * @returns {IdsAccordion} reference to an optionally-slotted IdsAccordion element
   */
  get accordion(): IdsAccordion | null {
    return this.querySelector<IdsAccordion>(`ids-accordion:not([slot])`);
  }

  /**
   * @readonly
   * @property {boolean} isFiltered true if the inner navigation accordion is currently being filtered
   */
  isFiltered = false;

  #refreshVariants() {
    const accordions = [...this.querySelectorAll<IdsAccordion>('ids-accordion')];
    accordions.forEach((acc) => {
      acc.colorVariant = 'app-menu';
    });

    const btns = [...this.querySelectorAll<IdsButton>('ids-button')];
    btns.forEach((btn) => {
      btn.colorVariant = 'alternate';
    });
  }

  #attachEventHandlers() {
    this.#detachEventHandlers();
    this.onEvent('show.module-nav-show', this, () => {
      this.#container?.classList.add(CONTAINER_OPEN_CLASS);
    });
    this.onEvent('hide.module-nav-hide', this, () => {
      this.#container?.classList.remove(CONTAINER_OPEN_CLASS);
    });
  }

  #detachEventHandlers() {
    this.offEvent('show.module-nav-show');
    this.offEvent('hide.module-nav-hide');
  }

  /**
   * Adds CSS class to ids-container for initial CSS rules
   */
  #setContainer() {
    this.#container = getClosest(this, 'ids-container');
    this.#container?.classList.add(CONTAINER_CLASS);
  }

  #clearContainer() {
    this.#container?.classList.remove(CONTAINER_CLASS, CONTAINER_OPEN_CLASS);
    this.#container = null;
  }

  /**
   * Attaches a slotted IdsSearchField component to the app menu
   */
  #connectSearchField() {
    const searchfield = this.querySelector<IdsSearchField>('ids-search-field[slot="search"]');
    if (searchfield) {
      searchfield.onSearch = (value: string) => {
        if (value !== '') {
          return this.filterAccordion(value);
        }

        this.clearFilterAccordion();
        return [];
      };
      this.offEvent('cleared.search');
      this.onEvent('cleared.search', searchfield, () => this.clearFilterAccordion());
    }
  }

  /**
   * Inherited from the Popup Open Events Mixin.
   * Runs when a click event is propagated to the window.
   * @returns {void}
   */
  onOutsideClick() {
    // Don't close the popup if md+ media query breakpoint
    if (window.innerWidth < 840) {
      this.hide();
    }
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
   * Clears a navigation accordion's previous filter result
   * @private
   */
  clearFilterAccordion() {
    const filteredHeaders: any = [...this.accordion?.querySelectorAll('ids-accordion-header[hidden-by-filter]') ?? []];
    filteredHeaders.map((header: any) => {
      header.hiddenByFilter = false;
      return header;
    });

    // NOTE: Clear text highlighter here (See #494)
    this.#clearChildFilter();
    this.isFiltered = false;
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
}

import { customElement, scss } from '../../core/ids-decorators';

import Base from './ids-app-base';
import IdsDrawer from '../ids-drawer/ids-drawer';
import IdsAccordion from '../ids-accordion/ids-accordion';
import IdsButton from '../ids-button/ids-button';
import IdsIcon from '../ids-icon/ids-icon';
import IdsText from '../ids-text/ids-text';
import IdsToolbar from '../ids-toolbar/ids-toolbar';

import styles from './ids-app-menu.scss';

/**
 * IDS App Menu Component
 * @type {IdsAppMenu}
 * @inherits IdsDrawer
 * @part avatar - the user avatar
 * @part accordion - the accordion root element
 */
@customElement('ids-app-menu')
@scss(styles)
export default class IdsAppMenu extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.edge = 'start';
    this.type = 'app-menu';
    this.#connectSearchField();
    this.#refreshVariants();
  }

  static get attributes() {
    return [...super.attributes];
  }

  // Slots:
  // - Avatar
  // - Roles (Accordion)
  // - Header Nav (Toolbar)
  // - Searchfield
  // - Content (Accordion)
  // - Footer Nav (Toolbar)
  template() {
    return `<div class="ids-drawer ids-app-menu type-app-menu">
      <div class="ids-app-menu-user">
        <slot name="avatar"></slot>
        <slot name="username"></slot>
      </div>
      <div class="ids-app-menu-header">
        <slot name="header"></slot>
      </div>
      <div class="ids-app-menu-search">
        <slot name="search"></slot>
      </div>
      <div class="ids-app-menu-content">
        <slot></slot>
      </div>
      <div class="ids-app-menu-footer">
        <slot name="footer"></slot>
      </div>
      <div class="ids-app-menu-branding">
        <ids-icon icon="logo" viewbox="0 0 35 34" size="large"></ids-icon>
      </div>
    </div>`;
  }

  /**
   * @readonly
   * @returns {IdsAccordion} reference to an optionally-slotted IdsAccordion element
   */
  get accordion() {
    return this.querySelector(`ids-accordion:not([slot])`);
  }

  /**
   * @readonly
   * @property {boolean} isFiltered true if the inner navigation accordion is currently being filtered
   */
  isFiltered = false;

  #refreshVariants() {
    const accordions = [...this.querySelectorAll('ids-accordion')];
    accordions.forEach((acc) => {
      acc.colorVariant = 'app-menu';
    });

    const btns = [...this.querySelectorAll('ids-button')];
    btns.forEach((btn) => {
      btn.colorVariant = 'alternate';
    });
  }

  /**
   * Attaches a slotted IdsSearchField component to the app menu
   */
  #connectSearchField() {
    const searchfield = this.querySelector('ids-search-field[slot="search"]');
    if (searchfield) {
      searchfield.onSearch = (value) => {
        if (value !== '') {
          return this.filterAccordion(value);
        }

        this.clearFilterAccordion();
        return [];
      };
    }
  }

  /**
   * Performs a filter operation on accordion panels
   * @param {string} value text value with which to filter accordion panels
   * @returns {Array<HTMLElement>} containing matching accordion panels
   */
  filterAccordion = (value = '') => {
    // Do nothing if there is no accordion, or there are no accordion panels
    let filteredPanels = [];
    if (!this.accordion) {
      return filteredPanels;
    }

    const panels = [...this.accordion.querySelectorAll('ids-accordion-panel')];
    if (!panels.length) {
      return filteredPanels;
    }

    // NOTE: Clear text highlight here (See #494)

    // Always remove previous highlight before applying a new one
    this.clearFilterAccordion();

    // Check each accordion panel for a match.
    // Accordion panels are shown/hidden as needed
    const valueRegex = new RegExp(value, 'gi');
    const markParentPanel = (thisPanel) => {
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
    filteredPanels = panels.filter((panel) => {
      const header = panel.header;
      const textContent = header.textContent.trim();
      const hasTextMatch = textContent.match(valueRegex);
      if (hasTextMatch) {
        // Highlight
        if (header.hiddenByFilter) {
          header.hiddenByFilter = false;
        }
        markParentPanel(panel);
        return header;
      }

      // Unhighlight
      if (!header.hiddenByFilter) {
        header.hiddenByFilter = true;
      }
    });

    // Highlight the matching text inside any matched headers
    this.isFiltered = filteredPanels.length > 0;

    // NOTE: Apply text highlighter here (See #494)

    return filteredPanels;
  };

  /**
   * Clears a navigation accordion's previous filter result
   * @private
   * @returns {void}
   */
  clearFilterAccordion() {
    const filteredHeaders = [...this.accordion.querySelectorAll('ids-accordion-header[hidden-by-filter]')];
    filteredHeaders.map((header) => {
      header.hiddenByFilter = false;
      return header;
    });

    // NOTE: Apply text highlighter here (See #494)

    this.#clearChildFilter();
  }

  /**
   * Resets the "child-filter-match" attribute on any accordion headers who's children matched a previous filter result
   * @returns {void}
   */
  #clearChildFilter() {
    const childFilterMatches = [...this.accordion.querySelectorAll('[child-filter-match]')];
    childFilterMatches.map((header) => {
      header.childFilterMatch = false;
      return header;
    });
  }

  /**
   * Overrides `addOpenEvents` from IdsPopupOpenEventsMixin to add a global handler
   * for App Menu keyboard events that can cause the menu to close
   * @returns {void}
   */
  addOpenEvents() {
    super.addOpenEvents();

    this.globalKeydownListener = (e) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        this.hide();
      }
    };
    document.addEventListener('keydown', this.globalKeydownListener);
  }

  /**
   * Overrides `removeOpenEvents` from IdsPopupOpenEventsMixin
   * @returns {void}
   */
  removeOpenEvents() {
    super.removeOpenEvents();
    document.removeEventListener('keydown', this.globalKeydownListener);
  }
}

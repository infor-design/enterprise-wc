import { customElement, scss } from '../../core/ids-decorators';
import { Mark, IdsHighlightUtil } from '../../utils/ids-highlight-utils/ids-highlight-utils';

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
    this.#refreshVariants();
    this.#connectSearchField();
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

  get accordion() {
    return this.querySelector(`ids-accordion:not([slot])`);
  }

  /**
   * Stores a reference to a `Mark.js` api targeted at the accordion
   */
  filterMarker = null;

  /**
   *
   */
  isMarked = false;

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

  #connectSearchField() {
    const searchfield = this.querySelector('ids-search-field[slot="search"]');
    if (searchfield) {
      searchfield.onSearch = (value) => {
        if (value !== '') {
          this.#filterAccordion(value);
        } else {
          this.#clearFilterAccordion();
        }
      };
    }
  }

  #filterAccordion = (value = '') => {
    const valueRegex = new RegExp(value, 'gi');
    const headers = [...this.accordion.querySelectorAll('ids-accordion-header')];
    let filteredHeaders = [];

    if (!this.filterMarker) {
      this.filterMarker = new IdsHighlightUtil(this.accordion);
    }

    if (!headers.length) {
      return filteredHeaders;
    }

    // Always remove previous highlight before applying a new one
    this.filterMarker.reset();

    // Check each accordion header for a match
    filteredHeaders = headers.map((header) => {
      const textContent = header.textContent.trim();
      const hasTextMatch = textContent.match(valueRegex);
      if (hasTextMatch) {
        // Highlight
        header.hiddenByFilter = true;
        filteredHeaders.push(header);
        return header;
      }

      // Unhighlight
      if (header.hiddenByFilter) {
        header.hiddenByFilter = false;
      }
      return undefined;
    });

    // Highlight any matched headers
    if (filteredHeaders.length) {
      this.isMarked = true;
      this.filterMarker.mark(value);
    } else {
      this.isMarked = false;
    }

    return filteredHeaders;
  }

  #clearFilterAccordion() {
    const filteredHeaders = [...this.accordion.querySelectorAll('ids-accordion-header[hidden-by-filter]')];
    filteredHeaders.map((header) => {
      header.hiddenByFilter = false;
      this.filterMarker.reset();
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

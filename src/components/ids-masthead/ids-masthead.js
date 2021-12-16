import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

import { IdsStringUtils } from '../../utils';
import { IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin } from '../../mixins';
import IdsHeader from '../ids-header';
import IdsToolbar from '../ids-toolbar';

import styles from './ids-masthead.scss';

/**
 * IDS Masthead Component
 * @type {IdsMasthead}
 * @inherits IdsHeader
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-masthead')
@scss(styles)
class IdsMasthead extends mix(IdsHeader).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin) {
  /**
   * @private
   * @see IdsMasthead.slots()
   */
  #cachedSlots = null;

  /**
   * @private
   * @see IdsMasthead.breakpoints()
   */
  #cachedBreakpoints = null;

  constructor() {
    super();
  }

  /**
   * Get a list of element dependencies for this component
   * @returns {object} of elements
   */
  get elements() {
    return {
      logo: this.container.querySelector('#logo-wrapper'),
      title: this.container.querySelector('#title'),
      sections: {
        start: this.container.querySelector('ids-toolbar-section#start'),
        center: this.container.querySelector('ids-toolbar-section#center'),
        end: this.container.querySelector('ids-toolbar-section#end'),
        more: this.container.querySelector('ids-toolbar-more-actions#more'),
      },
    };
  }

  /**
   * @readonly
   * @returns {object} the user-generated slots that were nested in ids-masthead
   */
  get slots() {
    this.#cachedSlots = this.#cachedSlots || {
      start: this.querySelector('[slot="start"]'),
      center: this.querySelector('[slot="center"]'),
      end: this.querySelector('[slot="end"]'),
      more: this.querySelector('[slot="more"]'),
    };
    return this.#cachedSlots;
  }

  /**
   * @readonly
   * @returns {object} window.matchMedia output for mobile, tablet and desktop
   */
  get breakpoints() {
    this.#cachedBreakpoints = this.#cachedBreakpoints || {
      // @see https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
      mobile: window.matchMedia('(max-width: 425px)'),
      tablet: window.matchMedia('(min-width: 426px) and (max-width: 768px)'),
      desktop: window.matchMedia('(min-width: 769px)'),
    };
    return this.#cachedBreakpoints;
  }

  /**
   * @readonly
   * @returns {boolean} true if the mobile breakpoint is active
   */
  get isMobile() { return this.breakpoints.mobile.matches; }

  /**
   * @readonly
   * @returns {boolean} true if the tablet breakpoint is active
   */
  get isTablet() { return this.breakpoints.tablet.matches; }

  /**
   * @readonly
   * @returns {boolean} true if the desktop breakpoint is active
   */
  get isDesktop() { return this.breakpoints.desktop.matches; }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ICON,
      attributes.TITLE,
    ];
  }

  /**
   * Sets the icon attribute
   * @param {string} value - the icon name
   * @returns {void}
   */
  set icon(value) {
    this.setAttribute(attributes.ICON, value);
    this.elements.logo.innerHTML = this.logo();
  }

  /**
   * Gets the icon attribute
   * @returns {string} value - the icon name
   */
  get icon() { return this.getAttribute(attributes.ICON) || ''; }

  /**
   * Sets the title attribute
   * @param {string} value - the masthead's title
   * @returns {void}
   */
  set title(value) {
    this.setAttribute(attributes.TITLE, value);
    this.elements.title.innerHTML = value;
  }

  /**
   * Gets the title attribute
   * @returns {string} value - the masthead's title
   */
  get title() { return this.getAttribute(attributes.TITLE) || ''; }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <ids-toolbar class="ids-masthead" tabbable="true">
        <ids-toolbar-section id="start" align="start" type="fluid">
          <span id="logo-wrapper">${this.logo()}</span>
          <ids-text id="title" color-variant="alternate" font-size="14" font-weight="bold">${this.title}</ids-text>
          <slot name="start"></slot>
        </ids-toolbar-section>

        <ids-toolbar-section id="center" align="center" type="fluid">
          <slot name="center"></slot>
        </ids-toolbar-section>

        <ids-toolbar-section id="end" align="end" type="fluid">
          <slot name="end"></slot>
        </ids-toolbar-section>

        <ids-toolbar-more-actions id="more" icon="expand-app-tray" class="hidden">
          <slot name="more"></slot>
        </ids-toolbar-more-actions>
      </ids-toolbar>
    `;
  }

  /**
   * Create the HTML template for the logo
   * @returns {string} The template
   */
  logo() {
    let icon = this.icon;

    if (icon) {
      const logoIcon = `<ids-icon slot="icon" icon="${icon}" viewbox="0 0 32 34" width="30" height="30"></ids-icon>`;
      const otherIcon = `<ids-icon slot="icon" icon="${icon}"></ids-icon>`;

      icon = `
        <ids-button id="logo" class="icon-${icon}" color-variant="alternate" square="true">
          ${icon === 'logo' ? logoIcon : otherIcon}
          <ids-text slot="text" audible="true">Masthead logo</ids-text>
        </ids-button>
      `;
    }

    return icon;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.renderBreakpoint();
    this.#restyleButtons();
    this.#attachEventHandlers();
  }

  /**
   * Attach desktop, mobile and table breakpoint listeners for masthead
   * @private
   * @returns {void}
   */
  #attachEventHandlers() {
    this.breakpoints.mobile.addEventListener('change', () => this.renderBreakpoint());
    this.breakpoints.tablet.addEventListener('change', () => this.renderBreakpoint());
    this.breakpoints.desktop.addEventListener('change', () => this.renderBreakpoint());
  }

  /**
   * Rearranges user's slots in masthead according to desktop, tablet and mobile viewports.
   *
   * @returns {void}
   */
  renderBreakpoint() {
    const { start, center, end } = this.slots;

    if (this.isDesktop) {
      this.elements.sections.more.classList.add('hidden');
      start.slot = 'start';
      center.slot = 'center';
      end.slot = 'end';
    } else if (this.isTablet) {
      this.elements.sections.more.classList.remove('hidden');
      start.slot = 'start';
      center.slot = 'more';
      end.slot = 'more';
    } else if (this.isMobile) {
      this.elements.sections.more.classList.remove('hidden');
      start.slot = 'more';
      center.slot = 'more';
      end.slot = 'more';
    }
  }

  /**
   * Helper method to give nested buttons transparent backgrounds
   * @private
   * @returns {void}
   */
  #restyleButtons() {
    const { more } = this.elements.sections;
    if (more?.menu?.container) {
      more.menu.container.type = 'menu-alt';
    }

    const buttons = [
      more?.button,
      ...this.querySelectorAll('ids-button, ids-menu-button'),
    ];

    buttons.forEach((button) => {
      if (button) {
        button.colorVariant = 'alternate';
        button.square = 'true';
        button.type = 'default';
      }
    });
  }
}

export default IdsMasthead;

import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsHeader from '../ids-header/ids-header';

import '../ids-toolbar/ids-toolbar';

import styles from './ids-masthead.scss';
import type IdsToolbarSection from '../ids-toolbar/ids-toolbar-section';
import type IdsToolbarMoreActions from '../ids-toolbar/ids-toolbar-more-actions';
import type IdsButton from '../ids-button/ids-button';
import type IdsMenuButton from '../ids-menu-button/ids-menu-button';

const Base = IdsKeyboardMixin(
  IdsEventsMixin(
    IdsHeader
  )
);

export type MastheadSlots = {
  start: HTMLElement | null;
  center: HTMLElement | null;
  end: HTMLElement | null;
  more: HTMLElement | null;
};

export type MastheadBreakpoints = {
  mobile: MediaQueryList;
  tablet: MediaQueryList;
  desktop: MediaQueryList;
};

/**
 * IDS Masthead Component
 * @type {IdsMasthead}
 * @inherits IdsHeader
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-masthead')
@scss(styles)
export default class IdsMasthead extends Base {
  /**
   * @private
   * @see IdsMasthead.slots()
   */
  #cachedSlots: MastheadSlots | null = null;

  /**
   * @private
   * @see IdsMasthead.breakpoints()
   */
  #cachedBreakpoints: MastheadBreakpoints | null = null;

  constructor() {
    super();
  }

  /**
   * Get a list of element dependencies for this component
   * @returns {object} of elements
   */
  get elements() {
    return {
      logo: this.container?.querySelector('#logo-wrapper'),
      title: this.container?.querySelector('#title'),
      sections: {
        start: this.container?.querySelector<IdsToolbarSection>('ids-toolbar-section#start'),
        center: this.container?.querySelector<IdsToolbarSection>('ids-toolbar-section#center'),
        end: this.container?.querySelector<IdsToolbarSection>('ids-toolbar-section#end'),
        more: this.container?.querySelector<IdsToolbarMoreActions>('ids-toolbar-more-actions#more'),
      },
    };
  }

  /**
   * @readonly
   * @returns {object} the user-provided slots that were nested in ids-masthead
   */
  get slots(): MastheadSlots {
    this.#cachedSlots = this.#cachedSlots || {
      start: this.querySelector<HTMLElement>('[slot="start"]'),
      center: this.querySelector<HTMLElement>('[slot="center"]'),
      end: this.querySelector<HTMLElement>('[slot="end"]'),
      more: this.querySelector<HTMLElement>('[slot="more"]'),
    };
    return this.#cachedSlots;
  }

  /**
   * @readonly
   * @returns {object} window.matchMedia output for mobile, tablet and desktop
   */
  get breakpoints(): MastheadBreakpoints {
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
  get isMobile(): boolean { return this.breakpoints.mobile.matches; }

  /**
   * @readonly
   * @returns {boolean} true if the tablet breakpoint is active
   */
  get isTablet(): boolean { return this.breakpoints.tablet.matches; }

  /**
   * @readonly
   * @returns {boolean} true if the desktop breakpoint is active
   */
  get isDesktop(): boolean { return this.breakpoints.desktop.matches; }

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
  set icon(value: string) {
    this.setAttribute(attributes.ICON, value);

    if (this.elements.logo) {
      this.elements.logo.innerHTML = this.logo();
    }
  }

  /**
   * Gets the icon attribute
   * @returns {string} value - the icon name
   */
  get icon(): string { return this.getAttribute(attributes.ICON) || ''; }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <ids-toolbar class="ids-masthead" tabbable="true">
        <ids-toolbar-section id="start" align="start" type="fluid">
          <span id="logo-wrapper">${this.logo()}</span>
          <ids-text id="title" color-variant="alternate" font-size="14" font-weight="semi-bold">${this.title}</ids-text>
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
  logo(): string {
    let icon = this.icon;

    if (icon) {
      const logoIcon = `<ids-icon icon="${icon}" viewbox="0 0 32 34" width="32" height="32"></ids-icon>`;
      const otherIcon = `<ids-icon icon="${icon}"></ids-icon>`;

      icon = `
        <ids-button id="logo" class="icon-${icon}" color-variant="alternate" square="true">
          ${icon === 'logo' ? logoIcon : otherIcon}
          <ids-text audible="true">Masthead logo</ids-text>
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
    this.#attachEventHandlers();
    this.renderBreakpoint();
  }

  /**
   * Rearranges user's slots in masthead according to desktop, tablet and mobile viewports.
   * @returns {void}
   */
  renderBreakpoint() {
    const { start, center, end } = this.slots;
    const { more } = this.elements.sections;

    if (more?.menu?.popup) {
      more.menu.popup.type = 'menu-alt';
    }

    if (this.isDesktop) {
      start?.setAttribute('slot', 'start');
      center?.setAttribute('slot', 'center');
      end?.setAttribute('slot', 'end');
      more?.classList.add('hidden');
    } else if (this.isTablet) {
      start?.setAttribute('slot', 'start');
      center?.setAttribute('slot', 'more');
      end?.setAttribute('slot', 'more');
      more?.classList.remove('hidden');
    } else if (this.isMobile) {
      start?.setAttribute('slot', 'more');
      center?.setAttribute('slot', 'more');
      end?.setAttribute('slot', 'more');
      more?.classList.remove('hidden');
    }

    this.#restyleButtons();
  }

  /**
   * Handles title attribute changes
   * @param {string} value title value
   */
  onTitleChange(value: string | null) {
    if (this.elements.title) {
      this.elements.title.innerHTML = value ?? '';
    }
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
   * Helper method to give nested buttons transparent backgrounds
   * @private
   * @returns {void}
   */
  #restyleButtons() {
    const { sections } = this.elements;

    const buttons = [
      sections.more?.button,
      ...this.querySelectorAll<IdsButton | IdsMenuButton>('ids-button, ids-menu-button'),
    ];

    buttons.forEach((button) => {
      if (button) {
        button.colorVariant = 'alternate';
        button.iconAlign = 'start';
        button.type = 'button';

        const buttonParentSlot = button.closest('[slot]');
        const buttonText = button.querySelector<HTMLElement>('span, ids-text');
        const hasAudible = buttonText?.classList.contains('audible');
        const hasAudibleOff = buttonText?.classList.contains('audible-off');

        if (hasAudible) {
          if (buttonParentSlot?.slot === 'more') {
            buttonText?.classList.remove('audible');
            buttonText?.classList.add('audible-off');
            buttonText?.style.setProperty('padding', '0 4px');
          }
        }
        if (hasAudibleOff) {
          if (buttonParentSlot?.slot !== 'more') {
            buttonText?.classList.remove('audible-off');
            buttonText?.classList.add('audible');
            buttonText?.style.setProperty('padding', '');
          }
        }
      }
    });
  }
}

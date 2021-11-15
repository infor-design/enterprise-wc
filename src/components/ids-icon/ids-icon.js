import pathData from 'ids-identity/dist/theme-new/icons/standard/path-data.json';
import emptyIconPathData from 'ids-identity/dist/theme-new/icons/empty/path-data.json';
import {
  attributes,
  customElement,
  IdsElement,
  mix,
  scss
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

// Import Mixins
import {
  IdsEventsMixin,
  IdsLocaleMixin
} from '../../mixins';

// Import Styles
import styles from './ids-icon.scss';

// Setting Defaults
const sizes = {
  xl3: 64,
  large: 24,
  xl: 34,
  normal: 18,
  medium: 18,
  small: 14,
  xsmall: 10
};

/**
 * IDS Icon Component
 * @type {IdsIcon}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 */
@customElement('ids-icon')
@scss(styles)
class IdsIcon extends mix(IdsElement).with(IdsEventsMixin, IdsLocaleMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.BADGE_COLOR,
      attributes.BADGE_POSITION,
      attributes.CUSTOM_HEIGHT,
      attributes.CUSTOM_VIEWBOX,
      attributes.CUSTOM_WIDTH,
      attributes.LANGUAGE,
      attributes.LOCALE,
      attributes.ICON,
      attributes.SIZE,
      attributes.VERTICAL
    ];
  }

  /**
   * Handle change events
   */
  #attachEventHandlers() {
    this.offEvent('languagechange.icon-container');
    this.onEvent('languagechange.icon-container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
      if (this.isFlipped(this.icon)) {
        this.container.classList.add('flipped');
      } else {
        this.container.classList.remove('flipped');
      }
    });

    this.offEvent('languagechange.icon');
    this.onEvent('languagechange.icon', this, async (e) => {
      await this.locale.setLanguage(e.detail.language.name);
      if (this.isFlipped(this.icon)) {
        this.shadowRoot.querySelector('svg').classList.add('flipped');
      } else {
        this.shadowRoot.querySelector('svg').classList.remove('flipped');
      }
    });
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    let height = '';
    let width = '';
    let viewBox = '';

    if (this.getAttribute(attributes.CUSTOM_WIDTH) && this.getAttribute(attributes.CUSTOM_HEIGHT)) {
      height = this.getAttribute(attributes.CUSTOM_HEIGHT);
      width = this.getAttribute(attributes.CUSTOM_WIDTH);
    } else {
      height = sizes[this.size];
      width = sizes[this.size];
    }

    if (this.customViewbox) {
      viewBox = this.customViewbox;
    } else {
      viewBox = '0 0 18 18';
    }
    let template = `<svg xmlns="http://www.w3.org/2000/svg"${this.isFlipped(this.icon) ? ` class="flipped"` : ''} stroke="currentColor" fill="none" height="${height}" width="${width}" viewBox="${viewBox}" aria-hidden="true">
      ${this.iconData()}
    </svg>`;
    if (this.badgePosition || this.badgeColor) {
      if (!this.badgePosition) {
        this.badgePosition = `bottom-right`;
      }
      if (!this.badgeColor) {
        this.badgeColor = `danger`;
      }
      template += `<span class="notification-badge ${this.badgePosition} ${this.badgeColor}"></span>`;
    }
    return template;
  }

  /**
   * Return the icon data for the svg based on the icon name
   * @returns {string} the path data
   */
  iconData() {
    let iconData = '';
    if (emptyIconPathData[this.icon]) {
      iconData = emptyIconPathData[this.icon];
    } else {
      iconData = pathData[this.icon];
    }
    return iconData;
  }

  /**
   * Some icons are flipped in RTL Mode
   * @param {string} iconName icon name to check
   * @returns {boolean} true if flipped / rtl
   */
  isFlipped(iconName) {
    const flippedIcons = [
      'add-grid-record',
      'add-grid-row',
      'attach',
      'bullet-list',
      'bullet-steps',
      'caret-left',
      'caret-right',
      'cart',
      'cascade',
      'change-font',
      'clear-screen',
      'clockwise-90',
      'close-cancel',
      'close-save',
      'closed-folder',
      'collapse-app-tray',
      'contacts',
      'copy-from',
      'copy-mail',
      'copy-url',
      'counter-clockwise-90',
      'create-report',
      'cut',
      'delete-grid-record',
      'delete-grid-row',
      'display',
      'document',
      'drilldown',
      'duplicate',
      'employee-directory',
      'expand-app-tray',
      'export',
      'export-2',
      'export-to-pdf',
      'first-page',
      'folder',
      'generate-key',
      'get-more-rows',
      'group-selection',
      'headphones',
      'help',
      'helper-list-select',
      'history',
      'import',
      'invoice-released',
      'key',
      'language',
      'last-page',
      'launch',
      'left-align',
      'left-arrow',
      'left-text-align',
      'logout',
      'new-document',
      'new-expense-report',
      'new-time-sheet',
      'new-travel-plan',
      'next-page',
      'no-attachment',
      'no-comment',
      'no-filter',
      'paste',
      'phone',
      'previous-page',
      'queries',
      'quick-access',
      'redo',
      'refresh',
      'refresh-current',
      'restore-user',
      'right-align',
      'right-arrow',
      'right-text-align',
      'run-quick-access',
      'save',
      'save-close',
      'save-new',
      'search',
      'search-folder',
      'search-list',
      'search-results-history',
      'select',
      'send',
      'send-submit',
      'show-last-x-days',
      'special-item',
      'stacked',
      'tack',
      'timesheet',
      'tree-collapse',
      'tree-expand',
      'undo',
      'unsubscribe',
      'update-preview',
      'zoom-100',
      'zoom-in',
      'zoom-out'
    ];

    if (this.locale.isRTL() && flippedIcons.includes(iconName)) {
      return true;
    }
    return false;
  }

  /**
   * @returns {string} the current color of the notification badge
   */
  get badgeColor() {
    return this.getAttribute(attributes.BADGE_COLOR);
  }

  /**
   * @param {string} value sets the color of the notification badge
   */
  set badgeColor(value) {
    if (value && this.getAttribute(attributes.BADGE_COLOR) !== value) {
      this.setAttribute(attributes.BADGE_COLOR, value);
      this.#updateBadge();
    } else if (!value) {
      this.setAttribute(attributes.BADGE_COLOR, '');
      this.#updateBadge();
    }
  }

  /**
   * @returns {string} position of notification badge
   */
  get badgePosition() { return this.getAttribute(attributes.BADGE_POSITION); }

  /**
   * @param {string} value sets the postion of the notification badge
   */
  set badgePosition(value) {
    if (value && this.getAttribute(attributes.BADGE_POSITION) !== value) {
      this.setAttribute(attributes.BADGE_POSITION, value);
      this.#updateBadge();
    } else if (!value) {
      this.setAttribute(attributes.BADGE_POSITION, '');
      this.#updateBadge();
    }
  }

  /**
   * Returns the custom-height attribute
   * @returns {string} a stringified height number
   */
  get customHeight() {
    return this.getAttribute(attributes.CUSTOM_HEIGHT);
  }

  /**
   * @param {string} value allows sets a custom height value for the icon svg
   */
  set customHeight(value) {
    if (value) {
      this.removeAttribute(attributes.SIZE);
      this.setAttribute(attributes.CUSTOM_HEIGHT, value);
      this.container?.setAttribute('height', value);
    } else {
      this.removeAttribute(attributes.CUSTOM_HEIGHT);
    }
  }

  /**
   * Return the custom-viewbox
   * @returns {string} the string of viewbox numbers
   */
  get customViewbox() {
    return this.getAttribute(attributes.CUSTOM_VIEWBOX);
  }

  /**
   * @param {string} value set a custom viewbox for the icon svg
   */
  set customViewbox(value) {
    if (value) {
      this.setAttribute(attributes.CUSTOM_VIEWBOX, value);
      this.#adjustViewbox();
    } else {
      this.removeAttribute(attributes.CUSTOM_VIEWBOX);
    }
  }

  /**
   * Return the custom-width number
   * @returns {string} the stringified custom width number
   */
  get customWidth() {
    return this.getAttribute(attributes.CUSTOM_WIDTH);
  }

  /**
   * @param {string} value sets a custom width for the icon svg
   */
  set customWidth(value) {
    if (value) {
      this.removeAttribute(attributes.SIZE);
      this.setAttribute(attributes.CUSTOM_WIDTH, value);
      this.container?.setAttribute('width', value);
    } else {
      this.removeAttribute(attributes.CUSTOM_WIDTH);
    }
  }

  /**
   * Return the icon name
   * @returns {string} the icon
   */
  get icon() { return this.getAttribute(attributes.ICON) || ''; }

  /**
   * Sets the icon svg path to render
   * @param {string} value The value must be a valid key in the path-data.json
   */
  set icon(value) {
    const svgElem = this.shadowRoot?.querySelector('svg');
    const isPathData = pathData.hasOwnProperty(value);
    const isEmptyPathData = emptyIconPathData.hasOwnProperty(value);
    if (value && (isPathData || isEmptyPathData)) {
      svgElem.style.display = '';
      this.setAttribute(attributes.ICON, value);
      svgElem.innerHTML = this.iconData();
    } else {
      this.removeAttribute(attributes.ICON);
      svgElem.style.display = 'none';
    }
  }

  /**
   * Return the size. May be large, normal/medium or small
   * @returns {string} the size
   */
  get size() { return this.getAttribute(attributes.SIZE) || 'normal'; }

  set size(value) {
    if (value && sizes[value]) {
      const size = sizes[this.size];
      this.setAttribute(attributes.SIZE, value);
      this.container?.setAttribute('height', size);
      this.container?.setAttribute('width', size);
    } else {
      this.removeAttribute(attributes.SIZE);
    }
    this.#adjustViewbox();
  }

  /**
   * Some specific icon types have different `viewBox`
   * properties that need adjusting at the component level
   * @returns {void}
   */
  #adjustViewbox() {
    let viewboxSize = '0 0 18 18';

    if (this.customViewbox) {
      viewboxSize = this.customViewbox;
    } else if (this.icon === 'logo' || this.icon === 'logo-trademark') {
      viewboxSize = '0 0 35 34';
    }
    this.container.setAttribute('viewBox', viewboxSize);
  }

  /** @returns {string|boolean} Whether or not the icon is vertical */
  get vertical() { return this.getAttribute(attributes.VERTICAL) || false; }

  /** @param {string|boolean} value Rotate the icon to vertical */
  set vertical(value) {
    const isVertical = IdsStringUtils.stringToBool(value);
    if (isVertical) {
      this.setAttribute(attributes.VERTICAL, value);
      this.container.classList.add('vertical');
      return;
    }
    this.removeAttribute(attributes.VERTICAL);
    this.container.classList.remove('vertical');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }

  #updateBadge() {
    let badge = this.shadowRoot.querySelector('span');
    if (!badge) {
      this.shadowRoot.innerHTML = this.template();
      badge = this.shadowRoot.querySelector('span');
    }

    if (!this.badgeColor && !this.badgePosition && badge) {
      this.className = '';
    } else {
      badge.className = '';
      badge.classList.add(`notification-badge`, `${this.badgePosition}`, `${this.badgeColor}`);
    }
  }
}

export default IdsIcon;

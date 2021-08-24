import pathData from 'ids-identity/dist/theme-new/icons/standard/path-data.json';
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
  large: 24,
  normal: 18,
  medium: 18,
  small: 10
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
    this.handleEvents();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
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
  handleEvents() {
    this.offEvent('languagechange.container');
    this.onEvent('languagechange.container', this.closest('ids-container'), async (e) => {
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
    const size = sizes[this.size];
    return `<svg xmlns="http://www.w3.org/2000/svg"${this.isFlipped(this.icon) ? ` class="flipped"` : ''} stroke="currentColor" fill="none" height="${size}" width="${size}" viewBox="0 0 18 18" aria-hidden="true">
      ${this.iconData()}
    </svg>`;
  }

  /**
   * Return the icon data for the svg based on the icon name
   * @returns {string} the path data
   */
  iconData() {
    return pathData[this.icon];
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
    if (value && pathData[value]) {
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
      this.shadowRoot?.querySelector('svg')?.setAttribute('height', size);
      this.shadowRoot?.querySelector('svg')?.setAttribute('width', size);
    } else {
      this.removeAttribute(attributes.SIZE);
    }
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
}

export default IdsIcon;

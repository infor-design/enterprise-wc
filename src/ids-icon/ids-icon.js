import pathData from 'ids-identity/dist/theme-new/icons/standard/path-data.json';
import {
  IdsElement,
  scss,
  customElement,
  attributes
} from '../ids-base';

// Import Mixins
import {
  IdsLocaleMixin
} from '../ids-mixins';

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
class IdsIcon extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [attributes.ICON, attributes.SIZE];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const size = sizes[this.size];
    return `<svg xmlns="http://www.w3.org/2000/svg"${this.isFlipped(this.icon) ? ` class="flip"` : ''} stroke="currentColor" fill="none" height="${size}" width="${size}" viewBox="0 0 18 18" focusable="false" aria-hidden="true" role="presentation">
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
    return false;
    /*
    const flippedIcons = [
      'attach',
      'bottom-aligned',
      'bullet-list',
      'cancel',
      'cart',
      'collapse-app-tray',
      'cut',
      'document',
      'drilldown',
      'duplicate',
      'expand-app-tray',
      'export',
      'first-page',
      'folder',
      'import',
      'last-page',
      'launch',
      'left-align',
      'left-text-align',
      'left-arrow',
      'new-document',
      'next-page',
      'number-list',
      'paste',
      'previous-page',
      'quote',
      'redo',
      'refresh',
      'right-align',
      'right-arrow',
      'right-text-align',
      'save',
      'search-folder',
      'search-list',
      'search',
      'send',
      'tack',
      'tree-collapse',
      'tree-expand',
      'undo',
      'unlocked',
      'add-grid-record',
      'add-grid-row',
      'additional-help',
      'bubble',
      'bullet-steps',
      'cascade',
      'change-font',
      'clear-screen',
      'script',
      'clockwise-90',
      'close-cancel',
      'close-save',
      'contacts',
      'copy-from',
      'copy-mail',
      'copy-url',
      'counter-clockwise-90',
      'create-report',
      'delete-grid-record',
      'delete-grid-row',
      'display',
      'employee-directory',
      'export-2',
      'export-to-pdf',
      'generate-key',
      'get-more-rows',
      'group-selection',
      'headphones',
      'help',
      'helper-list-select',
      'history',
      'invoice-released',
      'language',
      'logout',
      'key',
      'lasso',
      'line-bar-chart',
      'line-chart',
      'new-expense-report',
      'new-payment-request',
      'new-time-sheet',
      'new-travel-plan',
      'no-attachment',
      'no-comment',
      'no-filter',
      'overlay-line',
      'pdf-file',
      'phone',
      'payment-request',
      'pie-chart',
      'queries',
      'quick-access',
      'refresh-current',
      'restore-user',
      'run-quick-access',
      'save-close',
      'save-new',
      'search-results-history',
      'select',
      'send-submit',
      'show-last-x-days',
      'special-item',
      'stacked',
      'timesheet',
      'unsubscribe',
      'update-preview',
      'zoom-100',
      'zoom-in',
      'zoom-out',
      'caret-left',
      'caret-right'
    ];
    if (this.locale.isRTL() && flippedIcons.includes(iconName)) {
      return true;
    }
    return false;
    */
  }

  /**
   * Return the icon name
   * @returns {string} the path data
   */
  get icon() { return this.getAttribute(attributes.ICON) || ''; }

  set icon(value) {
    const svgElem = this.shadowRoot?.querySelector('svg');
    if (value && svgElem) {
      this.setAttribute(attributes.ICON, value);
      svgElem.innerHTML = this.iconData();
    } else {
      this.removeAttribute(attributes.ICON);
      svgElem?.remove();
    }
  }

  /**
   * Return the size. May be large, normal/medium or small
   * @returns {string} the path data
   */
  get size() { return this.getAttribute(attributes.SIZE) || 'normal'; }

  set size(value) {
    if (value) {
      const size = sizes[this.size];
      this.setAttribute(attributes.SIZE, value);
      this.shadowRoot?.querySelector('svg')?.setAttribute('height', size);
      this.shadowRoot?.querySelector('svg')?.setAttribute('width', size);
    } else {
      this.removeAttribute(attributes.SIZE);
    }
  }
}

export default IdsIcon;

import pathImport from 'ids-identity/dist/theme-new/icons/standard/path-data.json';
import emptyPathImport from 'ids-identity/dist/theme-new/icons/empty/path-data.json';

import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { sizes } from './ids-icon-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

import Base from './ids-icon-base';
import styles from './ids-icon.scss';

const emptyIconPathData: any = emptyPathImport;
const pathData : any = pathImport;

/**
 * IDS Icon Component
 * @type {IdsIcon}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @part svg
 */
@customElement('ids-icon')
@scss(styles)
export default class IdsIcon extends Base {
  pathData: any = pathData;

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
      attributes.HEIGHT,
      attributes.ICON,
      attributes.SIZE,
      attributes.VERTICAL,
      attributes.VIEWBOX,
      attributes.WIDTH
    ];
  }

  /**
   * Handle change events
   */
  #attachEventHandlers() {
    this.offEvent('languagechange.icon-container');
    this.onEvent('languagechange.icon-container', getClosest(this, 'ids-container'), () => {
      if (this.isMirrored(this.icon)) {
        this.container?.classList.add('mirrored');
      } else {
        this.container?.classList.remove('mirrored');
      }
    });
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    const height = ` height="${this.height}"`;
    const width = ` width="${this.width}"`;
    const viewBox = ` viewBox="${this.viewbox || '0 0 18 18'}"`;

    let cssClass = ' class="';
    if (!this.icon) {
      cssClass += 'empty';
    }
    if (this.isMirrored(this.icon)) {
      cssClass += `${cssClass.charAt(cssClass.length - 1) !== '"' ? ' ' : ''}mirrored`;
    }
    cssClass += '"';

    let badgeHTML = '';
    if (this.badgePosition && this.badgeColor) {
      badgeHTML += `<span class="notification-badge ${this.badgePosition} ${this.badgeColor}"></span>`;
    }

    return `<svg part="svg" xmlns="http://www.w3.org/2000/svg"${cssClass} stroke="currentColor" fill="none" ${height}${width}${viewBox} aria-hidden="true">
      ${this.iconData()}
    </svg>
    ${badgeHTML}`;
  }

  /**
   * Return the icon data for the svg based on the icon name
   * @returns {string} the path data
   */
  iconData(): string {
    let iconData = '';
    if (emptyIconPathData[this.icon]) {
      iconData = emptyIconPathData[this.icon];
    } else {
      iconData = pathData[this.icon];
    }
    return iconData;
  }

  /**
   * Some icons are mirrored in RTL Mode
   * @param {string} iconName icon name to check
   * @returns {boolean} true if mirrored / rtl
   */
  isMirrored(iconName: string) {
    const mirroredIcons = [
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
      'chevron-left',
      'chevron-right',
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
      'expand-app-tray',
      'export',
      'export-2',
      'export-to-pdf',
      'first-page',
      'folder',
      'get-more-rows',
      'group-selection',
      'headphones',
      'help',
      'helper-list-select',
      'history',
      'import',
      'invoice-released',
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
      'search-results-history',
      'send',
      'send-submit',
      'show-last-x-days',
      'special-item',
      'stacked',
      'timesheet',
      'tree-collapse',
      'tree-expand',
      'undo',
      'unsubscribe',
    ];

    if (this.locale?.isRTL() && mirroredIcons.includes(iconName)) {
      return true;
    }
    return false;
  }

  /**
   * @returns {string} the current color of the notification badge
   */
  get badgeColor(): string {
    return this.getAttribute(attributes.BADGE_COLOR);
  }

  /**
   * @param {string} value sets the color of the notification badge
   */
  set badgeColor(value: string) {
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
  get badgePosition(): string {
    return this.getAttribute(attributes.BADGE_POSITION);
  }

  /**
   * @param {string} value sets the postion of the notification badge
   */
  set badgePosition(value: string) {
    if (value && this.getAttribute(attributes.BADGE_POSITION) !== value) {
      this.setAttribute(attributes.BADGE_POSITION, value);
      this.#updateBadge();
    } else if (!value) {
      this.setAttribute(attributes.BADGE_POSITION, '');
      this.#updateBadge();
    }
  }

  /**
   * Returns the height attribute
   * @returns {string} a stringified height number
   */
  get height(): string {
    return this.getAttribute(attributes.HEIGHT) || sizes[this.size];
  }

  /**
   * @param {string} value allows sets a custom height value for the icon svg
   */
  set height(value: string) {
    if (value) {
      this.removeAttribute(attributes.SIZE);
      this.setAttribute(attributes.HEIGHT, value);
      this.container?.setAttribute('height', value);
    } else {
      this.removeAttribute(attributes.HEIGHT);
    }
  }

  /**
   * Return the viewbox
   * @returns {string} the string of viewbox numbers
   */
  get viewbox(): string {
    return this.getAttribute(attributes.VIEWBOX);
  }

  /**
   * @param {string} value set a custom viewbox for the icon svg
   */
  set viewbox(value: string) {
    if (value) {
      this.setAttribute(attributes.VIEWBOX, value);
      this.#adjustViewbox();
    } else {
      this.removeAttribute(attributes.VIEWBOX);
    }
  }

  /**
   * Return the width number
   * @returns {string} the stringified width number
   */
  get width(): string {
    return this.getAttribute(attributes.WIDTH) || sizes[this.size];
  }

  /**
   * @param {string} value sets a custom width for the icon svg
   */
  set width(value: string) {
    if (value) {
      this.removeAttribute(attributes.SIZE);
      this.setAttribute(attributes.WIDTH, value);
      this.container?.setAttribute('width', value);
    } else {
      this.removeAttribute(attributes.WIDTH);
    }
  }

  /**
   * Return the icon name
   * @returns {string} the icon
   */
  get icon(): string { return this.getAttribute(attributes.ICON) || ''; }

  /**
   * Sets the icon svg path to render
   * @param {string} value The value must be a valid key in the path-data.json
   */
  set icon(value: string) {
    const svgElem = this.shadowRoot?.querySelector('svg');
    const isPathData = pathData.hasOwnProperty(value);
    const isEmptyPathData = emptyIconPathData.hasOwnProperty(value);
    if (value && (isPathData || isEmptyPathData)) {
      this.setAttribute(attributes.ICON, value);
      if (svgElem) {
        svgElem.innerHTML = this.iconData();
        svgElem.classList.remove('empty');
      }
    } else {
      this.removeAttribute(attributes.ICON);
      if (svgElem) svgElem.classList.add('empty');
    }
  }

  /**
   * Return the size. May be large, normal/medium or small
   * @returns {string} the size
   */
  get size(): string { return this.getAttribute(attributes.SIZE) || 'normal'; }

  set size(value: string) {
    if (value && sizes[value]) {
      const size = sizes[this.size];
      this.container?.setAttribute('height', size);
      this.container?.setAttribute('width', size);
      this.setAttribute(attributes.SIZE, value);
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
  #adjustViewbox(): void {
    let viewboxSize = '0 0 18 18';

    if (this.viewbox) {
      viewboxSize = this.viewbox;
    }
    this.container?.setAttribute('viewBox', viewboxSize);
  }

  /** @returns {string|boolean} Whether or not the icon is vertical */
  get vertical(): string | boolean { return this.getAttribute(attributes.VERTICAL) || false; }

  /** @param {string | boolean} value Rotate the icon to vertical */
  set vertical(value: string | boolean) {
    const isVertical = stringToBool(value);
    if (isVertical) {
      this.setAttribute(attributes.VERTICAL, value);
      this.container?.classList.add('vertical');
      return;
    }
    this.removeAttribute(attributes.VERTICAL);
    this.container?.classList.remove('vertical');
  }

  #updateBadge(): void {
    let badge = this.shadowRoot.querySelector('span');
    if (!badge) {
      this.shadowRoot.innerHTML = this.template();
      badge = this.shadowRoot.querySelector('span');
    }

    if ((!this.badgeColor || !this.badgePosition) && badge) {
      this.className = '';
    } else if (badge) {
      badge.className = '';
      badge.classList.add(`notification-badge`, `${this.badgePosition}`, `${this.badgeColor}`);
    }
  }
}

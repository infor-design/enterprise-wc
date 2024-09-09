import pathImport from 'ids-foundation/icons/standard/path-data.json';
import emptyPathImport from 'ids-foundation/icons/empty/path-data.json';

import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { sizes } from './ids-icon-attributes';
import {
  type IdsColorValue,
  type IdsColorValueEmpty,
  type IdsColorValueStatus,
  applyColorValue,
  IdsColorValueCategories
} from '../../utils/ids-color-utils/ids-color-utils';
import { querySelectorAllShadowRoot } from '../../utils/ids-dom-utils/ids-dom-utils';

import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';

import styles from './ids-icon.scss';
import IdsGlobal from '../ids-global/ids-global';

const emptyIconPathData: any = emptyPathImport;
const pathData: Record<string, string> = pathImport;

const Base = IdsLocaleMixin(
  IdsColorVariantMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

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
  pathData: Record<string, string> = pathData;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
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
      attributes.COLOR,
      attributes.FILL,
      attributes.HEIGHT,
      attributes.ICON,
      attributes.SIZE,
      attributes.STATUS_COLOR,
      attributes.STROKE,
      attributes.VIEWBOX,
      attributes.WIDTH
    ];
  }

  /** Handle Languages Changes */
  onLanguageChange = () => {
    if (this.isMirrored(this.icon)) {
      this.container?.classList.add('mirrored');
    } else {
      this.container?.classList.remove('mirrored');
    }
  };

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    let viewBox = '';

    if (this.viewbox) {
      viewBox = this.viewbox;
    } else {
      viewBox = '0 0 18 18';
    }
    let template = `<svg
      part="svg"
      xmlns="http://www.w3.org/2000/svg"
      ${this.isMirrored(this.icon) ? ` class="mirrored"` : ''}
      stroke="currentColor"
      fill="none"
      viewBox="${viewBox}"
      aria-hidden="true">
      ${this.iconData()}
    </svg>`;
    if (this.badgePosition && this.badgeColor) {
      template += `<span class="notification-badge ${this.badgePosition} ${this.badgeColor}"></span>`;
    }
    return template;
  }

  /**
   * Return the icon data for the svg based on the icon name
   * @returns {string} the path data
   */
  iconData(): string {
    const icon = this.icon;
    const data = emptyIconPathData[icon] || pathData[icon] || (IdsGlobal.customIconData ? (IdsGlobal.customIconData as any)[icon] : '') || '';
    if (data === '') this.custom = true;
    return data;
  }

  custom?: boolean;

  /**
   * Set the static custom icon instance
   */
  static set customIconData(json: object | undefined) {
    IdsGlobal.customIconData = json;
    querySelectorAllShadowRoot('ids-icon').forEach((elem: any) => {
      if (elem.custom) {
        elem.icon = elem.icon;
        elem.custom = false;
      }
    });
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
      'arrow-left',
      'arrow-right',
      'attach',
      'arrow-left',
      'arrow-right',
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
      'open-folder',
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

    if (this.localeAPI?.isRTL() && mirroredIcons.includes(iconName)) {
      return true;
    }
    return false;
  }

  /**
   * @param {IdsColorValueStatus | null} value sets the color of the notification badge
   */
  set badgeColor(value: IdsColorValueStatus | null) {
    if (value) {
      this.setAttribute(attributes.BADGE_COLOR, value);
      this.#updateBadge();
    } else {
      this.removeAttribute(attributes.BADGE_COLOR);
      this.#updateBadge();
    }
  }

  get badgeColor(): IdsColorValueStatus | null {
    return this.getAttribute(attributes.BADGE_COLOR) as IdsColorValueStatus;
  }

  /**
   * @returns {string | null} position of notification badge
   */
  get badgePosition(): string | null {
    return this.getAttribute(attributes.BADGE_POSITION);
  }

  /**
   * @param {string} value sets the postion of the notification badge
   */
  set badgePosition(value: string | null) {
    if (value) {
      this.setAttribute(attributes.BADGE_POSITION, value);
      this.#updateBadge();
    } else {
      this.removeAttribute(attributes.BADGE_POSITION);
      this.#updateBadge();
    }
  }

  /**
   * Return the fill value
   * @returns {string | null} the fill value for the outer SVG element
   */
  get fill(): string | null {
    return this.getAttribute(attributes.FILL) || 'none';
  }

  /**
   * @param {string | null} value set a custom fill for the outer SVG element
   */
  set fill(value: string | null) {
    if (value) {
      this.setAttribute(attributes.FILL, value);
    } else {
      this.removeAttribute(attributes.FILL);
    }
    this.#adjustFill();
  }

  /**
   * Returns the height attribute
   * @returns {string} a stringified height number
   */
  get height(): string {
    return this.getAttribute(attributes.HEIGHT) || sizes[this.size]?.toString();
  }

  /**
   * @param {string} value allows sets a custom height value for the icon svg
   */
  set height(value: string) {
    if (value) {
      this.removeAttribute(attributes.SIZE);
      this.setAttribute(attributes.HEIGHT, value);
      this?.style.setProperty('--ids-icon-height-default', `${value}px`);
    } else {
      this.removeAttribute(attributes.HEIGHT);
    }
  }

  /**
   * Return the stroke value
   * @returns {string | null} the stroke value for the outer SVG element
   */
  get stroke(): string | null {
    return this.getAttribute(attributes.STROKE) || 'currentColor';
  }

  /**
   * @param {string | null} value set a custom stroke for the outer SVG element
   */
  set stroke(value: string | null) {
    if (value) {
      this.setAttribute(attributes.STROKE, value);
    } else {
      this.removeAttribute(attributes.STROKE);
    }
    this.#adjustStroke();
  }

  /**
   * Return the viewbox
   * @returns {string | null} the string of viewbox numbers
   */
  get viewbox(): string | null {
    return this.getAttribute(attributes.VIEWBOX);
  }

  /**
   * @param {string | null} value set a custom viewbox for the icon svg
   */
  set viewbox(value: string | null) {
    if (value) {
      this.setAttribute(attributes.VIEWBOX, value);
    } else {
      this.removeAttribute(attributes.VIEWBOX);
    }
    this.#adjustViewbox();
  }

  /**
   * Return the width number
   * @returns {string} the stringified width number
   */
  get width(): string {
    return this.getAttribute(attributes.WIDTH) || sizes[this.size]?.toString();
  }

  /**
   * @param {string} value sets a custom width for the icon svg
   */
  set width(value: string) {
    if (value) {
      this.removeAttribute(attributes.SIZE);
      this.setAttribute(attributes.WIDTH, value);
      this?.style.setProperty('--ids-icon-width-default', `${value}px`);
    } else {
      this.removeAttribute(attributes.WIDTH);
    }
  }

  /**
   * Return the icon name
   * @returns {string} the icon
   */
  get icon(): string {
    return this.getAttribute(attributes.ICON) || '';
  }

  /**
   * Sets the icon svg path to render
   * @param {string | null} value The value must be a valid key in the path-data.json
   */
  set icon(value: string | null) {
    const svgElem = this.shadowRoot?.querySelector('svg');
    if (value) {
      this.setAttribute(attributes.ICON, value);
    } else {
      this.removeAttribute(attributes.ICON);
    }
    const iconData = this.iconData();

    if (value && iconData) {
      if (svgElem) {
        svgElem.style.display = '';
        svgElem.innerHTML = this.iconData();
      }
    } else if (svgElem) {
      svgElem.style.display = 'none';
    }
  }

  /**
   * Return the size. May be large, normal/medium or small
   * @returns {string} the size
   */
  get size(): string {
    return this.getAttribute(attributes.SIZE) || 'normal';
  }

  set size(value: string | null) {
    if (value && sizes[value]) {
      const size = sizes[value];
      this.setAttribute(attributes.SIZE, value);
      this?.style.setProperty('--ids-icon-height-default', `${String(size)}px`);
      this?.style.setProperty('--ids-icon-width-default', `${String(size)}px`);
    } else {
      this.removeAttribute(attributes.SIZE);
    }
    this.#adjustViewbox();
  }

  /**
   * Color that can be used for embellishment or to indicate status or bring attention
   * @param {IdsColorValueEmpty | IdsColorValueStatus | IdsColorValueCategories} value Any pallete color reference
   */
  set statusColor(value: IdsColorValueEmpty | IdsColorValueStatus | IdsColorValueCategories) {
    this.container?.classList.remove(`status-color-${this.statusColor}`);
    if (value) {
      this.setAttribute(attributes.STATUS_COLOR, value);
      this.container?.classList.add(`status-color-${value}`);
    } else {
      this.removeAttribute(attributes.STATUS_COLOR);
    }
  }

  get statusColor(): IdsColorValueEmpty | IdsColorValueStatus | IdsColorValueCategories {
    return this.getAttribute(attributes.STATUS_COLOR) || '' as any;
  }

  /**
   * Color to use for icon fill (other than other settings).
   * @param {IdsColorValue} value Any pallete color reference
   */
  set color(value: IdsColorValue) {
    if (value) {
      this.setAttribute(attributes.COLOR, value);
      applyColorValue(value, this.container as HTMLElement, '--ids-icon-color-default');
    } else {
      applyColorValue('', this.container as HTMLElement, '--ids-icon-color-default');
      this.removeAttribute(attributes.COLOR);
    }
  }

  get color(): IdsColorValue {
    return this.getAttribute(attributes.COLOR) as IdsColorValue;
  }

  get pathElem(): SVGPathElement | null {
    return this.container?.querySelector('path') || null;
  }

  /**
   * Appends SVGDefsElement to icon SVG
   * @param {SVGDefsElement | string} svgDefs svg defs
   */
  appendSVGDefs(svgDefs: SVGDefsElement | string) {
    if (typeof svgDefs === 'string') {
      this.container?.insertAdjacentHTML('beforeend', svgDefs);
    } else {
      this.container?.append(svgDefs);
    }
  }

  #adjustFill(): void {
    let fill = 'none';
    if (this.fill) {
      fill = this.fill;
    }
    this.container?.setAttribute(attributes.FILL, fill);
  }

  #adjustStroke(): void {
    let stroke = 'currentColor';
    if (this.stroke) {
      stroke = this.stroke;
    }
    this.container?.setAttribute(attributes.STROKE, stroke);
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

  #updateBadge(): void {
    let badge = this.shadowRoot?.querySelector('span');

    if (!badge && this.shadowRoot) {
      this.container?.insertAdjacentHTML('afterend', '<span class="notification-badge"></span>');
      badge = this.shadowRoot.querySelector('span');
    }

    if ((!this.badgeColor || !this.badgePosition) && badge) {
      badge.className = '';
    } else if (badge) {
      badge.className = '';
      badge.classList.add(`notification-badge`, `${this.badgePosition}`, `${this.badgeColor}`);
    }
  }
}

import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import { contrastColor, adjustColor } from '../../utils/ids-color-utils/ids-color-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';
import styles from './ids-header.scss';

/**
 * IDS Header Component
 * @type {IdsHeader}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-header')
@scss(styles)
export default class IdsHeader extends IdsKeyboardMixin(IdsEventsMixin(IdsElement)) {
  colorVariants: string[] = ['alternate'];

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.COLOR
    ];
  }

  /**
   * Create the template for the header contents
   * @returns {string} The template
   */
  template(): string {
    return `
    <div class="ids-header">
      <slot></slot>
    </div>`;
  }

  /**
   * Sets the color attribute
   * @param {string} value string value for color
   */
  set color(value: string) {
    if (typeof value !== 'string' || !value.length || value === '' || value === '#ffffff') {
      this.removeAttribute('color');
      this.container?.style.removeProperty('--ids-header-color-background');
      this.container?.style.removeProperty('--ids-header-color-border-bottom');
      this.container?.style.removeProperty('--ids-header-color-text');
      this.container?.style.removeProperty('--ids-header-button-color-background-hover');
      this.container?.style.removeProperty('--ids-header-button-color-border-hover');
      this.container?.style.removeProperty('--ids-header-button-color-text-hover');
      this.container?.style.removeProperty('--ids-header-input-color-border-hover');
      this.container?.style.removeProperty('--ids-header-button-color-text-disabled');
      this.container?.style.removeProperty('--ids-header-button-shadow-focus');
      this.container?.style.removeProperty('--ids-header-button-color-border-focus');
      this.container?.style.removeProperty('--ids-header-button-color-background-pressed');
      this.container?.style.removeProperty('--ids-header-button-color-border-pressed');
      this.container?.style.removeProperty('--ids-header-button-color-text-pressed');
      return;
    }
    const sanitzedVal = stripHTML(value);
    const textColor = contrastColor(sanitzedVal, '#ffffff', '#000000');

    this.container?.style.setProperty('--ids-header-color-background', sanitzedVal);
    this.container?.style.setProperty('--ids-header-color-border-bottom', adjustColor(sanitzedVal, -0.30));
    this.container?.style.setProperty('--ids-header-color-text', textColor);
    this.container?.style.setProperty('--ids-header-button-color-text-default', textColor);
    this.container?.style.setProperty('--ids-header-button-color-background-hover', textColor === '#ffffff' ? 'rgba(255 255 255 / 0.2)' : 'rgba(0 0 0 / 0.1)');
    this.container?.style.setProperty('--ids-header-button-color-border-hover', 'transparent');
    this.container?.style.setProperty('--ids-header-button-color-text-hover', textColor);
    this.container?.style.setProperty('--ids-header-input-color-border-hover', textColor);
    this.container?.style.setProperty('--ids-header-button-color-text-disabled', adjustColor(textColor, -0.20));
    this.container?.style.setProperty('--ids-header-button-shadow-focus', `0 0 0 2px ${sanitzedVal}, 0 0 0 3px ${textColor}`);
    this.container?.style.setProperty('--ids-header-button-color-border-focus', textColor);
    this.container?.style.setProperty('--ids-header-button-color-background-pressed', textColor === '#ffffff' ? 'rgba(255 255 255 / 0.2)' : 'rgba(0 0 0 / 0.1)');
    this.container?.style.setProperty('--ids-header-button-color-border-pressed', 'transparent');
    this.container?.style.setProperty('--ids-header-button-color-text-pressed', textColor);
    this.container?.style.setProperty('--ids-header-button-menu-color-background-active', textColor === '#ffffff' ? 'rgba(255 255 255 / 0.2)' : 'rgba(0 0 0 / 0.1)');
    this.container?.style.setProperty('--ids-header-button-menu-color-active', textColor);

    this.setAttribute('color', sanitzedVal);
  }

  get color(): string {
    return this.getAttribute('color') || '#ffffff';
  }
}

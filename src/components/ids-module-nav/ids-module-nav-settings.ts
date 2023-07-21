import { customElement, scss } from '../../core/ids-decorators';

import IdsElement from '../../core/ids-element';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';
import IdsModuleNavTextDisplayMixin from './ids-module-nav-text-display-mixin';

import type IdsMenuButton from '../ids-menu-button/ids-menu-button';
import type IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import type IdsText from '../ids-text/ids-text';

import styles from './ids-module-nav-settings.scss';

const Base = IdsModuleNavTextDisplayMixin(
  IdsModuleNavDisplayModeMixin(
    IdsColorVariantMixin(
      IdsEventsMixin(
        IdsElement
      )
    )
  )
);

/**
 * IDS Module Nav Settings Component
 * @type {IdsModuleNavSettings}
 * @inherits IdsModuleNavItem
 * @part expander - this accoridon header's expander button element
 * @part header - the accordion header's root element
 * @part icon - the accordion header's icon element
 */
@customElement('ids-module-nav-settings')
@scss(styles)
export default class IdsModuleNavSettings extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [...super.attributes];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-module-nav-settings">
      <slot></slot>
    </div>`;
  }

  /**
   * @readonly
   * @returns {HTMLElement} the inner menu button
   */
  get button(): IdsMenuButton | undefined | null {
    return this.querySelector<IdsMenuButton>('ids-menu-button');
  }

  /**
   * @readonly
   * @returns {HTMLElement} the inner popup menu
   */
  get menu(): IdsPopupMenu | null {
    return this.querySelector<IdsPopupMenu>('ids-popup-menu') || null;
  }

  /**
   * @readonly
   * @returns {IdsText | null} this Accordion Header's text node
   */
  get textNode(): IdsText | null {
    return this.querySelector<IdsText>('ids-text, span') || null;
  }

  /**
   * @param {string | undefined | null} variantName name of the new colorVariant
   */
  onColorVariantRefresh(variantName: string | undefined | null) {
    if (this.button) this.button.colorVariant = variantName;
    if (this.menu) this.menu.colorVariant = variantName;
  }

  onDisplayModeChange() {
    this.#refreshTextNode();
  }

  #refreshTextNode() {
    if (this.textNode) this.textNode.audible = this.displayMode !== 'expanded';
  }

  onTextDisplayChange(val: string) {
    console.info(`text display change from header: "${this.textContent?.trim() || ''}"`, val);
    if (this.textNode) this.textNode.audible = val !== 'default';

    // @TODO toggle tooltip
  }
}

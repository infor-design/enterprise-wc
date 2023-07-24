import { customElement, scss } from '../../core/ids-decorators';

import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';
import IdsModuleNavTextDisplayMixin from './ids-module-nav-text-display-mixin';

import IdsMenuButton from '../ids-menu-button/ids-menu-button';
import type IdsText from '../ids-text/ids-text';

import styles from './ids-module-nav-settings.scss';

const Base = IdsModuleNavTextDisplayMixin(
  IdsModuleNavDisplayModeMixin(
    IdsMenuButton
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
   * @returns {string[]} containing prototype classes
   */
  get protoClasses() {
    return ['ids-module-nav-settings'];
  }

  /**
   * @readonly
   * @returns {IdsText | null} this Accordion Header's text node
   */
  get textNode(): IdsText | null {
    return this.querySelector<IdsText>('ids-text, span') || null;
  }

  /**
   * @returns {void}
   */
  configureMenu() {
    super.configureMenu();
    if (!this.menuEl || !this.menuEl.popup || !this.displayMode) {
      return;
    }

    this.menuEl.popup.arrow = 'none';
    this.menuEl.popup.x = 8;
    this.menuEl.popup.y = 12;

    if (this.displayMode === 'collapsed') {
      this.menuEl.popup.align = 'right, top';
      this.menuEl.popup.width = '';
    }
    if (this.displayMode === 'expanded') {
      this.menuEl.popup.align = 'top, left';
      this.menuEl.popup.width = `${(this.clientWidth - 16)}px`;
    }
  }

  /**
   * @param {string | undefined | null} variantName name of the new colorVariant
   */
  onColorVariantRefresh(variantName: string | undefined | null) {
    if (this.menuEl) this.menuEl.colorVariant = variantName;
  }

  onDisplayModeChange() {
    this.#refreshTextNode();
    this.configureMenu();
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

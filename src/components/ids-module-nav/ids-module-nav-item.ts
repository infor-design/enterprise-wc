import { customElement, scss } from '../../core/ids-decorators';

import IdsAccordionHeader from '../ids-accordion/ids-accordion-header';
import IdsHideFocusMixin from '../../mixins/ids-hide-focus-mixin/ids-hide-focus-mixin';
import IdsModuleNavTextDisplayMixin from './ids-module-nav-text-display-mixin';
import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';

import styles from './ids-module-nav-item.scss';

const Base = IdsModuleNavDisplayModeMixin(
  IdsModuleNavTextDisplayMixin(
    IdsHideFocusMixin(
      IdsAccordionHeader
    )
  )
);

/**
 * IDS Module Nav Item Component
 * @type {IdsModuleNavItem}
 * @inherits IdsAccordionHeader
 * @mixes IdsModuleNavDisplayModeMixin
 * @part expander - this accoridon header's expander button element
 * @part header - the accordion header's root element
 * @part icon - the accordion header's icon element
 */
@customElement('ids-module-nav-item')
@scss(styles)
export default class IdsModuleNavItem extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.toggleExpanderIcon(this.panel && this.panel.isExpandable);
    this.#refreshTextNode();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [
      ...super.attributes
    ];
  }

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = [
    'app-menu',
    'sub-app-menu',
    'module-nav',
    'sub-module-nav'
  ];

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <div class="ids-module-nav-item ids-accordion-header" tabindex="0" part="header">
        <ids-icon class="ids-accordion-display-icon" part="display-icon"></ids-icon>
        <slot></slot>
        ${this.templateExpanderIcon()}
      </div>
    `;
  }

  /**
   * @returns {HTMLElement | null} Live reference to the container element
   */
  get containerEl(): HTMLElement | null {
    return this.shadowRoot?.querySelector(`.${this.name}`) || null;
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

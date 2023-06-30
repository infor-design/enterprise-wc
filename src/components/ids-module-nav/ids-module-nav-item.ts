import { customElement, scss } from '../../core/ids-decorators';

import IdsAccordionHeader from '../ids-accordion/ids-accordion-header';
import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';

import styles from './ids-module-nav-item.scss';

const Base = IdsModuleNavDisplayModeMixin(
  IdsAccordionHeader
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
    return [...super.attributes];
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

  onDisplayModeChange() {
    this.#refreshTextNode();
  }

  #refreshTextNode() {
    if (this.textNode) this.textNode.audible = this.displayMode !== 'expanded';
  }
}

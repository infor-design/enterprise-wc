import { customElement, scss } from '../../core/ids-decorators';

import IdsModuleNavItem from './ids-module-nav-item';

import styles from './ids-module-nav-settings.scss';

const Base = IdsModuleNavItem;

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
    return `
      <div class="ids-module-nav-settings ids-module-nav-item ids-accordion-header" tabindex="0" part="header">
        <ids-icon class="ids-accordion-display-icon" part="display-icon"></ids-icon>
        <slot></slot>
        ${this.templateExpanderIcon()}
      </div>
    `;
  }
}

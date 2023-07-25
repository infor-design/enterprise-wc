import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';

import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';
import IdsModuleNavTextDisplayMixin from './ids-module-nav-text-display-mixin';

import styles from './ids-module-nav-switcher.scss';

import type IdsButton from '../ids-button/ids-button';
import type IdsDropdown from '../ids-dropdown/ids-dropdown';
import type IdsIcon from '../ids-icon/ids-icon';

const Base = IdsModuleNavTextDisplayMixin(
  IdsModuleNavDisplayModeMixin(
    IdsElement
  )
);

/**
 * IDS Module Nav Switcher Component
 * @type {IdsModuleNavSwitcher}
 * @inherits IdsElement
 */
@customElement('ids-module-nav-switcher')
@scss(styles)
export default class IdsModuleNavSwitcher extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.configureComponents();
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
   * @returns {string} Module Switcher component template
   */
  template() {
    return `<div class="ids-module-nav-switcher">
      <slot></slot>
    </div>`;
  }

  /**
   * @readonly
   * @returns {IdsButton} slotted Module Button element
   */
  get moduleButtonEl() {
    return this.querySelector<IdsButton>('ids-button');
  }

  /**
   * @readonly
   * @returns {IdsIcon} slotted Module Button Icon element
   */
  get moduleButtonIconEl() {
    return this.moduleButtonEl?.querySelector<IdsIcon>('ids-icon');
  }

  /**
   * @readonly
   * @returns {IdsButton} slotted Module Button element
   */
  get roleDropdownEl() {
    return this.querySelector<IdsDropdown>('ids-dropdown');
  }

  configureComponents() {
    if (this.moduleButtonEl) {
      this.moduleButtonEl.colorVariant = 'module-nav';
    }
    if (this.roleDropdownEl) {
      this.roleDropdownEl.colorVariant = 'module-nav';
      this.roleDropdownEl.label = 'Role Selector';
      this.roleDropdownEl.labelState = 'collapsed';
    }
  }
}

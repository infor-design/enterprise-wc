import { customElement, scss } from '../../core/ids-decorators';

import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';
import IdsModuleNavTextDisplayMixin from './ids-module-nav-text-display-mixin';

import IdsButton from '../ids-button/ids-button';

import styles from './ids-module-nav-button.scss';

const Base = IdsModuleNavTextDisplayMixin(
  IdsModuleNavDisplayModeMixin(
    IdsButton
  )
);

/**
 * IDS Module Nav Button Component
 * @type {IdsModuleNavButton}
 * @inherits IdsButton
 * @part expander - this accoridon header's expander button element
 * @part header - the accordion header's root element
 * @part icon - the accordion header's icon element
 */
@customElement('ids-module-nav-button')
@scss(styles)
export default class IdsModuleNavButton extends Base {
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
    return ['ids-module-nav-button'];
  }
}

import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsElement from '../../core/ids-element';
import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';

import styles from './ids-module-nav-content.scss';

const Base = IdsModuleNavDisplayModeMixin(
  IdsElement
);

/**
 * IDS Module Nav Component
 * @type {IdsModuleNav}
 * @inherits IdsDrawer
 */
@customElement('ids-module-nav-content')
@scss(styles)
export default class IdsModuleNav extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes as an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.OFFSET_CONTENT
    ];
  }

  template() {
    return `<div class="ids-module-nav-content"><slot></slot></div>`;
  }

  /**
   * If set to true the ripple effect will be disabled.
   * @param {boolean} val The ripple value
   */
  set offsetContent(val) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.OFFSET_CONTENT, '');
      this.container?.classList.add('offset-content');
    } else {
      this.removeAttribute(attributes.OFFSET_CONTENT);
      this.container?.classList.remove('offset-content');
    }
  }

  /**
   * @returns {boolean} true if ripple disabled
   */
  get offsetContent(): boolean {
    return this.hasAttribute(attributes.OFFSET_CONTENT);
  }
}

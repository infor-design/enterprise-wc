import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsElement from '../../core/ids-element';

import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';

import styles from './ids-module-nav-content.scss';

import type IdsModuleNav from './ids-module-nav';

const Base = IdsModuleNavDisplayModeMixin(
  IdsElement
);

/**
 * IDS Module Nav Component
 * @type {IdsModuleNavContent}
 * @inherits IdsElement
 */
@customElement('ids-module-nav-content')
@scss(styles)
export default class IdsModuleNavContent extends Base {
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
   * @readonly
   * @returns {IdsModuleNav | undefined} reference to the Module Nav parent element
   */
  get parent(): IdsModuleNav | undefined {
    const parentEl = getClosest(this, 'ids-module-nav');
    if (parentEl) return (parentEl as IdsModuleNav);
    return undefined;
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

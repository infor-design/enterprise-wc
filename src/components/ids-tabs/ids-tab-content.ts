import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-tab-content.scss';

const Base = IdsKeyboardMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS TabContent Component
 * @type {IdsTabContent}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-tab-content')
@scss(styles)
export default class IdsTabContent extends Base {
  constructor() {
    super();
  }

  /** @returns {Array} The attributes we handle as getters/setters */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.VALUE,
      attributes.ACTIVE
    ];
  }

  template() {
    return `<slot></slot>`;
  }

  /** @param {string} value representing associated tab */
  set value(value) {
    if (this.getAttribute(attributes.VALUE) === value) {
      return;
    }

    this.setAttribute(attributes.VALUE, String(value));
  }

  /** @returns {string} Value representing associated tab */
  get value() {
    return this.getAttribute(attributes.VALUE);
  }

  /** @param {boolean|string} value Whether or not this tab will be flagged as active/visible */
  set active(value) {
    const isTruthy = stringToBool(value);

    if (isTruthy && !this.hasAttribute(attributes.ACTIVE)) {
      this.setAttribute(attributes.ACTIVE, '');
    }

    if (!isTruthy && this.hasAttribute(attributes.ACTIVE)) {
      this.removeAttribute(attributes.ACTIVE);
    }
  }

  /** @returns {boolean|string} Whether or not this tab will be flagged as active/visible */
  get active() {
    return this.hasAttribute(attributes.ACTIVE);
  }
}

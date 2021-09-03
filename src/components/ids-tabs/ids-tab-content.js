import { IdsStringUtils } from '../../utils';
import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../../core';

import {
  IdsKeyboardMixin,
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

import IdsTab from './ids-tab';
import styles from './ids-tab-content.scss';

/**
 * IDS TabContent Component
 * @type {IdsTabContent}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-tab-content')
@scss(styles)
class IdsTabContent extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  /** @returns {Array} The attributes we handle as getters/setters */
  static get attributes() {
    return [attributes.VALUE, attributes.ACTIVE];
  }

  template() {
    return `<slot></slot>`;
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
  }

  /** @type {string} Value representing associated tab */
  set value(value) {
    /* istanbul ignore else */
    if (this.getAttribute(attributes.VALUE) === value) {
      return;
    }

    /* istanbul ignore next */
    this.setAttribute(attributes.VALUE, value);
  }

  /* istanbul ignore next */
  /** @returns {string} Value representing associated tab */
  get value() {
    return this.getAttribute(attributes.VALUE);
  }

  /** @value Whether or not this tab will be flagged as active/visible */
  set active(value) {
    const isTruthy = IdsStringUtils.stringToBool(value);

    if (isTruthy && !this.hasAttribute(attributes.ACTIVE)) {
      this.setAttribute(attributes.ACTIVE, '');
    }

    if (!isTruthy && this.hasAttribute(attributes.ACTIVE)) {
      this.removeAttribute(attributes.ACTIVE);
    }
  }

  /** @value Whether or not this tab will be flagged as active/visible */
  get active() {
    return this.hasAttribute(attributes.ACTIVE);
  }
}

export default IdsTabContent;

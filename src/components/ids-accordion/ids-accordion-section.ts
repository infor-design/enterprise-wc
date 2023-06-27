import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsElement from '../../core/ids-element';

import styles from './ids-accordion-section.scss';

const Base = IdsElement;

const setBooleanAttr = (name: string, el: IdsElement, value: boolean | string) => {
  const isTruthy = stringToBool(value);
  if (isTruthy) {
    el.setAttribute(name, `${isTruthy}`);
    el.container?.classList.add(name);
  } else {
    el.removeAttribute(name);
    el.container?.classList.remove(name);
  }
};

/**
 * IDS Accordion Section Component
 * @type {IdsAccordionSection}
 * @inherits IdsElement
 */
@customElement('ids-accordion-section')
@scss(styles)
export default class IdsAccordionSection extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.GROW,
      attributes.SHRINK,
      attributes.PINNED
    ];
  }

  template() {
    return `<div class="ids-accordion-section"><slot></slot></div>`;
  }

  /**
   * @returns {boolean} true if the section is currenly disabled
   */
  get disabled() {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Sets disabled property
   * @param {boolean|string} value true/false
   */
  set disabled(value) {
    setBooleanAttr('disabled', this, value);
  }

  /**
   * @returns {boolean} true if the section is currently set to grow
   */
  get grow() {
    return stringToBool(this.getAttribute(attributes.GROW));
  }

  /**
   * Sets grow property
   * @param {boolean|string} value true/false
   */
  set grow(value) {
    setBooleanAttr(attributes.GROW, this, value);
  }

  /**
   * @returns {boolean} true if the section is currently set to be pinned
   */
  get pinned() {
    return stringToBool(this.getAttribute(attributes.PINNED));
  }

  /**
   * Sets pinned property
   * @param {boolean|string} value true/false
   */
  set pinned(value) {
    setBooleanAttr(attributes.PINNED, this, value);
  }

  /**
   * @returns {boolean} true if the section is currently set to shrink
   */
  get shrink() {
    return stringToBool(this.getAttribute(attributes.SHRINK));
  }

  /**
   * Sets shrink property
   * @param {boolean|string} value true/false
   */
  set shrink(value) {
    setBooleanAttr(attributes.SHRINK, this, value);
  }
}

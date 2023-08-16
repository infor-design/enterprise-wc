import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { setBooleanAttr } from '../../utils/ids-attribute-utils/ids-attribute-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsElement from '../../core/ids-element';
import IdsAccordionPanel from './ids-accordion-panel';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';

import styles from './ids-accordion-section.scss';

const Base = IdsColorVariantMixin(IdsElement);

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
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = [
    'app-menu',
    'sub-app-menu',
    'module-nav',
    'sub-module-nav'
  ];

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

  /**
   * Inherited from `IdsColorVariantMixin`
   */
  onColorVariantRefresh() {
    const panels = this.querySelectorAll<IdsAccordionPanel>(':scope > ids-accordion-panel');
    if (panels && panels.length) {
      [...panels].forEach((panel: IdsAccordionPanel) => {
        panel.colorVariant = this.colorVariant;
      });
    }
  }
}

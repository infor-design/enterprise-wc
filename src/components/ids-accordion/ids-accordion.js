import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

import styles from './ids-accordion.scss';
import IdsAccordionHeader from './ids-accordion-header';
import IdsAccordionPanel from './ids-accordion-panel';
import {
  IdsColorVariantMixin,
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

/**
 * IDS Accordion Component
 * @type {IdsAccordion}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part accordion - the accordion root element
 */
@customElement('ids-accordion')
@scss(styles)
class IdsAccordion extends mix(IdsElement).with(
    IdsColorVariantMixin,
    IdsEventsMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();

    if (this.colorVariant) {
      this.#assignNestedColorVariant();
    }
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  availableColorVariants = ['app-menu'];

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-accordion" part="accordion">
        <slot></slot>
      </div>
    `;
  }

  get colorVariant() {
    return super.colorVariant;
  }

  set colorVariant(val) {
    super.colorVariant = val;
    this.#assignNestedColorVariant();
  }

  /**
   * Labels Headers and Panels by their depth within the accordion tree.
   * Used for assigning alternate
   * @param {HTMLElement} element the element to check
   * @param {number} depth the zero.
   */
  #assignNestedColorVariant(element = this, depth = 0) {
    if (!this.colorVariant) {
      return;
    }

    // @TODO: remove this after debugging
    if (element.depth !== depth) {
      element.setAttribute('depth', depth);
    }

    // Defines the color variant based on depth
    // DON'T do this on the accordion itself
    if (depth > 0) {
      const variant = depth > 1 ? `sub-${this.colorVariant}` : this.colorVariant;
      const header = element.querySelector('ids-accordion-header');
      element.colorVariant = variant;
      if (header) {
        header.colorVariant = variant;
      }
    }

    // Check children for nested panes
    const children = element.children;
    for (const childEl of children) {
      if (depth > 5) {
        break;
      }
      if (childEl.tagName !== 'IDS-ACCORDION-PANEL') {
        continue;
      }
      this.#assignNestedColorVariant(childEl, depth + 1);
    }
  }
}

export default IdsAccordion;

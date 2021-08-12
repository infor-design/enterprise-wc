import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

import styles from './ids-accordion-header.scss';
import {
  IdsColorVariantMixin,
  IdsThemeMixin,
  IdsEventsMixin
} from '../../mixins';

import { stringToBool } from '../../utils/ids-string-utils';

// Default Icons
const DEFAULT_ICON_OFF = 'caret-down';

/**
 * IDS Accordion Header Component
 * @type {IdsAccordionHeader}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part header - the accordion header root element
 * @part icon - the accordion header icon element
 */
@customElement('ids-accordion-header')
@scss(styles)
class IdsAccordionHeader extends mix(IdsElement).with(
    IdsColorVariantMixin,
    IdsEventsMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.MODE,
      attributes.VERSION,
      attributes.EXPANDED,
      attributes.SELECTED
    ];
  }

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  availableColorVariants = ['app-menu', 'sub-app-menu'];

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-accordion-header" tabindex="0" part="header">
        <slot></slot>
        <ids-icon icon=${DEFAULT_ICON_OFF} part="icon"></ids-icon>
      </div>
    `;
  }

  /**
   * @returns {boolean} true if this header's pane wrapper is expanded
   */
  get expanded() {
    return this.panel.expanded;
  }

  /**
   * @param {boolean} val true if this header should appear expanded
   */
  set expanded(val) {
    const trueVal = stringToBool(val);
    this.container.classList[trueVal ? 'add' : 'remove']('expanded');
  }

  /**
   * Focuses this accordion header
   * @returns {void}
   */
  focus() {
    this.setAttribute('tabindex', '0');
    this.container.setAttribute('tabindex', '0');
    this.container.focus();
  }

  /**
   * Removes the ability to focus this accordion header
   */
  unfocus() {
    this.setAttribute('tabindex', '-1');
    this.container.setAttribute('tabindex', '0');
  }

  /**
   * @returns {boolean} true if this accordion header should appear "selected"
   */
  get selected() {
    return stringToBool(this.getAttribute(attributes.SELECTED));
  }

  /**
   * @param {boolean} val true if this accordion header should appear "selected"
   */
  set selected(val) {
    const isValueTruthy = stringToBool(val);
    if (isValueTruthy) {
      this.setAttribute(attributes.SELECTED, `${val}`);
    } else {
      this.removeAttribute(attributes.SELECTED);
    }
    this.#refreshSelected(isValueTruthy);
  }

  /**
   * Refreshes the visual "Selected" state
   * @param {*} isSelected true if the Accordion Header should appear "Selected"
   */
  #refreshSelected(isSelected) {
    const textNode = this.querySelector('ids-text');

    this.container.classList[isSelected ? 'add' : 'remove']('selected');
    if (isSelected) {
      textNode.fontWeight = 'bold';
      this.triggerEvent('selected', this, { bubbles: true });
    } else {
      textNode.fontWeight = '';
    }
  }
}

export default IdsAccordionHeader;

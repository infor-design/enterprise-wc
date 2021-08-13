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

// Expander Types
const EXPANDER_TYPES = ['caret', 'plus-minus'];

// Default Icons
const DEFAULT_ICON_OFF = 'caret-down';

// Submenu Style Icons
const ICON_MINUS = 'plusminus-folder-closed';
const ICON_PLUS = 'plusminus-folder-open';

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
      attributes.EXPANDER_TYPE,
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
        ${this.templateExpanderIcon()}
      </div>
    `;
  }

  /**
   * Expander Icon template contents
   * @returns {string} the Expander Icon template
   */
  templateExpanderIcon() {
    return `
      <ids-icon class="ids-accordion-expander-button" icon=${DEFAULT_ICON_OFF} part="icon"></ids-icon>
    `;
  }

  /**
   * @readonly
   * @returns {IdsAccordionPanel} this header's panel
   */
  get panel() {
    return this.parentElement;
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
    this.#refreshExpanderIconType();
  }

  get expanderType() {
    return this.getAttribute(attributes.EXPANDER_TYPE);
  }

  set expanderType(val) {
    const currentVal = this.expanderType;
    let trueVal = EXPANDER_TYPES[0];
    if (EXPANDER_TYPES.includes(val)) {
      trueVal = val;
    }

    if (currentVal !== trueVal) {
      this.setAttribute(attributes.EXPANDER_TYPE, val);
      this.toggleExpanderIcon(this.expanded);
    }
  }

  /**
   * Focuses this accordion header
   * @returns {void}
   */
  focus() {
    this.container.focus();
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
    const currentValue = this.selected;
    const isValueTruthy = stringToBool(val);

    if (currentValue !== isValueTruthy) {
      if (isValueTruthy) {
        this.setAttribute(attributes.SELECTED, `${val}`);
      } else {
        this.removeAttribute(attributes.SELECTED);
      }
      this.#refreshSelected(isValueTruthy);
    }
  }

  /**
   * Refreshes the visual "Selected" state
   * @param {boolean} isSelected true if the Accordion Header should appear "Selected"
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

  /**
   * Toggles the display of an expander icon
   * @param {boolean} val true if the expander icon should be displayed
   */
  toggleExpanderIcon(val) {
    if (stringToBool(val)) {
      this.#showExpanderIcon();
    } else {
      this.#hideExpanderIcon();
    }
  }

  #showExpanderIcon() {
    const appendLocation = this.colorVariant?.indexOf('sub-') === 0 ? 'afterbegin' : 'beforeend';
    const expander = this.container.querySelector('ids-icon');

    if (!expander) {
      // Apply the expander button in front of the text
      // for any variants prefixed with `sub-`.
      const expanderIcon = this.templateExpanderIcon();
      this.container.insertAdjacentHTML(appendLocation, expanderIcon);
    } else {
      this.container[appendLocation === 'afterbegin' ? 'prepend' : 'append'](expander);
    }

    this.#refreshExpanderIconType();
  }

  #hideExpanderIcon() {
    const expander = this.container.querySelector('ids-icon');
    if (expander) {
      expander.remove();
    }
  }

  #refreshExpanderIconType() {
    const icon = this.container.querySelector('ids-icon');
    if (!icon) {
      return;
    }

    let iconType = DEFAULT_ICON_OFF;
    if (this.expanderType === 'plus-minus') {
      iconType = this.expanded ? ICON_PLUS : ICON_MINUS;
    }
    icon.icon = iconType;
  }
}

export default IdsAccordionHeader;

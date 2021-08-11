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
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../../mixins';

import IdsDOMUtils from '../ids-base/ids-dom-utils';

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
    IdsKeyboardMixin,
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

    this.#handleEvents();
    this.#handleKeys();
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

  /**
   * @readonly
   * @returns {Array<IdsAccordionHeader>} all accordion headers in a flattened array
   */
  get headers() {
    return [...this.querySelectorAll('ids-accordion-header')];
  }

  /**
   * @readonly
   * @returns {Array<IdsAccordionPanel>} all accordion panels in a flattened array
   */
  get panels() {
    return [...this.querySelectorAll('ids-accordion-panel')];
  }

  /**
   * @readonly
   * @returns {any} the currently focused menu item, if one exists
   */
  get focused() {
    if (this.contains(document.activeElement)) {
      return document.activeElement.closest('ids-accordion-panel');
    }
    return undefined;
  }

  /**
   * @returns {string} the current top-level color variant
   */
  get colorVariant() {
    return super.colorVariant;
  }

  /**
   * Overrides the getter from IdsColorVariantMixin to also include re-assignment
   * of nested accordion color variants (which may be styled differently than the top-level)
   * @param {string} val the desired "top-level" color variant
   */
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

  /**
   * @returns {void}
   */
  #handleEvents() {
    this.onEvent('focusin', this, (e) => {
      if (e.target.tagName === 'IDS-ACCORDION-HEADER') {
        this.#unfocusOtherHeaders(e.target);
      }
    });
  }

  /**
   * Prevents focusability of any accordion headers except for the provided one.
   * @param {HTMLElement} target a header to ignore
   */
  #unfocusOtherHeaders(target) {
    this.headers.forEach((header) => {
      if (!target.isEqualNode(header)) {
        header.unfocus();
      }
    });
  }

  /**
   * Sets up keyboard navigation among accordion elements
   * @returns {void}
   */
  #handleKeys() {
    // Arrow Up navigates focus backward
    this.listen(['ArrowUp'], this, (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigate(-1, true);
    });

    // Arrow Down navigates focus forward
    this.listen(['ArrowDown'], this, (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.navigate(1, true);
    });
  }

  /**
   * Uses a currently-highlighted toolbar item to "navigate" a specified number
   * of steps to another toolbar item, highlighting it.
   * @param {number} [amt] the amount of items to navigate
   * @param {boolean} [doFocus] if true, causes the new item to become focused.
   * @returns {any} the item that will be focused
   */
  navigate(amt = 0, doFocus = false) {
    const panes = this.panels;
    let currentItem = this.focused || panes[0];

    if (typeof amt !== 'number') {
      return currentItem;
    }

    // Calculate steps/meta
    const negative = amt < 0;
    let steps = Math.abs(amt);
    let currentIndex = panes.indexOf(currentItem);

    // Step through items to the target
    while (steps > 0) {
      currentItem = panes[currentIndex + (negative ? -1 : 1)];
      currentIndex = panes.indexOf(currentItem);

      // "-1" means we've crossed the boundary and need to loop back around
      if (currentIndex < 0) {
        currentIndex = (negative ? panes.length - 1 : 0);
        currentItem = panes[currentIndex];
      }

      // Don't count disabled or nested headers inside a collapsed header as "taking a step"
      // @TODO work on the nested headers part
      if (!currentItem.disabled) {
        steps -= 1;
      }
    }

    if (!currentItem.disabled && doFocus) {
      currentItem.focus();
    }

    return currentItem;
  }
}

export default IdsAccordion;

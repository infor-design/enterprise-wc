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

import IdsDOMUtils from '../../utils/ids-dom-utils';

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
      const subLevelDepth = depth > 1;
      const variant = subLevelDepth ? `sub-${this.colorVariant}` : this.colorVariant;
      const expanderType = subLevelDepth ? 'plus-minus' : 'caret';
      const header = element.querySelector('ids-accordion-header');
      element.colorVariant = variant;
      if (header) {
        header.colorVariant = variant;
        header.expanderType = expanderType;
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
    this.onEvent('selected', this, (e) => {
      this.#deselectOtherHeaders(e.target);
    });
  }

  /**
   * Makes accordion headers appear to be deselected, except for the provided one.
   * @param {HTMLElement} target a header to ignore
   */
  #deselectOtherHeaders(target) {
    this.headers.forEach((header) => {
      if (header.selected && !target.isEqualNode(header)) {
        header.selected = false;
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
      this.#prevPanel();
    });

    // Arrow Down navigates focus forward
    this.listen(['ArrowDown'], this, (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.#nextPanel();
    });
  }

  /**
   * Navigates focus from the currently focused Accordion Panel to the next,
   * looping focus to the first panel if applicable.
   * @returns {void}
   */
  #nextPanel() {
    const currentItem = this.focused;
    let next;

    // If the focused panel is expandable, find the first panel inside of it
    if (currentItem.isExpandable && currentItem.expanded) {
      next = currentItem.querySelector('ids-accordion-panel');
    } else {
      next = currentItem.nextElementSibling;
    }

    // If there's no next sibiling, or this pane has been closed,
    // navigate to next item outside this panel
    if (!next) {
      next = currentItem.parentElement.nextElementSibling;
    }

    // If next is not an accordion panel, consider that we've 'looped'
    // back around to the top and pick the first panel
    if (!next || next.tagName !== 'IDS-ACCORDION-PANEL') {
      next = this.querySelector('ids-accordion-panel');
    }

    next.focus();
  }

  /**
   * Navigates focus from the currently focused Accordion Panel to the previous,
   * looping focus to the last panel if applicable.
   * @returns {void}
   */
  #prevPanel() {
    const currentItem = this.focused;
    const getLastPanel = () => {
      const prevChildren = currentItem.querySelectorAll('ids-accordion-panel:last-child');
      return prevChildren[prevChildren.length - 1];
    };

    let prev = currentItem.previousElementSibling;
    if (!prev) {
      prev = getLastPanel();
    }

    // If the previous panel is expandable, focus on its last pane instead
    if (prev.isExpandable && prev.expanded) {
      prev = prev.querySelector('ids-accordion-panel:last-child');
    }

    // If the previous element is a header, no more panels are present.
    // Navigation should be pushed one panel level up;
    if (prev.tagName === 'IDS-ACCORDION-HEADER') {
      prev = prev.parentElement;
    }

    // If there's no next sibiling, or this pane has been closed,
    // navigate to previous item outside this pane
    if (!prev) {
      prev = currentItem.parentElement;
    }

    // If previous is not an accordion panel, consider that we've 'looped'
    // back around to the top and pick the first header
    if (!prev || prev.tagName !== 'IDS-ACCORDION-PANEL') {
      prev = getLastPanel();
    }

    prev.focus();
  }
}

export default IdsAccordion;

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

    // Assign depth-dependent styles, and re-apply them on changes
    this.#assignDepthDependentStyles();
    this.#contentObserver.observe(this, {
      childList: true
    });

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

  #contentObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        this.#assignDepthDependentStyles();
      }
    }
  });

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
    this.#assignDepthDependentStyles(this, 0, true, false, false);
  }

  /**
   * Labels Headers and Panels with styling information that is
   * dependent on how deeply-nested they are within the Accordion tree.
   * @param {HTMLElement} element the element to check
   * @param {number} depth the zero.
   * @param {boolean} doColorVariant if true, modifies the color variant
   * @param {boolean} doExpanderType if true, modifies the expander type
   * @param {boolean} doDisplayIconType if true, modifies the display icon type
   */
  #assignDepthDependentStyles(
    element = this,
    depth = 0,
    doColorVariant = true,
    doExpanderType = true,
    doDisplayIconType = true
  ) {
    if (depth > 0) {
      const subLevelDepth = depth > 1;
      const header = element.querySelector('ids-accordion-header');

      // Assign Nested Padding CSS Classes
      element.nested = subLevelDepth;

      // Assign Color Variant
      if (doColorVariant && this.colorVariant) {
        const variant = subLevelDepth ? `sub-${this.colorVariant}` : this.colorVariant;
        element.colorVariant = variant;

        if (header) {
          header.colorVariant = variant;
        }
      }

      if (header) {
        // Assign Expander Type
        // (Use Plus/Minus-style expander on any nested panels)
        if (doExpanderType) {
          const expanderType = subLevelDepth ? 'plus-minus' : 'caret';
          header.expanderType = expanderType;
        }

        // Assign Content Alignment Style
        // (applies special alignment rules to ALL panes
        // adjacent to panes containing an icon in their header)
        if (doDisplayIconType) {
          const displayIconType = header.icon;
          if (typeof displayIconType === 'string' && displayIconType.length && !element.contentAlignment) {
            this.#markAdjacentPanesForIcons(element, true);
          }
        }
      }
    }

    // Check children for nested panes
    /* istanbul ignore next */
    const children = element.children;
    /* istanbul ignore next */
    for (const childEl of children) {
      if (depth > 6) {
        break;
      }
      if (childEl.tagName !== 'IDS-ACCORDION-PANEL') {
        continue;
      }
      this.#assignDepthDependentStyles(childEl, depth + 1);
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
   * Traverses the Accordion a specified number of steps, focusing the last one
   * @param {number} amt the amount of steps to take
   * @returns {IdsAccordionPanel} the newly-focused accordion pane
   */
  navigate(amt = 0) {
    if (typeof amt !== 'number') {
      return this.focused;
    }

    const negative = amt < 0;
    let steps = Math.abs(amt);
    while (steps > 0) {
      if (negative) {
        this.#prevPanel();
      } else {
        this.#nextPanel();
      }
      steps -= 1;
    }
    return this.focused;
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
      /* istanbul ignore next */
      next = currentItem.querySelector('ids-accordion-panel') || currentItem.nextElementSibling;
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
      const prevChildren = currentItem.parentElement.querySelectorAll('ids-accordion-panel:last-child');
      return prevChildren[prevChildren.length - 1];
    };

    let prev = currentItem.previousElementSibling;
    if (!prev) {
      prev = getLastPanel();
    }

    // If the previous panel is expandable, focus on its last pane instead
    if (prev.isExpandable && prev.expanded) {
      const current = prev;
      /* istanbul ignore next */
      prev = prev.querySelector('ids-accordion-panel:last-child') || current;
    }

    // If the previous element is a header, no more panels are present.
    // Navigation should be pushed one panel level up;
    if (prev.tagName === 'IDS-ACCORDION-HEADER') {
      prev = prev.parentElement;
    }

    // If this pane has been closed, navigate to previous item outside this pane
    while (prev.parentElement.tagName === 'IDS-ACCORDION-PANEL' && !prev.parentElement.expanded) {
      /* istanbul ignore next */
      prev = prev.parentElement;
    }

    // If there's no previous sibiling, navigate to the previous highest pane
    /* istanbul ignore next */
    if (!prev) {
      prev = currentItem.parentElement;
    }

    // If previous is not an accordion panel, consider that we've 'looped'
    // back around to the top and pick the first header
    /* istanbul ignore next */
    if (!prev || prev.tagName !== 'IDS-ACCORDION-PANEL') {
      prev = getLastPanel();
    }

    prev.focus();
  }

  /**
   * Assigns CSS classes to panes/headers that will correctly align their contents
   * for either having an icon, or not having an icon
   * @param {*} panel the accordion panel that contains icons
   * @param {*} status true if other adjacent accordion panels
   *   should appear to be aligned with this panel's icon
   */
  #markAdjacentPanesForIcons(panel, status) {
    const parent = panel.parentElement;
    [...parent.children].forEach((node) => {
      if (node.tagName === 'IDS-ACCORDION-PANEL') {
        node.contentAlignment = status ? 'has-icon' : null;
      }
    });
  }
}

export default IdsAccordion;

import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-accordion-base';
import './ids-accordion-header';
import './ids-accordion-panel';
import styles from './ids-accordion.scss';

/**
 * IDS Accordion Component
 * @type {IdsAccordion}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 * @part accordion - the accordion root element
 */
@customElement('ids-accordion')
@scss(styles)
export default class IdsAccordion extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#handleEvents();
    this.#handleKeys();

    // Assign depth-dependent styles, and re-apply them on changes
    requestAnimationFrame(() => {
      this.#assignDepthDependentStyles();
      this.#contentObserver.observe((this as any), {
        childList: true
      });
    });
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ALLOW_ONE_PANE,
      attributes.DISABLED,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['app-menu'];

  /**
   * When the accordion's color variant is set, push this change through to the child elements
   */
  onColorVariantRefresh() {
    this.#assignDepthDependentStyles(this, 0, true, false, false, false);
  }

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
   * Observes changes in the accordion tree
   */
  #contentObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        this.#assignDepthDependentStyles();
      }
    }
  });

  /**
   * @readonly
   * @returns {Array<HTMLElement>} all accordion headers in a flattened array
   */
  get headers(): Array<HTMLElement> {
    return [...this.querySelectorAll('ids-accordion-header')];
  }

  /**
   * @readonly
   * @returns {Array<any>} all accordion panels in a flattened array
   */
  get panels(): Array<any> {
    return [...this.querySelectorAll('ids-accordion-panel')];
  }

  /**
   * @readonly
   * @returns {any} the currently focused menu item, if one exists
   */
  get focused(): any {
    if (this.contains(document.activeElement)) {
      return (document.activeElement as any).closest('ids-accordion-panel');
    }
    return undefined;
  }

  /**
   * Gets allowOnePane property
   * @readonly
   * @returns {boolean} true if accordion set to allowOnePane
   */
  get allowOnePane(): boolean {
    return stringToBool(this.getAttribute(attributes.ALLOW_ONE_PANE));
  }

  /**
   * Sets allowOnePane property
   * @param {boolean|string} allow true/false
   */
  set allowOnePane(allow: boolean | string) {
    const toAllow = stringToBool(allow);

    if (toAllow) {
      this.setAttribute(attributes.ALLOW_ONE_PANE, `${toAllow}`);
    } else {
      this.removeAttribute(attributes.ALLOW_ONE_PANE);
    }
  }

  /**
   * Gets disabled property
   * @readonly
   * @returns {boolean} true if accordion set to disable
   */
  get disabled() {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Sets disabled property
   * @param {boolean|string} value true/false
   */
  set disabled(value) {
    const disabled = stringToBool(value);

    if (disabled) {
      this.setAttribute(attributes.DISABLED, `${disabled}`);
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.panels.forEach((panel) => {
      panel.disabled = disabled;
    });
  }

  /**
   * Labels Headers and Panels with styling information that is
   * dependent on how deeply-nested they are within the Accordion tree.
   * @param {HTMLElement} element the element to check
   * @param {number} depth the zero.
   * @param {boolean} doColorVariant if true, modifies the color variant
   * @param {boolean} doExpanderType if true, modifies the expander type
   * @param {boolean} doDisplayIconType if true, modifies the display icon type
   * @param {boolean} doRTL if true, modifies RTL styles
   */
  #assignDepthDependentStyles(
    element = this,
    depth = 0,
    doColorVariant = true,
    doExpanderType = true,
    doDisplayIconType = true,
    doRTL = true
  ) {
    this.header = element.querySelector(':scope > ids-accordion-header');
    const subLevelDepth = depth > 1;

    if (depth > 0) {
      // Assign Nested Padding CSS Classes
      element.nested = subLevelDepth;

      // Assign Color Variant
      if (doColorVariant && this.colorVariant) {
        const variant = subLevelDepth ? `sub-${this.colorVariant}` : this.colorVariant;
        element.colorVariant = variant;

        if (this.header) {
          this.header.colorVariant = variant;
        }
      }

      if (this.header) {
        // Pass language/locale down to child components
        this.header.language = this.language?.name;

        // Assign Expander Type
        // (Use Plus/Minus-style expander on any nested panels)
        if (doExpanderType) {
          const expanderType = subLevelDepth ? 'plus-minus' : 'caret';
          this.header.expanderType = expanderType;
        }

        // Assign Content Alignment Style
        // (applies special alignment rules to ALL panes
        // adjacent to panes containing an icon in their header)
        if (doDisplayIconType) {
          const displayIconType = this.header.icon;
          if (typeof displayIconType === 'string' && displayIconType.length && !element.contentAlignment) {
            this.#markAdjacentPanesForIcons(element, true);
          }
        }
      }
    }

    // Check children for nested panes
    const children = element.children;
    for (const childEl of children) {
      if (depth > 6) {
        break;
      }
      if (childEl.tagName !== 'IDS-ACCORDION-PANEL') {
        continue;
      }
      this.#assignDepthDependentStyles(
        childEl,
        depth + 1,
        doColorVariant,
        doExpanderType,
        doDisplayIconType,
        doRTL
      );
    }
  }

  /**
   * @returns {void}
   */
  #handleEvents() {
    this.offEvent('languagechange.accordion-container');
    this.onEvent('languagechange.accordion-container', this.closest('ids-container'), (e: CustomEvent) => {
      if (this.header) {
        this.header.language = e.detail.language.name;
      }
      this.#assignDepthDependentStyles(this, 0, false, false, false, true);
    });

    // Responds to `selected` events triggered by children
    this.onEvent('selected', this, (e: CustomEvent) => {
      this.#deselectOtherHeaders((e.target as HTMLElement));
    });
  }

  /**
   * Makes accordion headers appear to be deselected, except for the provided one.
   * @param {HTMLElement} target a header to ignore
   */
  #deselectOtherHeaders(target: HTMLElement) {
    this.headers.forEach((header: any) => {
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
    this.listen(['ArrowUp'], this, (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.#prevPanel();
    });

    // Arrow Down navigates focus forward
    this.listen(['ArrowDown'], this, (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.#nextPanel();
    });
  }

  /**
   * Traverses the Accordion a specified number of steps
   * @param {number} amt the amount of steps to take
   * @returns {HTMLElement} the newly-focused accordion pane
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
      prev = prev.querySelector('ids-accordion-panel:last-child') || current;
    }

    // If the previous element is a header, no more panels are present.
    // Navigation should be pushed one panel level up;
    if (prev.tagName === 'IDS-ACCORDION-HEADER') {
      prev = prev.parentElement;
    }

    // If this pane has been closed, navigate to previous item outside this pane
    while (prev.parentElement.tagName === 'IDS-ACCORDION-PANEL' && !prev.parentElement.expanded) {
      prev = prev.parentElement;
    }

    // If there's no previous sibiling, navigate to the previous highest pane
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

  /**
   * Assigns CSS classes to panes/headers that will correctly align their contents
   * for either having an icon, or not having an icon
   * @param {any} panel the accordion panel that contains icons
   * @param {boolean} status true if other adjacent accordion panels
   *   should appear to be aligned with this panel's icon
   */
  #markAdjacentPanesForIcons(panel: any, status: boolean) {
    const parent = panel.parentElement;
    [...parent.children].forEach((node) => {
      if (node.tagName === 'IDS-ACCORDION-PANEL') {
        node.contentAlignment = status ? 'has-icon' : null;
      }
    });
  }
}

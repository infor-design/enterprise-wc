import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import './ids-accordion-header';
import './ids-accordion-panel';
import styles from './ids-accordion.scss';

import type IdsAccordionSection from './ids-accordion-section';
import type IdsAccordionHeader from './ids-accordion-header';
import type IdsAccordionPanel from './ids-accordion-panel';
import type IdsModuleNavItem from '../ids-module-nav/ids-module-nav-item';

type IdsAccordionPart = IdsAccordion |
IdsAccordionPanel |
IdsAccordionHeader |
IdsAccordionSection |
IdsModuleNavItem;

const Base = IdsColorVariantMixin(
  IdsKeyboardMixin(
    IdsLocaleMixin(
      IdsEventsMixin(
        IdsElement
      )
    )
  )
);

/**
 * IDS Accordion Component
 * @type {IdsAccordion}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLocaleMixin
 * @part accordion - the accordion root element
 */
@customElement('ids-accordion')
@scss(styles)
export default class IdsAccordion extends Base {
  header: IdsAccordionHeader | IdsModuleNavItem | null = null;

  previouslySelected: IdsAccordionHeader | null | undefined = null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#handleEvents();
    this.#handleKeys();

    this.#assignDepthDependentStyles(this, 0, true, true, true, true);
    this.#contentObserver?.observe((this as any), {
      childList: true
    });
    if (this.parentElement?.nodeName === 'IDS-APP-MENU') this.colorVariant = 'app-menu';
    if (this.parentElement?.nodeName === 'IDS-MODULE-NAV-BAR') this.colorVariant = 'module-nav';
  }

  disconnectedCallback(): void {
    if (this.#contentObserver) {
      this.#contentObserver.disconnect();
      this.#contentObserver = undefined;
    }
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ALLOW_ONE_PANE,
      attributes.DISABLED
    ];
  }

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['app-menu', 'module-nav'];

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
  #contentObserver: MutationObserver | undefined = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        this.#assignDepthDependentStyles();
      }
    }
  });

  /**
   * @readonly
   * @returns {Array<IdsAccordionSection>} all accordion sections in a flattened array
   */
  get sections(): Array<IdsAccordionSection> {
    return [...this.querySelectorAll<IdsAccordionSection>('ids-accordion-section')];
  }

  /**
   * @readonly
   * @returns {Array<IdsAccordionHeader | IdsModuleNavItem>} all accordion headers in a flattened array
   */
  get headers(): Array<IdsAccordionHeader> {
    return [...this.querySelectorAll<IdsAccordionHeader | IdsModuleNavItem>('ids-accordion-header, ids-module-nav-item')];
  }

  /**
   * @readonly
   * @returns {Array<IdsAccordionPanel>} all accordion panels in a flattened array
   */
  get panels(): Array<IdsAccordionPanel> {
    return [...this.querySelectorAll<IdsAccordionPanel>('ids-accordion-panel')];
  }

  /**
   * @readonly
   * @returns {IdsAccordionPanel|null} the currently focused menu item, if one exists
   */
  get focused(): IdsAccordionPanel | undefined | null {
    if (this.contains(document.activeElement)) {
      return document.activeElement?.closest<IdsAccordionPanel>('ids-accordion-panel');
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
      this.collapseAll(this.previouslySelected?.panel);
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
    element: IdsAccordionPart = this,
    depth = 0,
    doColorVariant = true,
    doExpanderType = true,
    doDisplayIconType = true,
    doRTL = true
  ) {
    const addDepthClass = (el: HTMLElement, thisDepth: number) => {
      if (el) el.classList.add(`depth-${thisDepth}`);
    };

    // If dealing with Accordion Sections,
    // loop this method through an array of sections instead
    const hasSection = element.querySelector(':scope > ids-accordion-section');
    if (hasSection) {
      [...element.querySelectorAll<IdsAccordionSection>(':scope > ids-accordion-section')].forEach((section: IdsAccordionSection) => {
        this.#assignDepthDependentStyles(section, depth, doColorVariant, doExpanderType, doDisplayIconType, doRTL);
      });
      return;
    }

    this.header = element.querySelector<IdsAccordionHeader | IdsModuleNavItem>(':scope > ids-accordion-header, :scope > ids-module-nav-item');
    const hasChildPanels = element.children.length > 1 || false;
    const subLevelDepth = depth > 1;

    if (depth > 0) {
      // Assign Nested Padding CSS Classes
      if (element.tagName === 'IDS-ACCORDION-PANEL') {
        (element as IdsAccordionPanel).nested = subLevelDepth;
      }
      if (element.container) addDepthClass(element.container, depth);

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
        // TODO - do we need this?
        // this.header.language = this.language?.name;

        // Assign Expander Type
        // (Use Plus/Minus-style expander on any nested panels)
        if (hasChildPanels && doExpanderType) {
          const expanderType = subLevelDepth ? 'plus-minus' : 'caret';
          this.header.expanderType = expanderType;
        }

        // Assign Content Alignment Style
        // (applies special alignment rules to ALL panes
        // adjacent to panes containing an icon in their header)
        if (doDisplayIconType) {
          const displayIconType = this.header.icon;
          if (typeof displayIconType === 'string' && displayIconType.length && !(element as IdsAccordionPanel).contentAlignment) {
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
        (childEl as IdsAccordionPanel),
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
    // Responds to `selected` events triggered by children
    this.onEvent('selected', this, (e: CustomEvent) => {
      const el = e.detail.elem as IdsAccordionHeader;
      this.previouslySelected = el;
      this.#deselectOtherHeaders(el);
    });
  }

  /** Respond to language changes */
  onLanguageChange = () => {
    // TODO - Do we need this?
    // if (this.header) {
    //   this.header.language = e.detail.language.name;
    // }
    this.#assignDepthDependentStyles(this, 0, false, false, false, true);
  };

  /**
   * Makes accordion headers appear to be deselected, except for the provided one.
   * @param {HTMLElement} target a header to ignore
   */
  #deselectOtherHeaders(target: HTMLElement) {
    this.headers.forEach((header: any) => {
      if (header.selected && target !== header) {
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
    if (currentItem?.isExpandable && currentItem.expanded) {
      next = currentItem.querySelector<IdsAccordionPanel>('ids-accordion-panel') || currentItem.nextElementSibling;
    } else {
      next = currentItem?.nextElementSibling;
    }

    // If there's no next sibiling, or this pane has been closed,
    // navigate to next item outside this panel
    if (!next) {
      next = currentItem?.parentElement?.nextElementSibling;
    }

    // If next is not an accordion panel, consider that we've 'looped'
    // back around to the top and pick the first panel
    if (!next || next.tagName !== 'IDS-ACCORDION-PANEL') {
      next = this.querySelector<IdsAccordionPanel>('ids-accordion-panel');
    }

    (next as IdsAccordionPanel)?.focus();
  }

  /**
   * Navigates focus from the currently focused Accordion Panel to the previous,
   * looping focus to the last panel if applicable.
   * @returns {void}
   */
  #prevPanel() {
    const currentItem = this.focused;
    const getLastPanel = () => {
      const prevChildren = currentItem?.parentElement?.querySelectorAll<IdsAccordionPanel>('ids-accordion-panel:last-child');
      return prevChildren ? prevChildren[prevChildren.length - 1] : undefined;
    };

    let prev = currentItem?.previousElementSibling as IdsAccordionPanel | undefined | null;
    if (!prev) {
      prev = getLastPanel();
    }

    // If the previous panel is expandable, focus on its last pane instead
    if (prev?.isExpandable && prev.expanded) {
      const current = prev;
      prev = prev.querySelector<IdsAccordionPanel>('ids-accordion-panel:last-child') || current;
    }

    // If the previous element is a header, no more panels are present.
    // Navigation should be pushed one panel level up;
    if (prev && ['IDS-ACCORDION-HEADER', 'IDS-MODULE-NAV-ITEM'].includes(prev.tagName)) {
      prev = prev.parentElement as IdsAccordionPanel;
    }

    // If this pane has been closed, navigate to previous item outside this pane
    while (prev?.parentElement?.tagName === 'IDS-ACCORDION-PANEL' && !(prev.parentElement as IdsAccordionPanel).expanded) {
      prev = prev.parentElement as IdsAccordionPanel;
    }

    // If there's no previous sibiling, navigate to the previous highest pane
    if (!prev) {
      prev = currentItem?.parentElement as IdsAccordionPanel;
    }

    // If previous is not an accordion panel, consider that we've 'looped'
    // back around to the top and pick the first header
    if (!prev || prev.tagName !== 'IDS-ACCORDION-PANEL') {
      prev = getLastPanel();
    }

    prev?.focus();
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

  /**
   * Collapses all child accordion panels at once
   * @param {IdsAccordionPanel | null | undefined} [excluded] if provided,
   *   excludes this accordion header from being collapsed
   * @returns {void}
   */
  collapseAll(excluded?: IdsAccordionPanel | null) {
    if (this.panels.length) {
      this.panels.forEach((panel) => {
        if (!excluded || panel !== excluded) {
          panel.setAttribute(attributes.EXPANDED, String(false));
        }
      });
    }
  }
}

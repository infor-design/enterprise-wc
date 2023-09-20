import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { ALIGNMENT_TYPES, applyContentAlignmentClass } from './ids-accordion-common';

import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';

import IdsAccordionHeader from './ids-accordion-header';
import styles from './ids-accordion-panel.scss';

const Base = IdsColorVariantMixin(
  IdsKeyboardMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Accordion Panel Component
 * @type {IdsAccordionPanel}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsEventsMixin
 */
@customElement('ids-accordion-panel')
@scss(styles)
export default class IdsAccordionPanel extends Base {
  paneOpenListener?: () => void;

  paneCloseListener?: () => void;

  constructor() {
    super();
    this.state = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.#setTitles();
    this.#attachEventHandlers();
    this.#refreshContentAlignment(this.contentAlignment);
    this.#toggleExpanderDisplay();
    this.#toggleExpanded(this.expanded);
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.EXPANDED
    ];
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

  vetoableEventTypes = ['beforeexpanded', 'beforecollapsed'];

  /**
   * Create a unique title for each accordion pane
   * @private
   */
  #setTitles() {
    const identifier = Math.floor(10000 + Math.random() * 90000);
    this.pane?.setAttribute('title', `ids-accordion-pane-${identifier}`);
  }

  /**
   * When the accordion's color variant is set, push this change through to include a check on the expander icon
   */
  onColorVariantRefresh() {
    this.#toggleExpanderDisplay();
  }

  /**
   * Sets a CSS class containing alignment rules for text/icons/images on this accordion panel
   * @param {string|null} val the new alignment rule to set
   */
  set contentAlignment(val) {
    let thisAlignment = null;
    if (ALIGNMENT_TYPES.includes(val)) {
      thisAlignment = val;
    }

    if (this.state.contentAlignment !== thisAlignment) {
      this.state.contentAlignment = thisAlignment;
      this.#refreshContentAlignment(thisAlignment);
      if (this.header) {
        this.header?.refreshContentAlignment(thisAlignment);
      }
    }
  }

  /**
   * @returns {string|null} representing how icons/text/images are currently aligned
   */
  get contentAlignment() {
    return this.state.contentAlignment;
  }

  /**
   * Visually updates the alignment of icons/text/images in the accordion panel
   * @param {*} thisAlignment the alignment rule to set
   */
  #refreshContentAlignment(thisAlignment = null) {
    if (this.container) {
      applyContentAlignmentClass(this.container?.classList, thisAlignment);
      this.container.classList[this.hasParentPanel ? 'add' : 'remove']('is-child-panel');
    }
  }

  /**
   * @readonly
   * @returns {HTMLElement} the parent accordion component
   */
  get accordion(): any {
    return this.closest('ids-accordion');
  }

  /**
   * @readonly
   * @returns {HTMLElement|null} the provided header, if applicable
   */
  get header(): any {
    return this.querySelector('[slot="header"]');
  }

  /**
   * @readonly
   * @returns {HTMLElement|null} the expander button
   */
  get expander(): HTMLElement | undefined | null {
    return this.container?.querySelector('.ids-accordion-panel-expander');
  }

  /**
   * @readonly
   * @returns {HTMLElement|null} the inner expand/collapse pane element
   */
  get pane(): HTMLElement | undefined | null {
    return this.container?.querySelector('.ids-accordion-pane');
  }

  /**
   * @readonly
   * @returns {boolean} true if this pane resides inside another pane
   */
  get hasParentPanel(): boolean {
    return this.parentElement?.tagName === 'IDS-ACCORDION-PANEL';
  }

  /**
   * @readonly
   * @returns {boolean} true if this pane resides in an expanded parent pane
   */
  get parentExpanded(): boolean {
    return this.hasParentPanel && (this.parentElement as IdsAccordionPanel)?.expanded;
  }

  /**
   * @readonly
   * @returns {boolean} true if this accordion panel has child content
   * (aside from its header) and can be expanded/collapsed
   */
  get isExpandable(): boolean {
    return [...this.children].length > 1;
  }

  /**
   * Set the expanded property
   * @param {boolean} value true/false
   */
  set expanded(value: boolean) {
    const isValueTruthy = stringToBool(value);
    const currentValue = this.expanded;

    if (isValueTruthy) {
      const canExpand = this.triggerVetoableEvent('beforeexpanded', this);
      if (!canExpand) return;
      this.setAttribute(attributes.EXPANDED, `${value}`);
    } else {
      const canCollapse = this.triggerVetoableEvent('beforecollapsed', this);
      if (!canCollapse) return;
      this.removeAttribute(attributes.EXPANDED);
    }

    if (isValueTruthy !== currentValue) {
      this.#toggleExpanded(isValueTruthy);
    }
  }

  /**
   * Get the expanded property
   * @returns {boolean} the expanded property
   */
  get expanded(): boolean {
    return stringToBool(this.getAttribute(attributes.EXPANDED));
  }

  /**
   * The main state switching function
   * Collapses sibling panels if allowOnePane setting is true
   * @param {boolean} isExpanded true if the panel is to be expanded
   * @returns {void}
   * @private
   */
  #toggleExpanded(isExpanded: boolean): void {
    this.header?.setAttribute('aria-expanded', `${isExpanded}`);

    if (!isExpanded) {
      this.collapsePane();
    } else {
      this.expandPane();
      if (this.accordion.allowOnePane) {
        this.#collapseSiblingPanels();
      }
    }
  }

  /**
   * Collapses sibling ids-accordion-panels
   * @returns {void}
   * @private
   */
  #collapseSiblingPanels(): void {
    const panels = [...this.parentElement?.querySelectorAll<IdsAccordionPanel>(':scope > ids-accordion-panel') ?? []];

    panels.forEach((panel) => {
      if (panel !== this && panel.expanded) {
        panel.expanded = false;
      }
    });
  }

  /**
   * Toggles expansion on this pane, and selects its header
   * @returns {void}
   */
  #selectAndToggle(): void {
    this.expanded = !this.expanded;
    this.select(this);
  }

  /**
   * Hides/Shows an Accordion Header's expander icon
   * @returns {void}
   */
  #toggleExpanderDisplay(): void {
    if (this.header instanceof IdsAccordionHeader) {
      this.header.toggleExpanderIcon(this.isExpandable);
    }
  }

  /**
   * @returns {boolean} true if this panel appears "nested"
   */
  get nested(): boolean {
    return !!this.container?.classList?.contains('nested');
  }

  /**
   * @param {boolean} val true if this panel should appear "nested"
   */
  set nested(val: boolean) {
    this.container?.classList[stringToBool(val) ? 'add' : 'remove']('nested');
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
    this.header.disabled = disabled;

    if (disabled) {
      this.setAttribute(attributes.DISABLED, `${disabled}`);
      this.setAttribute(attributes.TABINDEX, '-1');
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.removeAttribute(attributes.TABINDEX);
    }
  }

  /**
   * Collapse the expandable area pane.
   * @private
   * @returns {void}
   */
  collapsePane(): void {
    requestAnimationFrame(() => {
      if (!this.pane) {
        return;
      }

      // Remove any pre-existing Open listener that may still be in progress
      if (this.paneOpenListener) {
        this.pane.removeEventListener('transitionend', this.paneOpenListener);
        delete this.paneOpenListener;
      }

      this.pane.style.height = `${this.pane.scrollHeight}px`;
      this.container?.classList.remove('expanded');

      if (this.header) {
        this.header.expanded = false;
      }

      requestAnimationFrame(() => {
        if (!this.pane) {
          return;
        }

        // Setting height to "0" kicks off animation
        this.pane.style.height = `0px`;
        this.paneCloseListener = () => {
          if (this.pane) {
            this.pane.style.display = 'none';
          }
        };
        this.pane.addEventListener('transitionend', this.paneCloseListener, { once: true });
      });
    });
  }

  /**
   * Expand the expandable area pane.
   * @private
   * @returns {void}
   */
  expandPane(): void {
    if (!this.pane || !this.isExpandable) {
      return;
    }

    // Remove any pre-existing Close listener that may still be in progress
    if (this.paneCloseListener) {
      this.pane.removeEventListener('transitionend', this.paneCloseListener);
      delete this.paneCloseListener;
    }

    this.pane.style.display = 'block';

    requestAnimationFrame(() => {
      this.container?.classList.add('expanded');

      if (this.header) {
        this.header.expanded = true;
      }

      // Setting height kicks off animation
      if (this.pane) {
        this.pane.style.height = `${this.pane.scrollHeight}px`;
        this.paneOpenListener = () => {
          // NOTE: `auto` height allows for nested accordions to expand
          // when their content is displayed
          if (this.pane) {
            this.pane.style.height = 'auto';
          }
        };
        this.pane.addEventListener('transitionend', this.paneOpenListener, { once: true });
      }
    });
  }

  /**
   * Sets up event listeners
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    this.onEvent('click', this.expander, () => {
      if (!this.disabled) {
        this.#selectAndToggle();
      }
    });

    this.listen('Enter', this.expander, (e: { stopPropagation: () => void; }) => {
      e.stopPropagation();
      if (!this.disabled) {
        this.#selectAndToggle();
      }
    });

    this.listen(' ', this.expander, (e: { stopPropagation: () => void; }) => {
      e.stopPropagation();
      if (!this.disabled) {
        this.#selectAndToggle();
      }
    });

    this.onEvent('touchend', this.expander, (e: { touches: string | any[]; }) => {
      if (e.touches && e.touches.length > 0) {
        this.#selectAndToggle();
      }
    }, {
      passive: true
    });

    this.onEvent('slotchange', this, () => {
      this.#toggleExpanderDisplay();
    });
  }

  /**
   * Select the prev/next panel
   * @param {IdsAccordionPanel} panel The panel to be selected
   * @returns {void}
   */
  select(panel: this): void {
    if (panel?.tagName === 'IDS-ACCORDION-PANEL') {
      this.header.selected = true;
      panel.focus();
    }
  }

  /**
   * Passes focus from the Panel to its Header component
   * @returns {void}
   */
  focus(): void {
    this.header.focus();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <div class="ids-accordion-panel">
        <div class="ids-accordion-panel-expander">
          <slot name="header"></slot>
        </div>
        <div class="ids-accordion-pane">
          <div class="ids-accordion-pane-content">
            <slot name="content"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

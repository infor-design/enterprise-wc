// Import Core
import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

// Import Base and Mixins
import Base from './ids-accordion-panel-base';

// Import Dependencies
import IdsAccordionHeader from './ids-accordion-header';

// Import Utils
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { ALIGNMENT_TYPES, applyContentAlignmentClass } from './ids-accordion-common';

// Import Styles
import styles from './ids-accordion-panel.scss';

/**
 * IDS Accordion Panel Component
 * @type {IdsAccordionPanel}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 */
@customElement('ids-accordion-panel')
@scss(styles)
export default class IdsAccordionPanel extends Base {
  constructor() {
    super();
    this.state = {};
  }

  connectedCallback() {
    super.connectedCallback?.();
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
      attributes.EXPANDED,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['app-menu', 'sub-app-menu'];

  /**
   * Create a unique title for each accordion pane
   * @private
   */
  #setTitles() {
    const identifier = Math.floor(10000 + Math.random() * 90000);
    this.pane?.setAttribute('title', `ids-accordion-pane-${identifier}`);
  }

  /**
   * Overrides the setter from `IdsColorVariantMixin` to include a check on the expander icon
   * @param {string} val the desired color variant
   */
  set colorVariant(val) {
    super.colorVariant = val;
    this.#toggleExpanderDisplay();
  }

  /**
   * @returns {string} the current color variant
   */
  get colorVariant() {
    return super.colorVariant;
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
      this.header.refreshContentAlignment(thisAlignment);
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
    applyContentAlignmentClass(this.container.classList, thisAlignment);
  }

  /**
   * @readonly
   * @returns {HTMLElement|null} the provided header, if applicable
   */
  get header() {
    return this.querySelector('[slot="header"]');
  }

  /**
   * @readonly
   * @returns {HTMLElement|null} the expander button
   */
  get expander() {
    return this.container.querySelector('.ids-accordion-panel-expander');
  }

  /**
   * @readonly
   * @returns {HTMLElement|null} the inner expand/collapse pane element
   */
  get pane() {
    return this.container.querySelector('.ids-accordion-pane');
  }

  /**
   * @readonly
   * @returns {boolean} true if this pane resides inside another pane
   */
  get hasParentPanel() {
    return this.parentElement.tagName === 'IDS-ACCORDION-PANEL';
  }

  /**
   * @readonly
   * @returns {boolean} true if this pane resides in an expanded parent pane
   */
  get parentExpanded() {
    return this.hasParentPanel && this.parentElement.expanded;
  }

  /**
   * @readonly
   * @returns {boolean} true if this accordion panel has child content
   * (aside from its header) and can be expanded/collapsed
   */
  get isExpandable() {
    return [...this.children].length > 1;
  }

  /**
   * Set the expanded property
   * @param {string} value true/false
   */
  set expanded(value) {
    const isValueTruthy = stringToBool(value);
    const currentValue = this.expanded;

    if (isValueTruthy) {
      this.setAttribute(attributes.EXPANDED, `${value}`);
    } else {
      this.removeAttribute(attributes.EXPANDED);
    }

    if (isValueTruthy !== currentValue) {
      this.#toggleExpanded(isValueTruthy);
    }
  }

  /**
   * Get the expanded property
   * @returns {string} the expanded property
   */
  get expanded() {
    return stringToBool(this.getAttribute(attributes.EXPANDED));
  }

  /**
   * The main state switching function
   * @param {boolean} isExpanded true if the panel is to be expanded
   * @returns {void}
   * @private
   */
  #toggleExpanded(isExpanded) {
    this.header?.setAttribute('aria-expanded', `${isExpanded}`);
    if (!isExpanded) {
      this.collapsePane();
    } else {
      this.expandPane();
    }
  }

  /**
   * Toggles expansion on this pane, and selects its header
   * @returns {void}
   */
  #selectAndToggle() {
    this.expanded = !this.expanded;
    this.select(this);
  }

  /**
   * Hides/Shows an Accordion Header's expander icon
   * @returns {void}
   */
  #toggleExpanderDisplay() {
    if (this.header instanceof IdsAccordionHeader) {
      this.header.toggleExpanderIcon(this.isExpandable);
    }
  }

  /**
   * @returns {boolean} true if this panel appears "nested"
   */
  get nested() {
    return this.container.classList.contains('nested');
  }

  /**
   * @param {boolean} val true if this panel should appear "nested"
   */
  set nested(val) {
    this.container.classList[stringToBool(val) ? 'add' : 'remove']('nested');
  }

  /**
   * Collapse the expandable area pane.
   * @private
   * @returns {void}
   */
  collapsePane() {
    requestAnimationFrame(() => {
      if (!this.pane) {
        return;
      }

      // Remove any pre-existing Open listener that may still be in progress
      if (this.paneOpenListener) {
        this.pane.removeEventListener('transitionend', this.paneCloseListener);
        delete this.paneOpenListener;
      }

      this.pane.style.height = `${this.pane.scrollHeight}px`;
      this.container.classList.remove('expanded');

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
          this.pane.style.display = 'none';
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
  expandPane() {
    if (!this.pane || !this.isExpandable) {
      return;
    }

    // Remove any pre-existing Close listener that may still be in progress
    if (this.paneCloseListener) {
      this.pane.removeEventListener('transitionend', this.paneCloseListener);
      delete this.paneCloseListener;
    }

    this.pane.style.display = '';

    requestAnimationFrame(() => {
      this.container.classList.add('expanded');

      if (this.header) {
        this.header.expanded = true;
      }

      // Setting height kicks off animation
      this.pane.style.height = `${this.pane.scrollHeight}px`;
      this.paneOpenListener = () => {
        // NOTE: `auto` height allows for nested accordions to expand
        // when their content is displayed
        this.pane.style.height = 'auto';
      };
      this.pane.addEventListener('transitionend', this.paneOpenListener, { once: true });
    });
  }

  /**
   * Sets up event listeners
   * @private
   * @returns {void}
   */
  #attachEventHandlers() {
    this.onEvent('click', this.expander, () => {
      this.#selectAndToggle();
    });

    this.listen('Enter', this.expander, (e) => {
      e.stopPropagation();
      this.#selectAndToggle();
    });

    this.listen(' ', this.expander, (e) => {
      e.stopPropagation();
      this.#selectAndToggle();
    });

    this.onEvent('touchstart', this.expander, (e) => {
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
  select(panel) {
    if (panel === undefined) {
      return;
    }
    this.header.selected = true;
    panel.focus();
  }

  /**
   * Passes focus from the Panel to its Header component
   * @returns {void}
   */
  focus() {
    this.header.focus();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
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

import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

import {
  IdsColorVariantMixin,
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin,
} from '../../mixins';

import IdsAccordionHeader from './ids-accordion-header';
import { stringToBool } from '../../utils/ids-string-utils';
import styles from './ids-accordion-panel.scss';

/**
 * IDS Accordion Panel Component
 * @type {IdsAccordionPanel}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-accordion-panel')
@scss(styles)
class IdsAccordionPanel extends mix(IdsElement).with(
    IdsColorVariantMixin,
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin,
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();

    /** @type {HTMLElement | null } */
    this.expander = this.shadowRoot?.querySelector('.ids-accordion-panel-expander');
    this.header = this.querySelector('[slot="header"]');
    this.pane = this.shadowRoot?.querySelector('.ids-accordion-pane');
    this.#setTitles();
    this.#attachEventHandlers();
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
  availableColorVariants = ['app-menu', 'sub-app-menu'];

  /**
   * Create a unique title for each accordion pane
   * @private
   */
  #setTitles() {
    const identifier = Math.floor(10000 + Math.random() * 90000);
    this.pane?.setAttribute('title', `ids-accordion-pane-${identifier}`);
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
      this.header.expanded = false;

      requestAnimationFrame(() => {
        /* istanbul ignore next */
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
    if (!this.pane) {
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
      this.header.expanded = true;

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
      /* istanbul ignore next */
      if (e.touches && e.touches.length > 0) {
        this.#selectAndToggle();
      }
    }, {
      passive: true
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

export default IdsAccordionPanel;

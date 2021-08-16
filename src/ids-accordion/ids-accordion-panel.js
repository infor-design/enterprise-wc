import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base';

import { IdsEventsMixin, IdsKeyboardMixin } from '../ids-mixins';
import styles from './ids-accordion-panel.scss';

/**
 * IDS Accordion Panel Component
 * @type {IdsAccordionPanel}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-accordion-panel')
@scss(styles)
class IdsAccordionPanel extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
  constructor() {
    super();
    this.state = {};
  }

  connectedCallback() {
    this.expander = this.shadowRoot?.querySelector('.ids-accordion-panel-expander');
    this.header = this.querySelector('[slot="header"]');
    this.pane = this.shadowRoot?.querySelector('.ids-accordion-pane');
    this.#setTitles();
    this.handleEvents();
    this.#switchState();
  }

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
    if (value) {
      this.setAttribute(attributes.EXPANDED, value);
    } else {
      this.setAttribute(attributes.EXPANDED, 'false');
    }
    this.#switchState();
  }

  /**
   * Get the expanded property
   * @returns {string} the expanded property
   */
  get expanded() { return this.getAttribute(attributes.EXPANDED); }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [attributes.EXPANDED];
  }

  /**
   * The main state switching function
   * @returns {void}
   * @private
   */
  #switchState() {
    this.state.expanded = this.getAttribute(attributes.EXPANDED) === 'true' || false;
    this.header?.setAttribute('aria-expanded', this.state.expanded);

    if (!this.state.expanded) {
      this.collapsePane();
    } else {
      this.expandPane();
    }
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

      this.pane.style.height = `${this.pane.scrollHeight}px`;
      requestAnimationFrame(() => {
        /* istanbul ignore next */
        if (!this.pane) {
          return;
        }
        this.pane.style.height = `0px`;
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
    this.pane.style.height = `${this.pane.scrollHeight}px`;
  }

  /**
   * Sets the expanded state attribute
   * @private
   * @returns {void}
   */
  setAttributes() {
    this.setAttribute(attributes.EXPANDED, this.getAttribute(attributes.EXPANDED) === 'true' ? 'false' : 'true');
  }

  /**
   * Sets up event listeners
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.onEvent('click', this.expander, () => {
      this.setAttributes();
    });

    this.listen('Enter', this.expander, () => {
      this.setAttributes();
    });

    this.listen(' ', this.expander, () => {
      this.setAttributes();
    });

    this.listen('ArrowDown', this.expander, () => {
      this.select(this.getNextPanel(this));
    });

    this.listen('ArrowUp', this.expander, () => {
      this.select(this.getPrevPanel(this));
    });

    this.onEvent('touchstart', this.expander, (e) => {
      /* istanbul ignore next */
      if (e.touches && e.touches.length > 0) {
        this.setAttributes();
      }
    }, {
      passive: true
    });
  }

  /**
   * Get the next panel element
   * @private
   * @param {object} panel The current panel element
   * @returns {object} The next panel element
   */
  getNextPanel(panel) {
    const next = panel.nextElementSibling;

    /* eslint-disable */
    if (next === null) {
      return;
    } else {
      return next;
    }
    /* eslint-enable */
  }

  /**
   * Get the next panel element
   * @private
   * @param {object} panel The current panel element
   * @returns {object} The previous panel element
   */
  getPrevPanel(panel) {
    const prev = panel.previousElementSibling;

    /* eslint-disable */
    if (prev === null) {
      return;
    } else {
      return prev;
    }
    /* eslint-enable */
  }

  /**
   * Select the prev/next panel
   * @private
   * @param {object} panel The panel to be selected
   */
  select(panel) {
    if (panel === undefined) {
      return;
    }
    const header = panel.querySelector('ids-accordion-header').shadowRoot.querySelector('.ids-accordion-header');
    header.setAttribute('tabindex', '0');
    header.focus();
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

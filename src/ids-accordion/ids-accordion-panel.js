import {
  IdsElement,
  customElement,
  scss,
  mix,
  props
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';

// @ts-ignore
import styles from './ids-accordion-panel.scss';

/**
 * IDS AccordionPanel Component
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
    this.keyboard = new IdsKeyboardMixin();
  }

  connectedCallback() {
    /** @type {HTMLElement | null } */
    this.expander = this.shadowRoot?.querySelector('.ids-accordion-panel-expander');
    /** @type {HTMLElement | null } */
    this.header = this.querySelector('[slot="header"]');
    /** @type {HTMLElement | null } */
    this.pane = this.shadowRoot?.querySelector('.ids-accordion-pane');
    this.setTitles();
    this.handleEvents();
    this.switchState();
  }

  /**
   * Create a unique title for each accordion pane.
   */
  setTitles() {
    const identifier = Math.floor(10000 + Math.random() * 90000);
    this.pane?.setAttribute('title', `ids-accordion-pane-${identifier}`);
  }

  /**
   * Set the expanded property
   * @param {string} value true/false
   */
  set expanded(value) {
    if (value) {
      this.setAttribute(props.EXPANDED, value);
    } else {
      this.setAttribute(props.EXPANDED, 'false');
    }
    this.switchState();
  }

  /**
   * Get the expanded property
   * @returns {string} the expanded property
   */
  get expanded() { return this.getAttribute(props.EXPANDED); }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.EXPANDED];
  }

  /**
   * The main state switching function
   * @returns {void}
   */
  switchState() {
    this.state.expanded = this.getAttribute(props.EXPANDED) === 'true' || false;
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
    this.setAttribute(props.EXPANDED, this.getAttribute(props.EXPANDED) === 'true' ? 'false' : 'true');
  }

  /**
   * Sets up event listeners
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.on('click', this.expander, () => {
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

    this.on('touchstart', this.expander, (e) => {
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
        <div class="ids-accordion-pane" role="region">
          <div class="ids-accordion-pane-content">
            <slot name="content"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

export default IdsAccordionPanel;

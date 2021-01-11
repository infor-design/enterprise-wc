import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import styles from './ids-accordion-panel.scss';
import { props } from '../ids-base/ids-constants';

/**
 * IDS Tag Component
 */
@customElement('ids-accordion-panel')
@scss(styles)
class IdsAccordionPanel extends IdsElement {
  constructor() {
    super();
    this.state = {};
    this.keyboard = new IdsKeyboardMixin();
  }

  connectedCallback() {
    this.expander = this.shadowRoot.querySelector('.ids-accordion-panel-expander');
    this.header = this.querySelector('[slot="header"]');
    this.pane = this.shadowRoot.querySelector('.ids-accordion-pane');
    this.setTitles();
    this.handleEvents();
    this.switchState();
  }

  /**
   * Create a unique title for each accordion pane.
   */
  setTitles() {
    const identifier = Math.floor(10000 + Math.random() * 90000);
    this.pane.setAttribute('title', `ids-accordion-pane-${identifier}`);
  }

  /**
   * Set the expanded property
   * @param {boolean} value true/false
   */
  set expanded(value) {
    if (value) {
      this.setAttribute(props.EXPANDED, value);
    } else {
      this.setAttribute(props.EXPANDED, false);
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
      this.pane.style.height = `${this.pane.scrollHeight}px`;
      requestAnimationFrame(() => {
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
    this.eventHandlers = new IdsEventsMixin();

    this.eventHandlers.addEventListener('click', this.expander, () => {
      this.setAttributes();
    });

    this.keyboard.listen('Enter', this.expander, () => {
      this.setAttributes();
    });

    this.keyboard.listen(' ', this.expander, () => {
      this.setAttributes();
    });

    this.keyboard.listen('ArrowDown', this.expander, () => {
      this.select(this.getNextPanel(this));
    });

    this.keyboard.listen('ArrowUp', this.expander, () => {
      this.select(this.getPrevPanel(this));
    });

    this.eventHandlers.addEventListener('touchstart', this.expander, (e) => {
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

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
    this.expander = this.querySelector('[slot="header"]');
    this.pane = this.shadowRoot.querySelector('.ids-accordion-pane');
    this.setTitles();
    this.handleEvents();
    this.switchState();
  }

  setTitles() {
    this.pane?.setAttribute('title', `${this.expander?.innerText}`);
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
    this.expander?.setAttribute('aria-expanded', this.state.expanded);
    this.pane?.setAttribute('data-expanded', this.state.expanded);

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

    if (this.expander) {
      this.eventHandlers.addEventListener('click', this.expander, () => {
        this.setAttributes();
      });
      this.keyboard.listen('Enter', this.expander, () => {
        this.setAttributes();
      });
    }
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-accordion-panel" data-expanded="false">
        <slot name="header"></slot>
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

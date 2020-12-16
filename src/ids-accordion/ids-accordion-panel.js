import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsExampleMixin } from '../ids-base/ids-example-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import styles from './ids-accordion-panel.scss';
import { props } from '../ids-base/ids-constants';

/**
 * IDS Tag Component
 */
@customElement('ids-accordion-panel')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsExampleMixin)
class IdsAccordionPanel extends IdsElement {
  constructor() {
    super();
    this.state = {};
    this.expander = this.querySelector('[slot="header"]');
    this.pane = this.shadowRoot.querySelector('.ids-accordion-pane');
    this.keyboard = new IdsKeyboardMixin();

    console.log(this);
  }

  /**
   * ExpandedArea `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    this.createTitles();
    this.handleEvents();
    this.switchState();
  }

  createTitles() {
    const accordionPane = this.shadowRoot.querySelector('.ids-accordion-pane');
    accordionPane.setAttribute('title', `${this.expander.innerText}`);
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.EXPANDED
    ]
  }

  /**
 * Identify just the `expanded` attribute as an observed attribute
 * @private
 * @returns {Array}
 */
  static get observedAttributes() {
    return [props.EXPANDED]
  }

  /**
   * When `expanded` changes value, execute switchState()
   * @param {string} name
   */
  attributeChangedCallback(name) {
    if (name === props.EXPANDED) {
      this.switchState();
    }
  }

  /**
   * The main state switching function
   * @private
   * @returns {void}
   */
  switchState() {
    this.state.expanded = this.getAttribute(props.EXPANDED) === 'true' || false;
    this.expander.setAttribute('aria-expanded', this.state.expanded);
    this.pane.setAttribute('data-expanded', this.state.expanded);

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
    this.eventHandlers.addEventListener('click', this.expander, () => {
      this.setAttributes();
    });
    this.keyboard.listen('Enter', this.expander, () => {
      this.setAttributes();
    });
  }

  /**
   * Inner template contents
   * @private
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
    `
  }
}

export default IdsAccordionPanel;

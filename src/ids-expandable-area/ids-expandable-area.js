import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsExampleMixin } from '../ids-base/ids-example-mixin';
import styles from './ids-expandable-area.scss';
import { props } from '../ids-base/ids-constants';

/**
 * IDS Tag Component
 */
@customElement('ids-expandable-area')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsExampleMixin)
class IdsExpandableArea extends IdsElement {
  constructor() {
    super();
    this.state = {};
    this.expander = this.shadowRoot.querySelector('.ids-expandable-area-expander');
    this.expanderTextDefault = this.shadowRoot.querySelector('[name="expander-text-default"]');
    this.expanderTextExpanded = this.shadowRoot.querySelector('[name="expander-text-expanded"]');
    this.pane = this.shadowRoot.querySelector('.ids-expandable-area-pane');
  }

  /**
   * ExpandedArea `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    this.setAttribute('role', 'region');
    this.handleEvents();
    this.switchState();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.EXPANDED
    ];
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
   * Inner template contents
   * @private
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-expandable-area">
        <slot name="header"></slot>
        <div class="ids-expandable-area-pane" data-expanded="false">
          <slot name="pane"></slot>
        </div>
        <a class="ids-expandable-area-expander" href="#0" role="button" aria-expanded="false">
          <slot name="expander-text-default"></slot>
          <slot name="expander-text-expanded" hidden></slot>
        </a>
      </div>
    `;
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
    this.expanderTextDefault.hidden = this.state.expanded;
    this.expanderTextExpanded.hidden = !this.state.expanded;

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
   * Sets up event listeners
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.eventHandlers.addEventListener('click', this.expander, () => {
      this.setAttribute(props.EXPANDED, this.getAttribute(props.EXPANDED) === 'true' ? 'false' : 'true')
    });
  }
}

export default IdsExpandableArea;

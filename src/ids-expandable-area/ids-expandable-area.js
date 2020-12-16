import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsExampleMixin } from '../ids-base/ids-example-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import styles from './ids-expandable-area.scss';
import { props } from '../ids-base/ids-constants';

const EXPANDABLE_AREA_TYPES = [
  'toggle-btn'
]

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
    this.expander = this.shadowRoot.querySelector('[data-expander]');
    this.expanderDefault = this.shadowRoot.querySelector('[name="expander-default"]');
    this.expanderExpanded = this.shadowRoot.querySelector('[name="expander-expanded"]');
    this.pane = this.shadowRoot.querySelector('.ids-expandable-area-pane');
    this.keyboard = new IdsKeyboardMixin();
  }

  /**
   * ExpandedArea `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    this.handleEvents();
    this.switchState();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.EXPANDED,
      props.TYPE
    ];
  }

  /**
   * Set the type
   * @param {string} value The Type [null, toggle-btn]
   */
  set type(value) {
    if (value === EXPANDABLE_AREA_TYPES[0]) {
      this.setAttribute(props.TYPE, value);
      return;
    } else {
      this.setAttribute(props.TYPE, null);
    }
    this.removeAttribute(props.TYPE);
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Set the expanded property
   * @param {boolean} value true/false
   */
  set expanded(value) {
    if (value) {
      this.setAttribute(props.EXPANDED, value);
      return;
    }
  }

  /**
   * Get the expanded property
   */
  get expanded() { return this.getAttribute(props.EXPANDED); }

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

    // Hide/show the text link if default
    if (this.type === null) {
      this.expanderDefault.hidden = this.state.expanded;
      this.expanderExpanded.hidden = !this.state.expanded;
    }

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
    let expander;
    
    if (this.type === EXPANDABLE_AREA_TYPES[0]) {
      expander = this.querySelector('ids-toggle-button');
    } else {
      expander = this.expander;
    }

    this.eventHandlers.addEventListener('click', expander, () => {
      this.setAttributes();
    });

    this.eventHandlers.addEventListener('touchstart', expander, (e) => {
      if (e.touches && e.touches.length > 0) {
        this.setAttributes();
      }
    }, {
      passive: true
    });
  }

  /**
   * Inner template contents
   * @private
   * @returns {string} The template
   */
  template() {
    if (this.type === EXPANDABLE_AREA_TYPES[0]) {
      return `
        <div class="ids-expandable-area">
          <div class="ids-expandable-area-header" aria-expanded="false" data-expander="header">
            <slot name="header"></slot>
          </div>
          <div class="ids-expandable-area-pane" data-expanded="false">
            <slot name="pane"></slot>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="ids-expandable-area">
          <div class="ids-expandable-area-header">
            <slot name="header"></slot>
          </div>
          <div class="ids-expandable-area-pane" data-expanded="false">
            <slot name="pane"></slot>
          </div>
          <div class="ids-expandable-area-footer">
            <a class="ids-expandable-area-expander" href="#0" role="button" aria-expanded="false" data-expander="link">
              <slot name="expander-default"></slot>
              <slot name="expander-expanded" hidden></slot>
            </a>
          </div>
        </div>
      `;
    }
  }
}

export default IdsExpandableArea;

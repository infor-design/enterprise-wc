import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsExampleMixin } from '../ids-base/ids-example-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
// @ts-ignore
import styles from './ids-expandable-area.scss';
import { props } from '../ids-base/ids-constants';

const EXPANDABLE_AREA_TYPES = [
  'toggle-btn'
];

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
    this.keyboard = new IdsKeyboardMixin();
  }

  connectedCallback() {
    /** @type {HTMLElement} */ this.expander = this.shadowRoot.querySelector('[data-expander]');
    /** @type {HTMLElement} */ this.expanderDefault = this.shadowRoot.querySelector('[name="expander-default"]');
    /** @type {HTMLElement} */ this.expanderExpanded = this.shadowRoot.querySelector('[name="expander-expanded"]');
    /** @type {HTMLElement} */ this.pane = this.shadowRoot.querySelector('.ids-expandable-area-pane');
    this.handleEvents();
    this.switchState();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.EXPANDED, props.TYPE];
  }

  /**
   * Set the type
   * @param {string} value The Type [null, toggle-btn]
   */
  set type(value) {
    if (value === EXPANDABLE_AREA_TYPES[0]) {
      this.setAttribute(props.TYPE, value);
    } else {
      this.setAttribute(props.TYPE, null);
    }
  }

  get type() { return this.getAttribute(props.TYPE); }

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
   * The main state switching function
   * @returns {void}
   */
  switchState() {
    this.expanderDefault = this.shadowRoot.querySelector('[name="expander-default"]');
    this.expanderExpanded = this.shadowRoot.querySelector('[name="expander-expanded"]');
    this.state.expanded = this.getAttribute(props.EXPANDED) === 'true' || false;
    this.expander.setAttribute('aria-expanded', this.state.expanded);

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
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    let template;
    if (this.type === EXPANDABLE_AREA_TYPES[0]) {
      template = `
        <div class="ids-expandable-area">
          <div class="ids-expandable-area-header" aria-expanded="false" data-expander="header">
            <slot name="header"></slot>
          </div>
          <div class="ids-expandable-area-pane">
            <slot name="pane"></slot>
          </div>
        </div>
      `;
    } else {
      template = `
        <div class="ids-expandable-area">
          <div class="ids-expandable-area-header">
            <slot name="header"></slot>
          </div>
          <div class="ids-expandable-area-pane">
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
    return template;
  }
}

export default IdsExpandableArea;

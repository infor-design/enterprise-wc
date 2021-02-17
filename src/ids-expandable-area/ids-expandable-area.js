import {
  IdsElement,
  customElement,
  scss,
  props,
  mix
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';

// @ts-ignore
import styles from './ids-expandable-area.scss';

const EXPANDABLE_AREA_TYPES = [
  'toggle-btn'
];

/**
 * IDS Expandable Area Component
 * @type {IdsExpandableArea}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-expandable-area')
@scss(styles)
class IdsExpandableArea extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
    this.state = {};
  }

  connectedCallback() {
    /** @type {HTMLElement | undefined | null} */
    this.expander = this.shadowRoot?.querySelector('[data-expander]');
    /** @type {HTMLElement | undefined | null} */
    // @ts-ignore
    this.expanderDefault = this.shadowRoot?.querySelector('[name="expander-default"]');
    /** @type {HTMLElement | undefined | null} */
    // @ts-ignore
    this.expanderExpanded = this.shadowRoot?.querySelector('[name="expander-expanded"]');
    /** @type {HTMLElement | undefined | null} */
    this.pane = this.shadowRoot?.querySelector('.ids-expandable-area-pane');
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
   * @param {string | null} value The Type [null, toggle-btn]
   */
  set type(value) {
    if (value === EXPANDABLE_AREA_TYPES[0]) {
      this.setAttribute(props.TYPE, value);
    } else {
      this.setAttribute(props.TYPE, '');
    }
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Set the expanded property
   * @param {string | null} value true/false
   */
  set expanded(value) {
    if (value) {
      this.setAttribute(props.EXPANDED, value);
    } else {
      this.setAttribute(props.EXPANDED, 'false');
    }
    this.switchState();
  }

  get expanded() { return this.getAttribute(props.EXPANDED); }

  /**
   * The main state switching function
   * @returns {void}
   */
  switchState() {
    this.expanderDefault = this.shadowRoot?.querySelector('[name="expander-default"]');
    this.expanderExpanded = this.shadowRoot?.querySelector('[name="expander-expanded"]');
    this.state.expanded = this.getAttribute(props.EXPANDED) === 'true' || false;
    this.expander?.setAttribute('aria-expanded', this.state.expanded);

    // Hide/show the text link if default
    if (this.type === null && this.expanderDefault && this.expanderExpanded) {
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
      if (!this.pane) {
        return;
      }

      this.pane.style.height = `${this.pane?.scrollHeight}px`;
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
    this.onEvent('click', this.expander, () => {
      this.setAttributes();
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

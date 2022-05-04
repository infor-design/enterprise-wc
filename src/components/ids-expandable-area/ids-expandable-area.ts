import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { EXPANDABLE_AREA_TYPES } from './ids-exandable-area-attributes';
import Base from './ids-exandable-area-base';

import styles from './ids-expandable-area.scss';

/**
 * IDS Expandable Area Component
 * @type {IdsExpandableArea}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @part container - the main container element
 * @part header - the header element
 * @part pane - the expandable pane element
 * @part footer - the footer element
 */
@customElement('ids-expandable-area')
@scss(styles)
export default class IdsExpandableArea extends Base {
  /**
   * @returns {Array<string>} Expandable area vetoable events
   */
  vetoableEventTypes = ['beforecollapse', 'beforeexpand'];

  constructor() {
    super();
    this.state = {};
  }

  connectedCallback(): void {
    this.expander = this.shadowRoot?.querySelector('[data-expander]');
    this.expanderDefault = this.shadowRoot?.querySelector('[name="expander-default"]');
    this.expanderExpanded = this.shadowRoot?.querySelector('[name="expander-expanded"]');
    this.pane = this.shadowRoot?.querySelector('.ids-expandable-area-pane');
    this.#attachEventHandlers();
    this.switchState();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [attributes.EXPANDED, attributes.TYPE, attributes.MODE, attributes.VERSION];
  }

  /**
   * Set the type
   * @param {string | null} value The Type [null, toggle-btn]
   */
  set type(value: string) {
    if (EXPANDABLE_AREA_TYPES.indexOf(value) !== -1) {
      this.setAttribute(attributes.TYPE, value);
    } else {
      this.setAttribute(attributes.TYPE, '');
    }
  }

  get type() { return this.getAttribute(attributes.TYPE); }

  /**
   * Set the expanded property
   * @param {string | boolean | null} value true/false
   */
  set expanded(value: string | boolean | null) {
    if (value) {
      this.setAttribute(attributes.EXPANDED, value);
    } else {
      this.setAttribute(attributes.EXPANDED, 'false');
    }
    this.switchState();
  }

  get expanded(): string | null {
    return this.getAttribute(attributes.EXPANDED);
  }

  /**
   * The main state switching function
   * @returns {void}
   */
  switchState(): void {
    const expanded = this.expanded === 'true' || false;
    this.expanderDefault = this.shadowRoot?.querySelector('[name="expander-default"]');
    this.expanderExpanded = this.shadowRoot?.querySelector('[name="expander-expanded"]');
    this.expander?.setAttribute('aria-expanded', expanded);

    // Hide/show the text link if default
    if (this.type !== EXPANDABLE_AREA_TYPES[0] && this.expanderDefault && this.expanderExpanded) {
      this.expanderDefault.hidden = expanded;
      this.expanderExpanded.hidden = !expanded;
    }

    if (!expanded) {
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
  collapsePane(): void {
    if (!this.pane) {
      return;
    }

    const canCollapse = this.triggerVetoableEvent('beforecollapse', this);

    if (!canCollapse) {
      this.expanded = true;
      return;
    }

    if (this.state.expanded) {
      requestAnimationFrame(() => {
        this.triggerEvent('collapse', this, { detail: { elem: this } });
        this.pane.style.height = `${this.pane?.scrollHeight}px`;
        this.pane.style.height = `0px`;
      });
    }

    this.state.expanded = false;
  }

  /**
   * Expand the expandable area pane.
   * @private
   * @returns {void}
   */
  expandPane(): void {
    if (!this.pane) {
      return;
    }

    const canExpand = this.triggerVetoableEvent('beforeexpand', this);
    if (!canExpand) {
      this.expanded = false;
      return;
    }

    if (this.state.expanded === false) {
      requestAnimationFrame(() => {
        this.triggerEvent('expand', this, { detail: { elem: this } });
        this.pane.style.height = `${this.pane.scrollHeight}px`;
      });
    }

    this.state.expanded = true;
  }

  /**
   * Sets the expanded state attribute
   * @returns {void}
   */
  setAttributes(): void {
    this.setAttribute(attributes.EXPANDED, this.getAttribute(attributes.EXPANDED) === 'true' ? 'false' : 'true');
  }

  /**
   * Sets up event listeners
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    this.onEvent('click', this.expander, () => {
      this.setAttributes();
    });

    this.onEvent('touchstart', this.expander, (e: any) => {
      if (e.touches && e.touches.length > 0) {
        this.setAttributes();
      }
    }, {
      passive: true
    });

    this.onEvent('transitionend', this.pane, () => {
      const eventOpts = {
        detail: { elem: this }
      };

      if (this.pane.style.height === '0px') {
        this.triggerEvent('aftercollapse', this, eventOpts);
      } else {
        this.triggerEvent('afterexpand', this, eventOpts);
      }
    });
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    let header = `
      <div class="ids-expandable-area-header" part="header">
        <slot name="header"></slot>
      </div>
    `;
    let pane = `
      <div class="ids-expandable-area-pane" part="pane">
        <div class="expandable-pane-content">
          <slot name="pane"></slot>
        </div>
      </div>
    `;
    let footer = `
      <div class="ids-expandable-area-footer" part="footer">
        <a class="ids-expandable-area-expander" href="#0" role="button" aria-expanded="false" data-expander="link">
          <slot name="expander-default"></slot>
          <slot name="expander-expanded" hidden></slot>
        </a>
      </div>
    `;

    if (this.type === EXPANDABLE_AREA_TYPES[0]) { // Toggle Button Type
      header = `
        <div class="ids-expandable-area-header" part="header" aria-expanded="false" data-expander="header">
          <slot name="header"></slot>
        </div>
      `;
      footer = '';
    } else if (this.type === EXPANDABLE_AREA_TYPES[1]) { // Partial Pane Type
      pane = `
        <div class="ids-expandable-area-visible-pane">
          <div class="expandable-pane-content">
            <slot name="visible-pane-content"></slot>
          </div>
        </div>
        ${pane}
      `;
    }

    const template = `
      <div class="ids-expandable-area" part="container">
        ${header}
        ${pane}
        ${footer}
      </div>
    `;

    return template;
  }
}

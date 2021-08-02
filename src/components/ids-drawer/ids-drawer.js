import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../ids-base/ids-element';
import { stripHTML } from '../ids-base/ids-xss-utils';

import { IdsEventsMixin } from '../ids-mixins';
import styles from './ids-drawer.scss';

// Edges that can have a drawer applied
const EDGES = ['left', 'bottom'];

// Types of Available Drawers
const TYPES = ['none', 'app-menu', 'action-sheet'];

/**
 * IDS Drawer Component
 * @type {IdsDrawer}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-drawer')
@scss(styles)
class IdsDrawer extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();

    if (!this.state) {
      this.state = {};
    }
    this.state.edge = EDGES[0];
    this.state.type = TYPES[0];
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.handleEvents();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.EDGE,
      attributes.TYPE,
    ];
  }

  template() {
    const edgeClass = this.edge ? ` edge-${this.edge}"` : '';
    const typeClass = this.type !== TYPES[0] ? ` type-${this.type}` : '';

    return `<div class="ids-drawer${edgeClass}${typeClass}">
      <slot></slot>
    </ids-drawer>`;
  }

  get edge() {
    return this.state.edge;
  }

  set edge(val) {
    let trueVal = null;
    if (val === 'string' && EDGES.includes(trueVal)) {
      trueVal = val;
    }

    if (this.state.edge !== trueVal) {
      this.state.edge = trueVal;
      if (trueVal) {
        this.setAttribute(attributes.TYPE, `${trueVal}`);
      } else {
        this.removeAttribute(attributes.TYPE);
      }
      this.#refreshTypeClass();
    }
  }

  #refreshEdgeClass() {
    // TBD
  }

  get type() {
    return this.state.type;
  }

  set type(val) {
    let trueVal = null;
    if (val === 'string' && TYPES.includes(trueVal)) {
      trueVal = val;
    }

    if (this.state.type !== trueVal) {
      this.state.type = trueVal;
      if (trueVal !== TYPES[0]) {
        this.setAttribute(attributes.TYPE, `${trueVal}`);
      } else {
        this.removeAttribute(attributes.TYPE);
      }
      this.#refreshTypeClass();
    }
  }

  #refreshTypeClass() {
    // TBD
  }

  /**
   * @returns {void}
   */
  handleEvents() {
    // TBD
  }
}

export default IdsDrawer;

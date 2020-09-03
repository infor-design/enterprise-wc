import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import styles from './ids-popup.scss';

// Locations in which a parent-positioned Popup can be located
const ALIGNMENT_EDGES = [undefined, 'bottom', 'top', 'left', 'right'];

// Methods for X/Y-coordinate alignment against a parent
const ALIGNMENTS_X = ['center', 'left', 'right'];
const ALIGNMENTS_Y = ['center', 'top', 'bottom'];

/**
 * IDS Popup Component
 */
@customElement('ids-popup')
@scss(styles)
@mixin(IdsEventsMixin)
class IdsPopup extends IdsElement {
  constructor() {
    super();
    this.alignment = {};
    this.coords = {};
    this.shouldUpdate = true;
  }

  connectedCallBack() {
    this.handleEvents();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      'align',
      'align-edge',
      'align-target',
      'x',
      'y'
    ];
  }

  /**
   * @returns {HTMLElement} reference to the `content-wrapper` element
   */
  get wrapper() {
    return this.shadowRoot.querySelector('.content-wrapper');
  }

  /**
   * @param {string} val a CSS selector string
   */
  set alignTarget(val) {
    if (typeof val !== 'string' || !val.length) {
      this.alignment.target = undefined;
      return;
    }

    // @TODO Harden for security (XSS)
    const elem = document.querySelector(val);
    if (!(elem instanceof HTMLElement)) {
      return;
    }

    this.alignment.target = elem;
    this.refresh();
  }

  /**
   * @returns {HTMLElement} the element in the page that the Popup will take
   * coordinates from for relative placement
   */
  get alignTarget() {
    return this.alignment.target;
  }

  /**
   * @param {string} val a comma-delimeted set of alignment types (x, y)
   */
  set align(val) {
    this.shouldUpdate = false;
    const vals = val.split(',');

    vals[0] = vals[0].trim().toLowerCase();
    this.alignX = vals[0];

    if (typeof vals[1] === 'string') {
      vals[1] = vals[1].trim().toLowerCase();
      this.alignY = vals[1];
    }
    this.shouldUpdate = true;
    this.refresh();
  }

  /**
   * @returns {string} a DOM-friendly string reprentation of alignment types
   */
  get align() {
    return `${this.alignX}, ${this.alignY}`;
  }

  /**
   * @param {string} val strategy for the parent X alignment (see the ALIGNMENTS_X array)
   */
  set alignX(val) {
    if (typeof val !== 'string' || !val.length) {
      return;
    }

    if (ALIGNMENTS_X.includes(val)) {
      this.alignment.x = val;
    } else {
      this.alignment.x = ALIGNMENTS_X[0];
    }

    this.refresh();
  }

  /**
   * @returns {string} alignment strategy for the current parent X alignment
   */
  get alignX() {
    return this.alignment.x;
  }

  /**
   * @param {string} val alignment strategy for the Y coordinate (see the ALIGNMENTS_Y array)
   */
  set alignY(val) {
    if (typeof val !== 'string' || !val.length) {
      return;
    }

    if (ALIGNMENTS_Y.includes(val)) {
      this.alignment.y = val;
    } else {
      this.alignment.y = ALIGNMENTS_Y[0];
    }

    this.refresh();
  }

  /**
   * @returns {string} alignment strategy for the current parent Y alignment
   */
  get alignY() {
    return this.alignment.y;
  }

  /**
   * @param {string} val specifies the edge of the parent element to be placed adjacent,
   * in configurations where a relative placement occurs
   */
  set alignEdge(val) {
    if (typeof val !== 'string' || !val.length) {
      return;
    }

    // If alignment target is present, use bottom/top/left/right.
    // Otherwise, no edge alignment is possible.
    let edge;
    if (this.alignTarget) {
      if (ALIGNMENT_EDGES.includes(val)) {
        edge = val;
      } else {
        edge = ALIGNMENT_EDGES[1];
      }
    } else {
      edge = ALIGNMENT_EDGES[0];
    }

    this.alignment.edge = edge;
    this.refresh();
  }

  /**
   * @returns {string} representing the current adjacent edge of the parent element
   */
  get alignEdge() {
    return this.alignment.edge;
  }

  /**
   * Sets the X (left) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set x(val) {
    const trueVal = parseInt(val, 10);
    if (!Number.isNaN(trueVal)) {
      this.coords.x = trueVal;
    }
    this.refresh();
  }

  /**
   * @returns {number} representing the Popup's current CSS `top` value
   */
  get x() {
    return this.coords.x;
  }

  /**
   * Sets the Y (left) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set y(val) {
    const trueVal = parseInt(val, 10);
    if (!Number.isNaN(trueVal)) {
      this.coords.y = trueVal;
    }
    this.refresh();
  }

  /**
   * @returns {number} representing the Popup's current CSS `left` value
   */
  get y() {
    return this.coords.y;
  }

  /**
   * Calculates the current placement of the Popup
   */
  refresh() {
    if (!this.shouldUpdate) {
      return;
    }

    // If no alignment target is present, do a simple x/y coordinate placement.
    const alignTarget = this.alignTarget;
    if (!alignTarget) {
      this.container.style.left = !Number.isNaN(this.x) ? `${this.x}px` : 'auto';
      this.container.style.top = !Number.isNaN(this.y) ? `${this.y}px` : 'auto';
      return;
    }

    let x = !Number.isNaN(this.x) ? this.x : 0;
    let y = !Number.isNaN(this.y) ? this.y : 0;

    // Detect sizes/locations of the popup and the alignment target Element
    const popupRect = this.container.getBoundingClientRect();
    const targetRect = this.alignTarget.getBoundingClientRect();
    const alignEdge = this.alignEdge;

    /*
     * NOTE: All calculatations are based on the top/left corner of the element rectangles.
     */
    // If alignment edge is top or bottom, the defined Y coordinate is used as an offset,
    // and the X position will be set using the provided X alignment rule (or centered by default)
    // and use the defined X coordinate as a X offset.
    if (['top', 'bottom'].includes(alignEdge)) {
      if (alignEdge === 'top') {
        y = targetRect.top - popupRect.height - y;
      }
      if (alignEdge === 'bottom') {
        y = targetRect.bottom + y;
      }

      switch (this.alignX) {
        case 'left':
          x = targetRect.left + x;
          break;
        case 'right':
          x = targetRect.right - popupRect.width + x;
          break;
        default: // center
          x = (targetRect.left + targetRect.width / 2) - popupRect.width / 2 + x;
      }
    }

    // If alignment edge is left or right, the defined X coordinate is used as an offset,
    // and the Y position will be set using the provided Y alignment rule (or centered by default)
    // and use the defined Y coordinate as a Y offset.
    if (['left', 'right'].includes(alignEdge)) {
      if (alignEdge === 'left') {
        x = targetRect.left - popupRect.width - x;
      }

      if (alignEdge === 'right') {
        x = targetRect.right + x;
      }

      switch (this.alignY) {
        case 'top':
          y = targetRect.top + y;
          break;
        case 'bottom':
          y = targetRect.bottom - popupRect.height + y;
          break;
        default: // center
          y = (targetRect.top + targetRect.height / 2) - (popupRect.height / 2) + y;
      }
    }

    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<span class="ids-popup">
      <div class="content-wrapper">
        <slot name="content"></slot>
      </div>
    </span>`;
  }

  /**
   * Establish Internal Event Handlers
   * @private
   */
  handleEvents() {
    this.eventHandlers.addEventListener('log', this.shadowRoot.querySelector('slot'), () => {
      console.log('events');
    });
  }
}

export default IdsPopup;

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
const ALIGNMENTS_EDGES_X = ALIGNMENTS_X.filter((x) => x !== 'center');
const ALIGNMENTS_EDGES_Y = ALIGNMENTS_Y.filter((y) => y !== 'center');

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
    this.refresh();
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
      this.refresh();
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
    let vals = val.split(',');
    vals = vals.map((thisVal) => thisVal.trim().toLowerCase());

    this.alignEdge = vals[0];

    // If there's no second value, assume it's 'center'
    if (!vals[1]) {
      vals.push('center');
    }

    // If the values are defined in reverse (y, x), switch them
    if (ALIGNMENTS_EDGES_Y.includes(vals[0]) || ALIGNMENTS_EDGES_X.includes(vals[1])) {
      const val1 = vals[1];
      vals[1] = vals[0];
      vals[0] = val1;
    }

    this.alignX = vals[0];
    this.alignY = vals[1];

    this.shouldUpdate = true;
    this.refresh();
  }

  /**
   * @returns {string} a DOM-friendly string reprentation of alignment types
   */
  get align() {
    const { alignX, alignY } = this;
    const edge = this.alignEdge;
    const center = 'center';

    if (ALIGNMENTS_EDGES_Y.includes(edge)) {
      if (alignX === center) {
        return `${edge}`;
      }
      return `${edge}, ${alignX}`;
    }
    if (alignY === 'center') {
      return `${edge}`;
    }
    return `${edge}, ${alignY}`;
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

    // Build a resize observer is one doesn't exist
    // (this doesn't need updating)
    if (!this.ro && typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => {
        this.refresh();
      });
      this.ro.observe(this.parentNode);
    }

    // If no alignment target is present, do a simple x/y coordinate placement.
    const { alignTarget } = this;
    if (!alignTarget) {
      this.container.style.left = !Number.isNaN(this.x) ? `${this.x}px` : 'auto';
      this.container.style.top = !Number.isNaN(this.y) ? `${this.y}px` : 'auto';

      // Remove an established MutationObserver if one exists.
      if (this.mo) {
        this.mo.disconnect();
        delete this.mo;
      }

      return;
    }

    let x = !Number.isNaN(this.x) ? this.x : 0;
    let y = !Number.isNaN(this.y) ? this.y : 0;

    // Setup a MutationObserver on the alignTarget that will cause this Popup instance
    // to move itself whenever an attribute that controls size is changed.
    // This can help adjust the popup automatically when its target moves.
    // @TODO: Implement a way to detect CSS property changes on the alignTarget.
    // @TODO: this should probably also update if the `alignTarget` changes to something else,
    // but we don't currently have a way to detect that.
    if (!this.mo && typeof MutationObserver !== 'undefined') {
      this.mo = new MutationObserver((mutation) => {
        switch (mutation.type) {
          case 'childList':
            break;
          default: // 'attributes'
            this.refresh();
        }
      });

      // connect the alignTarget
      this.mo.observe(this.alignTarget, {
        attributes: true,
        attributeFilter: ['style', 'height', 'width'],
        attributeOldValue: true,
        subtree: true
      });
    }

    // Detect sizes/locations of the popup and the alignment target Element
    const popupRect = this.container.getBoundingClientRect();
    const targetRect = this.alignTarget.getBoundingClientRect();
    const { alignEdge } = this;

    /*
     * NOTE: All calculatations are based on the top/left corner of the element rectangles.
     */
    // If alignment edge is top or bottom, the defined Y coordinate is used as an offset,
    // and the X position will be set using the provided X alignment rule (or centered by default)
    // and use the defined X coordinate as a X offset.
    if (ALIGNMENTS_Y.includes(alignEdge)) {
      switch (alignEdge) {
        case 'top':
          y = targetRect.top - popupRect.height - y;
          break;
        case 'bottom':
          y = targetRect.bottom + y;
          break;
        default: // center
          y = (targetRect.top + targetRect.height / 2) - (popupRect.height / 2) + y;
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
    if (ALIGNMENTS_X.includes(alignEdge)) {
      switch (alignEdge) {
        case 'left':
          x = targetRect.left - popupRect.width - x;
          break;
        case 'right':
          x = targetRect.right + x;
          break;
        default: // center
          x = (targetRect.left + targetRect.width / 2) - popupRect.width / 2 + x;
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

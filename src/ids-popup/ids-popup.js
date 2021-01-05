import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../ids-render-loop/ids-render-loop-mixin';
import { IdsResizeMixin } from '../ids-base/ids-resize-mixin';
import styles from './ids-popup.scss';

const CENTER = 'center';

// Locations in which a parent-positioned Popup can be located
const ALIGNMENT_EDGES = [CENTER, 'bottom', 'top', 'left', 'right'];

// Methods for X/Y-coordinate alignment against a parent
const ALIGNMENTS_X = [CENTER, 'left', 'right'];
const ALIGNMENTS_Y = [CENTER, 'top', 'bottom'];
const ALIGNMENTS_EDGES_X = ALIGNMENTS_X.filter((x) => x !== CENTER);
const ALIGNMENTS_EDGES_Y = ALIGNMENTS_Y.filter((y) => y !== CENTER);

// Types of Popups
const TYPES = ['none', 'menu', 'menu-alt', 'tooltip', 'tooltip-alt'];

// Properties exposed with getters/setters
// safeSet/RemoveAttribute also use these so we pull them out
const POPUP_PROPERTIES = [
  'align',
  'align-x',
  'align-y',
  'align-edge',
  'align-target',
  props.ANIMATED,
  props.TYPE,
  props.VISIBLE,
  'x',
  'y'
];

/**
 * Formats the text value of the `align` attribute.
 * @private
 * @param {string} alignX matches a value from the ALIGNMENTS_X array
 * @param {string} alignY matches a value from the ALIGNMENTS_Y array
 * @param {string} edge matches a value from the ALIGNMENT_EDGES array
 * @returns {string} containing the properly formatted align value
 */
function formatAlignAttribute(alignX, alignY, edge) {
  // Check the edge for a "Y" alignment
  if (ALIGNMENTS_EDGES_Y.includes(edge)) {
    if (!alignX || !alignX.length || alignX === CENTER) {
      return `${edge}`;
    }
    return `${edge}, ${alignX}`;
  }

  // Alignment is definitely "X"
  if (!alignY || !alignY.length || alignY === CENTER) {
    return `${alignX}`;
  }
  if (edge === CENTER) {
    return `${alignY}`;
  }
  return `${edge}, ${alignY}`;
}

/**
 * IDS Popup Component
 */
@customElement('ids-popup')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsRenderLoopMixin)
@mixin(IdsResizeMixin)
class IdsPopup extends IdsElement {
  constructor() {
    super();
    this.alignment = {
      edge: ALIGNMENT_EDGES[0],
      target: undefined,
      x: ALIGNMENTS_X[0],
      y: ALIGNMENTS_Y[0]
    };
    this.coords = {
      x: 0,
      y: 0
    };
    this.isVisible = false;
    this.isAnimated = false;
    this.trueType = 'none';
    this.shouldUpdate = true;
  }

  /**
   * `IdsElement.prototype.connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    this.animated = this.hasAttribute('animated');
    this.trueType = this.getAttribute('type') || this.trueType;
    this.isVisible = this.hasAttribute('visible');
    this.setupDetectMutations();
    this.setupResize();
    this.handleEvents();
    this.refresh();
  }

  /**
   * Custom Element `disconnectedCallback` implementation
   * @private
   * @returns {void}
   */
  disconnectedCallback() {
    IdsElement.prototype.disconnectedCallback.apply(this);

    if (this.shouldResize()) {
      this.ro.unobserve(this.parentNode);
      this.disconnectResize();
    }

    if (this.shouldDetectMutations()) {
      this.disconnectDetectMutations();
    }
  }

  /**
   * Override `attributeChangedCallback` from IdsElement to wrap its normal operation in a
   * check for a true `shouldUpdate` property.
   * @private
   * @param  {string} name The property name
   * @param  {string} oldValue The property old value
   * @param  {string} newValue The property new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shouldUpdate) {
      IdsElement.prototype.attributeChangedCallback.apply(this, [name, oldValue, newValue]);
    }
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return POPUP_PROPERTIES;
  }

  /**
   * @readonly
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
      this.removeAttribute('align-target');
      this.refresh();
      return;
    }

    // @TODO Harden for security (XSS)
    const elem = document.querySelector(val);
    if (!(elem instanceof HTMLElement)) {
      return;
    }

    this.alignment.target = elem;
    this.setAttribute('align-target', val);
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

    let trueVal = val;
    if (typeof trueVal !== 'string' || !trueVal.length) {
      trueVal = CENTER;
    }

    // Normalize values and store the first entry as the "edge" to align against
    let vals = trueVal.split(',');
    vals = vals.map((thisVal) => thisVal.trim().toLowerCase());

    // Adust the first value and set it as the "edge"
    const edge = vals[0];
    if (ALIGNMENT_EDGES.includes(edge)) {
      this.alignEdge = edge;
      vals[0] = this.alignEdge;
    }

    // If there's no second value, assumxae it's 'center'
    if (!vals[1]) {
      vals.push('center');
    }

    // If the values are defined in reverse (y, x), switch them
    if (ALIGNMENTS_EDGES_Y.includes(vals[0]) || ALIGNMENTS_EDGES_X.includes(vals[1])) {
      const val1 = vals[1];
      vals[1] = vals[0];
      vals[0] = val1;
    }

    // Update each alignment value if it's valid, and render the attribute
    let attrX;
    let attrY;
    if (ALIGNMENTS_X.includes(vals[0])) {
      attrX = vals[0];
      this.alignX = vals[0];
    } else {
      attrX = this.alignX;
    }
    if (ALIGNMENTS_Y.includes(vals[1])) {
      attrY = vals[1];
      this.alignY = vals[1];
    } else {
      attrY = this.alignY;
    }
    this.setAttribute('align', formatAlignAttribute(attrX, attrY, this.alignment.edge));

    this.shouldUpdate = true;
    this.refresh();
  }

  /**
   * @returns {string} a DOM-friendly string reprentation of alignment types
   */
  get align() {
    const { alignX, alignY } = this;
    const edge = this.alignEdge;
    return formatAlignAttribute(alignX, alignY, edge);
  }

  /**
   * @param {string} val strategy for the parent X alignment (see the ALIGNMENTS_X array)
   */
  set alignX(val) {
    if (typeof val !== 'string' || !val.length) {
      return;
    }

    let alignX = val;
    if (!ALIGNMENTS_X.includes(val)) {
      alignX = ALIGNMENTS_X[0];
    }

    this.alignment.x = alignX;
    const alignY = this.alignment.y;

    // If `align-x` was used directy, standardize against the `align` attribute
    if (this.hasAttribute('align-x')) {
      this.safeRemoveAttribute('align-x');
      this.align = formatAlignAttribute(alignX, alignY, alignX);
    } else if (this.shouldUpdate) {
      this.align = formatAlignAttribute(alignX, alignY, alignX);
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

    let alignY = ALIGNMENTS_Y[0];
    if (ALIGNMENTS_Y.includes(val)) {
      alignY = val;
    }

    this.alignment.y = alignY;
    const alignX = this.alignment.x;

    // If `align-y` was used directy, standardize against the `align` attribute
    if (this.hasAttribute('align-y')) {
      this.safeRemoveAttribute('align-y');
      this.align = formatAlignAttribute(alignX, alignY, alignY);
    } else if (this.shouldUpdate) {
      this.align = formatAlignAttribute(alignX, alignY, alignY);
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

    // Sanitize the alignment edge
    let edge;
    let alignX = this.alignment.x;
    let alignY = this.alignment.y;
    if (ALIGNMENT_EDGES.includes(val)) {
      edge = val;
      if (val === CENTER) {
        alignX = val;
        alignY = val;
      }
    } else {
      edge = ALIGNMENT_EDGES[0];
    }

    this.alignment.edge = edge;
    if (this.hasAttribute('align-edge')) {
      this.shouldUpdate = false;
      this.removeAttribute('align-edge');
      this.align = formatAlignAttribute(alignX, alignY, edge);
      this.shouldUpdate = true;
    } else if (this.shouldUpdate) {
      this.align = formatAlignAttribute(alignX, alignY, edge);
    }
    this.refresh();
  }

  /**
   * @returns {string} representing the current adjacent edge of the parent element
   */
  get alignEdge() {
    return this.alignment.edge;
  }

  /**
   * @param {boolean} val whether or not the component should animate its movement
   */
  set animated(val) {
    this.isAnimated = this.stringToBool(val);
    if (this.isAnimated) {
      this.safeSetAttribute('animated', true);
    } else {
      this.safeRemoveAttribute('animated');
    }
    this.refresh();
  }

  /**
   * @returns {boolean} whether or not the component is currently animating its movement.
   */
  get animated() {
    return this.isAnimated;
  }

  /**
   * @param {string} val containing a valid Popup type
   */
  set type(val) {
    if (val && TYPES.includes(val)) {
      this.trueType = val;
    }

    this.safeSetAttribute('type', this.trueType);
    this.refresh();
  }

  /**
   * @returns {string} representing the Popup type
   */
  get type() {
    return this.trueType;
  }

  /**
   * @param {boolean} val whether or not the component should be displayed
   */
  set visible(val) {
    this.isVisible = this.stringToBool(val);
    if (this.isVisible) {
      this.safeSetAttribute('visible', true);
    } else {
      this.safeRemoveAttribute('visible');
    }
    this.refresh();
  }

  /**
   * @returns {boolean} whether or not the component is currently displayed
   */
  get visible() {
    return this.isVisible;
  }

  /**
   * Sets the X (left) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set x(val) {
    let trueVal = parseInt(val, 10);
    if (Number.isNaN(trueVal)) {
      trueVal = 0;
    }

    this.coords.x = trueVal;
    this.setAttribute('x', trueVal);
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
    let trueVal = parseInt(val, 10);
    if (Number.isNaN(trueVal)) {
      trueVal = 0;
    }

    this.coords.y = trueVal;
    this.setAttribute('y', trueVal);
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

    // Attach to the global ResizeObserver
    // (this doesn't need updating)
    // @TODO possibly replace `this.parentNode` with IdsPopupBoundary (specifically to contain)
    if (this.shouldResize()) {
      this.ro.observe(this.parentNode);
    }

    // Set the Popup type
    const thisType = this.trueType;
    const thisCl = this.container.classList;
    TYPES.forEach((type) => {
      if (type !== thisType && thisCl.contains(type)) {
        thisCl.remove(type);
      } else if (type === thisType && !thisCl.contains(type)) {
        thisCl.add(type);
      }
    });

    // Make the popup actually render before doing placement calcs
    if (this.isVisible) {
      this.container.classList.add('visible');
    } else {
      this.container.classList.remove('open');
    }

    // If no alignment target is present, do a simple x/y coordinate placement.
    const { alignTarget } = this;
    if (!alignTarget) {
      // Remove an established MutationObserver if one exists.
      if (this.hasMutations) {
        this.mo.disconnect();
        this.disconnectDetectMutations();
        delete this.hasMutations;
      }

      this.placeAtCoords();
    } else {
      // connect the alignTarget to the global MutationObserver, if applicable.
      if (this.shouldDetectMutations() && !this.hasMutations) {
        this.mo.observe(this.alignTarget, {
          attributes: true,
          attributeFilter: ['style', 'height', 'width'],
          attributeOldValue: true,
          subtree: true
        });
        this.hasMutations = true;
      }

      this.placeAgainstTarget();
    }

    // Adds a RenderLoop-staggered check for whether to show the Popup.
    if (this.openCheck) {
      this.openCheck.destroy(true);
    }
    this.openCheck = this.rl.register(new IdsRenderLoopItem({
      duration: 70,
      timeoutCallback: () => {
        if (this.isVisible && !this.container.classList.contains('open')) {
          this.container.classList.add('open');
        }
        if (!this.isAnimated && this.container.classList.contains('animated')) {
          this.container.classList.remove('animated');
        }
      }
    }));

    // Adds another RenderLoop-staggered check for whether to hide the Popup.
    if (this.animatedCheck) {
      this.animatedCheck.destroy(true);
    }
    this.animatedCheck = this.rl.register(new IdsRenderLoopItem({
      duration: 200,
      timeoutCallback: () => {
        if (!this.isVisible && this.container.classList.contains('visible')) {
          this.container.classList.remove('visible');
        }
        if (this.isAnimated && !this.container.classList.contains('animated')) {
          this.container.classList.add('animated');
        }
      }
    }));
  }

  /**
   * Places the Popup using numeric x/y coordinates as a starting point.
   * @private
   * @returns {void}
   */
  placeAtCoords() {
    const popupRect = this.container.getBoundingClientRect();
    let x = this.x;
    let y = this.y;

    switch (this.alignX) {
      case 'right':
        x -= popupRect.width;
        break;
      case 'center':
        x -= popupRect.width / 2;
        break;
      default: // left
        break;
    }

    switch (this.alignY) {
      case 'bottom':
        y -= popupRect.height;
        break;
      case 'center':
        y -= popupRect.height / 2;
        break;
      default: // top
        break;
    }

    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
  }

  /**
   * Places the Popup using an external element as a starting point.
   * @private
   * @returns {void}
   */
  placeAgainstTarget() {
    let x = this.x;
    let y = this.y;

    // Detect sizes/locations of the popup and the alignment target Element
    const popupRect = this.container.getBoundingClientRect();
    const targetRect = this.alignTarget.getBoundingClientRect();
    const { alignEdge } = this;
    let alignXCentered = false;
    let alignYCentered = false;

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
          alignYCentered = true;
      }

      switch (this.alignX) {
        case 'left':
          x = targetRect.left + x;
          break;
        case 'right':
          x = targetRect.right - popupRect.width - x;
          break;
        default: // center
          x = (targetRect.left + targetRect.width / 2) - popupRect.width / 2 + x;
          alignXCentered = true;
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
          if (alignXCentered) {
            break;
          }
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
          if (alignYCentered) {
            break;
          }
          y = (targetRect.top + targetRect.height / 2) - (popupRect.height / 2) + y;
      }
    }

    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
  }

  /**
   * Turns off the ability of the popup to respond to attribute changes, in order to
   * set an attribute that may incorrectly change the popup's display/state otherwise.
   * @param {string} attr the attribute of the popup that will change, passed to `setAttribute`
   * @param {any} value the value to pass to `setAttribute`
   */
  safeSetAttribute(attr, value) {
    if (!POPUP_PROPERTIES.includes(attr)) {
      return;
    }

    const prev = this.shouldUpdate;
    this.shouldUpdate = false;
    this.setAttribute(attr, value);
    this.shouldUpdate = prev;
  }

  /**
   * Turns off the ability of the popup to respond to attribute changes, in order to
   * remove an attribute that may incorrectly change the popup's display/state otherwise.
   * @param {string} attr the attribute of the popup that will be removed
   */
  safeRemoveAttribute(attr) {
    if (!POPUP_PROPERTIES.includes(attr)) {
      return;
    }

    const prev = this.shouldUpdate;
    this.shouldUpdate = false;
    this.removeAttribute(attr);
    this.shouldUpdate = prev;
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
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.eventHandlers = new IdsEventsMixin();

    const slot = this.shadowRoot.querySelector('slot');
    this.eventHandlers.addEventListener('slotchange', slot, () => {
      this.refresh();
    });
  }
}

export default IdsPopup;

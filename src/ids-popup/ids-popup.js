import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';

import { props } from '../ids-base/ids-constants';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../ids-render-loop/ids-render-loop-mixin';

import { IdsStringUtilsMixin as stringUtils } from '../ids-base/ids-string-utils-mixin';
import { IdsResizeMixin } from '../ids-base/ids-resize-mixin';
// @ts-ignore
import styles from './ids-popup.scss';

const CENTER = 'center';

// Locations in which a parent-positioned Popup can be located
const ALIGNMENT_EDGES = [CENTER, 'bottom', 'top', 'left', 'right'];

// Methods for X/Y-coordinate alignment against a parent
const ALIGNMENTS_X = [CENTER, 'left', 'right'];
const ALIGNMENTS_Y = [CENTER, 'top', 'bottom'];
const ALIGNMENTS_EDGES_X = ALIGNMENTS_X.filter((x) => x !== CENTER);
const ALIGNMENTS_EDGES_Y = ALIGNMENTS_Y.filter((y) => y !== CENTER);

// Arrow Directions (defaults to 'none')
const ARROW_TYPES = ['none', 'bottom', 'top', 'left', 'right'];

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
  'arrow',
  'arrow-target',
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
    this.state = {
      arrow: ARROW_TYPES[0],
      arrowTarget: null,
    };
    this.isVisible = false;
    this.isAnimated = false;
    this.trueType = 'none';
    this.shouldUpdate = true;
  }

  /**
   * `IdsElement.prototype.connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    this.animated = this.hasAttribute('animated');
    this.trueType = this.getAttribute('type') || this.trueType;
    this.isVisible = this.hasAttribute('visible');
    // @ts-ignore
    this.setupDetectMutations();
    // @ts-ignore
    this.setupResize();
    this.handleEvents();
    this.refresh();
  }

  /**
   * Custom Element `disconnectedCallback` implementation
   * @returns {void}
   */
  disconnectedCallback() {
    IdsElement.prototype.disconnectedCallback.apply(this);

    // @ts-ignore
    if (this.shouldResize()) {
      // @ts-ignore
      this.ro.unobserve(this.resizeDetectionTarget());
      // @ts-ignore
      this.disconnectResize();
    }

    // @ts-ignore
    if (this.shouldDetectMutations()) {
      // @ts-ignore
      this.disconnectDetectMutations();
    }
  }

  /**
   * Override `attributeChangedCallback` from IdsElement to wrap its normal operation in a
   * check for a true `shouldUpdate` property.
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
   * Sets the element to align with via a css selector
   * @param {any} val ['string|HTMLElement'] a CSS selector string
   */
  // @ts-ignore
  set alignTarget(val) {
    const isString = typeof val === 'string' && val.length;
    const isElem = val instanceof HTMLElement;

    if (!isString && !isElem) {
      this.alignment.target = undefined;
      this.removeAttribute('align-target');
      this.refresh();
      return;
    }

    let elem;
    if (isString) {
      // @TODO Harden for security (XSS)
      elem = document.querySelector(val);
      if (!(elem instanceof HTMLElement)) {
        return;
      }
      this.setAttribute('align-target', val);
    } else {
      elem = val;
    }

    this.alignment.target = elem;
    this.refresh();
  }

  /**
   * @returns {HTMLElement} the element in the page that the Popup will take
   * coordinates from for relative placement
   */
  // @ts-ignore
  get alignTarget() {
    return this.alignment.target;
  }

  /**
   * Sets the alignment direction between left, right, top, bottom, center and can be a comma
   * delimited set of multiple alignment types for example `left, top`
   * @param {string} val a comma-delimited set of alignment types `direction1, direction2`
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
   * Strategy for the parent X alignment (see the ALIGNMENTS_X array)
   * @param {string} val the strategy to use
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
   * Strategy for the parent X alignment ((see the ALIGNMENTS_Y array)
   * @returns {string} the strategy to use
   */
  get alignX() {
    return this.alignment.x;
  }

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
   *  Specifies the edge of the parent element to be placed adjacent,
   *  in configurations where a relative placement occurs
   * @param {string} val The edge to align to
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
   * Whether or not the component should animate its movement
   * @param {boolean} val The alignment setting
   */
  set animated(val) {
    this.isAnimated = stringUtils.stringToBool(val);
    if (this.isAnimated) {
      this.safeSetAttribute('animated', true);
    } else {
      this.safeRemoveAttribute('animated');
    }
    this.refresh();
  }

  get animated() {
    return this.isAnimated;
  }

  /**
   * Specifies whether to show the Popup Arrow, and in which direction
   * @param {string} val the arrow direction.  Defaults to `none`
   */
  set arrow(val) {
    let trueVal = ARROW_TYPES[0];
    if (val && ARROW_TYPES.includes(val)) {
      trueVal = val;
    }
    if (trueVal !== ARROW_TYPES[0]) {
      this.safeSetAttribute('arrow', `${trueVal}`);
    } else {
      this.safeRemoveAttribute('arrow');
    }
    this.refresh();
  }

  /**
   * @returns {string|null} the arrow setting, or null
   */
  get arrow() {
    const attr = this.getAttribute('arrow');
    if (!attr) {
      return ARROW_TYPES[0];
    }
    return attr;
  }

  /**
   * @readonly
   * @returns {HTMLElement} referencing the internal arrow element
   */
  get arrowEl() {
    return this.container.querySelector('.arrow');
  }

  /**
   * Sets the element to align with via a css selector
   * @param {any} val ['string|HTMLElement'] a CSS selector string
   */
  // @ts-ignore
  set arrowTarget(val) {
    const isString = typeof val === 'string' && val.length;
    const isElem = val instanceof HTMLElement;

    if (!isString && !isElem) {
      this.state.arrowTarget = undefined;
      this.removeAttribute('arrow-target');
      this.refresh();
      return;
    }

    let elem;
    if (isString) {
      // @TODO Harden for security (XSS)
      elem = document.querySelector(val);
      if (!(elem instanceof HTMLElement)) {
        return;
      }
      this.setAttribute('arrow-target', val);
    } else {
      elem = val;
    }

    this.state.arrowTarget = elem;
    this.refresh();
  }

  /**
   * @returns {HTMLElement} the element in the page that the Popup will take
   * coordinates from for relative placement
   */
  // @ts-ignore
  get arrowTarget() {
    return this.state.arrowTarget;
  }

  /**
   * The style of popup to use between 'none', 'menu', 'menu-alt', 'tooltip', 'tooltip-alt'
   * @param {string} val The popup type
   */
  set type(val) {
    if (val && TYPES.includes(val)) {
      this.trueType = val;
    }

    this.safeSetAttribute('type', this.trueType);
    this.refresh();
  }

  get type() {
    return this.trueType;
  }

  /**
   * Whether or not the component should be displayed
   * @param {boolean} val a boolean for displaying or hiding the popup
   */
  set visible(val) {
    this.isVisible = stringUtils.stringToBool(val);
    if (this.isVisible) {
      this.safeSetAttribute('visible', true);
    } else {
      this.safeRemoveAttribute('visible');
    }
    this.refresh();
  }

  get visible() {
    return this.isVisible;
  }

  /**
   * Sets the X (left) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set x(val) {
    let trueVal = parseInt(val.toString(), 10);
    if (Number.isNaN(trueVal)) {
      trueVal = 0;
    }

    this.coords.x = trueVal;
    this.setAttribute('x', trueVal.toString());
    this.refresh();
  }

  get x() {
    return this.coords.x;
  }

  /**
   * Sets the Y (top) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set y(val) {
    let trueVal = parseInt(val.toString(), 10);
    if (Number.isNaN(trueVal)) {
      trueVal = 0;
    }

    this.coords.y = trueVal;
    this.setAttribute('y', trueVal.toString());
    this.refresh();
  }

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
    // @TODO possibly replace `this.resizeDetectionTarget()`
    // with IdsPopupBoundary (specifically to contain)
    // @ts-ignore
    if (this.shouldResize()) {
      // @ts-ignore
      this.ro.observe(this.resizeDetectionTarget());
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
      thisCl.add('visible');
    } else {
      thisCl.remove('open');
    }

    // Show/Hide Arrow class, if applicable
    const arrowClass = this.arrow;
    const arrowElCl = this.arrowEl.classList;
    ARROW_TYPES.forEach((type) => {
      if (type !== 'none' && type !== arrowClass) {
        arrowElCl.remove(type);
      }
    });
    if (this.arrow !== 'none' && !arrowElCl.contains(this.arrow)) {
      arrowElCl.add(this.arrow);
    }

    // If no alignment target is present, do a simple x/y coordinate placement.
    const { alignTarget } = this;
    if (!alignTarget) {
      // Remove an established MutationObserver if one exists.
      if (this.hasMutations) {
        // @ts-ignore
        this.mo.disconnect();
        // @ts-ignore
        this.disconnectDetectMutations();
        delete this.hasMutations;
      }

      this.placeAtCoords();
    } else {
      // connect the alignTarget to the global MutationObserver, if applicable.
      // @ts-ignore
      if (this.shouldDetectMutations() && !this.hasMutations) {
        // @ts-ignore
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

    // @ts-ignore
    this.openCheck = this.rl.register(new IdsRenderLoopItem({
      duration: 70,
      timeoutCallback: () => {
        if (this.isVisible) {
          // Always fire the 'show' event
          this.eventHandlers.dispatchEvent('show', this, {
            bubbles: true,
            detail: {
              elem: this
            }
          });
          this.container.classList.add('open');
        }
        if (!this.isAnimated && this.container.classList.contains('animated')) {
          this.container.classList.remove('animated');
        }

        // If an arrow is displayed, place it correctly.
        this.placeArrow();
      }
    }));

    // Adds another RenderLoop-staggered check for whether to hide the Popup.
    if (this.animatedCheck) {
      this.animatedCheck.destroy(true);
    }
    // @ts-ignore
    this.animatedCheck = this.rl.register(new IdsRenderLoopItem({
      duration: 200,
      timeoutCallback: () => {
        if (!this.isVisible) {
          // Always fire the 'hide' event
          this.eventHandlers.dispatchEvent('hide', this, {
            bubbles: true,
            detail: {
              elem: this
            }
          });
          // Remove the `visible` class if its there
          if (this.container.classList.contains('visible')) {
            this.container.classList.remove('visible');
          }
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

    // @ts-ignore
    this.container.style.left = `${x}px`;
    // @ts-ignore
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

    // @ts-ignore
    this.container.style.left = `${x}px`;
    // @ts-ignore
    this.container.style.top = `${y}px`;
  }

  /**
   * Handles alignment of an optional arrow element.  If an arrow target is specified,
   * the arrow is placed to align correctly against the target.
   * @returns {void}
   */
  placeArrow() {
    const arrow = this.arrow;
    const arrowEl = this.arrowEl;
    const element = this.alignTarget;
    const target = this.arrowTarget;
    if (arrow === 'none' || !element || !target) {
      arrowEl.setAttribute('hidden', '');
      return;
    }

    // Clear previous styles
    arrowEl.removeAttribute('hidden');
    arrowEl.style.marginLeft = '';
    arrowEl.style.marginTop = '';

    const arrowRect = arrowEl.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const newArrowRect = {};
    const targetMargin = (arrow === 'right' || arrow === 'left') ? 'marginTop' : 'marginLeft';

    let arrowHidden = false;
    let targetCenter = 0;
    let currentArrowCenter = 0;
    let d;

    // Figure out the distance needed to move the arrow to match the position of the `target`
    if (arrow === 'left' || arrow === 'right') {
      targetCenter = targetRect.top + (targetRect.height / 2);
      currentArrowCenter = arrowRect.top + (arrowRect.height / 2);
      d = targetCenter - currentArrowCenter;
      newArrowRect.top = arrowRect.top + d;
      newArrowRect.bottom = arrowRect.bottom + d;

      if (newArrowRect.top <= elementRect.top || newArrowRect.bottom >= elementRect.bottom) {
        arrowHidden = true;
      }
    }
    if (arrow === 'top' || arrow === 'bottom') {
      targetCenter = targetRect.left + (targetRect.width / 2);
      currentArrowCenter = arrowRect.left + (arrowRect.width / 2);
      d = targetCenter - currentArrowCenter;
      newArrowRect.left = arrowRect.left + d;
      newArrowRect.right = arrowRect.right + d;

      if (newArrowRect.left <= elementRect.left || newArrowRect.right >= elementRect.right) {
        arrowHidden = true;
      }
    }

    // Round the number up
    d = Math.ceil(d);

    // Hide the arrow if it goes beyond the element boundaries
    if (arrowHidden) {
      arrowEl.setAttribute('hidden', '');
    }
    arrowEl.style[targetMargin] = `${d}px`;
    console.log('place arrow');
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
    return `<div class="ids-popup">
      <div class="arrow"></div>
      <div class="content-wrapper">
        <slot name="content"></slot>
      </div>
    </div>`;
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

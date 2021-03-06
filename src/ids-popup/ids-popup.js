import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix,
  stringUtils
} from '../ids-base';

import IdsDOMUtils from '../ids-base/ids-dom-utils';

// Import Mixins
import {
  IdsEventsMixin,
  IdsRenderLoopMixin,
  IdsRenderLoopItem,
  IdsResizeMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-popup.scss';

const CENTER = 'center';

// Locations in which a parent-positioned Popup can be located
const ALIGNMENT_EDGES = [CENTER, 'bottom', 'top', 'left', 'right'];

// Methods for X/Y-coordinate alignment against a parent
const ALIGNMENTS_X = [CENTER, 'left', 'right'];
const ALIGNMENTS_Y = [CENTER, 'top', 'bottom'];
const ALIGNMENTS_EDGES_X = ALIGNMENTS_X.filter((x) => x !== CENTER);
const ALIGNMENTS_EDGES_Y = ALIGNMENTS_Y.filter((y) => y !== CENTER);

// Possible animation styles for the Popup
const ANIMATION_STYLES = [
  'fade',
  'scale-in'
];

// Arrow Directions (defaults to 'none')
const ARROW_TYPES = ['none', 'bottom', 'top', 'left', 'right'];

// Position types
const POSITION_STYLES = ['fixed', 'absolute'];

// Types of Popups
const TYPES = ['none', 'menu', 'menu-alt', 'modal', 'tooltip', 'tooltip-alt'];

// Properties exposed with getters/setters
// safeSet/RemoveAttribute also use these so we pull them out
const POPUP_PROPERTIES = [
  attributes.ALIGN,
  attributes.ALIGN_X,
  attributes.ALIGN_Y,
  attributes.ALIGN_EDGE,
  attributes.ALIGN_TARGET,
  attributes.ARROW,
  attributes.ARROW_TARGET,
  attributes.ANIMATED,
  attributes.ANIMATION_STYLE,
  attributes.BLEED,
  attributes.POSITION_STYLE,
  attributes.TYPE,
  attributes.VISIBLE,
  attributes.X,
  attributes.Y
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
 * @type {IdsPopup}
 * @inherits IdsElement
 * @mixes IdsRenderLoopMixin
 * @mixes IdsResizeMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part popup - the popup outer element
 * @part arrow - the arrow element
 */
@customElement('ids-popup')
@scss(styles)
class IdsPopup extends mix(IdsElement).with(
    IdsRenderLoopMixin,
    IdsResizeMixin,
    IdsEventsMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
    this.state = {
      alignEdge: ALIGNMENT_EDGES[0],
      alignTarget: undefined,
      alignX: ALIGNMENTS_X[0],
      alignY: ALIGNMENTS_Y[0],
      align: 'center',
      arrow: ARROW_TYPES[0],
      arrowTarget: null,
      animated: false,
      animationStyle: ANIMATION_STYLES[0],
      bleed: false,
      containingElem: document.body,
      positionStyle: POSITION_STYLES[0],
      visible: false,
      type: 'none',
      x: 0,
      y: 0
    };
    this.shouldUpdate = false;
  }

  /**
   * `IdsElement.prototype.connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();

    // Always setup link to containing element first
    this.containingElem = IdsDOMUtils.getClosest(this, 'ids-container') || document.body;

    this.animated = this.hasAttribute(attributes.ANIMATED);
    this.animationStyle = this.getAttribute(attributes.ANIMATION_STYLE) || this.animationStyle;
    this.#setAnimationStyle(this.animationStyle);

    this.state.type = this.getAttribute(attributes.TYPE) || this.state.type;
    this.#setPopupTypeClass(this.state.type);

    this.#setPositionStyle(this.state.positionStyle);

    this.state.visible = this.hasAttribute(attributes.VISIBLE);

    this.handleEvents();

    this.shouldUpdate = true;
    window.requestAnimationFrame(() => {
      this.refresh();
    });
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [...super.attributes, ...POPUP_PROPERTIES];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-popup" part="popup">
      <div class="arrow" part="arrow"></div>
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
    const slot = this.shadowRoot.querySelector('slot');
    this.onEvent('slotchange', slot, () => {
      this.refresh();
    });
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
   * @param {string | HTMLElement | undefined} val ['string|HTMLElement'] a CSS selector string
   */
  set alignTarget(val) {
    const isString = typeof val === 'string' && val.length;
    const isElem = val instanceof HTMLElement;

    if (!isString && !isElem) {
      if (this.state.alignTarget !== undefined) {
        this.state.alignTarget = undefined;
        this.removeAttribute(attributes.ALIGN_TARGET);
        this.refresh();
      }
      return;
    }

    let elem;
    if (isString) {
      // @TODO Harden for security (XSS)
      const rootNode = IdsDOMUtils.getClosestRootNode(this);
      elem = rootNode.querySelector(val);
      if (!(elem instanceof HTMLElement)) {
        return;
      }
      this.setAttribute(attributes.ALIGN_TARGET, val);
    } else {
      elem = val;
    }

    if (!this.state.alignTarget || !this.state.alignTarget.isEqualNode(elem)) {
      this.state.alignTarget = elem;
      this.refresh();
    }
  }

  /**
   * @returns {HTMLElement| undefined} the element in the page that the Popup will take
   * coordinates from for relative placement
   */
  get alignTarget() {
    return this.state.alignTarget;
  }

  /**
   * Sets the alignment direction between left, right, top, bottom, center and can be a comma
   * delimited set of multiple alignment types for example `left, top`
   * @param {string} val a comma-delimited set of alignment types `direction1, direction2`
   */
  set align(val) {
    const currentAlign = this.state.align;
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
      this.state.alignEdge = edge;
      vals[0] = this.state.alignEdge;
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
      this.state.alignX = vals[0];
    } else {
      attrX = this.alignX;
    }
    if (ALIGNMENTS_Y.includes(vals[1])) {
      attrY = vals[1];
      this.state.alignY = vals[1];
    } else {
      attrY = this.alignY;
    }

    const newAlign = formatAlignAttribute(attrX, attrY, this.state.alignEdge);
    const needsUpdatedAlign = currentAlign !== newAlign;
    if (needsUpdatedAlign) {
      this.state.align = newAlign;
      this.setAttribute(attributes.ALIGN, newAlign);
      this.refresh();
    } else if (!this.hasAttribute('align')) {
      this.setAttribute(attributes.ALIGN, currentAlign);
    }
  }

  /**
   * @returns {string} a DOM-friendly string reprentation of alignment types
   */
  get align() {
    return this.state.align;
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

    // If `align-x` was used directy, standardize against the `align` attribute.
    if (this.hasAttribute(attributes.ALIGN_X)) {
      this.removeAttribute(attributes.ALIGN_X);
    }

    if (this.state.alignX !== alignX) {
      this.state.alignX = alignX;
      const alignY = this.state.alignY;

      // Setting the `align` attribute causes a refresh to occur,
      // so no need to call `refresh()` here.
      this.align = formatAlignAttribute(alignX, alignY, alignX);
    }
  }

  /**
   * Strategy for the parent X alignment ((see the ALIGNMENTS_Y array)
   * @returns {string} the strategy to use
   */
  get alignX() {
    return this.state.alignX;
  }

  set alignY(val) {
    if (typeof val !== 'string' || !val.length) {
      return;
    }

    let alignY = ALIGNMENTS_Y[0];
    if (ALIGNMENTS_Y.includes(val)) {
      alignY = val;
    }

    // If `align-y` was used directy, standardize against the `align` attribute.
    if (this.hasAttribute(attributes.ALIGN_Y)) {
      this.removeAttribute(attributes.ALIGN_Y);
    }

    if (this.state.alignY !== alignY) {
      this.state.alignY = alignY;
      const alignX = this.state.alignX;

      // Setting the `align` attribute causes a refresh to occur,
      // so no need to call `refresh()` here.
      this.align = formatAlignAttribute(alignX, alignY, alignY);
    }
  }

  /**
   * @returns {string} alignment strategy for the current parent Y alignment
   */
  get alignY() {
    return this.state.alignY;
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
    if (ALIGNMENT_EDGES.includes(val)) {
      edge = val;
    } else {
      edge = ALIGNMENT_EDGES[0];
    }

    // `alignEdge` is standardized against `align` by way of being the "first" item
    // in the comma-delimited setting.
    if (this.hasAttribute(attributes.ALIGN_EDGE)) {
      this.removeAttribute(attributes.ALIGN_EDGE);
    }

    // Only update if the value has changed
    if (this.state.alignEdge !== edge) {
      let alignX = this.alignX;
      let alignY = this.alignY;

      this.state.alignEdge = edge;

      // Determine how to format the `align` property.
      // Using `alignEdge === 'center'` is shorthand for automatically centering the component.
      if (edge === 'center') {
        alignX = edge;
        alignY = edge;
      } else if (ALIGNMENTS_EDGES_Y.includes(edge)) {
        alignY = edge;
      } else {
        alignX = edge;
      }
      this.align = formatAlignAttribute(alignX, alignY, edge);
    }
  }

  /**
   * @returns {string} representing the current adjacent edge of the parent element
   */
  get alignEdge() {
    return this.state.alignEdge;
  }

  /**
   * @readonly
   * @returns {string} representing the opposite edge of the currently-defined `alignEdge` property
   */
  get oppositeAlignEdge() {
    switch (this.alignEdge) {
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    case 'top':
      return 'bottom';
    default: // bottom
      return 'top';
    }
  }

  /**
   * Whether or not the component should animate its movement
   * @param {boolean} val The alignment setting
   */
  set animated(val) {
    this.state.animated = stringUtils.stringToBool(val);
    if (this.state.animated) {
      this.setAttribute(attributes.ANIMATED, true);
    } else {
      this.removeAttribute(attributes.ANIMATED);
    }
    this.refresh();
  }

  get animated() {
    return this.state.animated;
  }

  /**
   * @readonly
   * @returns {boolean} true if the Popup is opened and has fully animated into place
   */
  get animatedOpen() {
    return this.container.classList.contains('open');
  }

  /**
   * @param {string} val the style of animation this popup uses to show/hide
   */
  set animationStyle(val) {
    let trueVal = ANIMATION_STYLES[0];
    if (val && ANIMATION_STYLES.includes(val)) {
      trueVal = val;
    }

    if (trueVal !== ANIMATION_STYLES[0]) {
      this.setAttribute(attributes.ANIMATION_STYLE, `${trueVal}`);
    } else {
      this.removeAttribute(attributes.ANIMATION_STYLE);
    }

    if (trueVal !== this.state.animationStyle) {
      this.state.animationStyle = trueVal;
      this.#setAnimationStyle(trueVal);
    }
  }

  /**
   * @returns {string} the style of animation this popup uses to show/hide
   */
  get animationStyle() {
    return this.state.animationStyle;
  }

  /**
   * Changes the CSS class controlling the animation style of the Popup
   * @param {string} newStyle the type of animation
   * @returns {void}
   */
  #setAnimationStyle(newStyle) {
    const thisCl = this.container.classList;

    ANIMATION_STYLES.forEach((style) => {
      const targetClassName = `animation-${style}`;

      if (style !== newStyle && thisCl.contains(targetClassName)) {
        thisCl.remove(targetClassName);
      } else if (style === newStyle && !thisCl.contains(targetClassName)) {
        thisCl.add(targetClassName);
      }
    });
  }

  /**
   * @param {boolean|string} val true if bleeds should be respected by the Popup
   */
  set bleed(val) {
    const trueVal = stringUtils.stringToBool(val);
    if (this.state.bleed !== trueVal) {
      this.state.bleed = val;
      if (trueVal) {
        this.setAttribute(attributes.BLEED, '');
      } else {
        this.removeAttribute(attributes.BLEED);
      }
      this.refresh();
    }
  }

  /**
   * @returns {boolean} true if bleeds are currently being respected by the Popup
   */
  get bleed() {
    return this.state.bleed;
  }

  /**
   * @param {HTMLElement} val an element that will appear to "contain" the Popup
   */
  set containingElem(val) {
    if (!(val instanceof HTMLElement)) {
      return;
    }
    if (this.state.containingElem !== val) {
      this.state.containingElem = val;
      this.refresh();
    }
  }

  /**
   * @returns {HTMLElement} the element currently appearing to "contain" the Popup
   */
  get containingElem() {
    return this.state.containingElem;
  }

  /**
   * Specifies whether to show the Popup Arrow, and in which direction.
   * The direction is in relation to the alignment setting. So for example of you align: top
   * you want arrow: top as well.
   * @param {string|null} val the arrow direction.  Defaults to `none`
   */
  set arrow(val) {
    let trueVal = ARROW_TYPES[0];
    if (val && ARROW_TYPES.includes(val)) {
      trueVal = val;
    }
    if (trueVal !== ARROW_TYPES[0]) {
      this.setAttribute(attributes.ARROW, `${trueVal}`);
    } else {
      this.removeAttribute(attributes.ARROW);
    }
    this.#setArrowDirection(this.arrow);
  }

  /**
   * @returns {string|null} the arrow setting, or null
   */
  get arrow() {
    const attr = this.getAttribute(attributes.ARROW);
    if (!attr) {
      return ARROW_TYPES[0];
    }
    return attr;
  }

  /**
   * Show/Hide Arrow pointing in a direction, if applicable
   * @param {string} direction a CSS class representing a Popup Arrow direction
   */
  #setArrowDirection(direction) {
    const arrowElCl = this.arrowEl.classList;
    ARROW_TYPES.forEach((type) => {
      if (type !== 'none' && type !== direction) {
        arrowElCl.remove(type);
      }
    });

    this.arrowEl.hidden = direction === 'none';
    if (direction !== 'none' && !arrowElCl.contains(direction)) {
      arrowElCl.add(direction);
    }
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
  set arrowTarget(val) {
    const isString = typeof val === 'string' && val.length;
    const isElem = val instanceof HTMLElement;

    if (!isString && !isElem) {
      if (this.state.arrowTarget !== undefined) {
        this.state.arrowTarget = undefined;
        this.removeAttribute(attributes.ARROW_TARGET);
      }
      return;
    }

    let elem;
    if (isString) {
      // @TODO Harden for security (XSS)
      const rootNode = IdsDOMUtils.getClosestRootNode(this);
      elem = rootNode.querySelector(val);
      if (!(elem instanceof HTMLElement)) {
        return;
      }
      this.setAttribute(attributes.ARROW_TARGET, val);
    } else {
      elem = val;
    }

    if (!this.state.arrowTarget || !this.state.arrowTarget.isEqualNode(elem)) {
      this.state.arrowTarget = elem;
      this.#setArrowDirection(this.arrow);
    }
  }

  /**
   * @returns {HTMLElement} the element in the page that the Popup will take
   * coordinates from for relative placement
   */
  get arrowTarget() {
    return this.state.arrowTarget || this.alignTarget;
  }

  /**
   * @param {string} val the position style string
   */
  set positionStyle(val) {
    const currentStyle = this.state.positionStyle;
    if (val !== currentStyle && POSITION_STYLES.includes(val)) {
      this.state.positionStyle = val;

      this.setAttribute(attributes.POSITION_STYLE, val);
      this.#setPositionStyle(val);
    }
  }

  /**
   * @returns {string} the current position style
   */
  get positionStyle() {
    return this.state.positionStyle;
  }

  /**
   * Changes the CSS class controlling the position style of the Popup
   * @param {string} newStyle the type of position
   * @returns {void}
   */
  #setPositionStyle(newStyle) {
    const thisCl = this.container.classList;

    POSITION_STYLES.forEach((style) => {
      const targetClassName = `position-${style}`;

      if (style !== newStyle && thisCl.contains(targetClassName)) {
        thisCl.remove(targetClassName);
      } else if (style === newStyle && !thisCl.contains(targetClassName)) {
        thisCl.add(targetClassName);
      }
    });
  }

  /**
   * The style of popup to use between 'none', 'menu', 'menu-alt', 'tooltip', 'tooltip-alt'
   * @param {string} val The popup type
   */
  set type(val) {
    if (val && this.state.type !== val && TYPES.includes(val)) {
      this.state.type = val;
      this.setAttribute(attributes.TYPE, this.state.type);
      this.#setPopupTypeClass(this.state.type);
    }
  }

  /**
   * @returns {string} the type assigned to the Popup
   */
  get type() {
    return this.state.type;
  }

  /**
   * @param {string} newType the new type CSS class to apply
   * @returns {void}
   */
  #setPopupTypeClass(newType) {
    const thisCl = this.container.classList;
    TYPES.forEach((type) => {
      if (type !== newType && thisCl.contains(type)) {
        thisCl.remove(type);
      } else if (type === newType && !thisCl.contains(type)) {
        thisCl.add(type);
      }
    });
  }

  /**
   * Whether or not the component should be displayed
   * @param {boolean} val a boolean for displaying or hiding the popup
   */
  set visible(val) {
    const trueVal = stringUtils.stringToBool(val);
    if (this.state.visible !== trueVal) {
      this.state.visible = trueVal;
      if (trueVal) {
        this.setAttribute(attributes.VISIBLE, true);
      } else {
        this.removeAttribute(attributes.VISIBLE);
      }
      this.refresh();
    }
  }

  get visible() {
    return this.state.visible;
  }

  /**
   * Sets the X (left) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set x(val) {
    let trueVal = parseInt(val?.toString(), 10);
    if (Number.isNaN(trueVal)) {
      trueVal = 0;
    }

    if (trueVal !== this.state.x) {
      this.state.x = trueVal;
      this.setAttribute(attributes.X, trueVal.toString());
      this.refresh();
    }
  }

  get x() {
    return this.state.x;
  }

  /**
   * Sets the Y (top) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set y(val) {
    let trueVal = parseInt(val?.toString(), 10);
    if (Number.isNaN(trueVal)) {
      trueVal = 0;
    }

    if (trueVal !== this.state.y) {
      this.state.y = trueVal;
      this.setAttribute(attributes.Y, trueVal.toString());
      this.refresh();
    }
  }

  get y() {
    return this.state.y;
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
    /* istanbul ignore next */
    if (this.shouldResize()) {
      this.addObservedElement(this.resizeDetectionTarget());
    }

    // Make the popup actually render before doing placement calcs
    if (this.state.visible) {
      this.container.classList.add('visible');
    } else {
      this.container.classList.remove('open');
    }

    // Show/Hide Arrow class, if applicable
    this.#setArrowDirection(this.arrow);

    // If no alignment target is present, do a simple x/y coordinate placement.
    const { alignTarget } = this;
    if (!alignTarget) {
      // Remove an established MutationObserver if one exists.
      if (this.hasMutations) {
        this.mo?.disconnect();
        this.disconnectDetectMutations();
        delete this.hasMutations;
      }
      if (this.visible) {
        this.placeAtCoords();
      }
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
      if (this.visible) {
        this.placeAgainstTarget();
      }
    }

    // Adds a RenderLoop-staggered check for whether to show the Popup.
    if (this.openCheck) {
      this.openCheck.destroy(true);
    }

    this.openCheck = this.rl.register(new IdsRenderLoopItem({
      duration: 70,
      timeoutCallback: () => {
        if (this.state.visible) {
          // If an arrow is displayed, place it correctly.
          this.placeArrow();

          // Always fire the 'show' event
          this.triggerEvent('show', this, {
            bubbles: true,
            detail: {
              elem: this
            }
          });
          this.container.classList.add('open');
        }
        if (!this.state.animated && this.container.classList.contains('animated')) {
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
        if (!this.state.visible) {
          // Always fire the 'hide' event
          this.triggerEvent('hide', this, {
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
        if (this.state.animated && !this.container.classList.contains('animated')) {
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
    let popupRect = this.container.getBoundingClientRect();
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

    // Update the DOMRect to reflect new x/y values
    popupRect.x = x;
    popupRect.y = y;

    // If the Popup bleeds off the viewport, nudge it back into full view
    popupRect = this.#nudge(popupRect);

    this.#renderPlacement(popupRect);
  }

  /**
   * Places the Popup using an external element as a starting point.
   * @private
   * @param {string} [targetAlignEdge] if defined, runs placement logic against a different
   *  alignment edge than the one defined on the component
   * @returns {void}
   */
  placeAgainstTarget(targetAlignEdge) {
    let x = this.x;
    let y = this.y;

    // Detect sizes/locations of the popup and the alignment target Element
    let popupRect = this.container.getBoundingClientRect();
    const targetRect = this.alignTarget.getBoundingClientRect();
    const alignEdge = targetAlignEdge || this.alignEdge;
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
        /* istanbul ignore next */
        if (alignXCentered) {
          break;
        }
        /* istanbul ignore next */
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

    // Set adjusted values
    popupRect.x = x;
    popupRect.y = y;

    // Check boundaries and attempt to flip the component in the opposite direction, if needed.
    // If neither side will properly fit the popup, the popup will shrink to fit
    /* istanbul ignore next */
    if (this.#shouldFlip(popupRect) && !targetAlignEdge) {
      this.placeAgainstTarget(this.oppositeAlignEdge);
      return;
    }

    // If the Popup bleeds off the viewport, nudge it back into full view
    popupRect = this.#nudge(popupRect);

    // If the popup was previously flipped, also flip the arrow alignment
    /* istanbul ignore if */
    if (this.arrow !== ARROW_TYPES[0] && targetAlignEdge) {
      this.#setArrowDirection(this.oppositeAlignEdge);
    }

    this.#renderPlacement(popupRect);
  }

  /**
   * Further adjusts placement of a popup based on defined strategies.
   * @param {DOMRect} popupRect a Rect object representing the current state of the popup.
   * @returns {object} an adjusted Rect object with "nudged" coordinates.
   */
  #nudge(popupRect) {
    // Don't adjust if bleeding is allowed
    if (this.bleed) {
      return popupRect;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const containerRect = this.containingElem.getBoundingClientRect();
    const bleed = this.bleed;

    let fixedX = popupRect.x;
    let fixedY = popupRect.y;

    /* istanbul ignore next */
    const rightEdge = bleed ? viewportWidth : containerRect.right;

    /* istanbul ignore next */
    const leftEdge = bleed ? 0 : containerRect.left;

    /* istanbul ignore next */
    const topEdge = bleed ? 0 : containerRect.top;

    /* istanbul ignore next */
    const bottomEdge = bleed ? viewportHeight : containerRect.bottom;

    if (popupRect.right > rightEdge) {
      fixedX -= (popupRect.right - rightEdge);
    }
    /* istanbul ignore next */
    if (popupRect.left < leftEdge) {
      fixedX += (Math.abs(popupRect.left) + leftEdge);
    }
    if (popupRect.bottom > bottomEdge) {
      fixedY -= (popupRect.bottom - bottomEdge);
    }
    /* istanbul ignore next */
    if (popupRect.top < topEdge) {
      fixedY += (Math.abs(popupRect.top) + topEdge);
    }

    popupRect.x = fixedX;
    popupRect.y = fixedY;

    return popupRect;
  }

  #shouldFlip(popupRect) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = this.containingElem.scrollLeft || 0;
    const scrollY = this.containingElem.scrollTop || 0;
    const bleed = this.bleed;
    const containerRect = this.containingElem.getBoundingClientRect();
    const targetRect = this.alignTarget.getBoundingClientRect();

    // Gets the distance between an edge on the target element, and its opposing viewport border
    const getDistance = (dir) => {
      let d = 0;

      switch (dir) {
      case 'left':
        d = (bleed ? 0 : containerRect.left) - scrollX - targetRect.left + this.x;
        break;
      case 'right':
        d = (bleed ? viewportWidth : containerRect.right) - scrollX - targetRect.right - this.x;
        break;
      case 'top':
        d = (bleed ? 0 : containerRect.top) - scrollY - targetRect.top + this.y;
        break;
      default: // bottom
        d = (bleed ? viewportHeight : containerRect.bottom) - scrollY - targetRect.bottom - this.y;
        break;
      }

      return Math.abs(d);
    };

    const currentDir = this.alignEdge;
    const newDir = this.oppositeAlignEdge;
    const currentDistance = getDistance(currentDir);
    const newDistance = getDistance(newDir);

    const measuredPopupDimension = ['top', 'bottom'].includes(currentDir) ? 'height' : 'width';
    const popupFits = popupRect[measuredPopupDimension] <= currentDistance;

    // If the popup does not fit, and there's more space between the opposite edge
    // and viewport boundary, compared to the current edge and its viewport boundary, return true.
    /* istanbul ignore next */
    return !popupFits && newDistance > currentDistance;
  }

  /**
   * Renders the position of the Popup.
   * @param {DOMRect} popupRect representing approximated new placement values
   * @returns {void}
   */
  #renderPlacement(popupRect) {
    this.container.style.left = `${popupRect.x}px`;
    this.container.style.top = `${popupRect.y}px`;
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
      arrowEl.hidden = true;
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

      /* istanbul ignore next */
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

      /* istanbul ignore next */
      if (newArrowRect.left <= elementRect.left || newArrowRect.right >= elementRect.right) {
        arrowHidden = true;
      }
    }

    // Round the number up
    d = Math.ceil(d);

    // Hide the arrow if it goes beyond the element boundaries
    /* istanbul ignore next */
    if (arrowHidden) {
      arrowEl.hidden = true;
    }
    arrowEl.style[targetMargin] = `${d}px`;
  }
}

export default IdsPopup;

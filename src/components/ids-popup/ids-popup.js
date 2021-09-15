import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../../core';

// Import Utils
import { IdsStringUtils, IdsDOMUtils } from '../../utils';

// Import Mixins
import {
  IdsEventsMixin,
  IdsRenderLoopMixin,
  IdsRenderLoopItem,
  IdsLocaleMixin,
  IdsThemeMixin
} from '../../mixins';

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
const POSITION_STYLES = ['fixed', 'absolute', 'viewport'];

// Types of Popups
const TYPES = ['none', 'menu', 'menu-alt', 'modal', 'tooltip', 'tooltip-alt', 'custom', 'dropdown'];

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
  attributes.LANGUAGE,
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
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 * @part popup - the popup outer element
 * @part arrow - the arrow element
 */
@customElement('ids-popup')
@scss(styles)
class IdsPopup extends mix(IdsElement).with(
    IdsRenderLoopMixin,
    IdsEventsMixin,
    IdsLocaleMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
    this.shouldUpdate = false;
  }

  connectedCallback() {
    super.connectedCallback();

    // Always setup link to containing element first
    this.containingElem = IdsDOMUtils.getClosest(this, 'ids-container') || document.body;

    // Set inital state and events
    this.#setInitialState();
    this.shouldUpdate = true;
    this.#attachEventHandlers();

    // Stagger visibility and initial placement, if applicable
    window.requestAnimationFrame(() => {
      this.refreshVisibility();
      this.place();
    });
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
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
   * Watches for changes
   * @property {MutationObserver} mo the built-in mutation observer
   */
  #mo = new MutationObserver((mutations) => {
    if (this.#visible) {
      let placed = false;
      for (const m of mutations) {
        if (placed) {
          break;
        }
        if (['subtree', 'childList', 'characterData', 'characterDataOldValue'].includes(m.type)) {
          this.place();
          placed = true;
        }
      }
    }
  })

  /**
   * Cycles through all available props and checks the DOM for their presence
   * @returns {void}
   */
  #setInitialState() {
    POPUP_PROPERTIES.forEach((prop) => {
      const camelProp = IdsStringUtils.camelCase(prop);
      this[camelProp] = this.getAttribute(prop) || this[camelProp];
    });
  }

  /**
   * Attaches event handlers for the duration of the lifespan of this component
   * @returns {void}
   */
  #attachEventHandlers() {
    // Respond to parent changing language
    this.offEvent('languagechange.container');
    this.onEvent('languagechange.container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
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
   * @property {HTMLElement} alignTarget acts as the target element to be used for offset placement
   */
  #alignTarget = undefined;

  /**
   * Sets the element to align with via a css selector
   * @param {string | HTMLElement | undefined} val ['string|HTMLElement'] a CSS selector string
   */
  set alignTarget(val) {
    const isString = typeof val === 'string' && val.length;
    const isElem = val instanceof HTMLElement;

    if (!isString && !isElem) {
      if (this.#alignTarget !== undefined) {
        this.#alignTarget = undefined;
        this.removeAttribute(attributes.ALIGN_TARGET);
        this.#refreshAlignTarget();
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

    if (!this.#alignTarget || !this.#alignTarget.isEqualNode(elem)) {
      this.#alignTarget = elem;
      this.#refreshAlignTarget();
    }
  }

  /**
   * @returns {HTMLElement| undefined} the element in the page that the Popup will take
   * coordinates from for relative placement
   */
  get alignTarget() {
    return this.#alignTarget;
  }

  #refreshAlignTarget() {
    if (this.#alignTarget) {
      this.#mo.observe(this.#alignTarget, {
        attributes: true,
        attributeFilter: ['style', 'height', 'width'],
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
        childList: true,
        subtree: true
      });
    } else {
      this.#mo.disconnect();
    }
    this.place();
  }

  /**
   * @property {string} align determines the current direction(s) of alignment for the Popup.
   * Can be left, right, top, bottom, center, and can also be a comma-delimited list of
   * multiple alignment types (for example: `left, top` or `right, bottom`)
   */
  #align = CENTER;

  /**
   * @param {string} val a comma-delimited set of alignment types `direction1, direction2`
   */
  set align(val) {
    const currentAlign = this.#align;
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
      this.#alignEdge = edge;
      vals[0] = this.#alignEdge;
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
      this.#alignX = vals[0];
    } else {
      attrX = this.alignX;
    }
    if (ALIGNMENTS_Y.includes(vals[1])) {
      attrY = vals[1];
      this.#alignY = vals[1];
    } else {
      attrY = this.alignY;
    }

    const newAlign = formatAlignAttribute(attrX, attrY, this.#alignEdge);
    const needsUpdatedAlign = currentAlign !== newAlign;
    if (needsUpdatedAlign) {
      this.#align = newAlign;
      this.setAttribute(attributes.ALIGN, newAlign);
      this.place();
    } else if (!this.hasAttribute('align')) {
      this.setAttribute(attributes.ALIGN, currentAlign);
    }
  }

  /**
   * @returns {string} a DOM-friendly string reprentation of alignment types
   */
  get align() {
    return this.#align;
  }

  /**
   * @property {string} alignX the type of alignment to use on this component's
   *  X coordinate in relation to a parent element's X coordinate
   */
  #alignX = ALIGNMENTS_X[0];

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

    if (this.#alignX !== alignX) {
      this.#alignX = alignX;
      const alignY = this.#alignY;

      // Setting the `align` attribute causes a refresh to occur,
      // so no need to call `refresh()` here.
      this.align = formatAlignAttribute(alignX, alignY, alignX);
    }
  }

  /**
   * Strategy for the parent X alignment (see the ALIGNMENTS_X array)
   * @returns {string} the strategy to use
   */
  get alignX() {
    return this.#alignX;
  }

  /**
   * @property {string} alignY the type of alignment to use on this component's
   *  Y coordinate in relation to a parent element's Y coordinate
   */
  #alignY = ALIGNMENTS_Y[0];

  /**
   * @param {string} val alignment strategy for the current parent Y alignment
   */
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

    if (this.#alignY !== alignY) {
      this.#alignY = alignY;
      const alignX = this.#alignX;

      // Setting the `align` attribute causes a refresh to occur,
      // so no need to call `refresh()` here.
      this.align = formatAlignAttribute(alignX, alignY, alignY);
    }
  }

  /**
   * @returns {string} alignment strategy for the current parent Y alignment
   */
  get alignY() {
    return this.#alignY;
  }

  /**
   * @property {string} alignEdge the primary edge of a target element to use for its alignment.
   */
  #alignEdge = ALIGNMENT_EDGES[0];

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
    if (this.#alignEdge !== edge) {
      let alignX = this.alignX;
      let alignY = this.alignY;

      this.#alignEdge = edge;

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
    return this.#alignEdge;
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
   * @property {boolean} animated true if animation should occur on this component
   */
  #animated = false;

  /**
   * Whether or not the component should animate its movement
   * @param {boolean} val The alignment setting
   */
  set animated(val) {
    const trueVal = IdsStringUtils.stringToBool(val);
    if (this.#animated !== trueVal) {
      this.#animated = trueVal;
      if (trueVal) {
        this.setAttribute(attributes.ANIMATED, '');
      } else {
        this.removeAttribute(attributes.ANIMATED);
      }
      this.#refreshAnimated();
    }
  }

  get animated() {
    return this.#animated;
  }

  /**
   * Refreshes whether or not animations can be applied
   * @returns {void}
   */
  #refreshAnimated() {
    this.container.classList[this.animated ? 'add' : 'remove']('animated');
  }

  /**
   * @property {string} animationStyle the type of alignment to use on this component's
   *  Y coordinate in relation to a parent element's Y coordinate
   */
  #animationStyle = ANIMATION_STYLES[0];

  /**
   * @param {string} val the style of animation this popup uses to show/hide
   */
  set animationStyle(val) {
    const currentVal = this.#animationStyle;
    if (val !== currentVal && ANIMATION_STYLES.includes(val)) {
      this.#animationStyle = val;
      this.setAttribute(attributes.ANIMATION_STYLE, val);
      this.#refreshAnimationStyle(currentVal, val);
    } else {
      this.#refreshAnimationStyle('', currentVal);
    }
  }

  /**
   * @returns {string} the style of animation this popup uses to show/hide
   */
  get animationStyle() {
    return this.#animationStyle;
  }

  /**
   * Changes the CSS class controlling the animation style of the Popup
   * @param {string} currentStyle the type of animation
   * @param {string} newStyle the type of animation
   * @returns {void}
   */
  #refreshAnimationStyle(currentStyle, newStyle) {
    const thisCl = this.container.classList;
    if (currentStyle) thisCl.remove(`animation-${currentStyle}`);
    thisCl.add(`animation-${newStyle}`);
  }

  /**
   * @property {boolean} bleed true if placement logic should allow crossing
   *  of the defined `containingElem` boundary
   */
  #bleed = false;

  /**
   * @param {boolean|string} val true if bleeds should be respected by the Popup
   */
  set bleed(val) {
    const trueVal = IdsStringUtils.stringToBool(val);
    if (this.#bleed !== trueVal) {
      this.#bleed = val;
      if (trueVal) {
        this.setAttribute(attributes.BLEED, '');
      } else {
        this.removeAttribute(attributes.BLEED);
      }
      this.place();
    }
  }

  /**
   * @returns {boolean} true if bleeds are currently being respected by the Popup
   */
  get bleed() {
    return this.#bleed;
  }

  /**
   * @property {HTMLElement} containingElem the element to use for containment of the Popup
   */
  #containingElem = document.body;

  /**
   * @param {HTMLElement} val an element that will appear to "contain" the Popup
   */
  set containingElem(val) {
    if (!(val instanceof HTMLElement)) {
      return;
    }
    if (this.#containingElem !== val) {
      this.#containingElem = val;
      this.place();
    }
  }

  /**
   * @returns {HTMLElement} the element currently appearing to "contain" the Popup
   */
  get containingElem() {
    return this.#containingElem;
  }

  /**
   * @property {string} arrow Specifies whether to show the Popup Arrow, and in which direction.
   * The direction is in relation to the alignment setting. So for example of you align: top
   * you want arrow: top as well.
   */
  #arrow = ARROW_TYPES[0];

  /**
   * Specifies whether to show the Popup Arrow, and in which direction.
   * The direction is in relation to the alignment setting. So for example of you align: top
   * you want arrow: top as well.
   * @param {string|null} val the arrow direction.  Defaults to `none`
   */
  set arrow(val) {
    const currentVal = this.#arrow;
    let trueVal = ARROW_TYPES[0];
    if (val && ARROW_TYPES.includes(val)) {
      trueVal = val;
    }

    if (trueVal !== currentVal) {
      this.#arrow = trueVal;
      if (trueVal !== ARROW_TYPES[0]) {
        this.setAttribute(attributes.ARROW, `${trueVal}`);
      } else {
        this.removeAttribute(attributes.ARROW);
      }
      this.#setArrowDirection(currentVal, trueVal);
    }
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
   * @param {string} currentDir a CSS class representing a Popup Arrow direction
   * @param {string} newDir a CSS class representing a Popup Arrow direction
   */
  #setArrowDirection(currentDir, newDir) {
    const arrowElCl = this.arrowEl.classList;
    const isNone = newDir === 'none';

    this.arrowEl.hidden = isNone;
    if (currentDir) arrowElCl.remove(currentDir);
    if (newDir && !isNone) arrowElCl.add(newDir);
  }

  /**
   * @readonly
   * @returns {HTMLElement} referencing the internal arrow element
   */
  get arrowEl() {
    return this.container.querySelector('.arrow');
  }

  /**
   * @param {HTMLElement} arrowTarget
   */
  #arrowTarget = null;

  /**
   * Sets the element to align with via a css selector
   * @param {any} val ['string|HTMLElement'] a CSS selector string
   */
  set arrowTarget(val) {
    const isString = typeof val === 'string' && val.length;
    const isElem = val instanceof HTMLElement;

    if (!isString && !isElem) {
      if (this.#arrowTarget !== undefined) {
        this.#arrowTarget = undefined;
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

    if (!this.#arrowTarget || !this.#arrowTarget.isEqualNode(elem)) {
      this.#arrowTarget = elem;
      this.#setArrowDirection('', this.arrow);
    }
  }

  /**
   * @returns {HTMLElement} the element in the page that the Popup will take
   * coordinates from for relative placement
   */
  get arrowTarget() {
    return this.#arrowTarget || this.alignTarget;
  }

  /**
   * @property {string} positionStyle the method in which the Popup is positioned
   */
  #positionStyle = POSITION_STYLES[0];

  /**
   * @param {string} val the position style string
   */
  set positionStyle(val) {
    const currentStyle = this.#positionStyle;
    if (val !== currentStyle && POSITION_STYLES.includes(val)) {
      this.#positionStyle = val;
      this.setAttribute(attributes.POSITION_STYLE, val);
      this.#refreshPositionStyle(currentStyle, val);
      this.place();
    } else {
      this.#refreshPositionStyle('', currentStyle);
    }
  }

  /**
   * @returns {string} the current position style
   */
  get positionStyle() {
    return this.#positionStyle;
  }

  /**
   * Changes the CSS class controlling the position style of the Popup
   * @param {string} currentStyle the current position type
   * @param {string} newStyle the new position type
   * @returns {void}
   */
  #refreshPositionStyle(currentStyle, newStyle) {
    const thisCl = this.container.classList;
    if (currentStyle) thisCl.remove(`position-${currentStyle}`);
    thisCl.add(`position-${newStyle}`);
  }

  /**
   * @property {number} type The style of popup to display.
   * Can be 'none', 'menu', 'menu-alt', 'tooltip', 'tooltip-alt'
   */
  #type = TYPES[0]; // 'none'

  /**
   * @param {string} val The popup type
   */
  set type(val) {
    const currentVal = this.#type;
    if (val && currentVal !== val && TYPES.includes(val)) {
      this.#type = val;
      this.setAttribute(attributes.TYPE, this.#type);
      this.#refreshPopupTypeClass(currentVal, val);
      this.place();
    } else {
      this.#refreshPopupTypeClass('', currentVal);
    }
  }

  /**
   * @returns {string} the type assigned to the Popup
   */
  get type() {
    return this.#type;
  }

  /**
   * @param {string} currentType the current type CSS class to remove
   * @param {string} newType the new type CSS class to apply
   * @returns {void}
   */
  #refreshPopupTypeClass(currentType, newType) {
    const thisCl = this.container.classList;
    if (currentType) thisCl.remove(currentType);
    thisCl.add(newType);
  }

  /**
   * @property {boolean} visible true if the Popup should be visible
   */
  #visible = false;

  /**
   * Whether or not the component should be displayed
   * @param {boolean} val a boolean for displaying or hiding the popup
   */
  set visible(val) {
    const trueVal = IdsStringUtils.stringToBool(val);
    if (this.#visible !== trueVal) {
      this.#visible = trueVal;
      if (trueVal) {
        this.setAttribute(attributes.VISIBLE, '');
      } else {
        this.removeAttribute(attributes.VISIBLE);
      }
      this.refreshVisibility();
    }
  }

  get visible() {
    return this.#visible;
  }

  /**
   * Runs the show/hide routines of the Popup based on current visiblity state.
   * @async
   * @returns {Promise} from the show/hide process
   */
  async refreshVisibility() {
    const cl = this.container.classList;
    if (this.#visible && !cl.contains('open')) {
      return this.show();
    }
    if (!this.#visible && cl.contains('visible')) {
      return this.hide();
    }
    return new Promise((resolve) => { resolve(); });
  }

  /**
   * Turns visibility of the Popup on/off, and places the Popup if it's visible.
   * @async
   * @returns {void}
   */
  async toggleVisibility() {
    this.visible = !this.visible;
    if (this.visible) this.place();
  }

  /**
   * @property {number} x represents the X coordinate if placed via coordinates,
   * or the X offset when placed in relation to a parent element.
   */
  #x = 0;

  /**
   * Sets the X (left) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set x(val) {
    let trueVal = parseInt(val?.toString(), 10);
    if (Number.isNaN(trueVal)) {
      trueVal = 0;
    }

    if (trueVal !== this.#x) {
      this.#x = trueVal;
      this.setAttribute(attributes.X, trueVal.toString());
    }
  }

  get x() {
    return this.#x;
  }

  /**
   * @property {number} y represents the Y coordinate if placed via coordinates,
   * or the Y offset when placed in relation to a parent element.
   */
  #y = 0;

  /**
   * Sets the Y (top) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set y(val) {
    let trueVal = parseInt(val?.toString(), 10);
    if (Number.isNaN(trueVal)) {
      trueVal = 0;
    }

    if (trueVal !== this.#y) {
      this.#y = trueVal;
      this.setAttribute(attributes.Y, trueVal.toString());
    }
  }

  get y() {
    return this.#y;
  }

  /**
   * Sets an X/Y position and optionally shows/places the Popup
   * @async
   * @param {number} x the x coordinate/offset value
   * @param {number} y the y coordinate/offset value
   * @param {boolean} doShow true if the Popup should be displayed before placing
   * @param {boolean} doPlacement true if the component should run its placement routine
   */
  async setPosition(x = null, y = null, doShow = null, doPlacement = null) {
    if (!Number.isNaN(x)) this.x = x;
    if (!Number.isNaN(y)) this.y = y;
    if (doShow) this.visible = true;
    if (doPlacement) await this.place();
  }

  /**
   * Shows the Popup
   * @async
   * @returns {Promise} resolved once showing and animating the Popup is completed.
   */
  async show() {
    if (this.visible) {
      this.container.classList.add('visible');
      // await this.place();
      this.#setArrowDirection('', this.arrow);
    }

    return new Promise((resolve, reject) => {
      if (!this.visible) {
        reject();
        return;
      }

      // Adds a RenderLoop-staggered check for whether to show the Popup.
      if (this.openCheck) {
        this.openCheck.destroy(true);
      }

      this.openCheck = this.rl.register(new IdsRenderLoopItem({
        duration: 70,
        timeoutCallback: () => {
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
          /* istanbul ignore next */
          if (this.isFlipped) {
            this.container.classList.add('flipped');
          }
          this.place().then(() => {
            this.#correct3dMatrix();
            resolve();
          });
        }
      }));
    });
  }

  /**
   * Hides the Popup
   * @async
   * @returns {Promise} resolved once hiding and animating the Popup is completed.
   */
  async hide() {
    return new Promise((resolve, reject) => {
      if (this.visible) {
        reject();
        return;
      }

      this.#remove3dMatrix();
      this.container.classList.remove('open');

      // Adds another RenderLoop-staggered check for whether to hide the Popup.
      if (this.closedCheck) {
        this.closedCheck.destroy(true);
      }
      this.closedCheck = this.rl.register(new IdsRenderLoopItem({
        duration: 200,
        timeoutCallback: () => {
          // Always fire the 'hide' event
          this.triggerEvent('hide', this, {
            bubbles: true,
            detail: {
              elem: this
            }
          });

          // Remove the `flipped` class if its there
          /* istanbul ignore next */
          if (this.isFlipped) {
            this.container.classList.remove('flipped');
            this.isFlipped = false;
          }

          // Remove the `visible` class if its there
          if (this.container.classList.contains('visible')) {
            this.container.classList.remove('visible');
          }
          resolve();
        }
      }));
    });
  }

  /**
   * Runs the configured placement routine for the Popup
   * @async
   * @returns {Promise} resolved once placement has finished
   */
  async place() {
    return new Promise((resolve) => {
      if (this.visible) {
        if (this.positionStyle === 'viewport') {
          this.#placeInViewport();
        } else {
          const { alignTarget } = this;
          if (!alignTarget) {
            this.#placeAtCoords();
          } else {
            this.#placeAgainstTarget();
          }
        }
        resolve();
      }
    });
  }

  /**
   * Places the Popup using numeric x/y coordinates as a starting point.
   * @private
   * @returns {void}
   */
  #placeAtCoords() {
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

    this.#renderPlacementInPixels(popupRect);
  }

  /**
   * Places the Popup using an external element as a starting point.
   * @private
   * @param {string} [targetAlignEdge] if defined, runs placement logic against a different
   *  alignment edge than the one defined on the component
   * @returns {void}
   */
  #placeAgainstTarget(targetAlignEdge) {
    let x = this.x;
    let y = this.y;
    this.container.classList.remove('flipped');

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
      this.#placeAgainstTarget(this.oppositeAlignEdge);
      this.isFlipped = true;
      return;
    }

    // If the Popup bleeds off the viewport, nudge it back into full view
    popupRect = this.#nudge(popupRect);

    // If the popup was previously flipped, also flip the arrow alignment
    /* istanbul ignore if */
    if (this.arrow !== ARROW_TYPES[0] && targetAlignEdge) {
      this.#setArrowDirection('', this.oppositeAlignEdge);
    }

    this.#renderPlacementInPixels(popupRect);
  }

  /**
   * Places the Popup in relation to the center of the viewport
   * @returns {void}
   */
  #placeInViewport() {
    this.#renderPlacementWithTransform();
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
   * Renders the position of the Popup using offsets/coordinates in Pixels.
   * @param {DOMRect} popupRect representing approximated new placement values
   * @returns {void}
   */
  #renderPlacementInPixels(popupRect) {
    this.container.style.left = `${popupRect.x}px`;
    this.container.style.top = `${popupRect.y}px`;
  }

  /**
   * Renders the position of the Popup with CSS transforms (applied mostly with CSS).
   * See the IdsPopup CSS styles for the `animation-style-*` classes for modifying the Transform values.
   * @returns {void}
   */
  #renderPlacementWithTransform() {
    this.container.style.left = `50%`;
    this.container.style.top = `50%`;
  }

  /**
   * In cases where 3D CSS transforms are used for Popup positioning,
   * corrects the placement of the Popup after rendering so that it doesn't
   * reside on half-pixels, causing blurriness to text, icons, etc.
   * Adapted from https://stackoverflow.com/a/42256897
   * @returns {void}
   */
  #correct3dMatrix() {
    if (this.positionStyle !== 'viewport') {
      return;
    }

    requestAnimationFrame(() => {
      // Resets the redifined matrix to allow recalculation.
      // The original style should be defined in the animation-style class, not inline.
      this.#remove3dMatrix();

      // gets the current computed style
      const style = window.getComputedStyle(this.container, null);
      const mx = style.getPropertyValue('-webkit-transform')
        || style.getPropertyValue('-moz-transform')
        || style.getPropertyValue('transform') || false;

      // Corrects `matrix3d` coordinate values to be whole numbers
      const values = mx.replace(/ |\(|\)|matrix3d/g, '').split(',');
      for (let i = 0; i < values.length; i++) {
        if (i === 0 && values[i] < 1) values[i] = 1;
        if (i > 0 && (values[i] > 4 || values[i] < -4)) {
          values[i] = Math.ceil(values[i]);
        }
        if (i === values.length - 1 && values[i] > 1) {
          values[i] = 1;
        }
      }

      this.container.style.transform = `matrix3d(${values.join()})`;
    });
  }

  /**
   * Removes a previously-modified 3D Matrix
   * @returns {void}
   */
  #remove3dMatrix() {
    this.container.style.transform = '';
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

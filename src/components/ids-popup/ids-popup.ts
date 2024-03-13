import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { camelCase, stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

import {
  getClosest,
  getClosestRootNode,
  getEditableRect,
  validMaxHeight,
  waitForTransitionEnd,
} from '../../utils/ids-dom-utils/ids-dom-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPopupOpenEventsMixin from '../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin';
import IdsElement from '../../core/ids-element';

import type { IdsPopupElementRef, IdsPopupXYSwitchResult } from './ids-popup-attributes';

import {
  CENTER,
  ALIGNMENT_EDGES,
  ALIGNMENTS_X,
  ALIGNMENTS_Y,
  ALIGNMENTS_EDGES_X,
  ALIGNMENTS_EDGES_Y,
  ANIMATION_STYLES,
  ARROW_TYPES,
  POSITION_STYLES,
  TYPES,
  POPUP_MAXHEIGHT_PROPNAME,
  POPUP_PROPERTIES,
  formatAlignAttribute
} from './ids-popup-attributes';

import styles from './ids-popup.scss';

const Base = IdsPopupOpenEventsMixin(
  IdsLocaleMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Popup Component
 * @type {IdsPopup}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsPopupOpenEventsMixin
 * @part popup - the popup outer element
 * @part arrow - the arrow element
 */
@customElement('ids-popup')
@scss(styles)
export default class IdsPopup extends Base {
  shouldUpdate = false;

  isFlipped = false;

  scrollParentElem?: HTMLElement | null;

  useRight = false;

  constructor() {
    super();
    this.#align = CENTER;
    this.#alignX = ALIGNMENTS_X[0];
    this.#alignY = ALIGNMENTS_Y[0];
    this.#alignEdge = ALIGNMENT_EDGES[0];
    this.#alignTarget = null;
    this.animated = false;
    this.#arrow = ARROW_TYPES[0];
    this.#arrowTarget = null;
    this.#bleed = false;
    this.#containingElem = document.body;
    this.#positionStyle = POSITION_STYLES[1];
    this.#targetAlignEdge = '';
    this.#type = TYPES[0]; // 'none'
    this.#visible = false;
    this.#x = 0;
    this.#y = 0;

    this.open = false;
    this.shouldUpdate = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Always setup link to containing element first
    this.containingElem = getClosest((this as any), 'ids-container') || document.body;

    // Set inital state and events
    this.#setInitialState();
    this.shouldUpdate = true;
    this.#attachEventHandlers();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    if (this.#ro) {
      this.#ro?.disconnect();
      this.#ro = undefined;
    }
    if (this.#mo) {
      this.#mo?.disconnect();
      this.#mo = undefined;
    }
    this.#alignTarget = null;
    this.#arrowTarget = null;
    this.#containingElem = null;
    this.containingElem = null;
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array<string>} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [...super.attributes, ...POPUP_PROPERTIES];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    const animatedClass = this.animated ? ` animated animation-${this.animationStyle}` : '';

    return `<div class="ids-popup${animatedClass}" part="popup">
      <div class="arrow" part="arrow"></div>
      <div class="content-wrapper">
        <slot name="content"></slot>
      </div>
    </div>`;
  }

  /**
   * Watches for changes
   * @property {MutationObserver} mo this Popup component's mutation observer
   */
  #mo?: MutationObserver;

  /**
   * Watches for resizing that occurs whenever the page changes dimensions, and re-applies some
   * coordinate-specific values to the Popup's inner container.
   * @private
   * @property {ResizeObserver} mo this Popup component's resize observer
   */
  #ro?: ResizeObserver;

  /**
   * Places the Popup and performs an adjustment to its `transform: matrix3d()`
   * CSS property, if applicable.
   */
  #fixPlacementOnResize(): void {
    this.#remove3dMatrix();
    this.place();
    this.#fix3dMatrixOnResize();
  }

  /**
   * Performs an adjustment to the Popup's `transform: matrix3d()`
   * CSS property, if applicable.
   */
  #fix3dMatrixOnResize(): void {
    this.style.transition = 'none';
    this.container?.style.setProperty('transition', 'none');
    this.correct3dMatrix();
    this.style.transition = '';
    this.container?.style.setProperty('transition', '');
  }

  /**
   * Cycles through all available props and checks the DOM for their presence
   * @returns {void}
   */
  #setInitialState(): void {
    this.#mo = new MutationObserver((mutations) => {
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
    });

    this.#ro = new ResizeObserver((entries) => {
      if (this.open) {
        for (const entry of entries) {
          if (entry.target.tagName.toLowerCase() === 'ids-container') {
            this.#fixPlacementOnResize();
          } else {
            this.#fix3dMatrixOnResize();
          }
        }
        this.#checkViewportPositionScrolling();
      }
    });

    POPUP_PROPERTIES.forEach((prop) => {
      const camelProp = camelCase(prop);
      (this as any)[camelProp] = this.getAttribute(prop) || (this as any)[camelProp];
    });
  }

  /**
   * Attaches event handlers for the duration of the lifespan of this component
   * @returns {void}
   */
  #attachEventHandlers(): void {
    const containerNode = getClosest((this as any), 'ids-container');
    // Setup Resize Observer
    this.#ro?.observe((this as any));
    if (containerNode) {
      this.#ro?.observe(containerNode);
    }

    this.onLocaleChange = () => {
      if (this.localeAPI.isRTL()) this.setAttribute('dir', 'rtl');
      else this.removeAttribute('dir');
    };
  }

  /**
   * @returns {DOMRect} measurements of the inner ".ids-popup" <div>
   */
  get innerRect(): DOMRect {
    return this.getBoundingClientRect();
  }

  /**
   * @readonly
   * @returns {HTMLElement} reference to the `content-wrapper` element
   */
  get wrapper(): HTMLElement | undefined | null {
    return this.shadowRoot?.querySelector('.content-wrapper');
  }

  /**
   * @property {IdsPopupElementRef} alignTarget acts as the target element to be used for offset placement
   */
  #alignTarget: IdsPopupElementRef = null;

  /**
   * Sets the element to align with via a css selector
   * @param {IdsPopupElementRef | string} val a CSS selector string
   */
  set alignTarget(val: IdsPopupElementRef | string) {
    const isString = typeof val === 'string' && val.length;
    const isElem = val instanceof HTMLElement || val instanceof SVGElement;

    if (!isString && !isElem) {
      if (this.#alignTarget !== null) {
        this.#alignTarget = null;
        this.removeAttribute(attributes.ALIGN_TARGET);
        this.#refreshAlignTarget();
      }
      return;
    }

    let elem: IdsPopupElementRef = null;
    if (isString) {
      // @TODO Harden for security (XSS)
      const rootNode = getClosestRootNode((this as any));
      elem = rootNode.querySelector(val);
      if (!(elem instanceof HTMLElement || elem instanceof SVGElement)) {
        return;
      }
      this.setAttribute(attributes.ALIGN_TARGET, val);
    } else if (isElem) {
      elem = val;
    }

    if (elem !== null && (!this.#alignTarget || !this.#alignTarget.isEqualNode(elem))) {
      this.#alignTarget = elem;
      this.#refreshAlignTarget();
    }
  }

  /**
   * @returns {IdsPopupElementRef} the element in the page that the Popup will take
   * coordinates from for relative placement
   */
  get alignTarget(): IdsPopupElementRef {
    return this.#alignTarget;
  }

  #refreshAlignTarget(): void {
    if (this.#alignTarget) {
      this.#mo?.observe(this.#alignTarget, {
        attributes: true,
        attributeFilter: ['style', 'height', 'width'],
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
        childList: true,
        subtree: true
      });
    } else {
      this.#mo?.disconnect();
    }
    this.place();
  }

  /**
   * @property {string} align determines the current direction(s) of alignment for the Popup.
   * Can be left, right, top, bottom, center, and can also be a comma-delimited list of
   * multiple alignment types (for example: `left, top` or `right, bottom`)
   */
  #align: string;

  /**
   * @param {string} val a comma-delimited set of alignment types `direction1, direction2`
   */
  set align(val: string) {
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
  get align(): string {
    return this.#align;
  }

  /**
   * @property {string} alignX the type of alignment to use on this component's
   *  X coordinate in relation to a parent element's X coordinate
   */
  #alignX: string;

  /**
   * Strategy for the parent X alignment (see the ALIGNMENTS_X array)
   * @param {string} val the strategy to use
   */
  set alignX(val: string) {
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
  get alignX(): string {
    return this.#alignX;
  }

  /**
   * @property {string} alignY the type of alignment to use on this component's
   *  Y coordinate in relation to a parent element's Y coordinate
   */
  #alignY: string;

  /**
   * @param {string} val alignment strategy for the current parent Y alignment
   */
  set alignY(val: string) {
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
  get alignY(): string {
    return this.#alignY;
  }

  /**
   * @property {string} alignEdge the primary edge of a target element to use for its alignment.
   */
  #alignEdge: string;

  /**
   * Updates when the popup changing its primary align edge
   */
  #targetAlignEdge: string;

  /**
   *  Specifies the edge of the parent element to be placed adjacent,
   *  in configurations where a relative placement occurs
   * @param {string} val The edge to align to
   */
  set alignEdge(val: string) {
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
  get alignEdge(): string {
    return this.#alignEdge;
  }

  /**
   * @readonly
   * @returns {string} representing the opposite edge of the currently-defined `alignEdge` property
   */
  get oppositeAlignEdge(): string {
    return this.#getOppositeEdge(this.alignEdge);
  }

  /**
   * @returns {string | null} The max height value
   */
  get maxHeight(): string | null {
    return this.getAttribute(attributes.MAX_HEIGHT);
  }

  /**
   * Set the max height value
   * @param {string | number | null} value The value
   */
  set maxHeight(value: string | number | null) {
    const val = validMaxHeight(value);
    if (val) {
      this.setAttribute(attributes.MAX_HEIGHT, val);
    } else {
      this.removeAttribute(attributes.MAX_HEIGHT);
    }
    this.#updateMaxHeightProp(val);
  }

  /**
   * Defines an internal CSS variable used for defining a `max-height` attribute
   * in the ShadowRoot of this component
   * @param {string | number | null} val how to define the property
   */
  #updateMaxHeightProp(val?: string | number | null) {
    if (this.positionStyle === 'viewport') {
      this.wrapper?.setAttribute(attributes.TABINDEX, '0');
      this.container?.style.setProperty(POPUP_MAXHEIGHT_PROPNAME, 'auto');
      return;
    }

    const containerElem = (this.containingElem as HTMLElement);
    let targetHeightConstraint = document.body.offsetHeight;
    let targetValue = validMaxHeight(val || this.maxHeight);

    if (containerElem) {
      targetHeightConstraint = containerElem.offsetHeight;
    } else if (window) {
      targetHeightConstraint = window.innerHeight;
      targetValue = `${targetHeightConstraint}px`;
    }

    if (targetValue) {
      if (targetHeightConstraint < parseInt(targetValue)) {
        targetValue = `${targetHeightConstraint}px`;
      }
    } else {
      const currentPopupHeight = parseInt(window.getComputedStyle(this.wrapper!).height);
      if (targetHeightConstraint <= currentPopupHeight) {
        targetValue = `${targetHeightConstraint}px`;
      }
    }

    if (this.container) {
      if (this.wrapper) this.wrapper.setAttribute(attributes.TABINDEX, '0');
      if (targetValue) {
        this.container.style.setProperty(POPUP_MAXHEIGHT_PROPNAME, `${targetValue}`);
        this.container.classList.add('has-maxheight');
      } else {
        this.container.classList.remove('has-maxheight');
        this.container.style.removeProperty(POPUP_MAXHEIGHT_PROPNAME);
      }
    }
  }

  /**
   * Helper to get opposite align edge
   * @param {string|undefined} currentEdge current align edge
   * @returns {string} opposite align edge
   */
  #getOppositeEdge(currentEdge?: string): string {
    return {
      left: 'right',
      right: 'left',
      top: 'bottom',
      bottom: 'top'
    }[currentEdge ?? ''] || 'none';
  }

  /**
   * Helper to get nearest side to the align edge
   * @param {string|undefined} currentEdge current align edge
   * @returns {string} nearest align edge
   */
  #getNearestEdge(currentEdge?: string): string {
    switch (currentEdge) {
      case 'top':
      case 'bottom':
        return 'right';
      case 'left':
      case 'right':
        return 'bottom';
      default:
        return 'none';
    }
  }

  /**
   * Whether or not the component should animate its movement
   * @param {boolean} val true if animation should occur on the Popup
   */
  set animated(val: boolean) {
    const trueVal = stringToBool(val);
    if (trueVal) {
      this.setAttribute(attributes.ANIMATED, '');
    } else {
      this.removeAttribute(attributes.ANIMATED);
    }
    this.#refreshAnimated();
  }

  /**
   * @returns {boolean} true if animation will occur on the Popup
   */
  get animated(): boolean {
    return stringToBool(this.getAttribute(attributes.ANIMATED)) || false;
  }

  /**
   * Refreshes whether or not animations can be applied
   * @returns {void}
   */
  #refreshAnimated(): void {
    this.container?.classList[this.animated ? 'add' : 'remove']('animated');
  }

  /**
   * @param {string} val the style of animation this popup uses to show/hide
   */
  set animationStyle(val: string) {
    if (ANIMATION_STYLES.includes(val)) {
      this.#refreshAnimationStyle(val);
      this.setAttribute(attributes.ANIMATION_STYLE, val);
    }
  }

  /**
   * @returns {string} the style of animation this popup uses to show/hide
   */
  get animationStyle(): string {
    const attrVal = this.getAttribute(attributes.ANIMATION_STYLE);

    if (attrVal && ANIMATION_STYLES.includes(attrVal)) {
      return attrVal;
    }

    return ANIMATION_STYLES[0];
  }

  /**
   * Changes the CSS class controlling the animation style of the Popup
   * @param {string} newStyle the type of animation
   * @returns {void}
   */
  #refreshAnimationStyle(newStyle: string) {
    if (!this.container) return;
    const thisCl = this.container.classList;
    const allStyles = ANIMATION_STYLES.map((item) => `animation-${item}`);
    thisCl.remove(...allStyles);
    thisCl.add(`animation-${newStyle}`);
  }

  /**
   * @property {boolean} bleed true if placement logic should allow crossing
   *  of the defined `containingElem` boundary
   */
  #bleed: boolean;

  /**
   * @param {boolean|string} val true if bleeds should be respected by the Popup
   */
  set bleed(val: string | boolean) {
    const trueVal = stringToBool(val);
    if (this.#bleed !== trueVal) {
      this.#bleed = (val as boolean);
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
  get bleed(): string | boolean {
    return this.#bleed;
  }

  /**
   * @property {IdsPopupElementRef} containingElem the element to use for containment of the Popup
   */
  #containingElem: IdsPopupElementRef;

  /**
   * @param {IdsPopupElementRef} val an element that will appear to "contain" the Popup
   */
  set containingElem(val: IdsPopupElementRef) {
    if (!(val instanceof HTMLElement || val instanceof SVGElement)) {
      return;
    }
    if (this.#containingElem !== val) {
      this.#containingElem = val;
      this.place();
    }
  }

  /**
   * @returns {IdsPopupElementRef} the element currently appearing to "contain" the Popup
   */
  get containingElem(): IdsPopupElementRef {
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
  set arrow(val: string | null) {
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
  get arrow(): string | null {
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
  #setArrowDirection(currentDir: string | null, newDir: string | null) {
    if (!this.container) return;

    const arrowEl = this.arrowEl;
    const arrowElCl = this.arrowEl?.classList;
    const isNone = newDir === 'none';
    newDir = newDir === 'center' ? 'bottom' : newDir;

    if (arrowEl) arrowEl.hidden = isNone;
    let cssPart = 'arrow';
    if (currentDir === '') arrowElCl?.remove(...ARROW_TYPES);
    else if (currentDir) arrowElCl?.remove(currentDir);
    if (newDir && !isNone) {
      arrowElCl?.add(newDir);
      cssPart += `-${newDir}`;
    }
    arrowEl?.setAttribute('part', cssPart);
  }

  /**
   * @readonly
   * @returns {HTMLElement} referencing the internal arrow element
   */
  get arrowEl(): HTMLElement | undefined | null {
    return this.container?.querySelector('.arrow');
  }

  /**
   * @param {IdsPopupElementRef} arrowTarget
   */
  #arrowTarget: IdsPopupElementRef;

  /**
   * Sets the element to align with via a css selector
   * @param {IdsPopupElementRef} val a CSS selector string
   */
  set arrowTarget(val: IdsPopupElementRef | string) {
    const isString = typeof val === 'string' && val.length;
    const isElem = val instanceof HTMLElement || val instanceof SVGElement;

    if (!isString && !isElem) {
      if (this.#arrowTarget !== null) {
        this.#arrowTarget = null;
        this.removeAttribute(attributes.ARROW_TARGET);
      }
      return;
    }

    let elem: IdsPopupElementRef = null;
    if (isString) {
      // @TODO Harden for security (XSS)
      const rootNode = getClosestRootNode((this as any));
      elem = rootNode.querySelector(val);
      if (!(elem instanceof HTMLElement || elem instanceof SVGElement)) {
        return;
      }
      this.setAttribute(attributes.ARROW_TARGET, val);
    } else if (isElem) {
      elem = val;
    }

    if (elem !== null && (!this.#arrowTarget || !this.#arrowTarget.isEqualNode(elem))) {
      this.#arrowTarget = elem;
      this.#setArrowDirection('', this.arrow);
    }
  }

  /**
   * @returns {IdsPopupElementRef} the element in the page that the Popup will take
   * coordinates from for relative placement
   */
  get arrowTarget(): IdsPopupElementRef {
    return this.#arrowTarget || this.alignTarget;
  }

  /**
   * @property {string} positionStyle the method in which the Popup is positioned
   */
  #positionStyle: string;

  /**
   * @param {string} val the position style string
   */
  set positionStyle(val: string) {
    const currentStyle = this.#positionStyle;
    if (POSITION_STYLES.includes(val)) {
      this.setAttribute(attributes.POSITION_STYLE, val);
      this.#positionStyle = val;

      if (val !== currentStyle) {
        this.#refreshPositionStyle(currentStyle, val);
      } else {
        this.#refreshPositionStyle('', currentStyle);
      }

      this.place();
    }
  }

  /**
   * @returns {string} the current position style
   */
  get positionStyle(): string {
    return this.#positionStyle;
  }

  /**
   * Changes the CSS class controlling the position style of the Popup
   * @param {string} currentStyle the current position type
   * @param {string} newStyle the new position type
   * @returns {void}
   */
  #refreshPositionStyle(currentStyle: string, newStyle: string) {
    if (!this.container) return;
    const thisCl = this.container.classList;
    if (currentStyle) thisCl.remove(`position-${currentStyle}`);
    thisCl.add(`position-${newStyle}`);
  }

  /**
   * Runs on viewport resize to correct a CSS class that controls scrolling behavior within viewport-positioned popups
   */
  #checkViewportPositionScrolling(): void {
    if (!this.container || !this.wrapper) return;
    const cl = this.container.classList;
    cl.remove('fit-viewport');

    const wrapperScrollHeight = this.wrapper.getBoundingClientRect().height;
    const containerScrollHeight = this.container.getBoundingClientRect().height;
    const needsFixing = wrapperScrollHeight > containerScrollHeight;
    if (needsFixing) {
      cl.add('fit-viewport');
    }
  }

  /**
   * @property {number} type The style of popup to display.
   * Can be 'none', 'menu', 'menu-alt', 'tooltip', 'tooltip-alt'
   */
  #type: string;

  /**
   * @param {string} val The popup type
   */
  set type(val: string) {
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
  get type(): string {
    return this.#type;
  }

  /**
   * @param {string} currentType the current type CSS class to remove
   * @param {string} newType the new type CSS class to apply
   * @returns {void}
   */
  #refreshPopupTypeClass(currentType: string, newType: string) {
    if (!this.container) return;
    const thisCl = this.container.classList;
    if (currentType) thisCl.remove(currentType);
    thisCl.add(newType);
  }

  /**
   * @property {boolean} open true if the Popup is not only visible, but also fully-animated open
   */
  open: boolean;

  /**
   * @property {boolean} visible true if the Popup should be visible
   */
  #visible: boolean;

  /**
   * Whether or not the component should be displayed
   * @param {boolean} val a boolean for displaying or hiding the popup
   */
  set visible(val: boolean) {
    const trueVal = stringToBool(val);
    if (this.#visible !== trueVal) {
      this.#visible = trueVal;
      if (trueVal) {
        this.setAttribute(attributes.VISIBLE, '');
      } else {
        this.removeAttribute(attributes.VISIBLE);
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.refreshVisibility();
    }
  }

  get visible(): boolean {
    return this.#visible;
  }

  /**
   * Runs the show/hide routines of the Popup based on current visiblity state.
   * @async
   * @returns {void}
   */
  async refreshVisibility() {
    if (!this.container) return;
    const cl = this.container.classList;
    if (this.#visible && !cl.contains('open')) {
      await this.show();
    }
    if (!this.#visible && !this.hasAttribute('aria-hidden')) {
      await this.hide();
    }
  }

  /**
   * @property {number} x represents the X coordinate if placed via coordinates,
   * or the X offset when placed in relation to a parent element.
   */
  #x: number;

  /**
   * Sets the X (left) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set x(val: number) {
    let trueVal = parseInt(val?.toString(), 10);
    if (Number.isNaN(trueVal)) {
      trueVal = 0;
    }

    if (trueVal !== this.#x) {
      this.#x = trueVal;
      this.setAttribute(attributes.X, trueVal.toString());
    }
  }

  get x(): number {
    return this.#x;
  }

  /**
   * @property {number} y represents the Y coordinate if placed via coordinates,
   * or the Y offset when placed in relation to a parent element.
   */
  #y: number;

  /**
   * Sets the Y (top) coordinate of the Popup
   * @param {number} val the coordinate's value
   */
  set y(val: number) {
    let trueVal = parseInt(val?.toString(), 10);
    if (Number.isNaN(trueVal)) {
      trueVal = 0;
    }

    if (trueVal !== this.#y) {
      this.#y = trueVal;
      this.setAttribute(attributes.Y, trueVal.toString());
    }
  }

  get y(): number {
    return this.#y;
  }

  /**
   * Sets an X/Y position and optionally shows/places the Popup
   * @param {number} x the x coordinate/offset value
   * @param {number} y the y coordinate/offset value
   * @param {boolean} doShow true if the Popup should be displayed before placing
   * @param {boolean} doPlacement true if the component should run its placement routine
   */
  setPosition(
    x: number | null = null,
    y: number | null = null,
    doShow: boolean | null = null,
    doPlacement: boolean | null = null
  ) {
    const elem: any = this;
    if (!Number.isNaN(x)) elem.x = x;
    if (!Number.isNaN(y)) elem.y = y;
    if (doShow) this.visible = true;
    if (doPlacement) this.place();
  }

  /**
   * Shows the Popup
   * @async
   * @returns {void}
   */
  async show() {
    if (!this.visible || !this.container) {
      return;
    }

    // Fix location first
    this.place();
    this.placeArrow(this.#targetAlignEdge);
    this.removeAttribute('aria-hidden');

    // Change transparency/visibility
    this.container.classList.add('open');
    this.open = true;

    this.triggerEvent('show', this, {
      bubbles: true,
      detail: {
        elem: this
      }
    });

    if (this.animated) {
      await waitForTransitionEnd(this.container, 'opacity');
    }

    // Unblur if needed
    this.correct3dMatrix();
    this.addOpenEvents();
  }

  /**
   * Hides the Popup
   * @async
   * @returns {void}
   */
  async hide() {
    if (!this.visible && !this.open) return;
    this.setAttribute('aria-hidden', 'true');
    this.visible = false;
    this.open = false;
    this.#remove3dMatrix();
    this.container!.classList.remove('open');

    // Always fire the 'hide' event
    this.triggerEvent('hide', this, {
      bubbles: true,
      detail: {
        elem: this
      }
    });

    if (this.animated) {
      await waitForTransitionEnd(this.container!, 'opacity');
    }

    this.removeOpenEvents();
  }

  /**
   * Inherited from the Popup Open Events Mixin.
   * Runs when a click event is propagated to the window.
   * @param {MouseEvent} e the original click event
   * @returns {void}
   */
  onOutsideClick(e: MouseEvent): void {
    if (!e?.target || this.contains(e.target as HTMLElement)) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.hide();
  }

  /**
   * Runs the configured placement routine for the Popup
   * @returns {void}
   */
  place(): void {
    // NOTE: position-style="viewport" is driven by CSS only
    if (this.visible && this.positionStyle !== 'viewport') {
      this.#updateMaxHeightProp();

      const { alignTarget } = this;
      if (!alignTarget) {
        this.#placeAtCoords();
      } else {
        this.#placeAgainstTarget();
      }
    }
  }

  /**
   * Places the Popup using numeric x/y coordinates as a starting point.
   * @private
   * @returns {void}
   */
  #placeAtCoords(): void {
    let popupRect = this.getBoundingClientRect();
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

    // Account for absolute-positioned parents
    popupRect = this.#removeRelativeParentDistance(this.parentNode as HTMLElement, popupRect, this.scrollParentElem);

    // Make user-defined adjustments, if applicable
    if (typeof this.onPlace === 'function') {
      popupRect = this.onPlace(popupRect);
    }

    // Correct RTL
    popupRect = this.#correctRTL(popupRect);
    this.#renderPlacementInPixels(popupRect);
  }

  /**
   * Places the Popup using an external element as a starting point.
   * @private
   * @returns {void}
   */
  #placeAgainstTarget(): void {
    if (!this.alignTarget) return;

    // Detect sizes/locations of the popup and the alignment target Element
    let popupRect = this.getBoundingClientRect();

    this.#targetAlignEdge = this.#getPlacementEdge(popupRect);

    const oppositeEdge = this.#getOppositeEdge(this.alignEdge);
    const shouldSwitchXY = this.alignEdge !== this.#targetAlignEdge
      && this.#getOppositeEdge(this.alignEdge) !== this.#targetAlignEdge;
    let switchResult = {
      flip: this.alignEdge !== this.#targetAlignEdge && !shouldSwitchXY,
      oppositeEdge,
      shouldSwitchXY,
      targetEdge: this.#alignEdge,
      x: shouldSwitchXY ? this.y : this.x,
      y: shouldSwitchXY ? this.x : this.y
    };

    if (typeof this.onXYSwitch === 'function') {
      switchResult = this.onXYSwitch(switchResult);
    }

    let x = switchResult.x;
    let y = switchResult.y;

    const targetRect = this.alignTarget.getBoundingClientRect();
    const alignEdge = this.#targetAlignEdge || this.alignEdge;
    let alignXCentered = false;
    let alignYCentered = false;

    // Add/remove CSS class if the popup on an opposite align edge
    this.container?.classList.toggle('flipped', this.alignEdge !== this.#targetAlignEdge && !shouldSwitchXY);

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

    // If no alignment edge place it at the center
    if (alignEdge === 'none') {
      const containerWidth = this.containingElem?.clientWidth;
      const containerHeight = this.containingElem?.clientHeight;

      if (containerWidth && containerHeight) {
        x = (containerWidth - popupRect.width) / 2;
        y = (containerHeight - popupRect.height) / 2;
      }
    }

    // Set adjusted values
    popupRect.x = x;
    popupRect.y = y;

    // If the Popup bleeds off the viewport, nudge it back into full view
    popupRect = this.#nudge(popupRect);

    // Account for absolute-positioned parents
    popupRect = this.#removeRelativeParentDistance(this.parentNode as HTMLElement, popupRect, this.scrollParentElem);

    // Make user-defined adjustments, if applicable
    if (typeof this.onPlace === 'function') {
      popupRect = this.onPlace(popupRect);
    }

    if (this.containingElem?.classList?.contains('app-menu-is-open')) {
      const appMenu = this.containingElem?.querySelector('.app-menu');
      const appMenuRect = appMenu?.getBoundingClientRect();
      if (navigator.userAgent.indexOf('Firefox') === -1) {
        popupRect.x -= appMenuRect?.width || 300;
      }
    }

    // Correct for RTL Position
    popupRect = this.#correctRTL(popupRect);

    this.#renderPlacementInPixels(popupRect);

    // If an arrow is displayed, place it correctly
    if (this.arrow && this.arrow !== ARROW_TYPES[0]) {
      this.#setArrowDirection('', this.#targetAlignEdge);
      this.placeArrow(this.#targetAlignEdge);
    }
  }

  /**
   * Optional callback that can be used to adjust the Popup's placement
   * after all internal adjustments are made.
   * @param {DOMRect} popupRect a Rect object representing the current state of the popup.
   * @returns {object} an adjusted Rect object with "nudged" coordinates.
   */
  onPlace(popupRect: DOMRect): DOMRect {
    return popupRect;
  }

  /**
   * Optional callback that can be used to further adjust the Popup's x/y offsets
   * if a flip or other modification is made to the alignment edge
   * when being placed in alignment mode.
   * @param {IdsPopupXYSwitchResult} result contains settings related to the x/y adjustment.
   * @returns {IdsPopupXYSwitchResult} provides further modifications.
   */
  onXYSwitch(result: IdsPopupXYSwitchResult) {
    return result;
  }

  /**
   * Further adjusts placement of a popup based on defined strategies.
   * @param {DOMRect} popupRect a Rect object representing the current state of the popup.
   * @returns {object} an adjusted Rect object with "nudged" coordinates.
   */
  #nudge(popupRect: DOMRect): DOMRect {
    // Don't adjust if bleeding is allowed
    if (this.bleed || !this.containingElem) {
      return popupRect;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const containerRect = this.containingElem.getBoundingClientRect();
    const bleed = this.bleed;

    let fixedX = popupRect.x;
    let fixedY = popupRect.y;

    const rightEdge = bleed ? viewportWidth : containerRect.right;

    const leftEdge = bleed ? 0 : containerRect.left;

    const topEdge = bleed ? 0 : containerRect.top;

    const bottomEdge = bleed ? viewportHeight : containerRect.bottom;

    if (popupRect.right > rightEdge) {
      fixedX -= (popupRect.right - rightEdge);
    }
    if (popupRect.left < leftEdge) {
      fixedX += (Math.abs(popupRect.left) + leftEdge);
    }
    if (popupRect.bottom > bottomEdge) {
      fixedY -= (popupRect.bottom - bottomEdge);
    }
    if (popupRect.top < topEdge) {
      fixedY += (Math.abs(popupRect.top) + topEdge);
    }
    if (fixedY < 0) {
      fixedY = 0;
    }

    popupRect.x = fixedX;
    popupRect.y = fixedY;

    return popupRect;
  }

  #getPlacementEdge(popupRect: DOMRect): string {
    if (!this.containingElem || !this.alignTarget) return 'none';

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = this.containingElem.scrollLeft || 0;
    const scrollY = this.containingElem.scrollTop || 0;
    const bleed = this.bleed;
    const containerRect = this.containingElem.getBoundingClientRect();
    const targetRect = this.alignTarget.getBoundingClientRect();

    // Gets the distance between an edge on the target element, and its opposing viewport border
    const getDistance = (dir: string) => {
      let distance = 0;

      switch (dir) {
        case 'left':
          distance = (bleed ? 0 : containerRect.left) - scrollX - targetRect.left + this.x;
          break;
        case 'right':
          distance = (bleed ? viewportWidth : containerRect.right) - scrollX - targetRect.right - this.x;
          break;
        case 'top':
          distance = (bleed ? 0 : containerRect.top) - scrollY - targetRect.top + this.y;
          break;
        case 'bottom':
        default:
          distance = (bleed ? viewportHeight : containerRect.bottom) - scrollY - targetRect.bottom - this.y;
          break;
      }

      return Math.abs(distance);
    };

    const currentDir = this.alignEdge;
    const measuredPopupDimension = ['top', 'bottom'].includes(currentDir) ? 'height' : 'width';

    // Array of edges where popup should find its placement in order starting from alignEdge setting
    const edgeOrder = [
      this.alignEdge,
      this.#getOppositeEdge(this.alignEdge),
      this.#getNearestEdge(this.alignEdge),
      this.#getOppositeEdge(this.#getNearestEdge(this.alignEdge)),
    ];

    // Gets the first edge in the provided edges array where popup fits
    const edge = edgeOrder.find((item) => {
      const dist = getDistance(item);

      return popupRect[measuredPopupDimension] <= dist;
    });

    return edge || 'right';
  }

  /**
   * Renders the position of the Popup using offsets/coordinates in Pixels.
   * @param {DOMRect} popupRect representing approximated new placement values
   * @returns {void}
   */
  #renderPlacementInPixels(popupRect: DOMRect): void {
    this.style.removeProperty('left');
    this.style.removeProperty('right');
    this.style.removeProperty('top');

    let xProp = 'left';
    if (this.useRight) xProp = 'right';
    this.style.setProperty(xProp, `${popupRect.x}px`);
    this.style.setProperty('top', `${popupRect.y}px`);
  }

  /**
   * In cases where 3D CSS transforms are used for Popup positioning,
   * corrects the placement of the Popup after rendering so that it doesn't
   * reside on half-pixels, causing blurriness to text, icons, etc.
   * Adapted from https://stackoverflow.com/a/42256897
   * @returns {void}
   */
  correct3dMatrix(): void {
    if (!this.container || this.positionStyle !== 'viewport') {
      return;
    }

    // Resets the redifined matrix to allow recalculation.
    // The original style should be defined in the animation-style class, not inline.
    this.#remove3dMatrix();

    // gets the current computed style
    const style = window.getComputedStyle(this.container, null);
    const mx = style.getPropertyValue('-webkit-transform')
      || style.getPropertyValue('-moz-transform')
      || style.getPropertyValue('transform') || false;
    if (!mx) {
      return;
    }

    // Corrects `matrix3d` coordinate values to be whole numbers
    const values: any = mx.replace(/ |\(|\)|matrix3d/g, '').split(',');
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
  }

  /**
   * Removes a previously-modified 3D Matrix
   * @returns {void}
   */
  #remove3dMatrix() {
    this.container?.style.removeProperty('transform');
  }

  /**
   * Returns a DOMRect from `getBoundingClientRect` from an element, with the values adjusted
   * by subtracting the left/top values from the closest relative-positioned parent
   * @param {HTMLElement} elem the element to measure
   * @param {DOMRect} [rect] optionally pass in an existing rect and correct it
   * @param {HTMLElement} [containerElem] optionally pass a container element for this one to check scrolling distance
   * @returns {DOMRect} measurements adjusted for an absolutely-positioned parent
   */
  #removeRelativeParentDistance(elem: HTMLElement, rect: DOMRect, containerElem?: HTMLElement | null): DOMRect {
    const elemRect = getEditableRect(rect || elem.getBoundingClientRect());
    let foundRelativeParent = false;
    let scrollAdjusted = false;

    const removeRelativeDistance = (parent: any) => {
      let parentStyle: CSSStyleDeclaration;
      let parentRect: DOMRect;

      if (parent && !foundRelativeParent) {
        if (parent.toString() === '[object ShadowRoot]') {
          parent = parent.host;
        }
        if (parent instanceof HTMLElement || parent instanceof SVGElement) {
          parentStyle = getComputedStyle(parent);
          parentRect = parent.getBoundingClientRect();
          const scrollElem = containerElem || parent!;

          // Add scrollLeft/scrollTop of container elements
          if (!scrollAdjusted) {
            if (scrollElem.scrollLeft !== 0) {
              elemRect.x -= (scrollElem.scrollLeft);
              scrollAdjusted = true;
            }
            if (scrollElem.scrollTop !== 0) {
              elemRect.y -= (scrollElem.scrollTop);
              scrollAdjusted = true;
            }
          }

          // Remove relative parents' coordinates from the calculation
          if (parentStyle.position === 'relative') {
            elemRect.x -= parentRect.x;
            elemRect.y -= parentRect.y;
            foundRelativeParent = true;
          }
        }
        if (parent.parentNode) {
          removeRelativeDistance(parent.parentNode);
        }
      }
    };

    removeRelativeDistance(elem);
    return elemRect as DOMRect;
  }

  /**
   * If `useRight` property is configured, correct X coordinate values for RTL-based positions
   * @param {DOMRect} popupRect original values
   * @returns {DOMRect} corrected values
   */
  #correctRTL(popupRect: DOMRect) {
    if (this.useRight) {
      if (this.localeAPI.isRTL()) {
        popupRect.x = window.innerWidth - popupRect.x - popupRect.width;
      }
    }
    return popupRect;
  }

  /**
   * Handles alignment of an optional arrow element. If an arrow target is specified,
   * the arrow is placed to align correctly against the target.
   * @param {string | undefined} alignEdge align edge to place the arrow
   * @returns {void}
   */
  placeArrow(alignEdge?: string): void {
    const arrow = alignEdge || this.arrow;
    const arrowEl = this.arrowEl;
    const element = this.alignTarget;
    const target = this.arrowTarget;

    if (arrow === 'none' || !element || !target || !arrowEl) {
      if (arrowEl) arrowEl.hidden = true;
      return;
    }

    // Clear previous styles
    arrowEl.removeAttribute('hidden');
    arrowEl.style.marginLeft = '';
    arrowEl.style.marginTop = '';

    const arrowRect = arrowEl.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const newArrowRect: any = {};
    const targetMargin = (arrow === 'right' || arrow === 'left') ? 'marginTop' : 'marginLeft';

    let arrowHidden = false;
    let targetCenter = 0;
    let currentArrowCenter = 0;
    let d: any;

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
      arrowEl.hidden = true;
    }
    arrowEl.style[targetMargin] = `${d}px`;
  }

  set height(val: string) {
    const newHeight = stripHTML(val);
    const currentHeight = this.height;
    if (currentHeight !== newHeight) {
      if (newHeight.length) {
        this.container?.style.setProperty('height', newHeight);
        this.setAttribute(attributes.HEIGHT, newHeight);
      } else {
        this.container?.style.removeProperty('height');
        this.removeAttribute(attributes.HEIGHT);
      }
    }
  }

  get height(): string {
    return this.container?.style.height || '';
  }

  set width(val: string) {
    const newWidth = stripHTML(val);
    const currentWidth = this.width;
    if (currentWidth !== newWidth) {
      if (newWidth.length) {
        this.container?.style.setProperty('width', newWidth);
        this.setAttribute(attributes.WIDTH, newWidth);
      } else {
        this.container?.style.removeProperty('width');
        this.removeAttribute(attributes.WIDTH);
      }
    }
  }

  get width(): string {
    return this.container?.style.width ?? '';
  }
}

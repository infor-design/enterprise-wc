import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../../core/ids-element';

// Import Utils
import { IdsStringUtils, IdsDeepCloneUtils } from '../../utils';

// Import Mixins
import { IdsEventsMixin } from '../../mixins';

// Import Dependencies
import getElTranslation from './get-el-translate-point';

// Import Styles
import styles from './ids-draggable.scss';

const { stringToBool } = IdsStringUtils;

const CURSOR_EL_SIZE = 32;

/**
 * sets an optional integer attribute for an element
 * (may offload as general util; just need to think
 * through this a bit more)
 * @param {IdsElement} elem ids element to update
 * @param {string} attribute the attribute to update
 * @param {any} value a value to set on the
 */
function setIntAttribute(elem, attribute, value) {
  const nextValue = parseInt(value);

  if (nextValue !== null && !Number.isNaN(nextValue)) {
    if (parseInt(elem.getAttribute(attribute)) !== nextValue) {
      elem.setAttribute(attribute, nextValue);
    }
  } else if (nextValue === null && elem.hasAttribute(attribute)) {
    elem.removeAttribute(attribute);
  }
}

/**
 * @param {{
 *  left: number,
 *  top: number,
 *  right: number,
 *  bottom: number
 * }} bounds rectangle bounds to hash
 * @returns {string} a hash for bounds in a predictable
 * order that can be diffed for attribute changes
 */
function getBoundsHash(bounds) {
  return (
    `${bounds?.left || 0
    }_${
      bounds?.right || 0
    }_${
      bounds?.top || 0
    }_${bounds?.bottom || 0}`
  );
}

/**
 * IDS Draggable Component
 * @type {IdsDraggable}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-draggable')
@scss(styles)
export default class IdsDraggable extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.AXIS,
      attributes.DISABLED,
      attributes.HANDLE,
      attributes.IS_DRAGGING,
      attributes.MAX_TRANSFORM_X,
      attributes.MAX_TRANSFORM_Y,
      attributes.MIN_TRANSFORM_X,
      attributes.MIN_TRANSFORM_Y,
      attributes.PARENT_CONTAINMENT
    ];
  }

  /**
   * @returns {string} The template innerHTML to render
   */
  template() {
    return (
      `<slot></slot>`
    );
  }

  connectedCallback() {
    this.#updateHandleElem();

    // style the cursor element
    this.#cursorEl.style.position = 'absolute';
    this.#cursorEl.style.opacity = 0;
    this.#cursorEl.style.width = `${CURSOR_EL_SIZE}px`;
    this.#cursorEl.style.height = `${CURSOR_EL_SIZE}px`;
    this.#cursorEl.style.cursor = this.#getCursorStyle({ axis: this.axis });

    super.connectedCallback?.();
  }

  /**
   * @param {"x"|"y"|undefined} value The axis that the draggable content will
   * be moving along (e.g. X => horizontal, Y => vertical);
   * By default, not defined and supports both axes.
   */
  set axis(value) {
    let nextValue;

    switch (value) {
    case 'y': {
      nextValue = 'y';
      break;
    }
    case 'x': {
      nextValue = 'x';
      break;
    }
    default: {
      nextValue = undefined;
      break;
    }
    }

    if (nextValue) {
      this.setAttribute(attributes.AXIS, nextValue);
      this.isDragging = false;
      this.#cursorEl.style.cursor = this.#getCursorStyle({ axis: this.axis });
    } else if (!nextValue && this.hasAttribute(attributes.AXIS)) {
      this.removeAttribute(attributes.AXIS);
      this.isDragging = false;
      this.#cursorEl.style.cursor = this.#getCursorStyle({ axis: this.axis });
    }
  }

  /**
   * @returns {"x"|"y"|undefined} value The axis that the draggable content will
   * be moving along (e.g. X => horizontal, Y => vertical);
   * By default not defined and supports both axes.
   */
  get axis() {
    return this.getAttribute('axis');
  }

  /**
   * @param {boolean} value Whether the draggable should be limited in range
   * by its parent element
   */
  set parentContainment(value) {
    const isTruthy = stringToBool(value);

    if (isTruthy) {
      if (this.getAttribute(attributes.PARENT_CONTAINMENT) !== '') {
        this.setAttribute(attributes.PARENT_CONTAINMENT, '');
      }
    } else if (!isTruthy && this.hasAttribute(attributes.PARENT_CONTAINMENT)) {
      this.removeAttribute(attributes.PARENT_CONTAINMENT);
    }
  }

  /**
   * @returns {boolean} value Whether the draggable should be limited in range
   * by its parent element
   */
  get parentContainment() {
    return stringToBool(this.getAttribute(attributes.PARENT_CONTAINMENT));
  }

  /**
   * @param {boolean} value Whether or not draggable functionality is to be disabled
   */
  set disabled(value) {
    const isTruthy = IdsStringUtils.stringToBool(value);

    if (isTruthy && this.getAttribute(attributes.DISABLED) !== '') {
      this.offEvent('mousemove', window.document, this.onMouseMove);
      this.setAttribute(attributes.DISABLED, '');
    } else if (!isTruthy && this.hasAttribute(attributes.DISABLED)) {
      this.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * @returns {boolean} value Whether or not draggable functionality is disabled
   */
  get disabled() {
    return IdsStringUtils.stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * @param {string} value A query selector representing an optional handle that can be used to
   * drag the content of the draggable
   */
  set handle(value) {
    if (this.getAttribute(attributes.HANDLE) !== value) {
      if (this.hasAttribute(attributes.HANDLE) && (
        !value || typeof value !== 'string')
      ) {
        this.removeAttribute(attributes.HANDLE);
      } else {
        this.setAttribute(attributes.HANDLE, value);
      }

      this.#updateHandleElem();
    }
  }

  /**
   * @returns {string} value A query selector representing an optional handle that can be used to
   * drag the content of the draggable
   */
  get handle() {
    return this.getAttribute(attributes.HANDLE);
  }

  #updateHandleElem = () => {
    this.offEvent('mousedown', this.#handleElem);
    this.offEvent('mouseup', window.document, this.onMouseUp);
    this.offEvent('mousemove', window.document, this.onMouseMove);

    this.#handleElem = this.handle ? (
      document.querySelector(this.handle) || this
    ) : this;

    if (this.#handleElem !== this) {
      this.#handleElem.style.cursor = this.#getCursorStyle({ axis: this.axis });
    }

    this.onEvent('mousedown', this.#handleElem, (e) => {
      if (this.disabled) {
        return;
      }

      e.preventDefault();
      this.isDragging = true;

      this.onEvent('mouseup', document, this.onMouseUp);
      this.onEvent('mousemove', document, this.onMouseMove);

      // if we have our content being draggable by the parent element,
      // then we need to grab the first parent rectangle bounds
      // as well as append it to the associated event detail

      if (this.parentContainment) {
        this.#updateParentRect(e?.path || e?.composedPath?.());
      }

      this.#dragStartMousePoint = { x: e.x, y: e.y };

      const dragOffset = getElTranslation(this);

      this.#dragStartOffset = {
        x: this.axis !== 'y' ? dragOffset.x : 0,
        y: this.axis !== 'x' ? dragOffset.y : 0
      };

      this.triggerEvent('ids-dragstart', this, {
        detail: {
          mouseX: e.x,
          mouseY: e.y,
          translateX: this.#dragStartOffset.x,
          transitionY: this.#dragStartOffset.y
        }
      });

      const thisRect = this.getBoundingClientRect();

      // track the base element rectangle
      // (before translation considered)

      this.#dragStartRect = {
        width: thisRect.width,
        height: thisRect.height,
        left: thisRect.left - this.#dragStartOffset.x,
        right: thisRect.right - this.#dragStartOffset.x,
        top: thisRect.top - this.#dragStartOffset.y,
        bottom: thisRect.bottom - this.#dragStartOffset.y
      };

      let parentLOffset = 0;
      let parentROffset = 0;
      let parentTOffset = 0;
      let parentBOffset = 0;

      if (this.#parentRect) {
        parentLOffset = (this.#parentRect.left - this.#dragStartRect.left);
        parentROffset = (this.#parentRect.right - this.#dragStartRect.right);
        parentTOffset = (this.#parentRect.top - this.#dragStartRect.top);
        parentBOffset = (this.#parentRect.bottom - this.#dragStartRect.bottom);
      }

      this.#xformBounds = {
        left: parentLOffset + (this.#relativeBounds.left || 0),
        right: parentROffset - (this.#relativeBounds.right || 0),
        top: parentTOffset + (this.#relativeBounds.top || 0),
        bottom: parentBOffset - (this.#relativeBounds.bottom || 0)
      };

      this.#cursorEl.style.pointerEvents = 'all';

      // append the cursor to either the top-level ids-container
      // or if not found the document body
      // (to avoid double overflow scrollbars)

      (document.body.querySelector('ids-container') || document.body)
        .appendChild(this.#cursorEl);
    });
  };

  set minTransformX(value) {
    setIntAttribute(this, attributes.MIN_TRANSFORM_X, value);
  }

  get minTransformX() {
    if (this.hasAttribute(attributes.MIN_TRANSFORM_X)) {
      return parseInt(this.getAttribute(attributes.MIN_TRANSFORM_X));
    }

    return null;
  }

  set maxTransformX(value) {
    setIntAttribute(this, attributes.MAX_TRANSFORM_X, value);
  }

  get maxTransformX() {
    if (this.hasAttribute(attributes.MAX_TRANSFORM_X)) {
      return parseInt(this.getAttribute(attributes.MAX_TRANSFORM_X));
    }

    return null;
  }

  set minTransformY(value) {
    setIntAttribute(this, attributes.MIN_TRANSFORM_Y, value);
  }

  get minTransformY() {
    if (this.hasAttribute(attributes.MIN_TRANSFORM_Y)) {
      return parseInt(this.getAttribute(attributes.MIN_TRANSFORM_Y));
    }

    return null;
  }

  get maxTransformY() {
    if (this.hasAttribute(attributes.MAX_TRANSFORM_Y)) {
      return parseInt(this.getAttribute(attributes.MAX_TRANSFORM_Y));
    }

    return null;
  }

  set maxTransformY(value) {
    setIntAttribute(this, attributes.MAX_TRANSFORM_Y, value);
  }

  /**
   * update the transform with respect to containment
   * and min/max transform bounds
   *
   * @param {number} mouseDeltaX mouse delta x
   * @param {number} mouseDeltaY mouse delta y
   * @returns {Array} [transformX, transformY]
   */
  #updateTransform = (mouseDeltaX = null, mouseDeltaY = null) => {
    let translateX = 0;
    let translateY = 0;

    // in case we're dragging and passed in the delta
    // then consider the translateX/Y vs where we
    // first started dragging the mouse from where
    // we moved to

    if (this.axis !== 'y') {
      translateX = this.#dragStartOffset.x + (mouseDeltaX || 0);
    }

    if (this.axis !== 'x') {
      translateY = this.#dragStartOffset.y + (mouseDeltaY || 0);
    }

    if (this.parentContainment) {
      if (this.axis !== 'y') {
        translateX = Math.max(this.#xformBounds.left, translateX);
        translateX = Math.min(this.#xformBounds.right, translateX);
      }

      if (this.axis !== 'x') {
        translateY = Math.max(this.#xformBounds.top, translateY);
        translateY = Math.min(this.#xformBounds.bottom, translateY);
      }
    }

    if (this.hasAttribute(attributes.MIN_TRANSFORM_X)) {
      translateX = Math.max(translateX, this.minTransformX);
    }

    if (this.hasAttribute(attributes.MAX_TRANSFORM_X)) {
      translateX = Math.min(translateX, this.maxTransformX);
    }

    if (this.hasAttribute(attributes.MIN_TRANSFORM_Y)) {
      translateY = Math.max(translateY, this.minTransformY);
    }

    if (this.hasAttribute(attributes.MAX_TRANSFORM_Y)) {
      translateY = Math.min(translateY, this.maxTransformY);
    }

    this.style.setProperty(
      'transform',
      `translate(${translateX}px, ${translateY}px)`
    );

    return [translateX, translateY];
  };

  /**
   * called on mouse move; transforms element for
   * transition offset and updates cursor overlay
   * element as necessary
   *
   * @param {*} e mousemove event
   */
  onMouseMove = (e) => {
    e.preventDefault();
    const eventDetail = {};

    if (this.isDragging) {
      const dragDeltaX = e.x - this.#dragStartMousePoint.x;
      const dragDeltaY = e.y - this.#dragStartMousePoint.y;

      // once draggable bound to parent was updated,
      // update the transform

      const [
        translateX,
        translateY
      ] = this.#updateTransform(dragDeltaX, dragDeltaY);

      if (this.#parentRect) {
        eventDetail.parentRect = this.#parentRect;
      }

      eventDetail.mouseX = e.x;
      eventDetail.mouseY = e.y;
      eventDetail.dragDeltaX = dragDeltaX;
      eventDetail.dragDeltaY = dragDeltaY;
      eventDetail.translateX = translateX;
      eventDetail.translateY = translateY;

      if (this.#cursorEl) {
        this.#cursorEl.style.left = `${e.x - CURSOR_EL_SIZE / 2}px`;
        this.#cursorEl.style.top = `${e.y - CURSOR_EL_SIZE / 2}px`;
      }
    }

    eventDetail.originalEvent = e;

    this.triggerEvent('ids-drag', this, { detail: eventDetail });
  };

  onMouseUp = (e) => {
    if (this.isDragging) {
      this.isDragging = false;
      this.triggerEvent('ids-dragend', this, {
        detail: {
          mouseX: e.x,
          mouseY: e.y,
          dragDeltaX: e.x - this.#dragStartMousePoint.x,
          dragDeltaY: e.y - this.#dragStartMousePoint.y
        }
      });

      (document.body.querySelector('ids-container') || document.body)
        ?.removeChild(this.#cursorEl);
    }

    this.offEvent('mousemove', document, this.onMouseMove);
    this.offEvent('mouseup', document, this.onMouseUp);

    this.#cursorEl.style.pointerEvents = 'none';
  };

  /**
   * @param {boolean} value Whether or not this element
   * and content is being dragged
   */
  set isDragging(value) {
    const isTruthy = stringToBool(value);

    if (isTruthy && this.getAttribute(attributes.IS_DRAGGING) !== '') {
      this.setAttribute(attributes.IS_DRAGGING, '');
    } else if (!isTruthy && this.hasAttribute(attributes.IS_DRAGGING)) {
      this.removeAttribute(attributes.IS_DRAGGING);
    }
  }

  /**
   * @returns {boolean} value Whether or not this element
   * and content is being dragged
   */
  get isDragging() {
    return stringToBool(this.getAttribute(attributes.IS_DRAGGING));
  }

  /**
   * Get the "cursor" property of cursor element
   * placed in front of drag
   *
   * @returns {string} cursor property
   */
  #getCursorStyle() {
    switch (this.axis) {
    case 'x': { return 'ew-resize'; }
    case 'y': { return 'ns-resize'; }
    default: { return 'move'; }
    }
  }

  /**
   * Element that is currently draggable;
   * if "handle" becomes it possibly becomes the selected element.
   *
   * Otherwise it defaults to the overall draggable container (this)
   */
  #handleElem;

  /**
   * First measurable parent's rectangle
   * when a drag is initiated
   *
   * @type {{ x: number, y: number }}
   */
  #parentRect;

  /**
   * The point where we start dragging on the mouse
   * to delta from for current tracking.
   *
   * @type {{ x: number, y: number }}
   */
  #dragStartMousePoint;

  /**
   * The transform translation point applied at
   * the time of a dragstart in order to calculate
   * delta during drag
   *
   * @type {{ x: number, y: number }}
   */
  #dragStartOffset;

  /**
   * Parent's offset to the document when dragging
   *
   * @type {{ x: number, y:number }}
   */
  #parentOffset;

  /**
   * The bounding rectangle of this component at the
   * time of a dragstart offset by translate (so
   * its original position in the div on start of drag)
   * @type {{ x: number, y: number }}
   */
  #dragStartRect;

  /**
   * Rectangle bounds that transform is limited to if drag
   * is bounded by parent
   *
   * @type {{ top: number, bottom: number, left: number, right: number }}
   */
  #xformBounds;

  /**
   * Element which provides cursor for mouse when
   * dragging after mousedown event since we can
   * bind to X/Y axes and there's no way to override
   * the behavior
   */
  #cursorEl = document.createElement('div');

  /**
   * Update parent rectangle stored in this.#parentRect
   *
   * @param {*} path path passed by mouse/drag event
   * to traverse through shadow and lightDOM
   * @private
   */
  #updateParentRect(path) {
    // in order to measure the size of the parent,
    // when dragging has started, iterate through
    // path captured from drag until parent level
    // outside of this draggable or an immediate IdsElement
    // (e.g. non styled container) is detected
    this.#parentRect = undefined;

    let pathElemIndex = 0;
    let pathElem = path[pathElemIndex];
    let hasTraversedThis = false;
    let isAtSlotEl = false;
    let isAtShadowRoot = false;

    while (
      (!this.#parentRect || !hasTraversedThis || isAtShadowRoot || isAtSlotEl)
      && ((pathElemIndex + 1) < path.length)
    ) {
      if (pathElem === this) {
        hasTraversedThis = true;
      }

      pathElemIndex++;
      pathElem = path[pathElemIndex];

      isAtSlotEl = pathElem.tagName === 'SLOT';
      isAtShadowRoot = pathElem instanceof ShadowRoot;

      if (isAtShadowRoot || isAtSlotEl) {
        continue;
      }

      const rect = pathElem?.getBoundingClientRect?.();

      // only use as parent if not a non-presentational rectangles (e.g.
      // the parent IdsElement which has no explicit styling; hence
      // zero-width or zero-height rendered)

      if (rect?.height !== 0 && rect?.width !== 0) {
        this.#parentRect = rect;
      }
    }
  }

  /**
   * @param {number} value The max coordinates relative
   * to the overall div; e.g. "left: -20; right: -20" would extend
   * the minimum x and maximum x from current container
   * bounds, or "top: 10; bottom: 20" would make the top (upwards
   * bounds) 10 below the top or 20 below the bottom).
   */
  set relativeBounds(value) {
    this.setAttribute(attributes.RELATIVE_BOUNDS, value);
    this.#updateRelativeBounds();
  }

  get relativeBounds() {
    return this.getAttribute(attributes.RELATIVE_BOUNDS);
  }

  #relativeBounds = {};

  #updateRelativeBounds() {
    if (this.hasAttribute(attributes.RELATIVE_BOUNDS)) {
      const relativeBoundsAttr = this.getAttribute(attributes.RELATIVE_BOUNDS);
      const newBounds = Object.fromEntries(relativeBoundsAttr.split(';').map((str) => {
        const [kStr, vStr] = str?.split?.(':');

        return [kStr, !Number.isNaN(parseInt(vStr)) ? parseInt(vStr) : 0];
      }));

      if (getBoundsHash(newBounds) !== getBoundsHash(this.#relativeBounds)) {
        this.#relativeBounds = newBounds;
      }
    }
  }
}

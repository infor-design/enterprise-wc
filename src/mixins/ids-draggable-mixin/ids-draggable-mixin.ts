import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import { IdsConstructor } from '../../core/ids-element';
import getElTranslatePoint from '../../utils/ids-draggable-utils/ids-draggable-utils';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';

const CURSOR_EL_SIZE = 32;

type Constraints = IdsConstructor<EventsMixinInterface>;

/**
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsDraggableMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  #relativeBounds: any = {};

  /**
   * Element that is currently draggable;
   * if "handle" becomes it possibly becomes the selected element.
   *
   * Otherwise it defaults to the overall draggable container (this)
   */
  #handleElem: any;

  /**
   * First measurable parent's rectangle
   * when a drag is initiated
   * @type {{ x: number, y: number }}
   */
  #parentPosition: any;

  /**
   * The point where we start dragging on the mouse
   * to delta from for current tracking.
   * @type {{ x: number, y: number }}
   */
  #dragStartMousePoint: any;

  /**
   * The transform translation point applied at
   * the time of a dragstart in order to calculate
   * delta during drag
   * @type {{ x: number, y: number }}
   */
  #dragStartOffset: any;

  /**
   * The bounding rectangle of this component at the
   * time of a dragstart offset by translate (so
   * its original position in the div on start of drag)
   * @type {{ x: number, y: number }}
   */
  #dragStartPosition: any;

  /**
   * Rectangle bounds that transform is limited to if drag
   * is bounded by parent
   * @type {{ top: number, bottom: number, left: number, right: number }}
   */
  #xformBounds: any;

  /**
   * Element which provides cursor for mouse when
   * dragging after mousedown event since we can
   * bind to X/Y axes and there's no way to override
   * the behavior
   */
  cursorEl: any = document.createElement('div');

  isDragging = false;

  state = {
    axis: '',
    parentContainment: null,
    minTransformX: 0,
    maxTransformX: 0,
    minTransformY: 0,
    maxTransformY: 0,
  };

  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.DRAGGABLE,
      attributes.HANDLE,
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();

    if (this.draggable) {
      this.#attachEventHandlers();
    }
  }

  /**
   * Handle all triggering and handling of events
   * @private
   */
  #attachEventHandlers() {
    this.updateHandleElem();

    this.offEvent('mousedown', this.#handleElem);
    this.offEvent('mouseup', window.document, this.onMouseUp);
    this.offEvent('mousemove', window.document, this.onMouseMove);
    this.onEvent('mousedown', this.#handleElem, (e: any) => {
      if (this.disabled || e.button !== 0) {
        return;
      }

      e.preventDefault();
      this.isDragging = true;

      this.onEvent('mouseup', document, this.onMouseUp);
      this.onEvent('mousemove', document, this.onMouseMove);

      // if we have our content being draggable by the parent element,
      // then we need to grab the first parent rectangle bounds
      // as well as append it to the associated event detail

      if (this.state.parentContainment) {
        this.#updateParentRect(e?.path || e?.composedPath?.());
      }

      this.#dragStartMousePoint = { x: e.x, y: e.y };

      const dragOffset = getElTranslatePoint(this);

      this.#dragStartOffset = {
        x: this.state.axis !== 'y' ? dragOffset.x : 0,
        y: this.state.axis !== 'x' ? dragOffset.y : 0
      };

      this.triggerEvent('dragstart', this, {
        detail: {
          mouseX: e.x,
          mouseY: e.y,
          translateX: this.#dragStartOffset.x,
          transitionY: this.#dragStartOffset.y
        }
      });

      const thisPosition = this.getBoundingClientRect();

      // track the base element rectangle
      // (before translation considered)

      this.#dragStartPosition = {
        width: thisPosition.width,
        height: thisPosition.height,
        left: thisPosition.left - this.#dragStartOffset.x,
        right: thisPosition.right - this.#dragStartOffset.x,
        top: thisPosition.top - this.#dragStartOffset.y,
        bottom: thisPosition.bottom - this.#dragStartOffset.y
      };

      let parentLOffset = 0;
      let parentROffset = 0;
      let parentTOffset = 0;
      let parentBOffset = 0;

      if (this.#parentPosition) {
        parentLOffset = (this.#parentPosition.left - this.#dragStartPosition.left);
        parentROffset = (this.#parentPosition.right - this.#dragStartPosition.right);
        parentTOffset = (this.#parentPosition.top - this.#dragStartPosition.top);
        parentBOffset = (this.#parentPosition.bottom - this.#dragStartPosition.bottom);
      }

      this.#xformBounds = {
        left: parentLOffset + (this.#relativeBounds.left || 0),
        right: parentROffset - (this.#relativeBounds.right || 0),
        top: parentTOffset + (this.#relativeBounds.top || 0),
        bottom: parentBOffset - (this.#relativeBounds.bottom || 0)
      };

      this.cursorEl.style.pointerEvents = 'all';

      // append the cursor to either the top-level ids-container
      // or if not found the document body
      // (to avoid double overflow scrollbars)

      (document.body.querySelector('ids-container') || document.body)
        .appendChild(this.cursorEl);
    });
  }

  /**
   * @param {string | boolean} value Whether or not draggable functionality is to be disabled
   */
  set disabled(value: string | boolean) {
    this.toggleAttribute(attributes.DISABLED, stringToBool(value));

    if (this.disabled) {
      this.offEvent('mousemove', window.document, this.onMouseMove);
    }
  }

  /**
   * @returns {boolean} value Whether or not draggable functionality is disabled
   */
  get disabled(): boolean {
    return this.hasAttribute(attributes.DISABLED);
  }

  /**
   * @param {string} value A query selector representing an optional handle that can be used to
   * drag the content of the draggable
   */
  set handle(value: string | null) {
    if (value) {
      this.setAttribute(attributes.HANDLE, value);
    } else {
      this.removeAttribute(attributes.HANDLE);
    }

    this.updateHandleElem();
  }

  /**
   * @returns {string} value A query selector representing an optional handle that can be used to
   * drag the content of the draggable
   */
  get handle(): string | null {
    return this.getAttribute(attributes.HANDLE);
  }

  /**
   * Update the handle element based on the handle attribute or the draggable element itself
   */
  updateHandleElem = () => {
    this.#handleElem = this.handle ? (
      document.querySelector(this.handle) || this
    ) : this;

    if (this.#handleElem !== this) {
      this.#handleElem.style.cursor = this.getCursorStyle();
    }
  };

  /**
   * called on mouse move; transforms element for
   * transition offset and updates cursor overlay
   * element as necessary
   * @param {*} e mousemove event
   */
  onMouseMove: any = (e: any) => {
    e.preventDefault();
    const eventDetail: any = {};

    if (this.isDragging) {
      const dragDeltaX = e.x - this.#dragStartMousePoint.x;
      const dragDeltaY = e.y - this.#dragStartMousePoint.y;

      // once draggable bound to parent was updated,
      // update the transform

      const [
        translateX,
        translateY
      ] = this.#updateTransform(dragDeltaX, dragDeltaY);

      if (this.#parentPosition) {
        eventDetail.parentPosition = this.#parentPosition;
      }

      eventDetail.mouseX = e.x;
      eventDetail.mouseY = e.y;
      eventDetail.clientX = e.clientX;
      eventDetail.clientY = e.clientY;
      eventDetail.dragDeltaX = dragDeltaX;
      eventDetail.dragDeltaY = dragDeltaY;
      eventDetail.translateX = translateX;
      eventDetail.translateY = translateY;

      if (this.cursorEl) {
        this.cursorEl.style.left = `${e.x - CURSOR_EL_SIZE / 2}px`;
        this.cursorEl.style.top = `${e.y - CURSOR_EL_SIZE / 2}px`;
      }
    }

    eventDetail.originalEvent = e;

    this.triggerEvent('drag', this, { detail: eventDetail });
  };

  onMouseUp: any = (e: any) => {
    if (this.isDragging) {
      this.isDragging = false;
      const translatePoint = getElTranslatePoint(this);
      this.triggerEvent('dragend', this, {
        detail: {
          mouseX: e.x,
          mouseY: e.y,
          dragDeltaX: e.x - this.#dragStartMousePoint.x,
          dragDeltaY: e.y - this.#dragStartMousePoint.y,
          translateX: translatePoint.x,
          translateY: translatePoint.y
        }
      });

      (document.body.querySelector('ids-container') || document.body)
        ?.removeChild(this.cursorEl);
    }

    this.offEvent('mousemove', document, this.onMouseMove);
    this.offEvent('mouseup', document, this.onMouseUp);

    this.cursorEl.style.pointerEvents = 'none';
  };

  /**
   * update the transform with respect to containment
   * and min/max transform bounds
   * @param {number} mouseDeltaX mouse delta x
   * @param {number} mouseDeltaY mouse delta y
   * @returns {Array} [transformX, transformY]
   */
  #updateTransform = (mouseDeltaX: number, mouseDeltaY: number) => {
    let translateX = 0;
    let translateY = 0;

    // in case we're dragging and passed in the delta
    // then consider the translateX/Y vs where we
    // first started dragging the mouse from where
    // we moved to

    if (this.state.axis !== 'y') {
      translateX = this.#dragStartOffset.x + mouseDeltaX;
    }

    if (this.state.axis !== 'x') {
      translateY = this.#dragStartOffset.y + mouseDeltaY;
    }

    if (this.state.parentContainment) {
      if (this.state.axis !== 'y') {
        translateX = Math.max(this.#xformBounds.left, translateX);
        translateX = Math.min(this.#xformBounds.right, translateX);
      }

      if (this.state.axis !== 'x') {
        translateY = Math.max(this.#xformBounds.top, translateY);
        translateY = Math.min(this.#xformBounds.bottom, translateY);
      }
    }

    if (this.state.minTransformX) {
      translateX = Math.max(translateX, this.state.minTransformX);
    }

    if (this.state.maxTransformX) {
      translateX = Math.min(translateX, this.state.maxTransformX);
    }

    if (this.state.minTransformY) {
      translateY = Math.max(translateY, this.state.minTransformY);
    }

    if (this.state.maxTransformY) {
      translateY = Math.min(translateY, this.state.maxTransformY);
    }

    this.style.setProperty(
      'transform',
      `translate(${translateX}px, ${translateY}px)`
    );

    this.setAttribute('aria-valuenow', (this.state.axis === 'x' ? translateX : translateY).toString());
    return [translateX, translateY];
  };

  /**
   * Get the "cursor" property of cursor element
   * placed in front of drag
   * @returns {string} cursor property
   */
  getCursorStyle(): string {
    switch (this.state.axis) {
      case 'x': { return 'ew-resize'; }
      case 'y': { return 'ns-resize'; }
      default: { return 'move'; }
    }
  }

  /**
   * Update parent rectangle stored in this.#parentPosition
   * @param {*} path path passed by mouse/drag event
   * to traverse through shadow and lightDOM
   * @private
   */
  #updateParentRect(path: any) {
    // in order to measure the size of the parent,
    // when dragging has started, iterate through
    // path captured from drag until parent level
    // outside of this draggable or an immediate IdsElement
    // (e.g. non styled container) is detected
    this.#parentPosition = undefined;

    let pathElemIndex = 0;
    let pathElem = path[pathElemIndex];
    let hasTraversedThis = false;
    let isAtSlotEl = false;
    let isAtShadowRoot = false;

    while (
      (!this.#parentPosition || !hasTraversedThis || isAtShadowRoot || isAtSlotEl)
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
        this.#parentPosition = rect;
      }
    }
  }
};

export default IdsDraggableMixin;

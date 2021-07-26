import {
  IdsElement,
  customElement,
  attributes,
  scss,
  stringUtils,
  mix
} from '../ids-base/ids-element';

import {
  IdsThemeMixin,
  IdsEventsMixin
} from '../ids-mixins';

import styles from './ids-draggable.scss';
import getElTranslation from './getElTranslatePoint';

const { stringToBool } = stringUtils;

const CURSOR_EL_SIZE = 32;

/* istanbul ignore next */
/**
 * get "cursor" property of cursor element
 * placed in front of drag (may also use this
 * for draggable itself after refactor vs CSS
 * for DRY)
 *
 * @param {{ axis: 'x'|'y'|undefined }} param0 properties
 * @returns {string} cursor property
 */
function getCursorStyle({ axis }) {
  switch (axis) {
  case 'x': { return 'ew-resize'; }
  case 'y': { return 'ns-resize'; }
  default: { return 'move'; }
  }
}

// TODO: pool the cursor element for re-use after
// creating during the connectedCallback vs
// create each time

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
export default class IdsDraggable extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
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
      attributes.IS_DRAGGING,
      attributes.PARENT_CONTAINMENT,
    ];
  }

  /**
   * Create the Template to render
   *
   * @returns {string} the template to render
   */
  template() {
    return (
      `<slot></slot>`
    );
  }

  /**
   * @param {"x"|"y"|undefined} value the axis that the draggable content will
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
    } else if (!nextValue && this.hasAttribute(attributes.AXIS)) {
      this.removeAttribute(attributes.AXIS);
    }
  }

  /**
   * @returns {"x"|"y"|undefined} value the axis that the draggable content will
   * be moving along (e.g. X => horizontal, Y => vertical);
   * By default not defined and supports both axes.
   */
  get axis() {
    return this.getAttribute('axis');
  }

  /**
   * @param {boolean} value whether the draggable should be limited in range
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
   * @returns {boolean} value whether the draggable should be limited in range
   * by its parent element
   */
  get parentContainment() {
    return stringToBool(this.getAttribute(attributes.PARENT_CONTAINMENT));
  }

  /**
   * @param {boolean} value Whether or not draggable functionality is to be disabled
   */
  set disabled(value) {
    const isTruthy = stringUtils.stringToBool(value);

    if (isTruthy && this.getAttribute(attributes.DISABLED) !== '') {
      this.offEvent('mousemove', this.onMouseMove);
      this.setAttribute(attributes.DISABLED, '');
    } else if (!isTruthy && this.hasAttribute(attributes.DISABLED)) {
      this.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * @returns {boolean} value Whether or not draggable functionality is disabled
   */
  get disabled() {
    return stringUtils.stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * @param {string} value A query selector representing an optional handle that can be used to
   * drag the content of the draggable
   */
  set handle(value) {
    if (this.getAttribute(attributes.HANDLE) !== value) {
      if (this.hasAttribute(attributes.HANDLE) && (
        !value || /* istanbul ignore next */ typeof value !== 'string')
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
    this.offEvent('mouseup', document, this.onMouseUp);
    this.offEvent('mousemove', document, this.onMouseMove);

    this.#handleElem = this.handle ? (
      document.querySelector(this.handle) || /* istanbul ignore next */ this
    ) : this;

    if (this.#handleElem !== this) {
      this.#handleElem.style.cursor = getCursorStyle({ axis: this.axis });
    }

    this.onEvent('mousedown', this.#handleElem, (e) => /* istanbul ignore next */ {
      if (this.disabled) {
        return;
      }

      e.preventDefault();
      this.triggerEvent('ids-dragstart', this, { detail: {} });

      this.onEvent('mouseup', document, this.onMouseUp);
      this.isDragging = true;
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

      if (this.#parentRect) {
        this.#xformBounds = {
          left: (this.#parentRect.left - this.#dragStartRect.left),
          right: (this.#parentRect.right - this.#dragStartRect.right),
          top: (this.#parentRect.top - this.#dragStartRect.top),
          bottom: (this.#parentRect.bottom - this.#dragStartRect.bottom)
        };
      }

      this.#cursorEl.style.pointerEvents = 'all';

      // append the cursor to either the top-level ids-container
      // or if not found the document body
      // (to avoid double overflow scrollbars)

      (document.body.querySelector('ids-container') || document.body)
        .appendChild(this.#cursorEl);
    });
  };

  connectedCallback() {
    this.#updateHandleElem();

    // style the cursor element
    this.#cursorEl.style.position = 'absolute';
    this.#cursorEl.style.opacity = 0;
    this.#cursorEl.style.width = `${CURSOR_EL_SIZE}px`;
    this.#cursorEl.style.height = `${CURSOR_EL_SIZE}px`;
    this.#cursorEl.style.backgroundColor = '#000';
    this.#cursorEl.style.cursor = getCursorStyle({ axis: this.axis });

    super.connectedCallback?.();
  }

  /**
   * called on mouse move; transforms element for
   * transition offset and updates cursor overlay
   * element as necessary
   *
   * @param {*} e mousemove event
   */
  onMouseMove = (e) => /* istanbul ignore next */ {
    e.preventDefault();
    const eventDetail = {};

    if (this.isDragging) {
      const dragDeltaX = e.x - this.#dragStartMousePoint.x;
      const dragDeltaY = e.y - this.#dragStartMousePoint.y;
      let translateX = 0;
      let translateY = 0;

      eventDetail.dragDeltaX = dragDeltaX;
      eventDetail.dragDeltaY = dragDeltaY;

      if (this.axis !== 'y') {
        translateX = this.#dragStartOffset.x + dragDeltaX;
      }

      if (this.axis !== 'x') {
        translateY = this.#dragStartOffset.y + dragDeltaY;
      }

      // bound the draggable to the rectangle of the first
      // parent detected

      if (this.parentContainment && this.#parentRect) {
        if (this.axis !== 'y') {
          translateX = Math.max(this.#xformBounds.left, translateX);
          translateX = Math.min(this.#xformBounds.right, translateX);
        }

        if (this.axis !== 'x') {
          translateY = Math.max(this.#xformBounds.top, translateY);
          translateY = Math.min(this.#xformBounds.bottom, translateY);
        }

        eventDetail.parentRect = this.#parentRect;
      }

      eventDetail.translateX = translateX;
      eventDetail.translateY = translateY;

      this.style.transform = `translate(${translateX}px, ${translateY}px)`;

      if (this.#cursorEl) {
        this.#cursorEl.style.left = `${e.x - CURSOR_EL_SIZE / 2}px`;
        this.#cursorEl.style.top = `${e.y - CURSOR_EL_SIZE / 2}px`;
      }
    }

    this.triggerEvent('ids-drag', this, e);
  };

  onMouseUp = (e) => /* istanbul ignore next */ {
    if (this.isDragging) {
      this.isDragging = false;
      this.triggerEvent('ids-dragend', this, e);
      this.offEvent('mousemove', this.onMouseMove);

      (document.body.querySelector('ids-container') || document.body)
        ?.removeChild(this.#cursorEl);
    }

    this.#cursorEl.style.pointerEvents = 'none';
  };

  /**
   * @param {boolean} value whether or not this element
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
   * @returns {boolean} value whether or not this element
   * and content is being dragged
   */
  get isDragging() {
    return stringToBool(this.getAttribute(attributes.IS_DRAGGING));
  }

  /**
   * slot element
   */
  #handleElem;

  /**
   * first measurable parent's rectangle
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
   * parent's offset to the document when dragging
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
   * element which provides cursor for mouse when
   * dragging after mousedown event since we can
   * bind to X/Y axes and there's no way to override
   * the behavior
   */
  #cursorEl = document.createElement('div');

  /**
   * update parent rectangle stored
   * in this.#parentRect
   *
   * @param {*} path path passed by mouse/drag event
   * to traverse through shadow and lightDOM
   * @private
   */
  #updateParentRect(path) /* istanbul ignore next */ {
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

    while (!this.#parentRect || !hasTraversedThis || isAtShadowRoot || isAtSlotEl) {
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

      const rect = pathElem.getBoundingClientRect();

      // only use as parent if not a non-presentational rectangles (e.g.
      // the parent IdsElement which has no explicit styling; hence
      // zero-width or zero-height rendered)

      if (rect.height !== 0 && rect.width !== 0) {
        this.#parentRect = rect;
      }
    }
  }
}

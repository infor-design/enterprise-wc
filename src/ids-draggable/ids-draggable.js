import {
  IdsElement,
  customElement,
  attributes,
  scss,
  stringUtils,
  mix
} from '../ids-base/ids-element';

import {
  IdsKeyboardMixin,
  IdsEventsMixin
} from '../ids-mixins';

import styles from './ids-draggable.scss';
import getElTranslatePoint from './getElTranslatePoint';

const { stringToBool } = stringUtils;

const CURSOR_EL_SIZE = 16;

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
 * @part draggable -- the draggable content this component contains
 */
@customElement('ids-draggable')
@scss(styles)
class IdsDraggable extends mix(IdsElement).with(IdsEventsMixin) {
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

    if (nextValue && this.getAttribute(attributes.AXIS) !== nextValue) {
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
    return this.getAttribute(attributes.AXIS);
  }

  /**
   * @param {string|boolean} value whether the draggable should be limited in range
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

  get parentContainment() {
    return stringToBool(this.getAttribute(attributes.PARENT_CONTAINMENT));
  }

  connectedCallback() {
    // grab the user-content and then pass draggable attrib
    this.#content = this.children[0];
    this.setAttribute('draggable', 'true');

    this.onEvent('mousedown', this, (e) => {
      e.preventDefault();

      this.onEvent('mouseup', document, () => {
        if (this.isDragging) {
          this.isDragging = false;
          this.offEvent('mousemove', this.onMouseMove);
        }

        if (this.#cursorEl) {
          this.#cursorEl.remove();
          this.#cursorEl = undefined;
        }
      });

      this.isDragging = true;
      this.onEvent('mousemove', document, this.onMouseMove);

      // ============================== //
      // capture 1st valid parentRect   //
      // ============================== //

      // in order to measure the size of the parent,
      // when dragging has started, iterate through
      // path captured from drag until parent level
      // outside of this draggable or an immediate IdsElement
      // (e.g. non styled container) is detected

      // TODO: move logic to function

      let pathElemIndex = 0;
      let pathElem = e.path[pathElemIndex];
      let hasTraversedThis = false;

      this.#parentRect = undefined;

      while (!hasTraversedThis || pathElem instanceof ShadowRoot || pathElem.tagName === 'SLOT' || !this.#parentRect) {
        if (pathElem === this) {
          hasTraversedThis = true;
        }

        pathElemIndex++;
        pathElem = e.path[pathElemIndex];

        if (pathElem instanceof ShadowRoot || pathElem.tagName === 'SLOT') {
          continue;
        }

        const rect = pathElem.getBoundingClientRect();

        // only use as parent if not a non-presentational rectangles (e.g.
        // the parent IdsElement which has no explicit styling; hence
        // zero-width or zero-height rendered)

        if (rect.height !== 0 && rect.width !== 0) {
          this.#parentRect = rect;
        }

        // record mouse point at start

        e.parentRect = rect;
      }

      this.#mouseStartingPoint = { x: e.x, y: e.y };
      this.#startingOffset = getElTranslatePoint(this);

      if (!this.cursorEl) {
        this.#cursorEl = document.createElement('div');
      }

      this.#cursorEl.style.position = 'absolute';
      this.#cursorEl.style.opacity = 0;
      this.#cursorEl.style.width = `${CURSOR_EL_SIZE}px`;
      this.#cursorEl.style.height = `${CURSOR_EL_SIZE}px`;
      this.#cursorEl.style.backgroundColor = '#000';
      this.#cursorEl.style.cursor = getCursorStyle({ axis: this.axis });

      document.body.appendChild(this.#cursorEl);
    });

    super.connectedCallback?.();
  }

  onMouseMove = (e) => {
    e.preventDefault();
    if (this.isDragging) {
      const deltaX = e.x - this.#mouseStartingPoint.x;
      const offsetX = this.#startingOffset.x + deltaX;
      const deltaY = e.y - this.#mouseStartingPoint.y;
      const offsetY = this.#startingOffset.y + deltaY;

      const translateX = `${this.axis !== 'y' ? offsetX : 0}px`;
      const translateY = `${this.axis !== 'x' ? offsetY : 0}px`;

      this.style.transform = `translate(${translateX}, ${translateY})`;

      if (this.#cursorEl) {
        this.#cursorEl.style.left = `${e.x - CURSOR_EL_SIZE / 2}px`;
        this.#cursorEl.style.top = `${e.y - CURSOR_EL_SIZE / 2}px`;
      }
    }
  };

  set isDragging(value) {
    const isTruthy = stringToBool(value);

    if (isTruthy && this.getAttribute(attributes.IS_DRAGGING) !== '') {
      this.setAttribute(attributes.IS_DRAGGING, '');
    } else if (!isTruthy && this.hasAttribute(attributes.IS_DRAGGING)) {
      this.removeAttribute(attributes.IS_DRAGGING);
    }
  }

  get isDragging() {
    return stringToBool(this.getAttribute(attributes.IS_DRAGGING));
  }

  /**
   * element related to slot
   */
  #content;

  #parentRect;

  /**
   * The point where we start dragging on the mouse
   * to delta from for current tracking.
   * @type {{ x: number, y: number }} | undefined
   */
  #mouseStartingPoint;

  /**
   * The last delta tracked by the draggable based
   * on style translateX/Y prop
   *
   * @type {{ x: number, y: number }} | undefined
   */
  #startingOffset;

  setParentRect = (rect) => {
    this.#parentRect = rect;
  };

  /**
   * element which provides cursor for mouse when
   * dragging after mousedown event since we can
   * bind to X/Y axes and there's no way to override
   * the behavior
   */
  #cursorEl;
}

export default IdsDraggable;

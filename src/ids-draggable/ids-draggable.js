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
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-draggable.scss';
import getElTranslatePoint from './getElTranslatePoint';

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
export default class IdsDraggable extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      attributes.AXIS,
      attributes.PARENT_CONTAINMENT,
      attributes.DISABLED,
    ];
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
  set boundedByParent(value) {
    const isTruthy = stringUtils.stringToBool(value);

    if (isTruthy) {
      if (this.getAttribute(attributes.PARENT_CONTAINMENT) !== '') {
        this.setAttribute(attributes.PARENT_CONTAINMENT, '');
      }
    } else if (!isTruthy && this.hasAttribute(attributes.PARENT_CONTAINMENT)) {
      this.removeAttribute(attributes.PARENT_CONTAINMENT);
    }
  }

  connectedCallback() {
    super.connectedCallback?.();

    // grab the user-content and then pass draggable attrib
    this.#content = this.children[0];
    this.#content.setAttribute('draggable', 'true');

    // in order to measure the size of the parent,
    // when dragging has started, iterate through
    // path captured from drag until parent level
    // outside of this draggable or an immediate IdsElement
    // (e.g. non styled container) is detected

    this.addEventListener('dragstart', (e) => {
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

        this.#mouseStartingPoint = { x: e.x, y: e.y };
        this.#startingOffset = getElTranslatePoint(this.#content);

        console.log('translationStartingPoint ->', this.#startingOffset);

        e.parentRect = rect;

        // ============================== //
        // remove draggable image overlay //
        // ============================== //

        const draggableImageEl = this.#content.cloneNode(true);
        draggableImageEl.style.display = 'none';
        document.body.appendChild(draggableImageEl);
        e.dataTransfer.setDragImage(draggableImageEl, 0, 0);

        requestAnimationFrame(() => {
          document.body.removeChild(draggableImageEl);
        });
      }
    });

    // workaround an issue where dragend fires with a delay on MacOS
    // TODO: figure out a workaround on this or use mouse-up

    this.addEventListener('dragover', (event) => {
      event.preventDefault();
    }, false);

    this.addEventListener('drag', (event) => {
      const deltaX = event.x - this.#mouseStartingPoint.x;
      const offsetX = this.#startingOffset.x + deltaX;
      this.#content.style.transform = `translate(${offsetX}px, 0px)`;

      // limit for parent rect if needed
      event.dataTransfer.setDragImage(this.#content, 200, 0);
    });
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
   * Create the Template to render
   *
   * @returns {string} the template to render
   */
  template() {
    return (
      `<slot></slot>`
    );
  }
}

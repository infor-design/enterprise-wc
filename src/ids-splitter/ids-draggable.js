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

import styles from './ids-splitter.scss';

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
      attributes.DISABLED,
      attributes.MAX_SIZE,
      attributes.RESIZE_ON_DRAG_END
    ];
  }

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
      nextValue = 'both';
      break;
    }
    }

    if (this.getAttribute(attributes.AXIS) !== nextValue) {
      this.setAttribute(attributes.AXIS, nextValue);
    }
  }

  get axis() {
    return this.getAttribute(attributes.AXIS) || 'both';
  }

  connectedCallback() {
    super.connectedCallback?.();

    // in order to measure the size of the parent,
    // when dragging has started, iterate through
    // path captured from drag until parent level
    // outside of this draggable or an immediate IdsElement
    // (e.g. non styled container) is detected

    this.addEventListener('dragstart', (event) => {
      let pathElemIndex = 0;
      let pathElem = event.path[pathElemIndex];
      let hasTraversedThis = false;

      this.#parentRect = undefined;

      while (!hasTraversedThis || pathElem instanceof ShadowRoot || pathElem.tagName === 'SLOT' || !this.#parentRect) {
        if (pathElem === this) {
          hasTraversedThis = true;
        }

        pathElemIndex++;
        pathElem = event.path[pathElemIndex];

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
      }

      console.log('parentElem with content detected ->', pathElem);
      console.log('parentRect saved ->', this.#parentRect);
    });

    /*
    this.addEventListener('drag', (event) => {
      console.log('drag ->',
      {
        offsetX: event.offsetX,
        movementX: event.movementX,
        pageX: event.pageX
      });

      console.log('event ->', event);
    });
    */
  }

  #parentRect;

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

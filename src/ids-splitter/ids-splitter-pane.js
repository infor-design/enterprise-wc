import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../ids-base/ids-element';

import {
  IdsKeyboardMixin,
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';
import styles from './ids-splitter-pane.scss';
import IdsDraggable from '../ids-draggable';

const getSize = (value) => {
  const capturedParts = `${value}`.match(/([0-9]+)[\s]*(%|px)/);

  if (capturedParts) {
    /* eslint-disable-next-line no-unused-vars */
    const [_, number, unit] = capturedParts;
    return { number, unit };
  }

  return undefined;
};

/**
 * IDS SplitterPane Component
 * @type {IdsSplitterPane}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @part container - the container of all tabs
 */
@customElement('ids-splitter-pane')
@scss(styles)
export default class IdsSplitterPane extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin
  ) {
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
      attributes.MIN_SIZE,
      attributes.MAX_SIZE,
      attributes.SIZE,
      attributes.PANE_ID
    ];
  }

  /**
   * Create the Template to render
   *
   * @returns {string} the template to render
   */
  template() {
    return (
      `<div class="ids-splitter-pane"><slot></slot></div>`
    );
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
  }

  set paneId(value) {
    if (value !== null) {
      this.setAttribute(attributes.PANE_ID, value);
    } else {
      this.removeAttribute(attributes.PANE_ID);
    }
  }

  get paneId() {
    return this.getAttribute(attributes.PANE_ID);
  }

  get size() {
    if (this.hasAttribute(attributes.SIZE)) {
      return this.getAttribute(attributes.SIZE);
    }

    return null;
  }

  set size(value) {
    const currentValue = this.getAttribute(attributes.SIZE);
    const nextValue = parseInt(value);
    if (nextValue !== currentValue) {
      this.setAttribute(attributes.SIZE, nextValue);
      this.#updateSize();
    }
  }

  /**
   * the size and relevant meta data once parsed
   * @type {{ value: number, unit: 'px'|'%', measuredSize: number }}
   */
  #size = {
    value: 0,
    unit: 'px'
  };

  /**
   * bounding box size in the direction of the
   * axis attribute
   */
  #measuredSize;

  #updateSize() {
    if (this.hasAttribute(attributes.SIZE)) {
      // TODO: measure pxSize
      this.#size = getSize(this.size);
    }
  }
}

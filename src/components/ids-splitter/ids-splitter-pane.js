import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../../core/ids-element';

import {
  IdsKeyboardMixin,
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';
import styles from './ids-splitter-pane.scss';

/**
 * IDS SplitterPane Component
 * @type {IdsSplitterPane}
 * @inherits IdsElement
 * @mixes IdsKeyboardMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
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
   * Get a hash of all the size information
   * @private
   * @param {object} m sizeMeta
   * @returns {string} `${minSize}${minSizeU}${size}${sizeU}${maxSize}${maxSizeU}`
   */
  #getSizesHash(m) {
    return `${m.minSize?.number || 0}${m.minSize?.unit || 'px'}`
    + `${m.size?.number || 0}${m.size?.unit || 'px'}`
    + `${m.maxSize?.number || 0}${m.maxSize?.unit || 'px'}`;
  }

  template() {
    return (
      `<div class="ids-splitter-pane"><slot></slot></div>`
    );
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback?.();

    // When mounting, trigger initial size to parent
    // note that we can probably grab this directly from
    // ids-splitter on first-render but the children
    // mount before parent on WC
    window.requestAnimationFrame(() => {
      this.triggerEvent('sizechanged', this, {
        bubbles: true,
        detail: {
          elem: this,
          paneId: this.paneId,
          ...this.getSizeMeta()
        }
      });
    });
  }

  /**
   * Invoked each time the custom element is removed from a document-connected element.
   */
  disconnectedCallback() {
    super.disconnectedCallback?.();
  }

  /**
   * Set the axis dirction
   * @param {string} value Can be 'x' or 'y'
   */
  set axis(value) {
    let nextValue;

    switch (value) {
    case 'y': {
      nextValue = 'y';
      break;
    }
    case 'x':
    default: {
      nextValue = 'x';
      break;
    }
    }

    if (this.getAttribute(attributes.AXIS) !== nextValue) {
      this.setAttribute(attributes.AXIS, nextValue);
    }
  }

  /**
   * Set the pane's ID dirction
   * @param {string} value Can be any string
   */
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

  /**
   * Get the pane's size
   * @returns {string} The size string attribute
   */
  get size() {
    if (this.hasAttribute(attributes.SIZE)) {
      return this.getAttribute(attributes.SIZE);
    }

    return null;
  }

  /**
   * Set the pane's size
   * @param {string} value Can be any string
   */
  set size(value) {
    if ((value !== null) && (value !== this.getAttribute(attributes.SIZE))) {
      this.setAttribute(attributes.SIZE, value);
    }

    if ((value === null) && this.hasAttribute(attributes.SIZE)) {
      this.removeAttribute(attributes.SIZE);
    }

    this.#updateSize();
    this.#checkToUpdateSizesHash();
  }

  get maxSize() {
    if (this.hasAttribute(attributes.MAX_SIZE)) {
      return this.getAttribute(attributes.MAX_SIZE);
    }

    return null;
  }

  set maxSize(value) {
    if ((value !== null) && (value !== this.getAttribute(attributes.MAX_SIZE))) {
      this.setAttribute(attributes.MAX_SIZE, value);
    }

    if ((value === null) && this.hasAttribute(attributes.MAX_SIZE)) {
      this.removeAttribute(attributes.MAX_SIZE);
    }

    this.#updateMaxSize();
    this.#checkToUpdateSizesHash();
  }

  get minSize() {
    if (this.hasAttribute(attributes.MIN_SIZE)) {
      return this.getAttribute(attributes.MIN_SIZE);
    }

    return null;
  }

  set minSize(value) {
    if ((value !== null) && (value !== this.getAttribute(attributes.MIN_SIZE))) {
      this.setAttribute(attributes.MIN_SIZE, value);
    }

    if ((value === null) && this.hasAttribute(attributes.MIN_SIZE)) {
      this.removeAttribute(attributes.MIN_SIZE);
    }

    this.#updateMinSize();
    this.#checkToUpdateSizesHash();
  }

  /**
   * the size and relevant meta data once parsed
   * @type {{ number: number, unit: 'px'|'%', measuredSize: number }}
   */
  #size = { number: 0, unit: 'px' };

  /**
   * the max-size and relevant meta data once parsed
   * @type {{ number: number, unit: 'px'|'%', measuredSize: number }}
   */
  #maxSize = { number: 0, unit: 'px' };

  /**
   * the min-size and relevant meta data once parsed
   * @type {{ value: number, unit: 'px'|'%', measuredSize: number }}
   */
  #minSize = { number: 0, unit: 'px' };

  /** contains the string hash of ${min_size}_${size}_${max-size} */
  #sizesHash = '-';

  /**
   * used by ids-splitter to grab current parsed size attribute
   * related data
   * @returns {{ size, maxSize, minSize }} size info with unit included
   */
  getSizeMeta() {
    const sizeMeta = {};

    if (this.hasAttribute(attributes.SIZE)) {
      sizeMeta.size = this.#size;
    }

    if (this.hasAttribute(attributes.MIN_SIZE)) {
      sizeMeta.minSize = this.#minSize;
    }

    if (this.hasAttribute(attributes.MAX_SIZE)) {
      sizeMeta.maxSize = this.#maxSize;
    }

    return sizeMeta;
  }

  /**
   * Parses size string that can be specified with px/%
   * @param {*} value size attribute string/number
   * @returns {{ unit: 'px'|'%', size: number }} | undefined
   */
  #getSize(value) {
    const capturedParts = `${value}`.match(/([0-9]+)[\s]*(%|px)?/);

    if (capturedParts) {
      /* eslint-disable-next-line no-unused-vars */
      const [_, number, unit = 'px'] = capturedParts;
      return { number, unit };
    }

    return undefined;
  }

  /** Update internal size + meta */
  #updateSize() {
    if (this.hasAttribute(attributes.SIZE)) {
      this.#size = this.#getSize(this.size);
    } else {
      this.#size = undefined;
    }
  }

  /** Update internal max size + meta */
  #updateMaxSize() {
    if (this.hasAttribute(attributes.MAX_SIZE)) {
      this.#maxSize = this.#getSize(this.maxSize);
    } else {
      this.#maxSize = undefined;
    }
  }

  /** Update internal min size + meta */
  #updateMinSize() {
    if (this.hasAttribute(attributes.MIN_SIZE)) {
      this.#minSize = this.#getSize(this.minSize);
    } else {
      this.#minSize = undefined;
    }
  }

  /**
   * When combo of min/max/size changes, triggers an attrib-change
   * event for the observing parent ids-splitter to register
   * the new user-entered dimensions
   */
  #checkToUpdateSizesHash() {
    const sizeMeta = this.getSizeMeta();
    const sizesHash = this.#getSizesHash(sizeMeta);

    if (sizesHash !== this.#sizesHash) {
      this.#sizesHash = sizesHash;

      this.triggerEvent('sizechanged', this, {
        bubbles: true,
        detail: {
          elem: this,
          paneId: this.paneId,
          ...sizeMeta
        }
      });
    }
  }
}

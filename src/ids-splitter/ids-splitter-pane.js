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

// TODO: debounce resize event called

/**
 * parses size string that can be specified with px/%
 *
 * @param {*} value size attribute string/number
 * @returns {{ unit: 'px'|'%', size: number }} | undefined
 */
const getSize = (value) => {
  const capturedParts = `${value}`.match(/([0-9]+)[\s]*(%|px)?/);

  if (capturedParts) {
    /* eslint-disable-next-line no-unused-vars */
    const [_, number, unit = 'px'] = capturedParts;
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

  #previousContentSizeHash = '';

  /* istanbul ignore next */
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const contentRect = entry.contentRect?.[0] || entry.contentRect;
      const paneId = (() => entry.target.paneId)();

      const contentSizeHash = `${parseInt(contentRect.width)}_${parseInt(contentRect.height)}`;
      const shouldTriggerEvent = this.#previousContentSizeHash !== contentSizeHash;

      if (!shouldTriggerEvent) {
        return;
      }

      console.log('should resize splitter-pane ->', contentSizeHash, this.#previousContentSizeHash);

      this.#previousContentSizeHash = contentSizeHash;

      this.triggerEvent(
        'splitter-pane-resize',
        this,
        {
          detail: {
            paneId,
            contentRect: {
              width: contentRect.width,
              height: contentRect.height
            }
          }
        },
        { bubbles: true }
      );
    }
  });

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
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.resizeObserver.disconnect();
  }

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
    if ((value !== null) && (value !== this.getAttribute.SIZE)) {
      this.setAttribute(attributes.SIZE, value);
      this.#updateSize();
    }

    if ((value === null) && this.hasAttribute(attributes.SIZE)) {
      this.removeAttribute(attributes.SIZE);
      this.#updateSize();
    }
  }

  get maxSize() {
    if (this.hasAttribute(attributes.MAX_SIZE)) {
      return this.getAttribute(attributes.MAX_SIZE);
    }

    return null;
  }

  set maxSize(value) {
    if ((value !== null) && (value !== this.getAttribute.MAX_SIZE)) {
      this.setAttribute(attributes.MAX_SIZE, value);
      this.#updateMaxSize();
    }

    if ((value === null) && this.hasAttribute(attributes.MAX_SIZE)) {
      this.removeAttribute(attributes.MAX_SIZE);
      this.#updateMaxSize();
    }
  }

  get minSize() {
    if (this.hasAttribute(attributes.MIN_SIZE)) {
      return this.getAttribute(attributes.MIN_SIZE);
    }

    return null;
  }

  set minSize(value) {
    if ((value !== null) && (value !== this.getAttribute.MIN_SIZE)) {
      this.setAttribute(attributes.MIN_SIZE, value);
      this.#updateMinSize();
    }

    if ((value === null) && this.hasAttribute(attributes.MIN_SIZE)) {
      this.removeAttribute(attributes.MIN_SIZE);
      this.#updateMinSize();
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

  #maxSize = {
    value: 0,
    unit: 'px'
  };

  #minSize = {
    value: 0,
    unit: 'px'
  };

  /**
   * used by ids-splitter to grab current parsed size attribute
   * related data
   * @returns {{ size, maxSize, minSize }} size info with unit included
   */
  getSizeMeta() {
    const sizeMeta = {};
    if (this.getAttribute(attributes.SIZE) !== null) {
      sizeMeta.size = {
        value: this.#size.value,
        unit: this.#size.unit
      };
    }

    if (this.getAttribute(attributes.MIN_SIZE) !== null) {
      sizeMeta.minSize = {
        value: this.#minSize.value,
        unit: this.#minSize.unit
      };
    }

    if (this.getAttribute(attributes.MAX_SIZE) !== null) {
      sizeMeta.maxSize = {
        value: this.#maxSize.value,
        unit: this.#maxSize.unit
      };
    }

    return sizeMeta;
  }

  /**
   * bounding box size in the direction of the
   * axis attribute
   */
  #measuredSize;

  /** Update internal size + meta */
  #updateSize() {
    if (this.hasAttribute(attributes.SIZE)) {
      this.#size = getSize(this.size);
    } else {
      this.#size = undefined;
    }

    if (this.#size) {
      this.style.setProperty('--size', this.size);
    } else {
      this.style.removeProperty('--size');
    }
  }

  /** Update internal max size + meta */
  #updateMaxSize() {
    if (this.hasAttribute(attributes.MAX_SIZE)) {
      this.#maxSize = getSize(this.maxSize);
    } else {
      this.#maxSize = undefined;
    }

    if (this.#maxSize) {
      this.style.setProperty('--max-size', this.maxSize);
    } else {
      this.style.removeProperty('--max-size');
    }
  }

  /** Update internal min size + meta */
  #updateMinSize() {
    if (this.hasAttribute(attributes.MIN_SIZE)) {
      this.#minSize = getSize(this.minSize);
    } else {
      this.#minSize = undefined;
    }

    if (this.#minSize) {
      this.style.setProperty('--min-size', this.minSize);
    } else {
      this.style.removeProperty('--min-size');
    }
  }
}

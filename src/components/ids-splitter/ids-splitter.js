import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../../core';

import {
  IdsStringUtils as stringUtils
} from '../../utils';

import {
  IdsKeyboardMixin,
  IdsEventsMixin,
  IdsThemeMixin,
  IdsAttributeProviderMixin
} from '../../mixins';

import IdsSplitterPane from './ids-splitter-pane';
import IdsDraggable from '../ids-draggable';
import styles from './ids-splitter.scss';

// TODO

// (1) add MutationObserver for childList,
// or callback on IdsSplitterPane that refreshes the
// IdsSplitterPanes being tracked if it detects
// untracked panes suddenly pop in or are removed

// (2) store max/min/size properties when calculating
// in updatePaneSizes

// (3) add max/min-transform draggable props and update
// based on above

/** @type {{ x: HTMLTemplateElement, y: HTMLTemplateElement }} */
const dragHandleTemplates = {};

['x', 'y'].forEach((axis) => {
  const template = document.createElement('template');
  template.innerHTML = `<div class="drag-handle"><ids-icon icon="drag"></ids-icon></div>`;

  dragHandleTemplates[axis] = template;
});

/**
 * IDS Splitter Component
 * @type {IdsSplitter}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @part container - the container of all tabs
 */
@customElement('ids-splitter')
@scss(styles)
export default class IdsSplitter extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin,
    IdsAttributeProviderMixin
  ) {
  constructor() {
    super();
  }

  /**
   * Maps panes to associated draggables
   * that are before/after the panes on
   * both sides
   *
   * @type {Map<IdsSplitterPane, { before: IdsDraggable, after: IdsDraggable }>}
   */
  #paneDraggableMap = new Map();

  /** A set of ids-draggables being used */
  #draggableSet = new Set();

  /** Tracks pane-ids instantiated by this splitter */
  #paneIdCount = 0;

  /** Has the width and height of the rectangle representing the splitter div */
  #size = { width: 0, height: 0 };

  get #dimension() {
    return (this.axis === 'x') ? 'width' : 'height';
  }

  /** When the splitter observed size changes, store that in contentRect */
  #resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const contentRect = entry.contentRect?.[0] || entry.contentRect;
      if (contentRect) {
        this.#size = {
          width: contentRect.width,
          height: contentRect.height
        };

        this.#updatePaneSizes();
      }
    }
  });

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      attributes.AXIS,
      attributes.DISABLED,
      attributes.PANE_ID,
      attributes.RESIZE_ON_DRAG_END
    ];
  }

  get providedAttributes() {
    const getDraggableAxis = () => this.#getDraggableAxis(this.axis);
    return {
      [attributes.AXIS]: [{
        component: IdsDraggable,
        targetAttribute: attributes.AXIS,
        valueXformer: getDraggableAxis
      }, {
        component: IdsSplitterPane,
        targetAttribute: attributes.AXIS,
        valueXformer: getDraggableAxis
      }]
    };
  }

  /** @returns {string} the template to render */
  template() {
    return (`<slot></slot>`);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#refreshPaneMappings();
    this.onEvent('sizechanged', this, (e) => {
      const {
        detail: {
          elem,
          size,
          minSize,
          maxSize
        }
      } = e;

      // @TODO: also just insert/manage draggables where needed here?
      // vs in explicit event? (for D.R.Y./base case logic)

      if (this.#paneDraggableMap.has(elem)) {
        const entry = this.#paneDraggableMap.get(elem);
        entry.size = size;
        entry.minSize = minSize;
        entry.maxSize = maxSize;
      }

      this.#updatePaneSizes();
    });

    this.#resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
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
      this.#refreshPaneMappings();
    }
  }

  get axis() {
    return this.getAttribute(attributes.AXIS) || 'x';
  }

  set disabled(value) {
    const isTruthy = stringUtils.stringToBool(value);

    if (isTruthy) {
      if (this.getAttribute(attributes.DISABLED) !== '') {
        this.setAttribute(attributes.DISABLED, '');
      } else if (this.hasAttribute(attributes.DISABLED)) {
        this.removeAttribute(attributes.DISABLED);
      }
    }
  }

  get disabled() {
    return stringUtils.stringToBool(this.getAttribute(attributes.DISABLED));
  }

  #refreshPaneMappings() {
    // TODO: instead of clearing pane draggables, re-grab references
    // to the panes/draggable based on their orders and pane-ids

    /* eslint-disable-next-line no-unused-vars */
    for (const [_p, entry] of this.#paneDraggableMap) {
      if (entry.before) {
        entry.before.parentNode.removeChild(entry.before);
      }

      if (entry.after) {
        entry.after.parentNode.removeChild(entry.after);
      }
    }

    this.#paneDraggableMap.clear();

    for (const el of this.children) {
      if (el instanceof IdsSplitterPane) {
        this.#paneDraggableMap.set(el, { before: undefined, after: undefined });

        // assign a pane-id for referencing when
        // possibly dispatching drag events

        if (!el.hasAttribute(attributes.PANE_ID)) {
          const paneId = ++this.#paneIdCount;
          el.setAttribute(attributes.PANE_ID, paneId);
        }
      }
    }

    // populate draggables

    const paneMappings = [...this.#paneDraggableMap.keys()];

    for (let i = 0; i < paneMappings.length - 1; i += 1) {
      const p1 = paneMappings[i];
      const p2 = ((i + 1) < paneMappings.length) ? paneMappings[i + 1] : undefined;
      const p1Entry = this.#paneDraggableMap.get(p1);
      const p2Entry = this.#paneDraggableMap.get(p2);

      const draggable = new IdsDraggable();
      draggable.axis = this.#getDraggableAxis(this.axis);

      // mark/hash the draggable as after this pane for parsing on resize
      draggable.setAttribute(attributes.ID, `d_after_${p1.paneId}`);

      draggable.addEventListener('ids-dragend', (e) => {
        const resizeDelta = e.detail[`dragDelta${this.#dimension === 'width' ? 'X' : 'Y'}`];
        this.#onResizePaneViaDraggable({
          draggable,
          p1,
          p2,
          resizeDelta
        });
      });

      // set draggable overall left offset relative to hte parent since they are
      // added to shadowDOM from parent; this cannot be done through direct
      // style inject but must be through a variable because of WC quirks

      p1Entry.after = draggable;
      draggable.appendChild(
        dragHandleTemplates[this.axis].content.cloneNode(true)
      );

      this.onEvent(`splitter-pane-resize.${p1.paneId}`, p1, (e) => {
        p1Entry.contentRect = e.detail.contentRect;

        // TODO: update width of pane from pane draggable match/paneId
        // based on the offset delta of draggable
        this.#updatePaneSizes();
      });

      if (p2) {
        this.onEvent(`splitter-pane-resize.${p2.paneId}`, p2, (e) => {
          p2Entry.contentRect = e.detail.contentRect;
          this.#updatePaneSizes();
        });
      }

      this.shadowRoot.appendChild(draggable);
    }
  }

  /**
   * @param {*} axis an axis value defined on draggable's axis param
   * @returns {'x'|'y'} the axis interpreted for splitter ('x' | 'y')
   */
  #getDraggableAxis(axis) {
    return ((axis === 'x') || (axis === 'y')) ? axis : 'x';
  }

  /**
   * Updates the draggable translate values based on the width of each
   * draggable pane contained in the splitter
   */
  #repositionDraggables() {
    let afterOffset = 0;
    const totalSize = this.#size[this.#dimension];

    [...this.#paneDraggableMap.entries()].forEach(([pane, { after }], i) => {
      // Note: getBoundingClientRect is somewhat expensive;
      // this call should not be abused if it can be helped
      // (possibly can use servers or cache based on conditions/setting in size
      // method?)

      const paneRect = pane?.getBoundingClientRect?.();

      if (paneRect) {
        afterOffset += this.axis === 'x' ? paneRect.width : paneRect.height;
        if (after) {
          after.style.setProperty('transform', `translateX(${afterOffset}px)`);
        }

        if (i === (this.#paneDraggableMap.size - 1)) {
          const paneSize = `${totalSize - afterOffset}px`;
          if (pane.size !== paneSize) {
            pane.size = paneSize;
          }
        }
      }
    });
  }

  /**
   * Linked to drag-end for resizing the panes
   * based on the delta of drag
   *
   * @param {object} param0 params
   * @param {number} param0.resizeDelta number of pixels dragged to resize
   * @param {IdsSplitterPane} param0.p1 pane to left of draggable
   * @param {IdsSplitterPane} param0.p2 pane to right of draggable
   */
  #onResizePaneViaDraggable({ p1, p2, resizeDelta }) {
    [p1, p2].forEach((pane, i) => {
      const paneSize = parseInt(pane.style[this.#dimension]);
      const addOrSub = resizeDelta * (i === 0) ? 1 : -1;
      pane.style.setProperty(this.#dimension, `${paneSize + (resizeDelta * addOrSub)}px`);
    });
  }

  /** Recalculates pane sizes on child ids-splitter-panes */
  #updatePaneSizes() {
    // Virtually size panes based on:
    //
    // (1) this.boundingRect ✅
    // (2) each pane's min/max/size and unit (percent must be translated) ✅
    // (3) translated size after dragging (TODO); may need to consider the size
    // set in pane's "style" prop to see if explicitly declared
    // (4) if there are conflicts after sizing e.g. too large, recursively
    //     resize things with max-size, then size if possible, and if not fall back
    //     to every div with min-size as last resort to respect the sizes

    // Consideration: can natural size be used? would need to measure rect
    // but may not be efficient (also complicates logic)

    const dimension = (this.axis === 'x') ? 'width' : 'height';
    const splitterSize = this.#size[dimension];

    for (const [pane, entry] of this.#paneDraggableMap) {
      const {
        minSize = { value: 0, unit: 'px' },
        maxSize = { value: splitterSize, unit: 'px' },
        size = {}
      } = entry;

      const [minSizePx, maxSizePx, sizePx] = [minSize, maxSize, size].map((sizeEntry) => {
        if (!sizeEntry) {
          return undefined;
        }
        const { unit, number } = sizeEntry;
        return unit === '%' ? Math.round(splitterSize * number * 0.01) : number;
      });

      let limitedSizePx = sizePx || 0;
      if (minSizePx) {
        limitedSizePx = Math.max(limitedSizePx, minSizePx);
      }

      if (maxSizePx) {
        limitedSizePx = Math.min(limitedSizePx, maxSizePx);
      }

      pane.style.setProperty(dimension, `${limitedSizePx}px`);
    }

    // TODO: update the left offset of draggables based on sizes applied above;
    // for example if P1 has width 269px, P1.after IdsDraggable has left === 269px

    this.#repositionDraggables();
  }
}

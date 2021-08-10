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
  IdsThemeMixin,
  IdsAttributeProviderMixin
} from '../ids-mixins';

import IdsSplitterPane from './ids-splitter-pane';
import IdsDraggable from '../ids-draggable';
import styles from './ids-splitter.scss';

// TODO

// (1) detect the size of the overall splitter using
// MutationObserver + method

// (2) add MutationObserver for children that refreshes the
// IdsSplitterPanes being tracked if it detects
// untracked panes suddenly pop in or are removed

// (3) figure out left/top, add styles and inner content on draggable

/**
 * @type {{ x: HTMLTemplateElement, y: HTMLTemplateElement }}
 */
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
   * maps panes to associated draggables
   * that are before/after the panes on
   * both sides
   *
   * @type {Map<IdsSplitterPane, { before: IdsDraggable, after: IdsDraggable }>}
   */
  #paneDraggableMap = new Map();

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      attributes.AXIS,
      attributes.DISABLED,
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

  /**
   * Create the Template to render
   *
   * @returns {string} the template to render
   */
  template() {
    return (`<slot></slot>`);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#refreshPaneMappings();
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

  /**
   * set of draggables being used
   */
  #draggableSet = new Set();

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
          el.setAttribute(attributes.PANE_ID, ++this.#paneIdCount);
        }
      }
    }

    // populate draggables

    const paneMappings = [...this.#paneDraggableMap.keys()];

    // TODO: use local var when resize code exists
    const thisRect = this.getBoundingClientRect();

    for (let i = 0; i < paneMappings.length / 2; i += 2) {
      const p1 = paneMappings[i];
      const p2 = ((i + 2) > paneMappings.length) ? paneMappings[i + 1] : undefined;
      const p1Entry = this.#paneDraggableMap.get(p1);
      const p2Entry = this.#paneDraggableMap.get(p2);

      const draggable = new IdsDraggable();
      draggable.axis = this.#getDraggableAxis(this.axis);

      // TODO: consider storing rect in entry and updating on resize
      // when event exists
      const pane1Rect = p1.getBoundingClientRect();

      // set draggable overall left offset relative to hte parent since they are
      // added to shadowDOM from parent; this cannot be done through direct
      // style inject but must be through a variable because of WC quirks

      p1Entry.after = draggable;
      draggable.appendChild(dragHandleTemplates[this.axis].content.cloneNode(true));

      if (p2Entry) {
        p2Entry.before = draggable;
      }

      if (this.axis === 'x') {
        draggable.style.setProperty(
          '--parent-offset',
          `${pane1Rect.left + pane1Rect.width - thisRect.left}px`
        );
      } else {
        draggable.style.setProperty(
          '--parent-offset',
          `${pane1Rect.top + pane1Rect.height - thisRect.top}px`
        );
      }

      this.shadowRoot.appendChild(draggable);
    }
  }

  /**
   * track pane-ids instantiated by this splitter
   */
  #paneIdCount = 0;

  #getDraggableAxis(axis) {
    return ((axis === 'x') || (axis === 'y')) ? axis : 'x';
  }

  sizePanes() {
    for (const [pane] of this.#paneDraggableMap) {
      const { value: size, unit } = pane.getSizeMeta();
    }
  }
}

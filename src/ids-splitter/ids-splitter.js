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
    const getDraggableAxis = () => this.#getDraggableAxis();
    return {
      [attributes.AXIS]: [{
        component: IdsDraggable,
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
    return (
      `<div class="ids-splitter">
        <slot></slot>
      </div>`
    );
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
   * tracks references for quick determination
   * of which pane is already in the splitter
   * when mutating the DOM
   */
  #paneSet = new Set();

  /**
   * set of draggables being used
   */
  #draggableSet = new Set();

  #refreshPaneMappings() {
    // TODO: before clearing pane draggables, re-grab references
    // to the panes/draggable based on their orders and pane-ids

    this.#paneSet.clear();
    this.#paneDraggableMap.clear();

    for (const el of this.children) {
      if (el instanceof IdsSplitterPane) {
        this.#paneDraggableMap.set(el, { left: undefined, right: undefined });

        // assign a pane-id for referencing when
        // possibly dispatching drag events

        if (!el.hasAttribute(attributes.PANE_ID)) {
          el.setAttribute(attributes.PANE_ID, ++this.#paneIdCount);
        }

        // add this pane to be tracked
        if (!this.#paneSet.has(el)) {
          this.#paneSet.add(el);
        }
      }
    }

    // populate draggables

    const paneMappings = [...this.#paneDraggableMap.keys()];

    for (let i = 0; i < paneMappings.length / 2; i += 2) {
      const lPane = paneMappings[i];
      const rPane = ((i + 2) > paneMappings.length) ? paneMappings[i + 1] : undefined;
      const lPaneEntry = this.#paneDraggableMap.get(lPane);
      const rPaneEntry = this.#paneDraggableMap.get(rPane);

      const draggable = new IdsDraggable();
      draggable.axis = this.#getDraggableAxis();
      draggable.innerHTML = '&lt;draggable-here&gt;';
      lPaneEntry.after = draggable;

      if (rPaneEntry) {
        rPaneEntry.before = draggable;
      }

      lPane.insertAdjacentElement('afterend', draggable);
    }
  }

  /**
   * track pane-ids instantiated by this splitter
   */
  #paneIdCount = 0;

  #getDraggableAxis(axis) {
    return (((axis === 'x') || (axis === 'y')) ? axis : 'x');
  }
}

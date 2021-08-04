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
    return {
      [attributes.AXIS]: [{
        component: IdsDraggable,
        targetAttribute: attributes.AXIS,
        valueXformer: (axis) => (((axis === 'x') || (axis === 'y')) ? axis : 'x')
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
      `<div class="ids-splitter"><ids-draggable /></div>`
    );
  }

  connectedCallback() {
    const containerIndexes = [];
    const draggableIndexes = [];

    [...this.children].forEach((elem, i) => {
      if (elem instanceof IdsDraggable) {
        draggableIndexes.push(i);
      } else {
        containerIndexes.push(i);
      }
    });

    super.connectedCallback?.();
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
   * links draggables to a set of associated elements which it controls.
   * Example: []
   *
   * @type {Map<IdsDraggable, Set<HTMLElement>>}
   */
  #draggableContainerMap = new Map();
}

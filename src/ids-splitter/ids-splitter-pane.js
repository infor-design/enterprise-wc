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
      attributes.SIZE
    ];
  }

  /**
   * Create the Template to render
   *
   * @returns {string} the template to render
   */
  template() {
    return (`<div class="ids-splitter-pane"><slot></slot></div>`);
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
  }
}

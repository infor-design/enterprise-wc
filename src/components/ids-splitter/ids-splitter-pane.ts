import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';
import type IdsSplitter from './ids-splitter';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import styles from './ids-splitter-pane.scss';

const Base = IdsLocaleMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS SplitterPane Component
 * @type {IdsSplitterPane}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @part pane - the splitter pane container element
 */
@customElement('ids-splitter-pane')
@scss(styles)
export default class IdsSplitterPane extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.COLLAPSED,
      attributes.SIZE,
      attributes.MIN_SIZE,
      attributes.MAX_SIZE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-splitter-pane" part="pane"><slot></slot></div>`;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.size) {
      this.state.collapsedSize = String(this.size);
    }
  }

  state = { collapsedSize: String(this.size) };

  /**
   * Set the collapsed state of the pane
   * @param {boolean} value for the size in percent with the percent sign
   */
  set collapsed(value: boolean) {
    const val = stringToBool(value);
    if (val) {
      this.state.collapsedSize = String(this.size) === '0%' ? this.state.collapsedSize : String(this.size);
      this.setAttribute(attributes.COLLAPSED, String(val));
    } else {
      this.removeAttribute(attributes.COLLAPSED);
      this.size = this.state.collapsedSize;
    }

    if (this.parentNode && (this.parentNode as IdsSplitter).initialized && val) {
      (this.parentNode as IdsSplitter).collapse({ startPane: `#${this.id}`, endPane: `#${this.id}` });
    }

    if (this.parentNode && (this.parentNode as IdsSplitter).initialized && !val) {
      (this.parentNode as IdsSplitter).expand({ startPane: `#${this.id}`, endPane: `#${this.id}` });
    }
  }

  /**
   * Get collapsed state of the pane
   * @returns {boolean} the size value
   */
  get collapsed(): boolean {
    return stringToBool(this.getAttribute(attributes.COLLAPSED));
  }

  /**
   * Set the pane size (width or height depending on axis)
   * @param {string} value for the size in percent with the percent sign
   */
  set size(value: number | string | null) {
    if (value) {
      this.setAttribute(attributes.SIZE, String(value) || `${100 / (this.parentNode?.childElementCount || 0)}%`);
    } else {
      this.removeAttribute(attributes.SIZE);
    }

    if (this.parentNode && (this.parentNode as IdsSplitter).initialized) {
      (this.parentNode as IdsSplitter).refreshSizes();
    }
  }

  /**
   * Get the current panes size
   * @returns {number | string | null} the size value
   */
  get size(): number | string | null {
    return this.getAttribute(attributes.SIZE) || `${100 / (this.parentNode?.childElementCount || 0)}%`;
  }

  /**
   * Set the pane minSize
   * @param {string} value for the minSize
   */
  set minSize(value: number | string | null) {
    if (value) {
      this.setAttribute(attributes.MIN_SIZE, String(value));
    } else {
      this.removeAttribute(attributes.MIN_SIZE);
    }

    if (this.parentNode && (this.parentNode as IdsSplitter).initialized) {
      (this.parentNode as IdsSplitter).refreshSizes();
    }
  }

  /**
   * Get the current panes minSize
   * @returns {number | string | null} the minSize value
   */
  get minSize(): number | string | null {
    return this.getAttribute(attributes.MIN_SIZE);
  }

  /**
   * Set the pane maxSize
   * @param {string} value for the maxSize
   */
  set maxSize(value: number | string | null) {
    if (value) {
      this.setAttribute(attributes.MAX_SIZE, String(value));
    } else {
      this.removeAttribute(attributes.MAX_SIZE);
    }

    if (this.parentNode && (this.parentNode as IdsSplitter).initialized) {
      (this.parentNode as IdsSplitter).refreshSizes();
    }
  }

  /**
   * Get the current panes maxSize
   * @returns {number | string | null} the maxSize value
   */
  get maxSize(): number | string | null {
    return this.getAttribute(attributes.MAX_SIZE);
  }
}

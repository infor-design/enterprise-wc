import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
import '../ids-checkbox/ids-checkbox';
import '../ids-swappable/ids-swappable';
import '../ids-swappable/ids-swappable-item';
import styles from './ids-list-view-item.scss';

const Base = IdsEventsMixin(
  IdsElement
);

/**
 * IDS List View Item Component
 * @type {IdsListViewItem}
 * @inherits IdsElement
 */
@customElement('ids-list-view-item')
@scss(styles)
export default class IdsListViewItem extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<slot></slot>`;
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ACTIVE,
      attributes.DISABLED,
      attributes.SELECTED,
      attributes.ROW_INDEX,
    ];
  }

  /**
   * Set the row index. This index can be used to lazy-load data from IdsListView.data.
   * @param {number} value the index
   */
  set rowIndex(value: number) {
    if (value !== null && value >= 0) {
      this.setAttribute(attributes.ROW_INDEX, String(value));
    } else {
      this.removeAttribute(attributes.ROW_INDEX);
    }
  }

  /**
   * Get the row index. This index can be used to lazy-load data from IdsListView.data.
   * @returns {number} this list-view-item's index in parent IdsListView
   */
  get rowIndex(): number { return Number(this.getAttribute(attributes.ROW_INDEX) ?? -1); }

  /**
   * Wrapper function that adds interface to match dataset interface.
   * @returns {boolean} true/false
   */
  get itemActivated(): boolean { return this.active; }

  /**
   * Get the list-item active state.
   * @returns {boolean} true/false
   */
  get active(): boolean { return this.hasAttribute(attributes.ACTIVE); }

  /**
   * Set the list-item active state.
   * @param {boolean} value true/false
   */
  set active(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.ACTIVE, 'true');
    } else {
      this.removeAttribute(attributes.ACTIVE);
    }
  }

  /**
   * Set the list-item disabled state.
   * @param {boolean} value true/false
   */
  set disabled(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * Get the list-item disabled state.
   * @returns {boolean} true/false
   */
  get disabled(): boolean { return this.hasAttribute(attributes.DISABLED); }

  /**
   * Wrapper function that adds interface to match dataset interface.
   * @returns {boolean} true/false
   */
  get itemSelected(): boolean { return this.selected; }

  /**
   * Get the list-item selected state.
   * @returns {boolean} true/false
   */
  get selected(): boolean { return this.hasAttribute(attributes.SELECTED); }

  /**
   * Set the list-item selected state.
   * @param {boolean} value true/false
   */
  set selected(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SELECTED, 'true');
    } else {
      this.removeAttribute(attributes.SELECTED);
    }
  }
}
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
   * Set the row index. This index will be used to popuplate data from ids-data-grid.
   * @param {number} value the index
   */
  set rowIndex(value: number) {
    if (value !== null && value >= 0) {
      this.setAttribute(attributes.ROW_INDEX, String(value));
    } else {
      this.removeAttribute(attributes.ROW_INDEX);
    }
  }

  get rowIndex(): number { return Number(this.getAttribute(attributes.ROW_INDEX) ?? -1); }

  get itemActivated(): boolean { return this.active; }

  get active(): boolean { return this.hasAttribute(attributes.ACTIVE); }

  set active(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.ACTIVE, 'true');
    } else {
      this.removeAttribute(attributes.ACTIVE);
    }
  }

  set disabled(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
  }

  get disabled(): boolean { return this.hasAttribute(attributes.DISABLED); }

  get itemSelected(): boolean { return this.selected; }

  get selected(): boolean { return this.hasAttribute(attributes.SELECTED); }

  set selected(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SELECTED, 'true');
    } else {
      this.removeAttribute(attributes.SELECTED);
    }
  }
}

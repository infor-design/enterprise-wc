import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import { attributes } from '../../core/ids-attributes';
import { validMaxHeight } from '../../utils/ids-dom-utils/ids-dom-utils';
import type IdsListBoxOption from './ids-list-box-option';
import './ids-list-box-option';

import styles from './ids-list-box.scss';

/**
 * IDS List Box Component
 * @type {IdsListBox}
 * @inherits IdsElement
 */
@customElement('ids-list-box')
@scss(styles)
export default class IdsListBox extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.MAX_HEIGHT,
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'listbox');
    this.#configureListBoxOptions();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<slot></slot>`;
  }

  /**
   * Get list of options
   * @returns {IdsListBoxOption[]} ids-list-box-option child elements
   */
  get options(): IdsListBoxOption[] {
    return [...this.querySelectorAll<IdsListBoxOption>('ids-list-box-option')];
  }

  get optionsSorted() {
    return this.options.sort(
      (current: IdsListBoxOption, next: IdsListBoxOption) => (current.rowIndex >= next.rowIndex ? 1 : -1)
    );
  }

  /**
   * @returns {string | null} The max height value
   */
  get maxHeight(): string | null {
    return this.getAttribute(attributes.MAX_HEIGHT);
  }

  /**
   * Set the max height value
   * @param {string | number | null} value The value
   */
  set maxHeight(value: string | number | null) {
    const val = validMaxHeight(value);
    if (val) {
      this.setAttribute(attributes.MAX_HEIGHT, val);
    } else {
      this.removeAttribute(attributes.MAX_HEIGHT);
    }
  }

  #configureListBoxOptions() {
    this.options.forEach((option: IdsListBoxOption, index) => {
      option.rowIndex = index;
    });
  }
}

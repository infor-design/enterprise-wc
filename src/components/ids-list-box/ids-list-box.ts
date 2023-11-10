import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
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

  #configureListBoxOptions() {
    this.options.forEach((option: IdsListBoxOption, index) => {
      option.rowIndex = index;
    });
  }
}

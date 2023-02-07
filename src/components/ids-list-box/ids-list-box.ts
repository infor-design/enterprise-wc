import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
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
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<slot></slot>`;
  }
}

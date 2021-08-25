import {
  IdsElement,
  customElement
} from '../../core';

import './ids-list-box-option';

/**
 * IDS List Box Component
 * @type {IdsListBoxOption}
 * @inherits IdsElement
 */
@customElement('ids-list-box')
class IdsListBoxOption extends IdsElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute('role', 'listbox');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<slot></slot>`;
  }
}

export default IdsListBoxOption;

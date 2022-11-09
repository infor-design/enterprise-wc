import { customElement } from '../../core/ids-decorators';
import IdsNode from '../../core/ids-node';

// Mixin Here
const Base = IdsNode;
debugger

@customElement('ids-data-grid-header')
export default class IdsDataGridHeader extends Base {
  constructor() {
    debugger
    super();
  }

  connectedCallback(): void {
    debugger
    this.classList.add('ids-data-grid-header');
    this.setAttribute('role', 'rowgroup');
    this.setAttribute('part', 'header');
    super.connectedCallback();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<slot></slot>`;
  }
}

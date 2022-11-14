import { customElement } from '../../core/ids-decorators';
import IdsNode from '../../core/ids-node';

@customElement('ids-data-grid-cell')
export default class IdsDataGridCell extends IdsNode {
  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  /**
   * Return the Template for the cell contents
   * @returns {string} The template
   */
  static template(): string {
    return '';
  }
}

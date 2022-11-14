import { customElement } from '../../core/ids-decorators';
import IdsNode from '../../core/ids-node';

import type IdsDataGrid from './ids-data-grid';

// Mixin Here
const Base = IdsNode;

@customElement('ids-data-grid-row')
export default class IdsDataGridRow extends Base {
  static dataGrid: IdsDataGrid | null = null;

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  /**
   * Return the Template for the header contents
   * @returns {string} The template
   */
  static template(): string {
    return '';
  }
}

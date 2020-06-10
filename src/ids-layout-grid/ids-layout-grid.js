import { IdsElement, customElement } from '../ids-base/ids-element';
import './ids-layout-grid.scss';

/**
 * IDS Layout Component
 */
@customElement('ids-layout-grid')
class IdsLayoutGrid extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.classList.add('ids-layout-grid');
  }
}

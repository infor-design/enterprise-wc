import { IdsElement, customElement, version } from '../ids-base/ids-element';
import './ids-layout-grid.scss';

/**
 * IDS Layout Component
 */
@customElement('ids-layout-grid')
@version()
class IdsLayoutGrid extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  connectedCallBack() {
    this.init();
  }

  init() {
    this.classList.add('ids-layout-grid');
  }
}

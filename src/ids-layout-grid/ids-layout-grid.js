import {
  IdsElement,
  customElement,
  version,
  scss
} from '../ids-base/ids-element';
import styles from './ids-layout-grid.scss';

/**
 * IDS Layout Component
 */
@customElement('ids-layout-grid')
@scss(styles)
class IdsLayoutGrid extends IdsElement {
  constructor() {
    super();
  }

  connectedCallBack() {
    this.init();
  }

  init() {
    // Add class
    this.classList.add('ids-layout-grid');

    // Append One style sheet
    const firstSheet = document.querySelector('#ids-layout-grid-styles');

    if (!firstSheet) {
      const style = document.createElement('style');
      style.setAttribute('id', 'ids-layout-grid-styles');
      style.textContent = this.cssStyles;
      this.appendChild(style);
    }
  }

  static get properties() {
    return ['fixed', 'auto', 'cols', 'rows'];
  }

  /**
   * If true the grid is not responsive and stays equal width as will fit
   * @param {boolean} value true or false/nothing
   */
  set fixed(value) {
    if (value) {
      this.setAttribute('fixed', value);
      this.classList.add('ids-fixed');
      return;
    }

    this.removeAttribute('fixed');
    this.classList.remove('ids-fixed');
  }

  get fixed() { return this.getAttribute('fixed'); }

  /**
   *
   *
   */
  set auto(value) {
    if (value) {
      this.setAttribute('auto', value);
      this.classList.add('ids-layout-cols-auto');
      return;
    }

    this.removeAttribute('auto');
    this.classList.remove('ids-layout-cols-auto');
  }

  get auto() { return this.getAttribute('auto'); }

  /**
   *
   *
   */
  set cols(value) {
    if (value) {
      this.auto = false;
      this.setAttribute('cols', value);
      this.classList.add(`ids-layout-cols-${value}`);
      this.classList.remove('ids-layout-cols-auto');
      return;
    }

    this.removeAttribute('auto');
    this.classList.remove(`ids-layout-cols-${value}`);
  }

  get cols() { return this.getAttribute('cols'); }

  /**
   *
   *
   */
  set rows(value) {
    if (value) {
      this.auto = false;
      this.setAttribute('rows', value);
      this.classList.add(`ids-layout-rows-${value}`);
      this.classList.remove('ids-layout-cols-auto');
      return;
    }

    this.removeAttribute('auto');
    this.classList.remove(`ids-layout-rows-${value}`);
  }

  get rows() { return this.getAttribute('rows'); }
}

export default IdsLayoutGrid;

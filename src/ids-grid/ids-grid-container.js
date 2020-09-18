import {
  IdsElement,
  customElement,
  version,
  scss
} from '../ids-base/ids-element';
import styles from './ids-grid.scss';

/**
 * IDS Layout Component
 */
@customElement('ids-grid-container')
@scss(styles)
class IdsGridContainer extends IdsElement {
  constructor() {
    super();
  }

  connectedCallBack() {
    this.init();
  }

  init() {
    // Add class
    this.classList.add('ids-grid');

    // Append One style sheet
    const firstSheet = document.querySelector('#ids-grid-styles');

    if (!firstSheet) {
      const style = document.createElement('style');
      style.setAttribute('id', 'ids-grid-styles');
      style.textContent = this.cssStyles;
      this.appendChild(style);
    }
  }

  static get properties() {
    return ['fixed', 'auto'];
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
   * Sets the grid to `auto-fit`
   * @param {boolean} value true or false/nothing
   */
  set auto(value) {
    const gridTile = this.querySelectorAll('ids-grid-tile');
    if (value) {
      this.setAttribute('auto', value);
      this.classList.add('ids-grid-cols-auto');
      gridTile.forEach(tile => {
        tile.removeAttribute('span');
        tile.removeAttribute('xs-span');
        tile.removeAttribute('sm-span');
        tile.removeAttribute('md-span');
        tile.removeAttribute('lg-span');
        tile.removeAttribute('xl-span');
      });
      return;
    }

    this.removeAttribute('auto');
    this.classList.remove('ids-grid-cols-auto');
  }

  get auto() { return this.getAttribute('auto'); }
}

export default IdsGridContainer;

import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import styles from './ids-loader.scss';

/**
 * IDS Trigger Field Components
 */
@customElement('ids-loader')
@scss(styles)
class IdsLoader extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-loader">
      <div class="ids-loader-indeterminate"></div>
    </div>`;
  }
}

export default IdsLoader;

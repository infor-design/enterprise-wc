import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
// @ts-ignore
import IdsIcon from '../ids-icon/ids-icon';
// @ts-ignore
import styles from './ids-alert.scss';

/**
 * IDS Alert Component
 */
@customElement('ids-alert')
@scss(styles)
class IdsAlert extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The propertires in an array
   */
  static get properties() {
    return [props.TYPE];
  }

  /**
   * Create the Template for the contents
   *
   * @returns {string} The template
   */
  template() {
    return `<ids-icon size="normal"></ids-icon>`;
  }

  /**
   * Return the type of the alert.
   * @returns {string} the path data
   */
  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Set the type
   * @param {string} value The Type [success, info, error, alert]
   */
  set type(value) {
    if (value) {
      this.setAttribute(props.TYPE, value);
      this.shadowRoot.querySelector('ids-icon').setAttribute(props.ICON, value);
      setTimeout(() => {
        this.shadowRoot.querySelector('ids-icon').shadowRoot.querySelector('svg').classList.add(`icon-${value}`);
      }, 100);
    } else {
      this.removeAttribute(props.TYPE);
    }
  }
}

export default IdsAlert;

import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-input.scss';

// Setting Defaults
const types = {
  default: 'text',
  text: 'text',
  password: 'password',
  number: 'number',
  email: 'email'
};

/**
 * IDS Trigger Field Components
 */
@customElement('ids-input')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsStringUtilsMixin)
class IdsInput extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.TYPE, props.PLACEHOLDER];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <input class="ids-input-field" type="${this.type ? types[this.type] : types.default}" ${this.placeholder ? `placeholder="${this.placeholder}"` : ''}/>
    `;
  }

  /**
   * Set the type of input
   * @param {boolean} value [text, password, number, email]
   */
  set type(value) {
    if (value) {
      this.setAttribute(props.TYPE, value);
    } else {
      this.setAttribute(props.TYPE, types.default);
    }
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Set the placeholder of input
   * @param {string} value of the placeholder property
   */
  set placeholder(value) {
    if (value) {
      this.setAttribute(props.PLACEHOLDER, value);
    }

    this.removeAttribute(props.PLACEHOLDER);
  }

  get placeholder() { return this.getAttribute(props.PLACEHOLDER); }
}

export default IdsInput;

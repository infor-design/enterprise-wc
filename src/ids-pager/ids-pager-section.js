import {
  IdsElement,
  customElement,
  props,
  scss,
  stringUtils
} from '../ids-base';
import styles from './ids-pager-section.scss';

const { stringToBool, buildClassAttrib } = stringUtils;

/**
 * IDS PagerSection Component
 * @type {IdsPagerSection}
 * @inherits IdsElement
 */
@customElement('ids-pager-section')
@scss(styles)
export default class IdsPagerSection extends IdsElement {
  constructor() {
    super();
  }

  template() {
    return `<slot></slot>`;
  }

  get properties() {
    return [props.START, props.END];
  }

  /**
   * @type {boolean|string} value whether this section is
   * at the start/left of the pager (e.g. 1/3 or 1/2 sections);
   * position is flipped in RTL mode
   */
  set start(value) {
    if (stringToBool(value)) {
      this.setAttribute(props.START, '');
      this.classList.add('start');

      // setting START implicitly toggles END
      if (this.hasAttribute(props.END)) {
        this.removeAttribute(props.END);
        this.classList.remove('end');
      }
    } else {
      this.removeAttribute(props.START);
      this.classList.remove('start');
    }
  }

  /**
   * @type {boolean|string} value whether this section is
   * at the end/right of the pager (e.g. 1/3 or 1/2 sections);
   * position is flipped in RTL mode
   */
  set end(value) {
    if (stringToBool(value)) {
      this.setAttribute(props.END, '');
      this.classList.add('end');

      // setting END implicitly toggles START
      if (this.hasAttribute(props.START)) {
        this.removeAttribute(props.START);
        this.classList.remove('start');
      }
    } else {
      this.removeAttribute(props.END);
      this.classList.remove('end');
    }
  }
}

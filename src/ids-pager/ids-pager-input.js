import {
  IdsElement,
  customElement,
  props,
  scss
} from '../ids-base';
import { IdsInput } from '../ids-input/ids-input';
import { IdsText } from '../ids-text/ids-text';
import IdsPagerSection from './ids-pager-section';
import styles from './ids-pager-input.scss';

/**
 * IDS PagerInput Component
 * @type {IdsPagerInput}
 * @inherits IdsElement
 * @part container ids-pager-button container
 */
@customElement('ids-pager-input')
@scss(styles)
export default class IdsPagerInput extends IdsElement {
  constructor() {
    super();
  }

  template() {
    const pageCountShown = this.getAttribute(props.TOTAL) !== null
      ? this.getAttribute(this.props.TOTAL)
      : 'N/A';

    return (
     `<ids-text font-size="16">Page</ids-text>&nbsp;
      <ids-input value="${this.getAttribute(props.PAGE_NUMBER)}"></ids-input>
      <ids-text font-size="16">&nbsp;of ${pageCountShown}</ids-text>`
    );
  }

  get properties() {
    return [props.PAGE_NUMBER, props.TOTAL];
  }

  /**
   * @param {string|number} value 1-based value of the page number (1-based)
   */
  set value(value) {
    this.setAttribute(props.PAGE_NUMBER, value);
    this.input.setAttribute(props.PAGE_NUMBER, value);
  }

  /**
   * @returns {string|number} 1-based value of the page number (1-based pageNumber)
   */
  get value() {
    return this.getAttribute(props.PAGE_NUMBER);
  }

  connectedCallback() {
  }
}

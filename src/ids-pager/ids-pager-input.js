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
    const pageCountShown = this.getAttribute(props.PAGE_COUNT) !== null
      ? this.getAttribute(this.props.PAGE_COUNT)
      : 'N/A';

    return (
     `<ids-text font-size="16">Page</ids-text>&nbsp;
      <ids-input value="${this.getAttribute(props.VALUE)}"></ids-input>
      <ids-text font-size="16">&nbsp;of ${pageCountShown}</ids-text>`
    );
  }

  get properties() {
    return [props.VALUE, props.PAGE_COUNT];
  }

  /**
   * @param {string|number} value 1-based value of the page number (1-based)
   */
  set value(value) {
    this.setAttribute(props.VALUE, value);
    this.input.setAttribute(props.VALUE, value);
  }

  /**
   * @returns {string|number} 1-based value of the page number (1-based pageIndex)
   */
  get value() {
    return this.getAttribute(props.VALUE);
  }

  connectedCallback() {
  }
}

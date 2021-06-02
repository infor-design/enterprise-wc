import {
  IdsElement,
  customElement,
  props,
  scss
} from '../ids-base';
import { IdsInput } from '../ids-input/ids-input';
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
    return `<ids-input value="${this.getAttribute(props.VALUE)}"></ids-input>`;
  }

  get properties() {
    return [props.VALUE];
  }

  connectedCallback() {
  }
}

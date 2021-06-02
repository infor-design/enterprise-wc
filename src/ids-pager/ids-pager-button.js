import {
  IdsElement,
  customElement,
  props,
  scss
} from '../ids-base';
import { IdsButton } from '../ids-button/ids-button';
import IdsPagerSection from './ids-pager-section';
import styles from './ids-pager-button.scss';

/**
 * IDS PagerButton Component
 * @type {IdsPagerButton}
 * @inherits IdsElement
 * @part container ids-pager-button container
 */
@customElement('ids-pager-button')
@scss(styles)
export default class IdsPagerButton extends IdsElement {
  constructor() {
    super();
  }

  template() {
    return `<ids-button>B</ids-button>`;
  }

  get properties() {
    return [];
  }

  connectedCallback() {
  }
}

import {
  IdsElement,
  customElement,
  props,
  scss,
  stringUtils
} from '../ids-base';
import { IdsButton } from '../ids-button/ids-button';
import { IdsIcon } from '../ids-icon/ids-icon';
import IdsPagerSection from './ids-pager-section';
import styles from './ids-pager-button.scss';

const { stringToBool } = stringUtils;
const buttonTypes = ['first', 'last', 'next', 'previous'];

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
    const typeFlag = this.getTypeFlag();

    return (
      `<ids-button ${typeFlag} ${this.hasAttribute(props.DISABLED) ? ' disabled' : ''}>
        <ids-icon icon="${typeFlag}-page" size="medium"></ids-icon>
      </ids-button>`
    );
  }

  get properties() {
    return [
      props.DISABLED,
      props.FIRST,
      props.LAST,
      props.NEXT,
      props.PREVIOUS
    ];
  }

  connectedCallback() {}

  set first(value) {
    this.#setTypeAttribute(props.FIRST, value);
  }

  set last(value) {
    this.#setTypeAttribute(props.LAST, value);
  }

  set next(value) {
    this.#setTypeAttribute(props.NEXT, value);
  }

  set previous(value) {
    this.#setTypeAttribute(props.PREVIOUS, value);
  }

  /**
   * @param {boolean|string} value whether to disable the input or not
   */
  set disabled(value) {
    const idsButton = this.shadowRoot.children[0];

    if (stringToBool(value)) {
      this.setAttribute(props.DISABLED, true);
      idsButton.setAttribute(props.DISABLED, true);
    } else {
      this.removeAttribute(props.DISABLED);
      idsButton.removeAttribute(props.DISABLED);
    }
  }

  /**
   * not for external use; retrieves type flag set
   * (must be declared public for 1st template pass)
   *
   * @returns {string} attribute corresponding to
   * type of button
   */
  getTypeFlag() {
    for (const a of buttonTypes) {
      if (this.hasAttribute(a)) { return a; }
    }

    return '';
  }

  #setTypeAttribute(attribute, value) {
    if (stringToBool(value)) {
      this.setAttribute(value, '');

      for (const type of buttonTypes) {
        if (attribute === type) {
          continue;
        }

        if (this.hasAttribute(type)) {
          this.removeAttribute(type);
        }
      }
    } else {
      this.removeAttribute(attribute);
    }
  }
}

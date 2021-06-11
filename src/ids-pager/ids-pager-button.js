import {
  IdsElement,
  customElement,
  props,
  scss,
  mix,
  stringUtils
} from '../ids-base';
import { IdsButton } from '../ids-button/ids-button';
import { IdsIcon } from '../ids-icon/ids-icon';
import IdsPagerSection from './ids-pager-section';
import styles from './ids-pager-button.scss';
import { IdsEventsMixin } from '../ids-mixins';

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
export default class IdsPagerButton extends mix(IdsElement).with(
    IdsEventsMixin
  ) {
  constructor() {
    super();
  }

  template() {
    const type = this.type;

    return (
      `<ids-button ${type} ${this.hasAttribute(props.DISABLED) ? ' disabled' : ''}>
        <ids-icon icon="${type}-page" size="medium"></ids-icon>
      </ids-button>`
    );
  }

  get properties() {
    return [
      props.TOTAL,
      props.DISABLED,
      props.FIRST,
      props.LAST,
      props.NEXT,
      props.PREVIOUS
    ];
  }

  connectedCallback() {
    this.onEvent('click', this.shadowRoot.querySelector('ids-button'), (e) => this.#onClick(e));
  }

  /**
   * @returns {number} # of pages -- read-only attribute;
   * inferred from pageSize and total
   */
  get pageCount() {
    return (this.total !== null && !Number.isNaN(this.total))
      ? Math.floor(this.total / this.pageSize)
      : null;
  }

  /**
   * @param {boolean|string} value designates this as a nav to first page button
   */
  set first(value) {
    this.#setTypeAttribute(props.FIRST, value);
  }

  /**
   * @param {boolean|string} value designates this as a nav to last page button
   */
  set last(value) {
    this.#setTypeAttribute(props.LAST, value);
  }

  /**
   * @param {boolean|string} value designates this as a nav to next page button
   */
  set next(value) {
    this.#setTypeAttribute(props.NEXT, value);
  }

  /**
   * @param {boolean|string} value designates this as a nav to previous page button
   */
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
   * @returns {string|undefined} type of button based on which attrib was set
   */
  get type() {
    for (const a of buttonTypes) {
      if (this.hasAttribute(a)) { return a; }
    }

    return undefined;
  }

  /**
   * @param {string|number} value number of items to track
   */
  set total(value) {
    this.setAttribute(props.TOTAL, value);
  }

  /**
   * @returns {string|number} number of items for pager is tracking
   */
  get total() {
    return parseInt(this.getAttribute(props.TOTAL));
  }

  /**
   * @returns {string|number} value 1-based page number displayed
   */
  get pageNumber() {
    return parseInt(this.getAttribute(props.PAGE_NUMBER));
  }

  /**
   * @param {string|number} value number of items shown per-page
   */
  set pageSize(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      console.error('ids-pager: non-numeric value sent to page-size');
      nextValue = 0;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(props.PAGE_SIZE, nextValue);
  }

  /**
   * @returns {string|number} number of items shown per-page
   */
  get pageSize() {
    return parseInt(this.getAttribute(props.PAGE_SIZE));
  }

  /**
   * handles click functionality dependent on whether this
   * button is disabled and the type of button it is set to;
   * will bubble up an appropriate event to parent ids-pager
   * in order to update the page-number value via
   * 'pagenumberchange' if applicable
   */
  #onClick() {
    if (!this.disabled) {
      const lastPageNumber = Math.floor(this.total / this.pageSize);

      switch (this.type) {
      case props.FIRST: {
        if (this.pageNumber > 1) {
          this.triggerEvent('pagenumberchange', this, {
            bubbles: true,
            detail: { elem: this, value: 1 }
          });
        }
        break;
      }
      case props.LAST: {
        if (this.pageNumber < lastPageNumber) {
          this.triggerEvent('pagenumberchange', this, {
            bubbles: true,
            detail: { elem: this, value: this.pageCount }
          });
        }
        break;
      }
      case props.PREVIOUS: {
        if (this.pageNumber > 1) {
          this.triggerEvent('pagenumberchange', this, {
            bubbles: true,
            detail: { elem: this, value: this.pageNumber - 1 }
          });
        }
        break;
      }
      case props.NEXT: {
        if (this.pageNumber < lastPageNumber) {
          this.triggerEvent('pagenumberchange', this, {
            bubbles: true,
            detail: { elem: this, value: this.pageNumber + 1 }
          });
        }
        break;
      }
      case props.DISABLED:
      default: {
        break;
      }
      }
    }
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

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
export default class IdsPagerButton extends mix(IdsElement).with(IdsEventsMixin) {
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

  static get properties() {
    return [
      props.DISABLED,
      props.FIRST,
      props.LAST,
      props.NAV_DISABLED,
      props.NEXT,
      props.PAGE_NUMBER,
      props.PARENT_DISABLED,
      props.PREVIOUS,
      props.TOTAL
    ];
  }

  connectedCallback() {
    this.button = this.shadowRoot.querySelector('ids-button');
    this.onEvent('click', this.button, (e) => this.#onClick(e));

    this.#updateDisabledState();
    super.connectedCallback?.();
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
   * @returns {string|boolean} flag indicating whether button is disabled
   * for nav reasons
   */
  get disabled() {
    return this.hasAttribute(props.DISABLED);
  }

  /**
   * @param {boolean|string} value whether to disable input at app-specified-level
   */
  set disabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(props.DISABLED, true);
    } else {
      this.removeAttribute(props.DISABLED);
    }

    this.#updateDisabledState();
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
   * @param {string|boolean} value flag indicating whether button is disabled
   * for nav reasons
   */
  set navDisabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(props.NAV_DISABLED, '');
    } else {
      this.removeAttribute(props.NAV_DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} flag indicating whether button is disabled
   * for nav reasons
   */
  get navDisabled() {
    return this.hasAttribute(props.NAV_DISABLED);
  }

  /**
   * @param {string|boolean} value flag indicating if button is disabled
   * through parent pager's disabled attribute
   */
  set parentDisabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(props.NAV_DISABLED, '');
    } else {
      this.removeAttribute(props.NAV_DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} flag indicating whether button is disabled
   * via parent pager's disabled attribute
   */
  get parentDisabled() {
    return this.hasAttribute(props.NAV_DISABLED);
  }

  /**
   * @param {string|number} value 1-based page number shown
   */
  set pageNumber(value) {
    let nextValue = Number.parseInt(value);

    if (Number.isNaN(nextValue)) {
      nextValue = 1;
    } else if (nextValue <= 1) {
      nextValue = 1;
    } else {
      const pageCount = Math.floor(this.total / this.pageSize);
      nextValue = Math.min(nextValue, pageCount);
    }

    this.#updateNavDisabled();
    this.setAttribute(props.PAGE_NUMBER, nextValue);
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
      nextValue = 1;
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
      this.setAttribute(attribute, '');

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

  /**
   * updates nav-disabled attribute based
   * on page number, size and total to
   * prevent nav actions/disable the component
   * based on these factors
   */
  #updateNavDisabled() {
    let isNavDisabled = false;

    switch (this.type) {
    case props.FIRST:
    case props.PREVIOUS: {
      isNavDisabled = this.pageNumber <= 1;
      break;
    }
    case props.NEXT:
    case props.LAST: {
      isNavDisabled = this.pageNumber >= this.pageCount;
      break;
    }
    default: {
      break;
    }
    }

    if (isNavDisabled) {
      this.navDisabled = true;
    } else {
      this.navDisabled = false;
    }
  }

  /**
   * update visible button disabled state
   * dependent on current page nav and
   * user-provided disabled state
   */
  #updateDisabledState() {
    const isDisabled = (
      this.hasAttribute(props.DISABLED)
      || this.hasAttribute(props.NAV_DISABLED)
      || this.hasAttribute(props.PARENT_DISABLED)
    );

    if (isDisabled) {
      this.button.setAttribute(props.DISABLED, '');
    } else {
      this.button.removeAttribute(props.DISABLED);
    }
  }
}

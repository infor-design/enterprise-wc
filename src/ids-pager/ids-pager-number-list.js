import {
  IdsElement,
  customElement,
  props,
  scss,
  mix,
  stringUtils
} from '../ids-base';
import { IdsText } from '../ids-text/ids-text';
import { IdsEventsMixin, IdsKeyboardMixin } from '../ids-mixins';
import IdsButton from '../ids-button/ids-button';
import styles from './ids-pager-number-list.scss';

const { stringToBool } = stringUtils;

/**
 * IDS PagerNumberList Component
 *
 * @type {IdsPagerNumberList}
 * @inherits IdsElement
 * @part number selectable number among the list
 */
@customElement('ids-pager-number-list')
@scss(styles)
export default class IdsPagerNumberList extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin
  ) {
  constructor() {
    super();
  }

  template() {
    return (
      `<div class="ids-pager-number-list">
      </div>`
    );
  }

  static get properties() {
    return [
      props.DISABLED,
      props.PAGE_NUMBER,
      props.PARENT_DISABLED,
      props.TOTAL,
      props.PAGE_SIZE,
      props.VALUE
    ];
  }

  connectedCallback() {
    if (!this.hasAttribute(props.PAGE_NUMBER)) {
      this.setAttribute(props.PAGE_NUMBER, 1);
    }

    // give parent a chance to reflect properties

    window.requestAnimationFrame(() => {
      this.#populatePageNumberButtons();
    });

    super.connectedCallback?.();
  }

  /**
   * @param {string|number} value number of items shown per-page
   */
  set pageSize(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      console.error('ids-pager: non-numeric value sent to page-size');
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
   * @param {string|number} value 1-based page number shown
   */
  set pageNumber(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      nextValue = 1;
    } else if (Number.parseInt(value) <= 1) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    if (parseInt(nextValue) !== parseInt(this.input?.input.value)) {
      this.setAttribute(props.PAGE_NUMBER, nextValue);
      this.#populatePageNumberButtons();
    }
  }

  /**
   * @returns {string|number} value 1-based page number displayed
   */
  get pageNumber() {
    return parseInt(this.getAttribute(props.PAGE_NUMBER));
  }

  /**
   * @param {string|number} value number of items to track
   */
  set total(value) {
    let nextValue;
    if (Number.isNaN(Number.parseInt(value))) {
      nextValue = 1;
    } else if (Number.parseInt(value) <= 0) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(props.TOTAL, nextValue);
  }

  /**
   * @returns {number|null} the calculated pageCount using total and pageSize
   */
  get pageCount() {
    return this.hasAttribute(props.TOTAL)
      ? Math.floor(this.total / this.pageSize)
      : null;
  }

  /**
   * @returns {string|number} number of items for pager is tracking
   */
  get total() {
    return parseInt(this.getAttribute(props.TOTAL));
  }

  /**
   * @param {boolean|string} value whether to disable input at app-specified-level
   */
  set disabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(props.DISABLED, '');
    } else {
      this.removeAttribute(props.DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} flag indicating whether button is disabled
   * for nav reasons
   */
  get disabled() {
    return this.hasAttribute(props.DISABLED);
  }

  /**
   * @param {string|boolean} value flag indicating if button is disabled
   * through parent pager's disabled attribute
   */
  set parentDisabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(props.PARENT_DISABLED, '');
    } else {
      this.removeAttribute(props.PARENT_DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} flag indicating whether button is disabled
   * via parent pager's disabled attribute
   */
  get parentDisabled() {
    return this.hasAttribute(props.DISABLED);
  }

  get disabledOverall() {
    return (this.hasAttribute(props.DISABLED)
      || this.hasAttribute(props.PARENT_DISABLED)
    );
  }

  /**
   * update visible button disabled state
   * based on parentDisabled and disabled attribs
   */
  #updateDisabledState() {
    // TODO
  }

  #populatePageNumberButtons() {
    let pageNumberHtml = '';
    const pageCount = this.pageCount;

    for (let n = 1; n <= pageCount; n++) {
      pageNumberHtml += `<ids-button>${n}</ids-button>`;
    }

    this.container.innerHTML = pageNumberHtml;

    for (let n = 1; n <= pageCount; n++) {
      const numberButton = this.container.children[n - 1];
      numberButton.button.setAttribute('aria-label', `Go to page ${n}`);
      if (n === this.pageNumber) {
        numberButton.setAttribute(props.SELECTED, '');
      }

      numberButton.addEventListener('click', () => {
        this.triggerEvent('pagenumberchange', this, {
          bubbles: true,
          detail: { elem: this, value: n }
        });
      });
    }
  }
}

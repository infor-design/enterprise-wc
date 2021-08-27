import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

import IdsText from '../ids-text/ids-text';
import { IdsEventsMixin, IdsKeyboardMixin } from '../../mixins';
import IdsButton from '../ids-button/ids-button';
import styles from './ids-pager-number-list.scss';

const { stringToBool } = IdsStringUtils;

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

  static get attributes() {
    return [
      attributes.DISABLED,
      attributes.PAGE_NUMBER,
      attributes.PARENT_DISABLED,
      attributes.TOTAL,
      attributes.PAGE_SIZE,
      attributes.VALUE
    ];
  }

  connectedCallback() {
    // give parent a chance to reflect attributes

    window.requestAnimationFrame(() => {
      this.#populatePageNumberButtons();
    });

    super.connectedCallback?.();
  }

  /**
   * @param {string|number} value The number of items shown per page
   */
  set pageSize(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    if (parseInt(this.getAttribute(attributes.PAGE_SIZE)) !== nextValue) {
      this.setAttribute(attributes.PAGE_SIZE, nextValue);
    }

    this.#populatePageNumberButtons();
  }

  /** @returns {string|number} The number of items shown per page */
  get pageSize() {
    return parseInt(this.getAttribute(attributes.PAGE_SIZE));
  }

  /** @param {string|number} value A value 1-based page number shown */
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

    if (!Number.isNaN(nextValue)
    && Number.parseInt(this.getAttribute(attributes.PAGE_NUMBER)) !== nextValue
    ) {
      this.setAttribute(attributes.PAGE_NUMBER, nextValue);
    }

    this.#populatePageNumberButtons();
  }

  /** @returns {string|number} A value 1-based page number displayed */
  get pageNumber() {
    return parseInt(this.getAttribute(attributes.PAGE_NUMBER));
  }

  /** @param {string|number} value The number of items to track */
  set total(value) {
    let nextValue;
    if (Number.isNaN(Number.parseInt(value))) {
      nextValue = 1;
    } else if (Number.parseInt(value) <= 0) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    if (Number.parseInt(this.getAttribute(attributes.TOTAL)) !== nextValue) {
      this.setAttribute(attributes.TOTAL, nextValue);
    }
  }

  /** @returns {number|null} The calculated pageCount using total and pageSize */
  get pageCount() {
    return this.hasAttribute(attributes.TOTAL)
      ? Math.floor(this.total / this.pageSize)
      : null;
  }

  /** @returns {string|number} The number of items for pager is tracking */
  get total() {
    return parseInt(this.getAttribute(attributes.TOTAL));
  }

  /** @param {boolean|string} value Whether to disable input at app-specified-level */
  set disabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.#updateDisabledState();
  }

  /** @returns {string|boolean} A flag indicating whether button is disabled for nav reasons */
  get disabled() {
    return this.hasAttribute(attributes.DISABLED);
  }

  /**
   * @param {string|boolean} value A flag indicating if button is disabled through parent pager's
   * disabled attribute
   */
  set parentDisabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.PARENT_DISABLED, '');
    } else {
      this.removeAttribute(attributes.PARENT_DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} A flag indicating whether button is
   * disabled via parent pager's disabled attribute
   */
  get parentDisabled() {
    return this.hasAttribute(attributes.PARENT_DISABLED);
  }

  /**
   * @returns {string|boolean} Whether the functionality overall is disabled based on
   * a combination of other available disabled fields
   */
  get disabledOverall() {
    return (this.hasAttribute(attributes.DISABLED)
      || this.hasAttribute(attributes.PARENT_DISABLED)
    );
  }

  /**
   * update visible button disabled state
   * based on parentDisabled and disabled attribs
   */
  #updateDisabledState() {
    for (const el of this.container.children) {
      if (this.disabledOverall) {
        el.setAttribute(attributes.DISABLED, '');
      } else {
        el.removeAttribute(attributes.DISABLED);
      }
    }
  }

  #populatePageNumberButtons() {
    let pageNumberHtml = '';
    const pageCount = this.pageCount;

    for (let n = 1; n <= pageCount; n++) {
      pageNumberHtml += `<ids-button ${this.disabledOverall ? 'disabled' : ''}>${n}</ids-button>`;
    }

    this.container.innerHTML = pageNumberHtml;

    for (let n = 1; n <= pageCount; n++) {
      const numberButton = this.container.children[n - 1];
      numberButton.button.setAttribute('aria-label', `Go to page ${n}`);
      if (n === this.pageNumber) {
        numberButton.setAttribute(attributes.SELECTED, '');
      }

      numberButton.addEventListener('click', /* istanbul ignore next */ () => {
        this.triggerEvent('pagenumberchange', this, {
          bubbles: true,
          detail: { elem: this, value: n }
        });
      });
    }
  }
}

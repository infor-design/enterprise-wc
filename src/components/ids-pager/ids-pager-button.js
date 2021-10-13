import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../../core';

// Import Mixins
import { IdsEventsMixin, IdsLocaleMixin } from '../../mixins';

// Import Utils
import { IdsStringUtils } from '../../utils';

// Import Dependencies
import { IdsButton } from '../ids-button';
import { IdsIcon } from '../ids-icon';
import IdsPagerSection from './ids-pager-section';

// Import Styles
import styles from './ids-pager-button.scss';

const { stringToBool } = IdsStringUtils;
const buttonTypes = ['first', 'last', 'next', 'previous'];

/**
 * IDS PagerButton Component
 * @type {IdsPagerButton}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 * @part button - the `ids-button` component
 * @part icon - the `ids-icon` component
 */
@customElement('ids-pager-button')
@scss(styles)
export default class IdsPagerButton extends mix(IdsElement).with(IdsEventsMixin, IdsLocaleMixin) {
  constructor() {
    super();
  }

  template() {
    const type = this.type;

    return (
      `<ids-button
        ${type}
        ${this.hasAttribute(attributes.DISABLED) ? ' disabled' : ''}
        part="button"
        square
      >
        <ids-icon icon="${type}-page" size="medium" part="icon"></ids-icon>
      </ids-button>`
    );
  }

  static get attributes() {
    return [
      attributes.DISABLED,
      attributes.FIRST,
      attributes.LAST,
      attributes.LANGUAGE,
      attributes.NAV_DISABLED,
      attributes.NEXT,
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.PARENT_DISABLED,
      attributes.PREVIOUS,
      attributes.TOTAL
    ];
  }

  connectedCallback() {
    this.button = this.shadowRoot.querySelector('ids-button');
    this.icon = this.shadowRoot.querySelector('ids-icon');
    this.onEvent('click', this.button, (e) => this.#onClick(e));

    this.#updateNavDisabled();
    this.#updateDisabledState();
    super.connectedCallback?.();
    this.#attachEventHandlers();
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  #attachEventHandlers() {
    // Respond to parent changing language
    this.offEvent('languagechange.pager-container');
    this.onEvent('languagechange.pager-container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
      await this.icon.setLanguage(e.detail.language.name);
    });
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
    this.#setTypeAttribute(attributes.FIRST, value);
  }

  /**
   * @param {boolean|string} value designates this as a nav to last page button
   */
  set last(value) {
    this.#setTypeAttribute(attributes.LAST, value);
  }

  /**
   * @param {boolean|string} value A flag which designates this as a nav to next page button
   */
  set next(value) {
    this.#setTypeAttribute(attributes.NEXT, value);
  }

  /**
   * @param {boolean|string} value A flag which designates this as a nav to previous
   * page button
   */
  set previous(value) {
    this.#setTypeAttribute(attributes.PREVIOUS, value);
  }

  /**
   * @returns {boolean|string} A flag indicating whether button is disabled
   * for nav reasons
   */
  get disabled() {
    return this.hasAttribute(attributes.DISABLED);
  }

  /**
   * @param {boolean|string} value A whether to disable input at app-specified-level
   */
  set disabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, true);
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|undefined} type The type of button -- based on which attrib was set
   */
  get type() {
    for (const a of buttonTypes) {
      if (this.hasAttribute(a)) { return a; }
    }

    return undefined;
  }

  /**
   * @param {string|number} value The number of items to track
   */
  set total(value) {
    this.setAttribute(attributes.TOTAL, value);
  }

  /**
   * @returns {string|number} The number of items for pager is tracking
   */
  get total() {
    return parseInt(this.getAttribute(attributes.TOTAL));
  }

  /**
   * @param {string|boolean} value A flag indicating whether button is disabled
   * for nav reasons
   */
  set navDisabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.NAV_DISABLED, '');
    } else {
      this.removeAttribute(attributes.NAV_DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} A flag indicating whether button is disabled
   * for nav reasons
   */
  get navDisabled() {
    return this.hasAttribute(attributes.NAV_DISABLED);
  }

  /**
   * @param {string|boolean} value A flag indicating if button is disabled
   * through parent pager's disabled attribute
   */
  set parentDisabled(value) {
    if (stringToBool(value) && !this.hasAttribute(attributes.PARENT_DISABLED)) {
      this.setAttribute(attributes.PARENT_DISABLED, '');
    } else if (!stringToBool(value) && this.hasAttribute(attributes.PARENT_DISABLED)) {
      this.removeAttribute(attributes.PARENT_DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} A flag indicating whether button is disabled
   * via parent pager's disabled attribute
   */
  get parentDisabled() {
    return this.hasAttribute(attributes.PARENT_DISABLED);
  }

  /**
   * @param {string|number} value A 1-based page number shown
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

    if (!Number.isNaN(nextValue)
    && Number.parseInt(this.getAttribute(attributes.PAGE_NUMBER)) !== nextValue
    ) {
      this.setAttribute(attributes.PAGE_NUMBER, nextValue);
    }

    this.#updateNavDisabled();
    this.#updateDisabledState();
  }

  /** @returns {string|number} value A 1-based page number displayed */
  get pageNumber() {
    return parseInt(this.getAttribute(attributes.PAGE_NUMBER));
  }

  /** @param {string|number} value The number of items shown per page */
  set pageSize(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    if (this.getAttribute(attributes.PAGE_SIZE) !== `${nextValue}`) {
      this.setAttribute(attributes.PAGE_SIZE, nextValue);
    }

    this.#updateNavDisabled();
    this.#updateDisabledState();
  }

  /** @returns {string|number} The number of items shown per page */
  get pageSize() {
    return parseInt(this.getAttribute(attributes.PAGE_SIZE));
  }

  /**
   * Handles click functionality dependent on whether this
   * button is disabled and the type of button it is set to;
   * will bubble up an appropriate event to parent ids-pager
   * in order to update the page-number value via
   * 'pagenumberchange' if applicable
   */
  #onClick() {
    if (!this.disabled) {
      const lastPageNumber = Math.floor(this.total / this.pageSize);

      /* eslint-disable default-case */
      switch (this.type) {
      case attributes.FIRST: {
        if (this.pageNumber > 1) {
          this.triggerEvent('pagenumberchange', this, {
            bubbles: true,
            detail: { elem: this, value: 1 }
          });
        }
        break;
      }
      case attributes.LAST: {
        if (this.pageNumber < lastPageNumber) {
          this.triggerEvent('pagenumberchange', this, {
            bubbles: true,
            detail: { elem: this, value: this.pageCount }
          });
        }
        break;
      }
      case attributes.PREVIOUS: {
        if (this.pageNumber > 1) {
          this.triggerEvent('pagenumberchange', this, {
            bubbles: true,
            detail: { elem: this, value: this.pageNumber - 1 }
          });
        }
        break;
      }
      case attributes.NEXT: {
        if (this.pageNumber < lastPageNumber) {
          this.triggerEvent('pagenumberchange', this, {
            bubbles: true,
            detail: { elem: this, value: this.pageNumber + 1 }
          });
        }
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
      this.button?.button?.setAttribute?.('aria-label', attribute);
    } else {
      this.removeAttribute(attribute);
    }
  }

  /**
   * Updates nav-disabled attribute based
   * on page number, size and total to
   * prevent nav actions/disable the component
   * based on these factors
   */
  #updateNavDisabled() {
    let isNavDisabled = false;

    switch (this.type) {
    case attributes.FIRST:
    case attributes.PREVIOUS: {
      isNavDisabled = this.pageNumber <= 1;
      break;
    }
    case attributes.NEXT:
    case attributes.LAST: {
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
   * Update visible button disabled state
   * dependent on current page nav and
   * user-provided disabled state
   */
  #updateDisabledState() {
    const isDisabled = (
      this.hasAttribute(attributes.DISABLED)
      || this.hasAttribute(attributes.NAV_DISABLED)
      || this.hasAttribute(attributes.PARENT_DISABLED)
    );

    if (isDisabled) {
      this.button?.setAttribute(attributes.DISABLED, '');
    } else {
      this.button?.removeAttribute(attributes.DISABLED);
    }
  }
}

import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-pager-button-base';

import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import '../ids-button/ids-button';
import '../ids-icon/ids-icon';
import { buttonTypes } from './ids-pager-attributes';

import styles from './ids-pager-button.scss';
import type IdsButton from '../ids-button/ids-button';
import type IdsIcon from '../ids-icon/ids-icon';

/**
 * IDS PagerButton Component
 * @type {IdsPagerButton}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @part button - the `ids-button` component
 * @part icon - the `ids-icon` component
 */
@customElement('ids-pager-button')
@scss(styles)
export default class IdsPagerButton extends Base {
  button?: IdsButton | null;

  icon?: IdsIcon | null;

  constructor() {
    super();
  }

  template(): string {
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

  static get attributes(): Array<string> {
    return [
      attributes.DISABLED,
      attributes.FIRST,
      attributes.LABEL,
      attributes.LANGUAGE,
      attributes.LAST,
      attributes.NAV_DISABLED,
      attributes.NEXT,
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.PARENT_DISABLED,
      attributes.PREVIOUS,
      attributes.TOTAL
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.button = this.shadowRoot.querySelector('ids-button');
    this.icon = this.shadowRoot.querySelector('ids-icon');
    this.offEvent('click', this.button);
    this.onEvent('click', this.button, () => this.#onClick());

    this.#updateNavDisabled();
    this.#updateDisabledState();
  }

  /**
   * @returns {number} # of pages -- read-only attribute;
   * inferred from pageSize and total
   */
  get pageCount(): number | null {
    return (this.total !== null && !Number.isNaN(this.total))
      ? Math.ceil(Number(this.total) / this.pageSize)
      : null;
  }

  /**
   * @param {boolean|string} value designates this as a nav to first page button
   */
  set first(value: boolean | string) {
    this.#setTypeAttribute(attributes.FIRST, value);
  }

  /**
   * @param {boolean|string} value designates this as a nav to last page button
   */
  set last(value: boolean | string) {
    this.#setTypeAttribute(attributes.LAST, value);
  }

  /**
   * @param {boolean|string} value A flag which designates this as a nav to next page button
   */
  set next(value: boolean | string) {
    this.#setTypeAttribute(attributes.NEXT, value);
  }

  /**
   * @param {boolean|string} value A flag which designates this as a nav to previous
   * page button
   */
  set previous(value: boolean | string) {
    this.#setTypeAttribute(attributes.PREVIOUS, value);
  }

  /**
   * @returns {boolean|string} A flag indicating whether button is disabled
   * for nav reasons
   */
  get disabled(): boolean | string {
    return this.hasAttribute(attributes.DISABLED);
  }

  /**
   * @param {boolean|string} value A whether to disable input at app-specified-level
   */
  set disabled(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|undefined} type The type of button -- based on which attrib was set
   */
  get type(): undefined | string {
    for (const a of buttonTypes) {
      if (this.hasAttribute(a)) { return a; }
    }

    return undefined;
  }

  /**
   * @param {string|number} value The number of items to track
   */
  set total(value: string | number) {
    this.setAttribute(attributes.TOTAL, String(value));
    this.#updateNavDisabled();
    this.#updateDisabledState();
  }

  /**
   * @returns {string|number} The number of items for pager is tracking
   */
  get total(): string | number {
    return parseInt(this.getAttribute(attributes.TOTAL) ?? '');
  }

  /**
   * @param {string|boolean} value A flag indicating whether button is disabled
   * for nav reasons
   */
  set navDisabled(value: string | boolean) {
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
  get navDisabled(): string | boolean {
    return this.hasAttribute(attributes.NAV_DISABLED);
  }

  /**
   * @param {string|boolean} value A flag indicating if button is disabled
   * through parent pager's disabled attribute
   */
  set parentDisabled(value: string | boolean) {
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
  get parentDisabled(): string | boolean {
    return this.hasAttribute(attributes.PARENT_DISABLED);
  }

  /**
   * @param {number} value A 1-based page number shown
   */
  set pageNumber(value: number) {
    let nextValue = Number.parseInt(value as any);

    if (Number.isNaN(nextValue)) {
      nextValue = 1;
    } else if (nextValue <= 1) {
      nextValue = 1;
    } else {
      const pageCount = Math.ceil(this.total as any / this.pageSize);
      nextValue = Math.min(nextValue, pageCount);
    }

    if (!Number.isNaN(nextValue)
    && Number.parseInt(this.getAttribute(attributes.PAGE_NUMBER) ?? '') !== nextValue
    ) {
      this.setAttribute(attributes.PAGE_NUMBER, String(nextValue));
    }

    this.#updateNavDisabled();
    this.#updateDisabledState();
  }

  /** @returns {number} value A 1-based page number displayed */
  get pageNumber(): number {
    return parseInt(this.getAttribute(attributes.PAGE_NUMBER) ?? '');
  }

  /** @param {number} value The number of items shown per page */
  set pageSize(value: number) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value as any))) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value as any);
    }

    if (this.getAttribute(attributes.PAGE_SIZE) !== `${nextValue}`) {
      this.setAttribute(attributes.PAGE_SIZE, String(nextValue));
    }

    this.#updateNavDisabled();
    this.#updateDisabledState();
  }

  /** @returns {number} The number of items shown per page */
  get pageSize(): number {
    return parseInt(this.getAttribute(attributes.PAGE_SIZE) ?? '');
  }

  /**
   * Set the aria label text
   * @param {string} value The label text
   */
  set label(value: string | null) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }
  }

  get label() {
    return this.getAttribute(attributes.LABEL);
  }

  #triggerPageNumberChange(value: number, source: string) {
    this.triggerEvent(`pagenumberchange`, this, {
      bubbles: true,
      composed: true,
      detail: { elem: this, value }
    });

    this.triggerEvent(`page${source}`, this, {
      bubbles: true,
      composed: true,
      detail: { elem: this, value }
    });
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
      const lastPageNumber = Math.ceil(Number(this.total) / this.pageSize);

      switch (this.type) {
        case attributes.FIRST: {
          if (this.pageNumber > 1) {
            this.#triggerPageNumberChange(1, attributes.FIRST);
          }
          break;
        }
        case attributes.LAST: {
          if (this.pageNumber < lastPageNumber) {
            this.#triggerPageNumberChange(Number(this.pageCount), attributes.LAST);
          }
          break;
        }
        case attributes.PREVIOUS: {
          if (this.pageNumber > 1) {
            this.#triggerPageNumberChange(Number(this.pageNumber) - 1, attributes.PREVIOUS);
          }
          break;
        }
        case attributes.NEXT: {
          if (this.pageNumber < lastPageNumber) {
            this.#triggerPageNumberChange(Number(this.pageNumber) + 1, attributes.NEXT);
          }
          break;
        }
        default: break;
      }
    }
  }

  #setTypeAttribute(attribute: string, value: string | boolean) {
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
      this.button?.button?.setAttribute?.('aria-label', this.label || attribute);
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
  #updateNavDisabled(): void {
    let isNavDisabled = false;

    switch (this.type) {
      case attributes.FIRST:
      case attributes.PREVIOUS: {
        isNavDisabled = this.pageNumber <= 1;
        break;
      }
      case attributes.NEXT:
      case attributes.LAST: {
        isNavDisabled = this.pageNumber >= (this.pageCount || 0);
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
  #updateDisabledState(): void {
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

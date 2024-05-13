import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';

import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';
import '../ids-button/ids-button';
import '../ids-icon/ids-icon';
import { buttonTypes } from './ids-pager-attributes';

import styles from './ids-pager-button.scss';
import type IdsButton from '../ids-button/ids-button';
import type IdsIcon from '../ids-icon/ids-icon';
import type IdsPager from './ids-pager';

const Base = IdsLocaleMixin(
  IdsTooltipMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

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
  readonly DEFAULT_PAGE_SIZE = 10;

  rootNode: any;

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

  /**
   * React to attributes changing on the web-component
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    const shouldRerender = [
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.STEP,
      attributes.TOTAL,
      attributes.TYPE,
    ].includes(name);

    if (shouldRerender) {
      if (oldValue !== newValue) {
        this.connectedCallback();
      }
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.button = this.shadowRoot?.querySelector('ids-button');
    this.icon = this.shadowRoot?.querySelector('ids-icon');
    this.offEvent('click', this.button);
    this.onEvent('click', this.button, () => this.#onClick());

    if (this.pager) {
      this.disabled = this.pager.disabled;
      this.pageNumber = this.pager.pageNumber;
      this.pageSize = this.pager.pageSize;
      this.total = this.pager.total;
    }

    this.#updateNavDisabled();
    this.#updateDisabledState();
  }

  /**
   * Reference to the pager parent
   * @returns {IdsPager} the parent element
   */
  get pager(): IdsPager {
    if (!this.rootNode) this.rootNode = (this.getRootNode?.() as any)?.host;
    if (this.rootNode?.nodeName !== 'IDS-PAGER') this.rootNode = this.closest('ids-pager');
    return this.rootNode as IdsPager;
  }

  /**
   * @returns {number} # of pages -- read-only attribute;
   * inferred from pageSize and total
   */
  get pageCount(): number | null {
    const val = this.hasAttribute(attributes.TOTAL)
      ? Math.ceil(this.total / this.pageSize)
      : null;
    return this.pager?.pageCount ?? val;
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
   * @param {number} value The number of items to track
   */
  set total(value: number) {
    let val = stringToNumber(value);
    if (Number.isNaN(val) || val < 1) val = 1;
    this.setAttribute(attributes.TOTAL, String(val));

    this.#updateNavDisabled();
    this.#updateDisabledState();
  }

  /**
   * @returns {number} The number of items for pager is tracking
   */
  get total(): number {
    const val = stringToNumber(this.getAttribute(attributes.TOTAL));
    return this.pager?.total ?? val;
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
    let val = stringToNumber(value);
    if (Number.isNaN(val) || val < 1) val = 1;
    else if (this.pageCount) val = Math.min(val, this.pageCount);
    this.setAttribute(attributes.PAGE_NUMBER, String(val));

    this.#updateNavDisabled();
    this.#updateDisabledState();
  }

  /** @returns {number} value A 1-based page number displayed */
  get pageNumber(): number {
    const val = stringToNumber(this.getAttribute(attributes.PAGE_NUMBER) ?? 1);
    return this.pager?.pageNumber ?? val;
  }

  /** @param {number} value The number of items shown per page */
  set pageSize(value: number) {
    const val = this.isValidPageSize(value);
    this.setAttribute(attributes.PAGE_SIZE, String(val));

    this.#updateNavDisabled();
    this.#updateDisabledState();
  }

  /** @returns {number} The number of items shown per page */
  get pageSize(): number {
    return this.pager?.pageSize
      ?? this.isValidPageSize(this.getAttribute(attributes.PAGE_SIZE));
  }

  /**
   * Check given page size value, if not a number return default
   * @private
   * @param {number | string | null} value The value
   * @returns {number} Given value or default
   */
  isValidPageSize(value?: number | string | null): number {
    const val = stringToNumber(value);
    return !Number.isNaN(val) && val > 0 ? val : this.DEFAULT_PAGE_SIZE;
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
      this.shadowRoot?.querySelector('ids-icon')?.setAttribute('icon', `${attribute}-page`);
      this.shadowRoot?.querySelector('ids-button')?.setAttribute('aria-label', this.label || attribute);
      this.shadowRoot?.querySelector('ids-button')?.setAttribute(attribute, '');
      this.shadowRoot?.querySelector('ids-button')?.removeAttribute('undefined');
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
        isNavDisabled = this.pageNumber <= 1 && this.total > 0;
        break;
      }
      case attributes.NEXT:
      case attributes.LAST: {
        isNavDisabled = this.pageNumber >= (this.pageCount || 0) && this.total > 0;
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

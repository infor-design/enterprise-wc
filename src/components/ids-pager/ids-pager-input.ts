import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';

import '../ids-input/ids-input';
import '../ids-text/ids-text';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import styles from './ids-pager-input.scss';
import type IdsInput from '../ids-input/ids-input';
import type IdsPager from './ids-pager';

const Base = IdsKeyboardMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS PagerInput Component
 * @type {IdsPagerInput}
 * @mixes IdsKeyboardMixin
 * @inherits IdsElement
 * @part container ids-pager-button container
 */
@customElement('ids-pager-input')
@scss(styles)
export default class IdsPagerInput extends Base {
  readonly DEFAULT_PAGE_SIZE = 10;

  rootNode: any;

  input?: IdsInput | null;

  constructor() {
    super();
  }

  template(): string {
    const pageCountShown = this.pageCount !== null ? this.pageCount : 'N/A';
    const idsTextAttribs = `label ${this.disabledOverall ? ' disabled' : ''}`;

    return (
      `<ids-text ${idsTextAttribs}>Page</ids-text>&nbsp;
      <ids-input
        value="${this.pageNumber}"
        label="Input for page number"
        label-state="hidden"
        text-align="center"
        mask="number"
        size="xs"
        ${this.disabled ? 'disabled' : ''}
      ></ids-input>
      <ids-text ${idsTextAttribs}>&nbsp;of&nbsp;
        <span class="page-count">${pageCountShown}</span>
      </ids-text>`
    );
  }

  static get attributes(): Array<string> {
    return [
      attributes.DISABLED,
      attributes.PAGE_NUMBER,
      attributes.PARENT_DISABLED,
      attributes.TOTAL,
      attributes.PAGE_SIZE
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
      attributes.DISABLED,
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

  /**
   * Track and use to prvent multiple input change events
   */
  #inputChanged = false;

  connectedCallback(): void {
    super.connectedCallback();

    if (this.pager) {
      this.disabled = this.pager.disabled;
      this.pageNumber = this.pager.pageNumber;
      this.pageSize = this.pager.pageSize;
      this.total = this.pager.total;
    }

    this.input = this.shadowRoot?.querySelector<IdsInput>('ids-input');

    this.offEvent('change.pagerinput', this.input);
    this.onEvent('change.pagerinput', this.input, () => this.#handleInputChange());

    // when leaving user focus, input should adjust itself
    // to the page number already provided by the pager

    this.offEvent('blur.pagerinput', this.input);
    this.onEvent('blur.pagerinput', this.input, () => {
      if (!this.#inputChanged) this.#handleInputChange();
      this.#inputChanged = false;
    });

    this.offEvent('Enter.pagerinput', this.input);
    this.listen('Enter.pagerinput', this.input, () => {
      this.input?.dispatchEvent(new Event('change', { bubbles: true }));
    });

    if (!this.hasAttribute(attributes.PAGE_NUMBER) && this.pager?.pageNumber) {
      this.setAttribute(attributes.PAGE_NUMBER, String(this.pager.pageNumber));
    }

    // give parent a chance to reflect attributes
    this.#updatePageCountShown();
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

  /** @param {string|number} value The number of items to show per page */
  set pageSize(value: string | number) {
    const val = this.isValidPageSize(value);
    this.setAttribute(attributes.PAGE_SIZE, String(val));
    this.#updatePageCountShown();
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

  /** @param {string|number} value A 1-based page number shown */
  set pageNumber(value: string | number) {
    const inputHost = this.input;
    const input = inputHost?.input;
    const currentVal = stringToNumber(input?.value);

    let val = stringToNumber(value);
    if (Number.isNaN(val) || val < 1) val = 1;
    else {
      const pageCount = stringToNumber(this.pageCount);
      if (Number.isNaN(pageCount)) return;
      val = Math.min(val, pageCount);
    }

    // TODO: find a way within CSS to make input-field width auto-resize
    input?.style.setProperty('width', `${String(val).length}em`);

    // no need to update if page number did not changed.
    if (Number.isNaN(currentVal) || val === currentVal) return;

    if (inputHost) {
      inputHost.value = String(val);
      if (!this.#inputChanged && val !== this.pageNumber) {
        this.triggerEvent('pagenumberchange', this, {
          bubbles: true,
          detail: { elem: this, value: val }
        });
      }
      this.#inputChanged = false;
    }

    this.setAttribute(attributes.PAGE_NUMBER, String(val));
    this.#updatePageCountShown();
  }

  /** @returns {number} value A 1-based page number displayed */
  get pageNumber(): number {
    const val = stringToNumber(this.getAttribute(attributes.PAGE_NUMBER) ?? 1);
    return this.pager?.pageNumber ?? val;
  }

  /** @param {string|number} value The number of items to track */
  set total(value: string | number) {
    let val = stringToNumber(value);
    if (Number.isNaN(val) || val < 1) val = 1;
    this.setAttribute(attributes.TOTAL, String(val));
    this.#updatePageCountShown();
  }

  /** @returns {number} The number of items for pager is tracking */
  get total(): number {
    const val = stringToNumber(this.getAttribute(attributes.TOTAL));
    return this.pager?.total ?? val;
  }

  /** @returns {number|null} The calculated pageCount using total and pageSize */
  get pageCount(): number | null {
    const val = this.hasAttribute(attributes.TOTAL)
      ? Math.ceil(this.total / this.pageSize)
      : null;
    return this.pager?.pageCount ?? val;
  }

  /** @param {boolean|string} value Whether or not to disable input at app-specified-level */
  set disabled(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} A flag indicating whether the input is disabled
   * for nav reasons
   */
  get disabled(): boolean | string {
    return this.hasAttribute(attributes.DISABLED);
  }

  /**
   * @param {string|boolean} value A flag indicating if the input is disabled
   * through parent pager's disabled attribute
   */
  set parentDisabled(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.PARENT_DISABLED, '');
    } else {
      this.removeAttribute(attributes.PARENT_DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} A flag indicating whether button is disabled
   * via parent pager's disabled attribute
   */
  get parentDisabled(): boolean | string {
    return this.hasAttribute(attributes.PARENT_DISABLED);
  }

  /**
   * @returns {string|boolean} Whether the functionality overall is disabled based on
   * a combination of other available disabled fields
   */
  get disabledOverall(): boolean | string {
    return (this.hasAttribute(attributes.DISABLED)
      || this.hasAttribute(attributes.PARENT_DISABLED)
    );
  }

  /**
   * Handle innput change
   * @private
   * @returns {void}
   */
  #handleInputChange(): void {
    const pageCount = stringToNumber(this.pageCount);
    if (this.input && !Number.isNaN(pageCount) && pageCount > 1) {
      const pageNumber = this.pageNumber;
      const inputVal = stringToNumber(this.input.value);
      const val = Math.max(1, Math.min(inputVal, pageCount));

      if (val && val !== inputVal) this.input.value = `${val}`;

      if (val !== pageNumber) {
        if (!Number.isNaN(val)) {
          this.#inputChanged = true;
          this.triggerEvent('pagenumberchange', this, {
            bubbles: true,
            detail: { elem: this, value: val }
          });
        } else if (this.input) {
          this.input.value = `${pageNumber}`;
        }
      }
    }
  }

  /** Updates text found in page-count within ids-text span */
  #updatePageCountShown(): void {
    const pageCount = this.pageCount;
    const pageCountShown = (pageCount === null || Number.isNaN(pageCount)) ? 'N/A' : pageCount;
    const pageCountElem = this.shadowRoot?.querySelector('span.page-count');
    if (pageCountElem) {
      pageCountElem.textContent = String(pageCountShown);
    }
  }

  /**
   * Update visible button disabled state
   * based on parentDisabled and disabled attribs
   */
  #updateDisabledState(): void {
    const idsTextEls = this.shadowRoot?.querySelectorAll('ids-text') ?? [];

    if (this.disabledOverall) {
      this.input?.setAttribute(attributes.DISABLED, '');

      for (const el of idsTextEls) {
        el.setAttribute(attributes.DISABLED, '');
      }
    } else {
      this.input?.removeAttribute(attributes.DISABLED);

      for (const el of idsTextEls) {
        el.removeAttribute(attributes.DISABLED);
      }
    }
  }
}

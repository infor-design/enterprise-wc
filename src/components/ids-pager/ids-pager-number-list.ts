import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-pager-number-list-base';
import '../ids-text/ids-text';
import '../ids-button/ids-button';

import styles from './ids-pager-number-list.scss';

/**
 * IDS PagerNumberList Component
 *
 * @type {IdsPagerNumberList}
 * @inherits IdsElement
 * @part number selectable number among the list
 */
@customElement('ids-pager-number-list')
@scss(styles)
export default class IdsPagerNumberList extends Base {
  readonly DEFAULT_STEP = 3;

  constructor() {
    super();
  }

  template(): string {
    return (
      `<div class="ids-pager-number-list">
      </div>`
    );
  }

  static get attributes(): Array<string> {
    return [
      attributes.DISABLED,
      attributes.LABEL,
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.PARENT_DISABLED,
      attributes.STEP,
      attributes.TOTAL,
      attributes.VALUE
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

    if (oldValue === newValue) return;

    const shouldRerender = [
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.STEP,
      attributes.TOTAL,
    ].includes(name);

    if (shouldRerender) {
      this.connectedCallback();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#populatePageNumberButtons();
    this.#attachEventHandlers();
  }

  /**
   * @param {number} value The number of items shown per page
   */
  set pageSize(value: number) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value as any))) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value as any);
    }

    if (parseInt(this.getAttribute(attributes.PAGE_SIZE)) !== nextValue) {
      this.setAttribute(attributes.PAGE_SIZE, nextValue);
    }

    this.#populatePageNumberButtons();
  }

  /** @returns {number} The number of items shown per page */
  get pageSize(): number {
    return parseInt(this.getAttribute(attributes.PAGE_SIZE));
  }

  /** @param {number} value A value 1-based page number shown */
  set pageNumber(value: number) {
    let nextValue = Number.parseInt(value as any);

    if (Number.isNaN(nextValue)) {
      nextValue = 1;
    } else if (nextValue <= 1) {
      nextValue = 1;
    } else {
      const pageCount = Math.ceil(this.total / this.pageSize);
      nextValue = Math.min(nextValue, pageCount);
    }

    if (!Number.isNaN(nextValue)
    && Number.parseInt(this.getAttribute(attributes.PAGE_NUMBER)) !== nextValue
    ) {
      this.setAttribute(attributes.PAGE_NUMBER, nextValue);
    }

    this.#populatePageNumberButtons();
  }

  /** @returns {number} A value 1-based page number displayed */
  get pageNumber(): number {
    return parseInt(this.getAttribute(attributes.PAGE_NUMBER)) || 1;
  }

  /** @param {number} value The number of items to track */
  set total(value: number) {
    let nextValue;
    if (Number.isNaN(Number.parseInt(value as any))) {
      nextValue = 1;
    } else if (Number.parseInt(value as any) <= 0) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value as any);
    }

    if (Number.parseInt(this.getAttribute(attributes.TOTAL)) !== nextValue) {
      this.setAttribute(attributes.TOTAL, nextValue);
    }
  }

  /** @returns {string|number} The number of items for pager is tracking */
  get total(): number {
    return parseInt(this.getAttribute(attributes.TOTAL));
  }

  /** @returns {number|null} The calculated pageCount using total and pageSize */
  get pageCount(): number | null {
    return this.hasAttribute(attributes.TOTAL)
      ? Math.ceil(this.total / this.pageSize)
      : null;
  }

  /** @param {boolean|string} value Whether to disable input at app-specified-level */
  set disabled(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.#updateDisabledState();
  }

  /** @returns {boolean | string} A flag indicating whether button is disabled for nav reasons */
  get disabled(): boolean | string {
    return this.hasAttribute(attributes.DISABLED);
  }

  /**
   * @param {boolean | string} value A flag indicating if button is disabled through parent pager's
   * disabled attribute
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
   * @returns {string|boolean} A flag indicating whether button is
   * disabled via parent pager's disabled attribute
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
   * Set the aria label text
   * @param {string} value The label text
   */
  set label(value: string) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }
  }

  get label() {
    return this.getAttribute(attributes.LABEL) || 'Go to page {num} of {total}';
  }

  /**
   * Set the number of step for page number list
   * @param {number|string} value The number of steps
   */
  set step(value: number | string) {
    const val = stringToNumber(this.getAttribute(attributes.STEP));
    if (!Number.isNaN(val)) {
      this.setAttribute(attributes.STEP, val);
      return;
    }
    this.removeAttribute(attributes.STEP);
  }

  /** @returns {number} The number of steps */
  get step(): number {
    const val = stringToNumber(this.getAttribute(attributes.STEP));
    return !Number.isNaN(val) ? val : this.DEFAULT_STEP;
  }

  /**
   * update visible button disabled state
   * based on parentDisabled and disabled attribs
   */
  #updateDisabledState(): void {
    for (const el of this.container.children) {
      if (this.disabledOverall) {
        el.setAttribute(attributes.DISABLED, '');
      } else {
        el.removeAttribute(attributes.DISABLED);
      }
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #attachEventHandlers(): this {
    // Fire page number change event.
    this.offEvent('click.pager-numberlist', this.container);
    this.onEvent('click.pager-numberlist', this.container, (e: any) => {
      const value = e.target?.getAttribute?.('data-id');
      if (value) {
        this.triggerEvent('pagenumberchange', this, {
          bubbles: true,
          composed: true,
          detail: { elem: this, value }
        });
      }
    });

    return this;
  }

  #attachAria(): void {
    const pageCount = this.pageCount;
    const label = (id: any) => this.label.replace('{num}', `${id}`).replace('{total}', `${pageCount}`);
    this.container.querySelectorAll('ids-button[data-id]').forEach((btn: any) => {
      const id = btn?.getAttribute('data-id');
      if (id) btn?.button?.setAttribute('aria-label', label(id));
    });
  }

  #populatePageNumberButtons(): void {
    const pageCount = this.pageCount;
    if (!pageCount) return;

    const pageNumber = Number(this.pageNumber);
    const disabled = this.disabledOverall ? ' disabled' : '';

    const buttons = [...new Array(pageCount)].map((value, key) => {
      const buttonNumber = key + 1;
      const selected = (buttonNumber === pageNumber) ? ' selected' : '';

      return `
        <ids-button data-id="${buttonNumber}"${selected}${disabled}>${buttonNumber}</ids-button>
      `;
    });

    const firstButton = buttons[0];
    const lastButton = buttons[buttons.length - 1];
    const divider = '<p class="divider">&#8230;</p>'; // horizontal ellipsis

    const leftBufferSize = Number(this.step);
    const rightBufferSize = leftBufferSize;
    const totalBufferSize = leftBufferSize + rightBufferSize;
    const showStart = (pageNumber - totalBufferSize) < 1;
    const showEnd = (pageNumber + totalBufferSize) > pageCount;

    let visibleButtons = [];
    if (this.step < 1) {
      visibleButtons = [...buttons];
    } else if (showStart) {
      const startButtons = buttons.slice(0, totalBufferSize + rightBufferSize);
      visibleButtons = startButtons.concat([divider, lastButton]);
    } else if (showEnd) {
      const endButtons = buttons.slice(-1 * (totalBufferSize + leftBufferSize));
      visibleButtons = [firstButton, divider].concat(endButtons);
    } else {
      const middleButtons = buttons.slice(pageNumber - leftBufferSize - 1, pageNumber + rightBufferSize);
      visibleButtons = [firstButton, divider].concat([...middleButtons, divider, lastButton]);
    }

    if (this.container) {
      this.container.innerHTML = visibleButtons.join('');
      this.#attachAria();
    }
  }
}

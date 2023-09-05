import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLabelStateMixin from '../../mixins/ids-label-state-mixin/ids-label-state-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsClearableMixin from '../../mixins/ids-clearable-mixin/ids-clearable-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsValidationMixin from '../../mixins/ids-validation-mixin/ids-validation-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-icon/ids-icon';
import '../ids-text/ids-text';
import '../ids-trigger-field/ids-trigger-field';

import styles from './ids-textarea.scss';

const Base = IdsDirtyTrackerMixin(
  IdsLocaleMixin(
    IdsLabelStateMixin(
      IdsValidationMixin(
        IdsClearableMixin(
          IdsEventsMixin(
            IdsElement
          )
        )
      )
    )
  )
);

// Textarea id
const ID = 'ids-textarea-id';

// Setting defaults sizes
const SIZES: Record<string, string> = {
  default: 'md',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  full: 'full'
};

// Setting defaults text-align
const TEXT_ALIGN: Record<string, string> = {
  default: 'left',
  left: 'left',
  center: 'center',
  right: 'right'
};

// Character counter default strings
const CHAR_MAX_TEXT = 'Character count maximum of';
const CHAR_REMAINING_TEXT = 'Characters left {0}';

/**
 * IDS Textarea Component
 * @type {IdsTextarea}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsClearableMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsLabelStateMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsValidationMixin
 * @part textarea - the textarea element
 * @part label - the label element
 */
@customElement('ids-textarea')
@scss(styles)
export default class IdsTextarea extends Base {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  autogrowProcessing = false;

  isSafari = false;

  isFormComponent = true;

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array<string>} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.AUTOGROW,
      attributes.AUTOGROW_MAX_HEIGHT,
      attributes.AUTOSELECT,
      attributes.CHAR_MAX_TEXT,
      attributes.CHAR_REMAINING_TEXT,
      attributes.CHARACTER_COUNTER,
      attributes.DISABLED,
      attributes.MAXLENGTH,
      attributes.PLACEHOLDER,
      attributes.PRINTABLE,
      attributes.SIZE,
      attributes.READONLY,
      attributes.RESIZABLE,
      attributes.ROWS,
      attributes.TEXT_ALIGN,
      attributes.VALUE
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback(): void {
    super.connectedCallback();
    this.#attachEventHandlers();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    // Textarea
    const value = this.value || '';
    const rows = this.rows ? ` rows="${this.rows}"` : '';
    const ariaLabel = this.hasAttribute(attributes.LABEL_STATE) && this.label ? `aria-label="${this.label}"` : '';
    const hiddenLabelCss = !this.label.length || this.labelState === 'hidden' ? ' empty' : '';
    const requiredLabelCss = !this.labelRequired ? ' no-required-indicator' : '';
    const maxlength = this.maxlength ? ` maxlength="${this.maxlength}"` : '';
    const placeholder = this.placeholder ? ` placeholder="${this.placeholder}"` : '';
    const isPrintable = stringToBool(this.printable) || this.printable === null;
    const printable = isPrintable ? `<span class="textarea-print">${value}</span>` : '';
    const isCounter = (this.characterCounter && this.maxlength);
    const counter = isCounter ? '<span class="textarea-character-counter"></span>' : '';
    let textareaState = stringToBool(this.readonly) ? ' readonly' : '';
    textareaState = stringToBool(this.disabled) ? ' disabled' : textareaState;
    let textareaClass = `ids-textarea-field ${this.textAlign}`;
    textareaClass += stringToBool(this.resizable) ? ' resizable' : '';
    textareaClass = ` class="${textareaClass}"`;

    return `
      <div class="ids-textarea${textareaState}">
        ${printable}
        <slot class="hidden"></slot>
        <label for="${ID}" class="ids-label-text${requiredLabelCss}${hiddenLabelCss}">
          <ids-text part="label" label ${textareaState} color-unset>${this.label}</ids-text>
        </label>
        <div class="field-container ${this.size}">
          <textarea part="textarea" id="${ID}"${textareaClass}${placeholder}${textareaState}${maxlength}${rows}${ariaLabel} value="${value}"></textarea>
        </div>
        ${counter}
      </div>
    `;
  }

  /**
   * @returns {HTMLTextAreaElement} reference to this component's inner text input element
   */
  get input(): HTMLTextAreaElement | null {
    return this.container?.querySelector('textarea') || null;
  }

  /**
   * @readonly
   * @returns {HTMLElement} the element in this component's Shadow Root
   *  that wraps the input and any triggering elements or icons
   */
  get fieldContainer(): HTMLElement | null {
    return this.container?.querySelector('.field-container') || null;
  }

  /**
   * Set state for disabled or readonly
   * @private
   * @param {string} prop The property.
   * @returns {void}
   */
  setTextareaState(prop: string): void {
    if (prop === attributes.READONLY || prop === attributes.DISABLED) {
      if (!this.shadowRoot) {
        return;
      }

      const msgNodes = [].slice.call(this.shadowRoot?.querySelectorAll('.validation-message'));
      const options = {
        prop1: prop,
        prop2: prop !== attributes.READONLY ? attributes.READONLY : attributes.DISABLED,
        val: stringToBool((this as any)[prop])
      };
      if (options.val) {
        this.input?.removeAttribute(options.prop2);
        this.container?.classList.remove(options.prop2);
        this.container?.querySelector('ids-text')?.removeAttribute(options.prop2);
        msgNodes.forEach((x: HTMLElement) => x.classList.remove(options.prop2));

        this.input?.setAttribute(options.prop1, 'true');
        this.container?.classList.add(options.prop1);
        this.container?.querySelector('ids-text')?.setAttribute(options.prop1, 'true');
        msgNodes.forEach((x: HTMLElement) => x.classList.add(options.prop1));
      } else {
        this.input?.removeAttribute(options.prop1);
        this.container?.classList.remove(options.prop1);
        this.container?.querySelector('ids-text')?.removeAttribute(options.prop1);
        msgNodes.forEach((x: HTMLElement) => x.classList.remove(options.prop1));
      }
    }
  }

  /**
   * Handle autoselect
   * @private
   * @returns {void}
   */
  handleAutoselect(): void {
    if (this.autoselect) {
      this.handleTextareaFocusEvent();
    } else {
      this.handleTextareaFocusEvent('remove');
    }
  }

  /**
   * Handle autogrow
   * @private
   * @returns {void}
   */
  handleAutogrow(): void {
    if (this.input) {
      if (this.autogrow) {
        if (this.autogrowMaxHeight) {
          this.input.style.maxHeight = `${this.autogrowMaxHeight}px`;
        }
        this.input.style.overflow = 'hidden';
        this.setAutogrow();
      } else {
        this.input.style.overflow = '';
        this.input.style.maxHeight = '';
        this.input.style.height = '';
      }
    }
  }

  /**
   * Set Browser
   * will remove this soon get environment utils setup
   * @private
   * @returns {void}
   */
  setBrowser(): void {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const browser = (s: string) => ua.toLowerCase().indexOf(s) > -1;
    this.isSafari = browser('safari') && !browser('chrome') && !browser('android');
  }

  /**
   * Get the max text value, trim extra
   * @private
   * @param {string} value of textarea
   * @returns {string} max value
   */
  getMaxValue(value: string): string {
    const max = parseInt((this.maxlength as any), 10);
    return value && max > 0 ? value.substr(0, max) : value;
  }

  /**
   * Set the label text
   * @private
   * @param {string} value of label
   * @returns {void}
   */
  setLabelText(value: string): void {
    return super.setLabelText(value, `[for="${ID}"]`);
  }

  /**
   * Set autogrow
   * @private
   * @returns {void}
   */
  setAutogrow(): void {
    if (this.autogrow && !this.autogrowProcessing) {
      this.autogrowProcessing = true;
      const maxHeight = parseInt((this.autogrowMaxHeight as any), 10) || 0;
      const oldHeight = this.input?.offsetHeight || 0;

      this.adjustHeight(oldHeight, maxHeight);
      this.autogrowProcessing = false;
    }
  }

  /**
   * Adjust height to given element
   * @private
   * @param {number} oldHeight old height
   * @param {number} maxHeight max height
   * @param {HTMLElement|null} input The textarea input element
   * @returns {void}
   */
  adjustHeight(oldHeight: number, maxHeight: number, input: HTMLElement | null = null): void {
    const elem = input || this.input;
    const newHeight = elem?.scrollHeight;

    if (elem && typeof newHeight === 'number' && (oldHeight !== newHeight)) {
      let height = newHeight;
      if (oldHeight > newHeight) {
        elem.style.height = '5px';
        height = elem.scrollHeight;
      }
      const isScrollable = (maxHeight > 0 && maxHeight < height);
      elem.style.overflow = isScrollable ? '' : 'hidden';
      elem.style.height = `${height}px`;
    }
  }

  /**
   * Handle character-counter
   * @private
   * @returns {void}
   */
  handleCharacterCounter(): void {
    let elem = this.shadowRoot?.querySelector('.textarea-character-counter');
    if (this.characterCounter && this.maxlength) {
      if (!elem) {
        elem = document.createElement('span');
        elem.className = 'textarea-character-counter';
        this.container?.appendChild(elem);
      }
      this.updateCounter();
    } else {
      elem?.remove();
    }
  }

  /**
   * Handle printable
   * @private
   * @param {boolean|string|null} value of printable
   * @returns {void}
   */
  handlePrintable(value: boolean | string | null): void {
    let elem = this.shadowRoot?.querySelector('.textarea-print');
    if (stringToBool(this.printable) || value === null) {
      if (!elem) {
        elem = document.createElement('span');
        elem.className = 'textarea-print';
        elem.textContent = this.value;
        this.container?.prepend(elem);
      }
    } else {
      elem?.remove();
    }
  }

  /**
   * Handle slotchange event
   * @private
   * @returns {void}
   */
  handleSlotchangeEvent(): void {
    const slot = this.shadowRoot?.querySelector('slot');
    this.onEvent('slotchange', slot, () => {
      const val = slot?.assignedNodes()[0].textContent;
      this.value = this.getMaxValue(val || '');
    });
  }

  /**
   * Handle focus event
   * @private
   * @param {string | undefined | null} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleTextareaFocusEvent(option: string | undefined | null = ''): void {
    if (this.input) {
      const eventName = 'focus';
      if (option === 'remove') {
        const handler = this.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.offEvent(eventName, this.input);
        }
      } else {
        this.onEvent(eventName, this.input, () => {
          setTimeout(() => { // safari has delay
            this.input?.select();
          }, 1);
        });
      }
    }
  }

  /**
   * Handle change event
   * @private
   * @returns {void}
   */
  handleTextareaChangeEvent(): void {
    const events = ['change', 'input', 'propertychange'];
    events.forEach((evt) => {
      this.onEvent(evt, this.input, (e: Event) => {
        this.value = this.input?.value || '';

        this.triggerEvent('input.ids-textarea', this, {
          bubbles: true,
          detail: {
            elem: this,
            value: this.value,
            nativeEvent: e,
          }
        });
      });
    });
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  handleNativeEvents(): object {
    if (this.input) {
      const events = ['change', 'input', 'propertychange', 'focus', 'select'];
      events.forEach((evt) => {
        this.onEvent(evt, this.input, (e: Event) => {
          /**
           * Trigger event on parent and compose the args
           * will fire nativeEvents.
           * @private
           * @param {object} elem Actual event
           * @param {string} value The updated element value
           */
          this.triggerEvent(`${e.type}.ids-textarea`, this, {
            detail: { elem: this, nativeEvent: e, value: this.value }
          });
        });
      });
    }
    return this;
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    this.setBrowser();
    this.handleAutoselect();
    this.handleAutogrow();
    this.handleSlotchangeEvent();
    this.handleNativeEvents();
    this.handleTextareaChangeEvent();
  }

  /**
   * Updates the printarea with current value.
   * @private
   * @returns {void}
   */
  updatePrintarea(): void {
    const printareaEl = this.shadowRoot?.querySelector('.textarea-print');
    if (printareaEl) {
      printareaEl.textContent = this.value;
    }
  }

  /**
   * Counts the number of line breaks in a string
   * @private
   * @param {string} s The string to test.
   * @returns {number} The number of found line countLinebreaks
   */
  countLinebreaks(s: string): number {
    return (s.match(/\n/g) || []).length;
  }

  /**
   * Updates the descriptive markup (counter, etc) to notify the user how many
   * characters can be typed.
   * @private
   * @returns {void}
   */
  updateCounter(): void {
    const elem = this.shadowRoot?.querySelector('.textarea-character-counter');
    if (elem && this.maxlength) {
      const val = this.value || '';
      const linebreaks = this.isSafari ? this.countLinebreaks(val) : 0;
      const length = val.length + linebreaks;
      const max = parseInt(this.maxlength, 10);
      const remaining = (max - length);
      const cssClass = 'almost-empty';
      let text = this.charRemainingText.replace('{0}', remaining.toString());

      if (length >= max) {
        text = (this.charMaxText === CHAR_MAX_TEXT) ? `${this.charMaxText} ${max}` : this.charMaxText.replace('{0}', max.toString());
        elem.textContent = text;
        elem.classList.remove(cssClass);
      } else {
        elem.textContent = text;
        if (remaining < 10) {
          elem.classList.add(cssClass);
        } else {
          elem.classList.remove(cssClass);
        }
      }
    }
  }

  /**
   * Set textarea height to be autogrow
   * @param {boolean|string} value If true will set `autogrow` attribute
   */
  set autogrow(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.AUTOGROW, val.toString());
    } else {
      this.removeAttribute(attributes.AUTOGROW);
    }
    this.handleAutogrow();
  }

  get autogrow(): boolean { return stringToBool(this.getAttribute(attributes.AUTOGROW)); }

  /**
   * Set textarea height to be autogrow-max-height
   * @param {string | null} value of `autogrow-max-height` attribute
   */
  set autogrowMaxHeight(value: string | null) {
    if (value) {
      this.setAttribute(attributes.AUTOGROW_MAX_HEIGHT, value.toString());
    } else {
      this.removeAttribute(attributes.AUTOGROW_MAX_HEIGHT);
    }
    this.handleAutogrow();
  }

  get autogrowMaxHeight(): string | null { return this.getAttribute(attributes.AUTOGROW_MAX_HEIGHT); }

  /**
   * When set the textarea will select all text on focus
   * @param {boolean|string} value If true will set `autoselect` attribute
   */
  set autoselect(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.AUTOSELECT, val.toString());
    } else {
      this.removeAttribute(attributes.AUTOSELECT);
    }
    this.handleAutoselect();
  }

  get autoselect(): boolean { return stringToBool(this.getAttribute(attributes.AUTOSELECT)); }

  /**
   * Set `char-max-text` text for character counter
   * @param {string} value of the `char-max-text` property
   */
  set charMaxText(value: string) {
    if (value) {
      this.setAttribute(attributes.CHAR_MAX_TEXT, value.toString());
      return;
    }
    this.removeAttribute(attributes.CHAR_MAX_TEXT);
  }

  get charMaxText(): string { return this.getAttribute(attributes.CHAR_MAX_TEXT) || CHAR_MAX_TEXT; }

  /**
   * Set `char-remaining-text` text for character counter
   * @param {string} value of the `char-remaining-text` property
   */
  set charRemainingText(value: string) {
    if (value) {
      this.setAttribute(attributes.CHAR_REMAINING_TEXT, value.toString());
      return;
    }
    this.removeAttribute(attributes.CHAR_REMAINING_TEXT);
  }

  get charRemainingText(): string {
    return this.getAttribute(attributes.CHAR_REMAINING_TEXT) || CHAR_REMAINING_TEXT;
  }

  /**
   * Set the `character-counter` feature
   * @param {boolean|string} value If true will set `character-counter` attribute
   */
  set characterCounter(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.CHARACTER_COUNTER, val.toString());
    } else {
      this.removeAttribute(attributes.CHARACTER_COUNTER);
    }
    this.handleCharacterCounter();
  }

  get characterCounter(): boolean {
    const val = this.getAttribute(attributes.CHARACTER_COUNTER);
    return val !== null ? stringToBool(val) : true;
  }

  /**
   * Sets textarea to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
    this.setTextareaState(attributes.DISABLED);
  }

  get disabled(): boolean { return stringToBool(this.getAttribute(attributes.DISABLED)); }

  /**
   * internal reference to a label element a user provides
   */
  #labelEl?: HTMLLabelElement;

  /**
   * @readonly
   * @returns {HTMLLabelElement} the inner `label` element
   */
  get labelEl(): HTMLLabelElement | null {
    return this.#labelEl || this.shadowRoot?.querySelector(`[for="${ID}"]`) || null;
  }

  /**
   * Set the `maxlength` of textarea
   * @param {string|null} value of the `maxlength` property
   */
  set maxlength(value: string | null) {
    if (value) {
      this.setAttribute(attributes.MAXLENGTH, value.toString());
      this.input?.setAttribute(attributes.MAXLENGTH, value.toString());
    } else {
      this.removeAttribute(attributes.MAXLENGTH);
      this.input?.removeAttribute(attributes.MAXLENGTH);
    }
    this.handleCharacterCounter();
  }

  get maxlength(): string | null { return this.getAttribute(attributes.MAXLENGTH); }

  /**
   * Set the `placeholder` of textarea
   * @param {string|null} value of the `placeholder` property
   */
  set placeholder(value: string | null) {
    if (value) {
      this.setAttribute(attributes.PLACEHOLDER, value.toString());
      this.input?.setAttribute(attributes.PLACEHOLDER, value.toString());
      return;
    }
    this.removeAttribute(attributes.PLACEHOLDER);
    this.input?.removeAttribute(attributes.PLACEHOLDER);
  }

  get placeholder(): string | null { return this.getAttribute(attributes.PLACEHOLDER); }

  /**
   * Set the `printable` of textarea
   * @param {boolean|string|null} value If true will set `printable` attribute
   */
  set printable(value: boolean | string | null) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.PRINTABLE, val.toString());
    } else {
      this.removeAttribute(attributes.PRINTABLE);
    }
    this.handlePrintable(value);
  }

  get printable(): string | null { return this.getAttribute(attributes.PRINTABLE); }

  /**
   * Set the textarea to readonly state
   * @param {boolean|string} value If true will set `readonly` attribute
   */
  set readonly(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.READONLY, val.toString());
    } else {
      this.removeAttribute(attributes.READONLY);
    }
    this.setTextareaState(attributes.READONLY);
  }

  get readonly(): boolean { return stringToBool(this.getAttribute(attributes.READONLY)); }

  /**
   * Set the textarea to resizable state
   * @param {boolean|string} value If true will set `resizable` attribute
   */
  set resizable(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.RESIZABLE, val.toString());
      this.input?.classList.add(attributes.RESIZABLE);
    } else {
      this.removeAttribute(attributes.RESIZABLE);
      this.input?.classList.remove(attributes.RESIZABLE);
    }
  }

  get resizable(): boolean { return stringToBool(this.getAttribute(attributes.RESIZABLE)); }

  /**
   * Set the rows for textarea
   * @param {string|null} value If true will set `rows` attribute
   */
  set rows(value: string | null) {
    if (value) {
      this.setAttribute(attributes.ROWS, value.toString());
      this.input?.setAttribute(attributes.ROWS, value.toString());
    } else {
      this.removeAttribute(attributes.ROWS);
      this.input?.removeAttribute(attributes.ROWS);
    }
  }

  get rows(): string | null { return this.getAttribute(attributes.ROWS); }

  /**
   * Set the size (width) of textarea
   * @param {string} value [sm, md, lg, full]
   */
  set size(value: string) {
    const fieldContainer = this.shadowRoot?.querySelector('.field-container');
    const size = SIZES[value];
    this.setAttribute(attributes.SIZE, size || SIZES.default);
    fieldContainer?.classList.remove(...Object.values(SIZES));
    fieldContainer?.classList.add(size || SIZES.default);
  }

  get size(): string { return this.getAttribute(attributes.SIZE) || SIZES.default; }

  /**
   * Sets the text alignment
   * @param {string} value [left, center, right]
   */
  set textAlign(value: string) {
    if (value === 'start') value = 'left';
    else if (value === 'end') value = 'right';
    const textAlign = TEXT_ALIGN[value];
    this.setAttribute(attributes.TEXT_ALIGN, textAlign || TEXT_ALIGN.default);
    this.input?.classList.remove(...Object.values(TEXT_ALIGN));
    this.input?.classList.add(textAlign || TEXT_ALIGN.default);
  }

  get textAlign(): string { return this.getAttribute(attributes.TEXT_ALIGN) || TEXT_ALIGN.default; }

  /**
   * Set the `value` of textarea
   * @param {string} val the value property
   */
  set value(val: string) {
    const v = val || '';
    this.setAttribute(attributes.VALUE, v);
    if (this.input && this.input.value !== v) {
      this.input.value = this.getMaxValue(v);
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
      this.resetDirtyTracker();
    }
    this.updateCounter();
    this.updatePrintarea();
    this.setAutogrow();
  }

  get value(): string { return this.getAttribute(attributes.VALUE) || ''; }
}

import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { parseNumberWithUnits } from '../../utils/ids-dom-utils/ids-dom-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsFormInputMixin from '../../mixins/ids-form-input-mixin/ids-form-input-mixin';
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
          IdsFormInputMixin(
            IdsEventsMixin(
              IdsElement
            )
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

export const setSizeAttr = (name: string, el: IdsTextarea, value: string | null, propTargetEl?: HTMLElement) => {
  if (value) {
    el.setAttribute(name, value.toString());
    el.container?.classList.add(`has-${name}`);
    if (propTargetEl) propTargetEl.style.setProperty(name, parseNumberWithUnits(value));
  } else {
    el.removeAttribute(name);
    el.container?.classList.remove(`has-${name}`);
    if (propTargetEl) propTargetEl.style.removeProperty(name);
  }
};

export type IdsTextareaResizeSetting = boolean | 'x' | 'y' | 'both';

/**
 * IDS Textarea Component
 * @type {IdsTextarea}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsFormInputMixin
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
      attributes.AUTOSELECT,
      attributes.CHAR_MAX_TEXT,
      attributes.CHAR_REMAINING_TEXT,
      attributes.CHARACTER_COUNTER,
      attributes.DISABLED,
      attributes.MAX_HEIGHT,
      attributes.MAX_WIDTH,
      attributes.MAXLENGTH,
      attributes.MIN_HEIGHT,
      attributes.MIN_WIDTH,
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
    this.setInitialConstraint();
    this.#attachEventHandlers();
  }

  /**
   * Custom Element `disconnectedCallback` implementation
   * @returns {void}
   */
  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  onLocaleChange = () => {
    this.updateCounter();
  };

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
    return this.container?.querySelector<HTMLTextAreaElement>('textarea') ?? null;
  }

  /**
   * @readonly
   * @returns {HTMLTextAreaElement} the inner `textarea` element
   * @see IdsFormInputMixin.formInput
   */
  get formInput(): HTMLInputElement | HTMLTextAreaElement | null {
    return this.input;
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
        this.input.style.overflowY = 'auto';
        if (this.maxWidth) this.input.style.overflowX = 'auto';
        this.setAutogrow();
      } else {
        this.input.style.overflowY = '';
        this.input.style.overflowX = '';
        if (!this.resizable) {
          this.input.style.height = '';
        }
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
  private setAutogrow(): void {
    if (this.autogrow && !this.autogrowProcessing) {
      this.autogrowProcessing = true;
      this.constrainDimensions();
      this.autogrowProcessing = false;
    }
  }

  /**
   * Set initial size constraints on the textarea
   */
  private setInitialConstraint() {
    this.minHeight = this.minHeight;
    this.maxHeight = this.maxHeight;
    this.minWidth = this.minWidth;
    this.maxWidth = this.maxWidth;
    this.constrainDimensions();
  }

  /**
   * Adjust width/height based on defined values
   * @private
   */
  private constrainDimensions() {
    const minHeight = parseInt((this.minHeight as any), 10) || 0;
    const oldHeight = this.input?.offsetHeight || 0;
    this.adjustHeight(oldHeight, minHeight);
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
    let newHeight = elem?.offsetHeight || 0;
    const scrollHeight = elem?.scrollHeight || 0;
    if (scrollHeight > newHeight) newHeight = scrollHeight;

    if (elem && typeof newHeight === 'number' && (oldHeight !== newHeight)) {
      let height = newHeight;
      if (oldHeight > newHeight) {
        elem.style.height = '5px';
        height = elem.scrollHeight;
      }
      const isScrollable = (maxHeight > 0 && maxHeight < height);
      elem.style.overflowY = isScrollable ? '' : 'auto';
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
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  handleNativeEvents(): object {
    if (this.input) {
      const events = ['propertychange', 'focus', 'select'];
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

      // suppress native input event
      this.onEvent('input', this.input, (e: InputEvent) => {
        if (e instanceof InputEvent) {
          e.stopPropagation();
        }
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
        text = this.charMaxText.replace('{0}', max.toString());
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
   * Sets a "max-height" CSS property on the textarea
   * @param {string | null} value of `max-height` attribute
   */
  set maxHeight(value: string | null) {
    setSizeAttr(attributes.MAX_HEIGHT, this, value, this.input!);
    this.handleAutogrow();
  }

  get maxHeight(): string | null { return this.getAttribute(attributes.MAX_HEIGHT); }

  /**
   * Sets a "max-width" CSS property on the textarea
   * @param {string | null} value of `max-width` attribute
   */
  set maxWidth(value: string | null) {
    setSizeAttr(attributes.MAX_WIDTH, this, value, this.input!);
    if (this.fieldContainer) {
      if (value) {
        this.fieldContainer.style.setProperty(attributes.MAX_WIDTH, parseNumberWithUnits(value));
      } else {
        this.fieldContainer.style.removeProperty(attributes.MAX_WIDTH);
      }
    }
  }

  get maxWidth(): string | null { return this.getAttribute(attributes.MAX_WIDTH); }

  /**
   * Sets a "min-height" CSS property on the textarea
   * @param {string | null} value of `min-height` attribute
   */
  set minHeight(value: string | null) {
    setSizeAttr(attributes.MIN_HEIGHT, this, value, this.input!);
    this.handleAutogrow();
  }

  get minHeight(): string | null { return this.getAttribute(attributes.MIN_HEIGHT); }

  /**
   * Sets a "min-width" CSS property on the textarea
   * @param {string | null} value of `min-width` attribute
   */
  set minWidth(value: string | null) {
    setSizeAttr(attributes.MIN_WIDTH, this, value, this.input!);
    if (this.fieldContainer) {
      if (value) {
        this.fieldContainer.style.setProperty(attributes.MIN_WIDTH, parseNumberWithUnits(value));
      } else {
        this.fieldContainer.style.removeProperty(attributes.MIN_WIDTH);
      }
    }
  }

  get minWidth(): string | null { return this.getAttribute(attributes.MIN_WIDTH); }

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

  get charMaxText(): string { return this.getAttribute(attributes.CHAR_MAX_TEXT) || this.localeAPI.translate('CharactersMax'); }

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
    return this.getAttribute(attributes.CHAR_REMAINING_TEXT) || this.localeAPI.translate('CharactersLeft');
  }

  /**
   * Set the `character-counter` feature
   * @param {boolean|string} value If true will set `character-counter` attribute
   */
  set characterCounter(value: boolean | string) {
    const val = stringToBool(value);
    if (value === null || value === undefined) {
      this.removeAttribute(attributes.CHARACTER_COUNTER);
    } else {
      this.setAttribute(attributes.CHARACTER_COUNTER, val.toString());
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
   * @param {IdsTextareaResizeSetting|string} value If true will set `resizable` attribute
   */
  set resizable(value: IdsTextareaResizeSetting | string) {
    const isTruthy = stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.RESIZABLE, value.toString());
    } else {
      this.removeAttribute(attributes.RESIZABLE);
    }

    this.container?.classList.remove(
      attributes.RESIZABLE,
      `${attributes.RESIZABLE}-x`,
      `${attributes.RESIZABLE}-y`,
    );

    if (value) {
      const stringVal = value.toString();
      switch (stringVal) {
        case 'x':
          this.container?.classList.add(`${attributes.RESIZABLE}-x`);
          break;
        case 'y':
          this.container?.classList.add(`${attributes.RESIZABLE}-y`);
          break;
        case 'both':
        case 'true':
          this.container?.classList.add(attributes.RESIZABLE);
          break;
        default: // false
          break;
      }
    }
  }

  get resizable(): IdsTextareaResizeSetting { return stringToBool(this.getAttribute(attributes.RESIZABLE)); }

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
    super.value = v;

    if (this.input && this.input.value !== v) {
      this.input.value = this.getMaxValue(v);
      this.resetDirtyTracker();
    }
    this.updateCounter();
    this.updatePrintarea();
    this.setAutogrow();
  }

  get value(): string { return this.input?.value || ''; }
}

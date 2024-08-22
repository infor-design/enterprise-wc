import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsHideFocusMixin from '../../mixins/ids-hide-focus-mixin/ids-hide-focus-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-text/ids-text';
import './ids-radio-group';

import styles from './ids-radio.scss';

const Base = IdsLocaleMixin(
  IdsHideFocusMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Radio Component
 * @type {IdsRadio}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 * @part radio - the actual radio input element
 * @part circle - the visible circle element
 * @part label - the label text element
 */
@customElement('ids-radio')
@scss(styles)
export default class IdsRadio extends Base {
  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.CHECKED,
      attributes.DISABLED,
      attributes.GROUP_DISABLED,
      attributes.HORIZONTAL,
      attributes.LABEL,
      attributes.LANGUAGE,
      attributes.VALIDATION_HAS_ERROR,
      attributes.VALUE
    ];
  }

  get input(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector<HTMLInputElement>('input[type="radio"]') ?? null;
  }

  get labelEl(): HTMLLabelElement | null {
    return this.shadowRoot?.querySelector<HTMLLabelElement>('label') ?? null;
  }

  get rootEl(): HTMLElement | null {
    return this.shadowRoot?.querySelector<HTMLElement>('.ids-radio') ?? null;
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback(): void {
    super.connectedCallback();

    if (this.checked && !this.input?.getAttribute(attributes.CHECKED)) {
      this.checked = true;
    }

    this.#attachEventHandlers();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    const isDisabled = stringToBool(this.groupDisabled) || stringToBool(this.disabled);
    const disabled = isDisabled ? ' disabled' : '';
    const disabledAria = isDisabled ? ' aria-disabled="true"' : '';
    const horizontal = stringToBool(this.horizontal) ? ' horizontal' : '';
    const checked = stringToBool(this.checked) ? ' checked' : '';
    const rootClass = ` class="ids-radio${disabled}${horizontal}"`;
    const radioClass = ' class="radio-button"';
    const value = ` value="${this.value ?? ''}"`;

    return `
      <div${rootClass}>
        <label>
          <input type="radio" part="radio" tabindex="-1"${radioClass}${value}${disabled}${checked}>
          <span class="circle${checked}" part="circle"></span>
          <ids-text class="label-text"${disabledAria} part="label">${this.label}</ids-text>
        </label>
      </div>
    `;
  }

  /**
   * Attach radio change event
   * @private
   * @returns {void}
   */
  #attachRadioChangeEvent(): void {
    this.onEvent('change', this.input, () => {
      this.checked = !!this.input?.checked;
    });
  }

  /**
   * Attach radio click event
   * @private
   * @returns {void}
   */
  #attachRadioClickEvent(): void {
    this.onEvent('click', this.labelEl, () => {
      this.input?.focus(); // Safari need focus first click
    });
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {void}
   */
  #attachNativeEvents(): void {
    const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      this.onEvent(evt, this.input, (e: KeyboardEvent) => {
        /**
         * Trigger event on parent and compose the args
         * will fire nativeEvents.
         * @private
         * @param {object} elem Actual event
         * @param {string} value The updated input element value
         */
        this.triggerEvent(e.type, this, {
          detail: {
            elem: this,
            nativeEvent: e,
            value: this.value,
            checked: !!this.input?.checked
          }
        });
      });
    });
  }

  /**
   * Attach events
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    this.#attachRadioClickEvent();
    this.#attachRadioChangeEvent();
    this.#attachNativeEvents();
  }

  /**
   * Set `checked` attribute
   * @param {boolean|string} value If true will set `checked` attribute
   */
  set checked(value: boolean | string) {
    const circle = this.shadowRoot?.querySelector('.circle');
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.CHECKED, val.toString());
    } else {
      this.removeAttribute(attributes.CHECKED);
    }
    if (this.input && this.rootEl && circle) {
      if (val) {
        if (!(stringToBool(this.disabled)
          || stringToBool(this.groupDisabled))) {
          this.rootEl.setAttribute('tabindex', '0');
        }
        circle.classList.add(attributes.CHECKED);
        this.input.checked = true;
      } else {
        this.rootEl.setAttribute('tabindex', '-1');
        this.input.checked = false;
        circle.classList.remove(attributes.CHECKED);
      }
    }
  }

  get checked(): boolean { return stringToBool(this.getAttribute(attributes.CHECKED)); }

  /**
   * Set `disabled` attribute
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value: boolean | string) {
    const val = stringToBool(value);
    const labelText = this.shadowRoot?.querySelector('.label-text');
    const rootEl = this.rootEl;
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
      this.input?.setAttribute(attributes.DISABLED, val.toString());
      rootEl?.classList.add(attributes.DISABLED);
      rootEl?.setAttribute('tabindex', '-1');
      labelText?.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.input?.removeAttribute(attributes.DISABLED);
      labelText?.removeAttribute('aria-disabled');
      rootEl?.classList.remove(attributes.DISABLED);
    }
  }

  get disabled(): boolean { return stringToBool(this.getAttribute(attributes.DISABLED)); }

  /**
   * Set `group-disabled` attribute
   * @param {boolean|string} value If true will set `group-disabled` attribute
   */
  set groupDisabled(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.GROUP_DISABLED, val.toString());
      this.input?.setAttribute(attributes.DISABLED, val.toString());
      this.rootEl?.classList.add(attributes.DISABLED);
      this.rootEl?.setAttribute('tabindex', '-1');
    } else {
      this.removeAttribute(attributes.GROUP_DISABLED);
      this.input?.removeAttribute(attributes.DISABLED);
      this.rootEl?.classList.remove(attributes.DISABLED);
    }
  }

  get groupDisabled(): boolean { return stringToBool(this.getAttribute(attributes.GROUP_DISABLED)); }

  /**
   * Set `horizontal` attribute `inline|block`, default as `block`
   * @param {boolean|string} value If true will set `horizontal` attribute
   */
  set horizontal(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.HORIZONTAL, val.toString());
      this.rootEl?.classList.add(attributes.HORIZONTAL);
    } else {
      this.removeAttribute(attributes.HORIZONTAL);
      this.rootEl?.classList.remove(attributes.HORIZONTAL);
    }
  }

  get horizontal(): boolean { return stringToBool(this.getAttribute(attributes.HORIZONTAL)); }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value: string) {
    const labelText = this.labelEl?.querySelector('.label-text');
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }
    if (labelText) {
      labelText.innerHTML = value || '';
    }
  }

  get label(): string { return this.getAttribute(attributes.LABEL) || ''; }

  /**
   * Set `validation-has-error` attribute
   * @param {boolean|string} value If true will set `validation-has-error` attribute
   */
  set validationHasError(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.VALIDATION_HAS_ERROR, val.toString());
      this.input?.classList.add('error');
    } else {
      this.removeAttribute(attributes.VALIDATION_HAS_ERROR);
      this.input?.classList.remove('error');
    }
  }

  get validationHasError(): boolean { return stringToBool(this.getAttribute(attributes.VALIDATION_HAS_ERROR)); }

  /**
   * Set the `value` attribute
   * @param {string | null} val the value property
   */
  set value(val: string | null) {
    if (val) {
      this.setAttribute(attributes.VALUE, val);
    } else {
      this.removeAttribute(attributes.VALUE);
    }
    this.input?.setAttribute(attributes.VALUE, (val || ''));

    this.triggerEvent('valuechange', this, {
      bubbles: true,
      detail: {
        elem: this,
        value: val,
      }
    });
  }

  get value(): string | null { return this.getAttribute(attributes.VALUE); }

  /**
   * Overrides the standard "focus" behavior to instead pass focus to the inner HTMLInput element.
   * @returns {void}
   */
  focus(): void {
    this.input?.focus();
  }
}

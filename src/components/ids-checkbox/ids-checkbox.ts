import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLabelStateMixin from '../../mixins/ids-label-state-mixin/ids-label-state-mixin';
import IdsValidationMixin from '../../mixins/ids-validation-mixin/ids-validation-mixin';
import IdsHitboxMixin from '../../mixins/ids-hitbox-mixin/ids-hitbox-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-text/ids-text';
import styles from './ids-checkbox.scss';
import { type IdsColorValueCategories } from '../../utils/ids-color-utils/ids-color-utils';

const Base = IdsLabelStateMixin(
  IdsValidationMixin(
    IdsHitboxMixin(
      IdsLocaleMixin(
        IdsEventsMixin(
          IdsElement
        )
      )
    )
  )
);

/**
 * IDS Checkbox Component
 * @type {IdsCheckbox}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsHitboxMixin
 * @mixes IdsLabelStateMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsValidationMixin
 * @part label - the label element
 * @part input - the checkbox input element
 * @part label-checkbox - the label text element
 */
@customElement('ids-checkbox')
@scss(styles)
export default class IdsCheckbox extends Base {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  labelAudible?: boolean;

  isFormComponent = true;

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [
      ...super.attributes,
      attributes.NO_ANIMATION,
      attributes.CHECKED,
      attributes.COLOR,
      attributes.DISABLED,
      attributes.HORIZONTAL,
      attributes.INDETERMINATE,
      attributes.VALUE
    ];
  }

  /**
   * Internal change event detection trigger.
   * @private
   * @type {boolean}
   */
  #triggeredChange = false;

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback(): void {
    super.connectedCallback();
    this.#attachEventHandlers();
  }

  /**
   * Create the Template for the contents.
   * @returns {string} The template.
   */
  template(): string {
    // Checkbox
    const color = this.color ? ` color="${this.color}"` : '';
    const audible = stringToBool(this.labelAudible) ? ' audible="true"' : '';
    const disabled = stringToBool(this.disabled) ? ' disabled' : '';
    const horizontal = stringToBool(this.horizontal) ? ' horizontal' : '';
    const checked = stringToBool(this.checked) ? ' checked' : '';
    const noAnimation = stringToBool(this.noAnimation) ? ' no-animation' : '';
    const rootClass = ` class="ids-checkbox${disabled}${horizontal}${noAnimation}"`;
    let checkboxClass = 'checkbox';
    checkboxClass += stringToBool(this.indeterminate) ? ' indeterminate' : '';
    checkboxClass = ` class="${checkboxClass}"`;
    const rInd = !(stringToBool(this.labelRequired) || this.labelRequired === null);
    const hiddenLabelCss = !this.label.length || this.labelState === 'hidden' ? ' empty' : '';
    const requiredLabelCss = rInd ? ' no-required-indicator' : '';

    return `
      <div${rootClass}${color} part="root">
        <label class="ids-label-text${requiredLabelCss}${hiddenLabelCss}" part="label">
          <input part="input" type="checkbox"${checkboxClass}${disabled}${checked}>
          <span class="checkmark${checked}" part="checkmark"></span>
          <ids-text${audible} class="label-checkbox" part="label-checkbox">${this.label}</ids-text>
        </label>
      </div>
    `;
  }

  /**
   * Attach checkbox change event
   * @private
   * @returns {void}
   */
  attachCheckboxChangeEvent(): void {
    this.onEvent('change', this.input, (e: Event) => {
      this.indeterminate = false;
      this.#triggeredChange = true;
      this.checked = !!this.input?.checked;
      this.triggerEvent(e.type, this, {
        detail: {
          elem: this,
          nativeEvent: e,
          value: this.value,
          checked: this.input?.checked
        },
        bubbles: true
      });
    });
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {void}
   */
  attachNativeEvents(): void {
    const events = ['focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      this.onEvent(evt, this.input, (e: Event) => {
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
   * Handle events
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    this.attachCheckboxChangeEvent();
    this.attachNativeEvents();
  }

  /**
   * @readonly
   * @returns {HTMLInputElement} the inner `input` element
   */
  get input(): HTMLInputElement | undefined | null {
    return this.container?.querySelector<HTMLInputElement>('input[type="checkbox"]');
  }

  /**
   * @readonly
   * @returns {HTMLLabelElement} the inner `labelEl` element
   */
  get labelEl(): HTMLLabelElement | undefined | null {
    return this.container?.querySelector<HTMLLabelElement>('label');
  }

  /**
   * Sets the checked state to true or false
   * @param {boolean|string} value If true will set `checked` attribute
   */
  set checked(value: boolean | string) {
    const val = stringToBool(value);
    const checkmark = this.shadowRoot?.querySelector<HTMLInputElement>('.checkmark');

    if (this.checked === val && this.input?.checked === val) return;

    this.toggleAttribute(attributes.CHECKED, val);
    checkmark?.classList.toggle(attributes.CHECKED, val);

    if (this.input) this.input.checked = val;

    if (!this.#triggeredChange && this.input) {
      this.triggerEvent('change', this.input, { bubbles: true });
    }
    this.#triggeredChange = false;
  }

  get checked(): boolean { return stringToBool(this.getAttribute(attributes.CHECKED)); }

  /**
   * Sets the checkbox color to one of the colors in our color palette for example green
   * @param {IdsColorValueCategories} value If true will set `color` attribute
   */
  set color(value: IdsColorValueCategories) {
    const rootEl = this.shadowRoot?.querySelector('.ids-checkbox');
    if (value) {
      this.setAttribute(attributes.COLOR, value.toString());
      rootEl?.setAttribute(attributes.COLOR, value.toString());
    } else {
      this.removeAttribute(attributes.COLOR);
      rootEl?.removeAttribute(attributes.COLOR);
    }
  }

  get color(): IdsColorValueCategories { return this.getAttribute(attributes.COLOR) as IdsColorValueCategories; }

  /**
   * Sets input to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value: boolean | string | null) {
    const rootEl = this.shadowRoot?.querySelector('.ids-checkbox');
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
      this.input?.setAttribute(attributes.DISABLED, val.toString());
      rootEl?.classList.add(attributes.DISABLED);
      this.labelEl?.querySelector('.label-checkbox')?.setAttribute(attributes.DISABLED, val.toString());
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.input?.removeAttribute(attributes.DISABLED);
      rootEl?.classList.remove(attributes.DISABLED);
      this.labelEl?.querySelector('.label-checkbox')?.removeAttribute(attributes.DISABLED);
    }
  }

  get disabled(): string | null { return this.getAttribute(attributes.DISABLED); }

  /**
   * Flips the checkbox orientation to horizontal
   * @param {boolean|string} value If true will set `horizontal` attribute
   */
  set horizontal(value: boolean | string | null) {
    const rootEl = this.shadowRoot?.querySelector('.ids-checkbox');
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.HORIZONTAL, val.toString());
      rootEl?.classList.add(attributes.HORIZONTAL);
    } else {
      this.removeAttribute(attributes.HORIZONTAL);
      rootEl?.classList.remove(attributes.HORIZONTAL);
    }
  }

  get horizontal(): string | null { return this.getAttribute(attributes.HORIZONTAL); }

  /**
   * Sets the checkbox to the indeterminate state
   * @param {string|boolean} value The `indeterminate` attribute
   */
  set indeterminate(value: string | boolean | null) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.INDETERMINATE, val.toString());
    } else {
      this.removeAttribute(attributes.INDETERMINATE);
    }
    if (this.input) {
      if (val) {
        this.input.classList.add(attributes.INDETERMINATE);
        this.input.indeterminate = true;
      } else {
        this.input.classList.remove(attributes.INDETERMINATE);
        this.input.indeterminate = false;
      }
    }
  }

  get indeterminate(): string | null { return this.getAttribute(attributes.INDETERMINATE); }

  /**
   * Set the checkbox `value` attribute
   * @param {string | boolean} val the value property
   */
  set value(val: string | boolean | null) {
    const value = stringToBool(val);
    this.toggleAttribute(attributes.VALUE, value);
    this.input?.toggleAttribute(attributes.VALUE, value);
    this.checked = value;
  }

  get value() { return stringToBool(this.input?.checked); }

  /**
   * Disable the check animation
   * @param {string | boolean} value the value property
   */
  set noAnimation(value: string | boolean | null) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.NO_ANIMATION, String(val));
      this.container?.classList.add('no-animation');
    } else {
      this.removeAttribute(attributes.NO_ANIMATION);
      this.container?.classList.remove('no-animation');
    }
  }

  get noAnimation() { return stringToBool(this.getAttribute(attributes.NO_ANIMATION)) || false; }

  /**
   * Overrides the standard "focus" behavior to instead pass focus to the inner HTMLInput element.
   */
  focus(): void {
    this.input?.focus();
  }
}

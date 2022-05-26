import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-checkbox-base';
import '../ids-text/ids-text';
import attribs from './ids-checkbox-attributes';

import styles from './ids-checkbox.scss';

/**
 * IDS Checkbox Component
 * @type {IdsCheckbox}
 * @inherits IdsElement
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsHitboxMixin
 * @mixes IdsValidationMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
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

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [
      ...super.attributes,
      attributes.CHECKED,
      attributes.COLOR,
      attributes.DISABLED,
      attributes.HORIZONTAL,
      attributes.INDETERMINATE,
      attributes.LABEL,
      attributes.LABEL_REQUIRED,
      attributes.LABEL_AUDIBLE,
      attributes.VALUE,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * Internal change event detection trigger.
   * @private
   * @type {boolean}
   */
  #triggeredChange = false;

  /**
   * Custom Element `attributeChangedCallback` implementation
   * @param {string} name The name of attribute changed
   * @param {any} oldValue The old value
   * @param {any} newValue The new value
   * @returns {void}
   */
  attributeChangedCallback(
    name: string,
    oldValue: any,
    newValue: any
  ): void {
    if (oldValue !== newValue) {
      attribs.forEach((attribute) => {
        if (name === attribute.name) {
          this[attribute.prop] = newValue;
        }
      });
    }
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback(): void {
    this.input = this.shadowRoot.querySelector('input[type="checkbox"]');
    this.labelEl = this.shadowRoot.querySelector('label');
    this.#attachEventHandlers();
    super.connectedCallback();
  }

  /**
   * Create the Template for the contents.
   * @returns {string} The template.
   */
  template(): string {
    if (!this.label && !this.labelAudible) {
      this.label = '&nbsp;';
    }

    // Checkbox
    const color = this.color ? ` color="${this.color}"` : '';
    const audible = stringToBool(this.labelAudible) ? ' audible="true"' : '';
    const disabled = stringToBool(this.disabled) ? ' disabled' : '';
    const horizontal = stringToBool(this.horizontal) ? ' horizontal' : '';
    const checked = stringToBool(this.checked) ? ' checked' : '';
    const rootClass = ` class="ids-checkbox${disabled}${horizontal}"`;
    let checkboxClass = 'checkbox';
    checkboxClass += stringToBool(this.indeterminate) ? ' indeterminate' : '';
    checkboxClass = ` class="${checkboxClass}"`;
    const rInd = !(stringToBool(this.labelRequired) || this.labelRequired === null);
    const labelClass = rInd ? ' class="no-required-indicator"' : '';

    return `
      <div${rootClass}${color} part="root">
        <label${labelClass} part="label">
          <input part="input" type="checkbox"${checkboxClass}${disabled}${checked}>
          <span class="checkmark${checked}"></span>
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
      this.checked = this.input.checked;
      this.triggerEvent(e.type, this, {
        detail: {
          elem: this,
          nativeEvent: e,
          value: this.value,
          checked: this.input.checked
        }
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
        e.stopPropagation();
        this.triggerEvent(e.type, this, {
          detail: {
            elem: this,
            nativeEvent: e,
            value: this.value,
            checked: this.input.checked
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
   * Sets the checked state to true or false
   * @param {boolean|string} value If true will set `checked` attribute
   */
  set checked(value: boolean | string) {
    const checkmark = this.shadowRoot.querySelector('.checkmark');
    const val = stringToBool(value);
    if (this.checked === val) {
      return;
    }
    if (val) {
      this.setAttribute(attributes.CHECKED, val);
      checkmark?.classList.add(attributes.CHECKED);
      if (this.input) {
        this.input.checked = true;
      }
    } else {
      this.removeAttribute(attributes.CHECKED);
      checkmark?.classList.remove(attributes.CHECKED);
      if (this.input) {
        this.input.checked = false;
      }
    }

    if (!this.#triggeredChange) {
      this.triggerEvent('change', this.input, { bubbles: true });
    }
    this.#triggeredChange = false;
  }

  get checked(): boolean | string { return this.getAttribute(attributes.CHECKED); }

  /**
   *  Sets the checkbox color to one of the colors in our color palette for example emerald07
   * @param {boolean|string} value If true will set `color` attribute
   */
  set color(value: boolean | string) {
    const rootEl = this.shadowRoot.querySelector('.ids-checkbox');
    if (value) {
      this.setAttribute(attributes.COLOR, value.toString());
      rootEl?.setAttribute(attributes.COLOR, value.toString());
    } else {
      this.removeAttribute(attributes.COLOR);
      rootEl?.removeAttribute(attributes.COLOR);
    }
  }

  get color(): boolean | string { return this.getAttribute(attributes.COLOR); }

  /**
   * Sets input to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value: boolean | string) {
    const rootEl = this.shadowRoot.querySelector('.ids-checkbox');
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
      this.labelEl?.querySelector('.label-checkbox').removeAttribute(attributes.DISABLED);
    }
  }

  get disabled(): boolean | string { return this.getAttribute(attributes.DISABLED); }

  /**
   * Flips the checkbox orientation to horizontal
   * @param {boolean|string} value If true will set `horizontal` attribute
   */
  set horizontal(value: boolean | string) {
    const rootEl = this.shadowRoot.querySelector('.ids-checkbox');
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.HORIZONTAL, val.toString());
      rootEl?.classList.add(attributes.HORIZONTAL);
    } else {
      this.removeAttribute(attributes.HORIZONTAL);
      rootEl?.classList.remove(attributes.HORIZONTAL);
    }
  }

  get horizontal(): boolean | string { return this.getAttribute(attributes.HORIZONTAL); }

  /**
   * Sets the checkbox to the indeterminate state
   * @param {string|boolean} value The `indeterminate` attribute
   */
  set indeterminate(value: string | boolean) {
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

  get indeterminate(): boolean | string { return this.getAttribute(attributes.INDETERMINATE); }

  /**
   * Set the `label` text
   * @param {string | boolean} value of the `label` text property
   */
  set label(value: string | boolean) {
    const labelText = this.labelEl?.querySelector('.label-checkbox');
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }
    if (labelText) {
      labelText.innerHTML = value || '';
    }
  }

  get label(): boolean | string { return this.getAttribute(attributes.LABEL) || ''; }

  /**
   * Set the `label-audible` attribute
   * @param {string | boolean} value of the `labelAudible`
   */
  set labelAudible(value: string | boolean) {
    this.setAttribute(attributes.LABEL_AUDIBLE, value);
    const idsTextElem = this.labelEl?.querySelector('ids-text');
    if (stringToBool(value)) {
      idsTextElem.setAttribute(attributes.AUDIBLE, value);
    } else {
      idsTextElem.removeAttribute(attributes.AUDIBLE);
    }
  }

  get labelAudible(): boolean | string { return this.getAttribute(attributes.LABEL_AUDIBLE); }

  /**
   * Sets the checkbox to required
   * @param {string | boolean} value The `label-required` attribute
   */
  set labelRequired(value: string | boolean) {
    const val = stringToBool(value);
    if (value) {
      this.setAttribute(attributes.LABEL_REQUIRED, value.toString());
    } else {
      this.removeAttribute(attributes.LABEL_REQUIRED);
    }
    this.labelEl?.classList[!val ? 'add' : 'remove']('no-required-indicator');
  }

  get labelRequired() { return this.getAttribute(attributes.LABEL_REQUIRED); }

  /**
   * Set the checkbox `value` attribute
   * @param {string | boolean} val the value property
   */
  set value(val: string | boolean) {
    if (val) {
      this.setAttribute(attributes.VALUE, val);
    } else {
      this.removeAttribute(attributes.VALUE);
    }
    this.input?.setAttribute(attributes.VALUE, (val || ''));
  }

  get value() { return this.getAttribute(attributes.VALUE); }

  /**
   * Overrides the standard "focus" behavior to instead pass focus to the inner HTMLInput element.
   */
  focus(): void {
    this.input.focus();
  }
}

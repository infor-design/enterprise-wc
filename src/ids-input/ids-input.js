import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { IdsDirtyTrackerMixin } from '../ids-base/ids-dirty-tracker-mixin';
import { IdsValidationMixin } from '../ids-base/ids-validation-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-input.scss';

// Input id
const ID = 'ids-input-id';

// Types
const TYPES = {
  default: 'text',
  text: 'text',
  password: 'password',
  number: 'number',
  email: 'email'
};

// Setting defaults sizes
const SIZES = {
  default: 'md',
  xs: 'xs',
  sm: 'sm',
  mm: 'mm',
  md: 'md',
  lg: 'lg',
  full: 'full'
};

/**
 * IDS Trigger Field Components
 */
@customElement('ids-input')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsStringUtilsMixin)
@mixin(IdsDirtyTrackerMixin)
@mixin(IdsValidationMixin)
class IdsInput extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.DIRTY_TRACKER,
      props.DISABLED,
      props.LABEL,
      props.LABEL_FONT_SIZE,
      props.NAME,
      props.PLACEHOLDER,
      props.SIZE,
      props.READONLY,
      props.TYPE,
      props.VALIDATE,
      props.VALUE
    ];
  }

  /**
   * Custom Element `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    this.input = this.shadowRoot.querySelector(`#${ID}`);
    this.label = this.shadowRoot.querySelector(`[for="${ID}"]`);

    this.handleDirtyTracker();
    this.handleValidation();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    // Input
    const placeholder = this.placeholder ? ` placeholder="${this.placeholder}"` : '';
    const value = this.value !== null ? ` value="${this.value}"` : '';
    const fieldName = this.fieldName !== null ? ` name="${this.fieldName}"` : '';
    const type = ` type="${this.type || TYPES.default}"`;
    const inputClass = ` class="ids-input-field ${this.size}"`;
    let inputState = this.stringToBool(this.readonly) ? ' readonly' : '';
    inputState = this.stringToBool(this.disabled) ? ' disabled' : inputState;

    // Label
    const labelFontSize = this.labelFontSize ? ` font-size="${this.labelFontSize}"` : '';
    const labelClass = ` class="ids-input-label${inputState}"`;

    return `
      <label for="${ID}"${labelClass}>
        <ids-label${labelFontSize}>${this.labelText}</ids-label>
      </label>
      <input id="${ID}"${fieldName}${type}${inputClass}${value}${placeholder}${inputState} />
    `;
  }

  /**
   * Set input state for disabled or readonly
   * @private
   * @param {string} prop The property
   * @returns {void}
   */
  setInputState(prop) {
    if (prop === props.READONLY || prop === props.DISABLED) {
      const options = {
        prop1: prop,
        prop2: prop !== props.READONLY ? props.READONLY : props.DISABLED,
        val: this.stringToBool(this[prop])
      };
      if (options.val) {
        this.input?.removeAttribute(options.prop2);
        this.label?.classList.remove(options.prop2);

        this.input?.setAttribute(options.prop1, true);
        this.label?.classList.add(options.prop1);
      } else {
        this.input?.removeAttribute(options.prop1);
        this.label?.classList.remove(options.prop1);
      }
    }
  }

  /**
   * Set `dirty-tracker` attribute
   * @param {boolean} value If true will set `dirty-tracker` attribute
   */
  set dirtyTracker(value) {
    if (value) {
      const val = this.stringToBool(value);
      this.setAttribute(props.DIRTY_TRACKER, val);
      return;
    }
    this.removeAttribute(props.DIRTY_TRACKER);
  }

  get dirtyTracker() { return this.getAttribute(props.DIRTY_TRACKER); }

  /**
   * Set `disabled` attribute
   * @param {boolean} value If true will set `disabled` attribute
   */
  set disabled(value) {
    if (value) {
      const val = this.stringToBool(value);
      this.setAttribute(props.DISABLED, val);
    } else {
      this.removeAttribute(props.DISABLED);
    }
    this.setInputState(props.DISABLED);
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Set the field `name` of input
   * @param {string} value of the field `name` property
   */
  set fieldName(value) {
    if (value) {
      this.setAttribute(props.NAME, value);
      return;
    }
    this.removeAttribute(props.NAME);
  }

  get fieldName() { return this.getAttribute(props.NAME); }

  /**
   * Set the `label-font-size` of input label
   * @param {string} value of the `label-font-size` property
   */
  set labelFontSize(value) {
    if (value) {
      this.setAttribute(props.LABEL_FONT_SIZE, value);
      return;
    }
    this.removeAttribute(props.LABEL_FONT_SIZE);
  }

  get labelFontSize() { return this.getAttribute(props.LABEL_FONT_SIZE); }

  /**
   * Set the `label` text of input label
   * @param {string} value of the `label` text property
   */
  set labelText(value) {
    if (value) {
      this.setAttribute(props.LABEL, value);
      return;
    }
    this.removeAttribute(props.LABEL);
  }

  get labelText() { return this.getAttribute(props.LABEL) || ''; }

  /**
   * Set the `placeholder` of input
   * @param {string} value of the `placeholder` property
   */
  set placeholder(value) {
    if (value) {
      this.setAttribute(props.PLACEHOLDER, value);
      return;
    }
    this.removeAttribute(props.PLACEHOLDER);
  }

  get placeholder() { return this.getAttribute(props.PLACEHOLDER); }

  /**
   * Set the `readonly` of input
   * @param {boolean} value If true will set `readonly` attribute
   */
  set readonly(value) {
    if (value) {
      const val = this.stringToBool(value);
      this.setAttribute(props.READONLY, val);
    } else {
      this.removeAttribute(props.READONLY);
    }
    this.setInputState(props.READONLY);
  }

  get readonly() { return this.getAttribute(props.READONLY); }

  /**
   * Set the size of input
   * @param {string} value [xs, sm, mm, md, lg, full]
   */
  set size(value) {
    if (SIZES[value]) {
      this.setAttribute(props.SIZE, SIZES[value]);
      return;
    }
    this.setAttribute(props.SIZE, SIZES.default);
  }

  get size() { return this.getAttribute(props.SIZE) || SIZES.default; }

  /**
   * Set the type of input
   * @param {string} value [text, password, number, email]
   */
  set type(value) {
    if (TYPES[value]) {
      this.setAttribute(props.TYPE, TYPES[value]);
      return;
    }
    this.setAttribute(props.TYPE, TYPES.default);
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Set `validate` attribute
   * @param {string} value The `validate` attribute
   */
  set validate(value) {
    if (value) {
      this.setAttribute(props.VALIDATE, value);
      return;
    }
    this.removeAttribute(props.VALIDATE);
  }

  get validate() { return this.getAttribute(props.VALIDATE); }

  /**
   * Set the `value` attribute of input
   * @param {string} val the value property
   */
  set value(val) {
    if (val) {
      this.setAttribute(props.VALUE, val);
      return;
    }
    this.removeAttribute(props.VALUE);
  }

  get value() { return this.getAttribute(props.VALUE); }
}

export default IdsInput;

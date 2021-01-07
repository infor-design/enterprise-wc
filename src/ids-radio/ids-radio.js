import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';

import { IdsDomUtilsMixin } from '../ids-base/ids-dom-utils-mixin';
import { IdsHideFocusMixin } from '../ids-base/ids-hide-focus-mixin';
import { IdsStringUtilsMixin as stringUtils } from '../ids-base/ids-string-utils-mixin';
import { props } from '../ids-base/ids-constants';
// @ts-ignore
import styles from './ids-radio.scss';
// @ts-ignore
import IdsText from '../ids-text/ids-text';
// @ts-ignore
import IdsRadioGroup from './ids-radio-group';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';

/**
 * IDS Radio Component
 */
@customElement('ids-radio')
@scss(styles)
@mixin(IdsDomUtilsMixin)
@mixin(IdsHideFocusMixin)
class IdsRadio extends IdsElement {
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
      props.CHECKED,
      props.COLOR,
      props.DISABLED,
      props.GROUP_DISABLED,
      props.HORIZONTAL,
      props.LABEL,
      props.LABEL_FONT_SIZE,
      props.VALIDATION_HAS_ERROR,
      props.VALUE
    ];
  }

  /**
   * Custom Element `connectedCallBack` implementation
   * @returns {void}
   */
  connectedCallBack() {
    /** @type {object} */
    this.input = this.shadowRoot.querySelector('input[type="radio"]');
    this.labelEl = this.shadowRoot.querySelector('label');
    this.eventHandlers = new IdsEventsMixin();
    // @ts-ignore
    this.hideFocus();
    this.handleEvents();
  }

  /**
   * Custom Element `disconnectedCallback` implementation
   * @returns {void}
   */
  disconnectedCallback() {
    IdsElement.prototype.disconnectedCallback.apply(this);
    // @ts-ignore
    this.destroyHideFocus();
    this.handleRadioChangeEvent('remove');
    this.handleNativeEvents('remove');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    // Checkbox
    const disabled = stringUtils.stringToBool(this.disabled) ? ' disabled' : '';
    const disabledAria = stringUtils.stringToBool(this.disabled) ? ' aria-disabled="true"' : '';
    const horizontal = stringUtils.stringToBool(this.horizontal) ? ' horizontal' : '';
    const checked = stringUtils.stringToBool(this.checked) ? ' checked' : '';
    const rootClass = ` class="ids-radio${disabled}${horizontal}"`;
    const radioClass = ' class="radio-button"';

    // Label
    const labelFontSize = this.labelFontSize ? ` ${props.FONT_SIZE}="${this.labelFontSize}"` : '';

    return `
      <div${rootClass}>
        <label>
          <input type="radio" tabindex="-1"${radioClass}${disabled}${checked}>
          <span class="circle${checked}"></span>
          <ids-text class="label-text"${labelFontSize}${disabledAria}>${this.label}</ids-text>
        </label>
      </div>
    `;
  }

  /**
   * Handle radio change event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleRadioChangeEvent(option = '') {
    if (this.input) {
      const eventName = 'change';
      if (option === 'remove') {
        const handler = this.eventHandlers?.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.eventHandlers.removeEventListener(eventName, this.input);
        }
      } else {
        this.eventHandlers.addEventListener(eventName, this.input, () => {
          this.checked = this.input.checked;
        });
      }
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {object} The object for chaining.
   */
  handleNativeEvents(option = '') {
    if (this.input) {
      const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
      events.forEach((evt) => {
        if (option === 'remove') {
          const handler = this.eventHandlers?.handledEvents?.get(evt);
          if (handler && handler.target === this.input) {
            this.eventHandlers.removeEventListener(evt, this.input);
          }
        } else {
          this.eventHandlers.addEventListener(evt, this.input, (e) => {
            /**
             * Trigger event on parent and compose the args
             * will fire `trigger + nativeEvent` as triggerclick, triggerchange etc.
             * @private
             * @param  {object} elem Actual event
             * @param  {string} value The updated input element value
             */
            this.eventHandlers.dispatchEvent(`trigger${e.type}`, this, {
              elem: this,
              nativeEvent: e,
              value: this.value,
              checked: this.input.checked
            });
          });
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
  handleEvents() {
    this.handleRadioChangeEvent();
    this.handleNativeEvents();
  }

  /**
   * Set `checked` attribute
   * @param {boolean|string} value If true will set `checked` attribute
   */
  set checked(value) {
    const rootEl = this.shadowRoot.querySelector('.ids-radio');
    const circle = this.shadowRoot.querySelector('.circle');
    this.input = this.shadowRoot.querySelector('input[type="radio"]');
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.CHECKED, val.toString());
      if (!(stringUtils.stringToBool(this.disabled)
        || stringUtils.stringToBool(this.groupDisabled))) {
        rootEl.setAttribute('tabindex', '0');
      }
      circle?.classList.add(props.CHECKED);
      this.input.checked = true;
    } else {
      this.removeAttribute(props.CHECKED);
      rootEl.setAttribute('tabindex', '-1');
      this.input.checked = false;
      circle?.classList.remove(props.CHECKED);
    }
  }

  get checked() { return this.getAttribute(props.CHECKED); }

  /**
   * Set `color` attribute
   * @param {boolean|string} value If true will set `color` attribute
   */
  set color(value) {
    const rootEl = this.shadowRoot.querySelector('.ids-radio');
    if (value) {
      this.setAttribute(props.COLOR, value.toString());
      rootEl?.setAttribute(props.COLOR, value.toString());
    } else {
      this.removeAttribute(props.COLOR);
      rootEl?.removeAttribute(props.COLOR);
    }
  }

  get color() { return this.getAttribute(props.COLOR); }

  /**
   * Set `disabled` attribute
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    this.input = this.shadowRoot.querySelector('input[type="radio"]');
    const rootEl = this.shadowRoot.querySelector('.ids-radio');
    const labelText = this.shadowRoot.querySelector('.label-text');
    const val = stringUtils.stringToBool(value);
    if (value) {
      this.setAttribute(props.DISABLED, val.toString());
      this.input?.setAttribute(props.DISABLED, val);
      rootEl?.classList.add(props.DISABLED);
      rootEl?.setAttribute('tabindex', '-1');
      labelText?.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute(props.DISABLED);
      this.input?.removeAttribute(props.DISABLED);
      labelText?.removeAttribute('aria-disabled');
      rootEl?.classList.remove(props.DISABLED);
    }
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Set `group-disabled` attribute
   * @param {boolean|string} value If true will set `group-disabled` attribute
   */
  set groupDisabled(value) {
    this.input = this.shadowRoot.querySelector('input[type="radio"]');
    const rootEl = this.shadowRoot.querySelector('.ids-radio');
    const val = stringUtils.stringToBool(value);
    if (value) {
      this.setAttribute(props.GROUP_DISABLED, val.toString());
      this.input?.setAttribute(props.DISABLED, val);
      rootEl?.classList.add(props.DISABLED);
      rootEl?.setAttribute('tabindex', '-1');
    } else {
      this.removeAttribute(props.GROUP_DISABLED);
      this.input?.removeAttribute(props.DISABLED);
      rootEl?.classList.remove(props.DISABLED);
    }
  }

  get groupDisabled() { return this.getAttribute(props.GROUP_DISABLED); }

  /**
   * Set `horizontal` attribute `inline|block`, default as `block`
   * @param {boolean|string} value If true will set `horizontal` attribute
   */
  set horizontal(value) {
    const rootEl = this.shadowRoot.querySelector('.ids-radio');
    const val = stringUtils.stringToBool(value);
    if (value) {
      this.setAttribute(props.HORIZONTAL, val.toString());
      rootEl?.classList.add(props.HORIZONTAL);
    } else {
      this.removeAttribute(props.HORIZONTAL);
      rootEl?.classList.remove(props.HORIZONTAL);
    }
  }

  get horizontal() { return this.getAttribute(props.HORIZONTAL); }

  /**
   * Set the `label-font-size` of label
   * @param {string} value of the `label-font-size` property
   */
  set labelFontSize(value) {
    const labelText = this.shadowRoot.querySelector('.label-text') || document.createElement('span');
    if (value) {
      this.setAttribute(props.LABEL_FONT_SIZE, value);
      labelText.setAttribute(props.FONT_SIZE, value);
      return;
    }
    this.removeAttribute(props.LABEL_FONT_SIZE);
    labelText.removeAttribute(props.FONT_SIZE);
  }

  get labelFontSize() { return this.getAttribute(props.LABEL_FONT_SIZE); }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value) {
    const labelText = this.shadowRoot.querySelector('.label-text') || document.createElement('span');
    if (value) {
      this.setAttribute(props.LABEL, value);
      labelText.innerHTML = value;
      return;
    }
    this.removeAttribute(props.LABEL);
    labelText.innerHTML = '';
  }

  get label() { return this.getAttribute(props.LABEL) || ''; }

  /**
   * Set `validation-has-error` attribute
   * @param {boolean|string} value If true will set `validation-has-error` attribute
   */
  set validationHasError(value) {
    const val = stringUtils.stringToBool(value);
    if (value) {
      this.setAttribute(props.VALIDATION_HAS_ERROR, val.toString());
      this.input?.classList.add('error');
    } else {
      this.removeAttribute(props.VALIDATION_HAS_ERROR);
      this.input?.classList.remove('error');
    }
  }

  get validationHasError() { return this.getAttribute(props.VALIDATION_HAS_ERROR); }

  /**
   * Set the `value` attribute
   * @param {string} val the value property
   */
  set value(val) {
    this.input = this.shadowRoot.querySelector('input[type="radio"]');

    if (val) {
      this.setAttribute(props.VALUE, val);
    } else {
      this.removeAttribute(props.VALUE);
    }
    this.input.setAttribute(props.VALUE, (val || ''));
  }

  get value() { return this.getAttribute(props.VALUE); }
}

export default IdsRadio;

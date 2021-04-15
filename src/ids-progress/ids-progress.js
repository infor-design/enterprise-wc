import {
  IdsElement,
  customElement,
  scss,
  mix,
  props,
  stringUtils
} from '../ids-base/ids-element';

// @ts-ignore
import styles from './ids-progress.scss';

// Mixins
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';

// Defaults
const ID = 'ids-progress-id';
const MAX = '100';
const VALUE = '0';

/**
 * IDS Progress Component
 * @type {IdsProgress}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-progress')
@scss(styles)
class IdsProgress extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.DISABLED,
      props.LABEL,
      props.LABEL_AUDIBLE,
      props.MAX,
      props.VALUE
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const toBool = stringUtils.stringToBool;
    const audible = toBool(this.labelAudible) ? ' audible="true"' : '';
    let rootClass = toBool(this.disabled) ? ' disabled' : '';
    rootClass += toBool(this.labelAudible) ? ' label-audible' : '';
    return `
      <div class="ids-progress${rootClass}">
        <label for="${ID}" class="progress-label">
          <ids-text${audible}>${this.label}</ids-text>
        </label>
        <progress class="progress-bar" id="${ID}" max="${this.max}" value="${this.value}">${this.completed}</progress>
      </div>`;
  }

  /**
   * Update value
   * @private
   * @param {string} val the value
   * @returns {void}
   */
  updateValue(val = VALUE) {
    const bar = this.shadowRoot.querySelector('.progress-bar');
    if (bar) {
      const v = bar.getAttribute(props.VALUE);
      if (val !== null && v !== val.toString()) {
        bar.setAttribute(props.VALUE, val.toString());
        bar.innerHTML = this.completed;
        this.triggerEvent('updated', this, {
          detail: {
            elem: this,
            completed: this.completed,
            max: this.max,
            value: this.value
          }
        });
      }
    }
  }

  /**
   * Get calculated completed value
   * @returns {string} The completed value and percentage sign
   */
  get completed() {
    const partial = parseFloat(this.value);
    const total = parseFloat(this.max);
    return `${Math.round((100 * partial) / total)}%`;
  }

  /**
   * Sets to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const rootEl = this.shadowRoot.querySelector('.ids-progress');
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.DISABLED, val.toString());
      rootEl?.classList.add(props.DISABLED);
    } else {
      this.removeAttribute(props.DISABLED);
      rootEl?.classList.remove(props.DISABLED);
    }
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value) {
    if (value) {
      this.setAttribute(props.LABEL, value.toString());
    } else {
      this.removeAttribute(props.LABEL);
    }
    const labelText = this.shadowRoot.querySelector('.progress-label ids-text');
    if (labelText) {
      labelText.innerHTML = value ? value.toString() : '';
    }
  }

  get label() { return this.getAttribute(props.LABEL) || ''; }

  /**
   * Sets to label text as audible
   * @param {boolean|string} value If true will set `label-audible` attribute
   */
  set labelAudible(value) {
    const rootEl = this.shadowRoot.querySelector('.ids-progress');
    const labelText = this.shadowRoot.querySelector('.progress-label ids-text');
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.LABEL_AUDIBLE, val.toString());
      rootEl?.classList.add(props.LABEL_AUDIBLE);
      labelText?.setAttribute(props.AUDIBLE, val.toString());
    } else {
      this.removeAttribute(props.LABEL_AUDIBLE);
      rootEl?.classList.remove(props.LABEL_AUDIBLE);
      labelText?.removeAttribute(props.AUDIBLE);
    }
  }

  get labelAudible() { return this.getAttribute(props.LABEL_AUDIBLE); }

  /**
   * Set the `max` attribute of progress
   * @param {string} value of the `max` property
   */
  set max(value) {
    const bar = this.shadowRoot.querySelector('.progress-bar');
    const v = (value || MAX).toString();
    this.setAttribute(props.MAX, v);
    bar?.setAttribute(props.MAX, v);
  }

  get max() { return this.getAttribute(props.MAX) || MAX; }

  /**
   * Set the `value` attribute of progress
   * @param {string} val the value property
   */
  set value(val) {
    this.setAttribute(props.VALUE, (val || VALUE).toString());
    this.updateValue(val);
  }

  get value() { return this.getAttribute(props.VALUE) || VALUE; }
}

export default IdsProgress;

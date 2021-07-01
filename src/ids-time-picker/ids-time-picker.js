import {
  IdsElement,
  customElement,
  scss,
  mix,
  stringUtils,
  attributes,
} from '../ids-base/ids-element';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-time-picker.scss';

/**
 * IDS Time Picker Component
 * @type {IdsTimePicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-time-picker')
@scss(styles)
class IdsTimePicker extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
  }
    /**
     * Create the template for time picker contents
     * @returns {string} The template
     */
    template() {
      let html = `<div class="time-picker"><h1>Ids Time Picker</h1></div>`;
      return html;
    }

    /**
     * @returns {Array<string>} this component's observable properties
     */
    static get attributes() {
      return [];
    }

    /**
     * Sets the value attribute
     * @param {string} val string value from the value attribute
     */
    set value(val) {
      this.setAttribute('value', val.toString());
    }

    get value() {
      return this.getAttribute('value') || '0';
    }
}

export default IdsTimePicker;

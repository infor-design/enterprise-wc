import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-summary-form.scss';

/**
 * IDS Summary Form Component
 * @type {IdsSummaryForm}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-summary-form')
@scss(styles)
class IdsSummaryForm extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    console.log('constructor()');
    super();
  }

  connectedCallback() {
    console.log('connectedCallback()');
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    console.log('getting attributes()');
    return [
      attributes.DATA,
      attributes.FONT_WEIGHT,
      attributes.LABEL,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-summary-form">
        <ids-text class="label">${this.label ?? ''}</ids-text>
        <ids-text class="data" font-weight="${this.fontWeight ?? 'bold'}">${this.data ?? ''}</ids-text>
      </div>`;
  }

  set data(value) {
    console.log('setting data to: ' + value);
    this.setAttribute('data', value || '');
    this.updateData();
  }
  
  get data() {
    console.log('getting data: ' + this.getAttribute('data'));
    return this.getAttribute('data');
  }
  
  set label(value) {
    console.log('setting label to: ' + value);
    // const prop = value || 'label';
    // console.log('label prop is ' + prop);
    // this.value = prop;
    this.setAttribute('label', value || '');
    this.updateLabel();
  }

  get label() {
    console.log('getting label: ' + this.getAttribute('label'));
    return this.getAttribute('label');
  }

  set fontWeight(value) {
    console.log('font-weight is being set to ' + value);
    this.setAttribute(attributes.FONT_WEIGHT, value);
    // this.updateUI();
  }

  get fontWeight() {
    console.log('getting font-weight: ' + this.getAttribute('font-weight'));
    return this.getAttribute('font-weight');
  }

  updateLabel() {
    console.log('UI is being updated');
    this.container.querySelector('.label').innerHTML = this.label;
  }

  updateData() {
    this.container.querySelector('.data').innerHTML = this.data;
  }
}

export default IdsSummaryForm;

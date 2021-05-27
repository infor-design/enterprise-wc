import {
  IdsElement,
  customElement,
  scss,
  mix,
  props
} from '../ids-base/ids-element';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../ids-mixins';

import '../ids-color/ids-color';

// @ts-ignore
import styles from './ids-color-picker.scss';

/**
 * IDS ColorPicker
 * @type {IdsColorPicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */

 @customElement('ids-color-picker')
 @scss(styles)

 class IdsColorPicker extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
  }

  /**
  * @returns {Array<string>} this component's observable properties
  */
   static get properties() {
    return [...props.MODE, 'swatch', props.VALUE, props.VERSION];
  }

  /**
  * Create the Template for the contents
  * @returns {string} The template
  */
  template() {
   return `<div class="ids-color-picker"><slot></slot></div>`;
  }

   set value(v) {
    this.setAttribute('value', v.toString());
   }

   get value() {
    return this.getAttribute('value') || 0;
   }

   set swatch(s) {
    his.setAttribute('swatch', s.toString());
   }

   get swatch() {
    return this.getAttribute('swatch') || 'true';
   }
  
 }

export default IdsColorPicker;
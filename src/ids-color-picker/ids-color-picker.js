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
import '../ids-trigger-field/ids-trigger-field';
import '../ids-trigger-field/ids-trigger-button';

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
    const template = `
      <div class="ids-color-picker">
        <span class="color-preview">
          <input class="color-input" type="color">
        </span>
        <ids-trigger-field tabbable="false">
          <ids-input label="Color Picker""></ids-input>
          <ids-trigger-button>
            <ids-icon class="ids-dropdown" icon="dropdown" size="large"></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
        <div class="color-container">
          <slot></slot>
        </div>
      </div>`;
   return template;
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
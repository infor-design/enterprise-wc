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
import '../ids-popup/ids-popup';
import '../ids-button/ids-button';

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

class IdsColorPicker extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin) {
   constructor() {
     super();
   }

   idsColorPicker = this.shadowRoot

   colorpickerContainer = this.container;

   colorContainer = this.idsColorPicker.querySelector('.color-container')

   colorpickerInput = this.idsColorPicker.querySelector('.color-input')

   colorInputValueClass = this.label === '' ? 'color-input-value-no-label' : 'color-input-value';

   colorInputValue = this.idsColorPicker.querySelector(this.label === '' ? '.color-input-value-no-label' : '.color-input-value')

   colorPreview = this.idsColorPicker.querySelector('.color-preview')

   idsColorsArr = document.querySelectorAll('ids-color')

   connectedCallback() {
     this.value = this.value;
     this.disabled = this.disabled;
     this.swatch = this.swatch;
     this.label = this.label;
     this.handleEvents();
   }

   static get properties() {
     return [props.DISABLED, props.LABEL, props.MODE, 'swatch', props.VALUE, props.VERSION];
   }

   template() {
     const template = `
      <div class="ids-color-picker">
        <ids-trigger-field tabbable="false">
          <span class="color-preview">
            <ids-input class="color-input" type="color"></ids-input>
          </span>
          <ids-input class="${this.label === '' ? 'color-input-value-no-label' : 'color-input-value'}" label="${this.label}"></ids-input>
          <ids-trigger-button>
            <ids-icon class="ids-dropdown" icon="dropdown" size="large"></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
      </div>`;
     return template;
   }

   set value(v) {
     this.updateColorPickerValues(v);
     this.setAttribute('value', v.toString());
   }

   get value() {
     return this.getAttribute('value') || '#000000';
   }

   set disabled(d) {
     this.setAttribute('disabled', d.toString());
   }

   get disabled() {
     return this.getAttribute('disabled') || 'false';
   }

   set swatch(s) {
     this.setAttribute('swatch', s.toString());
   }

   get swatch() {
     return this.getAttribute('swatch') || 'true';
   }

   set label(l) {
     this.setAttribute('label', l.toString());
   }

   get label() {
     return this.getAttribute('label') || '';
   }

   handleEvents() {
     this.idsColorsArr.forEach((element) => {
       element.style.backgroundColor = element.getAttribute('hex');
     });

     this.onEvent('change', this.colorpickerInput, () => this.setAttribute('value', this.colorpickerInput.value));

     this.onEvent('change', this.colorInputValue, () => this.setAttribute('value', this.colorInputValue.value));
   }

   updateColorPickerValues(colorValue) {
     this.colorpickerInput.value = colorValue;
     this.colorPreview.style.backgroundColor = colorValue;
     this.colorInputValue.value = colorValue;
   }
 }

export default IdsColorPicker;

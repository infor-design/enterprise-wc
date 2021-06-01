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
import labelStyles from '../ids-input/ids-input.scss'

/**
 * IDS ColorPicker
 * @type {IdsColorPicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */

 @customElement('ids-color-picker')
 @scss(styles)
 @scss(labelStyles)

 class IdsColorPicker extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    this.handleEvents();
  }

  /**
  * @returns {Array<string>} this component's observable properties
  */
   static get properties() {
    return [props.DISABLED, props.LABEL, ...props.MODE, 'swatch', props.VALUE, props.VERSION];
  }

  /**
  * Create the Template for the contents
  * @returns {string} The template
  */
  template() {
    const template = `
      <div class="ids-color-picker">
        <ids-text font-size="12" type="h1">${this.getAttribute('label')}</ids-text>
        <div class="colorpicker">
            <div class="colorpicker-container">
                <span class="color-preview">
                    <ids-input type="color" class="color-input" value="${this.getAttribute('value')}"></ids-input>
                </span>
                <input type="text" class="color-input-value" value="${this.getAttribute('value')}">
                <!--<ids-input type="text" class="color-input-value" value="#000000"></ids-input>-->
                <span class="colorpicker-icon">
                    <ids-icon class="ids-dropdown" icon="dropdown" size="large"></ids-icon>
                </span>
            </div>
            <div class="color-container hide-color-container">
                <slot></slot>
            </div>
        </div>
      </div>
  `;
   return template;
  }

   set value(v) {
    this.updateColorPickerValues(v) 
    this.setAttribute('value', v.toString());
   }

   get value() {
    return this.getAttribute('value') || '#000000';
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

   /**
     * Retuns IdsColorpicker shadowRoot
     * @returns {HTMLCollection} shadowRoot
     */
    idsColorPicker = this.shadowRoot
    colorpickerContainer = this.container;
    colorContainer = this.idsColorPicker.querySelector('.color-container')
    colorpickerInput = this.idsColorPicker.querySelector('.color-input')
    colorInputValue = this.idsColorPicker.querySelector('.color-input-value')
    colorPreview = this.idsColorPicker.querySelector('.color-preview')
    idsColorsArr = document.querySelectorAll('ids-color')

    handleEvents() {
        // @ts-ignore
        this.idsColorsArr.forEach((element) => element.style.backgroundColor = element.getAttribute('hex'))
        this.onEvent('click', this.colorpickerContainer, (/** @type {{ target: any; }} */ event) => {
            const target = event.target
            const openColorCondition = (target.classList.contains('colorpicker-icon') || target.classList.contains('ids-dropdown'))
            if(openColorCondition){
                this.openCloseColorpicker();
            }

            if(target.hasAttribute('hex')){
                this.updateColorPickerValues(target.getAttribute('hex'));
                this.openCloseColorpicker();
            }
        });
        this.onEvent('change', this.colorpickerInput, (/** @type {any} */ change) => this.setAttribute('value', this.colorpickerInput.value));
        this.onEvent('change', this.colorInputValue, (/** @type {any} */ change) => this.setAttribute('value', this.colorInputValue.value));
    }

    openCloseColorpicker(){
      let openClose = this.colorContainer.classList.contains('hide-color-container');
      this.colorContainer.classList.remove(openClose ? 'hide-color-container' : 'show-color-container');
      this.colorContainer.classList.add(openClose ? 'show-color-container' : 'hide-color-container');
  }

  updateColorPickerValues(colorValue) {
    this.colorpickerInput.value = colorValue;
    this.colorPreview.style.backgroundColor = colorValue;
    this.colorInputValue.value = colorValue;
  }
 }

export default IdsColorPicker;
import {
    IdsElement,
    customElement,
    scss,
    mix,
  } from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import '../ids-color/ids-color';

// @ts-ignore
import styles from './ids-colorpicker.scss';

/**
 * IDS Colorpick
 * @type {IdsColorpicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */

 @customElement('ids-colorpicker')
 @scss(styles)

 class IdsColorpicker extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
     constructor(){
         super()
     }

     connectedCallback() {
         this.colorPicker()
     }

     /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        return `
        <div id="ids-colorpicker">
            <div class="colorpicker">
                <div class="colorpicker-container">
                    <span class="color-preview">
                        <input class="color-input" type="color">
                    </span>
                    <input type="text" class="color-input-value" value="#000000">
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
    }

    /**
     * Retuns IdsColorpicker shadowRoot
     * @returns {HTMLCollection} shadowRoot
     */
    idsColorPicker = this.shadowRoot
    colorpickerContainer = this.idsColorPicker.querySelector('#ids-colorpicker')
    colorContainer = this.idsColorPicker.querySelector('.color-container')
    colorpickerInput = this.idsColorPicker.querySelector('.color-input')
    colorInputValue = this.idsColorPicker.querySelector('.color-input-value')
    colorPreview = this.idsColorPicker.querySelector('.color-preview')
    idsColorsArr = document.querySelectorAll('ids-color')

    colorPicker() {
        // @ts-ignore
        this.idsColorsArr.forEach((element) => element.style.backgroundColor = element.getAttribute('hex'))
        this.onEvent('click', this.colorpickerContainer, (/** @type {{ target: any; }} */ event) => {
            const target = event.target
            const openColorCondition = (target.classList.contains('colorpicker-icon') || target.classList.contains('ids-dropdown'))
            if(openColorCondition){
                this.openCloseColorpicker();
            }

            if(target.hasAttribute('hex')){
                this.colorInputValue.value = target.getAttribute('hex')
                this.colorPreview.style.backgroundColor = target.getAttribute('hex')
                this.openCloseColorpicker();
            }
        })
        this.onEvent('change', this.colorpickerInput, (/** @type {any} */ change) => {
            this.colorInputValue.value = this.colorpickerInput.value
            this.colorPreview.style.backgroundColor = this.colorpickerInput.value
        })
        this.onEvent('change', this.colorInputValue, (/** @type {any} */ change) => {
            this.colorpickerInput.value = this.colorInputValue.value;
            this.colorPreview.style.backgroundColor = this.colorpickerInput.value;
        })
    }

    openCloseColorpicker(){
        let openClose = this.colorContainer.classList.contains('hide-color-container');
        this.colorContainer.classList.remove(openClose ? 'hide-color-container' : 'show-color-container');
        this.colorContainer.classList.add(openClose ? 'show-color-container' : 'hide-color-container');
    }
 }

 export default IdsColorpicker;
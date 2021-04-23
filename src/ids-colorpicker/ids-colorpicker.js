import {
    IdsElement,
    customElement,
    scss,
    mix,
  } from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import '../ids-color/ids-color'

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

    colorPicker() {
        const colorpickerContainer = this.idsColorPicker.querySelector('#ids-colorpicker')
        const colorContainer = this.idsColorPicker.querySelector('.color-container')
        const colorpickerInput = this.idsColorPicker.querySelector('.color-input')
        const colorInputValue = this.idsColorPicker.querySelector('.color-input-value')
        const colorPreview = this.idsColorPicker.querySelector('.color-preview')
        const idsColorsArr = document.querySelectorAll('ids-color')
        console.log(idsColorsArr)

        // @ts-ignore
        idsColorsArr.forEach((element) => element.style.backgroundColor = element.getAttribute('hex'))
        
        this.onEvent('click', colorpickerContainer, (/** @type {{ target: any; }} */ event) => {
            const target = event.target
            const openColorCondition = (target.classList.contains('colorpicker-icon') || target.classList.contains('ids-dropdown'))
            if(openColorCondition){
                let openClose = colorContainer.classList.contains('hide-color-container')
                colorContainer.classList.remove(openClose ? 'hide-color-container' : 'show-color-container')
                colorContainer.classList.add(openClose ? 'show-color-container' : 'hide-color-container')
            }
        })

        this.onEvent('change', colorpickerInput, (/** @type {any} */ change) => {
            colorInputValue.value = colorpickerInput.value
            colorPreview.style.backgroundColor = colorpickerInput.value
        })

        this.onEvent('change', colorInputValue, (/** @type {any} */ change) => {
            colorpickerInput.value = colorInputValue.value
            colorPreview.style.backgroundColor = colorpickerInput.value
        })
    }

 }

 export default IdsColorpicker;
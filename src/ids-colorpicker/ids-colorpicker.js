import {
    IdsElement,
    customElement,
    scss,
    mix,
  } from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';

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
         this.showHideColorPanel()
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
                            <ids-icon icon="dropdown" size="large"></ids-icon>
                        </span>
                    </div>
                    <div class="color-container hide-color-container">
                        <slot></slot>
                        <div class="sample"></div>
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

    showHideColorPanel() {
        const colorpickerIcon = this.idsColorPicker.querySelector('.colorpicker-icon')
        const colorContainer = this.idsColorPicker.querySelector('.color-container')
        const colorpickerInput = this.idsColorPicker.querySelector('.color-input')
        const colorInputValue = this.idsColorPicker.querySelector('.color-input-value')
        const colorPreview = this.idsColorPicker.querySelector('.color-preview')
        this.onEvent('click', colorpickerIcon, (/** @type {any} */ event) => {
            colorContainer.classList.remove('hide-color-container')
            colorContainer.classList.add('show-color-container')
            console.log(colorpickerInput.value)
        })

        this.onEvent('change', colorpickerInput, (change) => {
            console.log(change)
            console.log(colorpickerInput.value)
            colorInputValue.value = colorpickerInput.value
            colorPreview.style.backgroundColor = colorpickerInput.value
        })
    }
 }

 export default IdsColorpicker;
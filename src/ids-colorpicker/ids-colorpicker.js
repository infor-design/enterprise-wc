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
                        <span class="color-preview"></span>
                        <input type="text" value="#000000">
                        <span class="colorpicker-icon">
                            <ids-icon icon="dropdown" size="large"></ids-icon>
                        </span>
                    </div>
                    <div class="color-container hide-color-container">
                        Color Panel
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
        this.onEvent('click', colorpickerIcon, (/** @type {any} */ event) => {
            colorContainer.classList.remove('hide-color-container')
            colorContainer.classList.add('show-color-container')
            console.log(colorContainer)
        })
    }
 }

 export default IdsColorpicker;
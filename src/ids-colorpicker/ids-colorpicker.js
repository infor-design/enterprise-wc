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
 * IDS Tag Component
 * @type {IdsColorpicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @part background-color - the tag background color
 * @part color - the text color
 */

 @customElement('ids-colorpicker')
 @scss(styles)

 class IdsColorpicker extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
     constructor(){
         super()
     }

     connectedCallback() {
         console.log('Colorpicker is working.')
     }

     /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        return '<div>Hello Colorpicker...</div>';
    }
 }

 export default IdsColorpicker;
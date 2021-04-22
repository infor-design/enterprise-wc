import {
    IdsElement,
    customElement,
    scss,
    mix,
  } from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';

// @ts-ignore
import styles from './ids-color.scss';

/**
 * IDS Color
 * @type {IdsColor}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */

 @customElement('ids-color')
 @scss(styles)

 class IdsColor extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
     constructor(){
         super()
     }

     connectedCallback() {
     }

     /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        return `<div>ids color</div>`;
    }
 }

 export default IdsColor;
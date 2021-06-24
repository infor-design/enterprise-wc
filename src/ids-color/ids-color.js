import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base/ids-element';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../ids-mixins';

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
   constructor() {
     super();
   }

   connectedCallback() {
   }

   /**
   * @returns {Array<string>} this component's observable attributes
   */
   static get attributes() {
     return [...attributes.MODE, 'hex', attributes.VERSION];
   }

   /**
   * Create the Template for the contents
   * @returns {string} The template
   */
   template() {
     return `
      <div class="ids-color" tabindex="0">
        <ids-icon class="color-check" icon="check" size="small"></ids-icon>
      </div>`;
   }

   set hex(h) {
     this.setAttribute('hex', h.toString());
   }

   get hex() {
     return this.getAttribute('hex') || '#000000';
   }
 }

export default IdsColor;

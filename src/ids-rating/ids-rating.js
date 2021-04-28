import {
  IdsElement,
  customElement,
  scss,
  mix,
  prop
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';

// @ts-ignore
import styles from './ids-rating.scss';

/**
 * IDS Rating Component
 * @type {IdsRating}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */

 @customElement('ids-rating')
 @scss(styles)

class IdsRating extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
   constructor() {
     super();
   }

    connectedCallback() {
      this.addRemoveAttrName()
    }

    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
      return `<div id="rating">
        <ids-icon class="star-outlined" icon="star-outlined" size="large"></ids-icon>
        <ids-icon class="star-outlined" icon="star-outlined" size="large"></ids-icon>
        <ids-icon class="star-outlined" icon="star-outlined" size="large"></ids-icon>
        <ids-icon class="star-outlined" icon="star-outlined" size="large"></ids-icon>
        <ids-icon class="star-outlined" icon="star-outlined" size="large"></ids-icon>
      </div>`;
    }

      /**
      * @returns {Array<string>} this component's observable properties
      */
      static get properties() {
        return [
          'value',
          'stars',
          'readonly',
          'clickable',
          'compact',
          'color'
        ];
      }

      addRemoveAttrName() {
        const ratingContainer = this.shadowRoot.querySelector('#rating');
        const ratingArr = [...ratingContainer.children];
        this.onEvent('click', ratingContainer, (/** @type {{ target: any; }} */ e) => {
          const activeElements = ratingArr.filter((item) => item.classList.contains('active'));
          console.log(activeElements)
          let attrName = 'star-filled';
          let action = 'add';
          for (const ratingOption of ratingArr) {
            ratingOption.classList[action]('active');
            ratingOption.setAttribute('icon', attrName);
            if(ratingOption === e.target) {
              action = 'remove';
              attrName = 'star-outlined';
            }
            if(activeElements.length === 1) {
              activeElements[0].classList.remove('active');
              activeElements[0].setAttribute('icon', attrName)
            }
          }
        });
      }
 }

export default IdsRating;

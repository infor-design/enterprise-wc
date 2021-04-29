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
      this.addRemoveAttrName();
    }

    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
      const stars = this.hasAttribute('stars') ? this.getAttribute('stars') : this.setAttribute('stars', '5');
      const size = this.hasAttribute('size') ? this.getAttribute('size') : this.setAttribute('size', 'large');
      let html = '<div id="rating">';
      for(let i = 0; i < stars; i++) {
       html += `<ids-icon class="star" aria-label="${i} Star" role-"button" icon="star-outlined" tabindex="0" size="${size}"></ids-icon>`;
      }
      html += '</div>';
      return html;
    }

    /**
    * @returns {Array<string>} this component's observable properties
    */
    static get properties() {
      return ['value', 'stars', 'readonly', 'clickable', 'compact', 'color', 'size'];
    }

    set value(val) {
      if(val) {
        this.setAttribute('value', val.toString());
      }
    }

    get value() {
      return this.getAttribute('value');
      
    }

    set stars(num) {
      if(num) {
        this.setAttribute('stars', num.toString());
      }
    }

    get stars() {
      return this.getAttribute('stars');
    }

    set readonly(ro) {
      if(ro){
        this.setAttribute('readonly', ro.toString());
      }
    }

    get readonly() {
      return this.getAttribute('readonly');
    }

    set clickable(cl) {
      if(c) {
        this.setAttribute('clickable', cl.toString());
      }
    }

    get clickable() {
      return this.getAttribute('clickable');
    }

    set compact(com) {
      if(com) {
        this.setAttribute('compact', com.toString());
      }
    }

    get compact() {
      return this.getAttribute('compact');
    }

    set color(col) {
      if(col) {
        this.setAttribute('color', col.toString());
      }
    }

    get color() {
      return this.getAttribute('color');
    }

    set size(s) {
      if(s) {
        this.setAttribute('size', s.toString());
      }
    }

    get size() {
      return this.getAttribute('size');
    }

    addRemoveAttrName() {
      const ratingContainer = this.shadowRoot.querySelector('#rating');
      const ratingArr = [...ratingContainer.children];
      ratingArr.forEach((e, index) => e.classList.add(`star-${index}`));
      this.onEvent('click', ratingContainer, (/** @type {{ target: any; }} */ e) => {
        const activeElements = ratingArr.filter((item) => item.classList.contains('active'));
        let attrName = 'star-filled';
        let action = 'add';
        for (const ratingOption of ratingArr) {
          ratingOption.classList[action]('active');
          ratingOption.setAttribute('icon', attrName);
          if(ratingOption === e.target) {
            action = 'remove';
            attrName = 'star-outlined';
          }
          if(activeElements.length === 1 && e.target.classList.contains('star-0')) {
            activeElements[0].classList.remove('active');
            activeElements[0].setAttribute('icon', 'star-outlined');
          }
        }
        this.updateValue(ratingArr);
      });
    }

    updateValue(arr) {
      const val = [...arr];
      const value = val.filter((el) => el.classList.contains('active'));
      this.setAttribute('value', value.length);
    }
 }

export default IdsRating;

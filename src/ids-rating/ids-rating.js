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
      if(this.getAttribute('readonly') === 'false') {
        this.addRemoveAttrName();
      } else {
        this.updateHalfStar(this.ratingArr);
      }
    }

    ratingContainer = this.shadowRoot.querySelector('#rating');
    ratingArr = [...this.ratingContainer.children];

    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
      const stars = this.hasAttribute('stars') ? this.getAttribute('stars') : this.setAttribute('stars', '5');
      const size = this.hasAttribute('size') ? this.getAttribute('size') : this.setAttribute('size', 'large');
      const readonly = this.hasAttribute('readonly') ? this.getAttribute('readonly') : this.setAttribute('readonly', 'false');
      let html = '<div id="rating">';
      for(let i = 0; i < stars; i++) {
       html += `<ids-icon class="star star-${i}" aria-label="${i} Star" role-"button" icon="star-outlined" tabindex="0" size="${size}"></ids-icon>`;
      }
      html += '</div>';
      return html;
    }

    /**
    * @returns {Array<string>} this component's observable properties
    */
    static get properties() {
      return ['value', 'stars', 'readonly', 'clickable', 'compact', 'size'];
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

    set size(s) {
      if(s) {
        this.ratingArr.forEach((element) => element.setAttribute('size', s.toString()));
        this.setAttribute('size', s.toString());
      }
    }

    get size() {
      return this.getAttribute('size')
    }

    addRemoveAttrName() {
      this.onEvent('click', this.ratingContainer, (/** @type {{ target: any; }} */ e) => {
        const activeElements = this.ratingArr.filter((item) => item.classList.contains('active'));
        let attrName = 'star-filled';
        let action = 'add';
        for (const ratingOption of this.ratingArr) {
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
        this.updateValue(this.ratingArr);
      });
    }
    updateValue(arr) {
      const val = [...arr];
      const value = val.filter((el) => el.classList.contains('active'));
      this.setAttribute('value', value.length);
    }

    updateHalfStar(arr) {
      const value = this.hasAttribute('value') ? this.getAttribute('value') : this.setAttribute('value', '0');
      const roundValue = Math.round(value)
      for(let i = 0; i < roundValue; i++) {
        console.log(i)
        arr[i].classList.add('active');
        arr[i].setAttribute('icon', 'star-filled')
      }
      if(value < roundValue) {
        const activeArr = arr.filter((act) => act.classList.contains('active'));
        const lastItem = activeArr[activeArr.length - 1];
        lastItem.classList.add('is-half');
        lastItem.setAttribute('icon', 'star-half')
      }
    }
 }

export default IdsRating;

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

    ratingsConfig = {
      ratingsAttr: {
        star: this.getAttribute('stars'),
        active: this.getAttribute('active'),
        color: this.getAttribute('color'),
        size: this.getAttribute('size'),
        value: this.getAttribute('value'),
        readonly: this.getAttribute('readonly'),
        clickable: this.getAttribute('clickable'),
        compact: this.getAttribute('compact')
      }
    }

    connectedCallback() {
      this.buildDOM();
      console.log(this.ratingsConfig)
    }

    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
      return `<div id="rating"></div>`;
    }

    /**
    * @returns {Array<string>} this component's observable properties
    */
    static get properties() {
      return [
        'value',
        'stars',
        'readonly'
      ];
    }

    /**
    * @param {any} v
    */
    set value(v) {
      if(v) {
        this.setAttribute('value', v.toString())
      }
    }

    get value() {
      return this.getAttribute('value')
    }

    /**
    * @param {any} v
    */
    set stars(v) {
      if(v) {
        this.setAttribute('stars', v.toString());
      }
    }

    get stars() {
      return this.getAttribute('stars')
    }

    /**
    * @param {any} v
    */
    set readonly(v) {
      if(v) {
        this.setAttribute('readonly', v.toString());
      }
    }

    get readonly() {
      return this.getAttribute('readonly')
    }

    buildDOM() {
      const ratingsContainer = this.shadowRoot.querySelector('#rating');
      const numStars = this.getAttribute('stars') === null ? 5 : this.getAttribute('stars');
      this.ratingBuilder(ratingsContainer, numStars);
      if (this.getAttribute('readonly') === 'true') {
        this.updateDecimalNum(ratingsContainer.children);
      } else {
        this.addRemoveClass();
      }
      this.udpateValue()
    }

    /**
    * @param {HTMLDivElement} element
    * @param {number} index
    */
    buildRatingStar(element, index) {
      const ratingItem = window.document.createElement('div');
      ratingItem.classList.add('rating-item');
      ratingItem.setAttribute('item-index', `item-${index}`);
      const ratingOuter = window.document.createElement('div');
      ratingOuter.classList.add('rating-outer');
      const starOutlined = `<ids-icon class="star-outlined" icon="star-outlined" size="large"></ids-icon>`;
      ratingOuter.innerHTML = starOutlined;
      ratingItem.appendChild(ratingOuter);
      const div = window.document.createElement('div');
      div.classList.add('rating-inner');
      const starFilled = `<ids-icon class="star-filled inner-${index}" icon="star-filled" size="large"></ids-icon>`;
      const starHalf = `<ids-icon class="star-half inner-${index}" icon="star-half" size="large"></ids-icon>`;
      div.innerHTML = starFilled;
      div.innerHTML += starHalf;
      ratingItem.appendChild(div);
      element.appendChild(ratingItem);
    }

    /**
    * @param {HTMLDivElement} el
    */
    ratingBuilder(el, stars) {
      const amount = stars;
      for (let i = 0; i < amount; i++) {
        this.buildRatingStar(el, i);
      }
    }

    addRemoveClass() {
      const ratingContainer = this.shadowRoot.querySelector('#rating');
      const ratingArr = [...ratingContainer.children];
      this.onEvent('click', ratingContainer, (/** @type {{ target: any; }} */ e) => {
        const activeElements = ratingArr.filter((item) => item.classList.contains('active'));
        let action = 'add';
        for (const ratingOption of ratingArr) {
          const outerCondition = ratingOption.children[0].children[0] === e.target;
          const innerCondition = ratingOption.children[1].children[0] === e.target;
          const clickCondition = (outerCondition || innerCondition);
          ratingOption.classList[action]('active');
          if (clickCondition) {
            action = 'remove';
          }
        }
        if (activeElements.length === 1 && e.target.classList.contains('inner-0')) {
          activeElements[0].classList.remove('active');
          this.setAttribute('value', 0);
        }
        this.udpateValue();
      });
    }

    /**
    * @param {Array} arr
    */
    updateWholeNum(arr) {
      const activeArr = [...arr].filter((el) => el.classList.contains('active'));
      this.setAttribute('value', activeArr.length);
    }

    /**
    * @param {Array} arr
    */
    updateDecimalNum(arr) {
      const ratingChildren = [...arr];
      const value = this.ratingsConfig.ratingsAttr.value;
      const roundValue = Math.round(value);
      for (let i = 0; i < roundValue; i++) {
        ratingChildren[i].classList.add('active');
      }
      if (value < roundValue) {
        const activeArr = ratingChildren.filter((act) => act.classList.contains('active'));
        const lastItem = activeArr[activeArr.length - 1];
        lastItem.classList.add('is-half');
      }
    }

    udpateValue() {
      const ratingValue = Number(this.getAttribute('value'));
      const isWhole = Number.isInteger(ratingValue);
      const ratingChildren = this.shadowRoot.querySelector('#rating').childNodes;
      if (isWhole) {
        this.updateWholeNum(ratingChildren);
      }
    }
 }

export default IdsRating;

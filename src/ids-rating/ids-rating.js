import {
  IdsElement,
  customElement,
  scss,
  mix
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
    }

    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
      return `<div id="rating"></div>`;
    }

    buildDOM() {
      const ratingsContainer = this.shadowRoot.querySelector('#rating');
      this.ratingBuilder(ratingsContainer);
      this.addRemoveClass();
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
      const starOutlined = `<ids-icon icon="star-outlined" size="large"></ids-icon>`;
      ratingOuter.innerHTML = starOutlined;
      ratingItem.appendChild(ratingOuter);
      const div = window.document.createElement('div');
      div.classList.add('rating-inner');
      const starFilled = `<ids-icon class="inner-${index}" icon="star-filled" size="large"></ids-icon>`;
      const starHalf = `<ids-icon class="inner-${index}" icon="star-half" size="large"></ids-icon>`;
      div.innerHTML = starFilled;
      div.innerHTML += starHalf;
      ratingItem.appendChild(div);
      element.appendChild(ratingItem);
    }

    /**
    * @param {HTMLDivElement} el
    */
    ratingBuilder(el) {
      const amount = this.ratingsConfig.ratingsAttr.star;
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
        for (const section of ratingArr) {
          const outerCondition = section.children[0].children[0] === e.target;
          const innerCondition = section.children[1].children[0] === e.target;
          const clickCondition = (outerCondition || innerCondition);
          section.classList[action]('active');
          this.udpateValue();
          if (clickCondition) {
            action = 'remove';
          }
        }
        if (activeElements.length === 1 && e.target.classList.contains('inner-0')) {
          activeElements[0].classList.remove('active');
          this.setAttribute('value', 0);
        }
      });
    }

    /**
    * @param {Array} arr
    */
    updateWholeNum(arr) {
      const activeArr = [...arr].filter((el) => el.classList.contains('active'));
      this.ratingsConfig.ratingsAttr.value = this.setAttribute('value', activeArr.length);
    }

    /**
    * @param {Array} arr
    */
    updateDecimalNum(arr) {
      return arr;
    }

    udpateValue() {
      const ratingValue = Number(this.getAttribute('value'));
      const isWhole = Number.isInteger(ratingValue);
      const ratingChildren = this.shadowRoot.querySelector('#rating').childNodes;
      if (isWhole) {
        this.updateWholeNum(ratingChildren);
      } else {
        this.updateDecimalNum(ratingChildren);
      }
    }
 }

export default IdsRating;

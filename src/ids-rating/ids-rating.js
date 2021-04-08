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
      const section = window.document.createElement('section');
      section.classList.add('rating-outer');
      section.setAttribute('item-index', `item-${index}`);
      const div = window.document.createElement('div');
      div.classList.add('rating-inner');
      div.classList.add(`inner-${index}`);
      section.appendChild(div);
      element.appendChild(section);
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
        const activeElements = ratingArr.filter((e) => e.classList.contains('active'));
        let action = 'add';
        for (const section of ratingArr) {
          section.classList[action]('active');
          this.udpateValue();
          if (section === e.target || section.children[0] === e.target) {
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

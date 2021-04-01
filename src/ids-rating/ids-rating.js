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

 class IdsRating extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin){
    constructor() {
        super();
      }

      // TEMP Config
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
      this.addRemoveClass();
    }

    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
      return `<div id="rating"></div>`;
    }

    buildDOM() {
      const ratingsContainer = this.shadowRoot.querySelector('#rating')
      this.ratingBuilder(ratingsContainer);
    }

    /**
    * @param {HTMLDivElement} element
    * @param {number} index
    */
    buildRatingStar(element, index){
      const section = window.document.createElement('section');
      section.classList.add('rating-item');
      section.setAttribute('item-index', `item-${index}`);
      element.appendChild(section);
    }

    /**
    * @param {HTMLDivElement} el
    */
    ratingBuilder(el){
      const amount = this.ratingsConfig.ratingsAttr.star;
      for(let i=0; i<amount; i++){
          this.buildRatingStar(el, i);
      }
    }

    addRemoveClass(){
      const ratingContainer = this.shadowRoot.querySelector('#rating');
      this.onEvent('click', ratingContainer, (/** @type {{ target: any; }} */ e) => {
        let action = 'add';
        for (const section of ratingContainer.children) {
            section.classList[action]('active');
            this.udpateValue();
            if (section === e.target) {
                action = 'remove';
            }
        }
      })
    }

    udpateValue(){
      const ratingChildren = this.shadowRoot.querySelector('#rating').childNodes;
      const activeArr = [...ratingChildren].filter( el => el.classList.contains('active'));
      this.ratingsConfig.ratingsAttr.value = this.setAttribute('value', activeArr.length);
    }
 }

 export default IdsRating
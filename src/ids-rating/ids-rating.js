import {
    IdsElement,
    customElement,
    scss
  } from '../ids-base/ids-element';

// @ts-ignore
import styles from './ids.rating.scss';

/**
 * IDS Tag Component
 * @type {IdsRating}
 * @inherits IdsElement
 */

 @customElement('ids-rating')
 @scss(styles)

 class IdsRating extends IdsElement{
     constructor(){
         super()
     }

     ratingsConfig = {
        shadow: this.attachShadow({mode: 'open'}),
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

    connectedCallback(){
        this.buildStyles();
        this.buildDOM();
        this.addRemoveClass();
    }

    buildStyles(){
        const styles = `<style>
                            .ids-rating-container{
                                width: 100%;
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                margin: 0;
                                padding: 0;
                            }
                            #rating { font-size: 0; display: flex; flex-direction: row; align-items: center}
                            #rating section { font-size: ${this.ratingsConfig.ratingsAttr.size};}
                            #rating section::before { content: "☆"; color: ${this.ratingsConfig.ratingsAttr.color};}
                            #rating section:hover::before { content: "★"; color: ${this.ratingsConfig.ratingsAttr.active};}
                            #rating section.active::before {content: "★"; color: ${this.ratingsConfig.ratingsAttr.active};}
                            #rating section:hover { cursor: pointer; }
                        </style>`;
        // this.shadowRoot.innerHTML = styles
    }

    buildDOM(){
        const ratingsContainer = window.document.createElement('div');
        ratingsContainer.id = 'rating';
        this.ratingBuilder(ratingsContainer);
        //this.shadowRoot.append(ratingsContainer);
    }

    buildRatingStar(element){
        const section = window.document.createElement('section')
        element.appendChild(section);
    }

    ratingBuilder(el){
        const amount = 5 //this.ratingsConfig.ratingsAttr.star
        for(let i=0; i<amount; i++){
            this.buildRatingStar(el);
        }
    }

    addRemoveClass(){
        // const ratingContainer = this.shadowRoot.querySelector('#rating')
        // ratingContainer.addEventListener('click', e => {
        //     let action = 'add';
        //     for (const span of ratingContainer.children) {
        //         span.classList[action]('active');
        //         if (span === e.target) {
        //             action = 'remove'
        //         }
        //     }
        // })
    }
 }

 export default IdsRating
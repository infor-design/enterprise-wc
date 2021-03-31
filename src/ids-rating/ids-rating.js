import {
    IdsElement,
    customElement,
    scss,
    mix,
    props
  } from '../ids-base/ids-element';

  import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';

// @ts-ignore
import styles from './ids.rating.scss';

/**
 * IDS Tag Component
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
        console.log(props)
      }
 }

 export default IdsRating
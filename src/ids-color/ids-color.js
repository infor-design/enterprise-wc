import {
  IdsElement,
  customElement,
  scss,
  mix,
  props
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
    this.handleEvents();
  }

  /**
  * @returns {Array<string>} this component's observable properties
  */
   static get properties() {
    return [...props.MODE, 'hex', props.VERSION];
  }

  /**
  * Create the Template for the contents
  * @returns {string} The template
  */
  template() {
    return `<div class="ids-color">Ids Color!</div>`;
  }

  set hex(h) {
    this.setAttribute('hex', h.toString());
  }

  get hex() {
    return getAttribute('hex') || '#000000';
  }

  handleEvents() {

  }

  colorPicker
}

export default IdsColor;
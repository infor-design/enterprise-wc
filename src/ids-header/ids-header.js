import {
  IdsElement,
  customElement,
  scss,
  mix,
  stringUtils,
  props
} from '../ids-base/ids-element';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-header.scss';
import '../ids-input/ids-input';
import '../ids-toolbar/ids-toolbar';
import '../ids-button/ids-button';

/**
 * IDS Rating Component
 * @type {IdsHeader}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
 @customElement('ids-header')
 @scss(styles)

 class IdsHeader extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log('Ids Header')
  }

  static get properties() {
    return [props.MODE, props.VERSION, props.COLOR];
  }

  /**
  * Create the template for the rating contents
  * @returns {string} The template
  */
  template() {
    return `
    <div class="ids-header">
      <slot></slot>
    </div>`;
  }

  set color(c) {
    this.setAttribute('color', c.toString());
  }

  get color() {
    return this.getAttribute('color') || '#333333';
  }
 }

 export default IdsHeader;

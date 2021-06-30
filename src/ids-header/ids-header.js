import {
  IdsElement,
  customElement,
  scss,
  mix,
  stringUtils,
  attributes
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
import '../ids-text/ids-text';

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
  }

  static get attributes() {
    return [attributes.MODE, attributes.VERSION, attributes.COLOR];
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

  /**
   * Sets the color attribute
   * @param c 
   */
  set color(c) {
    this.container.style.backgroundColor = c.toString();
    this.setAttribute('color', c.toString());
  }

  get color() {
    return this.getAttribute('color') || '#0072ed';
  }
 }

 export default IdsHeader;

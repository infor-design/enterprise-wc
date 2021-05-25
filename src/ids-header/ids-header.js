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

  /**
  * Create the template for the rating contents
  * @returns {string} The template
  */
  template() {
    return `<div><slot></slot></div>`;
  }
 }

 export default IdsHeader;

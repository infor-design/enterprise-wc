import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

import styles from './ids-search-field.scss';

/** 
 * IDS Search Field Component
 * @type {IdsSearchField}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
*/

@customElement('ids-search-field')
@scss(styles)
class IdsSearchField extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    this.#attachEventListeners();
    super.connectedCallback();
  }
}
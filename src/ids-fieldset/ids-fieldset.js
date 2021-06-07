import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-fieldset.scss';

/**
 * IDS Fieldset Component
 * @type {IdsFieldset}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @part fieldset - the fieldset element
 */
@customElement('ids-fieldset')
@scss(styles)
class IdsFieldset extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<fieldset class="ids-fieldset"><slot></slot></fieldset>`;
  }
}

export default IdsFieldset;

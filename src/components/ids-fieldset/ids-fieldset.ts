import { customElement, scss } from '../../core/ids-decorators';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-fieldset.scss';

const Base = IdsEventsMixin(
  IdsElement
);

/**
 * IDS Fieldset Component
 * @type {IdsFieldset}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part fieldset - the fieldset element
 */
@customElement('ids-fieldset')
@scss(styles)
export default class IdsFieldset extends Base {
  constructor() {
    super();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<fieldset class="ids-fieldset" part="fieldset"><slot></slot></fieldset>`;
  }
}

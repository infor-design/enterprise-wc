import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

// Import Utils
import { IdsStringUtils as stringUtils } from '../../utils';

// Supporting components
import IdsIcon from '../ids-icon';
import IdsText from '../ids-text';

// Import Mixins
import {
  IdsThemeMixin,
  IdsLocaleMixin
} from '../../mixins';

// Import Styles
import styles from './ids-week-view.scss';

/**
 * IDS Week View Component
 * @type {IdsWeekView}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-week-view')
@scss(styles)
class IdsWeekView extends mix(IdsElement).with(IdsLocaleMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return '<div>Week View</div>';
  }
}

export default IdsWeekView;

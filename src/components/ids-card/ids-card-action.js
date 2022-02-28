import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-card-action-base';
import styles from './ids-card-action.scss';

/**
 * IDS Card Action Component
 * @type {IdsCardAction}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 */
@customElement('ids-card-action')
@scss(styles)
export default class IdsCardAction extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template() {
    return `<div><slot></slot></div>`;
  }
}

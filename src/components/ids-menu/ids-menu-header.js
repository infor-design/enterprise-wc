import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-menu-base';
import styles from './ids-menu-header.scss';

/**
 * IDS Menu Header Component
 * @type {IdsMenuHeader}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part header - the menu header element
 */
@customElement('ids-menu-header')
@scss(styles)
export default class IdsMenuHeader extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
  }

  static get attributes() {
    return [attributes.MODE, attributes.VERSION];
  }

  template() {
    return `<div class="ids-menu-header" part="header"><slot></slot></div>`;
  }
}

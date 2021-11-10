import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsDataSource from '../../core/ids-data-source';
import Base from './ids-menu-base';
import styles from './ids-separator.scss';

/**
 * IDS Separator Component
 * @type {IdsSeparator}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part separator - the menu separator element
 */
@customElement('ids-separator')
@scss(styles)
export default class IdsSeparator extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
  }

  static get attributes() {
    return [attributes.MODE, attributes.VERSION];
  }

  template() {
    let tagName = 'div';
    if (this.parentElement?.tagName === 'IDS-MENU-GROUP') {
      tagName = 'li';
    }
    return `<${tagName} part="separator" class="ids-separator"></${tagName}>`;
  }
}

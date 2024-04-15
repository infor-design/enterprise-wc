import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import styles from './ids-app-menu-container.scss';

/**
 * IDS App Menu Container
 * @type {IdsAppMenuContainer}
 * @inherits IdsElement
 */
@customElement('ids-app-menu-container')
@scss(styles)
export default class IdsAppMenuContainer extends IdsElement {
  constructor() {
    super();
  }

  template(): string {
    return `<slot></slot>`;
  }
}

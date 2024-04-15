import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import styles from './ids-scroll-container.scss';

/**
 * IDS Scroll Container
 * @type {IdsScrollContainer}
 * @inherits IdsElement
 */
@customElement('ids-scroll-container')
@scss(styles)
export default class IdsScrollContainer extends IdsElement {
  constructor() {
    super();
  }

  template(): string {
    return `<slot></slot>`;
  }
}

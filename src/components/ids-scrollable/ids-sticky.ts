import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';

import styles from './ids-sticky.scss';

/**
 * IDS IdsSticky Component
 * @type {IdsSticky}
 * @inherits IdsElement
 */
@customElement('ids-sticky')
@scss(styles)
export default class IdsSticky extends IdsElement {
  constructor() {
    super();
  }

  static get attributes(): any {
    return [
      ...super.attributes
    ];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  template(): string {
    return `<slot></slot>`;
  }
}

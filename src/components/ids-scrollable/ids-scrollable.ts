import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';

import styles from './ids-scrollable.scss';

/**
 * IDS Scrollable Component
 * @type {IdsScrollable}
 * @inherits IdsElement
 */
@customElement('ids-scrollable')
@scss(styles)
export default class IdsScrollable extends IdsElement {
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

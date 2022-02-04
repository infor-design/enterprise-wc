import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import Base from './ids-swappable-item-base';
import styles from './ids-swappable-item.scss';

/**
 * IDS SwapList Component
 * @type {IdsSwappableItem}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-swappable-item')
@scss(styles)
export default class IdsSwappableItem extends Base {
  constructor() {
    super();

    this.addEventListener('dragstart', this.#dragStart.bind(this));
    this.addEventListener('dragend', this.#dragEnd.bind(this));
    this.addEventListener('drop', this.#dragEnd.bind(this));
    this.addEventListener('dragover', this.#dragOver.bind(this));
    this.addEventListener('dragleave', this.#dragLeave.bind(this));
  }

  connectedCallback() {
    this.setAttribute('draggable', 'true');
  }

  static get attributes() {
    return [
      'over',
      'dragging'
    ];
  }

  template() {
    return `<slot></slot>`;
  }

  #dragStart(event) {
    event.dataTransfer.setData('text/html', 'test');
    this.setAttribute('dragging', '');
  }

  #dragEnd() {
    this.removeAttribute('dragging');
    this.removeAttribute('over');
  }

  #dragOver() {
    if (this.hasAttribute('dragging')) {
      this.removeAttribute('over');
    } else {
      this.setAttribute('over', '');
    }
  }

  #dragLeave() {
    this.removeAttribute('over');
  }
}

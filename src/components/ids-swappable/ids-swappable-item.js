import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import Base from './ids-swappable-item-base';
import styles from './ids-swappable-item.scss';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

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
    this.setAttribute('draggable', 'false');
    this.onEvent('click', this, this.#toggleSelected);
  }

  static get attributes() {
    return [
      attributes.DRAGGING,
      attributes.OVER,
      attributes.SELECTED
    ];
  }

  template() {
    return `<slot></slot>`;
  }

  #dragStart() {
    this.setAttribute(attributes.DRAGGING, '');
  }

  #dragEnd() {
    this.removeAttribute(attributes.DRAGGING);
    this.removeAttribute(attributes.OVER);
    this.removeAttribute(attributes.SELECTED);
  }

  #dragOver() {
    if (this.hasAttribute(attributes.DRAGGING)) {
      this.removeAttribute(attributes.OVER);
    } else {
      this.setAttribute(attributes.OVER, '');
    }
  }

  #dragLeave() {
    this.removeAttribute(attributes.OVER);
  }

  set selected(value) {
    const isValueTruthy = stringToBool(value);
    if (isValueTruthy) {
      this.setAttribute(attributes.SELECTED, '');
      this.setAttribute('draggable', 'true');
    } else {
      this.removeAttribute(attributes.SELECTED);
    }
  }

  get selected() {
    return stringToBool(this.getAttribute(attributes.SELECTED));
  }

  #toggleSelected() {
    if (this.selected) {
      this.removeAttribute(attributes.SELECTED);
    } else {
      this.setAttribute(attributes.SELECTED, '');
    }
  }
}

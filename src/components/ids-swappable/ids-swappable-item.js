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
  }

  connectedCallback() {
    this.setAttribute('draggable', 'false');
    this.attachEventListeners();
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

  set selected(value) {
    const isValueTruthy = stringToBool(value);
    if (isValueTruthy) {
      this.setAttribute(attributes.SELECTED, '');
      this.setAttribute('aria-selected', 'selected');
      this.setAttribute('draggable', 'true');
    } else {
      this.removeAttribute(attributes.SELECTED);
      this.removeAttribute('aria-selected');
      this.setAttribute('draggable', 'false');
    }
  }

  get selected() {
    return stringToBool(this.getAttribute(attributes.SELECTED));
  }

  get selectedItems() {
    return this.parentElement.shadowRoot.querySelectorAll('[selected]');
  }

  set originalText(value) {
    if (value) {
      this.setAttribute('originalText', value);
    } else {
      this.removeAttribute('originalText');
    }
  }

  get originalText() {
    return this.getAttribute('originalText');
  }

  #dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.innerText);
    this.setAttribute(attributes.DRAGGING, '');
  }

  #dragEnd() {
    this.removeAttribute(attributes.DRAGGING);
    this.removeAttribute(attributes.SELECTED);
    this.removeAttribute(attributes.OVER);
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

  #toggleSelected() {
    if (this.selected) {
      this.removeAttribute(attributes.SELECTED);
    } else {
      this.setAttribute(attributes.SELECTED, '');
    }
  }

  attachEventListeners() {
    this.onEvent('click', this, this.#toggleSelected);
    this.addEventListener('dragstart', this.#dragStart.bind(this));
    this.addEventListener('dragend', this.#dragEnd.bind(this));
    this.addEventListener('drop', this.#dragEnd.bind(this));
    this.addEventListener('dragover', this.#dragOver.bind(this));
    this.addEventListener('dragleave', this.#dragLeave.bind(this));
  }
}

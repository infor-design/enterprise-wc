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
    this.setAttribute('tabbable', 'true');
    this.attachEventListeners();
  }

  static get attributes() {
    return [
      attributes.DRAGGING,
      attributes.OVER,
      attributes.SELECTED,
      attributes.TABBABLE
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

  get allItems() {
    return this.parentElement.querySelectorAll('ids-swappable-item');
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

  get multiSelect() {
    return this.parentElement.getAttribute('multi-select') !== null && true;
  }

  /**
   * Set if the input and buttons are tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    if (stringToBool(value) !== this.getAttribute(attributes.TABBABLE)) {
      const isTabbable = stringToBool(value);
      if (isTabbable) {
        this.setAttribute(attributes.TABBABLE, 'true');
        this.setAttribute(attributes.TABINDEX, '0');
        return;
      }
      this.setAttribute(attributes.TABBABLE, 'false');
      this.setAttribute(attributes.TABINDEX, '-1');
    }
  }

  /**
   * get whether the input currently allows tabbing.
   * @returns {boolean} true or false depending on whether the input is currently tabbable
   */
  get tabbable() {
    return stringToBool(this.getAttribute(attributes.TABBABLE) || true);
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

  #toggleSelect() {
    if (this.selected) {
      this.removeAttribute(attributes.SELECTED);
    } else {
      this.allItems.forEach((item) => {
        item.removeAttribute(attributes.SELECTED);
      });
      this.setAttribute(attributes.SELECTED, '');
    }
  }

  #toggleMultiSelect() {
    if (this.selected) {
      this.removeAttribute(attributes.SELECTED);
    } else {
      this.setAttribute(attributes.SELECTED, '');
    }
  }

  #handleKeyEvents() {
    this.listen(['Enter', 'ArrowUp', 'ArrowDown'], this, (e) => {
      e.preventDefault();

      if (e.key === 'ArrowDown') {
        e.target.nextElementSibling.focus();
      }

      if (e.key === 'ArrowUp') {
        e.target.previousElementSibling.focus();
      }

      if (e.key === 'Enter') {
        if (this.multiSelect) {
          this.#toggleMultiSelect();
        } else {
          this.#toggleSelect();
        }
      }
    });
  }

  #handleClickEvents() {
    if (this.multiSelect) {
      this.offEvent('click', this, this.#toggleMultiSelect);
      this.onEvent('click', this, this.#toggleMultiSelect);
    } else {
      this.offEvent('click', this, this.#toggleSelect);
      this.onEvent('click', this, this.#toggleSelect);
    }
  }

  #handleDragEvents() {
    this.removeEventListener('dragstart', this.#dragStart.bind(this));
    this.addEventListener('dragstart', this.#dragStart.bind(this));
    this.removeEventListener('dragend', this.#dragEnd.bind(this));
    this.addEventListener('dragend', this.#dragEnd.bind(this));
    this.removeEventListener('drop', this.#dragEnd.bind(this));
    this.addEventListener('drop', this.#dragEnd.bind(this));
    this.removeEventListener('dragover', this.#dragOver.bind(this));
    this.addEventListener('dragover', this.#dragOver.bind(this));
    this.removeEventListener('dragleave', this.#dragLeave.bind(this));
    this.addEventListener('dragleave', this.#dragLeave.bind(this));
  }

  attachEventListeners() {
    this.#handleClickEvents();
    this.#handleKeyEvents();
    this.#handleDragEvents();
  }
}

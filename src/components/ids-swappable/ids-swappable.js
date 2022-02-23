import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-swappable-base';
import styles from './ids-swappable.scss';

/**
 * IDS SwapList Component
 * @type {IdsSwappable}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-swappable')
@scss(styles)
export default class IdsSwappable extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute('dropzone', 'move');
    this.attachEventListeners();
  }

  static get attributes() {
    return [
      attributes.ACTIVE,
      'multi-select'
    ];
  }

  template() {
    return `<slot></slot>`;
  }

  get overEl() {
    return this.querySelector('ids-swappable-item[over]');
  }

  get selectedItems() {
    return this.querySelectorAll('ids-swappable-item[selected]');
  }

  set multiSelect(value) {
    const isValueTruthy = stringToBool(value);
    if (isValueTruthy) {
      this.setAttribute('multi-select', '');
    } else {
      this.removeAttribute('multi-select');
    }
  }

  get multiSelect() {
    return this.getAttribute('multi-select');
  }

  #dzDragStart() {
    if (this.selectedItems.length <= 1) {
      return;
    }
    this.selectedItems.forEach((el) => {
      el.originalText = el.innerText;
      el.innerHTML = `<ids-text>${this.selectedItems.length} Items Selected</ids-text>`;
    });
  }

  #dzDrag(event) {
    this.selectedItems.forEach((el) => {
      this.#hideSelectedItems(event, el);
    });
  }

  getDragAfterElement = (container, y) => {
    const draggableElms = [...container.querySelectorAll('ids-swappable-item:not([dragging])')];

    return draggableElms.reduce((closest, child) => {
      const rect = child.getBoundingClientRect();

      // (rect.top + rect.height/2) returns the y of the container's child element's middle point
      const offset = y - (rect.top + rect.height / 2);

      // if the dragging element is immediately above the child's middle point
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  };

  /**
   * Functionality for the list container once an item has been dropped
   * @param {object} event drop
   */
  #dzDropHandler(event) {
    event.preventDefault();
    const afterElement = this.getDragAfterElement(this, event.clientY);

    if (this.selectedElements.length > 0) {
      if (afterElement) {
        this.selectedElements.forEach((draggingEl) => {
          this.#resetSelectedItems(draggingEl);
          this.insertBefore(draggingEl, afterElement);
        });
      } else {
        this.selectedElements.forEach((draggingEl) => {
          this.#resetSelectedItems(draggingEl);
          this.appendChild(draggingEl);
        });
      }
    }

    this.removeAttribute(attributes.ACTIVE);
  }

  #dzDragLeave() {
    this.removeAttribute(attributes.ACTIVE);
  }

  /**
   * Functionality for the list container once we are hovering over the list
   * @param {object} event drop
   */
  #dzDragover(event) {
    event.preventDefault();

    if (!this.overEl) {
      this.setAttribute(attributes.ACTIVE, '');
    } else {
      this.removeAttribute(attributes.ACTIVE);
    }

    // find ids-swappable or ids-swappable-item
    const found = event.composedPath().find((i) => {
      if (i.nodeType === 1 && (i.nodeName === 'IDS-SWAPPABLE-ITEM' || i.nodeName === 'IDS-SWAPPABLE')) {
        return i;
      }
    });

    if (found) {
      const theLowestShadowRoot = found.getRootNode();
      this.selectedElements = theLowestShadowRoot.querySelectorAll('ids-swappable-item[selected]');
    }
  }

  #hideSelectedItems(event, el) {
    el.setAttribute('aria-grabbed', true);
    el.setAttribute('aria-dropeffect', event.dataTransfer.dropEffect);

    if (this.selectedItems.length <= 1) {
      return;
    }

    if (el !== event.target) {
      el.classList.add('is-hidden');
    }
  }

  #resetSelectedItems(el) {
    if (el.originalText) {
      el.innerHTML = `<ids-text>${el.originalText}</ids-text>`;
    }

    el.removeAttribute('aria-grabbed');
    el.removeAttribute('aria-dropeffect');
    el.classList.remove('is-hidden');
    el.removeAttribute(attributes.SELECTED);
    el.removeAttribute('aria-selected');
  }

  attachEventListeners() {
    this.removeEventListener('dragstart', this.#dzDragStart.bind(this));
    this.addEventListener('dragstart', this.#dzDragStart.bind(this));

    this.removeEventListener('drag', this.#dzDrag.bind(this));
    this.addEventListener('drag', this.#dzDrag.bind(this));

    this.removeEventListener('drop', this.#dzDropHandler.bind(this));
    this.addEventListener('drop', this.#dzDropHandler.bind(this));

    this.removeEventListener('dragover', this.#dzDragover.bind(this));
    this.addEventListener('dragover', this.#dzDragover.bind(this));

    this.removeEventListener('dragleave', this.#dzDragLeave.bind(this));
    this.addEventListener('dragleave', this.#dzDragLeave.bind(this));
  }
}

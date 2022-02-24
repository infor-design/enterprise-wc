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
      attributes.MULTI_SELECT
    ];
  }

  template() {
    return `<slot></slot>`;
  }

  /**
   * Get the item that is dragged over
   * @returns {HTMLElement} ids-swappable-item[over]
   * @readonly
   * @memberof IdsSwappable
   */
  get overEl() {
    return this.querySelector('ids-swappable-item[over]');
  }

  /**
   * Get all the selected ids-swappable-items in the current list
   * @returns {Array} NodeList of ids-swappable-item[selected]
   * @readonly
   * @memberof IdsSwappable
   */
  get selectedItems() {
    return this.querySelectorAll('ids-swappable-item[selected]');
  }

  /**
   * Set the multi-select attribute
   * @param {boolean | string} value multi-select value.
   * @memberof IdsSwappable
   */
  set multiSelect(value) {
    const isValueTruthy = stringToBool(value);
    if (isValueTruthy) {
      this.setAttribute(attributes.MULTI_SELECT, '');
    } else {
      this.removeAttribute(attributes.MULTI_SELECT);
    }
  }

  /**
   * Get the multi-select atrribute
   * @returns {boolean} multi-select value
   * @readonly
   * @memberof IdsSwappable
   */
  get multiSelect() {
    return this.getAttribute(attributes.MULTI_SELECT);
  }

  /**
   * Handle functionality for the dragstart event
   */
  #dzDragStart() {
    if (this.selectedItems.length <= 1) {
      return;
    }
    this.selectedItems.forEach((el) => {
      el.originalText = el.innerText;
      el.innerHTML = `<ids-text>${this.selectedItems.length} Items Selected</ids-text>`;
    });
  }

  /**
   * Handle functionality for the drag event
   * @param {object} event drag event
   */
  #dzDrag(event) {
    this.selectedItems.forEach((el) => {
      this.#hideDraggingItems(event, el);
    });
  }

  /**
   * Calculate the position of the dragging element relative to the container
   * @returns {HTMLElement} closest element being dragged over
   * @param {*} container ids-swappable container
   * @param {*} y position of the dragging element
   * @memberof IdsSwappable
   */
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
   * Handle functionality for the list container once an item has been dropped
   * @param {object} event drop
   */
  #dzDropHandler(event) {
    event.preventDefault();
    const afterElement = this.getDragAfterElement(this, event.clientY);

    if (this.draggingElements.length > 0) {
      if (afterElement) {
        this.draggingElements.forEach((draggingEl) => {
          this.#resetDraggingItems(draggingEl);
          this.insertBefore(draggingEl, afterElement);
        });
      } else {
        this.draggingElements.forEach((draggingEl) => {
          this.#resetDraggingItems(draggingEl);
          this.appendChild(draggingEl);
        });
      }
    }

    this.removeAttribute(attributes.ACTIVE);
  }

  /**
   * Handle functionality for the dragleave event
   */
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
      this.draggingElements = theLowestShadowRoot.querySelectorAll('ids-swappable-item[dragging]');
    }
  }

  /**
   * Hide the dragging items during drag event
   * @param {object} event object
   * @param {HTMLElement} el all dragging elements
   */
  #hideDraggingItems(event, el) {
    el.setAttribute('aria-grabbed', true);
    el.setAttribute('aria-dropeffect', event.dataTransfer.dropEffect);
    el.setAttribute('dragging', '');

    if (this.selectedItems.length <= 1) {
      return;
    }

    if (el !== event.target) {
      el.classList.add('is-hidden');
    }
  }

  /**
   * Reset the selected items after drop event
   * @param {HTMLElement} el all selected elements
   */
  #resetDraggingItems(el) {
    if (el.originalText) {
      el.innerHTML = `<ids-text>${el.originalText}</ids-text>`;
    }

    el.removeAttribute('dragging');
    el.removeAttribute('aria-grabbed');
    el.removeAttribute('aria-dropeffect');
    el.classList.remove('is-hidden');
    el.removeAttribute(attributes.SELECTED);
    el.removeAttribute('aria-selected');
  }

  /**
   * Attach all event listeners
   * @memberof IdsSwappable
   */
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

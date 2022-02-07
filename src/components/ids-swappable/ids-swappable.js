import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
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

    this.addEventListener('drop', this.#dzDropHandler.bind(this));
    this.addEventListener('dragover', this.#dzDragover.bind(this));
    this.addEventListener('dragleave', this.#dzDragLeave.bind(this));
  }

  connectedCallback() {
    this.setAttribute('dropzone', 'move');
  }

  static get attributes() {
    return [
      attributes.ACTIVE
    ];
  }

  template() {
    return `<slot></slot>`;
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
    const container = this;
    const afterElement = this.getDragAfterElement(container, event.clientY);

    if (afterElement) {
      this.insertBefore(this.draggingElement, afterElement);
    } else {
      this.appendChild(this.draggingElement);
    }

    this.removeAttribute(attributes.ACTIVE);
    this.draggingElement = null;
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
    const overEl = this.querySelector('ids-swappable-item[over]');

    if (!overEl) {
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
      this.draggingElement = theLowestShadowRoot.querySelector(
        '[dragging]'
      );
    }
  }

  /**
   * Set the data array of the listview
   * @param {Array | null} value The array to use
   */
  set data(value) {
    if (this.datasource) {
      this.datasource.data = value || [];
      this.render(true);
    }
  }

  get data() { return this?.datasource?.data || []; }
}

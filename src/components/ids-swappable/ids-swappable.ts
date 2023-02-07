import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsSelectionMixin from '../../mixins/ids-selection-mixin/ids-selection-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-swappable.scss';
import IdsSwappableItem from './ids-swappable-item';

const Base = IdsThemeMixin(
  IdsKeyboardMixin(
    IdsLocaleMixin(
      IdsEventsMixin(
        IdsSelectionMixin(
          IdsElement
        )
      )
    )
  )
);

/**
 * IDS Swappable Component
 * @type {IdsSwappable}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-swappable')
@scss(styles)
export default class IdsSwappable extends Base {
  draggingElements: Array<IdsSwappableItem> = [];

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('dropzone', 'move');
    this.attachEventListeners();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.ACTIVE,
      attributes.SELECTION
    ];
  }

  template(): string {
    return `<slot></slot>`;
  }

  /**
   * Get the item that is dragged over
   * @returns {HTMLElement} ids-swappable-item[over]
   * @readonly
   * @memberof IdsSwappable
   */
  get overElement(): IdsSwappableItem | null {
    return this.querySelector<IdsSwappableItem>('ids-swappable-item[over]');
  }

  /**
   * Get all the selected ids-swappable-items in the current list
   * @returns {any} NodeList of ids-swappable-item[selected]
   * @readonly
   * @memberof IdsSwappable
   */
  get selectedItems(): any {
    return this.querySelectorAll('ids-swappable-item[selected]');
  }

  /**
   * Handle functionality for the dragstart event
   */
  #dzDragStart() {
    if (this.selectedItems.length <= 1) {
      return;
    }
    this.selectedItems.forEach((el: any) => {
      el.originalText = el.innerText;
      el.innerHTML = `<ids-text>${this.selectedItems.length} Items Selected</ids-text>`;
    });
  }

  /**
   * Handle functionality for the drag event
   * @param {any} event drag event
   */
  #dzDrag(event: any) {
    this.selectedItems.forEach((el: any) => {
      this.#hideDraggingItems(event, el);
    });
  }

  /**
   * Calculate the position of the dragging element relative to the container
   * @returns {HTMLElement} closest element being dragged over
   * @param {any} container ids-swappable container
   * @param {number} y position of the dragging element
   * @memberof IdsSwappable
   */
  getDragAfterElement = (container: any, y: number) => {
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
  #dzDropHandler(event: any) {
    event.preventDefault();
    const afterElement = this.getDragAfterElement(this, event.clientY);

    if (this.draggingElements?.length > 0) {
      if (afterElement) {
        this.draggingElements.forEach((draggingEl: HTMLElement) => {
          this.#resetDraggingItems(draggingEl);
          this.insertBefore(draggingEl, afterElement);
        });
      } else {
        this.draggingElements.forEach((draggingEl: HTMLElement) => {
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
   * @param {any} event drop
   */
  #dzDragover(event: any) {
    event.preventDefault();

    if (!this.overElement) {
      this.setAttribute(attributes.ACTIVE, '');
    } else {
      this.removeAttribute(attributes.ACTIVE);
    }

    // find ids-swappable or ids-swappable-item
    const found = event.composedPath().find((i: any) => {
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
   * @param {any} event object
   * @param {any} el all dragging elements
   */
  #hideDraggingItems(event: any, el: any) {
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
   * @param {any} el all selected elements
   */
  #resetDraggingItems(el: any) {
    if (el.originalText) {
      el.innerHTML = `<ids-text>${el.originalText}</ids-text>`;
    }

    el.removeAttribute('dragging');
    el.removeAttribute('aria-grabbed');
    el.removeAttribute('aria-dropeffect');
    el.classList.remove('is-hidden');
  }

  /**
   * Attach all event listeners
   * @memberof IdsSwappable
   */
  attachEventListeners() {
    this.offEvent('dragstart', this, () => this.#dzDragStart());
    this.onEvent('dragstart', this, () => this.#dzDragStart());

    this.offEvent('drag', this, (e: any) => this.#dzDrag(e));
    this.onEvent('drag', this, (e: any) => this.#dzDrag(e));

    this.offEvent('drop', this, (e: any) => this.#dzDropHandler(e));
    this.onEvent('drop', this, (e: any) => this.#dzDropHandler(e));

    this.offEvent('dragover', this, (e: any) => this.#dzDragover(e));
    this.onEvent('dragover', this, (e: any) => this.#dzDragover(e));

    this.offEvent('dragleave', this, () => this.#dzDragLeave());
    this.onEvent('dragleave', this, () => this.#dzDragLeave());
  }
}

import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsSelectionMixin from '../../mixins/ids-selection-mixin/ids-selection-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-swappable.scss';
import IdsSwappableItem from './ids-swappable-item';

const Base = IdsKeyboardMixin(
  IdsLocaleMixin(
    IdsEventsMixin(
      IdsSelectionMixin(
        IdsElement
      )
    )
  )
);

/**
 * IDS Swappable Component
 * @type {IdsSwappable}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
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
   * Holds the current start `y` position for drag element
   */
  #startY: null | number = null;

  /**
   * Handle functionality for the dragstart event
   *  @param {any} event drag event
   */
  #dzDragStart(event: any) {
    this.#startY = event.clientY;
    if (this.selectedItems.length <= 1) {
      return;
    }
    this.selectedItems.forEach((el: any) => {
      el.originalHtml = el.innerHTML;
      el.innerHTML = el.innerHTML.replace(el.innerText, `${this.selectedItems.length} Items Selected`);
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
    const lastIndex = draggableElms.length - 1;

    return draggableElms.reduce((closest, child, i) => {
      if (this.#startY === null) return closest;

      // Bounding rectangle
      const { top, bottom, height } = child.getBoundingClientRect();

      // Set extra edge pad value for 1st and last child
      const pad = { val: 0, calc: Math.ceil(height / 4) };
      if (i === 0 && this.#startY > bottom) pad.val = pad.calc;
      if (i === lastIndex && this.#startY < top) pad.val = (pad.calc * -1);

      // Find the element to use
      const mid = top + (height / 2);
      const offset = y - (mid + pad.val);
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
    this.#startY = null;
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
    if (el.originalHtml) el.innerHTML = el.originalHtml;

    el.removeAttribute('dragging');
    el.removeAttribute('aria-grabbed');
    el.removeAttribute('aria-dropeffect');
    el.classList.remove('is-hidden');
  }

  /**
   * Handle functionality for the dragend event
   */
  #dzDragEnd() {
    this.draggingElements.forEach((draggingEl: HTMLElement) => {
      this.#resetDraggingItems(draggingEl);
    });
    this.removeAttribute(attributes.ACTIVE);
  }

  /**
   * Attach all event listeners
   * @memberof IdsSwappable
   */
  attachEventListeners() {
    this.offEvent('dragstart', this, (e: any) => this.#dzDragStart(e));
    this.onEvent('dragstart', this, (e: any) => this.#dzDragStart(e));

    this.offEvent('drag', this, (e: any) => this.#dzDrag(e));
    this.onEvent('drag', this, (e: any) => this.#dzDrag(e));

    this.offEvent('drop', this, (e: any) => this.#dzDropHandler(e));
    this.onEvent('drop', this, (e: any) => this.#dzDropHandler(e));

    this.offEvent('dragover', this, (e: any) => this.#dzDragover(e));
    this.onEvent('dragover', this, (e: any) => this.#dzDragover(e));

    this.offEvent('dragleave', this, () => this.#dzDragLeave());
    this.onEvent('dragleave', this, () => this.#dzDragLeave());

    this.offEvent('dragend', this, () => this.#dzDragEnd());
    this.onEvent('dragend', this, () => this.#dzDragEnd());
  }
}

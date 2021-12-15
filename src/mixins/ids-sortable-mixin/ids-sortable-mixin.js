import { attributes } from '../../core';
import { IdsXssUtils, IdsStringUtils } from '../../utils';

/**
 * A mixin that will provide the container element of an IDS Component with a class
 * reserved for flipping the foreground color (text color, icon fill, etc) to an alternate,
 * contrasting color.  This allows easy integration with alternate layouts, headers, app menu, etc.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsSortableMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    // this.sortable = this.hasAttribute(attributes.SORTABLE);
    this.draggable = this.hasAttribute(attributes.DRAGGABLE);
  }

  static get attributes() {
    return [
      ...super.attributes,
      // attributes.SORTABLE,
      attributes.DRAGGABLE,
    ];
  }

  /**
   * Set to true to allow items to be draggable/sortable
   * @param {string} value true to use draggable
   */
   set draggable(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DRAGGABLE, val);
    } else {
      this.removeAttribute(attributes.DRAGGABLE);
    }
  }

  get draggable() {
    return this.hasAttribute(attributes.DRAGGABLE);
  }

 /**
   * Helper function for swapping nodes in the list item -- used when dragging list items or clicking the up/down arrows
   * @param {Node} nodeA the first node
   * @param {Node} nodeB the second node
   */
  swap(nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    nodeB.parentNode.insertBefore(nodeA, nodeB);
    parentA.insertBefore(nodeB, siblingA);
  }

  /**
   * Helper function to check if a node is being dragged above another node
   * @param {Node} nodeA the node being dragged
   * @param {Node} nodeB the referred node being checked if nodeA is above
   * @returns {boolean} whether or not nodeA is above nodeB
   */
  isAbove(nodeA, nodeB) {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    const centerA = rectA.top + rectA.height / 2;
    const centerB = rectB.top + rectB.height / 2;
    return centerA < centerB;
  }

  /**
   * Helper function that creates a placeholder node in place of the node being dragged
   * @param {Node} node the node being dragged around to clone
   * @returns {Node} a clone of the node
   */
  createPlaceholderClone(node) {
    const p = node.cloneNode(true);
    p.querySelector('div[part="list-item"]').classList.add('placeholder');
    p.querySelector('div[part="list-item"]').removeAttribute('selected');
    return p;
  }

  getAllDraggable() {
    return this.draggable ? this.container.querySelectorAll('ids-draggable') : null;
  }
};

export default IdsSortableMixin;

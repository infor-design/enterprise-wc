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
    this.sortable = this.hasAttribute(attributes.SORTABLE);
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.SORTABLE,
    ];
  }

  /**
   * Handles the sortable property and reflects it on the DOM
   * @param {string | boolean} value
   */
   set sortable(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.SORTABLE, val);
    } else {
      this.removeAttribute(attributes.SORTABLE);
    }
  }

  get sortable() {
    return this.hasAttribute(attributes.SORTABLE);
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
   * Helper function to check if a node is being dragged left of another node
   * @param {Node} nodeA the node being dragged
   * @param {Node} nodeB the referred node being checked if nodeA is left of
   * @returns {boolean} whether or not nodeA is left of nodeB
   */
  isLeft(nodeA, nodeB) {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    const centerA = rectA.left + rectA.width / 2;
    const centerB = rectB.left + rectB.width / 2;
    return centerA < centerB;
  }

  /**
   * Helper function that creates a placeholder node in place of the node being dragged
   * @param {Node} node the node being dragged around to clone
   * @returns {Node} a clone of the node
   */
  createPlaceholderClone(node) {
    const p = node.cloneNode(true);
    return p;
  }

  /**
   * Helper function that queries a list of all the ids-draggable elements
   * @returns NodeList or null
   */
  getAllDraggable() {
    return this.sortable ? this.container.querySelectorAll('ids-draggable') : null;
  }

  /**
   * Adds dragging functionality to all list items
   */
   attachDragEventListeners() {
    this.getAllDraggable().forEach((draggable) => {
      this.attachDragEventListenersForDraggable(draggable);
    });
  }

  /**
   * Helper function for when ids-dragstart fires
   * Can be overriden to include any additional calls
   * @param {Element} el 
   */
  onDragStart(el) {
    // create placeholder
    this.placeholder = this.createPlaceholderClone(el);
    // need this for draggable to move around
    el.style.position = `absolute`;
    el.style.opacity = `0.95`;
    el.style.zIndex = `100`;
    
    el.parentNode.insertBefore(
      this.placeholder,
      el.nextSibling
    );
  }

  /**
   * Helper function for when ids-dragend fires
   * Can be overridden to include any additional calls
   * @param {Element} el 
   */
  onDragEnd(el) {
    el.style.removeProperty('position');
    el.style.removeProperty('transform');
    el.style.removeProperty('opacity');
    el.style.removeProperty('z-index');

    this.swap(el, this.placeholder);
    if (this.placeholder) {
      this.placeholder.remove();
      this.placeholder = null;
    }
  }

  /**
   * Helper function for when ids-drag fires
   * Can be overridden to include any additional calls
   * @param {Element} el 
   * @returns 
   */
  onDrag(el) {
    let prevEle = this.placeholder?.previousElementSibling;
    let nextEle = this.placeholder?.nextElementSibling;

    // skip over the original node
    if (prevEle === el) {
      prevEle = prevEle.previousElementSibling;
    }
    // skip over the original node
    if (nextEle === el) {
      nextEle = nextEle.nextElementSibling;
    }

    const draggableAxis = el.getAttribute('axis');
    const isBefore = draggableAxis === 'x' ? this.isLeft : this.isAbove;

    if (prevEle && isBefore(el, prevEle)) {
      this.swap(this.placeholder, prevEle);
      return;
    }
    
    if (nextEle && isBefore(nextEle, el)) {
      this.swap(nextEle, this.placeholder);
    }
  }

  /**
   * Helper function for attaching dragging functionality to a list item
   * @param {Element} el the list item to add draggable functionality
   */
  attachDragEventListenersForDraggable(el) {
    // Toggle selected attribute, create placeholder, edit the css at the beginning of the drag
    this.onEvent('ids-dragstart', el, () => {
      this.onDragStart(el);
    });

    // Calculate where the dragged list item is in relation to the other list items and move the placeholder accordingly
    this.onEvent('ids-drag', el, () => {
      this.onDrag(el);
    });

    // At the end of the drag, return the css properties back to normal and remove the placeholder
    this.onEvent('ids-dragend', el, () => {
      this.onDragEnd(el);
    });
  }
};

export default IdsSortableMixin;

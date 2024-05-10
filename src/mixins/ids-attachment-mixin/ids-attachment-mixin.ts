import { IdsBaseConstructor } from '../../core/ids-element';
import { IdsPopupElementRef } from '../../components/ids-popup/ids-popup-attributes';
import { attributes } from '../../core/ids-attributes';
import { getClosestContainerNode } from '../../utils/ids-dom-utils/ids-dom-utils';

/**
 * A mixin that allows for its component to attach itself to another DOM node when a specified condition occurs.
 * This mixin provides methods for attaching to the new node, and reattaching to the original node.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsAttachmentMixin = <T extends IdsBaseConstructor>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.ATTACHMENT,
    ];
  }

  /**
   * Original parent element reference
   */
  originalParentElement?: IdsPopupElementRef;

  /**
   * Attachment behavior's target element reference
   */
  attachmentParentElement?: IdsPopupElementRef | null;

  /**
   * @param {string | null} val CSS selector string representing a target element
   */
  set attachment(val: string | null) {
    if (val && val.length) {
      this.setAttribute(attributes.ATTACHMENT, val);
      this.#setAttachmentParent(val);
    } else {
      this.removeAttribute(attributes.ATTACHMENT);
      this.attachmentParentElement = null;
    }
  }

  /**
   * @returns {string | null} CSS selector string representing a target element
   */
  get attachment(): string | null {
    return this.getAttribute(attributes.ATTACHMENT);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.originalParentElement = this.parentElement;
    if (this.hasAttribute(attributes.ATTACHMENT)) this.#setAttachmentParent(this.getAttribute(attributes.ATTACHMENT));
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.originalParentElement = null;
    this.attachmentParentElement = null;
  }

  #setAttachmentParent(val: string | null): void {
    const containerNode = getClosestContainerNode(this);
    const parentElem = containerNode.querySelector<HTMLElement | SVGElement>(`${val}`);
    this.attachmentParentElement = parentElem;
  }

  /**
   * Appends this component to the specified target
   * @returns {void}
   */
  appendToTargetParent(): void {
    if (!this.attachmentParentElement) return;

    if (this.id) {
      /**
       * Remove Child if there are more than one instance of the component
       */
      const existingComponent = this.attachmentParentElement.querySelectorAll(`#${this.id}`);
      if (existingComponent.length > 1) {
        existingComponent.forEach((elem, index) => {
          if (index > 0) elem.remove();
        });
      }
    }

    this.attachmentParentElement.append(this);
  }

  /**
   * Appends this component to the its original parent element
   * @returns {void}
   */
  appendToOriginalParent(): void {
    if (!this.originalParentElement) return;
    this.originalParentElement.append(this);
  }
};

export default IdsAttachmentMixin;

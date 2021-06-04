import {
  IdsElement,
  customElement,
  scss,
  mix,
} from '../ids-base';

// Import Mixins
import { IdsEventsMixin, IdsThemeMixin } from '../ids-mixins';

import styles from './ids-breadcrumb.scss';

/**
 * @type {IdsBreadcrumb}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part breadcrumb
 */
@customElement('ids-breadcrumb')
@scss(styles)
class IdsBreadcrumb extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
    this.setAttribute('role', 'list');
    const stack = [];
    while (this.lastElementChild) { stack.push(this.pop()); }
    while (stack.length) { this.push(stack.pop()); }
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-breadcrumb">
        <nav>
          <slot></slot>
        </nav>
      </div>`;
  }

  /**
   * Appends an individual breadcrumb to the end of the stack
   * @param {Element} breadcrumb The HTML element with which to add
   */
  push(breadcrumb) {
    if (this.lastElementChild) {
      this.lastElementChild.setAttribute('font-weight', '');
    }
    breadcrumb.setAttribute('font-weight', 'bolder');
    breadcrumb.setAttribute('color', 'unset');
    breadcrumb.setAttribute('role', 'listitem');
    if (!(breadcrumb.getAttribute('font-size'))) {
      breadcrumb.setAttribute('font-size', 14);
    }
    this.appendChild(breadcrumb);
  }

  /**
   * Removes the last breadcrumb from the stack.
   * @returns {Element | null} The removed element
   */
  pop() {
    if (this.lastElementChild) {
      const breadcrumb = this.removeChild(this.lastElementChild);
      if (this.lastElementChild) {
        this.lastElementChild.setAttribute('font-weight', 'bolder');
      }
      return breadcrumb;
    }
    return null;
  }
}

export default IdsBreadcrumb;

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
  }

  /**
   * Sets the role of the children to 'listitem' for accessiblity reasons.
   * Also bolds the last crumb.
   */
  connectedCallback() {
    this.setAttribute('role', 'list');
    for (const child of this.children) {
      child.setAttribute('role', 'listitem');
      if (!(child.getAttribute('font-size'))) child.setAttribute('font-size', 14);
      child.textDecoration = 'none';
    }
    if (this.lastElementChild) this.lastElementChild.fontWeight = 'bolder';
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
      this.lastElementChild.fontWeight = '';
    }
    breadcrumb.fontWeight = 'bolder';
    breadcrumb.color = 'unset';
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
        this.lastElementChild.fontWeight = 'bolder';
      }
      return breadcrumb;
    }
    return null;
  }
}

export default IdsBreadcrumb;

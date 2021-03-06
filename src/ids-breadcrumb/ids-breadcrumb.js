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
 *  IDS Breadcrumb Component
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
    this.#init();
  }

  /**
   * Sets the 'role' attribute to 'list'.
   * Also set the font weight, color and role of each child by removing each and re-adding.
   * @private
   */
  #init() {
    this.setAttribute('role', 'list');
    const stack = [];
    /* istanbul ignore next */
    while (this.lastElementChild) { stack.push(this.delete()); }
    /* istanbul ignore next */
    while (stack.length) { this.add(stack.pop()); }
  }

  /**
   * Returns the Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-breadcrumb">
        <nav part="breadcrumb">
          <slot></slot>
        </nav>
      </div>`;
  }

  /**
   * Adds an individual breadcrumb to the end of the bread crumb list
   * @param {Element} breadcrumb The HTML element to add
   */
  add(breadcrumb) {
    if (this.lastElementChild) {
      this.lastElementChild.setAttribute('font-weight', '');
    }
    breadcrumb.setAttribute('font-weight', 'bolder');
    breadcrumb.setAttribute('color', 'unset');
    breadcrumb.setAttribute('role', 'listitem');
    breadcrumb.setAttribute('text-decoration', 'hover');
    /* istanbul ignore next */
    if (!(breadcrumb.getAttribute('font-size'))) {
      breadcrumb.setAttribute('font-size', 14);
    }
    this.appendChild(breadcrumb);
  }

  /**
   * Removes the last breadcrumb from the bread crumb list
   * @returns {Element | null} The removed element
   */
  delete() {
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

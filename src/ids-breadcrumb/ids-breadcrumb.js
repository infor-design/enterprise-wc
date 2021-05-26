import {
  IdsElement,
  customElement,
  scss,
  mix,
  props
} from '../ids-base/ids-element';

// Import Mixins
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';

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
   * Inner template contents
   * @returns {string} The template
   */
  template() {

    return `
      <div class="ids-breadcrumb">
        <nav>
          <ul>
            <slot></slot>
          </ul>
        </nav>   
      </div>`;
  }

  /**
   * Appends an individual breadcrumb to the end of the stack
   * @param {Element} breadcrumb The HTML element with which to add
   */
  push(breadcrumb) {
    if (this.lastElementChild) this.lastElementChild.fontWeight = '';
    breadcrumb.fontWeight = 'bolder';
    this.appendChild(breadcrumb);
  }

  /**
   * Removes the last breadcrumb from the stack
   * @return {Element | null} The removed element
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

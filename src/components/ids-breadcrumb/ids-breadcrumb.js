import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-breadcrumb-base';
import styles from './ids-breadcrumb.scss';

import IdsMenuButton from '../ids-menu-button/ids-menu-button';
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import IdsPopup from '../ids-popup/ids-popup';

import IdsMenuHeader from '../ids-menu/ids-menu-header';
import IdsMenu from '../ids-menu/ids-menu';
import IdsMenuItem from '../ids-menu/ids-menu-item';
import IdsMenuGroup from '../ids-menu/ids-menu-group';
import IdsSeparator from '../ids-separator/ids-separator';

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
export default class IdsBreadcrumb extends Base {
  constructor() {
    super();
    this.#init();
  }

  connectedCallback() {
    // Set observer for resize
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(this.container);

    super.connectedCallback();
  }

  #itemsCollapsed = [];

  /**
   * Attach the resize observer.
   * @private
   * @type {number}
   */
  #resizeObserver = new ResizeObserver(() => this.#resize());

  /**
   * Resize
   * @private
   * @returns {object} This API object for chaining
   */
  #resize() {
    const widthLimit = this.clientWidth - 50;
    const elementsToRemove = [];
    let totalWidth = [...this.children].map((elem) => elem.offsetWidth).reduce((prev, cur) => prev + cur, 0);

    // check if there is any element to collapse
    for (const elem of this.children) {
      if (totalWidth >= widthLimit) {
        elementsToRemove.push(elem);
        totalWidth -= elem.offsetWidth;
      }
    }

    this.#itemsCollapsed = this.#itemsCollapsed.concat(elementsToRemove.map((elem) => ({
      element: elem,
      width: elem.offsetWidth,
    })));
    elementsToRemove.forEach((elem) => this.removeChild(elem));

    // check if there is any element to show
    while (totalWidth < widthLimit || this.#itemsCollapsed.length) {
      const breadCrumb = this.#itemsCollapsed.pop();
      if (totalWidth + breadCrumb.width < widthLimit) {
        totalWidth += breadCrumb.width;
        this.insertBefore(breadCrumb.element, this.firstElementChild);
      } else {
        this.#itemsCollapsed.push(breadCrumb);
        break;
      }
    }

    const menuStr = this.#itemsCollapsed
      .map((item) => item.element.innerHTML)
      .reduce((prev, cur) => `${prev}<ids-menu-item>${cur}</ids-menu-item>`, '');

    this.container.querySelector('ids-menu-group').innerHTML = menuStr;
    return this;
  }

  /**
   * Sets the 'role' attribute to 'list'.
   * Also set the font weight, color and role of each child by removing each and re-adding.
   * @private
   */
  #init() {
    this.setAttribute('role', 'list');
    const stack = [];
    while (this.lastElementChild) { stack.push(this.delete()); }
    while (stack.length) { this.add(stack.pop()); }
  }

  /**
   * Returns the Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-breadcrumb">
        <div class="ids-breadcrumb-menu">
          <ids-menu-button id="icon-button" menu="icon-menu">
            <ids-icon slot="icon" icon="more"></ids-icon>
            <span class="audible">Icon Only Button</span>
          </ids-menu-button>
          <ids-popup-menu id="icon-menu" target="icon-button" trigger="click">
            <ids-menu-group>
              <ids-menu-item>Option One</ids-menu-item>
              <ids-menu-item>Option Two</ids-menu-item>
              <ids-menu-item>Option Three</ids-menu-item>
            </ids-menu-group>
          </ids-popup-menu>
        </div>
        
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
    breadcrumb.setAttribute('font-weight', 'bold');
    breadcrumb.setAttribute('color', 'unset');
    breadcrumb.setAttribute('role', 'listitem');
    breadcrumb.setAttribute('text-decoration', 'hover');
    breadcrumb.setAttribute('hitbox', 'true');
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
        this.lastElementChild.setAttribute('font-weight', 'bold');
      }
      return breadcrumb;
    }
    return null;
  }
}

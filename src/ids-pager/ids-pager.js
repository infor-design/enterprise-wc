import {
  IdsElement,
  customElement,
  props,
  scss
} from '../ids-base';
import IdsPagerSection from './ids-pager-section';
import styles from './ids-pager.scss';

/**
 * IDS Pager Component
 * @type {IdsPager}
 * @inherits IdsElement
 * @part container the overall ids-pager container
 */
@customElement('ids-pager')
@scss(styles)
export default class IdsPager extends IdsElement {
  constructor() {
    super();
  }

  template() {
    if (!this.hasSectionContainers()) {
      return (
        `<ids-pager-section><slot></slot></ids-pager-section>`
      );
    }

    return (
      `<div class="ids-pager">
        <slot></slot>
      </div>`
    );
  }

  get properties() {
    return [
      props.PAGE_INDEX,
      props.PAGE_ITEM_COUNT,
      props.PAGE_SIZE
    ];
  }

  connectedCallback() {
    this.#contentObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: [props.START, props.END],
      subtree: true
    });

    this.#updateChildrenProps();

    if (!this.hasAttribute(props.PAGE_INDEX)) {
      this.setAttribute(props.PAGE_INDEX, 1);
    }
  }

  /**
   * @returns {boolean} whether or not IdsPageSection containers were
   * provided to content
   */
  hasSectionContainers() {
    for (const el of this.children) {
      if (el instanceof IdsPagerSection) {
        return true;
      }
    }

    return false;
  }

  /**
   * updates children start/end properties
   * as needed for alignment
   */
  #updateChildrenProps() {
    if (!this.hasSectionContainers()) {
      return;
    }

    switch (this.children.length) {
    case 3:
      this.children[0].setAttribute(props.START, '');
      this.children[2].setAttribute(props.END, '');
      break;
    case 2: {
      this.children[1].setAttribute(props.END, '');

      // insert an empty pager-section to the left
      // of the 2nd element for alignment purposes

      const sectionTemplate = document.createElement('template');
      sectionTemplate.innerHTML = (
        '<ids-pager-section start></ids-pager-section>'
      );
      const emptySection = sectionTemplate.content.childNodes[0];
      document.body.appendChild(emptySection);
      this.insertBefore(emptySection, this.children[0]);
      break;
    }
    case 1:
      break;
    default: {
      console.error('ids-pager: invalid number of children passed');
      break;
    }
    }
  }

  /**
   * @param {string|number} value 0-based index for page that is currently viewed
   */
  set pageIndex(value) {
    if (Number.isNaN(Number.parseInt(value))) {
      this.setAttribute(props.PAGE_INDEX, 1);
      return;
    }

    this.setAttribute(props.PAGE_INDEX, Number.parseInt(value));
  }

  /**
   * @param {string|number} value number of items shown per-page
   */
  set pageItemCount(value) {
    if (Number.isNaN(Number.parseInt(value))) {
      this.removeAttribute(props.PAGE_ITEM_COUNT);
      console.error('ids-pager: non-numeric value sent to page-item-count');
      return;
    }

    this.setAttribute(props.PAGE_ITEM_COUNT, Number.parseInt(value));
  }

  set pageSize(value) {
    if (Number.isNaN(Number.parseInt(value))) {
      this.setAttribute(props.PAGE_SIZE, 10);
      console.error('ids-pager: non-numeric value sent to page-size');
      return;
    }

    if (Number.isNaN(Number.parseInt(value)) <= 0) {
      this.setAttribute(props.PAGE_SIZE, 10);
      console.error('ids-pager: page-size cannot be <= 0');
      return;
    }

    this.setAttribute(props.PAGE_SIZE, Number.parseInt(value));
  }

  /** observes changes in content/layout */
  #contentObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        this.#updateChildrenProps();
      }
    }
  });
}

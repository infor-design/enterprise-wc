import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../ids-base';
import { IdsAttributeProviderMixin, IdsEventsMixin } from '../ids-mixins';
import IdsPagerSection from './ids-pager-section';
import IdsPagerButton from './ids-pager-button';
import IdsPagerInput from './ids-pager-input';
import IdsPagerNumberList from './ids-pager-number-list';
import styles from './ids-pager.scss';

/**
 * IDS Pager Component
 * @type {IdsPager}
 * @inherits IdsElement
 * @part container the overall ids-pager container
 * @mixes IdsAttributeProviderMixin
 */
@customElement('ids-pager')
@scss(styles)
export default class IdsPager extends mix(IdsElement).with(
    IdsAttributeProviderMixin,
    IdsEventsMixin
  ) {
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

  static get attributes() {
    return [
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.TOTAL
    ];
  }

  get providedAttributes() {
    return {
      [attributes.PAGE_NUMBER]: [IdsPagerInput, IdsPagerNumberList, IdsPagerButton],
      [attributes.TOTAL]: [IdsPagerInput, IdsPagerNumberList, IdsPagerButton],
      [attributes.PAGE_SIZE]: [IdsPagerInput, IdsPagerNumberList, IdsPagerButton],
      [attributes.DISABLED]: [
        [IdsPagerInput, attributes.PARENT_DISABLED],
        [IdsPagerButton, attributes.PARENT_DISABLED],
        [IdsPagerNumberList, attributes.PARENT_DISABLED]
      ]
    };
  }

  connectedCallback() {
    this.#contentObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: [attributes.ALIGN],
      subtree: true
    });

    this.#normalizeSectionContainers();

    this.onEvent('pagenumberchange', this.shadowRoot, (e) => {
      this.pageNumber = e.detail.value;
    });

    this.provideAttributes();
    super.connectedCallback?.();
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
   * @param {string|number} value number of items shown per-page
   */
  set pageSize(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      console.error('ids-pager: non-numeric value sent to page-size');
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(attributes.PAGE_SIZE, nextValue);
  }

  /**
   * @returns {string|number} number of items shown per-page
   */
  get pageSize() {
    return parseInt(this.getAttribute(attributes.PAGE_SIZE));
  }

  /**
   * @param {string|number} value 1-based page number shown
   */
  set pageNumber(value) {
    let nextValue = Number.parseInt(value);

    if (Number.isNaN(nextValue)) {
      nextValue = 1;
      console.error('ids-pager: non-numeric value sent to pageNumber');
    } else if (nextValue <= 1) {
      nextValue = 1;
    } else {
      const pageCount = Math.floor(this.total / this.pageSize);
      nextValue = Math.min(nextValue, pageCount);
    }

    this.setAttribute(attributes.PAGE_NUMBER, nextValue);
  }

  /**
   * @returns {string|number} value 1-based page number displayed
   */
  get pageNumber() {
    return parseInt(this.getAttribute(attributes.PAGE_NUMBER));
  }

  /**
   * @param {string|number} value number of items to track
   */
  set total(value) {
    let nextValue;
    if (Number.isNaN(Number.parseInt(value))) {
      console.error('ids-pager: non-numeric value sent to total');
      nextValue = 1;
    } else if (Number.parseInt(value) <= 0) {
      console.error('ids-pager: total cannot be <= 0');
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(attributes.TOTAL, nextValue);
  }

  /**
   * @returns {string|number} number of items for pager is tracking
   */
  get total() {
    return parseInt(this.getAttribute(attributes.TOTAL));
  }

  /**
   * update the state of the section containers so
   * user doesn't have to manually input all of this
   * e.g. adds start/end attributes as needed for
   * their styling, and adds an extra left section
   * if only 2 sections exist for alignment sake to
   * keep things simple
   */
  #normalizeSectionContainers() {
    if (!this.hasSectionContainers()) {
      this.shadowRoot.querySelector('ids-pager-section').setAttribute('role', 'navigation');
      return;
    }

    switch (this.children.length) {
    case 3:
      this.children[0].setAttribute(attributes.ALIGN, 'start');
      this.children[1].setAttribute('role', 'navigation');
      this.children[2].setAttribute(attributes.ALIGN, 'end');
      break;
    case 2: {
      this.children[0].setAttribute('role', 'navigation');
      this.children[1].setAttribute(attributes.END, '');

      // insert an empty pager-section to the left
      // of the 2nd element for alignment purposes

      const sectionTemplate = document.createElement('template');
      sectionTemplate.innerHTML = (
        '<ids-pager-section align="start"></ids-pager-section>'
      );
      const emptySection = sectionTemplate.content.childNodes[0];
      document.body.appendChild(emptySection);
      this.insertBefore(emptySection, this.children[0]);
      break;
    }
    case 1:
      this.children[0].setAttribute('role', 'navigation');
      break;
    default: {
      console.error('ids-pager: invalid number of children passed');
      break;
    }
    }
  }

  /** observes changes in content/layout */
  #contentObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        this.#normalizeSectionContainers();
        this.provideAttributes();
      }
    }
  });
}

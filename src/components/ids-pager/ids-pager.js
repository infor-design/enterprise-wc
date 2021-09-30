import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

import { IdsAttributeProviderMixin, IdsEventsMixin, IdsThemeMixin } from '../../mixins';
import IdsPagerSection from './ids-pager-section';
import IdsPagerButton from './ids-pager-button';
import IdsPagerInput from './ids-pager-input';
import IdsPagerNumberList from './ids-pager-number-list';
import styles from './ids-pager.scss';

const {
  PAGE_NUMBER,
  PAGE_SIZE,
  DISABLED,
  PARENT_DISABLED,
  TOTAL
} = attributes;

const attributeProviderDefs = {
  attributesProvided: [
    { attribute: DISABLED, component: IdsPagerInput, targetAttribute: PARENT_DISABLED },
    { attribute: DISABLED, component: IdsPagerButton, targetAttribute: PARENT_DISABLED },
    { attribute: DISABLED, component: IdsPagerInput, targetAttribute: PARENT_DISABLED },
    { attribute: DISABLED, component: IdsPagerNumberList, targetAttribute: PARENT_DISABLED },
    { attribute: PAGE_NUMBER, component: IdsPagerInput },
    { attribute: PAGE_NUMBER, component: IdsPagerNumberList },
    { attribute: PAGE_NUMBER, component: IdsPagerButton },
    { attribute: PAGE_SIZE, component: IdsPagerNumberList },
    { attribute: PAGE_SIZE, component: IdsPagerButton },
    { attribute: PAGE_SIZE, component: IdsPagerInput },
    { attribute: TOTAL, component: IdsPagerInput },
    { attribute: TOTAL, component: IdsPagerNumberList },
    { attribute: TOTAL, component: IdsPagerButton }
  ]
};

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
    IdsAttributeProviderMixin(attributeProviderDefs),
    IdsEventsMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      attributes.DISABLED,
      attributes.MODE,
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.TOTAL,
      attributes.VERSION
    ];
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

  connectedCallback() {
    this.#contentObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: [attributes.ALIGN],
      subtree: true
    });

    this.#normalizeSectionContainers();

    this.onEvent('pagenumberchange', this, (e) => {
      this.pageNumber = e.detail.value;
    });

    this.provideAttributes();
    super.connectedCallback?.();
  }

  /**
   * @returns {boolean} Whether or not IdsPageSection containers were
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
   * @param {boolean} value Whether or not to disable the pager overall
   */
  set disabled(value) {
    const isTruthy = IdsStringUtils.stringToBool(value);

    if (isTruthy && !this.hasAttribute(attributes.DISABLED)) {
      this.setAttribute(attributes.DISABLED, '');
    } else if (!isTruthy && this.hasAttribute(attributes.DISABLED)) {
      this.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * @returns {boolean} Whether or not the pager overall is disabled
   */
  get disabled() {
    return this.hasAttribute(attributes.DISABLED);
  }

  /** @param {string|number} value The number of items shown per page */
  set pageSize(value) {
    let nextValue = parseInt(value);

    if (Number.isNaN(nextValue)) {
      // console.error('ids-pager: non-numeric value sent to page-size');
      nextValue = 1;
    } else if (nextValue < 1) {
      // console.error('ids-pager: page-size cannot be < 1');
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    if (this.getAttribute(attributes.PAGE_SIZE) !== `${nextValue}`) {
      this.setAttribute(attributes.PAGE_SIZE, nextValue);
    }

    this.#keepPageNumberInBounds();
  }

  /** @returns {string|number} The number of items shown per page */
  get pageSize() {
    return parseInt(this.getAttribute(attributes.PAGE_SIZE));
  }

  /** @param {string|number} value A 1-based index for the page number displayed */
  set pageNumber(value) {
    let nextValue = Number.parseInt(value);

    if (Number.isNaN(nextValue)) {
      nextValue = 1;
      // console.error('ids-pager: non-numeric value sent to pageNumber');
    } else if (nextValue <= 1) {
      nextValue = 1;
    } else {
      const pageCount = Math.floor(this.total / this.pageSize);
      nextValue = Math.min(nextValue, pageCount);
    }

    if (parseInt(this.getAttribute(attributes.PAGE_NUMBER)) !== nextValue) {
      this.setAttribute(attributes.PAGE_NUMBER, nextValue);
    }
  }

  /** @returns {string|number} value A 1-based-index for the page number displayed */
  get pageNumber() {
    return parseInt(this.getAttribute(attributes.PAGE_NUMBER));
  }

  /** @returns {number|null} The calculated pageCount using total and pageSize */
  get pageCount() {
    return (this.total !== null && !Number.isNaN(this.total))
      ? Math.floor(this.total / this.pageSize)
      : null;
  }

  /** @param {string|number} value The number of items to track */
  set total(value) {
    let nextValue;
    if (Number.isNaN(Number.parseInt(value))) {
      // console.error('ids-pager: non-numeric value sent to total');
      nextValue = 1;
    } else if (Number.parseInt(value) <= 0) {
      // console.error('ids-pager: total cannot be <= 0');
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    if (parseInt(this.getAttribute(attributes.TOTAL)) !== nextValue) {
      this.setAttribute(attributes.TOTAL, nextValue);
    }

    this.#keepPageNumberInBounds();
  }

  /**
   * @returns {string|number} The number of items for pager is tracking
   */
  get total() {
    return parseInt(this.getAttribute(attributes.TOTAL));
  }

  /**
   * Updates the state of the section containers so
   * a user doesn't have to manually input the
   * ids-section-container boilerplate as well as
   * alignment e.g. adds start/end attributes as needed for
   * their styling, and adds an extra left section
   * if only 2 sections exist for alignment sake to
   * keep things simple
   */
    #normalizeSectionContainers() {
    if (!this.hasSectionContainers()) {
      this.shadowRoot.querySelector('ids-pager-section')
        .setAttribute('role', 'navigation');
      return;
    }

    switch (this.children.length) {
    case 3:
      this.children[0].setAttribute(attributes.ALIGN, 'start');
      this.children[2].setAttribute(attributes.ALIGN, 'end');
      break;
    case 2: {
      this.children[1].setAttribute(attributes.ALIGN, 'end');

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
      break;
    default: {
      // console.error('ids-pager: invalid number of children passed');
      break;
    }
    }
  }

  #keepPageNumberInBounds() {
      let nextValue = parseInt(this.getAttribute(attributes.PAGE_NUMBER));

      if (Number.isNaN(nextValue)) {
        nextValue = 1;
      } else if (nextValue <= 1) {
        nextValue = 1;
      } else if (nextValue > this.pageCount) {
        nextValue = this.pageCount;
      }

      if (parseInt(this.getAttribute(attributes.PAGE_NUMBER)) !== nextValue) {
        this.setAttribute(attributes.PAGE_NUMBER, nextValue);
      }
    }

  /** Observes changes in content/layout */
    #contentObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          this.#normalizeSectionContainers();
          this.provideAttributes();
        }
      }
    });
}

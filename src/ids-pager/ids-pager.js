import {
  IdsElement,
  customElement,
  props,
  scss,
  mix
} from '../ids-base';
import { IdsPropCasterMixin } from '../ids-mixins';
import IdsPagerSection from './ids-pager-section';
import IdsPagerButton from './ids-pager-button';
import IdsPagerInput from './ids-pager-input';
import styles from './ids-pager.scss';

/**
 * IDS Pager Component
 * @type {IdsPager}
 * @inherits IdsElement
 * @part container the overall ids-pager container
 */
@customElement('ids-pager')
@scss(styles)
export default class IdsPager extends mix(IdsElement).with(IdsPropCasterMixin) {
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

  static get properties() {
    return [
      props.PAGE_NUMBER,
      props.PAGE_SIZE,
      props.TOTAL
    ];
  }

  get castedProperties() {
    return {
      [props.PAGE_NUMBER]: [IdsPagerSection, IdsPagerButton, IdsPagerInput],
      [props.PAGE_SIZE]: [IdsPagerSection, IdsPagerButton, IdsPagerInput],
      [props.TOTAL]: [IdsPagerSection, IdsPagerButton, IdsPagerInput]
    };
  }

  connectedCallback() {
    this.#contentObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: [props.START, props.END],
      subtree: true
    });

    this.#normalizeSectionContainers();
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
      nextValue = 0;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(props.PAGE_SIZE, nextValue);
  }

  /**
   * @returns {string|number} number of items shown per-page
   */
  get pageSize() {
    return this.getAttribute(props.PAGE_SIZE);
  }

  /**
   * @param {string|number} value 1-based page number shown
   */
  set pageNumber(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      this.setAttribute(props.PAGE_NUMBER, 0);
      nextValue = 0;
      console.error('ids-pager: non-numeric value sent to pageNumber');
    } else if (Number.parseInt(value) <= 0) {
      nextValue = 0;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(props.PAGE_NUMBER, nextValue);
  }

  /**
   * @returns {string|number} value 1-based page number displayed
   */
  get pageNumber() {
    return this.getAttribute(props.PAGE_NUMBER);
  }

  /**
   * @param {string|number} value number of items to track
   */
  set total(value) {
    let nextValue;
    if (Number.isNaN(Number.parseInt(value))) {
      console.error('ids-pager: non-numeric value sent to total');
      nextValue = 0;
    } else if (Number.parseInt(value) <= 0) {
      console.error('ids-pager: total cannot be <= 0');
      nextValue = 0;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(props.TOTAL, nextValue);
  }

  /**
   * @returns {string|number} number of items for pager is tracking
   */
  get total() {
    return this.getAttribute(props.TOTAL, 0);
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
      this.castProperties();
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

    this.castProperties();
  }

  /** observes changes in content/layout */
  #contentObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        this.#normalizeSectionContainers();
      }
    }
  });
}

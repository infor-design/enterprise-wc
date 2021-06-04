import {
  IdsElement,
  customElement,
  props,
  scss
} from '../ids-base';
import IdsPagerSection from './ids-pager-section';
import styles from './ids-pager.scss';

const mirroredProps = [
  props.COUNT,
  props.PAGE_INDEX,
  props.PAGE_ITEM_COUNT
];

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

  static get properties() {
    return [
      props.PAGE_INDEX,
      props.PAGE_ITEM_COUNT,
      props.COUNT
    ];
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
  set pageItemCount(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      console.error('ids-pager: non-numeric value sent to page-item-count');
      nextValue = 0;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(props.PAGE_ITEM_COUNT, nextValue);
    this.#mirrorPropertiesOnSections(props.PAGE_ITEM_COUNT);
  }

  /**
   * @returns {string|number} number of items shown per-page
   */
  get pageItemCount() {
    return this.getAttribute(props.PAGE_ITEM_COUNT);
  }

  /**
   * @param {string|number} value 0-based page index
   */
  set pageIndex(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      this.setAttribute(props.PAGE_INDEX, 0);
      nextValue = 0;
      console.error('ids-pager: non-numeric value sent to pageIndex');
    } else if (Number.parseInt(value) <= 0) {
      nextValue = 0;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.#mirrorPropertiesOnSections(props.PAGE_INDEX);
    this.setAttribute(props.PAGE_INDEX, nextValue);
  }

  /**
   * @returns {string|number} value 0-based page index
   */
  get pageIndex() {
    return this.getAttribute(props.PAGE_INDEX);
  }

  /**
   * @param {string|number} value number of items to track
   */
  set count(value) {
    let nextValue;
    if (Number.isNaN(Number.parseInt(value))) {
      console.error('ids-pager: non-numeric value sent to count');
      nextValue = 0;
    } else if (Number.parseInt(value) <= 0) {
      console.error('ids-pager: count cannot be <= 0');
      nextValue = 0;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(props.COUNT, nextValue);
    this.#mirrorPropertiesOnSections(props.COUNT);
  }

  /**
   * @returns {string|number} number of items for pager is tracking
   */
  get count() {
    return this.getAttribute(props.COUNT, 0);
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
      this.#mirrorPropertiesOnSections();
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

    this.#mirrorPropertiesOnSections();
  }

  /**
   * update each section to pass properties so
   * it's children can read what it also needs e.g.
   * page input value, page index, etc;
   *
   * note that because section may be in the shadowRoot
   * (and to simplify logic), we check both the Light
   * and Shadow DOM
   *
   * @param {Array|string} properties property or list-of-properties to mirror
   */
  #mirrorPropertiesOnSections(properties = mirroredProps) {
    const propsUsed = Array.isArray(properties)
      ? properties
      : [properties];

    for (const containerEl of [...this.children, ...this.shadowRoot.children]) {
      if (!(containerEl instanceof IdsPagerSection)) {
        continue;
      }

      for (const p of propsUsed) {
        containerEl.setAttribute(p, this.getAttribute(p));
      }
    }
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

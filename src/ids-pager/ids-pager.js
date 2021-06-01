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
    if (!this.hasSectionChildren()) {
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

  hasSectionChildren() {
    for (const el of this.children) {
      if (el instanceof IdsPagerSection) {
        return true;
      }
    }

    return false;
  }

  connectedCallback() {
    this.#contentObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: [props.START, props.END],
      subtree: true
    });

    this.#updateChildrenProps();
  }

  #updateChildrenProps() {
    if (!this.hasSectionChildren()) {
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

  /** observes changes in content/layout */
  #contentObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        this.#updateChildrenProps();
      }
    }
  });
}

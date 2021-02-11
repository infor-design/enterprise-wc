import { IdsElement, scss, customElement } from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
// @ts-ignore
import styles from './ids-toolbar.scss';

const TOOLBAR_SECTION_PROPS = [
  'align'
];

// Types of alignment that can apply to a section
const SECTION_ALIGNS = [
  'start',
  'center',
  'end'
];

// Types of WebComponent Tagnames that are valid toolbar items
const TOOLBAR_ITEM_TAGNAMES = [
  'ids-button',
  'ids-checkbox',
  'ids-input',
  'ids-menu-button',
  'ids-radio'
];

/**
 * IDS Toolbar Section Component
 */
@customElement('ids-toolbar-section')
@scss(styles)
class IdsToolbarSection extends IdsElement {
  constructor() {
    super();
  }

  static get properties() {
    return TOOLBAR_SECTION_PROPS;
  }

  template() {
    return `<div class="ids-toolbar-section">
      <slot></slot>
    </div>`;
  }

  /**
   * @readonly
   * @returns {Array<any>} list of available items contained by the toolbar
   */
  get items() {
    return [...this.children].filter((/** @type {any} */ e) => {
      const elemTagName = e.tagName.toLowerCase();
      return TOOLBAR_ITEM_TAGNAMES.includes(elemTagName);
    });
  }

  /**
   * @param {string} val the alignment type to set
   */
  set align(val) {
    if (typeof val !== 'string' || val === '' || !SECTION_ALIGNS.includes(val)) {
      this.removeAttribute('align');
    } else {
      this.setAttribute('align', val);
    }

    SECTION_ALIGNS.forEach((align) => {
      const cl = this.container.classList;
      const cssClass = `align-${align}`;
      const thisClass = `align-${val}`;

      if (cssClass == thisClass) {
        if (!cl.contains(cssClass)) {
          cl.add(cssClass);
        }
      } else {
        cl.remove(cssClass);
      }
    });
  }

  /**
   * @returns {string} the current alignment value
   */
  get align() {
    return this.getAttribute('align') || SECTION_ALIGNS[0];
  }
}

export default IdsToolbarSection;
export {
  TOOLBAR_ITEM_TAGNAMES
};

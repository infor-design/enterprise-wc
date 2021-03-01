import { IdsElement, scss, customElement } from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
// @ts-ignore
import styles from './ids-toolbar-section.scss';

const TOOLBAR_SECTION_PROPS = [
  'align',
  props.TYPE
];

// Alignment styles that can apply to a section
const SECTION_ALIGNS = [
  'align-start',
  'align-center',
  'align-end'
];

// Section types
const SECTION_TYPES = [
  'static',
  'buttonset',
  'fluid',
  'search',
  'title',
];

// WebComponent Tagnames that correspond to valid toolbar items
const TOOLBAR_ITEM_TAGNAMES = [
  'ids-button',
  'ids-checkbox',
  'ids-input',
  'ids-menu-button',
  'ids-radio',
  'ids-text'
];

/**
 * Checks an element's CSS classlist for an item belonging to a group,
 * appends that item, and removes all others from the group.
 * @private
 * @param {string} targetClass
 * @param {HTMLElement} targetElem
 * @param {Array<string>} group
 * @returns {void}
 */
function setCssClassFromGroup(targetClass, targetElem, group) {
  group.forEach((item) => {
    const cl = targetElem.classList;
    const cssClass = `${item}`;
    const thisClass = `${targetClass}`;

    if (cssClass === thisClass) {
      if (!cl.contains(cssClass)) {
        cl.add(cssClass);
      }
    } else {
      cl.remove(cssClass);
    }
  });
}

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
    setCssClassFromGroup(`align-${val}`, this.container, SECTION_ALIGNS);
  }

  /**
   * @returns {string} the current alignment value
   */
  get align() {
    return this.getAttribute('align') || SECTION_ALIGNS[0];
  }

  /**
   * @param {string} val the type of section
   */
  set type(val) {
    let trueVal;
    if (typeof val !== 'string' || val === '' || !SECTION_TYPES.includes(val)) {
      trueVal = SECTION_TYPES[0];
    } else {
      trueVal = `${val}`;
    }
    this.setAttribute('type', trueVal);
    setCssClassFromGroup(trueVal, this.container, SECTION_TYPES);
  }

  /**
   *
   */
  get type() {
    return this.getAttribute('type')
  }
}

export default IdsToolbarSection;
export {
  TOOLBAR_ITEM_TAGNAMES
};

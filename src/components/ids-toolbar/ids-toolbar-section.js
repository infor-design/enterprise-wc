import { attributes } from '../../core/ids-attributes';
import { customElement, scss, appendIds } from '../../core/ids-decorators';
import styles from './ids-toolbar-section.scss';
import Base from './ids-toolbar-section-base';

const TOOLBAR_SECTION_ATTRIBUTES = [
  'align',
  'toolbar-type',
  attributes.TYPE
];

// Alignment styles that can apply to a section
const SECTION_ALIGNS = [
  'align-start',
  'align-center',
  'align-center-even',
  'align-end'
];

// Toolbar types
const TOOLBAR_TYPES = ['formatter'];

// Section types
const SECTION_TYPES = [
  'static',
  'buttonset',
  'fluid',
  'search',
  'title',
  'more'
];

// WebComponent Tagnames that correspond to valid toolbar items
const TOOLBAR_ITEM_TAGNAMES = [
  'ids-button',
  'ids-checkbox',
  'ids-input',
  'ids-menu-button',
  'ids-radio',
  'ids-toolbar-more-actions'
];

// WebComponent Tagnames that correspond to valid text nodes
const TOOLBAR_TEXTNODE_TAGNAMES = [
  'ids-text'
];

// WebComponent Tagnames that correspond to valid ids-separator nodes
const TOOLBAR_SEPARATOR_TAGNAMES = [
  'ids-separator'
];

/**
 * Checks an element's CSS classlist for an item belonging to a group,
 * appends that item, and removes all others from the group.
 * @private
 * @param {string} targetClass the target CSS class to apply/check
 * @param {HTMLElement} targetElem the target elem on which to apply the class
 * @param {Array<string>} group the array of classes to scan for removal
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
 * @type {IdsToolbarSection}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-toolbar-section')
@scss(styles)
export default class IdsToolbarSection extends Base {
  constructor() {
    super();
  }

  static get attributes() {
    return [...super.attributes, ...TOOLBAR_SECTION_ATTRIBUTES];
  }

  template() {
    return `
      <div class="ids-toolbar-section">
        <slot></slot>
      </div>
    `;
  }

  connectedCallback() {
    setCssClassFromGroup(`align-${this.align}`, this.container, SECTION_ALIGNS);
    setCssClassFromGroup(this.type, this.container, SECTION_TYPES);
    setCssClassFromGroup(this.toolbarType, this.container, TOOLBAR_TYPES);
    super.connectedCallback();
  }

  /**
   * @readonly
   * @returns {Array<any>} list of available items contained by the toolbar
   */
  get items() {
    return [...this.children].filter((e) => {
      const elemTagName = e.tagName.toLowerCase();
      return TOOLBAR_ITEM_TAGNAMES.includes(elemTagName);
    });
  }

  /**
   * @readonly
   * @returns {Array<any>} list of text nodes contained by the toolbar
   */
  get textElems() {
    const nodes = [...this.children].filter((e) => {
      const elemTagName = e.tagName.toLowerCase();
      return TOOLBAR_TEXTNODE_TAGNAMES.includes(elemTagName);
    });
    return nodes;
  }

  /**
   * @readonly
   * @returns {Array<any>} list of ids-separator nodes contained by the toolbar
   */
  get separators() {
    const nodes = [...this.children].filter((e) => {
      const elemTagName = e.tagName.toLowerCase();
      return TOOLBAR_SEPARATOR_TAGNAMES.includes(elemTagName);
    });
    return nodes;
  }

  /**
   * @param {string} val the alignment type to set
   */
  set align(val) {
    let trueVal = `align-${val}`;
    if (typeof val !== 'string' || val === '' || !SECTION_ALIGNS.includes(trueVal)) {
      this.removeAttribute('align');
      trueVal = SECTION_ALIGNS[0];
    } else {
      this.setAttribute('align', val);
    }
    setCssClassFromGroup(trueVal, this.container, SECTION_ALIGNS);
  }

  /**
   * @returns {string} the current alignment value
   */
  get align() {
    return this.getAttribute('align') || 'start';
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
   * @returns {string} the type of section
   */
  get type() {
    return this.getAttribute('type') || 'static';
  }

  /**
   * @param {string} value the type of toolbar
   */
  set toolbarType(value) {
    const attr = 'toolbar-type';
    if (TOOLBAR_TYPES.includes(value)) {
      this.setAttribute(attr, value);
      this.container.classList.add(value);
    } else {
      this.removeAttribute(attr);
      this.container.classList.remove(TOOLBAR_TYPES[0]);
    }
  }

  /**
   * @returns {string} the type of toolbar
   */
  get toolbarType() {
    return this.getAttribute('toolbar-type');
  }
}

export {
  TOOLBAR_ITEM_TAGNAMES
};

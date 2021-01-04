import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import styles from './ids-menu-group.scss';

// Menu Selection Types
const MENU_GROUP_SELECT_TYPES = [
  'none',
  'single',
  'multiple'
];

/**
 * IDS Menu Group Component
 */
@customElement('ids-menu-group')
@scss(styles)
class IdsMenuGroup extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} properties
   */
  static get properties() {
    return [
      props.KEEP_OPEN,
      props.SELECT
    ];
  }

  template() {
    let describedBy = '';
    if (this.header?.id) {
      describedBy = ` aria-labelledby="${this.header.id}"`;
    }

    // Group Selection Method
    let selectProp = '';
    const selectVal = this.select;
    if (selectVal !== MENU_GROUP_SELECT_TYPES[0]) {
      selectProp = ` ${props.SELECT}="${selectVal}"`;
    }

    // Keep Open
    let keepOpenProp = '';
    if (this.keepOpen) {
      keepOpenProp = ` ${props.KEEP_OPEN}`;
    }

    return `<ul class="ids-menu-group" role="group"${keepOpenProp}${selectProp}${describedBy}><slot></slot></ul>`;
  }

  connectedCallBack() {
    this.refresh();
  }

  refresh() {
    if (this.header?.id) {
      this.container.setAttribute('aria-labelledby', `${this.header.id}`);
    } else {
      this.container.removeAttribute('aria-labelledby');
    }
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} all available menu items in this group
   */
  get items() {
    return Array.from(this.querySelectorAll('ids-menu-item, .ids-menu-item'));
  }

  /**
   * Gets this groups descriptive header, if one is defined.
   * @readonly
   * @returns {HTMLElement} containing a menu
   */
  get header() {
    const inlineHeader = this.querySelector('ids-menu-header');
    const preceedingHeader = this.previousElementSibling?.tagName === 'IDS-MENU-HEADER' && this.previousElementSibling;
    return inlineHeader || preceedingHeader;
  }

  /**
   * @returns {string|undefined} containing the type of selection this group allows
   */
  get select() {
    return this.getAttribute('select');
  }

  /**
   * @param {string} val the type of selection to set this group
   */
  set select(val) {
    let trueVal = `${val}`;
    if (MENU_GROUP_SELECT_TYPES.indexOf(trueVal) === -1) {
      trueVal = MENU_GROUP_SELECT_TYPES[0];
    }

    // Sync the attribute
    switch (trueVal) {
      case 'none':
        this.removeAttribute('select');
        break;
      default:
        this.setAttribute('select', trueVal);
    }
  }

  /**
   * @returns {boolean} true if selection of an item within this group should
   * cause the parent menu to close
   */
  get keepOpen() {
    return this.hasAttribute('keep-open');
  }

  /**
   * @param {boolean} val true if the menu should close when an item in this group is selected
   */
  set keepOpen(val) {
    const trueVal = val !== null;
    if (trueVal) {
      this.setAttribute('keep-open', '');
    } else {
      this.removeAttribute('keep-open');
    }
  }
}

export default IdsMenuGroup;

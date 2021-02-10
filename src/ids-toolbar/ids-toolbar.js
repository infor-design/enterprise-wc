import { IdsElement, scss, customElement } from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
// @ts-ignore
import styles from './ids-toolbar.scss';

// Supporting Components
import IdsToolbarSection from './ids-toolbar-section';

const TOOLBAR_PROPS = [];

// Types of WebComponent Tagnames that are valid toolbar items
const TOOLBAR_ITEM_TAGNAMES = [
  'ids-button',
  'ids-checkbox',
  'ids-input',
  'ids-menu-button',
  'ids-radio'
];

/**
 * IDS Toolbar Component
 */
@customElement('ids-toolbar')
@scss(styles)
class IdsToolbar extends IdsElement {
  constructor() {
    super();
  }

  static get properties() {
    return TOOLBAR_PROPS;
  }

  template() {
    return `<div class="ids-toolbar" role="toolbar">
      <slot></slot>
    </div>`;
  }

  /**
   * @readonly
   * @returns {Array<any>} list of available sections within the toolbar
   */
  get sections() {
    return [...this.children].filter((/** @type {any} */ e) => e.matches('ids-toolbar-section'));
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
   *
   */

}

export default IdsToolbar;
export { IdsToolbarSection };

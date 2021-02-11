import { IdsElement, scss, customElement } from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
// @ts-ignore
import styles from './ids-toolbar.scss';

// Supporting Components
import IdsToolbarSection, { TOOLBAR_ITEM_TAGNAMES } from './ids-toolbar-section';

const TOOLBAR_PROPS = [];

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
   * @returns {Array<any>} list of available items, separated per section
   */
  get items() {
    let i = [];
    this.sections.forEach((section) => {
      i = i.concat([...section.items]);
    });
    return i;
  }

}

export default IdsToolbar;
export { IdsToolbarSection, TOOLBAR_ITEM_TAGNAMES };

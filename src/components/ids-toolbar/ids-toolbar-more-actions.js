import Base from './ids-toolbar-more-actions-base';
import IdsToolbarSection from './ids-toolbar-section';
import IdsMenuButton from '../ids-menu-button/ids-menu-button';
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import { customElement, scss } from '../../core/ids-decorators';
import styles from './ids-toolbar-more-actions.scss';

/**
 * IDS Toolbar Section Component
 */
@customElement('ids-toolbar-more-actions')
@scss(styles)
export default class IdsToolbarMoreActions extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.refresh();
  }

  template() {
    return `<div class="ids-toolbar-section ids-toolbar-more-actions more">
      <ids-menu-button id="icon-button" menu="icon-menu">
        <ids-icon slot="icon" icon="more"></ids-icon>
        <span class="audible">More Actions Button</span>
      </ids-menu-button>
      <ids-popup-menu id="icon-menu" target="#icon-button" trigger="click">
        <slot></slot>
      </ids-popup-menu>
    </div>`;
  }

  /**
   * @readonly
   * @returns {IdsMenuButton} the inner menu button
   */
  get button() {
    return this.shadowRoot.querySelector('ids-menu-button');
  }

  /**
   * @readonly
   * @returns {IdsPopupMenu} the inner popup menu
   */
  get menu() {
    return this.shadowRoot.querySelector('ids-popup-menu');
  }

  /**
   * Overrides the standard toolbar section "type" setter, which is always "more" in this case.
   * @param {string} val the type value
   */
  set type(val) {
    this.removeAttribute('type');
  }

  /**
   * Overrides the standard toolbar section "type" getter, which always returns "more" in this case.
   * @returns {string} representing the Toolbar Section type
   */
  get type() {
    return 'more';
  }

  /**
   * Refreshes the state of the More Actions button
   * @returns {void}
   */
  refresh() {
    this.menu.popup.align = 'bottom, right';
    this.menu.popup.alignEdge = 'bottom';
  }

  /**
   * Passes focus from the main element into the inner Ids Menu Button
   * @returns {void}
   */
  focus() {
    this.button.focus();
  }
}

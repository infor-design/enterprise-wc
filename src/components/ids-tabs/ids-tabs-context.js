import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-tabs-context-base';
import IdsTabContent from './ids-tab-content';

import styles from './ids-tabs.scss';

/**
 * IDS Tabs Context Component
 * @type {IdsTabsContext}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the container of all tabs
 */
@customElement('ids-tabs-context')
@scss(styles)
export default class IdsTabsContext extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [attributes.VALUE];
  }

  template() {
    return '<slot></slot>';
  }

  connectedCallback() {
    super.connectedCallback?.();

    this.onEvent('tabselect', this, (e) => {
      e.stopPropagation();
      this.value = e.target.value;
    });
  }

  /** @param {string} value The value representing a currently selected tab */
  set value(value) {
    const currentValue = this.getAttribute(attributes.VALUE);
    if (currentValue !== value) {
      this.setAttribute(attributes.VALUE, value);
      this.#changeContentPane(currentValue, value);
    }
  }

  get value() {
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * Switches the "Active" content pane associated with this Tabs Context
   * @param {string} currentValue the value of the current pane, used to make it inactive
   * @param {string} newValue the value of the new pane, used to make it active
   */
  #changeContentPane(currentValue, newValue) {
    const contentPanes = [...this.querySelectorAll('ids-tab-content')];
    const currentPane = contentPanes.find((el) => el.value === currentValue);
    const targetPane = contentPanes.find((el) => el.value === newValue);
    if (currentPane) currentPane.active = false;
    if (targetPane) targetPane.active = true;
  }
}

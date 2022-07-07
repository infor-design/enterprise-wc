import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-tabs-context-base';
import './ids-tab-content';

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

  connectedCallback() {
    super.connectedCallback();

    this.onEvent('tabselect', this, (e: { stopPropagation: () => void; target: { value: any; onAction?: CallableFunction }; }) => {
      e.stopPropagation();
      this.value = e.target.value;
    });

    // On `tabremove` events, remove a tab's corresponding content pane
    this.onEvent('tabremove', this, (e: CustomEvent) => {
      e.stopPropagation();
      const content = this.querySelector(`ids-tab-content[value="${e.detail.value}"]`);
      content?.remove();
    });
  }

  mountedCallback() {
    this.value = this.querySelector('[selected]')?.value;
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.VALUE
    ];
  }

  template() {
    return '<slot></slot>';
  }

  /** @param {string} value The value representing a currently selected tab */
  set value(value: string) {
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
  #changeContentPane(currentValue: any, newValue: any) {
    const contentPanes = [...this.querySelectorAll('ids-tab-content')];
    const currentPane = contentPanes.find((el) => el.value === currentValue);
    const targetPane = contentPanes.find((el) => el.value === newValue);
    if (currentPane) currentPane.active = false;
    if (targetPane) targetPane.active = true;
  }
}

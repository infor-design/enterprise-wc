import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import './ids-tab-content';

import styles from './ids-tabs.scss';
import type IdsTabContent from './ids-tab-content';

/**
 * IDS Tabs Context Component
 * @type {IdsTabsContext}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the container of all tabs
 */
@customElement('ids-tabs-context')
@scss(styles)
export default class IdsTabsContext extends IdsEventsMixin(IdsElement) {
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
    this.#afterConnectedCallback();
  }

  #afterConnectedCallback() {
    this.value = this.querySelector<IdsTabContent>('[selected]')?.value ?? null;
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
  set value(value: string | null) {
    const currentValue = this.getAttribute(attributes.VALUE);
    if (currentValue !== value) {
      this.setAttribute(attributes.VALUE, String(value));
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
    const contentPanes = [...this.querySelectorAll<IdsTabContent>('ids-tab-content')];
    const currentPane = contentPanes.find((el) => el.value === currentValue);
    const targetPane = contentPanes.find((el) => el.value === newValue);
    if (currentPane) currentPane.active = false;
    if (targetPane) targetPane.active = true;
  }
}

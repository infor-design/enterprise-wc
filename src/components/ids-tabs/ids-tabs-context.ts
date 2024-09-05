import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { setBooleanAttr } from '../../utils/ids-attribute-utils/ids-attribute-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsOrientationMixin from '../../mixins/ids-orientation-mixin/ids-orientation-mixin';
import IdsElement from '../../core/ids-element';

import './ids-tab-content';

import styles from './ids-tabs-context.scss';

import type IdsTabContent from './ids-tab-content';
import type IdsTabs from './ids-tabs';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import type { IdsValidateEvent, IdsValidatedElement } from '../../mixins/ids-validation-mixin/ids-validation-mixin';

const Base = IdsOrientationMixin(
  IdsEventsMixin(
    IdsElement
  )
);

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

    // Set active pane when content is inserted dynamically
    this.onEvent('slotchange', this.container, () => {
      this.#changeContentPane(this.value, this.value);
    });

    this.onEvent('validate', this, (e: IdsValidateEvent) => {
      const content = e.detail.elem?.closest<IdsTabContent>('ids-tab-content');
      if (!content) {
        return;
      }
      const tab = this.tabList?.tabs.find(({ value }) => value === content.value);
      if (!tab) {
        return;
      }
      const validatedElements = content.querySelectorAll<IdsValidatedElement>('[validate]');
      const valid = [...validatedElements].every((el) => el.isValid);
      tab.hasError = !valid;
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
      attributes.AUTO_FIT,
      attributes.VALUE
    ];
  }

  template() {
    return '<slot></slot>';
  }

  /**
   * @readonly
   * @returns {IdsTabs} reference to the internal IdsTabs list
   */
  get tabList() {
    return this.querySelector<IdsTabs>('ids-tabs');
  }

  /**
   * Set the tabs context element to auto fit to its parent container's size
   * @param {boolean|string|null} value The auto fit
   */
  set autoFit(value) {
    setBooleanAttr(attributes.AUTO_FIT, this, stringToBool(value));
  }

  get autoFit(): boolean | string | null {
    return this.hasAttribute(attributes.AUTO_FIT);
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

  /**
   * Inherited from IdsOrientationMixin
   */
  onOrientationRefresh(): void {
    if (this.orientation) this.tabList?.setAttribute(attributes.ORIENTATION, this.orientation);
  }
}

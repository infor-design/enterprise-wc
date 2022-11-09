import { camelCase } from '../utils/ids-string-utils/ids-string-utils';

export type IdsBaseConstructor = new (...args: any[]) => IdsNode;
export type IdsConstructor<T> = new (...args: any[]) => T & IdsNode;

/**
 * IDS Base Element
 */
export default class IdsNode extends HTMLElement {
  /** State object for current states */
  state: Record<string, any> = {};

  constructor() {
    super();
  }

  connectedCallback() {
    debugger;
  }

  /**
   * Handle Setting changes of the value has changed by calling the getter
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    (this as any)[camelCase(name)] = newValue;
  }

  /**
   * Handle Changes on Properties, this is part of the web component spec.
   * @type {Array}
   */
  static get observedAttributes() {
    return this.attributes;
  }

  /**
   * @returns {Array<string>} this component's observable properties
   */
  static get attributes(): Array<string> {
    return [];
  }

  /**
   * @returns {string} containing this component's HTML Template
   */
  template() {
    return '';
  }
}

import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-form-base';
import styles from './ids-form.scss';

// Supporting components
import '../ids-button/ids-button';
import '../ids-input/ids-input';
import '../ids-checkbox/ids-checkbox';
import '../ids-editor/ids-editor';
import '../ids-dropdown/ids-dropdown';
import '../ids-radio/ids-radio';
import '../ids-color-picker/ids-color-picker';
import '../ids-time-picker/ids-time-picker';
import '../ids-date-picker/ids-date-picker';
import '../ids-fieldset/ids-fieldset';

@customElement('ids-form')
@scss(styles)

/**
 * IDS Form Component
 * @type {IdsForm}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */

export default class IdsForm extends Base {
  constructor() {
    super();
  }

  static get attributes(): string[] {
    return [
      ...super.attributes,
      attributes.AUTOCOMPLETE,
      attributes.COMPACT,
      attributes.ID,
      attributes.METHOD,
      attributes.NAME,
      attributes.TARGET,
      attributes.TITLE
    ];
  }

  connectedCallback() {
  }

  /**
   * Create the template for the header contents
   * @returns {string} The template
   */
  template(): string {
    return `<form><slot></slot></form>`
  }

  /**
   * Sets the autocomplete attribute
   * @param {string} value string value for autocomplete
   */
  set autocomplete(value: string) {
    if(value) {
      this.setAttribute('autocomplete', value);
    }
  }

  get autocomplete(): string {
    return this.getAttribute('autocomplete') || '';
  }

  /**
   * Sets the compact attribute
   * @param {boolean | string} value string value for compact
   */
  set compact(value: boolean | string) {
    if(value) {
      this.setAttribute('compact', value);
    }
  }

  get compact(): string {
    return this.getAttribute('compact') || '';
  }
  
  /**
   * Sets the id attribute
   * @param {number | string | any} value string value for id
   */
  set id(value: number | string | any) {
    if(value) {
      this.setAttribute('id', value);
    }
  }

  get id(): string {
    return this.getAttribute('id') || '';
  }

  /**
   * Sets the method attribute
   * @param {string} value string value for method
   */
  set method(value: string) {
    if(value) {
      this.setAttribute('method', value);
    }
  }

  get method(): string {
    return this.getAttribute('method') || '';
  }

  /**
   * Sets the name attribute
   * @param {string} value string value for name
   */
  set name(value: string) {
    if(value) {
      this.setAttribute('name', value);
    }
  }

  get name(): string {
    return this.getAttribute('name') || '';
  }

  /**
   * Sets the target attribute
   * @param {string} value string value for target
   */
  set target(value: string) {
    if(value) {
      this.setAttribute('target', value);
    }
  }

  get target(): string {
    return this.getAttribute('target') || '';
  }

  /**
   * Sets the title attribute
   * @param {string} value string value for title
   */
  set title(value: string) {
    if(value) {
      this.setAttribute('title', value);
    }
  }

  get title(): string {
    return this.getAttribute('title') || '';
  }
}
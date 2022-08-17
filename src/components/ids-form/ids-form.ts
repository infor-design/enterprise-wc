import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-form-base';

/**
 * IDS Form Component
 * @type {IdsForm}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-form')
export default class IdsForm extends Base {
  constructor() {
    super();
  }

  static get attributes(): string[] {
    return [
      ...super.attributes,
      attributes.COMPACT,
      attributes.NAME,
      attributes.SUBMIT_BUTTON
    ];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Create the template for the header contents
   * @returns {string} The template
   */
  template(): string {
    let formAttribs = '';
    formAttribs += this.name ? ` name="${this.name}"` : '';
    return `<form${formAttribs}><slot></slot></form>`;
  }

  /**
   * Sets the compact attribute
   * @param {boolean | string} value string value for compact
   */
  set compact(value: string) {
    const isCompact = stringToBool(value);

    if (value) {
      this.setAttribute('compact', value);
      const formComponents: Element[] = this.formComponents;
      [...formComponents].forEach((el) => {
        if (isCompact) el.setAttribute('compact', value);
        else el.removeAttribute('compact');
      });
    }
  }

  get compact(): string {
    return this.getAttribute('compact') || '';
  }

  /**
   * Sets the name attribute
   * @param {string} value string value for name
   */
  set name(value: string) {
    if (value) {
      const form: HTMLElement[] = this.shadowRoot.childNodes;
      form[1].setAttribute('name', value);
      this.setAttribute('name', value);
    }
  }

  get name(): string {
    return this.getAttribute('name') || '';
  }

  /**
   * Attached a button to the form to submit the form.
   * @param {string} value string value for title
   */
  set submitButton(value: string) {
    if (value) {
      this.setAttribute(attributes.SUBMIT_BUTTON, value);
      this.onEvent('click.submit', this.querySelector(`#${value}`), () => {
        const formElems: Element[] = this.formComponents;
        const formValues: object[] = [];
        formElems.forEach((el: any) => formValues.push({
          nodeName: el.nodeName,
          value: el.value,
          id: el.id,
          name: el.name
        }));
        this.triggerEvent('submit', this, { bubbles: true, detail: { components: formValues } });
      });
      return;
    }
    this.offEvent('click.submit');
    this.removeAttribute(attributes.SUBMIT_BUTTON);
  }

  get submitButton(): string {
    return this.getAttribute('title') || '';
  }

  /**
   * Returns an array containing only IdsElements
   * @private
   * @returns {Element[]} Array of IdsElements
   */
  get idsComponents(): Element[] {
    const elements: Element[] = [];
    const form: IdsForm = this;
    const findIdsElements = (el: Element | any) => {
      if (el.hasChildNodes()) {
        const formChildren = [...el.children];
        formChildren.forEach((e: Element) => {
          if (e.tagName.includes('IDS-')) {
            elements.push(e);
          }
          findIdsElements(e);
        });
      }
    };
    findIdsElements(form);
    return elements;
  }

  /**
   * Returns an array containing only Ids Elements that are considered form components.
   * @private
   * @returns {Element[]} Array of IdsElements
   */
  get formComponents(): Element[] {
    const idsElements: Element[] = this.idsComponents;
    const idsFormComponents: Element[] = idsElements.filter((item) => (item as any).isFormComponent === true);
    return idsFormComponents;
  }

  /**
   * Resets the dirty indicator on all form components.
   */
  resetDirtyTracker() {
    const formElems: Element[] = this.formComponents;
    formElems.forEach((el: any) => {
      if (el.resetDirtyTracker) el.resetDirtyTracker();
    });
  }

  /**
   * Returs all dirty form components.
   * @returns {Array<Element>} The elements that are dirty.
   */
  dirtyFormComponents() {
    const formElems: Element[] = this.formComponents;
    return formElems.filter((item) => (item as any).isDirty === true);
  }
}

import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsFieldHeightMixin, { FIELD_HEIGHTS } from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsFieldHeightMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Form Component
 * @type {IdsForm}
 * @inherits IdsElement
 * @mixes IdsFieldHeightMixin
 * @mixes IdsEventsMixin
 * @part form - the form element
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
      attributes.SUBMIT_BUTTON
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.attachSubmitButtonListener();
  }

  /**
   * Create the template for the header contents
   * @returns {string} The template
   */
  template(): string {
    let formAttribs = '';
    formAttribs += this.name ? ` name="${this.name}"` : '';
    return `<form${formAttribs} part="form"><slot></slot></form>`;
  }

  /**
   * Attach event listener to the submit button
   */
  private attachSubmitButtonListener() {
    if (this.submitButton) {
      const button = this.querySelector(`#${this.submitButton}`);
      this.offEvent('click.form-submit');
      if (button) {
        this.onEvent('click.form-submit', button, () => {
          const formElems: Element[] = this.formComponents;
          const formValues: object[] = [];
          formElems.forEach((el: any) => formValues.push({
            nodeName: el.nodeName,
            value: ['IDS-CHECKBOX', 'IDS-SWITCH'].includes(el.nodeName) ? el.checked : el.value,
            id: el.id,
            name: el.name,
            isDirty: el.isDirty,
            isValid: el.isValid,
            originalValue: el.dirty?.original,
            validationMessages: el.validationMessages
          }));
          this.triggerEvent('submit', this, { bubbles: true, composed: true, detail: { components: formValues } });
        });
      }
    }
  }

  /**
   * Sets the compact attribute
   * @param {boolean | string} value string value for compact
   */
  set compact(value: boolean | string) {
    const isCompact = stringToBool(value);
    super.compact = value;

    const formComponents: Element[] = this.formComponents;
    [...formComponents].forEach((el) => {
      if (isCompact) el.setAttribute(attributes.COMPACT, value.toString());
      else el.removeAttribute(attributes.COMPACT);
    });
  }

  get compact(): boolean {
    return stringToBool(this.getAttribute(attributes.COMPACT)) || false;
  }

  /**
   * Set the fieldHeight (height) of input
   * @param {string} value [xs, sm, md, lg]
   */
  set fieldHeight(value: string) {
    super.fieldHeight = value;

    const formComponents: Element[] = this.formComponents;
    [...formComponents].forEach((el) => {
      if (value) el.setAttribute(attributes.FIELD_HEIGHT, value.toString());
      else el.removeAttribute(attributes.FIELD_HEIGHT);
    });
  }

  get fieldHeight(): string {
    return this.getAttribute(attributes.FIELD_HEIGHT) ?? FIELD_HEIGHTS.default;
  }

  /**
   * Set the id of the submit button
   * @param {string | null} value id of the button to attach event listener
   */
  set submitButton(value: string | null) {
    if (value) {
      this.setAttribute(attributes.SUBMIT_BUTTON, value);
      this.attachSubmitButtonListener();
      return;
    }
    this.offEvent('click.form-submit');
    this.removeAttribute(attributes.SUBMIT_BUTTON);
  }

  get submitButton(): string {
    return this.getAttribute(attributes.SUBMIT_BUTTON) || '';
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
   * Runs validation on each input
   */
  checkValidation() {
    const formElems: Element[] = this.formComponents;
    formElems.forEach((el: any) => {
      if (el?.input?.checkValidation) el?.input?.checkValidation();
      if (el?.checkValidation) el?.checkValidation();
    });
  }

  /**
   * Return if and form fields are dirty or not
   * @returns {boolean} true if dirty
   */
  get isDirty(): boolean {
    return this.dirtyFormComponents.length > 0;
  }

  /**
   * Returs all dirty form components.
   * @returns {Array<Element>} The elements that are dirty.
   */
  get dirtyFormComponents(): Array<Element> {
    const formElems: Element[] = this.formComponents;
    return formElems.filter((item) => (item as any).isDirty === true);
  }

  /**
   * Return if the form is valid or not
   * @returns {boolean} true if invalid
   */
  get isValid(): boolean {
    return this.errorFormComponents.length === 0;
  }

  /**
   * Return the inputs with validation errors
   * @returns {Array<Element>} The current form elements with errors
   */
  get errorFormComponents(): Array<Element> {
    const formElems: Element[] = this.formComponents;
    return formElems.filter((item) => (item as any).isValid === false);
  }
}

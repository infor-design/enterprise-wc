import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
import type IdsCheckbox from './ids-checkbox';

import styles from './ids-checkbox-group.scss';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

/**
 * IDS Checkbox Group Component
 * @type {IdsCheckboxGroup}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part checkbox-group - the checkbox-group element
 */
@customElement('ids-checkbox-group')
@scss(styles)
export default class IdsCheckboxGroup extends IdsEventsMixin(IdsElement) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.LABEL,
      attributes.CHECKED,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template(): string {
    return `
      <div class="ids-checkbox-group" part="checkbox-group">
        <ids-text font-size="16" type="span">${this.label}</ids-text>
        <slot></slot>
      </div>
    `;
  }

  /**
   * Return the label of checkbox-group
   * @returns {string} label
   */
  get label(): string { return this.getAttribute('label') || ''; }

  /**
   * Set the label of checkbox-group
   * @param {string} value label
   */
  set label(value: string) {
    if (value) {
      this.setAttribute('label', value.toString());
    } else {
      this.removeAttribute('label');
    }

    const textElem = this.container?.querySelector('ids-text');
    if (textElem) textElem.innerHTML = value;
  }

  /**
   * Get child ids-checkbox inputs in this group
   * @returns {IdsCheckbox[]} list of checkboxes
   */
  get checkboxes(): IdsCheckbox[] {
    return [...this.querySelectorAll<IdsCheckbox>('ids-checkbox')];
  }

  /**
   * Get the selected ids-checkbox inputs in this group
   * @returns {IdsCheckbox[]} list of selected checkboxes
   */
  get selectedCheckboxes(): IdsCheckbox[] {
    return [...this.querySelectorAll<IdsCheckbox>('ids-checkbox[checked]')];
  }

  get checked(): boolean[] {
    return this.checkboxes.map((checkbox) => stringToBool(checkbox.value));
  }

  /**
   * Set value for group
   * @private
   * @returns {void}
   */
  set checked(value: boolean | boolean[]) {
    const values = Array.isArray(value) ? value : [value];
    const lastValue = values.at(-1) || false;
    this.checkboxes.forEach((checkbox, idx) => {
      checkbox.checked = stringToBool(values[idx] ?? lastValue);
    });
  }
}

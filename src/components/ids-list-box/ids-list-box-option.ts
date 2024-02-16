import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-list-box-option.scss';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import '../ids-checkbox/ids-checkbox';
import '../ids-icon/ids-icon';

import type IdsCheckbox from '../ids-checkbox/ids-checkbox';
import type IdsIcon from '../ids-icon/ids-icon';

const Base = IdsTooltipMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS List Box Option Component
 * @type {IdsListBoxOption}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsTooltipMixin
 * @part option - the option element
 */
@customElement('ids-list-box-option')
@scss(styles)
export default class IdsListBoxOption extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array<any>} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [
      ...super.attributes,
      attributes.GROUP_LABEL,
      attributes.ROW_INDEX,
      attributes.SELECTED,
      attributes.TOOLTIP,
      attributes.VALUE
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', this.groupLabel ? 'none' : 'option');
    this.setAttribute('tabindex', '-1');
    this.#hideEmptyGroupOption();
  }

  #hideEmptyGroupOption() {
    const nextOption = this.nextElementSibling as IdsListBoxOption;
    this.hidden = this.groupLabel && (!nextOption || nextOption.groupLabel);
  }

  /**
   * Create the template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<slot></slot>`;
  }

  /**
   * Get nested ids-checkbox child
   * @returns {IdsCheckbox | undefined} - nested ids-checkbox child
   */
  get childCheckbox(): IdsCheckbox | undefined {
    return this?.querySelector<IdsCheckbox>('ids-checkbox') ?? undefined;
  }

  get childIcon(): IdsIcon | undefined {
    return this.querySelector<IdsIcon>('ids-icon') ?? undefined;
  }

  get label(): string { return this.textContent?.trim() || this.childCheckbox?.label || ''; }

  get groupLabel(): boolean { return this.hasAttribute(attributes.GROUP_LABEL); }

  set groupLabel(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.GROUP_LABEL, 'true');
    } else {
      this.removeAttribute(attributes.GROUP_LABEL);
    }
  }

  set value(value: string | null) { this.setAttribute(attributes.VALUE, `${value ?? ''}`); }

  get value(): string { return this.getAttribute(attributes.VALUE) ?? ''; }

  /**
   * Set the selected state on the list-box-option
   * @param {boolean} val true if this option should appear "selected"
   */
  set selected(val) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.SELECTED, 'true');
      this.container?.classList.add('is-selected');
      if (this.childCheckbox) this.childCheckbox.checked = true;
    } else {
      this.removeAttribute(attributes.SELECTED);
      this.container?.classList.remove('is-selected');
      if (this.childCheckbox) this.childCheckbox.checked = false;
    }
  }

  get selected() {
    return stringToBool(this.getAttribute(attributes.SELECTED));
  }

  /**
   * Set the row index. This index will be used to sort options in ids-list-box component.
   * @param {number} value the index
   */
  set rowIndex(value: number) {
    if (value !== null && value >= 0) {
      this.setAttribute(attributes.ROW_INDEX, String(value));
    } else {
      this.removeAttribute(attributes.ROW_INDEX);
    }
  }

  /**
   * Gets the row index # of this row.
   * @returns {number} the row-index
   */
  get rowIndex(): number { return Number(this.getAttribute(attributes.ROW_INDEX) ?? -1); }
}

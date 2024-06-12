import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import { IdsInputInterface } from '../ids-input/ids-input-attributes';
import IdsMenuButton from '../ids-menu-button/ids-menu-button';
import IdsMenuGroup from '../ids-menu/ids-menu-group';
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import styles from './ids-filter-field.scss';

const Base = IdsEventsMixin(IdsElement);

export interface FilterFieldOperator {
  value: string;
  text: string;
  icon: string;
  selected?: boolean;
}

export const FilterFieldTypes = ['text', 'date', 'time', 'dropdown'];

/**
 * IDS Filter Field Component
 * @type {IdsFilterField}
 * @mixes IdsEventsMixin
 * @mixes IdsLabelStateMixin
 */
@customElement('ids-filter-field')
@scss(styles)
export default class IdsFilterField extends Base {
  #operators: FilterFieldOperator[] = [];

  /** Cache last input change event data for next change event */
  #lastInputChange: Record<string, any> = {};

  /** Flag to prevent change event from triggering */
  #suppressChangeEvent = false;

  constructor() {
    super();
  }

  static get attributes(): string[] {
    return [
      ...super.attributes,
      attributes.LABEL,
      attributes.OPERATOR,
      attributes.SIZE,
      attributes.VALUE
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#attachEventHandlers();
  }

  template() {
    return `<div class="ids-filter-field">
      <div class="field-container">
        <ids-menu-button id="operator-button" menu="operator-menu" icon="filter-equals" dropdown-icon>
          <span class="audible">Icon only button</span>
        </ids-menu-button>
        <ids-popup-menu id="operator-menu" target="opereator-button" trigger-type="click">
          <ids-menu-group select="single">
            <ids-menu-item value="equals" icon="filter-equals" selected="true">Equals</ids-menu-item>
            <ids-menu-item value="in-range" icon="filter-in-range">In Range</ids-menu-item>
            <ids-menu-item value="does-not-equal" icon="filter-does-not-equal">Does Not Equal</ids-menu-item>
            <ids-menu-item value="before" icon="filter-less-than">Before</ids-menu-item>
            <ids-menu-item value="on-or-before" icon="filter-less-equals">On Or Before</ids-menu-item>
            <ids-menu-item value="after" icon="filter-greater-than">After</ids-menu-item>
            <ids-menu-item value="on-or-after" icon="filter-greater-equals">On Or After</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
        <slot id="input-slot"></slot>
      </div>
    </div>`;
  }

  #attachEventHandlers() {
    const inputSlot = this.container?.querySelector<HTMLSlotElement>('#input-slot');
    this.offEvent('slotchange', inputSlot);
    this.onEvent('slotchange', inputSlot, () => {
      this.#configureInputElement(this.inputElement);
      this.#attachInputChangeHandler(this.inputElement);
    });

    this.offEvent('selected.operators', this.menu);
    this.onEvent('selected.operators', this.menu, (evt: CustomEvent) => {
      evt.stopPropagation();
      this.#updateOperatorIcon(evt.detail.elem.icon);
      this.triggerChangeEvent();
    });
  }

  #attachInputChangeHandler(inputElement?: Element) {
    this.onEvent('change.input', inputElement, (evt: CustomEvent) => {
      evt.stopPropagation();
      this.#lastInputChange = { ...evt.detail };
      this.triggerChangeEvent();
    });
  }

  #updateOperatorIcon(icon: string) {
    this.menuButton?.setAttribute(attributes.ICON, icon);
  }

  triggerChangeEvent() {
    if (this.#suppressChangeEvent) return;

    this.triggerEvent('change', this, {
      detail: {
        operator: this.operator,
        ...this.#lastInputChange,
        value: this.value,
        elem: this.inputElement
      }
    });
  }

  /**
   * Syncs slotted input element labels/id with filter field
   * @param {string} label label string
   */
  #syncInputLabel(label: string | null) {
    const inputElement = this.inputElement;
    const safeLabel = stripHTML(label ?? '');

    if (inputElement && safeLabel) {
      this.setAttribute(attributes.LABEL, safeLabel);
      this.inputElement?.setAttribute(attributes.LABEL, safeLabel);
    } else {
      this.removeAttribute(attributes.LABEL);
      this.inputElement.removeAttribute(attributes.LABEL);
    }
  }

  /**
   * Initial configuration of slotted input element
   * @param {Element} inputElement input element
   */
  #configureInputElement(inputElement?: Element) {
    if (!inputElement) return;
    const inputLabel = this.inputElementLabel;
    const operatorBtn = this.container?.querySelector('ids-menu-button');

    inputLabel?.style.setProperty('margin-inline-start', `-${operatorBtn?.clientWidth || 52}px`);
    inputElement.toggleAttribute(attributes.NO_MARGINS, true);
    inputElement.setAttribute(attributes.SIZE, this.size);
    inputElement.toggleAttribute(attributes.SQUARE, true);
    (inputElement as IdsInputInterface)?.input.toggleAttribute('square', true);
    this.#syncInputLabel((inputElement as any).label || this.label);
  }

  /**
   * Renders operators configuration in menu element
   * @param {Array<FilterFieldOperator>} operators operators config
   */
  #renderOperators(operators: FilterFieldOperator[]) {
    if (!operators.length || !this.isConnected) return;

    const menuGroup = this.container?.querySelector<IdsMenuGroup>('ids-menu-group');
    if (menuGroup) {
      menuGroup.innerHTML = this.#operatorsTemplate(operators);
      menuGroup.refresh();
    }
  }

  #operatorsTemplate(operators: FilterFieldOperator[]): string {
    return operators.map((operator) => {
      const value = `value="${operator.value}"`;
      const icon = `icon="${operator.icon}"`;
      const selected = operator.selected ? 'selected' : '';
      const menuItem = `<ids-menu-item ${value} ${icon} ${selected}>${operator.text}</ids-menu-item>`;

      return menuItem;
    }).join('');
  }

  /**
   * Gets slotted input element
   * @returns {HTMLElement} input element
   */
  get inputElement() {
    return this.container?.querySelector<HTMLSlotElement>('#input-slot')?.assignedElements()[0] as HTMLElement || null;
  }

  get inputElementLabel() {
    const inputElement = this.inputElement;

    if (inputElement.tagName === 'IDS-INPUT') {
      return inputElement.shadowRoot?.querySelector<HTMLLabelElement>('label');
    }

    const inputTriggerField = inputElement.shadowRoot?.querySelector('ids-trigger-field');
    return inputTriggerField?.shadowRoot?.querySelector<HTMLLabelElement>('label');
  }

  /**
   * Gets operators menu button element
   * @returns {IdsMenuButton}  operator menu button
   */
  get menuButton() {
    return this.container?.querySelector<IdsMenuButton>('ids-menu-button');
  }

  /**
   * Gets operator menu
   * @returns {IdsPopupMenu} operator menu
   */
  get menu() {
    return this.container?.querySelector<IdsPopupMenu>('ids-popup-menu');
  }

  /**
   * Sets input element value
   * @param {string} val input value
   */
  set value(val: string) {
    this.inputElement?.setAttribute(attributes.VALUE, val);
  }

  /**
   * Gets input element value
   * @returns {string} input element value
   */
  get value() {
    return (this.inputElement as IdsInputInterface)?.value || this.inputElement?.getAttribute(attributes.VALUE);
  }

  /**
   * Sets operator
   * @param {string} op operator id
   */
  set operator(op: string) {
    this.setAttribute(attributes.OPERATOR, op);
    this.menuButton?.setAttribute(attributes.VALUE, op);
  }

  /**
   * Gets selected operator
   * @returns {string} operator id
   */
  get operator(): string {
    return Array.isArray(this.menuButton?.value) ? this.menuButton?.value[0] : this.menuButton?.value;
  }

  /**
   * Sets operators config for menu button
   * @param {Array<FilterFieldOperator>} val operators configuration
   */
  set operators(val: FilterFieldOperator[]) {
    this.#suppressChangeEvent = true;
    if (val?.length) {
      this.#operators = val;
      this.#renderOperators(this.#operators);
      const selectedOperator = val.find((op) => op.selected)?.value || val[0].value;
      this.menuButton?.setAttribute(attributes.VALUE, selectedOperator);
    }
    this.#suppressChangeEvent = false;
  }

  /**
   * Gets operators config
   * @returns {Array<FilterFieldOperator>} operators configuration
   */
  get operators(): FilterFieldOperator[] {
    return this.#operators;
  }

  /**
   * Sets label of input component
   * @param {string|null} val label string
   */
  set label(val: string | null) {
    const safeLabel = stripHTML(val ?? '');

    if (safeLabel) {
      this.setAttribute(attributes.LABEL, safeLabel);
    } else {
      this.removeAttribute(attributes.LABEL);
    }

    this.#syncInputLabel(safeLabel);
  }

  /**
   * Gets label of input component
   * @returns {string|null} label string
   */
  get label() {
    return this.getAttribute(attributes.LABEL);
  }

  /**
   * Sets size
   * @param {string} val size
   */
  set size(val: string) {
    this.setAttribute(attributes.SIZE, val);
    this.inputElement?.setAttribute(attributes.SIZE, val);
  }

  /**
   * Gets size
   * @returns {string} size
   */
  get size(): string {
    return this.getAttribute(attributes.SIZE) ?? 'md';
  }
}

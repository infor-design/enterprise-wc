import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLabelStateMixin from '../../mixins/ids-label-state-mixin/ids-label-state-mixin';
import IdsInput from '../ids-input/ids-input';
import { IdsInputInterface } from '../ids-input/ids-input-attributes';
import IdsMenuButton from '../ids-menu-button/ids-menu-button';
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import styles from './ids-filter-field.scss';

const Base = IdsLabelStateMixin(IdsEventsMixin(IdsElement));

export interface FilterFieldOperator {
  value: string;
  text: string;
  icon: string;
  selected?: boolean;
}

export const FilterFieldTypes = ['text', 'date', 'time', 'dropdown'];

@customElement('ids-filter-field')
@scss(styles)
export default class IdsFilterField extends Base {
  #operators: FilterFieldOperator[] = [];

  constructor() {
    super();
  }

  static get attributes(): string[] {
    return [
      ...super.attributes,
      attributes.SIZE
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#attachEventHandlers();
  }

  template() {
    return `<div class="ids-filter-field">
      <label>
        <ids-text part="label" color-unset>${this.label}</ids-text>
      </label>
      <div class="field-container">
        <ids-menu-button id="operator-button" menu="operator-menu" icon="filter-equals" dropdown-icon value="equals">
          <span class="audible">Icon only button</span>
        </ids-menu-button>
        <ids-popup-menu id="operator-menu" target="opereator-button" trigger-type="click">
          <ids-menu-group select="single">
            ${this.defaultOperatorsTemplate()}
          </ids-menu-group>
        </ids-popup-menu>
        <slot id="input-slot"></slot>
      </div>
    </div>`;
  }

  defaultOperatorsTemplate(): string {
    return this.operatorsTemplate([
      { value: 'equals', text: 'Equals', icon: 'filter-equals' },
      { value: 'in-range', text: 'In Range', icon: 'filter-in-range' },
      { value: 'does-not-equal', text: 'Does Not Equal', icon: 'filter-does-not-equal' },
      { value: 'before', text: 'Before', icon: 'filter-less-than' },
      { value: 'on-or-before', text: 'On Or Before', icon: 'filter-less-equals' },
      { value: 'after', text: 'After', icon: 'filter-greater-than' },
      { value: 'on-or-after', text: 'On Or After', icon: 'filter-greater-equals' },
    ]);
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
      this.#triggerChangeEvent();
    });
  }

  #attachInputChangeHandler(inputElement?: Element) {
    this.onEvent('change.input', inputElement, (evt: CustomEvent) => {
      evt.stopPropagation();
      this.#triggerChangeEvent();
    });
  }

  #updateOperatorIcon(icon: string) {
    this.menuButton?.setAttribute(attributes.ICON, icon);
  }

  #triggerChangeEvent() {
    this.triggerEvent('change', this, {
      detail: {
        operator: this.menuButton?.value?.[0],
        value: (this.inputElement as IdsInputInterface).value
      }
    });
  }

  #configureInputElement(inputElement?: Element) {
    if (!inputElement) return;
    inputElement.toggleAttribute(attributes.NO_MARGINS, true);
    inputElement.setAttribute(attributes.LABEL_STATE, 'collapsed');
    inputElement.setAttribute(attributes.SIZE, this.size);
    inputElement.toggleAttribute(attributes.SQUARE, true);
  }

  renderOperators(operators: FilterFieldOperator[]) {
    if (!operators.length || !this.isConnected) return;

    const menuGroup = this.container?.querySelector('ids-menu-group');
    if (menuGroup) menuGroup.innerHTML = this.operatorsTemplate(operators);
  }

  operatorsTemplate(operators: FilterFieldOperator[]): string {
    return operators.map((operator) => {
      const value = `value="${operator.value}"`;
      const icon = `icon="${operator.icon}"`;
      const selected = operator.selected ? 'selected' : '';
      const menuItem = `<ids-menu-item ${value} ${icon} ${selected}>${operator.text}</ids-menu-item>`;

      return menuItem;
    }).join('');
  }

  get inputElement() {
    return this.container?.querySelector<HTMLSlotElement>('#input-slot')?.assignedElements()[0];
  }

  get menuButton() {
    return this.container?.querySelector<IdsMenuButton>('ids-menu-button');
  }

  get menu() {
    return this.container?.querySelector<IdsPopupMenu>('ids-popup-menu');
  }

  set operators(val: FilterFieldOperator[]) {
    this.#operators = val;
    this.renderOperators(this.#operators);
  }

  get operators(): FilterFieldOperator[] {
    return this.#operators;
  }

  set size(val: string) {
    this.setAttribute(attributes.SIZE, val);
    this.inputElement?.setAttribute(attributes.SIZE, val);
  }

  get size(): string {
    return this.getAttribute(attributes.SIZE) ?? 'md';
  }
}

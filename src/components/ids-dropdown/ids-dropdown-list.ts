import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-dropdown-list-base';

import styles from './ids-dropdown-list.scss';
import type IdsListBox from '../ids-list-box/ids-list-box';
import type IdsListBoxOption from '../ids-list-box/ids-list-box-option';

import { IdsDropdownCommonAttributes } from './ids-dropdown-common';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

/**
 * IDS Dropdown List Component
 * @type {IdsDropdownList}
 * @inherits IdsPickerPopup
 * @mixes IdsLocaleMixin
 * @part dropdown-list - the dropdown list element
 */
@customElement('ids-dropdown-list')
@scss(styles)
export default class IdsDropdownList extends Base {
  listBox?: IdsListBox | null;

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
      ...IdsDropdownCommonAttributes
    ];
  }

  template() {
    return `<ids-popup class="ids-dropdown-list" type="menu" part="dropdown-list" y="0">
      <slot slot="content"></slot>
    </ids-popup>`;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.configurePopup();
    this.attachEventHandlers();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.listBox = null;
  }

  onHide() {
    this.setAriaOnMenuClose();
  }

  onShow() {
    this.configurePopup();
    this.setAriaOnMenuOpen();
  }

  onTargetChange() {
    const id = this.getAttribute(attributes.ID);
    if (id) this.target?.setAttribute(attributes.LIST, `#${id}`);
  }

  private attachEventHandlers() {
    this.offEvent('click.dropdown-list-box');
    this.onEvent('click.dropdown-list-box', this, (e: any) => {
      let target: HTMLElement | null = (e.target as HTMLElement);

      if (target && target.nodeName !== 'IDS-LIST-BOX-OPTION') {
        target = target.closest('ids-list-box-option');
      }

      if (target) {
        // Excluding group labels
        if (target.hasAttribute(attributes.GROUP_LABEL)) return;

        this.value = target.getAttribute(attributes.VALUE);

        this.triggerSelectedEvent();
      }
    });
  }

  /**
   * Triggers the same `dayselected` event on the Popup's target element that came from the internal IdsMonthView
   * @param {CustomEvent} [e] optional event handler to pass arguments
   * @returns {void}
   */
  private triggerSelectedEvent(e?: CustomEvent): void {
    let args: any;
    if (e) args = e;
    else {
      args = {
        bubbles: true,
        detail: {
          elem: this,
          value: this.value
        }
      };
    }

    if (this.target) {
      const event = new CustomEvent('selected', args);
      this.target.dispatchEvent(event);
    }
  }

  private configurePopup() {
    this.listBox = this.querySelector<IdsListBox>('ids-list-box');

    // If no list box element is present as a direct descendant,
    // assume usage inside IdsDropdown and search for slotted ListBox
    if (!this.listBox) {
      if (this.children[0]?.tagName === 'SLOT') {
        this.listBox = (this.children[0] as HTMLSlotElement).assignedElements()?.[0] as IdsListBox;
      }
    }

    if (this.popup) {
      this.popup.type = 'dropdown';
      // this.popup.alignTarget = this.input?.fieldContainer as IdsPopupElementRef;
      this.popup.align = 'bottom, left';
      this.popup.arrow = 'none';
      this.popup.y = -1;
      this.popup.x = 0;
      // Fix aria if the menu is closed
      if (!this.popup.visible) {
        this.setAriaOnMenuClose();
      } else if (this.popup.visible) this.popup.setPosition(null, null, false, true);
    }
  }

  /**
   * Add internal aria attributes while open
   * @private
   * @returns {void}
   */
  private setAriaOnMenuOpen(): void {
    this.setAttribute('aria-expanded', 'true');

    // Add aria for the open state
    const selected = this.selectedOption || this.querySelector('ids-list-box-option:not([group-label])');
    this.listBox?.setAttribute('tabindex', '0');

    if (selected && this.value) {
      this.selectOption(selected);

      if (!this.typeahead) {
        selected.focus();
      }
    }
  }

  /**
   * Add internal aria attributes while closed
   * @private
   * @returns {void}
   */
  private setAriaOnMenuClose() {
    this.setAttribute('aria-expanded', 'false');
    this.listBox?.removeAttribute('tabindex');

    const selected = this.selected;

    if (selected) {
      this.deselectOption(selected);
    }
  }

  /**
   * Returns the currently available options
   * @returns {Array<any>} the array of options
   */
  get options() {
    return this.querySelectorAll<IdsListBoxOption>('ids-list-box-option');
  }

  /**
   * Returns the selected Listbox option based on the Dropdown's value.
   * @returns {HTMLElement| null} the selected option
   */
  get selectedOption(): HTMLElement | null {
    return this.querySelector(`ids-list-box-option[value="${this.value}"]`);
  }

  /**
   * Returns the currently-selected Listbox option
   * (may be different from the Dropdown's value because of user input)
   * @readonly
   * @returns {HTMLElement|null} Reference to a selected Listbox option if one is present
   */
  get selected(): HTMLElement | null {
    return this.querySelector('ids-list-box-option.is-selected');
  }

  /**
   * Set typeahead attribute
   * @param {string | boolean | null} value typeahead value
   */
  set typeahead(value: string | boolean | null) {
    const val = stringToBool(value);

    if (val) {
      this.setAttribute(attributes.TYPEAHEAD, String(val));
      // this.#attachTypeaheadEvents();
      // this.#setOptionsData();
    } else {
      // this.removeAttribute(attributes.TYPEAHEAD);
      // this.#removeTypeaheadEvents();
    }

    this.container?.classList.toggle('typeahead', val);
  }

  /**
   * Get the typeahead attribute
   * @returns {boolean} typeahead attribute value converted to boolean
   */
  get typeahead(): boolean {
    return stringToBool(this.getAttribute(attributes.TYPEAHEAD));
  }

  /**
   * Set the value of the dropdown using the value/id attribute if present
   * @param {string} value The value/id to use
   */
  set value(value: string | null) {
    const elem = this.listBox?.querySelector<IdsListBoxOption>(`ids-list-box-option[value="${value}"]`);

    if (!elem && !this.hasAttribute(attributes.CLEARABLE)) {
      return;
    }

    this.clearSelected();
    this.selectOption(elem);
    // this.selectIcon(elem);
    // this.selectTooltip(elem);

    this.setAttribute(attributes.VALUE, String(value));
  }

  get value(): string | null {
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * Remove the aria and state from the currently selected element
   */
  clearSelected() {
    const option = this.listBox?.querySelector<IdsListBoxOption>('ids-list-box-option[aria-selected]');
    this.deselectOption(option);
  }

  /**
   * Set the aria and state on the element
   * @param {HTMLElement} option the option to select
   * @private
   */
  selectOption(option: HTMLElement | undefined | null) {
    if (!this?.popup?.visible) return;

    option?.setAttribute('aria-selected', 'true');
    option?.classList.add('is-selected');
    option?.setAttribute('tabindex', '0');

    if (option?.id) {
      this.listBox?.setAttribute('aria-activedescendant', option.id);
    }
  }

  /**
   * Removes selected attributes from an option
   * @param {HTMLElement} option element to remove attributes
   */
  deselectOption(option: HTMLElement | undefined | null) {
    option?.removeAttribute('aria-selected');
    option?.classList.remove('is-selected');
    option?.setAttribute('tabindex', '-1');
  }
}

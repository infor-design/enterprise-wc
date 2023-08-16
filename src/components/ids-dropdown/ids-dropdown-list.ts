import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsPickerPopup from '../ids-picker-popup/ids-picker-popup';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsFieldHeightMixin from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsDropdownAttributeMixin from './ids-dropdown-attributes-mixin';
import { IdsDropdownColorVariants } from './ids-dropdown-common';

import type IdsListBox from '../ids-list-box/ids-list-box';
import type IdsListBoxOption from '../ids-list-box/ids-list-box-option';

import styles from './ids-dropdown-list.scss';

const Base = IdsDropdownAttributeMixin(
  IdsColorVariantMixin(
    IdsLocaleMixin(
      IdsFieldHeightMixin(
        IdsKeyboardMixin(
          IdsPickerPopup
        )
      )
    )
  )
);

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
  isMultiSelect?: boolean;

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
      ...super.attributes
    ];
  }

  /**
   * List of available color variants for this component
   * @returns {Array<string>}
   */
  colorVariants: Array<string> = IdsDropdownColorVariants;

  template() {
    return `<ids-popup class="ids-dropdown-list" type="menu" part="dropdown-list" y="-1">
      <slot slot="content"></slot>
    </ids-popup>`;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.configureListBox();
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
    this.configureListBox();
    this.configurePopup();
    this.setAriaOnMenuOpen();
    if (this.value) this.selectOption(this.value);
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

        this.value = target.getAttribute(attributes.VALUE) || '';

        this.triggerSelectedEvent();
      }
    });
  }

  /**
   * Override `addOpenEvents` from IdsPopupOpenEventsMixin to include
   * appending of some keyboard handlers
   */
  addOpenEvents() {
    super.addOpenEvents();

    // Handles keyboard arrow navigation inside the list
    this.listen(['ArrowDown', 'ArrowUp'], this, (e: KeyboardEvent) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      const selected: any = this.selected;
      const next = selected?.nextElementSibling;
      const prev = selected?.previousElementSibling;

      if (e.key === 'ArrowUp' && e.altKey) {
        if (!this.isMultiSelect) {
          this.value = selected?.getAttribute(attributes.VALUE) || '';
        }
        this.triggerCloseEvent(true);
        return;
      }

      if (e.key === 'ArrowDown' && next) {
        if (next.hasAttribute(attributes.GROUP_LABEL) && !next.nextElementSibling) return;
        this.deselectOption(selected);
        this.selectOption(next.hasAttribute(attributes.GROUP_LABEL) ? next.nextElementSibling : next);
      }

      if (e.key === 'ArrowUp' && prev) {
        if (prev.hasAttribute(attributes.GROUP_LABEL) && !prev.previousElementSibling) return;
        this.deselectOption(selected);
        this.selectOption(prev.hasAttribute(attributes.GROUP_LABEL) ? prev.previousElementSibling : prev);
      }
    });

    // Close on escape
    this.listen(['Escape'], this, () => {
      this.triggerCloseEvent(true);
    });

    if (!this.isMultiSelect) {
      // Select or Open on space/enter
      this.listen([' ', 'Enter'], this, (e: KeyboardEvent) => {
        e.stopPropagation();
        // Excluding space key when typing
        if (e.key === ' ' && this.typeahead) return;

        if (!this.popup?.visible) {
          this.triggerOpenEvent();
          return;
        }

        const value = this.selected?.getAttribute(attributes.VALUE) || '';
        this.value = value;
        this.triggerSelectedEvent();
      });
    }
  }

  /**
   * Override `removeOpenEvents` from IdsPopupOpenEventsMixin to include
   * removal of some keyboard handlers
   */
  removeOpenEvents() {
    super.removeOpenEvents();
    this.unlisten(' ');
    this.unlisten('Enter');
  }

  /**
   * Triggers a `selected` event that propagates to the target element (usually an IdsDropdown)
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
          label: this.selected?.textContent,
          selectedElem: this.selected,
          value: this.value,
        }
      };
    }

    if (this.target) {
      const event = new CustomEvent('selected', args);
      this.target.dispatchEvent(event);
    }
  }

  private triggerOpenEvent() {
    this.triggerEvent('open.dropdown-list', this, {
      bubbles: true,
      detail: {
        elem: this
      }
    });
  }

  private triggerCloseEvent(doCancel?: boolean) {
    this.triggerEvent('close.dropdown-list', this, {
      bubbles: true,
      detail: {
        elem: this,
        operation: doCancel ? 'cancel' : 'default'
      }
    });
  }

  configurePopup() {
    // External dropdown lists configured for "full" size need extra help
    // determining what size matches their target element.
    if (this.size === 'full' && this.target && !this.parentElement?.classList.contains('ids-dropdown')) {
      const targetWidth = `${this.target.clientWidth}px`;
      this.style.width = targetWidth;
      if (this.popup) {
        this.popup.style.maxWidth = targetWidth;
        this.popup.style.width = targetWidth;
      }
    }

    if (this.popup) {
      this.popup.type = 'dropdown';
      this.popup.align = 'bottom, left';
      this.popup.arrow = 'none';

      // Fix aria if the menu is closed
      if (!this.popup.visible) {
        this.popup.y = -1;
        this.popup.x = 0;
        this.setAriaOnMenuClose();
      } else if (this.popup.visible) this.popup.setPosition(0, -1, false, true);
    }
  }

  configureListBox() {
    this.listBox = this.querySelector<IdsListBox>('ids-list-box');

    // If no list box element is present as a direct descendant,
    // assume usage inside IdsDropdown and search for slotted ListBox
    if (!this.listBox) {
      if (this.children[0]?.tagName === 'SLOT') {
        this.listBox = (this.children[0] as HTMLSlotElement).assignedElements()?.[0] as IdsListBox;
      }
    }

    // IdsListBox has styles that are dependent on field height/compact settings,
    // but doesn't implement IdsFieldHeightMixin, so these are passed here.
    if (this.listBox) {
      if (this.compact && !this.listBox?.hasAttribute(attributes.COMPACT)) {
        this.listBox.setAttribute(attributes.COMPACT, 'true');
      }
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
    }
  }

  /**
   * Adds internal aria attributes while closed
   * @returns {void}
   */
  setAriaOnMenuClose() {
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
   * @returns {IdsListBoxOption| null} the selected option
   */
  get selectedOption(): IdsListBoxOption | null {
    return this.querySelector(`ids-list-box-option[value="${this.value}"]`);
  }

  /**
   * Returns the currently-selected Listbox option
   * (may be different from the Dropdown's value because of user input)
   * @readonly
   * @returns {IdsListBoxOption|null} Reference to a selected Listbox option if one is present
   */
  get selected(): IdsListBoxOption | null {
    const child = this.children[0];
    if (child?.tagName === 'SLOT') {
      return this.listBox?.querySelector('ids-list-box-option.is-selected') || null;
    }
    return this.querySelector('ids-list-box-option.is-selected') || null;
  }

  /**
   * Set typeahead attribute
   * @param {string | boolean | null} value typeahead value
   */
  set typeahead(value: string | boolean | null) {
    const val = stringToBool(value);

    if (val) {
      this.setAttribute(attributes.TYPEAHEAD, String(val));
    } else {
      this.removeAttribute(attributes.TYPEAHEAD);
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
    let selector = `ids-list-box-option[value="${value}"]`;
    if (value === ' ' || !value) selector = `ids-list-box-option:not([value])`;
    const elem = this.listBox?.querySelector<IdsListBoxOption>(selector);
    if (!elem) return;

    this.clearSelected();
    this.selectOption(elem);
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
   * Gets a reference to an IdsDropdownList option based on a provided value
   * @param {string} val referenced value
   * @returns {IdsListBoxOption | null} element representing the provided value
   */
  getOption(val: string) {
    return this.listBox?.querySelector<IdsListBoxOption>(`ids-list-box-option[value="${val}"]`);
  }

  /**
   * Set the aria and state on the element
   * @param {HTMLElement} option the option to select
   * @private
   */
  selectOption(option: IdsListBoxOption | string) {
    if (!this?.popup?.visible) return;

    let targetOption: IdsListBoxOption | undefined | null;
    if (typeof option === 'string') {
      targetOption = this.getOption(option);
    } else {
      targetOption = option;
    }
    if (!targetOption) return;

    targetOption.setAttribute('aria-selected', 'true');
    targetOption.classList.add('is-selected');
    targetOption.setAttribute('tabindex', '0');
    targetOption.focus();

    if (targetOption.id) {
      this.listBox?.setAttribute('aria-activedescendant', targetOption.id);
    }

    if (typeof targetOption.scrollIntoView === 'function') {
      targetOption.scrollIntoView({ block: 'center' });
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

  onAllowBlankChange(val: boolean) {
    if (val) this.insertBlank();
    else this.removeBlank();
  }

  onClearableTextChange() {
    if (this.allowBlank) this.insertBlank();
  }

  onColorVariantRefresh(val: string | null) {
    if (this.popup && val?.length) {
      this.popup.type = val;
    }
  }

  /**
   * Insert blank option into list box
   */
  private insertBlank(): void {
    const list = this.listBox;
    const blankOption = `<ids-list-box-option value="blank" aria-label="Blank">${this.clearableText ?? '&nbsp;'}</ids-list-box-option>`;
    this.removeBlank();
    list?.insertAdjacentHTML('afterbegin', blankOption);
  }

  /**
   * Remove blank options from list box
   */
  private removeBlank(): void {
    this.getOption('blank')?.remove();
  }

  /**
   * Refreshes the state of the "blank" option in the Dropdown list
   * @returns {void}
   */
  configureBlank() {
    if (this.allowBlank) this.insertBlank();
    else this.removeBlank();
  }

  onFieldHeightChange(val: string) {
    const attr = val === attributes.COMPACT ? { name: attributes.COMPACT, val: '' } : { name: attributes.FIELD_HEIGHT, val };
    if (val) {
      this.listBox?.setAttribute(attr.name, attr.val);
    } else {
      this.listBox?.removeAttribute(attributes.COMPACT);
      this.listBox?.removeAttribute(attributes.FIELD_HEIGHT);
    }
  }

  onSizeChange(value: string) {
    if (value) this.listBox?.setAttribute(attributes.SIZE, value);
    else this.listBox?.removeAttribute(attributes.SIZE);
  }
}

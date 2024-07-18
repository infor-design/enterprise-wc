import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import IdsDropdown from '../ids-dropdown/ids-dropdown';

import '../ids-checkbox/ids-checkbox';
import '../ids-tag/ids-tag';
import '../ids-text/ids-text';
import '../ids-list-box/ids-list-box-option';

import styles from './ids-multiselect.scss';

import type IdsListBoxOption from '../ids-list-box/ids-list-box-option';
import type IdsTag from '../ids-tag/ids-tag';
import type IdsText from '../ids-text/ids-text';

/**
 * IDS Multiselect Component
 * @type {IdsMultiselect}
 * @inherits IdsDropdown
 * @part container - the container element
 */
@customElement('ids-multiselect')
@scss(styles)
class IdsMultiselect extends IdsDropdown {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    super.connectedCallback();
    this.resetDirtyTracker();
    this.#populateSelected();

    const defaultSlot = this.container?.querySelector<HTMLSlotElement>('slot');
    this.offEvent('slotchange.mulitselect', defaultSlot);
    this.onEvent('slotchange.mulitselect', defaultSlot, () => {
      this.#populateSelected();
    });
  }

  internalSelectedList: Array<string> = [];

  /**
   * Return the attributes we handle as getters and setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.TAGS,
      attributes.MAX
    ];
  }

  /**
   * Sets the disabled attribute
   * @param {string|boolean} value string value from the disabled attribute
   */
  set disabled(value) {
    if (this.tags) {
      this.input?.querySelectorAll<IdsTag>('ids-tag')?.forEach((element) => {
        element.setAttribute('disabled', 'true');
      });
    }

    super.disabled = value;
  }

  /**
   * Gets the value of the disabled property
   * @returns {boolean} a boolean indicating the elements disabled status
   */
  get disabled() {
    return super.disabled;
  }

  /**
   * Sets the tags attribute which determines if selected options are displayed as tags
   * @param {string|boolean} value string or boolean that sets the use of tag attribute
   */
  set tags(value) {
    const valueSafe = stringToBool(value);
    if (valueSafe !== this.tags) {
      if (valueSafe) {
        this.setAttribute(attributes.TAGS, 'true');
      } else {
        this.offEvent('beforetagremove.multiselect-tag');
        this.setAttribute(attributes.TAGS, 'false');
      }
    }
  }

  /**
   * returns whether the multiselect is set to display selections as tags
   * @returns {boolean} a boolean indicating tags setting
   */
  get tags(): boolean {
    return stringToBool(this.getAttribute(attributes.TAGS));
  }

  /**
   * sets the max possible selections for multiselect
   * @param {string|number} value the max number of selections allowed
   */
  set max(value: any) {
    const valueSafe = stringToNumber(value);
    if (valueSafe !== this.max) {
      if (valueSafe) {
        this.setAttribute(attributes.MAX, value);
      } else {
        this.removeAttribute(attributes.MAX);
      }
    }
  }

  /**
   * returns the maximum number of allowed selections
   * @returns {number} the maximum number of selectable options
   */
  get max(): number {
    return stringToNumber(this.getAttribute(attributes.MAX));
  }

  /**
   * Set the selected values of the multiselect using the provided array
   * @param {Array} value the array of values to set as selected
   */
  set value(value: any) {
    let matched = true;
    if (!Array.isArray(value) || value.length > this.max) {
      return;
    }
    value.forEach((selectedValue: string) => {
      const existingOption = this.dropdownList?.listBox?.querySelector(`ids-list-box-option[value="${selectedValue}"]`);
      if (!existingOption) {
        matched = false;
      }
    });
    if (!matched) {
      return;
    }
    this.internalSelectedList = value;

    (this.container as HTMLInputElement).value = '';
    this.#updateDisplay();
    this.#updateList();
    this.internalSelectedList = value;

    this.container?.classList.toggle('has-value', value.length > 0);
  }

  /**
   * returns an array of the values that have been selected
   * @returns {Array} the array of values
   */
  get value() { return this.internalSelectedList; }

  /**
   * Returns the selected Listbox option based on the Dropdown's value.
   * @returns {HTMLElement[]} the selected option
   */
  get selectedOptions(): HTMLElement[] {
    const values = Array.isArray(this.value) ? this.value : [this.value];
    const selectors = values.map((value) => `ids-list-box-option[value="${value}"]`).join(', ');
    if (!selectors) return [];
    return [...(this.dropdownList?.listBox?.querySelectorAll<HTMLElement>(selectors) ?? [])];
  }

  /**
   * Rewriting dropdown click events
   */
  attachClickEvent() {
    this.offEvent('click.multiselect-list-box');
    if (this.dropdownList) {
      this.onEvent('click.multiselect-list-box', this.dropdownList.listBox, (e: any) => {
        e.preventDefault();
        const option = e.target.nodeName === 'IDS-LIST-BOX-OPTION'
          || e.target.closest('ids-list-box-option')
          ? e.target.closest('ids-list-box-option') ?? e.target
          : null;
        this.#optionChecked(option);
      });
    }

    this.offEvent('click.multiselect-input');
    if (!this.list) {
      this.onEvent('click.multiselect-input', this.input?.fieldContainer, (e: MouseEvent) => {
        e.stopPropagation();
        // Don't open/close popup on tag removal
        const target = (e.target as IdsTag);
        if (!target?.closest('ids-tag')) {
          this.labelClicked = false;
          this.toggle(true);
        }
      });
    }

    if (this.tags) {
      this.offEvent('beforetagremove.multiselect-tag');
      this.onEvent('beforetagremove.multiselect-tag', this.input?.fieldContainer, (e: CustomEvent) => {
        this.#handleTagRemove(e);
      });
    }
  }

  /**
   * Establish selection event for keyboard interactions.
   * Overrides a similiar method from IdsDropdown for Multiselect-specific behavior.
   */
  attachKeyboardSelectionEvent() {
    // Select or Open on space/enter
    this.listen([' ', 'Enter'], this, () => {
      if (!this.dropdownList?.popup?.visible) return;
      if (this.openedByKeyboard) {
        this.openedByKeyboard = false;
        return;
      }

      this.#optionChecked(this.selected);
    });
  }

  /**
   * Close the dropdown popup
   * Rewriting it to add multiselect value update
   * @param {boolean} noFocus if true do not focus on close
   */
  close(noFocus?: boolean) {
    if (this.popup && this.input) {
      this.popup.visible = false;
      this.input.active = false;
    }

    this.setAttribute('aria-expanded', 'false');
    this.dropdownList?.listBox?.removeAttribute('tabindex');

    if (this.selected) {
      this.deselectOption(this.selected);
    }

    if (!noFocus) {
      this.input?.focus();
    }

    this.value = this.internalSelectedList;

    this.container?.classList.remove('is-open');
  }

  /**
   * Triggers when dismissible tag is removed
   * @param {MouseEvent} e click event
   */
  #handleTagRemove(e:any) {
    this.value = this.internalSelectedList.filter((value: string) => value !== e.target?.dataset.value);
    this.popup?.place();
  }

  /**
   * Check option checkbox and update selected list
   * @param {HTMLElement} option selected ids-list-box-option element
   */
  #optionChecked(option: any) {
    if (!option || option?.hasAttribute(attributes.GROUP_LABEL)) return;

    const value = option.getAttribute('value');
    const isSelected = this.internalSelectedList.some((item) => value === item);
    const checkbox = option.querySelector('ids-checkbox');
    const canSelect = this.max !== this.value.length;

    if (isSelected || canSelect) {
      this.internalSelectedList = isSelected
        ? this.internalSelectedList.filter((item) => item !== value)
        : [...this.internalSelectedList, value];

      if (checkbox) {
        checkbox.onEvent('change', checkbox, (e: CustomEvent) => {
          e.stopPropagation();
        });
        checkbox.checked = !isSelected;
        checkbox.offEvent('change', checkbox);
      }

      if (this.tags) {
        this.#updateDisplay();
        this.popup?.place();
        this.container?.classList.toggle('has-value', this.internalSelectedList.length > 0);
      }
    }

    this.clearSelected();
    this.selectOption(option);
  }

  /**
   * Update value in the input visually
   */
  #updateDisplay() {
    const optionsSorted = this.dropdownList?.listBox?.optionsSorted ?? [];
    const selected = optionsSorted.filter((item: IdsListBoxOption) => this.internalSelectedList.includes(item.value));
    const newValue = selected.map((item: IdsListBoxOption) => item.label).join(', ');

    // Clear tags/text before rerender
    this.input?.querySelectorAll<IdsTag>('ids-tag').forEach((item) => item.remove());

    if (this.tags) {
      const tags = selected.map((item: any) => {
        const disabled = this.disabled ? ` disabled="true"` : ``;

        return `<ids-tag
          class="multiselect-tag"
          data-value="${item.value}"
          dismissible="true"
          ${disabled}
        >
          <ids-text overflow="ellipsis" tooltip="true">${item.label}</ids-text>
        </ids-tag>`;
      }).join('');
      this.input?.insertAdjacentHTML('afterbegin', tags);
    } else {
      const text = this.input?.querySelector<IdsText>('ids-text');
      const fieldContainer = this.input?.fieldContainer;

      // Adjust settings for the tooltip
      if (text?.beforeTooltipShow) {
        text.beforeTooltipShow = (tooltip) => {
          tooltip.popup.align = 'top, left';
          tooltip.popup.alignTarget = fieldContainer;
          tooltip.target = fieldContainer;
          tooltip.popup.style?.setProperty('text-align', 'center');

          if (fieldContainer?.clientWidth) {
            tooltip.popup.width = `${fieldContainer.clientWidth - 14}px`;
          }
        };
      }
    }

    if (this.input?.input) {
      this.input.value = newValue;
      this.input.input.value = newValue;
    }
  }

  /**
   * Render dropdown list with selected options on top
   */
  #updateList() {
    if (!this.dropdownList?.listBox) return;
    const selectedOptions: IdsListBoxOption[] = [];
    const unselectedOptions: IdsListBoxOption[] = [];

    (this.dropdownList?.listBox?.optionsSorted ?? [])
      .forEach((option: IdsListBoxOption) => {
        option.classList.remove('last-selected');
        option.hidden = false;
        if (option?.childCheckbox) option.childCheckbox.offEvent('change');
        if (this.internalSelectedList.includes(option.value)) {
          option.selected = true;
          selectedOptions.push(option);
        } else {
          option.selected = false;
          unselectedOptions.push(option);
        }
      });

    selectedOptions.at(-1)?.classList.add('last-selected');
    this.dropdownList.listBox.prepend(...selectedOptions.concat(unselectedOptions));
  }

  /**
   * Update options list on the component mount with classes/attributes
   */
  #populateSelected() {
    this.internalSelectedList = [];

    const optionsSorted = this.dropdownList?.listBox?.optionsSorted ?? [];
    optionsSorted?.forEach((item: any) => {
      const checkbox = item.querySelector('ids-checkbox');
      if (checkbox?.checked) item.setAttribute('selected', '');

      if (item.hasAttribute('selected')) {
        this.internalSelectedList.push(item.getAttribute('value'));
        if (checkbox && !checkbox?.checked) {
          checkbox.checked = true;
        }
      }
      checkbox?.setAttribute('no-margin', '');
      checkbox?.classList.add('justify-center', 'multiselect-checkbox');
      item.classList.add('multiselect-option');
    });

    this.value = this.internalSelectedList;
  }
}

export default IdsMultiselect;

import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import '../ids-checkbox/ids-checkbox';
import '../ids-dropdown/ids-dropdown';
import Base from './ids-multiselect-base';
import '../ids-tag/ids-tag';

// Import Sass to be encapsulated in the component shadowRoot
import styles from './ids-multiselect.scss';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import type { IdsListBoxOption, IdsListBoxOptions } from '../ids-dropdown/ids-dropdown';

/**
 * IDS Multiselect Component
 * @type {IdsMultiselect}
 * @inherits IdsDropdown
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the container element
 */
@customElement('ids-multiselect')
@scss(styles)
class IdsMultiselect extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    super.connectedCallback();
    this.resetDirtyTracker();
    this.#attachKeyboardListeners();
    this.#setOptionsData();
    this.#populateSelected();
  }

  #selectedList: Array<string> = [];

  #optionsData: IdsListBoxOptions = [];

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
    if (this.tag) {
      this.querySelectorAll('ids-tag').forEach((element:HTMLElement) => {
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
    if (valueSafe !== this.getAttribute(attributes.TAGS)) {
      if (valueSafe) {
        this.setAttribute(attributes.TAGS, 'true');
      } else {
        this.setAttribute(attributes.TAGS, 'false');
      }
    }
  }

  /**
   * returns whether the multiselect is set to display selections as tags
   * @returns {boolean} a boolean indicating tags setting
   */
  get tags() {
    return stringToBool(this.getAttribute(attributes.TAGS));
  }

  /**
   * sets the max possible selections for multiselect
   * @param {string|number} value the max number of selections allowed
   */
  set max(value: any) {
    const valueSafe = stringToNumber(value);
    if (valueSafe !== this.getAttribute(stringToNumber(attributes.MAX))) {
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
  get max() {
    return stringToNumber(this.getAttribute(attributes.MAX));
  }

  /**
   * Set the selected values of the multiselect using the provided array
   * @param {Array} value the array of values to set as selected
   */
  set value(value: any) {
    let matched = true;
    if (!value) {
      return;
    }
    value.forEach((selectedValue:string) => {
      const existingOption = this.querySelector(`ids-list-box-option[value="${selectedValue}"]`);
      if (!existingOption) {
        matched = false;
      }
    });
    if (!matched) {
      return;
    }
    this.#selectedList = value;

    this.container.value = '';
    this.#updateDisplay();
    this.#updateList();

    // Send the change event
    if (this.value === value) {
      this.triggerEvent('change', this, {
        bubbles: true,
        detail: {
          elem: this,
          value: this.value
        }
      });
    }
    this.#selectedList = value;
  }

  /**
   * returns an array of the values that have been selected
   * @returns {Array} the array of values
   */
  get value() { return this.#selectedList; }

  attachClickEvent() {
    this.offEvent('click.multiselect-list-box');
    this.onEvent('click.multiselect-list-box', this.listBox, (e: any) => {
      e.preventDefault();
      const option = e.target.nodeName === 'IDS-LIST-BOX-OPTION'
        || e.target.closest('ids-list-box-option')
        ? e.target.closest('ids-list-box-option') ?? e.target
        : null;
      this.#optionChecked(option);
    });

    this.onEvent('click', this.input.fieldContainer, () => {
      if (this.popup.visible) {
        this.value = this.#selectedList;
      }
      this.toggle();
    });

    // Should not open if clicked on label
    this.onEvent('click', this.labelEl, (e: MouseEvent) => {
      e.preventDefault();
      this.input.focus();
    });

    this.offEvent('click.multiselect-trigger');
    this.onEvent('click.multiselect-trigger', this.trigger, (e: MouseEvent) => {
      e.stopPropagation();

      if (this.popup.visible) {
        this.value = this.#selectedList;
      }
      this.toggle();
    });

    if (this.tags) {
      this.onEvent('beforetagremove', this.input, (e:any) => {
        this.#handleTagRemove(e);
      });
    }
  }

  #attachKeyboardListeners() {
    this.listen([' ', 'Enter'], this, () => {
      if (!this.popup.visible) {
        this.open();
        return;
      }

      this.#optionChecked(this.selected);
    });
  }

  #handleTagRemove(e:any) {
    const removedSelection = this.#selectedList.indexOf(e.target.closest('ids-tag').id);
    if (removedSelection > -1) {
      this.#selectedList.splice(removedSelection, 1);
    }
    this.#updateList();
  }

  #optionChecked(option: any) {
    if (!option) return;
    const value = option.getAttribute('value');
    const isSelected = this.#selectedList.some((item) => value === item);
    const checkbox = option.querySelector('ids-checkbox');

    if (isSelected) {
      this.#selectedList = this.#selectedList.filter((item) => item !== value);
      if (checkbox) {
        checkbox.checked = false;
      }
      return;
    }

    if (this.max !== this.value.length) {
      this.#selectedList.push(value);
      if (checkbox) {
        checkbox.checked = true;
      }
    }

    this.clearSelected();
    this.selectOption(option);
  }

  #updateDisplay() {
    const selected = this.#optionsData.filter((item: IdsListBoxOption) => this.#selectedList.includes(item.value));

    if (this.tags) {
      // Clear tags before rerender
      this.input.querySelectorAll('ids-tag').forEach((item: HTMLElement) => { item.remove(); });
      const tags = selected.map((item: any) => {
        const disabled = this.disabled ? `disabled="true"` : ``;

        return `<ids-tag id="${item.value}" dismissible="true" ${disabled}>${item.label}</ids-tag>`;
      }).join('');
      this.input.insertAdjacentHTML('afterbegin', tags);
    }

    const newValue = selected.map((item: IdsListBoxOption) => item.label).join(', ');

    this.input.value = newValue;
  }

  #updateList() {
    const selected = this.#optionsData.filter((item: IdsListBoxOption) => this.#selectedList.includes(item.value))
      .map((item: IdsListBoxOption) => ({
        ...item,
        selected: true
      }));
    const options = this.#optionsData.filter((item: IdsListBoxOption) => !this.#selectedList.includes(item.value))
      .map((item: IdsListBoxOption) => ({
        ...item,
        selected: false
      }))
      .sort((first, second) => (first.index as number) - (second.index as number));

    this.listBox.innerHTML = '';

    const html = [...selected, ...options].map((option: IdsListBoxOption) => this.#templatelistBoxOption(option)).join('');
    this.listBox.insertAdjacentHTML('afterbegin', html);
  }

  /**
   * Create the list box option template.
   * @param {IdsListBoxOption} option id, value, label object
   * @returns {string} ids-list-box-option template
   */
  #templatelistBoxOption(option: IdsListBoxOption): string {
    return `<ids-list-box-option class="multiselect-option"
      ${option.id ? `id=${option.id}` : ''}
      ${option.value ? `value="${option.value}"` : ''}
      ${option.groupLabel ? 'group-label' : ''}><ids-checkbox no-margin class="justify-center" label="${option.label}" checked="${option.selected}"></ids-checkbox></ids-list-box-option>`;
  }

  #populateSelected() {
    this.options.forEach((item: any) => {
      const checkbox = item.querySelector('ids-checkbox');

      if (item.hasAttribute('selected')) {
        this.#selectedList.push(item.getAttribute('value'));
        if (checkbox) {
          checkbox.checked = true;
        }
      }
      checkbox?.setAttribute('no-margin', '');
      checkbox?.classList.add('justify-center');
      item.classList.add('multiselect-option');
    });

    this.value = this.#selectedList;
  }

  /**
   * Map slotted ids-list-box-option elements to the dataset
   */
  #setOptionsData() {
    this.#optionsData = [...this.options].map((item, index) => ({
      id: item?.id,
      label: item?.textContent?.trim() || item?.querySelector('ids-checkbox')?.label,
      value: item?.getAttribute(attributes.VALUE),
      groupLabel: item?.hasAttribute(attributes.GROUP_LABEL),
      selected: item?.hasAttribute('selected'),
      index
    }));
  }
}

export default IdsMultiselect;

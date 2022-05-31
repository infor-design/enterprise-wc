import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import '../ids-checkbox/ids-checkbox';
import '../ids-dropdown/ids-dropdown';
import Base from './ids-multiselect-base';
import '../ids-tag/ids-tag';

// Import Sass to be encapsulated in the component shadowRoot
import styles from './ids-multiselect.scss';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

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
  #selectedList:Array<any>;

  constructor() {
    super();
    this.#selectedList = [];
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    this.#populateSelected();
    Base.prototype.connectedCallback.apply(this);
    requestAnimationFrame(() => {
      this.resetDirtyTracker();
    });
  }

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

  set disabled(value) {
    if (this.tag) {
      this.querySelectorAll('ids-tag').forEach((element:HTMLElement) => {
        element.setAttribute('disabled', 'true');
      });
    }

    super.disabled = value;
  }

  get disabled() {
    return super.disabled;
  }

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

  get tags() {
    return stringToBool(this.getAttribute(attributes.TAGS));
  }

  set max(value: any) {
    const valueSafe = stringToNumber(value);
    if (valueSafe !== this.getAttribute(stringToNumber(attributes.MAX))) {
      if (valueSafe) {
        this.setAttribute(attributes.MAX, value);
        // #updateMaxSelections(value);
      } else {
        this.removeAttribute(attributes.MAX);
      }
    }
  }

  get max() {
    return stringToNumber(this.getAttribute(attributes.MAX));
  }

  /**
   * Set the value of the dropdown using the value/id attribute if present
   * @param {Array} value The value/id to use
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
    this.#updateList(true);

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

  get value() { return this.#selectedList; }

  attachClickEvent() {
    this.offEvent('click');
    this.onEvent('click', this, (e: any) => {
      this.#handleOptionClick(e);
    });

    /**
     * TO DO: update to select and group functionality to follow updates to ids-dropdown
     */

    if (this.tags) {
      this.onEvent('beforetagremove', this.input, (e:any) => {
        this.#handleTagRemove(e);
      });
    }
  }

  #handleTagRemove(e:any) {
    const removedSelection = this.#selectedList.indexOf(e.target.closest('ids-tag').id);
    if (removedSelection > -1) {
      this.#selectedList.splice(removedSelection, 1);
    }
    this.#updateList(false);
  }

  #handleOptionClick(e:any) {
    if (e.target.nodeName === 'IDS-LIST-BOX-OPTION') {
      const targetOption = e.target;
      if (this.#selectedList.find((value) => value === targetOption.getAttribute('value'))) {
        this.#selectedList = this.#selectedList.filter((item) => item !== targetOption.getAttribute('value'));
        this.selectOption(targetOption);
        this.#updateDisplay();
        this.#updateList(false);
      } else if (this.max !== this.value.length) {
        this.#selectedList.push(e.target.getAttribute('value'));
        this.selectOption(targetOption);
        this.#updateDisplay();
        this.#updateList(true);
        return;
      }
    }

    if (e.target.closest('ids-list-box-option')) {
      const targetOption = e.target.closest('ids-list-box-option');
      if (this.#selectedList.find((value) => value === targetOption.getAttribute('value'))) {
        this.#selectedList = this.#selectedList.filter((item) => item !== targetOption.getAttribute('value'));
        this.selectOption(targetOption);
        this.#updateDisplay();
        this.#updateList(false);
      } else if (this.max !== this.value.length) {
        this.#selectedList.push(targetOption.getAttribute('value'));
        this.selectOption(targetOption);
        this.#updateDisplay();
        this.#updateList(true);
      }
    }

    if (e.target.isEqualNode(this)) {
      this.toggle();
    }
  }

  /**
   * TODO: this maybe relevant to select feature update to dropdown or maybe overwritten.
   */

  #updateDisplay() {
    let newValue = '';
    if (this.tags) {
      this.input.querySelectorAll('ids-tag').forEach((item: HTMLElement) => { item.remove(); });
    }
    this.#selectedList.forEach((selectedValue: string, index: number) => {
      const matchedElem = this.querySelector(`ids-list-box-option[value="${selectedValue}"]`);

      if (this.tags) {
        const disabled = this.disabled ? `disabled="true"` : ``;
        this.input.insertAdjacentHTML('afterbegin', `<ids-tag id="${selectedValue}" dismissible="true" ${disabled}>${matchedElem.querySelector('ids-checkbox').label}</ids-tag>`);
      } else {
        if (index > 0) {
          newValue += ', ';
        }
        newValue += matchedElem.querySelector('ids-checkbox').label;
      }
    });
    this.input.value = newValue;
  }

  #updateList(addItem:boolean) {
    const selectedOptions: Array<any> = this.querySelectorAll('.selected-options ids-list-box-option');
    let unselectedOptions: Array<any>;
    const optionsContainer = this.querySelector('.options');
    let selectedOptionsContainer = this.querySelector('.selected-options');
    if (addItem) {
      if (!selectedOptionsContainer) {
        this.insertAdjacentHTML('afterbegin', `<ids-listbox class="selected-options" id="selected-options">
        </ids-listbox>`);
        selectedOptionsContainer = this.querySelector('.selected-options');
      }
      unselectedOptions = this.querySelectorAll('ids-list-box.options ids-list-box-option');
      unselectedOptions.forEach((option) => {
        if (this.#selectedList.includes(option.getAttribute('value'))) {
          window.requestAnimationFrame(() => {
            // check change
            selectedOptionsContainer
              .insertBefore(option, selectedOptionsContainer.children[selectedOptionsContainer.children.length]);
            option.querySelector('ids-checkbox').checked = true;
          });
        }
      });
    } else {
      selectedOptions.forEach((option) => {
        if (!this.#selectedList.includes(option.getAttribute('value'))) {
          window.requestAnimationFrame(() => {
            option.querySelector('ids-checkbox').checked = 'false';
            optionsContainer.insertBefore(option, optionsContainer.children[optionsContainer.children.length]);
          });
        }
      });
    }
  }

  #populateSelected() {
    this.options.forEach((element: any) => {
      if (element.querySelector('ids-checkbox').checked) {
        this.#selectedList.push(element.getAttribute('value'));
        this.#updateDisplay();
        this.#updateList(true);
      }
    });
  }
}

export default IdsMultiselect;

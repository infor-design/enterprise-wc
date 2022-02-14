import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsCheckbox from '../ids-checkbox/ids-checkbox';
import IdsDropdown from '../ids-dropdown/ids-dropdown';
import Base from './ids-multiselect-base';
import IdsTag from '../ids-tag/ids-tag';

// Import Sass to be encapsulated in the component shadowRoot
import styles from './ids-multiselect.scss';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

/**
 * IDS Multiselect Component
 * @type {IdsMultiselect}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the container element
 */
@customElement('ids-multiselect')
@scss(styles)
class IdsMultiselect extends Base {
  #selectedList;

  constructor() {
    super();
    this.#selectedList = [];
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    this.#attachEventHandlers();
    //super.connectedCallback();
    this.#populateSelected();
    console.log(Base.prototype);
    Base.prototype.connectedCallback.apply(this);
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

  set max(value) {
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
  set value(value) {
    const elem = this.selectedOption;
    if (!elem) {
      return;
    }
    this.#selectedList = value;
    // this.clearSelected();
    this.selectOption(elem);
    this.selectIcon(elem);
    this.selectTooltip(elem);

    this.shadowRoot.querySelector('ids-input').value = '';
    this.#updateDisplay();
    this.#updateList(true);
    /* this.#selectedList.forEach((selectedValue, index) => {
      const matchedElem = this.options.querySelector(`ids-list-box-option[value="${selectedValue}"]`);
      if (index > 0) {
        this.shadowRoot.querySelector('ids-input').value += ', ';
      }
      this.shadowRoot.querySelector('ids-input').value += matchedElem.querySelector('ids-checkbox').label;
    }); */

    this.state.selectedIndex = [...elem.parentElement.children].indexOf(elem);
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
    // this.setAttribute('value', value);
  }

  get value() { return this.#selectedList; }

  /* get selectedOption() {
    return this.value;
  }

  set selectedOption(value) {
    if (value) {
      console.log('selected set');
    }
  } */

  /**
   * Create the template for the contents
   * @returns {string} The template
   */
  /* template() {
    const baseTemplate = super.template();

  } */

  /**
   * Establish internal event handlers
   * @private
   * @returns {object} The object for chaining
   */
  #attachEventHandlers() {
    // super.attachEventHandlers();
    // console.log(Base.prototype);
    // Base.prototype.attachEventHandlers.apply(this);
    return this;
  }

  attachClickEvent() {
    this.offEvent('click');
    this.onEvent('click', this, (e) => {
      if (e.target.nodeName === 'IDS-LIST-BOX-OPTION') {
        const targetOption = e.target;
        if (this.#selectedList.find((value) => value === targetOption.getAttribute('value'))) {
          if (targetOption.querySelector('ids-checkbox')?.checked) {
            targetOption.querySelector('ids-checkbox').setAttribute('checked', 'false');
          }
          this.#selectedList = this.#selectedList.filter((item) => item !== targetOption.getAttribute('value'));
          console.log(`list should be shorter`);
          console.log(this.#selectedList);
          this.#updateDisplay();
          this.#updateList(false);
        } else if (this.max !== this.value.length) {
          if (!e.target.querySelector('ids-checkbox')?.checked) {
            e.target.querySelector('ids-checkbox').setAttribute('checked', 'true');
          }
          this.#selectedList.push(e.target.getAttribute('value'));
          this.#updateDisplay();
          this.#updateList(true);
          console.log("boop");
          return;
        }
      }

      console.log(e.target);
      console.log(e.target.closest('ids-list-box-option'));
      if (e.target.closest('ids-list-box-option')) {
        const targetOption = e.target.closest('ids-list-box-option');
        if (this.#selectedList.find((value) => value === targetOption.getAttribute('value'))) {
          if (targetOption.querySelector('ids-checkbox')?.checked) {
            targetOption.querySelector('ids-checkbox').setAttribute('checked', 'false');
          }
          this.#selectedList = this.#selectedList.filter((item) => item !== targetOption.getAttribute('value'));
          this.#updateDisplay();
          this.#updateList(false);
        } else if (this.max !== this.value.length) {
          if (!targetOption.querySelector('ids-checkbox')?.checked) {
            targetOption.querySelector('ids-checkbox').setAttribute('checked', 'true');
          }
          this.#selectedList.push(targetOption.getAttribute('value'));
          this.#updateDisplay();
          this.#updateList(true);
          console.log("bonk");
        }
      }
    });

    if (this.tags) {
      this.onEvent('click', this.shadowRoot.querySelector('ids-trigger-field').container, (e) => {
        console.log('tag clicked');
        console.log(e.target.nodeName);
        if (e.target.nodeName == "IDS-ICON") {
          console.log('got the tag');
          console.log(e.target.closest("ids-tag").text);
        }
      });
    }
  }

  /*
  #updateMaxSelections(value){
    if(value){}
  } */

  #updateDisplay() {
    this.shadowRoot.querySelector('ids-input').value = '';
    console.log(this.#selectedList);
    this.#selectedList.forEach((selectedValue, index) => {
      const matchedElem = this.querySelector(`ids-list-box-option[value="${selectedValue}"]`);
      if(this.tags){
        this.shadowRoot.querySelector('ids-trigger-field').insertAdjacentHTML('afterbegin', `<ids-tag dismissible="true">${matchedElem.querySelector('ids-checkbox').label}</ids-tag>`);
      } else {
        if (index > 0) {
          this.shadowRoot.querySelector('ids-input').value += ', ';
        }
        this.shadowRoot.querySelector('ids-input').value += matchedElem.querySelector('ids-checkbox').label;
      }
    });

  }
  #updateList(addItem){
      const selectedOptions = this.querySelectorAll('.selected-options ids-list-box-option');
      console.log(this.querySelectorAll('ids-list-box.selected-options ids-list-box-option'));
      const unselectedOptions = this.querySelectorAll('ids-list-box.options ids-list-box-option')
      const optionsContainer = this.querySelector('.options');
      const selectedOptionsContainer = this.querySelector('.selected-options');
      if(addItem){
        unselectedOptions.forEach((option, index) => {
          if(this.#selectedList.includes(option.getAttribute('value'))){
            selectedOptionsContainer.insertBefore(option, selectedOptionsContainer.children[selectedOptionsContainer.children.length]);
          }
        });
      } else {
        selectedOptions.forEach((option, index) => {
          console.log(!this.#selectedList.includes(option.getAttribute('value')));
          console.log(this.#selectedList);
          if (!this.#selectedList.includes(option.getAttribute('value'))) {
            optionsContainer.insertBefore(option, optionsContainer.children[optionsContainer.children.length]);
          }
        });
      }
      console.log(selectedOptions);
      console.log(this.value);
  }

  #loadDataSet(dataset) {
    let html = '';
    const listbox = this.querySelector('ids-list-box');
    listbox.innerHTML = '';
    dataset.forEach((option, index) => {
      html += `<ids-list-box-option value="${option.value}">
        <ids-checkbox id="${index}-checkbox" value="${option.value}" label="${option.label}"></ids-checkbox>
        </ids-list-box-option>`;
    });
    listbox.insertAdjacentHTML('afterbegin', html);
    this.value = this.getAttribute('value');
  }

  #populateSelected() {
    this.options.forEach((element) => {
      console.log(element.id);
      console.log(element.querySelector('ids-checkbox').checked);
      if(element.querySelector('ids-checkbox').checked){
        this.#selectedList.push(element.getAttribute('value'));
        this.#updateDisplay();
        this.#updateList(true);
      }
    })
    console.log(this.#selectedList);
  }
}

export default IdsMultiselect;

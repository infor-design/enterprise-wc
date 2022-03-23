import { attributes } from '../../core/ids-attributes';
import { stringToBool, extractTemplateLiteralsFromHTML } from '../../utils/ids-string-utils/ids-string-utils';
import IdsListBox from '../../components/ids-list-box/ids-list-box';
import IdsListBoxOption from '../../components/ids-list-box/ids-list-box-option';
import IdsPopup from '../../components/ids-popup/ids-popup';
import IdsDataSource from '../../core/ids-data-source';

const IdsAutoCompleteMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.AUTOCOMPLETE,
      attributes.SEARCH_KEY
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();

    if (!this.autocomplete) {
      this.destroyAutocomplete();
      return;
    }

    this.#attachTemplateSlot();
    this.#attachPopup();
    this.#attachEventListeners();
  }

  /**
   * Gets the internal IdsDataSource object
   * @returns {IdsDataSource} object
   */
  datasource = this.autocomplete && new IdsDataSource();

  #listBox = this.autocomplete && new IdsListBox();

  #popup = this.autocomplete && new IdsPopup();

  set autocomplete(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.AUTOCOMPLETE, '');
      this.container.classList.add('autocomplete');
    } else {
      this.removeAttribute(attributes.AUTOCOMPLETE);
      this.container.classList.remove('autocomplete');
    }
  }

  get autocomplete() {
    return this.hasAttribute(attributes.AUTOCOMPLETE);
  }

  set data(value) {
    if (this.datasource) {
      this.datasource.data = value || [];
      this.rerender();
    }
  }

  get data() {
    return this?.datasource?.data || [];
  }

  /**
   * Get a list of element dependencies for this component
   * @returns {object} of elements
   */
  get elements() {
    return {
      popup: this.#popup,
      listBox: this.#listBox,
      popupContent: this.#popup.container.querySelector('slot[name="content"]'),
      listBoxOptions: this.#popup.shadowRoot.querySelectorAll('ids-list-box-option'),
      rootNode: this.getRootNode().body.querySelector('ids-container') || window.document.body,
    };
  }

  get templateKeys() {
    return extractTemplateLiteralsFromHTML(this.defaultTemplate);
  }

  set searchKey(value) {
    if (value) {
      this.setAttribute(attributes.SEARCH_KEY, value);
    } else {
      this.removeAttribute(attributes.SEARCH_KEY);
    }
  }

  get searchKey() {
    return this.getAttribute(attributes.SEARCH_KEY) || this.templateKeys[0];
  }

  /**
   * Rerenders the IdsInput component
   * @private
   */
  rerender() {
    super.rerender?.();
    this.#populateListbox();
  }

  findMatches(value, list) {
    return list.filter((option) => {
      const regex = new RegExp(value, 'gi');
      return option[this.searchKey].match(regex);
    });
  }

  displayMatches() {
    const resultsArr = this.findMatches(this.value, this.data);
    const results = resultsArr.map((result) => {
      const regex = new RegExp(this.value, 'gi');
      const optionText = result[this.searchKey].replace(regex, `<span class="highlight">${this.value.toLowerCase()}</span>`);
      return `<ids-list-box-option>${optionText}</ids-list-box-option>`;
    }).join('');

    this.openPopup();
    this.elements.listBox.innerHTML = results;
  }

  closePopup() {
    this.elements.popup.open = false;
    this.elements.popup.visible = false;
  }

  openPopup() {
    this.elements.popup.open = true;
    this.elements.popup.visible = true;
  }

  #populateListbox() {
    this.elements.listBox.innerHTML = this.data.map((d) => `<ids-list-box-option>${d[this.searchKey]}</ids-list-box-option>`).join('');
  }

  #attachTemplateSlot() {
    const slot = document.createElement('slot');
    slot.setAttribute('name', 'autocomplete-template');
    this.container.appendChild(slot);
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
  }

  #attachPopup() {
    this.elements.popup.type = 'dropdown';
    this.elements.popup.align = 'bottom, left';
    this.elements.popup.alignTarget = this.fieldContainer;
    this.elements.popup.y = -1;

    this.elements.rootNode?.appendChild(this.#popup);
    this.elements.popupContent.appendChild(this.#listBox);
  }

  #attachEventListeners() {
    this.onEvent('keyup', this, this.displayMatches);
    this.onEvent('change', this, this.displayMatches);
    this.onEvent('blur', this, this.closePopup);
  }

  #removeEventListeners() {
    this.offEvent('keyup', this, this.displayMatches);
    this.offEvent('change', this, this.displayMatches);
    this.offEvent('blur', this, this.closePopup);
  }

  destroyAutocomplete() {
    this.#removeEventListeners();
  }
};

export default IdsAutoCompleteMixin;

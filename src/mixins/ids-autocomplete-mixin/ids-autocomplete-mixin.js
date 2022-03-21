import { attributes } from '../../core/ids-attributes';
import { stringToBool, injectTemplate, extractTemplateLiteralsFromHTML } from '../../utils/ids-string-utils/ids-string-utils';
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
  datasource = new IdsDataSource();

  #listBox = new IdsListBox();

  #popup = new IdsPopup();

  get listBox() { return this.#listBox; }

  get popup() { return this.#popup; }

  get popupContent() {
    return this.popup.container.querySelector('slot[name="content"]');
  }

  set autocomplete(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.AUTOCOMPLETE, val);
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

  get rootNode() {
    return this.getRootNode().body.querySelector('ids-container') || window.document.body;
  }

  get listBoxOptions() {
    return this.#popup.shadowRoot.querySelectorAll('ids-list-box-option');
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

  #attachTemplateSlot() {
    const slot = document.createElement('slot');
    slot.setAttribute('name', 'autocomplete-template');
    this.container.appendChild(slot);
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
  }

  #attachPopup() {
    this.popup.type = 'dropdown';
    this.popup.align = 'bottom, left';
    this.popup.alignTarget = this.fieldContainer;
    this.popup.y = -1;

    this.rootNode?.appendChild(this.#popup);
    this.popupContent.appendChild(this.#listBox);
  }

  #closePopup() {
    this.popup.open = false;
    this.popup.visible = false;
  }

  #openPopup() {
    this.popup.open = true;
    this.popup.visible = true;
  }

  #populateListbox() {
    this.#listBox.innerHTML = this.data.map((d) => `<ids-list-box-option>${d[this.searchKey]}</ids-list-box-option>`).join('');
  }

  #findMatches(value, list) {
    return list.filter((option) => {
      const regex = new RegExp(value, 'gi');
      return option[this.searchKey].match(regex);
    });
  }

  #displayMatches() {
    const resultsArr = this.#findMatches(this.value, this.data);
    const results = resultsArr.map((result) => {
      const regex = new RegExp(this.value, 'gi');
      const optionText = result[this.searchKey].replace(regex, `<span class="highlight">${this.value.toLowerCase()}</span>`);
      return `<ids-list-box-option>${optionText}</ids-list-box-option>`;
    }).join('');

    this.#openPopup();
    this.#listBox.innerHTML = results;
  }

  #attachEventListeners() {
    this.onEvent('keyup', this, this.#displayMatches);
    this.onEvent('change', this, this.#displayMatches);
    this.onEvent('blur', this, this.#closePopup);
  }
};

export default IdsAutoCompleteMixin;

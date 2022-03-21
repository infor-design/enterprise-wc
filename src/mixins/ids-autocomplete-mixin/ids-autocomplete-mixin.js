import { attributes } from '../../core/ids-attributes';
import { stringToBool, injectTemplate, extractTemplateLiteralsFromHTML } from '../../utils/ids-string-utils/ids-string-utils';
import IdsListBox from '../../components/ids-list-box/ids-list-box';
import IdsListBoxOption from '../../components/ids-list-box/ids-list-box-option';
import IdsPopup from '../../components/ids-popup/ids-popup';
import IdsDataSource from '../../core/ids-data-source';

const IdsAutoCompleteMixin = (superclass) => class extends superclass {
  #listBox = new IdsListBox();

  get listBox() { return this.#listBox; }

  #popup = new IdsPopup();

  get popup() { return this.#popup; }

  get popupContent() {
    return this.popup.container.querySelector('slot[name="content"]');
  }

  /**
   * Gets the internal IdsDataSource object
   * @returns {IdsDataSource} object
   */
  datasource = new IdsDataSource();

  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.AUTOCOMPLETE,
      'search-key'
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

  set autocomplete(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.AUTOCOMPLETE, val);
    } else {
      this.removeAttribute(attributes.AUTOCOMPLETE);
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
      this.setAttribute('search-key', value);
    } else {
      this.removeAttribute('search-key');
    }
  }

  get searchKey() {
    return this.getAttribute('search-key');
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

  /**
   * Item template function that will generate the list box options
   * TODO: Make this a util
   * @returns {object} function
   * @memberof IdsSwapList
   */
  itemTemplateFunc() {
    const func = (item) => this.itemTemplate(item);
    return func;
  }

  /**
   * Return an item's html injecting any values from the dataset as needed.
   * TODO: Make this a util
   * @param  {object} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item) {
    return injectTemplate(this.defaultTemplate, item);
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
    this.#listBox.innerHTML = this.data.map(this.itemTemplateFunc()).join('');
  }

  #findMatches(value, list) {
    let key;

    if (this.searchKey) {
      key = this.templateKeys.find((templateKey) => templateKey === this.searchField);
    } else {
      key = this.templateKeys[0];
    }

    return list.filter((option) => {
      const regex = new RegExp(value, 'gi');
      return option[key].match(regex);
    });
  }

  #displayMatches() {
    const resultsArr = this.#findMatches(this.value, this.data);
    const results = resultsArr.map(this.itemTemplateFunc()).join('');
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

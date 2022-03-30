import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
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

    this.#attachProperties();
    this.#attachPopup();
    this.#attachEventListeners();
  }

  /**
   * Gets the internal IdsDataSource object
   * @returns {IdsDataSource} object
   */
  datasource;

  /**
   * The internal IdsPopup component
   * @private
   */
  #popup;

  /**
   * The internal IdsListBox component
   * @private
   */
  #listBox;

  /**
   * Set autocomplete attribute
   * @param {string | null} value autocomplete value
   */
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

  /**
   * Get the autocomplete attribute
   * @returns {boolean} autocomplete attribute value
   */
  get autocomplete() {
    return this.hasAttribute(attributes.AUTOCOMPLETE);
  }

  /**
   * Set the data array of the autocomplete input
   * @param {Array} value The array to use
   */
  set data(value) {
    if (this.datasource) {
      this.datasource.data = value || [];
    }
  }

  /**
   * Get the data of the autocomplete
   * @returns {Array<any>|object} containing the dataset
   */
  get data() {
    return this?.datasource?.data || [];
  }

  /**
   * Get a list of element dependencies for this component
   * @returns {object} of elements
   */
  get elements() {
    return {
      listBox: this.#listBox,
      popup: this.#popup,
      popupContent: this.#popup?.container.querySelector('slot[name="content"]'),
      listBoxOptions: this.#popup?.shadowRoot.querySelectorAll('ids-list-box-option'),
      rootNode: this.container || window.document.body,
    };
  }

  /**
   * Set searchKey attribute
   * Used as the target term to find matches in the dataset.
   * @param {string | null} value search key value
   */
  set searchKey(value) {
    if (value) {
      this.setAttribute(attributes.SEARCH_KEY, value);
    } else {
      this.removeAttribute(attributes.SEARCH_KEY);
    }
  }

  /**
   * Get searchKey
   * @returns {string | null} containing the searchKey
   */
  get searchKey() {
    const fields = this.data && Object?.keys(this.data[0]);
    return this.getAttribute(attributes.SEARCH_KEY) || fields[0];
  }

  /**
   * Find matches between the input value, searchKey and dataset
   * @param {string | null} value value in the input field
   * @param {Array} list the dataset
   * @returns {Array<any> | null} containing matched values.
   */
  findMatches(value, list) {
    return list.filter((option) => {
      const regex = new RegExp(value, 'gi');
      return option[this.searchKey].toString()?.match(regex);
    });
  }

  /**
   * Display matches from the dataset
   * @returns {void}
   */
  displayMatches() {
    const resultsArr = this.findMatches(this.value, this.data);
    const results = resultsArr.map((result) => {
      const regex = new RegExp(this.value, 'gi');
      const optionText = result[this.searchKey].toString()?.replace(regex, `<span class="highlight">${this.value.toLowerCase()}</span>`);
      return `<ids-list-box-option>${optionText}</ids-list-box-option>`;
    }).join('');

    if (this.value) {
      this.elements.listBox.innerHTML = results;
      this.openPopup();
    } else {
      this.closePopup();
    }
  }

  /**
   * Close popup
   * @returns {void}
   */
  closePopup() {
    this.elements.popup.open = false;
    this.elements.popup.visible = false;
  }

  /**
   * Open popup
   * @returns {void}
   */
  openPopup() {
    this.elements.popup.open = true;
    this.elements.popup.visible = true;
  }

  /**
   * Attach internal properties
   * @returns {void}
   */
  #attachProperties() {
    this.datasource = new IdsDataSource();
    this.#listBox = new IdsListBox();
    this.#popup = document.createElement('ids-popup');
  }

  /**
   * Configure and attach internal IdsPopup element.
   * @returns {void}
   */
  #attachPopup() {
    this.elements.popup.type = 'dropdown';
    this.elements.popup.align = 'bottom, left';
    this.elements.popup.alignTarget = this.fieldContainer || this.container.fieldContainer;
    this.elements.popup.y = -1;

    this.elements.rootNode?.appendChild(this.#popup);
    this.elements.popupContent.appendChild(this.#listBox);
  }

  /**
   * Attach internal event handlers
   * @returns {void}
   */
  #attachEventListeners() {
    this.onEvent('keyup', this, this.displayMatches);
    this.onEvent('change', this, this.displayMatches);
    this.onEvent('blur', this, this.closePopup);
  }

  /**
   * Remove internal event handlers
   * @returns {void}
   */
  #removeEventListeners() {
    this.offEvent('keyup', this, this.displayMatches);
    this.offEvent('change', this, this.displayMatches);
    this.offEvent('blur', this, this.closePopup);
  }

  /**
   * Destroy autocomplete functionality
   * @returns {void}
   */
  destroyAutocomplete() {
    this.#removeEventListeners();
    this.#popup?.remove();
    this.#listBox?.remove();
  }
};

export default IdsAutoCompleteMixin;

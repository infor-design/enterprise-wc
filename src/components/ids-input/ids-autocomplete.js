import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsPopup from '../ids-popup/ids-popup';
import IdsListBox from '../ids-list-box/ids-list-box';
import IdsListBoxOption from '../ids-list-box/ids-list-box-option';
import IdsDataSource from '../../core/ids-data-source';

const IdsAutoComplete = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.AUTOCOMPLETE,
      attributes.SEARCH_FIELD
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();

    if (!this.autocomplete) {
      this.destroyAutocomplete();
      return;
    }

    this.#configurePopup();
    this.#attachEventListeners();
  }

  /**
   * Gets the internal IdsDataSource object
   * @returns {IdsDataSource} object
   */
  datasource = new IdsDataSource();

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
      this.rerender();
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
   * Set searchKey attribute
   * Used as the target term to find matches in the dataset.
   * @param {string | null} value search key value
   */
  set searchField(value) {
    if (value) {
      this.setAttribute(attributes.SEARCH_FIELD, value);
    } else {
      this.removeAttribute(attributes.SEARCH_FIELD);
    }
  }

  /**
   * Get searchField
   * @returns {string | null} containing the searchField
   */
  get searchField() {
    const fields = this.data && Object?.keys(this.data[0]);
    return this.getAttribute(attributes.SEARCH_FIELD) || fields[0];
  }

  get popup() {
    return this.shadowRoot?.querySelector('ids-popup');
  }

  get listBox() {
    return this.shadowRoot?.querySelector('ids-list-box');
  }

  get options() {
    return this.shadowRoot?.querySelectorAll('ids-list-box-option');
  }

  get selectedOption() {
    return this.shadowRoot?.querySelector(`ids-list-box-option[value="${this.value}"]`);
  }

  rerender() {
    super.rerender?.();
    this.popuplateListBox();
  }

  /**
   * Find matches between the input value, searchField and dataset
   * @param {string | null} value value in the input field
   * @param {Array} list the dataset
   * @returns {Array<any> | null} containing matched values.
   */
  findMatches(value, list) {
    return list.filter((option) => {
      const regex = new RegExp(value, 'gi');
      return option[this.searchField].toString()?.match(regex);
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
      const optionText = result[this.searchField].toString()?.replace(regex, `<span class="highlight">${this.value.toLowerCase()}</span>`);
      return this.templatelistBoxOption(result[this.searchField], optionText);
    }).join('');

    if (this.value) {
      this.listBox.innerHTML = results;
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
    this.popup.open = false;
    this.popup.visible = false;
  }

  /**
   * Open popup
   * @returns {void}
   */
  openPopup() {
    this.popup.open = true;
    this.popup.visible = true;
  }

  popuplateListBox() {
    this.listBox.innerHTML = this.data.map((d) => this.templatelistBoxOption(d[this.searchField], d[this.searchField]));
  }

  templatelistBoxOption(value, label) {
    return `<ids-list-box-option value="${value}">${label}</ids-list-box-option>`;
  }

  selectOption(e) {
    this.value = e.target.getAttribute('value');
  }

  /**
   * Configure and attach internal IdsPopup element.
   * @returns {void}
   */
  #configurePopup() {
    this.popup.type = 'dropdown';
    this.popup.align = 'bottom, left';
    this.popup.alignTarget = this.fieldContainer;
    this.popup.y = -1;
  }

  /**
   * Attach internal event handlers
   * @returns {void}
   */
  #attachEventListeners() {
    this.onEvent('mousedown', this.listBox, this.selectOption.bind(this));
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
  }
};

export default IdsAutoComplete;

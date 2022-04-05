import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
// import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsListBox from '../ids-list-box/ids-list-box';
import IdsListBoxOption from '../ids-list-box/ids-list-box-option';
import IdsPopup from '../ids-popup/ids-popup';
import IdsDataSource from '../../core/ids-data-source';
import Base from './ids-autocomplete-base';

import styles from './ids-autocomplete.scss';

/**
 * IDS Autocomplete Component
 * @type {IdsAutoComplete}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-autocomplete')
@scss(styles)
export default class IdsAutoComplete extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.AUTOCOMPLETE,
      attributes.SEARCH_KEY,
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#attachEventListeners();
  }

  /**
   * Gets the internal IdsDataSource object
   * @returns {IdsDataSource} object
   */
  datasource = new IdsDataSource();

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

  get input() {
    return document.querySelector('#input-autocomplete-2');
  }

  get popup() {
    return this.shadowRoot?.querySelector('ids-popup');
  }

  get listBox() {
    return this.shadowRoot?.querySelector('ids-list-box');
  }

  populateListBox() {
    this.listBox.innerHTML = this.data.map((d) => `<ids-list-box-item>${d.label}</ids-list-box-item>`);
  }

  rendered() {
    this.populateListBox();
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
    const resultsArr = this.findMatches(this.input.value, this.data);
    const results = resultsArr.map((result) => {
      const regex = new RegExp(this.input.value, 'gi');
      const optionText = result[this.searchKey].toString()?.replace(regex, `<span class="highlight">${this.input.value.toLowerCase()}</span>`);
      return `<ids-list-box-option>${optionText}</ids-list-box-option>`;
    }).join('');

    if (this.input.value) {
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

  /**
   * Attach internal event handlers
   * @returns {void}
   */
  #attachEventListeners() {
    this.onEvent('keyup', this.input, this.displayMatches.bind(this));
    this.onEvent('change', this.input, this.displayMatches.bind(this));
    this.onEvent('blur', this.input, this.closePopup(this));
  }

  /**
   * Remove internal event handlers
   * @returns {void}
   */
  #removeEventListeners() {
    this.offEvent('keyup', this.input, this.displayMatches);
    this.offEvent('change', this.input, this.displayMatches);
    this.offEvent('blur', this.input, this.closePopup);
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <ids-popup
        type="dropdown"
        align="bottom, left"
        align-target="#input-autocomplete-2"
        part="popup"
      >
        <ids-list-box slot="content"></ids-list-box>
      </ids-popup>
    `;
  }
}

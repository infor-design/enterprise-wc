import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import '../ids-popup/ids-popup';
import '../ids-list-box/ids-list-box';
import '../ids-list-box/ids-list-box-option';
import IdsDataSource from '../../core/ids-data-source';

const IdsAutoComplete = (superclass: any) => class extends superclass {
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
    this.#addAria();
    this.#attachKeyboardListeners();
    this.#attachEventListeners();
  }

  /**
   * Gets the internal IdsDataSource object
   * @returns {IdsDataSource} object
   */
  datasource = new IdsDataSource();

  /**
   * Set autocomplete attribute
   * @param {string | boolean | null} value autocomplete value
   */
  set autocomplete(value: string | boolean | null) {
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
  get autocomplete(): boolean {
    return this.hasAttribute(attributes.AUTOCOMPLETE);
  }

  /**
   * Set the data array of the autocomplete input
   * @param {Array<any>} value The array to use
   */
  set data(value: Array<any> | null | any) {
    if (this.datasource) {
      this.datasource.data = value || [];
      this.#populateListBox();
    }
  }

  /**
   * Get the data of the autocomplete
   * @returns {Array<any>} containing the dataset
   */
  get data(): Array<any> {
    return this?.datasource?.data || [];
  }

  /**
   * Set searchfield attribute
   * Used as the target term to find matches in the dataset.
   * @param {string | null} value search field value
   */
  set searchField(value: string | null) {
    if (value) {
      this.setAttribute(attributes.SEARCH_FIELD, value);
    } else {
      this.removeAttribute(attributes.SEARCH_FIELD);
    }
  }

  /**
   * Get searchField
   * @returns {string} containing the searchField
   */
  get searchField(): string {
    const fields = this.data && Object?.keys(this.data[0]);
    return this.getAttribute(attributes.SEARCH_FIELD) || fields[0];
  }

  /**
   * Get the internal ids-popup element
   * @returns {Element | null | any} IdsPopup Element
   * @readonly
   */
  get popup(): Element | null | any {
    return this.shadowRoot?.querySelector('ids-popup');
  }

  /**
   * Get the internal ids-list-box element
   * @returns {Element | null | any} IdsListBox Element
   * @readonly
   */
  get listBox(): Element | null | any {
    return this.shadowRoot?.querySelector('ids-list-box');
  }

  /**
   * Get all internal ids-list-box-option elements
   * @returns {Element | null | any} IdsListBoxOption Elements
   * @readonly
   */
  get options(): Element | null | any {
    return this.shadowRoot?.querySelectorAll('ids-list-box-option');
  }

  /**
   * Get the selected ids-list-box-option element
   * @returns {Element | null | any} Selected IdsListBoxOption Element
   * @readonly
   */
  get isSelected(): Element | null | any {
    return this.shadowRoot?.querySelector(`ids-list-box-option.is-selected`);
  }

  /**
   * Find matches between the input value, searchField and dataset
   * @param {string | RegExp} value value of the input field
   * @param {Array} list the dataset
   * @returns {Array<any> | null} containing matched values.
   */
  findMatches(value: string | RegExp, list: Array<any>): Array<any> | null {
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
    if (this.readonly || this.disabled) {
      return;
    }

    const resultsArr = this.findMatches(this.value, this.data);
    const results = resultsArr?.map((result) => {
      const regex = new RegExp(this.value, 'gi');
      const optionText = result[this.searchField].toString()?.replace(regex, `<span class="highlight">${this.value.toLowerCase()}</span>`);
      return this.#templatelistBoxOption(result[this.searchField], optionText);
    }).join('');

    if (this.value) {
      this.openPopup();
      this.listBox.innerHTML = results || `<ids-list-box-option>${this.locale.translate('No Results.')}</ids-list-box-option>`;
    } else {
      this.clearOptions();
      this.closePopup();
    }
  }

  /**
   * Popuplate the list box with the current data
   */
  #populateListBox() {
    if (this.listBox) {
      this.listBox.innerHTML = this.data.map((d) => {
        const value = d[this.searchField];
        return this.#templatelistBoxOption(value, value);
      });
    }
  }

  /**
   * Create the list box option template.
   * @param {string | null} value sets the value attr of the option
   * @param {string | null} label sets the label of the option
   * @returns {string} ids-list-box-option template.
   */
  #templatelistBoxOption(value: string | null, label: string | null): string {
    return `<ids-list-box-option value="${value}">${label}</ids-list-box-option>`;
  }

  /**
   * Add internal aria attributes
   * @private
   * @returns {object} This API object for chaining
   */
  #addAria(): object {
    const attrs: any = {
      role: 'combobox',
      'aria-expanded': 'false',
      'aria-autocomplete': 'list',
      'aria-haspopup': 'listbox',
      'aria-controls': this.listBox?.getAttribute('id') || `ids-list-box-${this.id}`
    };

    if (this.listBox) {
      this.listBox.setAttribute('id', `ids-list-box-${this.id}`);
      this.listBox.setAttribute('aria-label', `Listbox`);
    }
    Object.keys(attrs).forEach((key: any) => this.setAttribute(key, attrs[key]));
    return this;
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
   * Set the value of the input to the selected option
   * @param {Event | any} e event
   */
  selectOption(e: Event | any) {
    if (e.target.nodeName === 'IDS-LIST-BOX-OPTION') {
      this.setSelectedOption(e.target);
    }

    if (this.isSelected) {
      this.value = this.isSelected.getAttribute('value');

      this.triggerEvent('selected', this, {
        bubbles: true,
        detail: {
          elem: this,
          value: this.value
        }
      });
    }

    this.closePopup();
  }

  /**
   * Trigger the cleared event when input is cleared
   */
  clearOptions() {
    this.triggerEvent('cleared', this, {
      bubbles: true,
      detail: {
        elem: this,
        value: this.value
      }
    });
  }

  /**
   * Set the selected attributes on the current option
   * @param {Element | any} el element
   */
  setSelectedOption(el: Element | any) {
    el.classList.add('is-selected');
    el.setAttribute('tabindex', '0');
  }

  /**
   * Remove the selected attributes on the current option
   * @param {Element | any} el element
   */
  removeSelectedOption(el: Element | any) {
    el.classList.remove('is-selected');
    el.setAttribute('tabindex', '-1');
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
    this.onEvent('keydownend', this, this.displayMatches);
    this.onEvent('mousedown', this.listBox, this.selectOption.bind(this));
    this.onEvent('blur', this, this.closePopup);
  }

  /**
   * Attach the keyborad listeners
   * @returns {void}
   */
  #attachKeyboardListeners() {
    this.listen(['ArrowDown'], this, (e: Event | any) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      const selected = this.isSelected;
      const firstOption = this.options[0];
      const lastOption = this.options[this.options.length - 1];

      // Select the first option when pressing down arrow
      if (!selected) {
        this.setSelectedOption(firstOption);
      }
      // Select the next option when pressing down arrow
      if (selected?.nextElementSibling) {
        this.removeSelectedOption(selected);
        this.setSelectedOption(selected.nextElementSibling);
        (selected.nextElementSibling as any).focus();
      }
      // Cycle to first option when pressing down arrow and last option is selected
      if (selected === lastOption) {
        this.removeSelectedOption(selected);
        this.setSelectedOption(firstOption);
      }
    });

    this.listen(['ArrowUp'], this, (e: Event | any) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      const selected = this.isSelected;
      const firstOption = this.options[0];
      const lastOption = this.options[this.options.length - 1];

      if (e.altKey) {
        this.value = selected.getAttribute('value');
        this.closePopup();
        return;
      }
      // Select the previus option when pressing up arrow
      if (selected?.previousElementSibling) {
        this.removeSelectedOption(selected);
        this.setSelectedOption(selected.previousElementSibling);
        (selected.previousElementSibling as any).focus();
      }
      // Select the first option when pressing up arrow and first option is selected
      if (selected === firstOption) {
        this.removeSelectedOption(selected);
        this.setSelectedOption(lastOption);
      }
    });

    this.listen([' ', 'Enter'], this.listBox, this.selectOption.bind(this));
    this.listen(['Escape'], this.listBox, this.closePopup.bind(this));
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

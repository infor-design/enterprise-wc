import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import '../ids-popup/ids-popup';
import '../ids-list-box/ids-list-box';
import '../ids-list-box/ids-list-box-option';
import IdsDataSource from '../../core/ids-data-source';
import { EventsMixinInterface } from '../../mixins/ids-events-mixin/ids-events-mixin';
import { KeyboardMixinInterface } from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import { LocaleMixinInterface } from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import { IdsInputInterface } from './ids-input-attributes';
import { IdsConstructor } from '../../core/ids-element';

type Constraints = IdsConstructor<EventsMixinInterface & KeyboardMixinInterface & LocaleMixinInterface>;

const IdsAutoComplete = <T extends Constraints>(superclass: T) => class extends superclass {
  /**
   * Gets the internal IdsDataSource object
   * @returns {IdsDataSource} object
   */
  datasource = new IdsDataSource();

  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.AUTOCOMPLETE,
      attributes.SEARCH_FIELD,
      attributes.VALUE_FIELD,
    ];
  }

  connectedCallback() {
    super.connectedCallback();

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
   * Set autocomplete attribute
   * @param {string | boolean | null} value autocomplete value
   */
  set autocomplete(value: string | boolean | null) {
    const val = stringToBool(value);

    if (val) {
      this.setAttribute(attributes.AUTOCOMPLETE, '');
      this.container?.classList.add('autocomplete');
      this.#attachPopup();
      this.#addAria();
      this.#attachEventListeners();
      this.#attachKeyboardListeners();
    } else {
      this.removeAttribute(attributes.AUTOCOMPLETE);
      this.container?.classList.remove('autocomplete');
      this.destroyAutocomplete();
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
    const fields = this.data && Object?.keys(this.data[0] || {});
    return this.getAttribute(attributes.SEARCH_FIELD) || fields[0];
  }

  /**
   * Dataset field to use as value in selected event
   * @param {string | null} value field from the dataset
   */
  set valueField(value: string | null) {
    if (value) {
      this.setAttribute(attributes.VALUE_FIELD, value);
    } else {
      this.removeAttribute(attributes.VALUE_FIELD);
    }
  }

  /**
   * @returns {string} value field or search field as fallback
   */
  get valueField(): string {
    return this.getAttribute(attributes.VALUE_FIELD) || this.searchField;
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
      return option[this.searchField]?.toString()?.match(regex);
    });
  }

  /**
   * Display matches from the dataset
   * @returns {void}
   */
  displayMatches() {
    if ((this as any).readonly || (this as any).disabled) {
      return;
    }

    const thisAsInput = this as IdsInputInterface;
    const resultsArr = this.findMatches(thisAsInput.value as string, this.data);
    const results = resultsArr?.map((result) => {
      const regex = new RegExp(thisAsInput.value as string, 'gi');
      const optionText = result[this.searchField].toString()?.replace(regex, `<span class="highlight">${(thisAsInput.value as string)?.toLowerCase()}</span>`);
      return this.#templatelistBoxOption(result[this.searchField], optionText, result[this.valueField]);
    }).join('');

    if (thisAsInput.value) {
      this.openPopup();
      this.listBox.innerHTML = results || `<ids-list-box-option>${(this.localeAPI).translate('NoResults')}</ids-list-box-option>`;

      // Change location of the popup after results are populated and the popup's height change
      this.popup.place();
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
        const value = d[this.valueField];
        const label = d[this.searchField];
        return this.#templatelistBoxOption(label, label, value);
      });
    }
  }

  /**
   * Create the list box option template.
   * @param {string | null} value sets the value attr of the option
   * @param {string | null} label sets the label of the option
   * @param {string | null} selectedValue sets the selected value
   * @returns {string} ids-list-box-option template.
   */
  #templatelistBoxOption(value: string | null, label: string | null, selectedValue?: string | null): string {
    return `<ids-list-box-option data-value="${selectedValue}" value="${value}">${label}</ids-list-box-option>`;
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
    this.popup?.hide();
  }

  /**
   * Open popup
   * @returns {void}
   */
  openPopup() {
    if (this.popup) {
      this.popup!.visible = true;
      this.popup?.show();
    }
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
      (this as IdsInputInterface).value = this.isSelected.getAttribute(attributes.VALUE);
      const selectedValue = this.isSelected.dataset?.value;

      this.triggerEvent('selected', this, {
        bubbles: true,
        detail: {
          elem: this,
          value: selectedValue || (this as IdsInputInterface).value
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
        value: (this as IdsInputInterface).value
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
   * Configure internal IdsPopup element.
   * @returns {void}
   */
  #configurePopup() {
    if (this.popup) {
      this.popup.type = 'dropdown';
      this.popup.align = 'bottom, left';
      this.popup.alignTarget = (this as IdsInputInterface).fieldContainer;
      this.popup.y = -1;
    }
  }

  /**
   * Attach and configure internal IdsPopup element
   * @returns {void}
   */
  #attachPopup() {
    // Skip if popup already exists
    if (this.popup) return;
    this.container?.insertAdjacentHTML('beforeend', `
      <ids-popup part="popup">
        <ids-list-box slot="content"></ids-list-box>
      </ids-popup>
    `);
    this.#configurePopup();
  }

  /**
   * Attach internal event handlers
   * @returns {void}
   */
  #attachEventListeners() {
    this.#removeEventListeners();
    this.onEvent('keydownend.autocomplete', this, this.displayMatches);
    this.onEvent('mousedown.autocomplete', this.listBox, this.selectOption.bind(this));
    this.onEvent('blur.autocomplete', this, this.closePopup);
  }

  /**
   * Attach the keyborad listeners
   * @returns {void}
   */
  #attachKeyboardListeners() {
    this.#removeKeyboardListeners();
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
        (this as IdsInputInterface).value = selected.getAttribute('value');
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
  #removeKeyboardListeners() {
    this.unlisten('ArrowDown');
    this.unlisten('ArrowUp');
    this.unlisten(' ');
    this.unlisten('Enter');
    this.unlisten('Escape');
  }

  /**
   * Remove internal event handlers
   * @returns {void}
   */
  #removeEventListeners() {
    this.offEvent('keyup.autocomplete', this);
    this.offEvent('change.autocomplete', this);
    this.offEvent('blur.autocomplete', this);
  }

  /**
   * Destroy autocomplete functionality
   * @returns {void}
   */
  destroyAutocomplete() {
    this.popup?.remove();
    this.#removeEventListeners();
    this.#removeKeyboardListeners();
  }
};

export default IdsAutoComplete;

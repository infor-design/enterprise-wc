import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsListBox from '../../components/ids-list-box/ids-list-box';
import IdsListBoxOption from '../../components/ids-list-box/ids-list-box-option';
import IdsPopup from '../../components/ids-popup/ids-popup';
import IdsDataSource from '../../core/ids-data-source';

const IdsAutoCompleteMixin = (superclass) => class extends superclass {
  #listBox = new IdsListBox();

  get listBox() { return this.#listBox; }

  #popup = new IdsPopup();

  get popup() { return this.#popup; }

  get contentSlot() {
    return this.popup.container.querySelector('slot[name="content"]') || undefined;
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
      attributes.AUTOCOMPLETE
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();

    if (!this.autocomplete) {
      return;
    }

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

  /**
   * Rerenders the IdsInput component
   * @private
   */
  rerender() {
    super.rerender?.();
  }

  #attachPopup() {
    this.parentElement.appendChild(this.#popup);
    this.popup.visible = true;
    this.popup.type = 'dropdown';
    this.popup.alignTarget = this.fieldContainer;
    this.popup.align = 'bottom, left';
    this.popup.y = -1;
    this.popup.open = true;
    this.contentSlot.appendChild(this.#listBox);
  }

  #findMatches(term, data) {
    return data.filter((res) => {
      const regex = new RegExp(term, 'gi');
      return res.label.match(regex);
    });
  }

  #displayMatches() {
    const resultsArr = this.#findMatches(this.value, this.data);
    const results = resultsArr.map((res) => `<ids-list-box-option>${res.label}</ids-list-box-option>`).join('');
    this.#listBox.innerHTML = results;
  }

  #attachEventListeners() {
    this.onEvent('keyup', this, this.#displayMatches);
    this.onEvent('change', this, this.#displayMatches);
  }
};

export default IdsAutoCompleteMixin;

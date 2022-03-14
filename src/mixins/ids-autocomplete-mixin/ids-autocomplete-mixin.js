import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsListBox from '../../components/ids-list-box/ids-list-box';
import IdsListBoxOption from '../../components/ids-list-box/ids-list-box-option';
import IdsDataSource from '../../core/ids-data-source';

const IdsAutoCompleteMixin = (superclass) => class extends superclass {
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
      this.render(true);
    }
  }

  get data() {
    return this?.datasource?.data || [];
  }
};

export default IdsAutoCompleteMixin;

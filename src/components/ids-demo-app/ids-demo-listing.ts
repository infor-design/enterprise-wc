import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-demo-listing-base';
import '../ids-data-grid/ids-data-grid';

/**
 * IDS Demo Listing Component
 * @type {IdsDemoListing}
 * @inherits IdsElement
 */
@customElement('ids-demo-listing')
export default class IdsDemoListing extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    this.#attachColumns();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The propertires in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.LABEL,
      attributes.ID,
      attributes.COMPONENT_NAME
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<ids-data-grid id="${this.id}" list-style="true" label="${this.label}"></ids-data-grid>`;
  }

  /**
   * Set the listing internal label
   * @param {string} value of the label text
   */
  set label(value: string) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }
  }

  get label() {
    return this.getAttribute(attributes.LABEL);
  }

  /**
   * Set the id internal label
   * @param {string} value of the label text
   */
  set id(value: string) {
    if (value) {
      this.setAttribute(attributes.ID, value);
    } else {
      this.removeAttribute(attributes.ID);
    }
  }

  get id() {
    return this.getAttribute(attributes.ID);
  }

  /**
   * Set the component name
   * @param {string} value name of the component
   */
  set componentName(value: string) {
    if (value) {
      this.setAttribute(attributes.COMPONENT_NAME, value);
    } else {
      this.removeAttribute(attributes.COMPONENT_NAME);
    }
  }

  get componentName() {
    return this.getAttribute(attributes.COMPONENT_NAME);
  }

  /**
   * Set the yaml on the datagrid
   * @param {string} value of the label text
   */
  set data(value: Record<string, any>) {
    this.container.data = value;
  }

  get data() {
    return this.container.data;
  }

  /**
   * Set the datagrid columns
   */
  #attachColumns = () => {
    const columns = [];
    columns.push({
      id: 'link',
      name: 'Example Name',
      field: 'link',
      href: `./${this.componentName}/{{value}}`,
      sortable: true,
      formatter: this.container.formatters.hyperlink
    });
    columns.push({
      id: 'type',
      name: 'Example Type',
      field: 'type',
      sortable: true,
      formatter: this.container.formatters.text
    });
    columns.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      formatter: this.container.formatters.text
    });

    this.container.columns = columns;
  };
}

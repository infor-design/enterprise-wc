import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';

import '../ids-data-grid/ids-data-grid';
import type IdsDataGrid from '../ids-data-grid/ids-data-grid';

/**
 * IDS Demo Listing Component
 * @type {IdsDemoListing}
 * @inherits IdsElement
 */
@customElement('ids-demo-listing')
export default class IdsDemoListing extends IdsElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
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
  set label(value: string | null) {
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
   * Set the component name
   * @param {string} value name of the component
   */
  set componentName(value: string | null) {
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
   * Set the yaml on the data grid
   * @param {string} value of the label text
   */
  set data(value: Array<Record<string, any>>) {
    if (this.container) {
      (this.container as IdsDataGrid).data = value;
    }
  }

  get data() {
    return (this.container as IdsDataGrid).data;
  }

  /**
   * Set the data grid columns
   */
  #attachColumns = () => {
    const columns = [];
    columns.push({
      id: 'link',
      name: 'Example Name',
      field: 'link',
      href: `/${this.componentName}/{{value}}`,
      sortable: true,
      formatter: (this.container as IdsDataGrid)?.formatters.hyperlink
    });
    columns.push({
      id: 'type',
      name: 'Example Type',
      field: 'type',
      sortable: true,
      formatter: (this.container as IdsDataGrid)?.formatters.text
    });
    columns.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      formatter: (this.container as IdsDataGrid)?.formatters.text
    });

    (this.container as IdsDataGrid).columns = columns;
  };
}

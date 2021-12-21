import { attributes, IdsDataSource } from '../../core';
import IdsPager from '../../components/ids-pager';

/**
/**
 * A mixin that adds pager functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsPagerMixin = (superclass) => class extends superclass {
  #pager = new IdsPager();

  datasource = new IdsDataSource();

  constructor() {
    super();

    this.#pager.innerHTML = `
      <ids-pager-button first></ids-pager-button>
      <ids-pager-button previous></ids-pager-button>
      <ids-pager-input></ids-pager-input>
      <ids-pager-button next></ids-pager-button>
      <ids-pager-button last></ids-pager-button>
    `;

    this.#pager.pageNumber = Math.max(parseInt(this.pageNumber) || 1, 1);
    this.#pager.pageSize = Math.max(parseInt(this.pageSize) || 0, 1);
    // this.#pager.pageSize = parseInt(this.pageSize) || false;
  }

  get pager() { return this.#pager; }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.PAGINATION,
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.PAGE_TOTAL,
    ];
  }

  /**
   * Sets the pagination attribute
   * @param {string} value - none|client-side|standalone
   */
  set pagination(value) { this.setAttribute(attributes.PAGINATION, value); }

  /**
   * Gets the pagination attribute
   * @returns {string} default is "none"
   */
  get pagination() { return this.getAttribute(attributes.PAGINATION) || 'none'; }

  set pageNumber(value) {
    this.setAttribute(attributes.PAGE_NUMBER, value);
    this.pager.pageNumber = value;
    this.datasource.pageNumber = value;
  }

  get pageNumber() { return this.getAttribute(attributes.PAGE_NUMBER) || this.pager.pageNumber; }

  set pageSize(value) {
    this.setAttribute(attributes.PAGE_SIZE, value);
    this.pager.pageSize = value;
    this.datasource.pageSize = value;
  }

  get pageSize() { return this.getAttribute(attributes.PAGE_SIZE) || this.pager.pageSize; }

  // set pageTotal(value) { this.pager.total = value; }

  // get pageTotal() { return this.getAttribute(attributes.TOTAL) || this.pager.total; }
  get pageTotal() { return this.datasource.total; }

  rerender() {
    super.rerender?.();
    console.log('IdsPagerMixin.rerender');
    this.#attachPager();
  }

  connectedCallback() {
    console.log('IdsPagerMixin.connectedCallback() running...');
    super.connectedCallback?.();
    this.#attachPager();
  }

  /**
   * Appends IdsPager to this element if pagination is enabled.
   * @private
   */
  #attachPager() {
    const pager = this.shadowRoot?.querySelector('ids-pager');
    if (!this.pagination || this.pagination === 'none') {
      pager?.remove();
      return;
    }

    this.pager.total = this.datasource.total;
    this.datasource.pageSize = this.pageSize;

    this.offEvent('pagenumberchange', this.pager);
    this.onEvent('pagenumberchange', this.pager, ({ detail }) => {
      console.log('attachPagerHandlers firing...', detail);
      this.pageNumber = detail.value;

      // TODO: find a better way/trigger to load results without rebuilding entire component
      this.rerender();
    });

    if (pager) {
      console.log('pager.replaceWith(this.pager)');
      pager.replaceWith(this.pager);
    } else {
      console.log('this.shadowRoot?.appendChild(this.pager)');
      this.shadowRoot?.appendChild(this.pager);
    }
  }

  // get data() {
  //   const pagination = this.pagination;
  //   const pager = this.pager;
  //   console.log('pagination && pager', pagination, pager);
  //   // debugger;
  //   if (pagination !== 'none' && pager) {
  //     if (pagination === 'standalone') {
  //       // Standalone: Just add the pager and do not link it to the grid.
  //       // In the example just show the pager events firing the end developer will do the rest.
  //       console.log(`pagenumberchange => ${pagination}`, this.datasource?.data);
  //     } else if (pagination === 'client-side') {
  //       // ClientSide: Do the paging on the dataset thats attached.
  //       // Probably this logic goes into IdsDataSource
  //       console.log(`pagenumberchange => ${pagination}`, this.datasource?.data);
  //       return this?.datasource?.pager(pager.pageNumber, pager.pageSize);
  //     } else if (pagination === 'server-side') {
  //       // ServerSide: Do the paging on the dataset thats attached and fire the pager events through the datagrid.
  //       // Show this in the example working
  //       // (can mock the data with a timeout instead of real serverside logic since we only have static JSON)
  //       console.log(`pagenumberchange => ${pagination}`, this.datasource?.data);
  //     }
  //   }

  //   console.log('made it here');
  //   return this?.datasource?.data || [];
  // }
};

export default IdsPagerMixin;

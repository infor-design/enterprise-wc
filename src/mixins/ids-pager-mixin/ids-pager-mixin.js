import { attributes } from '../../core/ids-attributes';
import IdsDataSource from '../../core/ids-data-source';
import IdsButton from '../../components/ids-button/ids-button';
import IdsPager from '../../components/ids-pager/ids-pager';
// import IdsPopup from '../../components/ids-popup/ids-popup';
// import IdsPopupMenu from '../../components/ids-popup-menu/ids-popup-menu';
import IdsMenuButton from '../../components/ids-menu-button/ids-menu-button';

/**
/**
 * A mixin that adds pager functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsPagerMixin = (superclass) => class extends superclass {
  datasource = new IdsDataSource();

  #pager = new IdsPager();

  // #popup = new IdsPopupMenu();
  // #button = new IdsButton();

  constructor() {
    super();

    this.#pager.innerHTML = `
      <ids-pager-button first></ids-pager-button>
      <ids-pager-button previous></ids-pager-button>
      <ids-pager-input></ids-pager-input>
      <ids-pager-button next></ids-pager-button>
      <ids-pager-button last></ids-pager-button>
      <div slot="end">
        <ids-menu-button id="pager-size-menu-button" menu="pager-size-menu" role="button" dropdown-icon>
          <span slot="text">${this.pageSize} Records per page</span>
        </ids-menu-button>
        <ids-popup-menu id="pager-size-menu" target="#pager-size-menu-button" trigger="click">
          <ids-menu-group>
            <ids-menu-item>10</ids-menu-item>
            <ids-menu-item>25</ids-menu-item>
            <ids-menu-item>50</ids-menu-item>
            <ids-menu-item>100</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      </div>
    `;

    // const popup = new IdsPagerSection();
    // popup.innerHTML = `
    //   <ids-menu-button id="ids-pager"" menu="pager-size-menu" icon-align="end">
    //     <span slot="text">${this.pageSize} Records per page</span>
    //     <ids-icon slot="icon" icon="dropdown"></ids-icon>
    //   </ids-menu-button>
    //   <ids-popup-menu id="pager-size-menu"" target="pager-size-menu"" trigger="click">
    //     <ids-menu-group>
    //       <ids-menu-item>Action 1</ids-menu-item>
    //       <ids-menu-item>Action 2</ids-menu-item>
    //       <ids-menu-item>Action 3</ids-menu-item>
    //     </ids-menu-group>
    //   </ids-popup-menu>
    // `;

    // this.#pager.appendChild(popup);

    // this.#pager.innerHTML = `
    //   <div>
    //     <ids-pager-button first></ids-pager-button>
    //     <ids-pager-button previous></ids-pager-button>
    //     <ids-pager-input></ids-pager-input>
    //     <ids-pager-button next></ids-pager-button>
    //     <ids-pager-button last></ids-pager-button>
    //   </div>
    //   <div slot="end">
    //     <ids-menu-button id="ids-pager"" menu="pager-size-menu" icon-align="end">
    //       <span slot="text">${this.pageSize} Records per page</span>
    //       <ids-icon slot="icon" icon="dropdown"></ids-icon>
    //     </ids-menu-button>
    //     <ids-popup-menu id="pager-size-menu"" target="pager-size-menu"" trigger="click">
    //       <ids-menu-group>
    //         <ids-menu-item>Action 1</ids-menu-item>
    //         <ids-menu-item>Action 2</ids-menu-item>
    //         <ids-menu-item>Action 3</ids-menu-item>
    //       </ids-menu-group>
    //     </ids-popup-menu>
    //   </div>
    // `;

    this.#pager.pageNumber = Math.max(parseInt(this.pageNumber) || 1, 1);
    this.#pager.pageSize = Math.max(parseInt(this.pageSize) || 0, 1);

    // this.#popup.innerHTML = `<span slot="text">${this.pageSize} Records per page</span>`;
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

    // this.#popup.querySelector('span').textContent = `${value} Records per page`;
  }

  get pageSize() { return this.getAttribute(attributes.PAGE_SIZE) || this.pager.pageSize; }

  get pageTotal() { return this.datasource.total; }

  rerender() {
    super.rerender?.();
    this.#attachPager();
  }

  connectedCallback() {
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
      this.pageNumber = detail.value;

      // TODO: find a better way/trigger to load results without rebuilding entire component
      this.rerender();
    });

    if (pager) {
      pager.replaceWith(this.pager);
    } else {
      this.shadowRoot?.append(this.#pager);
      // this.shadowRoot?.append(this.#pager, this.#popup);
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

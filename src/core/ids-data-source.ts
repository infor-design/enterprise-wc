import { deepClone } from '../utils/ids-deep-clone-utils/ids-deep-clone-utils';

export const PAGINATION_TYPES = {
  NONE: 'none',
  CLIENT_SIDE: 'client-side',
  SERVER_SIDE: 'server-side',
  STANDALONE: 'standalone',
} as const;

export type PaginationTypes = typeof PAGINATION_TYPES[keyof typeof PAGINATION_TYPES];

export type AggregationTypes = { name: 'sum', field: null } | { name: 'avg', field: null } | { name: 'min', field: null } | { name: 'max', field: null } | { name: 'count', field: null };

// Interfaces
export interface GroupableOptions {
  /* Set the fields to group */
  fields: Array<string>;
  /* Set the aggregators to use */
  aggregators?: Array<AggregationTypes>;
  /* Set the aggregators to use */
  expanded?: true | ((row: number, cell: number, data: Record<string, any>) => boolean);
  /* Function to format the group row (header) */
  // eslint-disable-next-line max-len
  groupRowFormatter?: (idx: number, row: number, cell: number, value: any, col: any, item: Record<string, any>, api: any) => void;
  /* If true show a footer row with optional formatter */
  groupFooterRow?: boolean;
  /* Function to format the group footer */
  // eslint-disable-next-line max-len
  groupFooterRowFormatter?: (idx: number, row: number, cell: number, value: any, col: any, item: Record<string, any>, api: any) => void;
}

/**
 * Handle Attaching Array / Object Data to Components
 * Features (now and future):
 *  - data
 *  - sort
 *  - filter
 *  - read/map/loop
 *  - primaryKey
 *  - retrieval
 *  - CRUD
 *  - paging (pageSize, serverSide, cache)
 *  - events (requestStart, requestEnd, change, error)
 *  - sync (sync back original array)
 */
class IdsDataSource {
  /**
   * Holds a reference to the original data
   * @private
   */
  #originalData: Array<Record<string, any>> = [];

  /**
   * Holds the data in its current state
   * @private
   */
  #currentData: Array<Record<string, any>> = [];

  /**
   * Holds the current data to use with filter
   * @private
   */
  #currentFilterData: any = null;

  /**
   * Holds the type of pagination being used
   * @private
   */
  #pagination: PaginationTypes = PAGINATION_TYPES.NONE;

  /**
   * Page-number used for pagination
   * @private
   */
  #pageNumber = 1;

  /**
   * Page-size used for pagination
   * @private
   */
  #pageSize: any;

  /**
   * Name of the primary key to use for dataset operations
   * @private
   */
  #primaryKey = 'id';

  /**
   * An override for the total number of items in data
   * @private
   */
  #total: any;

  /**
   * If true use a flattened data representation
   * @private
   */
  #flatten = false;

  /**
   * If set use a grouped data representation
   * @private
   */
  #groupable?: GroupableOptions;

  /**
   * If true use a filtered data representation
   * @private
   */
  #filtered = false;

  /**
   * Internal data id used for virtual scrolling
   * @private
   */
  #vsRefId = 0;

  /**
   * Return all the currently used data, without paging or filter
   * @returns {Array | null} All the currently used data
   */
  get allData() {
    if (this.#currentFilterData) {
      return this.flatten
        ? this.#flattenData(this.#currentFilterData)
        : this.#currentFilterData;
    }
    return this.#currentData;
  }

  /**
   * Sets the data array on the data source object
   * @param {Array | null} value The array to attach
   */
  set data(value: Array<Record<string, any>> | null) {
    const copy = deepClone(value) ?? [];
    this.#currentData = this.groupable ? this.#groupData(copy) : this.#flattenData(copy);
    this.#originalData = copy.slice(0);
    this.#total = this.#currentData?.length || 0;
  }

  /**
   * Return the currently used data in its current state
   * @returns {Array | null} The attached array of data in its current state
   */
  get data(): Array<Record<string, any>> {
    if (this.pageSize && this.pageSize < this.total) {
      return this.paginate(this.pageNumber, this.pageSize);
    }

    return this.#currentData;
  }

  get currentData() {
    return this.#unFlattenData(this.#currentData);
  }

  /* Provides ability to set the current data */
  set currentData(value: Array<Record<string, any>>) {
    this.#currentData = value;
  }

  /* Provides ability to get the original data */
  get originalData() {
    return this.#originalData;
  }

  /* If true a flattened data model is used */
  get flatten() {
    return this.#flatten;
  }

  /* If true a flattened data model is used */
  set flatten(value: boolean) {
    this.#flatten = value;
  }

  /* If set a grouped data model is used */
  get groupable(): GroupableOptions | undefined {
    return this.#groupable;
  }

  /* If true a grouped data model is used */
  set groupable(value: GroupableOptions) {
    this.#groupable = value;
  }

  /* If true data is currently filtered */
  get filtered() {
    return this.#filtered;
  }

  /* Set filtered value */
  set filtered(value: boolean) {
    this.#filtered = value;
  }

  /**
   * Flatten tree data internally
   * @param {Record<string, unknown>} data The data array
   * @returns {Record<string, unknown>} The flattened data
   */
  #flattenData(data: Array<Record<string, any>>) {
    if (!this.#flatten) return data;
    this.#vsRefId = 0;

    const newData: Array<Record<string, any>> = [];
    const addRows = (
      subData: Array<Record<string, any>>,
      length: number,
      depth: number,
      parentElement: string,
      parentRow: Record<string, any>,
      hideChildren = false
    ) => {
      subData.map((row: Record<string, any>, index: number) => {
        row.parentElement = '';
        row.ariaLevel = depth;
        row.ariaSetSize = length;
        row.ariaPosinset = index + 1;
        row.vsRefId = this.#vsRefId++;
        row.isRoot = depth === 1;
        row.childrenVRefIds = [];

        if (depth === 1) {
          row.originalElement = index;
          if (this.pageNumber > 1) {
            row.originalElement = index + ((this.pageNumber - 1) * this.pageSize);
          }
        }

        if (depth > 1) {
          row.parentElement = parentElement;
          row.rowHidden = hideChildren;
          parentRow.childrenVRefIds.push(row.vsRefId);
        }

        newData.push(row);

        if (row.children?.length) {
          row.childCount = row.children.length;
          row.rowExpanded = !(row.rowExpanded === false);
          if (this.pageNumber > 1) {
            index += ((this.pageNumber - 1) * this.pageSize);
          }

          const parentIds = `${row.parentElement ? `${row.parentElement} ` : ''}${row.id}`;
          const childrenHidden = row.rowExpanded === false || hideChildren;
          addRows(row.children, row.children.length, depth + 1, parentIds, row, childrenHidden);
        }
      });
    };

    addRows(data, data.length, 1, '', data[0]);
    return newData;
  }

  /**
   * Flatten tree data internally
   * @param {Record<string, unknown>} data The data array
   * @returns {Record<string, unknown>} The flattened data
   */
  #unFlattenData(data: Record<string, any>) {
    if (!this.#flatten) return data;

    const dataMap: Record<string, any> = {};
    data.forEach((row: any) => {
      dataMap[row?.id] = row;
    });

    const newData = data.filter((row: Record<string, any>) => {
      delete row.ariaSetSize;
      delete row.ariaPosinset;
      const level = row.ariaLevel;
      delete row.ariaLevel;
      delete row.isRoot;
      delete row.childrenVRefIds;
      delete row.vsRefId;
      delete row.rowHidden;

      dataMap[row.id] = row;

      row.children?.forEach((child: any, idx: number) => {
        // Persist child states
        row.children[idx] = dataMap[child?.id];
      });

      return level === 1;
    });

    return newData;
  }

  /**
   * Group data into a tree form of data
   * @param {Record<string, unknown>} data The data array
   * @returns {Record<string, unknown>} The flattened data
   */
  #groupData(data: Array<Record<string, any>>) {
    if (!this.groupable) return data;

    let groupedData = this.#groupBy(data, this.groupable.fields[0], this.groupable.aggregators);
    this.flatten = true;
    groupedData = this.#flattenData(groupedData);
    this.flatten = false;
    return groupedData;
  }

  /**
   * Get the total number of items in data
   * @returns {number} - the current page-total
   */
  get total() { return this.#total; }

  /**
   * Override the total number of items in data
   * @param {number} value - the new page-total
   */
  set total(value) { this.#total = value; }

  /**
   * Set the current page-number
   * @param {number} value - new the page-number
   */
  set pageNumber(value) { this.#pageNumber = value; }

  /**
   * Get the curret page-number
   * @returns {number} - the current page-number
   */
  get pageNumber() { return this.#pageNumber; }

  /**
   * Set the current page-size
   * @param {number} value - new the page-size
   */
  set pageSize(value) { this.#pageSize = value; }

  /**
   * Get the current page-size
   * @returns {number} - the current page-size
   */
  get pageSize() { return this.#pageSize; }

  /**
   * Set the current pagination type
   * @param {PaginationTypes} value - new pagination type
   */
  set pagination(value: PaginationTypes) { this.#pagination = value; }

  /**
   * Get the current pagination type
   * @returns {PaginationTypes} - the current pagination type
   */
  get pagination() { return this.#pagination; }

  /**
   * Prevent running more than once with pagination
   * @private
   */
  #prevState: any = {
    pageNumber: -1,
    pageSize: -1,
    data: null,
    doUpdate: false
  };

  /**
   * Set the name of the data property to use as a primary key
   * @param {string} value primary key name
   */
  set primaryKey(value: string) { this.#primaryKey = value; }

  /**
   * Get the current name of the data property used as a primary key
   * @returns {string} primary key name
   */
  get primaryKey() { return this.#primaryKey; }

  /**
   * Reset previous state
   * @private
   * @returns {void}
   */
  #resetPrevState(): void {
    this.#prevState = { pageNumber: -1, pageSize: -1, data: null };
  }

  /**
   * Ckeck previous state
   * @private
   * @param {number|string} num Page number
   * @param {number|string} size Page size
   * @returns {boolean} True, if previous state
   */
  #isPrevState(num: number | string, size: number | string): boolean {
    const { pageNumber, pageSize, doUpdate } = this.#prevState;
    return !doUpdate && pageNumber === Number(num) && pageSize === Number(size);
  }

  /**
   * @param {number} pageNumber - a page number to start with
   * @param {number} pageSize - number of items to return
   * @returns {Array} the paginated data
   */
  paginate(pageNumber = 1, pageSize = 10) {
    if (this.#isPrevState(pageNumber, pageSize)) return this.#prevState.data;
    this.#prevState.pageNumber = Number(pageNumber);
    this.#prevState.pageSize = Number(pageSize);

    pageNumber = Math.max(pageNumber || 1, 1);
    pageSize = pageSize || 1;

    let last = pageNumber * pageSize;
    let start = last - pageSize;

    // For server-side paging, only use page size
    // (server-side paging assumes dataset is already sliced)
    if (this.pagination === 'server-side') {
      last = pageSize;
      start = 0;
    }

    let data;
    if (this.flatten) {
      const unFlattenData = this.#unFlattenData(deepClone(this.#currentData));
      data = this.#flattenData(unFlattenData.slice(start, last));
    } else {
      data = this.#currentData.slice(start, last);
    }
    this.#prevState.data = data;
    this.#prevState.doUpdate = false;

    return data;
  }

  /**
   * Marks the previous state cache to be updated on the next access
   */
  refreshPreviousState() {
    this.#prevState.doUpdate = true;
  }

  /**
   * Creates new records in the current dataset to reflect new state
   * @param {Array<Record<string, unknown>>} items incoming records to update
   * @param {number} index the index at which to create the value
   */
  create(items: Array<Record<string, unknown>> = [], index: number = 0) {
    if (!items.length) return;

    let currentIndex = index;
    items.forEach((newRecord) => {
      this.originalData.splice(currentIndex, 0, newRecord);
      this.currentData.splice(currentIndex, 0, newRecord);
      currentIndex++;
    });

    // Update totals/stored data state/page size
    this.#total = this.#currentData.length;
  }

  /**
   * Updates records in the current dataset to reflect new state
   * @param {Array<Record<string, unknown>>} items incoming records to update
   * @param {boolean} overwrite true if the record should be completely overwritten as opposed to augmented
   */
  update(items: Array<Record<string, unknown>> = [], overwrite: boolean = false) {
    items.forEach((updatedRecord, index) => {
      if (!(this.primaryKey in updatedRecord)) {
        updatedRecord[this.primaryKey] = index;
      }
      const idx = this.#currentData.findIndex((rec) => rec[this.primaryKey] === updatedRecord[this.primaryKey]);

      if (idx > -1) {
        const newRecord = overwrite ? updatedRecord : { ...this.#currentData[idx], ...updatedRecord };
        this.#originalData[idx] = newRecord;
        this.#currentData[idx] = newRecord;
      }

      // If filter is active, update stored original data
      if (this.#currentFilterData) {
        const filterIdx = this.#currentFilterData
          .findIndex((rec: Record<string, any>) => rec[this.primaryKey] === updatedRecord[this.primaryKey]);

        if (filterIdx > -1) {
          const newRecord = overwrite ? updatedRecord : { ...this.#currentFilterData[filterIdx], ...updatedRecord };
          this.#currentFilterData[filterIdx] = newRecord;
        }
      }
    });
  }

  /**
   * Deletes records from the current dataset to reflect new state
   * @param {Array<Record<string, unknown>>} items incoming records to delete
   */
  delete(items: Array<Record<string, unknown>> = []) {
    if (!items.length) return;

    // Store current last page
    const currentLastPage = Math.ceil(this.#total / this.#pageSize);

    // Delete records
    items.forEach((updatedRecord) => {
      const i = this.#currentData.findIndex((rec) => rec[this.primaryKey] === updatedRecord[this.primaryKey]);
      if (i > -1) {
        this.originalData.splice(i, 1);
        this.currentData.splice(i, 1);
      }

      // If filter is active, update stored original data
      if (this.#currentFilterData) {
        const i = this.#currentFilterData.findIndex((rec: Record<string, any>) => rec[this.primaryKey] === updatedRecord[this.primaryKey]);
        if (i > -1) {
          this.#currentFilterData.splice(i, 1);
        }
      }
    });

    // Update totals/stored data state/page size
    this.#total = this.#currentData.length;
    this.#prevState.data = this.paginate(this.pageNumber, this.pageSize);

    // If last page is further than total records, reset last page
    const newLastPage = Math.ceil(this.#total / this.#pageSize);
    if (newLastPage < currentLastPage) this.pageNumber -= 1;
  }

  /**
   * Executes a provided function once for each array element in the current data
   * @param {Function} fn An optional function to iterate the array
   */
  forEach(fn: any) {
    this.#currentData.forEach(fn);
  }

  /**
   * Sort the dataset
   * @param {string} field The dataset field
   * @param {boolean} reverse Sort ascending or descending
   */
  sort(field: string, reverse: boolean) {
    const sort = this.sortFunction(field, reverse);
    this.#resetPrevState();
    if (this.flatten) {
      const unFlattenData = this.#unFlattenData(this.#currentData);
      unFlattenData.sort(sort);
      this.#currentData = this.#flattenData(unFlattenData);
      return;
    }

    if (this.groupable) {
      this.#originalData.sort(sort);
      this.#currentData = this.#groupData(deepClone(this.#originalData));
      return;
    }
    this.#currentData.sort(sort);
    this.#originalData.sort(sort);
  }

  /**
   * An overridable array sort function
   * @param {string} field The dataset field
   * @param {any} ascending Sort ascending or descending
   * @returns {object} The sorted dataset
   */
  sortFunction(field: string, ascending: any) {
    const primer = (a: any) => {
      a = (a === undefined || a === null ? '' : a);
      if (typeof a === 'string') {
        a = a.toUpperCase();

        // Convert number-only strings to real numbers before actual sort occurs
        const numeric = Number(a);
        if (a !== '' && !Number.isNaN(numeric) && Number.isFinite(numeric)) {
          a = numeric;
        }
      }
      return a;
    };

    const key = (x: any) => primer(x[field]);
    ascending = !ascending ? -1 : 1;

    return (a: any, b: any) => {
      a = key(a);
      b = key(b);

      // Imitate how Excel sorts when comparing numbers with strings (numbers are always less than strings)
      // The following string values will sort in this order (ascending):
      // 1, 2, 07, 11, 1a, 22a, 2ab, a, B, c
      if (typeof a === 'number' && typeof b === 'string' && b !== '') return ascending * -1;
      if (typeof a === 'string' && typeof b === 'number' && a !== '') return ascending;

      // an empty a always returns 1 (or 0 if equal with b)
      if (a === '') return b === '' ? 0 : 1;

      // an empty b always returns -1 (or 0 if equal with a)
      if (b === '') return a === '' ? 0 : -1;

      if (typeof a !== typeof b) {
        a = a.toString().toLowerCase();
        b = b.toString().toLowerCase();
      }

      return ascending * (Number(a > b) - Number(b > a));
    };
  }

  /**
   * Filter current data with given callback
   * will reset filter data, if given callback not found
   * @param {Function} filterFunction User filter function
   * @returns {void}
   */
  filter(filterFunction: any) {
    // Updated the current data
    const updateCurrentData = (data: any) => {
      this.#currentData = this.flatten ? this.#flattenData(data) : data;
      this.total = this.#currentData.length;
      this.pageNumber = 1;
    };

    // Reset the current data
    const resetCurrentData = () => {
      updateCurrentData(this.#currentFilterData);
      this.#currentFilterData = null;
      this.#resetPrevState();
      this.filtered = false;
    };

    // Check if need to filter or reset
    if (typeof filterFunction === 'function') {
      const useData = this.flatten ? this.#unFlattenData(this.#currentData) : this.#currentData;
      this.#currentFilterData = this.#currentFilterData || useData;

      // Run thru the filter process
      this.#currentFilterData.forEach((row: any, index: number) => {
        row.isFilteredOut = filterFunction(row, index);
      });

      // Get data either filtered or not
      // if filtered then update the current data, else reset it
      if (this.#currentFilterData.some((row: any) => row.isFilteredOut)) {
        const data = this.#currentFilterData.filter((row: any) => {
          const r = !row.isFilteredOut;
          delete row.isFilteredOut;
          return r;
        });
        updateCurrentData(data);
        this.#resetPrevState();
        this.filtered = true;
      } else {
        resetCurrentData(); // reset, if none of filtered row found
      }
    } else if (this.#currentFilterData) {
      resetCurrentData(); // reset, if callback not found
    }
  }

  /**
   * Group By a specific field
   * @param {Array<Record<string, any>>} data the actions to add on grouped rows
   * @param {string} field the field to group by
   * @param {Array<string>} aggregators the actions to add on grouped rows
   * @returns {Array<unknown>} the grouped data
   */
  #groupBy(data: Array<Record<string, any>>, field: string, aggregators?: Array<AggregationTypes>) {
    const groups: any = [];

    data.forEach((row: any) => {
      const value1 = row[field];
      const key = `${value1}`;

      let foundParent = groups.find((x: Record<string, unknown>) => x[field] === key);
      if (!foundParent) {
        const groupRow: Record<string, unknown> = { isGroupRow: true, groupChildCount: 1, children: [row] };
        groupRow[field] = value1;
        groupRow.groupLabel = value1;
        groups.push(groupRow);
        foundParent = groups.find((x: Record<string, unknown>) => x[field] === key);
      } else {
        foundParent.children.push(row);
        foundParent.groupChildCount++;
      }
    });

    // TODO: Add more aggregators
    if (aggregators) {
      groups.forEach((group: any) => {
        group.children.forEach((row: any) => {
          aggregators.forEach((aggregator: any) => {
            if (aggregator.name === 'sum') {
              if (!group.sum) group.sum = 0;
              group.sum += Number(row[aggregator.field]);
            }
          });
        });
      });
    }

    return groups;
  }
}

export default IdsDataSource;

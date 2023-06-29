import { deepClone } from '../utils/ids-deep-clone-utils/ids-deep-clone-utils';

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
 *  - aggregates / group by
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
   * If true use a filtered data representation
   * @private
   */
  #filtered = false;

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
  set data(value) {
    this.#currentData = this.#flattenData(deepClone(value));
    this.#originalData = value;
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

    const newData: Array<Record<string, any>> = [];
    const addRows = (subData: Record<string, any>, length: number, depth: number, parentElement: string) => {
      subData.map((row: Record<string, any>, index: number) => {
        row.parentElement = '';
        row.ariaLevel = depth;
        row.ariaSetSize = length;
        row.ariaPosinset = index + 1;

        if (depth === 1) {
          row.originalElement = index;
          if (this.pageNumber > 1) {
            row.originalElement = index + ((this.pageNumber - 1) * this.pageSize);
          }
        }
        if (depth > 1) row.parentElement = parentElement;
        newData.push(row);

        if (row.children) {
          if (this.pageNumber > 1) {
            index += ((this.pageNumber - 1) * this.pageSize);
          }
          addRows(row.children, row.children.length, depth + 1, `${row.parentElement ? `${row.parentElement} ` : ''}${row.id}`);
        }
      });
    };

    addRows(data, data.length, 1, '');
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
   * Prevent running more than once with pagination
   * @private
   */
  #prevState: any = { pageNumber: -1, pageSize: -1, data: null };

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
    const { pageNumber, pageSize } = this.#prevState;
    return pageNumber === Number(num) && pageSize === Number(size);
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

    const last = pageNumber * pageSize;
    const start = last - pageSize;
    let data;

    if (this.flatten) {
      const unFlattenData = this.#unFlattenData(deepClone(this.#currentData));
      data = this.#flattenData(unFlattenData.slice(start, start + pageSize));
    } else {
      data = this.#currentData.slice(start, start + pageSize);
    }
    this.#prevState.data = data;

    return data;
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
}

export default IdsDataSource;

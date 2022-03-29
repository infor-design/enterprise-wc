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
  #originalData = [];

  /**
   * Holds the data in its current state
   * @private
   */
  #currentData = [];

  /**
   * Holds the current data to use with filter
   * @private
   */
  #currentFilterData = null;

  /**
   * Page-number used for pagination
   * @private
   */
  #pageNumber = 1;

  /**
   * Page-size used for pagination
   * @private
   */
  #pageSize;

  /**
   * An override for the total number of items in data
   * @private
   */
  #total;

  /**
   * Return all the currently used data, without paging or filter
   * @returns {Array | null} All the currently used data
   */
  get allData() { return this.#currentFilterData ?? this.#currentData; }

  /**
   * Sets the data array on the data source object
   * @param {Array | null} value The array to attach
   */
  set data(value) {
    this.#currentData = deepClone(value);
    this.#originalData = this.#originalData || value;
    this.#total = this.#currentData?.length || 0;
  }

  /**
   * Return the currently used data in its current state
   * @returns {Array | null} The attached array of data in its current state
   */
  get data() {
    if (this.pageSize && this.pageSize < this.total) {
      return this.pager(this.pageNumber, this.pageSize);
    }

    return this.#currentData;
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
   * @param {number} pageNumber - a page number to start with
   * @param {number} pageSize - number of items to return
   * @returns {Array} the paginated data
   */
  pager(pageNumber = 1, pageSize = 10) {
    pageNumber = Math.max(parseInt(pageNumber) || 1, 1);
    pageSize = parseInt(pageSize) || 1;

    const last = pageNumber * pageSize;
    const start = last - pageSize;
    return this.#currentData.slice(start, start + pageSize);
  }

  /**
   * Executes a provided function once for each array element in the current data
   * @param {Function} fn An optional function to iterate the array
   */
  forEach(fn) {
    this.#currentData.forEach(fn);
  }

  /**
   * Sort the dataset
   * @param  {string} field The dataset field
   * @param  {boolean} reverse Sort ascending or descending
   * @param  {Function|null} primer Optional primer function
   */
  sort(field, reverse, primer) {
    const sort = this.sortFunction(field, reverse, primer);
    this.#currentData.sort(sort);
  }

  /**
   * An overridable array sort function
   * @param  {string} field The dataset field
   * @param  {boolean} reverse Sort ascending or descending
   * @param  {Function} primer Primer function
   * @returns {object} The sorted dataset or it uses
   */
  sortFunction(field, reverse, primer) {
    const key = (x) => (primer ? primer(x[field]) : x[field]);

    return (a, b) => {
      const A = key(a);
      const B = key(b);
      return ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [-1, 1][+!!reverse]; // eslint-disable-line
    };
  }

  /**
   * Filter current data with given callback
   * will reset filter data, if given callback not found
   * @param  {Function} filterFunction User filter function
   * @returns {void}
   */
  filter(filterFunction) {
    // Updated the current data
    const updateCurrentData = (data) => {
      this.#currentData = data;
      this.total = this.#currentData.length;
      this.pageNumber = 1;
    };

    // Reset the current data
    const resetCurrentData = () => {
      updateCurrentData(this.#currentFilterData);
      this.#currentFilterData = null;
      delete this.filtered;
    };

    // Check if need to filter or reset
    if (typeof filterFunction === 'function') {
      this.#currentFilterData = this.#currentFilterData || this.#currentData;

      // Run thru given filter process
      this.#currentFilterData.forEach((row, index) => {
        row.isFilteredOut = filterFunction(row, index);
      });

      // Get data either filtered or not
      // if filtered then update the current data, else reset it
      if (this.#currentFilterData.some((row) => row.isFilteredOut)) {
        const data = this.#currentFilterData.filter((row) => {
          const r = !row.isFilteredOut;
          delete row.isFilteredOut;
          return r;
        });
        updateCurrentData(data);
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

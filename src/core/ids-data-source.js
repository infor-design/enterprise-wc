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
   * Sets the data array on the data source object
   * @param {Array | null} value The array to attach
   */
  set data(value) {
    this.#currentData = deepClone(value);
    this.#originalData = value;
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
  get total() { return this.#currentData.length; }

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
}

export default IdsDataSource;

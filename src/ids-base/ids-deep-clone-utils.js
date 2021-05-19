/**
 * Ids String parsing/processing utilities
 */
const IdsDeepCloneUtils = {
  // Store the references to avoid circular reference problems
  refs: [],
  refsNew: [],

  /**
   * Deep clone an object creating a new object
   * @param  {object|Array} obj The object or array to clone
   * @returns {object|Array} The object/array's clone
   */
  deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj);
    }

    if (Array.isArray(obj)) {
      return this.deepCloneArray(obj, this.deepClone);
    }

    const objClone = {};
    this.refs.push(obj);
    this.refsNew.push(objClone);

    for (const k in obj) {
      if (Object.hasOwnProperty.call(obj, k) === false) {
        continue;
      }

      const cur = obj[k];
      if (typeof cur !== 'object' || cur === null) {
        objClone[k] = cur;
      } else if (cur instanceof Date) {
        objClone[k] = new Date(cur);
      } else {
        const i = this.refs.indexOf(cur);
        if (i !== -1) {
          objClone[k] = this.refsNew[i];
        } else {
          objClone[k] = this.deepClone(cur);
        }
      }
    }
    this.refs.pop();
    this.refsNew.pop();
    return objClone;
  },

  /**
   * Deep clone an array creating a new array
   * @param  {Array} arr The array to clone
   * @param  {Function} fn The functional call back used for recursion
   * @returns {Array} The array's clone
   */
  deepCloneArray(arr, fn) {
    const keys = Object.keys(arr);
    const arrClone = new Array(keys.length);

    for (let i = 0; i < keys.length; i += 1) {
      const k = keys[i];
      const cur = arr[k];

      if (typeof cur !== 'object' || cur === null) {
        arrClone[k] = cur;
      } else if (cur instanceof Date) {
        arrClone[k] = new Date(cur);
      } else {
        const index = this.refs.indexOf(cur);
        if (index !== -1) {
          arrClone[k] = this.refsNew[index];
        } else {
          arrClone[k] = fn.call(this, cur);
        }
      }
    }
    return arrClone;
  }
};

export default IdsDeepCloneUtils;
export { IdsDeepCloneUtils as cloneUtils };

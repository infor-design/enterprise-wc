// Store the references to avoid circular reference problems
const refs: Array<any> = [];
const refsNew: Array<any> = [];

/**
 * Deep clone an array creating a new array
 * @param {Array} arr The array to clone
 * @param {Function} fn The functional call back used for recursion
 * @returns {Array} The array's clone
 */
export function deepCloneArray(this: any, arr: any, fn?: any) {
  const keys = Object.keys(arr);
  const arrClone = new Array(keys.length);

  for (let i = 0; i < keys.length; i += 1) {
    const k: any = keys[i];
    const cur = arr[k];

    if (typeof cur !== 'object' || cur === null) {
      arrClone[k] = cur;
    } else if (cur instanceof Date) {
      arrClone[k] = new Date(cur);
    } else {
      const index = refs.indexOf(cur);
      if (index !== -1) {
        arrClone[k] = refsNew[index];
      } else {
        arrClone[k] = fn.call(this, cur);
      }
    }
  }
  return arrClone;
}

/**
 * Deep clone an object creating a new object
 * @param {object|Array} obj The object or array to clone
 * @returns {object|Array} The object/array's clone
 */
export function deepClone(obj: any) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (Array.isArray(obj)) {
    return deepCloneArray(obj, deepClone);
  }

  const objClone: any = {};
  refs.push(obj);
  refsNew.push(objClone);

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
      const i = refs.indexOf(cur);
      if (i !== -1) {
        objClone[k] = refsNew[i];
      } else {
        objClone[k] = deepClone(cur);
      }
    }
  }
  refs.pop();
  refsNew.pop();
  return objClone;
}

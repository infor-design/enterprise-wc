export function newBlob(part, type) {
  return new Blob([part], { type });
}

/**
 * Return the type of the input.
 * The type will be in a format valid for JSZip.utils.transformTo : string, array, uint8array, arraybuffer.
 * @param {any} input the input to identify.
 * @returns {string} the (lowercase) type of the input.
 */
export function getTypeOf(input: any): 'string' | 'uint8array' {
  if (typeof input === 'string') {
    return 'string';
  }

  return 'uint8array';
}

/**
 * An helper for the function arrayLikeToString.
 * This contains static information and functions that
 * can be optimized by the browser JIT compiler.
 */
const arrayToStringHelper = {
  stringifyByChunk: (array: any, type: string, chunk: number) => {
    const result = [];
    const len = array.length;
    let k = 0;

    // shortcut
    if (len <= chunk) {
      return String.fromCharCode.apply(null, array);
    }
    while (k < len) {
      if (type === 'array' || type === 'nodebuffer') {
        result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
      } else {
        result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
      }
      k += chunk;
    }
    return result.join('');
  },
  stringifyByChar: (array: Array<any> | Uint8Array) => {
    let resultStr = '';

    for (let i = 0; i < array.length; i++) {
      resultStr += String.fromCharCode(array[i]);
    }
    return resultStr;
  }
};

/**
 * Fill in an array with a string.
 * @param {string} str the string to use.
 * @param {Array<any>} array the array to fill in (will be mutated).
 * @returns {Array<any>} the updated array.
 */
function stringToArrayLike(str: string, array: Array<any> | Uint8Array) {
  for (let i = 0; i < str.length; ++i) {
    array[i] = str.charCodeAt(i) & 0xFF;
  }
  return array;
}

/**
 * Transform an array-like object to a string.
 * @param {Array<any> | Uint8Array} array the array to transform.
 * @returns {string} the result.
 */
function arrayLikeToString(array: Array<any> | Uint8Array) {
  let chunk = 65536;
  const type = getTypeOf(array);

  while (chunk > 1) {
    try {
      return arrayToStringHelper.stringifyByChunk(array, type, chunk);
    } catch (e) {
      chunk = Math.floor(chunk / 2);
    }
  }

  // no apply or chunk error : slow and painful algorithm
  // default browser on android 4.*
  return arrayToStringHelper.stringifyByChar(array);
}

// a matrix containing functions to transform everything into everything.
const transform = {
  string: {
    string: (input: string) => input,
    uint8array: (input: any) => stringToArrayLike(input, new Uint8Array(input.length))
  },
  uint8array: {
    string: arrayLikeToString,
    uint8array: (input: string) => input
  }
};

export function transformTo(outputType: 'string' | 'uint8array', input = '') {
  if (!outputType) {
    return input;
  }
  const inputType = getTypeOf(input);
  const result = transform[inputType][outputType](input as any);
  return result;
}

/**
 * Defer the call of a function.
 * @param {any} callback the function to call asynchronously.
 * @param {Array<any>} args the arguments to give to the callback.
 * @param {any} self object context
 */
export function delay(callback: any, args: any[], self: any) {
  setTimeout(() => {
    callback.apply(self || null, args || []);
  }, 0);
}

/**
 * Returns the path with a slash at the end.
 * @param {string} path the path to check.
 * @returns {string} the path with a trailing slash.
 */
export function forceTrailingSlash(path: string): string {
  // Check the name ends with a /
  if (path.slice(-1) !== '/') {
    path += '/';
  }
  return path;
}

/**
 * Find the parent folder of the path.
 * @param {string} path the path to use
 * @returns {string} the parent folder, or ""
 */
export function parentFolder(path: string): string {
  if (path.slice(-1) === '/') {
    path = path.substring(0, path.length - 1);
  }
  const lastSlash = path.lastIndexOf('/');
  return (lastSlash > 0) ? path.substring(0, lastSlash) : '';
}

/**
 * Convert a string that pass as a "binary string": it should represent a byte
 * array but may have > 255 char codes. Be sure to take only the first byte
 * and returns the byte array.
 * @param {string} str the string to transform.
 * @returns {Array | Uint8Array} the string in a binary format.
 */
export function string2binary(str: string) {
  let result = null;

  if (typeof Uint8Array !== 'undefined') {
    result = new Uint8Array(str.length);
  } else {
    result = new Array(str.length);
  }

  return stringToArrayLike(str, result);
}

/**
 * Convert string to array (typed, when possible)
 * @param {string} str string to convert
 * @returns {Uint8Array} buffer
 */
export function string2buf(str: string): Uint8Array {
  let c;
  let c2;
  let mPos;
  let i;
  const strLen = str.length;
  let bufLen = 0;

  // count binary size
  for (mPos = 0; mPos < strLen; mPos++) {
    c = str.charCodeAt(mPos);
    if ((c & 0xfc00) === 0xd800 && (mPos + 1 < strLen)) {
      c2 = str.charCodeAt(mPos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        mPos++;
      }
    }
    if (c < 0x80) {
      bufLen += 1;
    } else if (c < 0x800) {
      bufLen += 2;
    } else if (c < 0x10000) {
      bufLen += 3;
    } else {
      bufLen += 4;
    }
  }

  // allocate buffer
  const buf = new Uint8Array(bufLen);

  // convert
  for (i = 0, mPos = 0; i < bufLen; mPos++) {
    c = str.charCodeAt(mPos);
    if ((c & 0xfc00) === 0xd800 && (mPos + 1 < strLen)) {
      c2 = str.charCodeAt(mPos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        mPos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    }
  }

  return buf;
}

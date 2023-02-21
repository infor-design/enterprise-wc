export function newBlob(part: any, type: any) {
  return new Blob([part], { type });
}

/**
 * Return the type of the input.
 * The type will be in a format valid for JSZip.utils.transformTo : string, array, uint8array, arraybuffer.
 * @param {any} input the input to identify.
 * @returns {'string' | 'uint8array' | 'arraybuffer' | undefined} the (lowercase) type of the input.
 */
export function getTypeOf(input: any): any {
  if (typeof input === 'string') {
    return 'string';
  }

  if (Object.prototype.toString.call(input) === '[object Array]') {
    console.error('type of array');
    return 'array';
  }

  const supportUint8Array = typeof Uint8Array !== 'undefined';;
  if (supportUint8Array && input instanceof Uint8Array) {
    return 'uint8array';
  }

  const supportArrayBuffer = typeof ArrayBuffer !== 'undefined' && typeof Uint8Array !== 'undefined';
  if (supportArrayBuffer && input instanceof ArrayBuffer) {
    return 'arraybuffer';
  }
}

/**
 * An helper for the function arrayLikeToString.
 * This contains static information and functions that
 * can be optimized by the browser JIT compiler.
 */
const arrayToStringHelper = {
  stringifyByChunk: (array, type, chunk) => {
    const result = [];
    let k = 0;
    const len = array.length;

    // shortcut
    if (len <= chunk) {
      return String.fromCharCode.apply(null, array);
    }
    while (k < len) {
      if (type === 'array' || type === 'nodebuffer') {
        result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
      }
      else {
        result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
      }
      k += chunk;
    }
    return result.join('');
  },
  stringifyByChar: (array) => {
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
function stringToArrayLike(str: string, array: Array<any> | Uint8Array): Array<any> | Uint8Array {
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
  // Performances notes :
  // --------------------
  // String.fromCharCode.apply(null, array) is the fastest, see
  // see http://jsperf.com/converting-a-uint8array-to-a-string/2
  // but the stack is limited (and we can get huge arrays !).
  //
  // result += String.fromCharCode(array[i]); generate too many strings !
  //
  // This code is inspired by http://jsperf.com/arraybuffer-to-string-apply-performance/2
  // TODO : we now have workers that split the work. Do we still need that ?
  let chunk = 65536;
  const type = getTypeOf(array);
  const canUseApply = true;

  if (canUseApply) {
    while (chunk > 1) {
      try {
        return arrayToStringHelper.stringifyByChunk(array, type, chunk);
      } catch (e) {
        chunk = Math.floor(chunk / 2);
      }
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
    uint8array: (input: any) => stringToArrayLike(input, new Uint8Array(input.length)),
    arraybuffer: (input: any) => (transform.string.uint8array(input) as Uint8Array).buffer
  },
  uint8array: {
    string: arrayLikeToString,
    uint8array: (input: string) => input,
    arraybuffer: (input: any) => input.buffer,
  }
};

export function transformTo(outputType: 'string' | 'uint8array' | 'arraybuffer', input: string | Uint8Array = '') {
  if (!outputType) {
    return input;
  }
  const inputType = getTypeOf(input) as 'string' | 'uint8array';
  const result = transform[inputType][outputType](input as any);
  return result;
}

/**
 * Defer the call of a function.
 * @param {any} callback the function to call asynchronously.
 * @param {any} args the arguments to give to the callback.
 * @param {any} self object context
 */
export function delay(callback: any, args: any, self: any) {
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
  let m_pos;
  let i;
  let str_len = str.length;
  let buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    // eslint-disable-next-line no-nested-ternary
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  const buf = new Uint8Array(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
}

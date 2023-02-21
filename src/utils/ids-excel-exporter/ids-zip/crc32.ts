/**
 * The following functions come from pako, from pako/lib/zlib/crc32.js
 * released under the MIT license, see pako https://github.com/nodeca/pako/
 */

import { getTypeOf } from './ids-zip-util';

/**
 * Use ordinary array, since untyped makes no boost here
 * @returns {Array<number>} crc table
 */
function makeTable() {
  let c;
  const table = [];

  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
const crcTable = makeTable();

/**
 * Compute the crc32 of a buffer
 * @param {number} crc the starting value of the crc.
 * @param {any} buf the buffer to use.
 * @param {number} len the length of the buffer.
 * @param {number} pos the starting position for the crc32 computation.
 * @returns {number} the computed crc32
 */
function crc32(crc: number, buf: any, len: number, pos: number) {
  const t = crcTable;
  const end = pos + len;

  crc ^= (-1);

  for (let i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
}

// That's all for the pako functions.

/**
 * Compute the crc32 of a string.
 * This is almost the same as the function crc32, but for strings. Using the
 * same function for the two use cases leads to horrible performances.
 * @param {number} crc the starting value of the crc.
 * @param {string} str the string to use.
 * @param {number} len the length of the string.
 * @param {number} pos the starting position for the crc32 computation.
 * @returns {number} the computed crc32.
 */
function crc32str(crc: number, str: string, len: number, pos: number) {
  const t = crcTable;
  const end = pos + len;

  crc ^= (-1);

  for (let i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ str.charCodeAt(i)) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
}

/**
 * @param {any }input data
 * @param {number} crc crc
 * @returns {number} the computed crc32
 */
export function crc32wrapper(input: any, crc = 0) {
  if (typeof input === 'undefined' || !input.length) {
    return 0;
  }

  const isArray = getTypeOf(input) !== 'string';

  if (isArray) {
    return crc32(crc | 0, input, input.length, 0);
  }

  return crc32str(crc | 0, input, input.length, 0);
}

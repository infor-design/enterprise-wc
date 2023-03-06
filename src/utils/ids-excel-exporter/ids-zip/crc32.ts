/**
 * The following functions come from pako, from pako/lib/zlib/crc32.js
 * released under the MIT license, see pako https://github.com/nodeca/pako/
 */

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
export function crc32(crc: number, buf: any, len: number, pos: number) {
  const t = crcTable;
  const end = pos + len;

  crc ^= (-1);

  for (let i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1));
}

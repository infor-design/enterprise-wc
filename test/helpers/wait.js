/**
 * wrapper representing a timeout in a promise for making
 * timeouts a little more intuitive in async fns
 *
 * @param {*} ms time in miliseconds
 * @returns {Promise} promise resolving after miliseconds specified
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default wait;

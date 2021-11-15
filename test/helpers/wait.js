/**
 * wrapper representing a timeout in a promise for making
 * timeouts a little more intuitive in async fns
 *
 * @param {*} ms time in miliseconds
 * @returns {Promise} promise resolving after miliseconds specified
 */
// eslint-disable-next-line no-promise-executor-return
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default wait;

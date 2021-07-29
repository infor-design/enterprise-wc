/* eslint-disable no-underscore-dangle */

/**
 * @returns {boolean} whether jest timers are enabled
 */
export default function areJestFakeTimersEnabled() {
  /* istanbul ignore else */
  if (typeof jest !== 'undefined' && jest !== null) {
    return (
      setTimeout._isMockFunction === true
      || Object.prototype.hasOwnProperty.call(setTimeout, 'clock')
    );
  }
  // istanbul ignore next
  return false;
}

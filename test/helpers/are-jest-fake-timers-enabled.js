/* eslint-disable no-underscore-dangle */

/**
 * @returns {boolean} whether jest timers are enabled
 */
export default function areJestFakeTimersEnabled() {
  if (typeof jest !== 'undefined' && jest !== null) {
    return (
      setTimeout._isMockFunction === true
      || Object.prototype.hasOwnProperty.call(setTimeout, 'clock')
    );
  }
  return false;
}

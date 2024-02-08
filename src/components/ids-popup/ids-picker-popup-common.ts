import type { IdsPopupXYSwitchResult } from './ids-popup-attributes';

const X_FIELD_ADJUSTMENT = 12;
const TOP_FIELD_ADJUSTMENT = -8;

/**
 * Runs on the Picker Popup's `onXYSwitch` callback, and makes minor
 * corrections to IdsPopup placement to account for IdsInput/IdsTriggerField labels,
 * which aren't symmetrical for placement purposes.
 * @param {IdsPopupXYSwitchResult} results contains settings related to the x/y adjustment.
 * @returns {IdsPopupXYSwitchResult} provides further modifications.
 */
export const onPickerPopupXYSwitch = (results: IdsPopupXYSwitchResult) => {
  if (results.shouldSwitchXY) {
    if (['bottom', 'top'].includes(results.targetEdge)) results.x = X_FIELD_ADJUSTMENT;
  } else if (results.flip) {
    results.y = TOP_FIELD_ADJUSTMENT;
  }
  return results;
};

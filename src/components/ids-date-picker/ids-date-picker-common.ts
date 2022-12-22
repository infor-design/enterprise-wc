import { attributes } from '../../core/ids-attributes';

export const IdsDatePickerCommonAttributes = [
  attributes.DAY,
  attributes.FIRST_DAY_OF_WEEK,
  attributes.FORMAT,
  attributes.IS_CALENDAR_TOOLBAR,
  attributes.IS_DROPDOWN,
  attributes.MINUTE_INTERVAL,
  attributes.MONTH,
  attributes.RANGE_SETTINGS,
  attributes.SECOND_INTERVAL,
  attributes.SHOW_CANCEL,
  attributes.SHOW_CLEAR,
  attributes.SHOW_PICKLIST_MONTH,
  attributes.SHOW_PICKLIST_WEEK,
  attributes.SHOW_PICKLIST_YEAR,
  attributes.SHOW_TODAY,
  attributes.USE_CURRENT_TIME,
  attributes.USE_RANGE,
  attributes.VALUE,
  attributes.YEAR
];

export const MIN_MONTH = 0;
export const MAX_MONTH = 11;
export const MONTH_KEYS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const PICKLIST_LENGTH = 6;

export const getDateValuesFromString = (val: string) => {
  const date = new Date(val);
  const month = date.getMonth();
  const year = date.getFullYear();
  const day = date.getDate();
  return { month, day, year };
};

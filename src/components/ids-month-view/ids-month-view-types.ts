import type IdsMonthView from './ids-month-view';

export type IdsRangeSettings = {
  start?: any,
  end?: any,
  separator?: string,
  minDays?: number,
  maxDays?: number,
  selectForward?: boolean,
  selectBackward?: boolean,
  includeDisabled?: boolean,
  selectWeek?: boolean
};

export type IdsDisableSettings = {
  dates?: Array<string>,
  years?: Array<number>,
  minDate?: string,
  maxDate?: string,
  dayOfWeek?: Array<number>,
  isEnable?: boolean
};

export type IdsDayselectedEvent = {
  detail: {
    elem: IdsMonthView,
    date: Date,
    useRange: boolean,
    rangeStart: Date | null,
    rangeEnd: Date | null
  }
};

import type IdsMonthView from './ids-month-view';

export type RangeSettings = {
  start?: any,
  end?: any,
  separator?: string,
  minDays?: number,
  maxDays?: number,
  selectForward?: boolean,
  selectBackward?: boolean,
  includeDisabled?: boolean
};

export type DisableSettings = {
  dates: Array<string>,
  years: Array<number>,
  minDate: string,
  maxDate: string,
  dayOfWeek: Array<number>,
  isReverse: boolean,
  restrictMonths: boolean
};

export type DayselectedEvent = {
  detail: {
    elem: IdsMonthView,
    date: Date,
    useRange: boolean,
    rangeStart: Date | null,
    rangeEnd: Date | null
  }
};

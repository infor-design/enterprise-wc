import { attributes } from '../../core/ids-attributes';

export const IdsTimePickerCommonAttributes = [
  attributes.AUTOSELECT,
  attributes.AUTOUPDATE,
  attributes.DISABLED,
  attributes.EMBEDDABLE,
  attributes.ID,
  attributes.LABEL,
  attributes.NO_MARGINS,
  attributes.PLACEHOLDER,
  attributes.READONLY,
  attributes.SIZE,
  attributes.TABBABLE,
  attributes.VALIDATE,
  attributes.VALIDATION_EVENTS,
  attributes.VALUE,
];

export const IdsTimePickerMixinAttributes = [
  attributes.END_HOUR,
  attributes.FORMAT,
  attributes.HOURS,
  attributes.MINUTES,
  attributes.MINUTE_INTERVAL,
  attributes.PERIOD,
  attributes.SECONDS,
  attributes.SECOND_INTERVAL,
  attributes.START_HOUR,
  attributes.USE_CURRENT_TIME,
];

export const range: any = (start: any, stop: any, step = 1) => (
  start > stop ? [] : [start, ...range(start + Math.abs(step), stop, step)]
);

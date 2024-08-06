export type IdsLocaleNumberOptions = Intl.NumberFormatOptions & {
  locale?: string,
  style?: string | any,
  minimumFractionDigits?: number,
  maximumFractionDigits?: number,
  group?: string,
  useGrouping?: boolean
};

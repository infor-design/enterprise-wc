export type IdsLocaleNumberOptions = Intl.NumberFormatOptions & {
  locale?: string,
  style?: string,
  minimumFractionDigits?: number,
  maximumFractionDigits?: number,
  group?: string,
  useGrouping?: boolean
};

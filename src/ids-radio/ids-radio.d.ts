// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  checked: boolean;
  color: string;
  disabled: boolean;
  groupDisabled: boolean;
  horizontal: boolean;
  label: string;
  labelFontSize: 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 60 | 72 | 'xs' | 'sm ' | 'lg' | 'xl' | string | number;
  validationHasError: boolean;
  value: string;
}

export class IdsInput extends HTMLElement {
  nativeElement: nativeElement;
}

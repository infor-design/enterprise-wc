// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  autoselect: boolean;
  clearable: boolean;
  dirtyTracker: boolean;
  disabled: boolean;
  label: string;
  labelFontSize: 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 60 | 72 | 'xs' | 'sm ' | 'lg' | 'xl' | string | number;
  name: string;
  placeholder: string;
  size: 'xs' | 'sm ' | 'mm' | 'md' | 'lg' | 'full' | string;
  readonly: boolean;
  textAlign: 'left' | 'center ' | 'right' | string;
  triggerfield: boolean;
  type: 'text' | 'password' | 'email' | 'number' | string;
  validate: 'required' | 'email' | string;
  value: string | number;
  tabbable: boolean;
}

export class IdsInput extends HTMLElement {
  nativeElement: nativeElement;
}

// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  accept: string;
  dirtyTracker: boolean|string;
  disabled: boolean|string;
  label: string;
  labelFiletype: string;
  multiple: boolean|string;
  noTextEllipsis: boolean|string;
  placeholder: string;
  size: string;
  readonly: boolean|string;
  triggerLabel: string;
  validate: string;
  validationEvents: string;
  value: string;
}

export class IdsUpload extends HTMLElement {
  nativeElement: nativeElement;
}

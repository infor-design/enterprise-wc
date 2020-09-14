// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  tabbable: boolean;
  appearance: 'normal' | 'compact' | string;
  trigger(): void;
}

interface triggerfield extends Event {
  detail: {
    elem: IdsTriggerField
  }
}

export class IdsTriggerField extends HTMLElement {
  nativeElement: nativeElement;
}

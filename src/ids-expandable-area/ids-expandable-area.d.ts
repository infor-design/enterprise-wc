// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  expanded: string;
  type: null | 'toggle-btn' | string;
}

export class IdsExpandableArea extends HTMLElement {
  nativeElement: nativeElement;
}

// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  /** Set the tag type/color */
  color: 'secondary' | 'error' | 'success' | 'caution' | string;
  /** Add a dismissible x button to the tag */
  dismissible: boolean;
  /** Dismiss a dismissible tag */
  dismiss(): void;
}

interface tagremoved extends Event {
  detail: {
    elem: IdsTag
  }
}

interface beforetagremoved extends Event {
  detail: {
    elem: IdsTag
  }
}

export class IdsTag extends HTMLElement {
  nativeElement: nativeElement;
}

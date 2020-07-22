// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  /** Set the tag type/color **/
  color: 'secondary' | 'error' | 'success' | 'caution' | string;
  /** Add a dismissible x button and keyboard functionality to the tag **/
  dismissible: boolean;
}

interface tagremoved extends Event {
  detail: {
    elem: IdsTag
  }
}

export class IdsTag extends HTMLElement {
  nativeElement: nativeElement;
}

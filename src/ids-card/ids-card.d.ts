// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  /** Set the card height */
  autoHeight: boolean;
}

export class IdsCard extends HTMLElement {
  nativeElement: nativeElement;
}

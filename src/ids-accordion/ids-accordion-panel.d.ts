// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  expanded: string;
}

export default class IdsAccordionPanel extends HTMLElement {
  nativeElement: nativeElement;
}

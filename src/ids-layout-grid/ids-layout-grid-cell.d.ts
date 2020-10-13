// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  fill: string;
  colSpan: string;
  colStart: boolean;
  colEnd: string;
  rowSpan: string;
  rowStart: string;
  rowEnd: string;
}

export class IdsGridLayoutCell extends HTMLElement {
  nativeElement: nativeElement;
}

// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  fixed: boolean;
  gap: 'none' | 'sm' | 'md' | 'lg' | 'xl' | string;
  auto: boolean;
  cols: string;
  rows: string;
  noMargins: boolean;
}

export class IdsGridLayout extends HTMLElement {
  nativeElement: nativeElement;
}

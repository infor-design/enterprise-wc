// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  type: 'text' | 'password' | 'email' | 'number' | string;
  tabbable: boolean;
  placeholder: string;
}

export class IdsInput extends HTMLElement {
  nativeElement: nativeElement;
}

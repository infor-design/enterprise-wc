export interface IdsWebComponent extends HTMLElement {
  name?: string;
  state: Record<string, any>;
  container?: HTMLElement | null;
  connectedCallback(): void;
  disconnectedCallback(): void;
  adoptedCallback?(): void;
}

export type IdsConstructor<T = IdsWebComponent> = new (...args: any[]) => T;

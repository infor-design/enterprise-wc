// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import mix from './ids-mixin';

export class IdsElement extends HTMLElement {
  container: HTMLElement;

  prototype: IdsElement;

  name: string;

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void;

  disconnectedCallback(): void;

  render(): IdsElement;

  appendStyles(): void;
}

export {
  customElement,
  version,
  mixin,
  scss
} from './ids-decorators';

export {
  mix
};

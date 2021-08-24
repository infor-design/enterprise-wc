// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { attributes } from './ids-attributes';

export class IdsElement extends HTMLElement {
  /** The main container in the shadowRoot */
  container: HTMLElement;

  /** The web component's name' */
  prototype: IdsElement;

  /** The web component's name' */
  name: string;

  /** The web component call back when a property is changed */
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void;

  /** The web component call back when a element is removed from the DOM */
  disconnectedCallback(): void;

  /** Generate and render a template in the shadow DOM */
  render(): IdsElement;

  /** Append the style sheet internally */
  appendStyles(): void;

  /** Draw the template that this component uses to render itself */
  template(): string;
}

export {
  customElement,
  version,
  scss
} from './ids-decorators';

export {
  attributes
};

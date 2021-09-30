// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';
import IdsAccordionHeader from './ids-accordion-header';
import IdsAccordionPanel from './ids-accordion-panel';

export default class IdsAccordion extends IdsElement {
  /** Reference to all inner Accordion Headers */
  readonly headers?: Array<IdsAccordionHeader>;

  /** Reference to all inner Accordion Panels */
  readonly panels?: Array<IdsAccordionPanel>;

  /** Reference to the currently-focused element within the accordion, if applicable */
  readonly focused?: HTMLElement;

  /** Allows for programmatic navigation of the accordion, taking the specified number of steps */
  navigate(amount?: number): HTMLElement;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}

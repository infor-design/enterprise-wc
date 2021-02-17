// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../ids-base/ids-element';

interface nativeElement extends HTMLElement {
  expanded: string;
}

export default class IdsAccordionPanel extends IdsElement {
  /** Set to expanded/collapsed */
  expanded: boolean;
}

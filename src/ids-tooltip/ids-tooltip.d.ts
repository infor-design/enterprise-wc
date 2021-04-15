// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../ids-base/ids-element';

interface IdsTooltipEventDetail extends Event {
  detail: {
    elem: IdsTooltip
  }
}

export default class IdsTooltip extends IdsElement {
  /** Set the target element via a css selector or HTMLElement */
  target: string | HTMLElement;
}

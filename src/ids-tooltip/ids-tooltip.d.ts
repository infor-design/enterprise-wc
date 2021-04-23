// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../ids-base/ids-element';

interface IdsTooltipEventDetail extends Event {
  detail: {
    elem: IdsTooltip
  }
}

export default class IdsTooltip extends IdsElement {
  /** An async function that fires as the tooltip is showing allowing you to set contents. */
  beforeShow(): Promise<string>;

  /** Set how long after hover you should delay before showing */
  delay?: string | number;

  /** Sets the tooltip placement between left, right, top, bottom */
  placement?: string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the target element via a css selector or HTMLElement */
  target?: string | HTMLElement;

  /** Set trigger agains the target between hover, click and focus */
  trigger?: string;

  /** Set tooltip immediately to visible/invisible */
  visible?: string | boolean;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}

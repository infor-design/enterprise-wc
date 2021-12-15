interface IdsTooltipEventDetail extends Event {
  detail: {
    elem: IdsTooltip
  }
}

interface IdsTooltipEventVetoable extends Event {
  detail: {
    elem: IdsTooltip,
    response: () => boolean
  }
}

export default class IdsTooltip extends HTMLElement {
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

  /** Fires before the tag is removed, you can return false in the response to veto. */
  on(event: 'beforeshow', listener: (detail: IdsTooltipEventVetoable) => void): this;

  /** Fires while the tag is removed */
  on(event: 'show', listener: (detail: IdsTooltipEventDetail) => void): this;

  /** Fires after the tag is removed */
  on(event: 'hide', listener: (detail: IdsTooltipEventDetail) => void): this;
}

export default class IdsLoadingIndicator extends HTMLElement {
  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /**
   * Flag indicating whether or not this component
   * will be nested as a sub-part of another component (e.g. input);
   * renders a smaller variant.
   */
  inline: boolean;

  /**
   * Whether the percentage text should be visible
   * (not applicable to `sticky` loading indicators).
   */
  percentageVisible: boolean;

  /**
   * Represents the percentage completed for the indicator;
   * if not specified, the indicator is set into indeterminate mode (e.g. no specific
   * progress with an animation)
   */
  progress: number | undefined;

  /**
   * Flags the indicator as an sticky indicator;
   * causes the indicator to stick to the top of the innermost parent IdsElement
   * and span it horizontally
   */
  sticky: boolean | string;

  /**
   * Flags the indicator as a linear indicator;
   * causes the indicator to span its parent component horizontally and
   * be represented as a horizontal/linear bar. If set, removes current
   * flag types that may be set.
   */
  linear: boolean | string;
}

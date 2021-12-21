export default class IdsMasthead extends HTMLElement {
  /** Sets the masthead's icon attribute */
  icon?: string;

  /** Sets the masthead's title attribute */
  title: string;

  /** Get object containing mastheads's slots for start|center|end|more */
  readonly slots: { [key in 'start'|'center'|'end'|'more']: HTMLElement };

  /** Get object containing (window.matchMedia) breakpoints for mobile|tablet|desktop */
  readonly breakpoints: { [key in 'mobile'|'tablet'|'desktop']: MediaQueryList };

  /** Is the mobile breakpoint is active */
  readonly isMobile: boolean;

  /** Is the tablet breakpoint is active */
  readonly isTablet: boolean;

  /** Is the desktop breakpoint is active */
  readonly isDesktop: boolean;

  /** Rearranges user's slots in masthead according to desktop, tablet and mobile viewports. */
  renderBreakpoint(): void;
}

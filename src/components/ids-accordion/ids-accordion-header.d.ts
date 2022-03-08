export default class extends HTMLElement {
  /** Reference to the corresponding IdsAccordionPanel element */
  readonly panel: HTMLElement;

  /** True if this accordion header's panel contains a child panel that matches the specified filter term, and should be displayed accordingly */
  childFilterMatch?: boolean;

  /** True if the Accordion Header should display "expanded" styling */
  expanded?: boolean;

  /** Defines the display type of the expander button, if it's currently enabled */
  expanderType?: 'caret' | 'plus-minus';

  /** True if this accordion header should appear to be "filtered", which usually means "hidden" */
  hiddenByFilter?: boolean;

  /** Displays/Hides an optional icon on this Accordion header */
  icon?: string | undefined;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Selects/Deselects this accordion header, firing events when appropriate */
  selected?: boolean;

  /** Causes this accordion header to become focused */
  focus(): void;

  /** Changes the expander icon to match the Accordion Panel's state, if the pane is expandable */
  toggleExpanderIcon(doExpand?: boolean): void;
}

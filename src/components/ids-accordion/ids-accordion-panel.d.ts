export default class IdsAccordionPanel extends HTMLElement {
  /** Reference to this Accordion Panel's header, if applicable */
  readonly header?: HTMLElement;

  /** Reference to this Accordion Panel's Shadow DOM expander element */
  readonly expander: HTMLElement;

  /** Reference to this Accordion Panel's Shadow DOM pane element */
  readonly pane: HTMLElement;

  /** In nested accordions, describes whether or not this panel resides inside another panel */
  readonly hasParentPanel: boolean;

  /** In nested accordions, describes if this panel's parent panel is currently expanded */
  readonly parentExpanded: boolean;

  /** Describes whether or not it's possible to expand this Accordion Pane (has more content than just a header) */
  readonly isExpandable: boolean;

  /** Set to expanded/collapsed */
  expanded: boolean;

  /** Collapses the Accordion Panel's inner expandable pane */
  collapsePane(): void;

  /** Expands the Accordion Panel's inner expandable pane */
  expandPane(): void;

  /** Focuses the Accordion Panel's header, if applicable */
  focus(): void;
}

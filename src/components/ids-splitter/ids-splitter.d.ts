/** Type for splitter start object */
type IdsSplitterStart = {
  /** The start pane element */
  pane: HTMLElement,

  /** The start pane index */
  idx: number,

  /** The start pane size (height or width) */
  size: number,

  /** The start pane minimum size (height or width) */
  minSize: number
}

/** Type for splitter end object */
type IdsSplitterEnd = {
  /** The end pane element */
  pane: HTMLElement,

  /** The end pane index */
  idx: number,

  /** The end pane size (height or width) */
  size: number,

  /** The end pane minimum size (height or width) */
  minSize: number
}

/** Type for splitter pair object */
type IdsSplitterPair = {
  /** The start object */
  start: IdsSplitterStart,

  /** The end object */
  end: IdsSplitterEnd,

  /** The splitter split bar element */
  splitBar: HTMLElement,

  /** The pair index */
  idx: number,
}

/** Type for splitter collapse expand options */
type IdsSplitterPairOptions = {
  /** The start pane element or start pane element CSS selector */
  startPane?: HTMLElement | string,

  /** The end pane element or end pane element CSS selector */
  endPane?: HTMLElement | string,

  /** The pair object */
  pair?: IdsSplitterPair,
}

/** Type for splitter vetoable event */
interface IdsSplitterEventVetoable extends Event {
  detail: {
    /** The splitter element */
    elem: IdsSplitter,

    /** The start object */
    start: IdsSplitterStart,

    /** The end object */
    end: IdsSplitterEnd,

    /** The splitter split bar element */
    splitBar: HTMLElement,

    /** List of current sizes */
    sizes: Array<number>,

    /** List of current minimum sizes */
    minSizes: Array<number>

    /** List of current maximum sizes */
    maxSizes: Array<number>

    /** The method to run for vetoable  */
    response: () => boolean
  }
}

/** Type for splitter event detail */
interface IdsSplitterEventDetail extends Event {
  detail: {
    /** The splitter element */
    elem: IdsSplitter,

    /** The start object */
    start: IdsSplitterStart,

    /** The end object */
    end: IdsSplitterEnd,

    /** The splitter split bar element */
    splitBar: HTMLElement,

    /** List of current sizes */
    sizes: Array<number>,

    /** List of current minimum sizes */
    minSizes: Array<number>

    /** List of current maximum sizes */
    maxSizes: Array<number>
  }
}

export default class IdsSplitter extends HTMLElement {
  /** Set the split bar align direction to start or end */
  align: string | null;

  /** Set the splitter axis direction x: horizontal or y: vertical */
  axis: string | null;

  /** Sets the splitter to disabled state */
  disabled: boolean | string;

  /** Set the aria-label text for each split bar */
  label: string | null;

  /** Sets the splitter to resize on drag end */
  resizeOnDragEnd: boolean | string;

  /** Collapse start pane size for given start/end panes or panes CSS selector */
  collapse(options: IdsSplitterPairOptions): void;

  /** Expand start pane size for given start/end panes or panes CSS selector */
  expand(selector: IdsSplitterPairOptions): void;

  /** Get a splitter pair by given start/end panes or panes CSS selector */
  getPair(selector: IdsSplitterPairOptions): IdsSplitterPair;

  /** Get true if current orientation is horizontal */
  isHorizontal(): boolean;

  /** Get list of current sizes */
  sizes(): Array<number>;

  /** Get list of current minimum sizes */
  minSizes(): Array<number>;

  /** Get list of current maximum sizes */
  maxSizes(): Array<number>;

  /** Fires before the splitter pane get collapsed, you can return false in the response to veto */
  on(event: 'beforecollapsed', listener: (detail: IdsSplitterEventVetoable) => void): this;

  /** Fires after the splitter pane get collapsed */
  on(event: 'collapsed', listener: (detail: IdsSplitterEventDetail) => void): this;

  /** Fires before the splitter pane get expanded, you can return false in the response to veto */
  on(event: 'beforeexpanded', listener: (detail: IdsSplitterEventVetoable) => void): this;

  /** Fires after the splitter pane get expanded */
  on(event: 'expanded', listener: (detail: IdsSplitterEventDetail) => void): this;

  /** Fires before the splitter pane size changed, you can return false in the response to veto */
  on(event: 'beforesizechanged', listener: (detail: IdsSplitterEventVetoable) => void): this;

  /** Fires after the splitter pane size changed */
  on(event: 'sizechanged', listener: (detail: IdsSplitterEventDetail) => void): this;
}

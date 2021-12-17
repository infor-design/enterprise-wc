/** Type for tree node */
type IdsTreeTypeNode = {
  /** Node element */
  elem: HTMLElement,

  /** Current data */
  data?: unknown,

  /** Stack index in nodes */
  idx: number,

  /** Defines the node type is group or not */
  isGroup: boolean

  /** Defines the node depth level */
  level: number,

  /** Defines the position of the node */
  posinset: number,

  /** Defines the number of nodes */
  setsize: number,
}

/** Type for tree vetoable event */
interface IdsTreeEventVetoable extends Event {
  detail: {
    /** Tree element */
    elem: IdsTree,

    /** Tree node type */
    node: IdsTreeTypeNode,

    /** The method to run for vetoable  */
    response: () => boolean
  }
}

/** Type for tree event detail */
interface IdsTreeEventDetail extends Event {
  detail: {
    /** Tree element */
    elem: IdsTree,

    /** Tree Node type */
    node: IdsTreeTypeNode
  }
}

export default class IdsTree extends HTMLElement {
  /** Sets the tree group collapse icon */
  collapseIcon: string | null;

  /** Set the data array for tree * */
  data: Array<unknown>;

  /** Sets the tree to disabled state */
  disabled: boolean | string;

  /** Sets the tree group expand icon */
  expandIcon: string | null;

  /** Sets the tree to be expanded */
  expanded: boolean | string;

  /** Sets the tree node icon */
  icon: string | null;

  /** Set the tree aria label text */
  label: string;

  /** Sets the tree node to be selectable */
  selectable: string | 'single' | null;

  /** Sets the tree group toggle collapse icon */
  toggleCollapseIcon: string | null;

  /** Sets the tree group toggle expand icon */
  toggleExpandIcon: string | null;

  /** Sets the tree to use toggle icon rotate */
  toggleIconRotate: boolean | string;

  /** Sets the tree to use toggle target */
  useToggleTarget: boolean | null;

  /** Collapse all attached nodes to the tree */
  collapseAll(): void;

  /** Expand all attached nodes to the tree */
  expandAll(): void;

  /** Collapse a tree node by given CSS selector */
  collapse(selector: string): void;

  /** Expand a tree node by given CSS selector */
  expand(selector: string): void;

  /** Toggle a tree node by given CSS selector */
  toggle(selector: string): void;

  /** Selects a tree node by given CSS selector */
  select(selector: string): void;

  /** UnSelects a tree node by given CSS selector */
  unselect(selector: string): void;

  /** Check if related node is selected or not, by given CSS selector */
  isSelected(selector: string): boolean;

  /** Get a tree node by given CSS selector */
  getNode(selector: string): IdsTreeTypeNode;

  /** Fires before the tree node/group get selected, you can return false in the response to veto */
  on(event: 'beforeselected', listener: (detail: IdsTreeEventVetoable) => void): this;

  /** Fires after the tree node/group get selected */
  on(event: 'selected', listener: (detail: IdsTreeEventDetail) => void): this;

  /** Fires before the tree node/group get unselected, you can return false in the response to veto */
  on(event: 'beforeunselected', listener: (detail: IdsTreeEventVetoable) => void): this;

  /** Fires after the tree node/group get unselected */
  on(event: 'unselected', listener: (detail: IdsTreeEventDetail) => void): this;

  /** Fires before the tree group get collapsed, you can return false in the response to veto */
  on(event: 'beforecollapsed', listener: (detail: IdsTreeEventVetoable) => void): this;

  /** Fires after the tree group get collapsed */
  on(event: 'collapsed', listener: (detail: IdsTreeEventDetail) => void): this;

  /** Fires before the tree group get expanded, you can return false in the response to veto */
  on(event: 'beforeexpanded', listener: (detail: IdsTreeEventVetoable) => void): this;

  /** Fires after the tree group get expanded */
  on(event: 'expanded', listener: (detail: IdsTreeEventDetail) => void): this;
}

export default class IdsTreeNode extends HTMLElement {
  /** Sets the tree group collapse icon */
  collapseIcon: string | null;

  /** Sets the tree node to disabled */
  disabled: boolean | string;

  /** Sets the tree group expand icon */
  expandIcon: string | null;

  /** Sets the tree group to be expanded */
  expanded: boolean | string;

  /** Sets the tree node icon */
  icon: string | null;

  /** Set the node label text */
  label: string;

  /** Sets the tree node to be selectable */
  selectable: string | 'single' | null;

  /** Sets the tree node to be selected */
  selected: boolean | null;

  /** Set if the node is tabbable */
  tabbable: boolean | null;

  /** Sets the tree to use toggle target */
  useToggleTarget: boolean | null;

  /** Set focus to node container */
  setFocus(): void;
}

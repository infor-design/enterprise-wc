export default class IdsSwappableItem extends HTMLElement {
  /* Sets the `selected` property of the ids-swappable-item */
  selected?: boolean;

  /** Reference to all IdsSwappableItems with selected attribute */
  readonly selectedItems: Array<IdsSwappableItem>;

  /** Reference to all inner IdsSwappableItems */
  readonly allItems: Array<IdsSwappableItem>;

  /* Sets the text of the originalText property */
  originalText?: string;

  /** Reference to multi-select setting on the IdsSwappable component */
  readonly multiSelect: boolean;

  /* Sets the tabbable property */
  tabbable?: boolean;
}

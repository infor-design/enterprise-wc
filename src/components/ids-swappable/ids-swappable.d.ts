import IdsSwappableItem from './ids-swappable-item';

export default class IdsSwappable extends HTMLElement {
  /* Sets the `multi-select` property to enable/disable multi-select ids-swappable-items */
  multiSelect?: boolean;

  /** Reference to all inner IdsSwappableItems with over attribute */
  readonly overEl: HTMLElement;

  /** Reference to all inner IdsSwappableItems with selected attribute */
  readonly selectedItems: Array<IdsSwappableItem>;
}

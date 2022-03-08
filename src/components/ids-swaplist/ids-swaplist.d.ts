import IdsSwappableItem from '../ids-swappable/ids-swappable-item';

export default class IdsSwapList extends HTMLElement {
  /** The amount of lists to render based on count */
  count: string | number;

  /** Reference to all inner IdsSwappableItem with selected attribute */
  readonly selectedItems: Array<IdsSwappableItem>;
}

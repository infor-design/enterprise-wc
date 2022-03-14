import IdsSwappableItem from './ids-swappable-item';

export default class IdsSwappable extends HTMLElement {
  /** Reference to all inner IdsSwappableItems with over attribute */
  readonly overElement: HTMLElement;

  /** Reference to all inner IdsSwappableItems with selected attribute */
  readonly selectedItems: Array<IdsSwappableItem>;
}

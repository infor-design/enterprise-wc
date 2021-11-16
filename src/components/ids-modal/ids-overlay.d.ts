import Base from './ids-overlay-base';

export default class IdsOverlay extends Base {
  /** If true, causes the overlay to be visible */
  visible?: boolean;

  /** Controls the opacity of the overlay, can be 0, 1, or any number in-between */
  opacity?: number;
}

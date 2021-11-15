import Base from './ids-drawer-base';

export default class IdsDrawer extends Base {
  /** Defines the edge on which to display the Drawer */
  edge: 'bottom' | 'left';

  /** Defines the display type to use for the Drawer contents */
  type: 'none' | 'app-menu' | 'action-sheet';

  /** True if the Drawer is currently showing */
  visible: boolean;

  /** Hides the Drawer */
  hide(): void;

  /** Shows the Drawer */
  show(): void;
}

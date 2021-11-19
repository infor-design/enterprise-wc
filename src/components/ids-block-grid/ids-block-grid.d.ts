import Base from './ids-block-grid-item-base';

export default class IdsBlockGrid extends Base {
  /** Set the block alignment */
  align: 'center' | 'left' | 'right';

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}

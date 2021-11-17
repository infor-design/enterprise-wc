import Base from './ids-card-base';

export default class IdsCard extends Base {
  /** Set the card height */
  autoHeight: boolean;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}

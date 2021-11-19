import Base from './ids-badge-base';

export default class IdsBadge extends Base {
  /* Set the shape of the badge */
  shape: 'normal' | 'round';

  /* Set the color of the badge */
  color: string | null;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}

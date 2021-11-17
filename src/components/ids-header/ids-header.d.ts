import Base from './ids-header-base';

export default class IdsHeader extends Base {
  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Set the color */
  color: '#0072ed' | string;
}

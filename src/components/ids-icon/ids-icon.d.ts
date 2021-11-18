import Base from './ids-icon-base';

export default class IdsIcon extends Base {
  /* The size of the icon to display */
  type: 'normal' | 'small' | 'medium' | 'large';

  /* The name of the icon to display */
  icon: string;

  /** Set the language */
  language: string;
}

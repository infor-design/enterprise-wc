import Base from './ids-fieldset-base';

export default class IdsFieldset extends Base {
  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}

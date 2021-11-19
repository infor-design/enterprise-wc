import Base from './ids-container-base';

export default class IdsTag extends Base {
  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Sets the container to scrollable */
  scrollable: boolean | string;

  /** Sets the container padding to string value */
  padding: string;
}

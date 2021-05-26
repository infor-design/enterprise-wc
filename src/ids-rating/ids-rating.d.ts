export default class IdsRating extends HTMLElement {
  /** Set the value attribute */
  value: '0' | string | number;

  /** Set the stars attribute */
  stars: '5' | string | number;

  /** Set the readonly attribute */
  readonly: 'true' | 'false' | string;

  /** Set the size attribute */
  size: 'small' | 'medium' | 'large' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}

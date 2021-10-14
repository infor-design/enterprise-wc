export default class IdsImage extends HTMLElement {
  /** Set the path to the image */
  src: string | null;

  /** Set an alternate text for the image */
  alt: string | null;

  /** Set the size for the image */
  size: 'auto' | 'sm' | 'md' | 'lg';

  /** Set whether or not to replace image with placeholder if the image fails to load */
  fallback: 'true' | 'false' | boolean | null;

  /** Set whether or not to replace image with placeholder initially */
  placeholder: 'true' | 'false' | boolean | null;

  /** Set whether or not the image is round */
  round: 'true' | 'false' | boolean | null;

  /** Set user status */
  userStatus: 'available' | 'away' | 'busy' | 'do-not-disturb' | 'unknown' | null;
}

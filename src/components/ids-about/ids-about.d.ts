import Base from './ids-about-base';

export default class IdsAbout extends Base {
  /** Sets semantic product version number */
  productVersion?: string;

  /** Sets additional product name information to display */
  productName?: string;

  /** Sets the year displayed in the copyright, defaults to current year */
  copyrightYear?: string;

  /** Sets whether or not to display device information. */
  deviceSpecs?: 'true' | 'false' | boolean;

  /** Sets whether or not to display Legal Approved Infor Copyright Text. */
  useDefaultCopyright?: 'true' | 'false' | boolean;
}

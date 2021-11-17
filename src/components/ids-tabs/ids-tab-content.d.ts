import Base from './ids-tab-content-base';

export default class IdsTabContent extends Base {
  /** Value representing the associated tab */
  value?: string;

  /** Whether or not this content will be flagged as active/visible */
  active: boolean;
}

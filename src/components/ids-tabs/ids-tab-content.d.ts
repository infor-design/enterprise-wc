import { IdsElement } from '../../core';

export default class IdsTabContent extends IdsElement {
  /** Value representing the associated tab */
  value?: string;

  /** Whether or not this content will be flagged as active/visible */
  active: boolean;
}

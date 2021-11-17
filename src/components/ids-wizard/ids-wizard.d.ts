import Base from './ids-wizard-base';

export default class IdsWizard extends Base {
  /**
   * Determines whether all wizard steps are clickable by default
   */
  clickable: boolean;

  /**
   * Current step number selected/last active
   */
  stepNumber: number | string;
}

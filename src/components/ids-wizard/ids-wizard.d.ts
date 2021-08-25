import { IdsElement } from '../../core';
import IdsWizardStep from './ids-wizard-step';

export { IdsWizardStep };

export default class IdsWizard extends IdsElement {
  /**
   * Determines whether all wizard steps are clickable by default
   */
  clickable: boolean;

  /**
   * Current step number selected/last active
   */
  stepNumber: number | string;
}

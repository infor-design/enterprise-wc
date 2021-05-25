import {
  IdsElement,
  customElement
} from '../ids-base';

// Note: this component is only used
// to count steps and retrieve attributes
// via parent for markup for simplicity sake;
// does not actually render it's own markup

/**
 * IDS WizardStep Component
 *
 * @type {IdsWizardStep}
 * @inherits IdsElement
 */
@customElement('ids-wizard-step')
class IdsWizardStep extends IdsElement {}

export default IdsWizardStep;

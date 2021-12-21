import { customElement } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import Base from './ids-wizard-step-base';

// Note: this component is only used to count steps
// and retrieve attributes via parent for markup for
// simplicity sake and does not actually render it's own markup

/**
 * IDS WizardStep Component
 * @type {IdsWizardStep}
 * @inherits IdsElement
 */
@customElement('ids-wizard-step')
export default class IdsWizardStep extends Base {}

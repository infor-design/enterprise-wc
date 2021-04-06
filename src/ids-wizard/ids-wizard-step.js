import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
// @ts-ignore
import styles from './ids-wizard.scss';

/**
 * IDS WizardStep Component
 *
 * Note: this component is only used
 * to count steps and retrieve attributes
 * via parent for markup for simplicity sake;
 * does not actually render it's own markup
 *
 * @type {IdsWizardStep}
 * @inherits IdsElement
 */
@customElement('ids-wizard-step')
@scss(styles)
class IdsWizardStep extends IdsElement {
  static get properties() {
    return ['current-step'];
  }

  get currentStep() {
    return Boolean(this.querySelector('[current-step]') === '');
  }

  set currentStep(v) {
    return v === '';
  }
}

export default IdsWizardStep;

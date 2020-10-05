import {
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import IdsButton from './ids-button';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-icon-button.scss';

/**
 * IDS Icon Button Component
 */
@customElement('ids-icon-button')
@scss(styles)
@mixin(IdsEventsMixin)
class IdsIconButton extends IdsButton {
  constructor() {
    super();
  }

  /**
   * CSS Classes that are specific to the Icon Button prototype.
   * @returns {Array} containing css classes specific to styling this component
   */
  get protoClasses() {
    return ['ids-icon-button'];
  }
}

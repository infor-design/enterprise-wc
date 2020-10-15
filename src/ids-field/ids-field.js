import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { IdsTrackdirtyMixin } from '../ids-base/ids-trackdirty-mixin';
import { IdsValidationMixin } from '../ids-base/ids-validation-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-field.scss';

/**
 * IDS Field Components
 */
@customElement('ids-field')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsStringUtilsMixin)
@mixin(IdsTrackdirtyMixin)
@mixin(IdsValidationMixin)
class IdsField extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Custom Element `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    this.handleTrackdirty();
    this.handleValidation();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.VALIDATE, props.TRACKDIRTY, props.FIELD_STATE];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return '<div class="ids-field"><slot></slot></div>';
  }

  /**
   * Set `validate` attribute
   * @param {string} value The `validate` attribute
   */
  set validate(value) {
    if (value) {
      this.setAttribute(props.VALIDATE, value);
      return;
    }
    this.removeAttribute(props.VALIDATE);
  }

  get validate() { return this.getAttribute(props.VALIDATE); }

  /**
   * Set `trackdirty` attribute
   * @param {boolean} value If true will set `trackdirty` attribute
   */
  set trackdirty(value) {
    const val = this.stringToBool(value);

    if (val) {
      this.setAttribute(props.TRACKDIRTY, val);
      return;
    }
    this.removeAttribute(props.TRACKDIRTY);
  }

  get trackdirty() { return this.getAttribute(props.TRACKDIRTY); }

  /**
   * Set `fieldState` attribute
   * @param {boolean} value If true will set `fieldState` attribute
   */
  set fieldState(value) {
    const val = value;
    const input = this.querySelector('ids-input');
    const label = this.querySelector('ids-label');

    if (val) {
      this.setAttribute(props.FIELD_STATE, val);
      input?.setAttribute(props.FIELD_STATE, val);
      label?.setAttribute(props.FIELD_STATE, val);
      return;
    }
    this.removeAttribute(props.FIELD_STATE);
    input?.removeAttribute(props.FIELD_STATE);
    label?.removeAttribute(props.FIELD_STATE);
  }

  get fieldState() { return this.getAttribute(props.FIELD_STATE); }
}

export default IdsField;

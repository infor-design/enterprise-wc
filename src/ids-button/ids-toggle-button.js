import {
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsButton, BUTTON_PROPS } from './ids-button';
import IdsIcon from '../ids-icon/ids-icon';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-toggle-button.scss';

// Default Toggle Button Icons
const DEFAULT_ICON_OFF = 'star-outlined';
const DEFAULT_ICON_ON = 'star-filled';

/**
 * IDS Toggle Button Component
 */
@customElement('ids-toggle-button')
@scss(styles)
@mixin(IdsEventsMixin)
class IdsToggleButton extends IdsButton {
  constructor() {
    super();
    this.icons = {
      off: DEFAULT_ICON_OFF,
      on: DEFAULT_ICON_ON
    };
  }

  /**
   * CSS Classes that are specific to the Icon Button prototype.
   * @returns {Array} containing css classes specific to styling this component
   */
  get protoClasses() {
    const slottedIcon = this.querySelector('ids-icon');
    if (!slottedIcon) {
      return ['ids-button'];
    }
    return ['ids-toggle-button'];
  }

  /**
   * @returns {Array} containing configurable properties on this component
   */
  static get properties() {
    return BUTTON_PROPS.concat([
      'icon-off',
      'icon-on',
      'pressed',
    ]);
  }

  /**
   * Toggle-Button-level `connectedCallBack` implementation (adds an icon refresh)
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    IdsButton.prototype.connectedCallBack.apply(this);
    this.refreshIcon();
  }

  /**
   * @param {boolean} val if true, the "toggle" is activated
   */
  set pressed(val) {
    const trueVal = val === true;
    this.state.pressed = trueVal;
    this.shouldUpdate = false;
    if (trueVal) {
      this.setAttribute('pressed', trueVal);
    } else {
      this.removeAttribute('pressed');
    }
    this.refreshIcon();
    this.shouldUpdate = true;
  }

  /**
   * @returns {boolean} true if the toggle is currently active
   */
  get pressed() {
    return this.state.pressed;
  }

  /**
   * Defines the `unpressed/off` toggle state icon.
   * @param {string} val corresponds to an IdsIcon's `icon` property
   * @returns {void}
   */
  set iconOff(val) {
    this.shouldUpdate = false;
    if (typeof val !== 'string' || !val.length) {
      this.icons.off = DEFAULT_ICON_OFF;
      this.removeAttribute('icon-off');
    } else {
      this.icons.off = val;
      this.setAttribute('icon-off', this.icons.off);
    }
    this.shouldUpdate = true;
    this.refreshIcon();
  }

  get iconOff() {
    return this.icons.off;
  }

  /**
   * Defines the `pressed/on` toggle state icon.
   * @param {string} val corresponds to an IdsIcon's `icon` property
   * @returns {void}
   */
  set iconOn(val) {
    this.shouldUpdate = false;
    if (typeof val !== 'string' || !val.length) {
      this.icons.on = DEFAULT_ICON_ON;
      this.removeAttribute('icon-on');
    } else {
      this.icons.on = val;
      this.setAttribute('icon-on', this.icons.on);
    }
    this.shouldUpdate = true;
    this.refreshIcon();
  }

  get iconOn() {
    return this.icons.on;
  }

  /**
   * Sets (or creates) a slotted icon that represents the pressed state
   * @returns {void}
   */
  refreshIcon() {
    let slottedIcon = this.querySelector('ids-icon');
    if (!slottedIcon) {
      slottedIcon = new IdsIcon();
      this.prepend(slottedIcon);
    }

    slottedIcon.icon = this[this.pressed ? 'iconOn' : 'iconOff'];
  }
}

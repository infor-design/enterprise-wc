import { IdsElement, customElement, mixin } from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsUtilitiesMixin } from '../ids-base/ids-utilities-mixin';
import { props } from '../ids-base/ids-constants';
import './ids-trigger-field.scss';

/**
 * IDS Trigger Field Components
 */
@customElement('ids-trigger-field')
@mixin(IdsEventsMixin)
@mixin(IdsUtilitiesMixin)
class IdsTriggerField extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  connectedCallBack() {
    this.render();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.TABBABLE, props.APPEARANCE, props.ICON];
  }

  /**
   * Set if the trigger field is tabbable
   * @param {boolean} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = this.utilities.stringToBool(value);
    if (!isTabbable) {
      this.setAttribute(props.TABBABLE, value);
      this.setAttribute('tabindex', '-1');
    } else {
      this.setAttribute('tabindex', '0');
    }
  }

  get tabbable() { return this.getAttribute(props.TABBABLE); }

  /**
   * Set the appearance of the trigger field
   * @param {string} value TODO: Provide different options for appearance
   */
  set appearance(value) {
    if (value) {
      this.setAttribute(props.APPEARANCE, value);
    }

    this.removeAttribute(props.APPEARANCE);
  }

  get appearance() { return this.getAttribute(props.APPEARANCE); }

  /**
   * Return the icon name
   * @returns {string} the path data
   */
  get icon() { return this.getAttribute(props.ICON); }

  set icon(value) {
    if (this.hasAttribute(props.ICON) && value) {
      this.setAttribute(props.ICON, value);
    } else {
      this.removeAttribute(props.ICON);
    }
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <style>@import url('css/ids-trigger-field/ids-trigger-field.min.css');</style>
      <div class="ids-trigger-field">
        <ids-input type="text"></ids-input>
        <ids-trigger-button><ids-icon icon="${this.icon}"><ids-icon></ids-trigger-button>
      </div>
    `;
  }
}

export default IdsTriggerField;

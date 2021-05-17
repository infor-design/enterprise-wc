import {
  IdsElement,
  customElement,
  mix,
  scss,
  props,
  stringUtils
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';

import styles from './ids-trigger-field.scss';

// Supporting components
import { IdsButton } from '../ids-button/ids-button';
import IdsInput from '../ids-input/ids-input';
import IdsTriggerButton from './ids-trigger-button';

/**
 * IDS Trigger Field Component
 * @type {IdsTriggerField}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part field - the field container
 */
@customElement('ids-trigger-field')
@scss(styles)
class IdsTriggerField extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    this.setInputProps();
    this.handleEvents();
    super.connectedCallback();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.TABBABLE, props.APPEARANCE, props.DISABLE_EVENTS];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-trigger-field" part="field"><slot></slot></div>`;
  }

  /**
   * Set input observer
   * @private
   * @returns {void}
   */
  setInputObserver() {
    /* istanbul ignore next */
    const callback = (mutationList) => {
      mutationList.forEach((m) => {
        if (m.type === 'attributes') {
          const attr = { name: m.attributeName, val: m.target[m.attributeName] };
          this.containerSetHeightClass(attr);
        }
      });
    };
    /* istanbul ignore next */
    if (this.inputObserver) {
      this.inputObserver.disconnect();
    }
    this.inputObserver = new MutationObserver(callback);
    this.inputObserver.observe(this.input, { attributes: true });
  }

  /**
   * Set the class for compact or field height
   * @private
   * @param {object} attr The input attribute
   * @returns {void}
   */
  containerSetHeightClass(attr) {
    const heightClassName = (h) => `field-height-${h}`;
    const heights = ['xs', 'sm', 'md', 'lg'];

    if (attr.name === 'compact') {
      this.container?.classList[stringUtils.stringToBool(attr.val) ? 'add' : 'remove']('compact');
    } else if (attr.name === 'field-height') {
      this.container?.classList.remove(...heights.map((h) => heightClassName(h)));
      if (attr.val !== null) {
        this.container?.classList.add(heightClassName(attr.val));
      }
    }
  }

  /**
   * Set the input props
   * @private
   * @returns {void}
   */
  setInputProps() {
    this.input = this.querySelector('ids-input');
    if (this.input) {
      this.input.setAttribute(props.TRIGGERFIELD, 'true');

      // Set class for compact or field height
      const attributes = ['compact', 'field-height'];
      const attr = (a) => ({ name: a, val: this.input.getAttribute(a) });
      attributes.forEach((a) => this.containerSetHeightClass(attr(a)));
      this.setInputObserver();
    }
  }

  /**
   * Set if the trigger field is tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = stringUtils.stringToBool(value);
    /** @type {any} */
    const button = this.querySelector('ids-trigger-button');
    this.setAttribute(props.TABBABLE, value.toString());
    button.tabbable = isTabbable;
  }

  get tabbable() { return this.getAttribute(props.TABBABLE); }

  /**
   * Set the appearance of the trigger field
   * @param {string} value Provide different options for appearance 'normal' | 'compact'
   */
  set appearance(value) {
    if (value) {
      this.setAttribute(props.APPEARANCE, value);
      return;
    }

    this.setAttribute(props.APPEARANCE, 'normal');
  }

  get appearance() { return this.getAttribute(props.APPEARANCE); }

  /**
   * Set if the button handles events
   * @param {boolean|string} value True of false depending if the button handles events
   */
  set disableNativeEvents(value) {
    const isDisabled = stringUtils.stringToBool(value);
    if (isDisabled) {
      this.setAttribute(props.DISABLE_EVENTS, value.toString());
      this.handleEvents();
      return;
    }

    this.removeAttribute(props.DISABLE_EVENTS);
  }

  get disableNativeEvents() { return this.getAttribute(props.DISABLE_EVENTS); }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  handleEvents() {
    if (this.input) {
      const className = 'has-validation-message';
      this.onEvent('validated', this.input, (e) => {
        if (e.detail?.isValid) {
          this.container?.classList?.remove(className);
        } else {
          this.container?.classList?.add(className);
        }
      });
    }

    if (this.disableNativeEvents) {
      return false;
    }

    /** @type {any} */
    const button = this.querySelector('ids-trigger-button');
    if (button) {
      this.onEvent('click', button, () => this.trigger());
    }

    return this;
  }

  /**
   * Fire the trigger event and action.
   */
  trigger() {
    let canTrigger = true;
    const response = (/** @type {any} */ veto) => {
      canTrigger = !!veto;
    };
    this.triggerEvent('beforetriggerclicked', this, { detail: { elem: this, response } });

    if (!canTrigger) {
      return;
    }

    this.triggerEvent('triggerclicked', this, { detail: { elem: this } });
  }
}

export default IdsTriggerField;

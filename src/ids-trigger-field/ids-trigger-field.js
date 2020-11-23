import {
  IdsElement,
  customElement,
  mixin,
  scss,
  props
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { IdsDomUtilsMixin } from '../ids-base/ids-dom-utils-mixin';
import { IdsResizeMixin } from '../ids-base/ids-resize-mixin';
import styles from './ids-trigger-field.scss';

/**
 * IDS Trigger Field Components
 */
@customElement('ids-trigger-field')
@scss(styles)
@mixin(IdsStringUtilsMixin)
@mixin(IdsDomUtilsMixin)
@mixin(IdsResizeMixin)
class IdsTriggerField extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
    this.shouldUpdate = true;
  }

  /**
   * Custom Element `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    this.setupResize();

    this.handleEvents();
    this.refresh();
  }

  /**
   * Custom Element `disconnectedCallback` implementation
   * @private
   * @returns {void}
   */
  disconnectedCallback() {
    IdsElement.prototype.disconnectedCallback.apply(this);
    if (this.shouldResize()) {
      this.ro.unobserve(this.parentNode);
      this.disconnectResize();
    }
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
    return `<div class="ids-trigger-field"><slot></slot></div>`;
  }

  /**
   * Set if the trigger field is tabbable
   * @param {boolean} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = this.stringToBool(value);
    const button = this.querySelector('ids-trigger-button');
    this.setAttribute(props.TABBABLE, value);
    if (button) {
      button.tabindex = !isTabbable ? '-1' : '0';
    }
  }

  get tabbable() { return this.getAttribute(props.TABBABLE); }

  /**
   * TODO: Set the appearance of the trigger field
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
   * @param {boolean} value True of false depending if the button handles events
   */
  set disableNativeEvents(value) {
    const isDisabled = this.stringToBool(value);
    if (isDisabled) {
      this.setAttribute(props.DISABLE_EVENTS, value);
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
    if (this.disableNativeEvents) {
      return false;
    }

    this.eventHandlers = new IdsEventsMixin();
    const button = this.querySelector('ids-trigger-button');
    if (button) {
      this.eventHandlers.addEventListener('click', button, () => this.trigger());
    }

    return this;
  }

  /**
   * Fire trigger event
   */
  trigger() {
    let canTrigger = true;
    const response = (veto) => {
      canTrigger = !!veto;
    };
    this.eventHandlers.dispatchEvent('beforetriggerclicked', this, { elem: this, response });

    if (!canTrigger) {
      return;
    }

    this.eventHandlers.dispatchEvent('triggerclicked', this, { elem: this });
  }

  /**
   * Set `has-inputlabel` css class to align trigger button.
   * @private
   * @returns {void}
   */
  setLabelClass() {
    const input = this.querySelector('ids-input');
    const trigger = this.querySelector('ids-trigger-button');
    if (input && trigger) {
      const required = input.labelEl?.classList.contains('required');
      trigger.classList[input.label ? 'add' : 'remove']('has-input-label');
      trigger.classList[required ? 'add' : 'remove']('has-input-required');
      const icon = trigger.querySelector('ids-icon');
      if (icon) {
        trigger.classList.add(`has-icon-${icon.getAttribute('icon')}`);
      }
    }
  }

  /**
   * Set input width with current ids-input width.
   * @private
   * @returns {void}
   */
  setInputWidth() {
    const input = this.querySelector('ids-input');
    const trigger = this.querySelector('ids-trigger-button');
    if (input && trigger && input.inputWidth && input.size !== 'full') {
      const width = input.inputWidth - (this.outerWidth(trigger) + 4);
      trigger.style.right = 'unset';
      trigger.style.left = `${width}px`;
    }
  }

  /**
   * Run with resize observer.
   * @private
   * @returns {void}
   */
  refresh() {
    if (!this.shouldUpdate) {
      return;
    }
    this.shouldUpdate = false;

    // Attach to the global ResizeObserver (this doesn't need updating)
    if (this.shouldResize()) {
      this.ro.observe(this.parentNode);
    }
    this.setLabelClass();
    this.setInputWidth();
    this.shouldUpdate = true;
  }
}

export default IdsTriggerField;

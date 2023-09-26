import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-tooltip.scss';
import type IdsPopup from '../ids-popup/ids-popup';
import '../ids-popup/ids-popup';

const Base = IdsKeyboardMixin(
  IdsLocaleMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Tooltip Component
 * @type {IdsTooltip}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @part tooltip - the tooltip container
 */
@customElement('ids-tooltip')
@scss(styles)
export default class IdsTooltip extends Base {
  constructor() {
    super();

    // Setup initial internal states
    this.state = {
      target: null,
      trigger: 'hover',
      visible: false,
    };
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element,
   */
  connectedCallback(): void {
    super.connectedCallback();
    this.#updateAria();
  }

  /**
   * Returns the properties/settings we handle as getters/setters
   * @returns {Array} The supported settings in an array
   */
  static get attributes(): Array<string> {
    return [
      attributes.DELAY,
      attributes.KEEP_OPEN,
      attributes.PLACEMENT,
      attributes.TARGET,
      attributes.TRIGGER,
      attributes.VISIBLE
    ];
  }

  /**
   * Create the Template for the component contents
   * @returns {string} The template
   */
  template(): string {
    const cssParts = 'popup: tooltip-popup, arrow: tooltip-arrow, arrow-top: tooltip-arrow-top, arrow-right: tooltip-arrow-right, arrow-bottom: tooltip-arrow-bottom, arrow-left: tooltip-arrow-left';

    return `<ids-popup part="popup" id="${this.id || 'ids'}-tooltip" exportparts="${cssParts}">
        <div class="ids-tooltip" slot="content" part="tooltip">
          <slot></slot>
        </div>
        </ids-popup>
      `;
  }

  /**
   * Bind Internal Event Handlers
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    this.detachAllEvents();
    if (!(typeof this.target === 'string')) {
      this.#bindEvents(this.target);
      return;
    }

    const list = document.querySelectorAll(this.target);
    for (let i = 0, len = list.length; i < len; i++) {
      this.#bindEvents(list[i]);
    }
  }

  /**
   * Bind the events to a tooltip target.
   * @param {HTMLElement} targetElem The element to attach events to
   * @private
   */
  #bindEvents(targetElem: any) {
    // Events to show on hover
    if (this.trigger === 'hover') {
      this.onEvent('hoverend.tooltip', targetElem, (e: Event) => {
        if (this.popup) {
          if (!this.popup?.alignTarget) this.popup.alignTarget = e.currentTarget as HTMLElement;
          this.visible = true;
        }
      }, { delay: this.delay });
      this.onEvent('mouseleave.tooltip', targetElem, () => {
        this.visible = false;
      });
      this.onEvent('click.tooltip', targetElem, () => {
        this.visible = false;
      });

      // Long Press
      this.onEvent('longpress.tooltip', targetElem, () => {
        this.visible = true;
      }, { delay: 1000 });

      // Keyboard Focus event
      this.onEvent('keyboardfocus.tooltip', targetElem, () => {
        this.visible = true;
      });

      this.onEvent('focusout.tooltip', targetElem, () => {
        this.visible = false;
      });

      this.onEvent('click.popup', this.popup, () => {
        this.visible = true;
      });
    }

    // Events to show on click
    if (this.trigger === 'click') {
      this.onEvent('click.tooltip', targetElem, (e: Event) => {
        if (this.popup) {
          this.popup.alignTarget = e.currentTarget as HTMLElement;
          if (this.visible) {
            this.visible = false;
            return;
          }
          this.visible = true;
        }
      });

      this.onEvent('click.popup', this.popup, () => {
        this.visible = false;
      });
    }

    // Events to show on focus
    if (this.trigger === 'focus') {
      this.onEvent('focusin.tooltip', targetElem, (e: Event) => {
        if (this.popup) {
          this.popup.alignTarget = e.currentTarget as HTMLElement;
          this.visible = true;
        }
      });

      this.onEvent('focusout.tooltip', targetElem, () => {
        this.visible = false;
      });
    }
  }

  /**
   * Setup the popup
   * @private
   * @returns {void}
   */
  #configurePopup(): void {
    const popup = this.popup;

    // Popup settings / config
    if (popup) {
      popup.type = 'tooltip';
      popup.align = `${this.placement}, center`;
      popup.arrow = this.placement;

      if (this.placement === 'top' || this.placement === 'bottom') {
        popup.setPosition(0, 10);
      }
      if (this.placement === 'left' || this.placement === 'right') {
        popup.setPosition(10, 0);
      }
    }
  }

  /**
   * Update the aria attributes with the correct contents
   * @private
   * @returns {void}
   */
  #updateAria(): void {
    // For ellipsis based tooltips we dont do this
    if (this.state?.noAria) {
      return;
    }

    const popup = this.popup;
    if (popup) {
      popup.alignTarget = typeof this.target === 'object'
        ? this.target
        : document.querySelectorAll(this.target)[0];

      const id = `${this.id || 'ids'}-tooltip`;
      const alignTarget = popup?.alignTarget?.querySelector(`#${id}`);
      if (alignTarget) {
        alignTarget.textContent = this.textContent;
        return;
      }

      if (popup.alignTarget) {
        const ariaSpan = `<ids-text id="${id}" audible="true">${this.textContent}</ids-text>`;
        popup.alignTarget.insertAdjacentHTML('beforeend', ariaSpan);
        popup.alignTarget.setAttribute('aria-describedby', `#${id}`);
      }
    }
  }

  /**
   * Show the tooltip (use visible for public API)
   * @private
   * @returns {Promise<void>}
   */
  async #show(): Promise<void> {
    // Trigger a veto-able `beforeshow` event.
    let canShow = true;
    const beforeShowResponse = (veto: any) => {
      canShow = !!veto;
    };

    // Trigger an async callback for contents
    if (this.state.beforeShow) {
      const stuff = await this.state.beforeShow();
      if (!stuff) return;
      this.textContent = stuff;
      this.#updateAria();
    }

    this.triggerEvent('beforeshow', this, {
      detail: {
        elem: this,
        response: beforeShowResponse
      }
    });

    if (!canShow) {
      this.visible = false;
      return;
    }

    // Show the popup
    this.#configurePopup();
    const popup = this.popup;
    if (popup) {
      popup.visible = true;
      popup.place();
      this.triggerEvent('show', this, { detail: { elem: this } });
      this.triggerEvent('aftershow', this, { detail: { elem: this } });
    }
  }

  /**
   * Show the tooltip  (use visible for public API)
   * @returns {void}
   */
  #hide(): void {
    const popup = this.popup;

    if (popup) {
      popup.visible = false;
      this.triggerEvent('hide', this, { detail: { elem: this } });
      this.triggerEvent('afterhide', this, { detail: { elem: this } });
      this.onHide();
    }
  }

  /**
   * Callback for when hide is triggered
   * @returns {void}
   */
  onHide() {
  }

  /**
   * @readonly
   * @returns {IdsPopup | undefined | null} reference to the internal IdsPopup component
   */
  get popup(): IdsPopup | undefined | null {
    return this.shadowRoot?.querySelector('ids-popup');
  }

  /**
   * An async function that fires as the tooltip is showing allowing you to set contents.
   * @param {Function} func The async function
   */
  set beforeShow(func: () => Promise<string>) {
    this.state.beforeShow = func;
  }

  get beforeShow(): () => Promise<string> { return this.state.beforeShow; }

  /**
   * Set how long after hover you should delay before showing
   * @param {string | number} value The amount in ms to delay
   */
  set delay(value: string | number) {
    if (value) {
      this.setAttribute('delay', value.toString());
      return;
    }

    this.removeAttribute('delay');
  }

  get delay(): string | number { return Number(this.getAttribute('delay')) || 500; }

  /**
   * Sets the tooltip placement between left, right, top, bottom
   * @param {string} value The placement of the tooltip
   */
  set placement(value: string) {
    this.state.placement = value;

    if (value) {
      this.setAttribute('placement', value);
      return;
    }

    this.removeAttribute('placement');
  }

  get placement(): string { return this.getAttribute('placement') || 'top'; }

  /**
   * Set the target element for the tooltip
   * @param {HTMLElement} value The target element selector
   */
  set target(value: any) {
    this.state.target = value;

    if (value && typeof value !== 'string') {
      this.removeAttribute('target');
      this.#attachEventHandlers();
      return;
    }

    if (value && typeof value === 'string') {
      this.setAttribute('target', value);
      this.#attachEventHandlers();
      return;
    }

    this.removeAttribute('target');
    this.#attachEventHandlers();
  }

  get target(): any { return this.state.target; }

  /**
   * Set trigger agains the target between hover, click and focus
   * @param {string} value The trigger mode to use
   */
  set trigger(value: string) {
    this.state.trigger = value;

    if (this.state.trigger) {
      this.setAttribute('trigger', this.state.trigger);
      this.#attachEventHandlers();
      return;
    }

    this.removeAttribute('trigger');
    this.#attachEventHandlers();
  }

  get trigger(): string { return this.state.trigger || 'hover'; }

  /**
   * Set tooltip immediately to visible/invisible
   * @param {string|boolean} value The target element selector
   */
  set visible(value: string | boolean) {
    const trueVal = stringToBool(value);
    if (this.state.visible !== trueVal) {
      const popup = this.popup;
      this.state.visible = trueVal;

      if (popup && !popup.alignTarget) {
        popup.alignTarget = typeof this.target === 'object'
          ? this.target
          : document.querySelectorAll(this.target)[0];
      }

      if (this.state.visible) {
        this.setAttribute('visible', 'true');
        this.#show();
        return;
      }

      if (popup) popup.alignTarget = null;
      this.removeAttribute('visible');
      this.#hide();
    }
  }

  get visible(): string | boolean { return this.state.visible; }
}

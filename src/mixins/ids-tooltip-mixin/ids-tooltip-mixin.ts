import { attributes } from '../../core/ids-attributes';
import '../../components/ids-tooltip/ids-tooltip';
import { IdsConstructor, IdsWebComponent } from '../../core/ids-interfaces';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import type IdsTriggerField from '../../components/ids-trigger-field/ids-trigger-field';

type FieldContainer = {
  fieldContainer?: HTMLElement | SVGElement | null
};

type Constraints = IdsConstructor<IdsWebComponent & EventsMixinInterface & FieldContainer>;

/**
/**
 * A mixin that adds tooltip functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsTooltipMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.TOOLTIP
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.handleTooltipEvents();
  }

  /**
   * Init the mixin events and states
   * @private
   */
  handleTooltipEvents() {
    if (!this.tooltip) {
      return;
    }

    this.offEvent('hoverend.tooltipmixin');
    this.onEvent('hoverend.tooltipmixin', this, () => {
      this.showTooltip();
    });
  }

  /**
   * Return the correct target element
   * @private
   * @returns {HTMLElement} The correct target element
   */
  get toolTipTarget(): any {
    // `this.fieldContainer` targets any IDS Component that extends IdsInput
    if (this.fieldContainer instanceof HTMLElement || this.fieldContainer instanceof SVGElement) {
      return this.fieldContainer;
    }

    const triggerField = this.shadowRoot?.querySelector<IdsTriggerField>('ids-trigger-field');
    if (triggerField?.fieldContainer instanceof HTMLElement || triggerField?.fieldContainer instanceof SVGElement) {
      return triggerField.fieldContainer;
    }

    return this;
  }

  /**
   * Show the tooltip if available
   */
  showTooltip() {
    // For ellipsis tooltip check if overflowing and only show if it is
    if (this.nodeName === 'IDS-TEXT' && this.tooltip === 'true' && this.container && !(this.container.scrollWidth > this.container.clientWidth)) {
      return;
    }

    // Append an IDS Tooltip and show it
    const tooltip: any = document.createElement('ids-tooltip');
    let container = document.querySelector('ids-container');
    if (!container) {
      container = document.body;
    }
    container?.appendChild(tooltip);

    if (!tooltip.state) {
      tooltip.state = {};
    }
    tooltip.state.noAria = true;
    tooltip.target = this.toolTipTarget;
    tooltip.alignTarget = this.toolTipTarget;

    // Handle Ellipsis Text if tooltip="true"
    tooltip.textContent = this.tooltip === 'true' ? this.textContent : this.tooltip;

    // Show it
    tooltip.visible = true;

    // Remove it when closed
    tooltip.onEvent('hide.tooltipmixin', tooltip, () => {
      tooltip.remove();
    });
  }

  /**
   * Set the tooltip to a particular string
   * @param {string} value The tooltips value
   */
  set tooltip(value: string | null) {
    if (value) {
      this.setAttribute('tooltip', value);
      this.container?.setAttribute('tooltip', value);
    }
  }

  /**
   * Gets tooltip string value
   * @returns {string} tooltip string value
   */
  get tooltip(): string | null {
    return this.getAttribute('tooltip');
  }
};

export default IdsTooltipMixin;

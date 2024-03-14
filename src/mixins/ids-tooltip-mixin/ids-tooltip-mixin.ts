import { attributes } from '../../core/ids-attributes';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import { IdsConstructor } from '../../core/ids-element';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

import '../../components/ids-tooltip/ids-tooltip';
import type IdsTooltip from '../../components/ids-tooltip/ids-tooltip';
import type { IdsTooltipPlacement } from '../../components/ids-tooltip/ids-tooltip';

interface TooltipMixinInterface {
  canTooltipShow?(tooltipEl: IdsTooltip | null, tooltipContent: string): boolean;
  onTooltipTargetDetection?(tooltipEl: IdsTooltip | null): HTMLElement | SVGElement;
}

type Constraints = IdsConstructor<EventsMixinInterface & TooltipMixinInterface>;

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
      attributes.TOOLTIP,
      attributes.TOOLTIP_PLACEMENT,
      attributes.TOOLTIP_PLAIN_TEXT,
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
    this.offEvent('hoverend.tooltipmixin');
    if (!this.tooltip) return;

    this.onEvent('hoverend.tooltipmixin', this, (e: CustomEvent) => {
      e.stopPropagation();
      this.showTooltip();
    }, { delay: 500, bubbles: true });
  }

  /**
   * @returns {IdsTooltip | null} reference to an established IdsTooltip
   */
  get tooltipEl(): IdsTooltip | null {
    return this.getTooltipContainer()?.querySelector<IdsTooltip>('#mixin-tooltip');
  }

  /**
   * Return the correct target element
   * @private
   * @returns {HTMLElement | SVGElement} The correct target element
   */
  get toolTipTarget() {
    let target: HTMLElement | SVGElement = this;

    if (typeof this.onTooltipTargetDetection === 'function') {
      target = this.onTooltipTargetDetection(this.tooltipEl);
    }

    return target;
  }

  /**
   * @returns {HTMLElement} reference to the correct container element in which to find the mixin tooltip.
   */
  getTooltipContainer() {
    let container = document.querySelector('ids-container');
    if (!container) {
      container = document.body;
    }
    return container;
  }

  /**
   * Show the tooltip if available
   */
  showTooltip() {
    // For ellipsis tooltip check if overflowing and only show if it is
    if (typeof this.canTooltipShow === 'function') {
      if (!this.canTooltipShow(this.tooltipEl, this.tooltip)) return;
    }

    // Locate the tooltip's container
    const container = this.getTooltipContainer();

    // Generate a tooltip if needed, or query an existing one
    let tooltip = container.querySelector<IdsTooltip>('#mixin-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('ids-tooltip') as IdsTooltip;
      tooltip.id = 'mixin-tooltip';
      container?.appendChild(tooltip);
    }

    if (!tooltip.state) {
      tooltip.state = {};
    }
    tooltip.target = this.toolTipTarget;
    tooltip.state.noAria = true;

    // Handle Ellipsis Text if tooltip="true"
    try {
      if (this.hasAttribute(attributes.TOOLTIP_PLAIN_TEXT)) {
        tooltip.textContent = this.tooltip === 'true' ? this.textContent : this.tooltip;
      } else {
        tooltip.innerHTML = this.tooltip === 'true' ? this.innerHTML : this.tooltip;
      }
    } catch (e) {
      tooltip.textContent = this.tooltip === 'true' ? this.textContent : this.tooltip;
    }

    if (this.hasAttribute(attributes.TOOLTIP_PLACEMENT)) {
      tooltip.placement = this.getAttribute(attributes.TOOLTIP_PLACEMENT) as IdsTooltipPlacement;
    }

    // Show it
    tooltip.visible = true;
    tooltip.popup?.place();

    if (getClosest(this, 'ids-container')?.getAttribute('dir') === 'rtl') tooltip.popup?.setAttribute('dir', 'rtl');
    if (this.beforeTooltipShow) this.beforeTooltipShow(tooltip);

    // Remove it when closed
    tooltip.onEvent('hide.tooltipmixin', tooltip, () => {
      document.querySelector('#mixin-tooltip')?.remove();
    });
  }

  /**
   * Setup some special config for the tooltip
   * @param {any} tooltip The tooltip to configure
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeTooltipShow(tooltip?: any) {
  }

  /**
   * Set the tooltip to a particular string
   * @param {string} value The tooltips value
   */
  set tooltip(value: string) {
    if (value) {
      this.setAttribute('tooltip', value);
      this.container?.setAttribute('tooltip', value);
      this.handleTooltipEvents();
    }
  }

  get tooltip() {
    return this.getAttribute('tooltip') as string;
  }
};

export default IdsTooltipMixin;

import { attributes } from '../../core/ids-attributes';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import { IdsConstructor } from '../../core/ids-element';
import { getClosest, checkOverflow } from '../../utils/ids-dom-utils/ids-dom-utils';
import { IdsInputInterface } from '../../components/ids-input/ids-input-attributes';
import '../../components/ids-tooltip/ids-tooltip';
import type IdsTooltip from '../../components/ids-tooltip/ids-tooltip';

type Constraints = IdsConstructor<EventsMixinInterface>;
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
    this.offEvent('hoverend.tooltipmixin');
    if (!this.tooltip) return;

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
    const fieldContainerElem = (this as IdsInputInterface).fieldContainer;

    // `this.fieldContainer` targets any IDS Component that extends IdsInput
    if (fieldContainerElem instanceof HTMLElement || fieldContainerElem instanceof SVGElement) {
      return fieldContainerElem;
    }

    const triggerField = this.shadowRoot?.querySelector<any>('ids-trigger-field');
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
    if (this.nodeName === 'IDS-TEXT' && this.tooltip === 'true' && this.container) {
      if (!checkOverflow(this.container)) return;
    }

    // Append an IDS Tooltip and show it
    const tooltip: IdsTooltip = document.createElement('ids-tooltip') as IdsTooltip;
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

    // Handle Ellipsis Text if tooltip="true"
    tooltip.textContent = this.tooltip === 'true' ? this.textContent : this.tooltip;

    // Show it
    tooltip.visible = true;

    if (getClosest(this, 'ids-container')?.getAttribute('dir') === 'rtl') tooltip.popup?.setAttribute('dir', 'rtl');
    if (this.beforeTooltipShow) this.beforeTooltipShow(tooltip);

    // Remove it when closed
    tooltip.onEvent('hide.tooltipmixin', tooltip, () => {
      tooltip.remove();
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
    }
  }

  get tooltip() {
    return this.getAttribute('tooltip') as string;
  }
};

export default IdsTooltipMixin;

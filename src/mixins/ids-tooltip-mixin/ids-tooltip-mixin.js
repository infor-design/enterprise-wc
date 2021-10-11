import { attributes } from '../../core';
import { IdsEventsMixin } from '../ids-events-mixin';
import IdsTooltip from '../../components/ids-tooltip';

/**
/**
 * A mixin that adds tooltip functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsTooltipMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
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
  get toolTipTarget() {
    if (this.nodeName === 'IDS-INPUT') {
      return this.container.querySelector('input');
    }
    /* istanbul ignore next */
    if (this.nodeName === 'IDS-DROPDOWN') {
      return this.container?.querySelector('ids-input').container?.querySelector('input');
    }
    return this;
  }

  /**
   * Show the tooltip if available
   */
  showTooltip() {
    // For ellipsis tooltip check if overflowing and only show if it is
    if (this.nodeName === 'IDS-TEXT' && this.tooltip === 'true' && !(this.container.scrollWidth > this.container.clientWidth)) {
      return;
    }

    // Append an IDS Tooltip and show it
    const tooltip = document.createElement('ids-tooltip');
    /* istanbul ignore next */
    if (!tooltip.state) {
      tooltip.state = {};
    }
    tooltip.state.noAria = true;
    tooltip.target = this.toolTipTarget;
    tooltip.alignTarget = this.toolTipTarget;

    // Handle Ellipsis Text if tooltip="true"
    /* istanbul ignore next */
    tooltip.textContent = this.tooltip === 'true' ? this.textContent : this.tooltip;

    let container = document.querySelector('ids-container');
    if (!container) {
      container = document.body;
    }
    container?.appendChild(tooltip);

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
  set tooltip(value) {
    this.setAttribute('tooltip', value);
    this.container?.setAttribute('tooltip', value);
  }

  get tooltip() { return this.getAttribute('tooltip'); }
};

export default IdsTooltipMixin;

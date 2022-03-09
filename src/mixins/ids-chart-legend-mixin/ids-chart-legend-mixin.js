import { attributes } from '../../core/ids-attributes';
import { checkOverflow } from '../../utils/ids-dom-utils/ids-dom-utils';

/**
 * A mixin that adds selection functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsChartLegend = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.LEGEND_PLACEMENT,
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  /**
   * Set the legend placement between top, bottom, left, right
   * @param {string} value The placement value
   */
  set legendPlacement(value) {
    const chartContainer = this.shadowRoot.querySelector('.ids-chart-container');

    if (value === 'top' || value === 'bottom' || value === 'left' || value === 'right') {
      this.setAttribute(attributes.LEGEND_PLACEMENT, value);
      chartContainer?.classList.remove('legend-top', 'legend-bottom', 'legend-left', 'legend-right');
      chartContainer?.classList.add(`legend-${value}`);
    }
  }

  get legendPlacement() { return this.getAttribute(attributes.LEGEND_PLACEMENT) || 'bottom'; }

  /**
   * Calculate the legend markup and return it
   * @param {string} setting The setting to use between name,shortName and abbreviatedName
   * @returns {string} The legend markup.
   */
  legendTemplate(setting = 'name') {
    let legend = `<div class="chart-legend">`;
    this.data.forEach((group, index) => {
      legend += `<a href="#"><div class="swatch color-${index + 1}"></div>${group[setting] ? group[setting] : group.name}</a>`;
    });
    legend += `</div>`;
    return legend;
  }

  /**
   * Set the labels between name, shortName and abbreviatedName depending which fits best
   */
  adjustLabels() {
    let legend = this.shadowRoot.querySelector('.chart-legend');
    if (checkOverflow(this.shadowRoot.querySelector('.chart-legend'))) {
      legend.outerHTML = this.legendTemplate('shortName');
    }
    legend = this.shadowRoot.querySelector('.chart-legend');
    if (checkOverflow(legend)) {
      legend.outerHTML = this.legendTemplate('abbreviatedName');
    }
  }
};

export default IdsChartLegend;

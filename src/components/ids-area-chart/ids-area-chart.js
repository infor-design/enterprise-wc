import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-area-chart-base';
import styles from './ids-area-chart.scss';

/**
 * IDS Area Chart Component
 * @type {IdsAreaChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the outside container element
 */
@customElement('ids-area-chart')
@scss(styles)
export default class IdsAreaChart extends Base {
  constructor() {
    super();
  }

  /**
   * Return the chart data for the internal svg
   * @private
   * @returns {object} The markers and areas and lines
   */
  chartTemplate() {
    return `<g class="markers">
      ${this.lineMarkers().markers}
    </g>
    <g class="marker-lines">
      ${this.lineMarkers().lines}
    </g>
    <g class="areas">
      ${this.#areas()}
    </g>`;
  }

  /**
   * Generate the svg markup for the area paths
   * @returns {string} The area markup
   * @private
   */
  #areas() {
    let areas = '';
    this.markerData.points.forEach((point, index) => {
      if (this.markerData.points[index + 1]) {
        areas += `M${point.left},${point.top}L${point.left},${this.markerData.gridBottom}L${this.markerData.points[index + 1]?.left},${this.markerData.gridBottom}L${this.markerData.points[index + 1]?.left},${this.markerData.points[index + 1]?.top}`;
      }
    });
    return `<path d="${areas}Z"></path>`;
  }
}

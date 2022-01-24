import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-area-chart-base';
import styles from './ids-area-chart.scss';

/**
 * IDS Area Chart Component
 * @type {IdsAreaChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part svg - the outside svg element
 * @part marker - the dots/markers in the chart
 * @part line - the lines in the chart
 * @part area - each area element in the chart
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
    let areaHTML = '';
    this.markerData.points.forEach((pointGroup, groupIndex) => {
      let areas = '';
      pointGroup.forEach((point, index) => {
        if (pointGroup[index + 1]) {
          areas += `M${point.left},${point.top}L${point.left},${this.markerData.gridBottom}L${pointGroup[index + 1]?.left},${this.markerData.gridBottom}L${pointGroup[index + 1]?.left},${pointGroup[index + 1]?.top}`;
        }
      });
      areaHTML += `<path part="area" d="${areas}Z" fill="var(${this.color(groupIndex)})"}></path>`;
    });
    return areaHTML;
  }

  /**
   * Set the size of the markers (aka dots/ticks) in the chart
   * @param {number} value The value to use (in pixels)
   */
  set markerSize(value) {
    this.setAttribute(attributes.MARKER_SIZE, value);
    this.rerender();
  }

  /**
   * Adjust the size of the default marker
   * @returns {number} value The value to use (in pixels)
   */
  get markerSize() {
    return parseFloat(this.getAttribute(attributes.MARKER_SIZE)) || 1;
  }
}

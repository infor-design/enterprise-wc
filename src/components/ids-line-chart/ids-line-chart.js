import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-line-chart-base';
import styles from './ids-line-chart.scss';

/**
 * IDS Line Chart Component
 * @type {IdsLineChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part svg - the outside svg element
 * @part marker - the dots/markers in the chart
 * @part line - the lines in the chart
 */
@customElement('ids-line-chart')
@scss(styles)
export default class IdsLineChart extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.MARKER_SIZE
    ];
  }

  /**
   * Return the chart data for the internal svg
   * @returns {object} The markers and lines
   */
  chartTemplate() {
    return `<g class="markers">
      ${this.lineMarkers().markers}
    </g>
    <g class="marker-lines">
      ${this.lineMarkers().lines}
    </g>`;
  }

  /**
   * Return the marker data for the svg
   * @private
   * @returns {object} The markers and lines
   */
  lineMarkers() {
    let markerHTML = '';
    let lineHTML = '';

    this.markerData.points.forEach((pointGroup, index) => {
      let points = '';
      markerHTML += '<g class="marker-set">';
      pointGroup.forEach((point) => {
        points += `${point.left},${point.top} `;
        markerHTML += `<circle part="marker" fill="var(${this.color(index)}" cx="${point.left}" cy="${point.top}" data-value="${point.value}" r="${this.markerSize}">${point.value}</circle>`;
      });
      markerHTML += '</g>';
      lineHTML += `<polyline part="line" class="data-line" points="${points}" stroke="var(${this.color(index)}"/>`;
    });

    return {
      markers: markerHTML,
      lines: lineHTML
    };
  }

  /**
   * Set the size of the markers (aka dots/ticks) in the chart
   * @param {number} value The value to use (in pixels)
   */
  set markerSize(value) {
    this.setAttribute(attributes.MARKER_SIZE, value);
    this.rerender();
  }

  get markerSize() {
    return parseFloat(this.getAttribute(attributes.MARKER_SIZE)) || 5;
  }
}

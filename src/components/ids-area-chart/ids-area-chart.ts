import { customElement, scss } from '../../core/ids-decorators';
import '../ids-line-chart/ids-line-chart';
import Base from './ids-area-chart-base';
import styles from './ids-area-chart.scss';

/**
 * IDS Area Chart Component
 * @type {IdsAreaChart}
 * @inherits IdsLineChart
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

    // Setup default values
    this.DEFAULT_SELECTABLE = false;
  }

  /**
   * Return the chart data for the internal svg
   * @private
   * @returns {object} The markers and areas and lines
   */
  chartTemplate() {
    return `
    <g class="marker-lines">
      ${(this as any).lineMarkers().lines}
    </g>
    <g class="areas">
      ${this.#areas()}
    </g>
    <g class="markers">
      ${(this as any).lineMarkers().markers}
    </g>`;
  }

  /**
   * Generate the svg markup for the area paths
   * @returns {string} The area markup
   * @private
   */
  #areas() {
    let areaHTML = '';

    (this as any).markerData.points.forEach((pointGroup: any, groupIndex: number) => {
      let areas = '';
      pointGroup.forEach((point: any, index: number) => {
        if (pointGroup[index + 1]) {
          areas += `M${point.left},${point.top}L${point.left},${(this as any).markerData.gridBottom}L${pointGroup[index + 1]?.left},${(this as any).markerData.gridBottom}L${pointGroup[index + 1]?.left},${pointGroup[index + 1]?.top}`;
        }
      });
      areaHTML += `<path class="color-${groupIndex + 1}${this.animated ? ' animate' : ''}" part="area" d="${areas}Z" fill="var(${(this as any).color(groupIndex)})"} group-index="${groupIndex}">
      </path>`;
    });
    return areaHTML;
  }

  /**
   * Return chart elements that get selection
   * @returns {Array<SVGElement>} The elements
   */
  get selectionElements(): Array<SVGElement> {
    if (!this.selectable) return [];
    return [
      ...this.container?.querySelectorAll<SVGElement>('.areas [part="area"]') ?? [],
      ...this.container?.querySelectorAll<SVGElement>('.markers [part="marker"]') ?? [],
      ...this.container?.querySelectorAll<SVGElement>('.marker-lines [part="line"]') ?? []
    ];
  }
}

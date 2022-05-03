import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-bar-chart-base';
import styles from './ids-bar-chart.scss';
import type IdsChartData from '../ids-axis-chart/ids-axis-chart';

/**
 * IDS Bar Chart Component
 * @type {IdsBarChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part svg - the outside svg element
 * @part marker - the dots/markers in the chart
 * @part line - the lines in the chart
 * @part bars - each bars element in the chart
 */
@customElement('ids-bar-chart')
@scss(styles)
export default class IdsBarChart extends Base {
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
      attributes.BAR_PERCENTAGE,
      attributes.CATEGORY_PERCENTAGE
    ];
  }

  /**
   * Return the chart data for the internal svg
   * @private
   * @returns {object} The markers and areas and lines
   */
  chartTemplate() {
    return `<g class="bars">
      ${this.#bars()}
    </g>`;
  }

  rendered() {
    this.#adjustVerticalLines();
  }

  /**
   * Adjust the lines to display category sections
   * @private
   */
  #adjustVerticalLines() {
    const lineSection = this.shadowRoot.querySelector('.vertical-lines');
    if (!lineSection) {
      return;
    }

    const lines = lineSection.querySelectorAll('line');
    lines.forEach((line: SVGLineElement, index: number) => {
      if (index === 0) {
        return;
      }
      line.setAttribute('x1', this.sectionWidths.at(index).left);
      line.setAttribute('x2', this.sectionWidths.at(index).left);
    });

    // Add two more
    const left = this.sectionWidths.at(-1).left;
    const line = `<line x1="${left}" x2="${left}" y1="${lines[0].getAttribute('y1')}" y2="${lines[0].getAttribute('y2')}"/>`;
    lineSection.insertAdjacentHTML('beforeend', line);
  }

  /**
   * Generate the svg markup for the area paths
   * @returns {string} The area markup
   * @private
   */
  #bars() {
    let barHTML = '';
    const runningHeight: Record<number, number> = [];
    // Calculate the width of each bar and bar "category" and fit it in even sections
    this.categoryWidth = (this.categoryPercentage * this.sectionWidth);
    this.barWidth = (this.categoryWidth * this.barPercentage);

    // Generate the bars
    this.markerData.points?.forEach((pointGroup: any, groupIndex: number) => {
      pointGroup.forEach((point: IdsChartData, index: number) => {
        const left = this.sectionWidths[index].left
          + ((this.sectionWidths[index].width - this.categoryWidth) / 2)
          + ((this.categoryWidth - this.barWidth) / 2);

        const bottom = this.markerData.gridBottom;
        const height = bottom - point.top;
        let top = point.top;
        if (this.stacked) {
          top = groupIndex > 0 ? top - runningHeight[index] : top;
          runningHeight[index] = (runningHeight[index] || 0) + height;
        }
        const pattern = this.data[groupIndex]?.pattern ? ` fill="url(#${this.data[groupIndex]?.pattern})"` : '';

        barHTML += `<rect class="bar color-${groupIndex + 1}" width="${this.barWidth}" height="${height}" x="${left}" y="${top}"${pattern}>
          ${this.animated ? `
            <animate attributeName="height" from="0" to="${height}" ${this.cubicBezier}></animate>
            <animate attributeName="y" from="${bottom}" to="${top}" ${this.cubicBezier}/>
          </rect>` : ''}
         `;
      });
    });

    return barHTML;
  }

  /**
   * Adjust the default for the x labels
   * @returns {number} value The value to use (in pixels)
   */
  get alignXLabels(): string {
    return this.getAttribute(attributes.ALIGN_X_LABELS) || 'middle';
  }

  /**
   * Percent (0-1) of the available width each bar should be within the category width.
   * 1.0 will take the whole category width and put the bars right next to each other.
   * @param {number} value Percent (0-1)
   */
  set barPercentage(value: number) {
    this.setAttribute(attributes.BAR_PERCENTAGE, value);
    this.rerender();
  }

  get barPercentage(): number {
    const value = this.getAttribute(attributes.BAR_PERCENTAGE);
    if (value) {
      return Number(this.getAttribute(attributes.BAR_PERCENTAGE));
    }
    return 0.5;
  }

  /**
   * Percent (0-1) of the available width each category (group) section.
   * @param {number} value Percent (0-1)
   */
  set categoryPercentage(value: number) {
    this.setAttribute(attributes.CATEGORY_PERCENTAGE, value);
    this.rerender();
  }

  get categoryPercentage(): number {
    const value = this.getAttribute(attributes.CATEGORY_PERCENTAGE);
    if (value) {
      return Number(this.getAttribute(attributes.CATEGORY_PERCENTAGE));
    }
    return 0.9;
  }
}

import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-bar-chart-base';
import styles from './ids-bar-chart.scss';

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
    lines.forEach((line, index) => {
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

    // Calculate the width of each category section (used in other places)
    const sectionWidth = (this.markerData.gridRight - this.markerData.gridLeft) / this.markerData.markerCount;
    let left = this.textWidths.left + this.margins.left + (this.margins.leftInner * 2);
    this.sectionWidths = [];
    for (let index = 0; index < this.markerData.markerCount + 1; index++) {
      this.sectionWidths.push({ left, width: sectionWidth });
      left += sectionWidth;
    }

    // Calculate the width of each bar and bar "category" and fit it in even sections
    this.categoryWidth = (this.categoryPercentage * sectionWidth);
    this.barWidth = (this.categoryWidth * this.barPercentage);

    // Generate the bars
    this.markerData.points.forEach((pointGroup, groupIndex) => {
      pointGroup.forEach((point, index) => {
        const xLeft = this.sectionWidths[index].left
          + ((this.sectionWidths[index].width - this.categoryWidth) / 2)
          + ((this.categoryWidth - this.barWidth) / 2);

        barHTML += `<rect width="${this.barWidth}" height="${this.markerData.gridBottom - point.top}" x="${xLeft}" y="${point.top}" fill="var(${this.color(groupIndex)})">
        ${stringToBool(this.animated) ? `<animate attributeName="y" ${this.cubicBezier} from="${this.markerData.gridBottom + 100}" to="${point.top}"/>` : ''}
         </rect>`;
      });
    });
    return barHTML;
  }

  /**
   * Percent (0-1) of the available width each bar should be within the category width.
   * 1.0 will take the whole category width and put the bars right next to each other.
   * @param {number} value Percent (0-1)
   */
  set barPercentage(value) {
    this.setAttribute(attributes.BAR_PERCENTAGE, value);
    this.rerender();
  }

  get barPercentage() {
    const value = this.getAttribute(attributes.BAR_PERCENTAGE);
    if (value) {
      return stringToBool(this.getAttribute(attributes.BAR_PERCENTAGE));
    }
    return 0.5;
  }

  /**
   * Percent (0-1) of the available width each category (group) section.
   * @param {number} value Percent (0-1)
   */
  set categoryPercentage(value) {
    this.setAttribute(attributes.CATEGORY_PERCENTAGE, value);
    this.rerender();
  }

  get categoryPercentage() {
    const value = this.getAttribute(attributes.CATEGORY_PERCENTAGE);
    if (value) {
      return stringToBool(this.getAttribute(attributes.CATEGORY_PERCENTAGE));
    }
    return 0.9;
  }
}

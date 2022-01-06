import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';

import Base from './ids-line-chart-base';
import IdsDataSource from '../../core/ids-data-source';
import NiceScale from './ids-nice-scale';

import styles from './ids-line-chart.scss';

/**
 * IDS Line Chart Component
 * @type {IdsLineChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the outside container element
 */
@customElement('ids-line-chart')
@scss(styles)
export default class IdsLineChart extends Base {
  constructor() {
    super();
    this.state = {};
  }

  /** Reference to datasource API */
  datasource = new IdsDataSource();

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    this.#attachEventHandlers();
    this.rerender();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.DATA,
      attributes.HEIGHT,
      attributes.MARGINS,
      attributes.MARKER_SIZE,
      attributes.TITLE,
      attributes.WIDTH
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-line-chart-container" part="container">
      <svg class="ids-line-chart" part="chart" width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
      </svg>
    </div>`;
  }

  /**
   * Setup the Event Handling
   * @private
   */
  #attachEventHandlers() {
  }

  /**
   * Redraw the chart
   * @private
   */
  rerender() {
    if (!this.data || this.data.length === 0) {
      // TODO: Add Empty Message
      return;
    }
    this.#calculate();
    this.container.innerHTML = this.#innerTemplate();
  }

  /**
   * Get the min/max points and calculate the scale
   * @private
   */
  #calculate() {
    let groupCount = 0;
    let markerCount = 0;
    this.markerData = {
      markerCount: 0,
      groupCount: 0,
      min: undefined,
      max: 0
    };

    // Get the Min and Max and Totals in one sequence
    this.data?.forEach((group) => {
      groupCount++;
      markerCount = 0;

      group.data?.forEach((data) => {
        if (data.value > this.markerData.max) {
          this.markerData.max = data.value;
        }
        if (data.value < this.markerData.min) {
          this.markerData.min = data.value;
        }
        if (this.markerData.min === undefined) {
          this.markerData.min = data.value;
        }
        markerCount++;
      });

      if (markerCount > this.markerData.markerCount) {
        this.markerData.markerCount = markerCount;
      }
      this.markerData.groupCount = groupCount;
    });

    // Calculate a Nice Scale
    const scale = new NiceScale(this.yAxisMin, this.markerData.max);
    this.markerData.scale = scale;
    this.markerData.scaleY = [];
    for (let i = scale.niceMin; i <= scale.niceMax; i += scale.tickSpacing) {
      this.markerData.scaleY.push(i);
    }
  }

  /**
   * Return the insider part of the SVG
   * @private
   * @returns {string} The SVG markup
   */
  #innerTemplate() {
    return `
    <title id="title">${this.title}</title>
    <g class="grid x-lines">
      ${this.#xLines()}
    </g>
    <g class="grid y-lines">
      ${this.#yLines()}
    </g>
    <g class="markers" data-setname="Component One">
      ${this.#markers().markers}
    </g>
    <g class="marker-lines">
      ${this.#markers().lines}
    </g>
    <g class="areas">
      ${this.#areas()}
    </g>
    <g class="labels x-labels">
      ${this.#xLabels()}
    </g>
    <g class="labels y-labels">
      ${this.#yLabels()}
    </g>
    `;
  }

  /**
   * Return the y line data for the svg
   * @private
   * @returns {string} The y line markup
   */
  #yLines() {
    if (!this.markerData) {
      return '';
    }

    let lineHtml = '';
    let top = 0;
    const left = this.textWidths.left + this.margins.left + this.margins.leftInner;
    const width = this.width - this.margins.right;

    this.markerData.scaleY.forEach(() => {
      top = top === 0 ? this.margins.top + this.margins.topInner : top + this.#yLineGap();
      lineHtml += `<line x1="${left}" x2="${width}" y1="${top}" y2="${top}"></line>`;
    });

    return lineHtml;
  }

  /**
   * Return the x line data for the svg
   * @private
   * @returns {string} The x line markup
   */
  #xLines() {
    if (!this.markerData) {
      return '';
    }

    let lineHtml = '';
    let left = this.textWidths.left + this.margins.left + (this.margins.leftInner * 2);
    const height = this.height - this.margins.bottom - this.textWidths.bottom;

    for (let index = 0; index < this.markerData.markerCount; index++) {
      left = index === 0 ? left : left + this.#xLineGap();
      lineHtml += `<line x1="${left}" x2="${left}" y1="${this.margins.top}" y2="${height}"></line>`;
    }
    return lineHtml;
  }

  /**
   * Return the y label data for the svg
   * @private
   * @returns {string} The y label markup
   */
  #yLabels() {
    if (!this.markerData) {
      return '';
    }

    let lineHtml = '';
    let top = 0;
    const textHeight = 3; // 3 is the half height of the text - we could figure this out based on font size?
    const left = this.textWidths.left + this.margins.left;

    this.markerData.scaleY.slice().reverse().forEach((value) => {
      top = top === 0 ? this.margins.top + textHeight : top + this.#yLineGap();
      lineHtml += `<text x="${left}" y="${top}">${value}</text>`;
    });

    return lineHtml;
  }

  /**
   * Return the x label data for the svg
   * @private
   * @returns {string} The x label markup
   */
  #xLabels() {
    if (!this.markerData) {
      return '';
    }
    let labelHtml = '';
    let left = this.textWidths.left + this.margins.left + (this.margins.leftInner * 2);
    const height = this.height - this.margins.top - this.margins.bottom + this.margins.bottomInner;

    for (let index = 0; index <= this.markerData.markerCount; index++) {
      left = index === 0 ? left : left + this.#xLineGap();
      labelHtml += `<text x="${left}" y="${height}">${this.data[0].data[index]?.name}</text>`;
    }
    return labelHtml;
  }

  /**
   * Return the measurements for the gap on the y axis
   * @private
   * @returns {string} The y gap calculation
   */
  #yLineGap() {
    return ((
      this.height - this.margins.top - this.margins.bottom - this.textWidths.bottom - this.textWidths.top)
      / (this.markerData.scaleY.length - 1)
    );
  }

  /**
   * Return the measurements for the gap between points on the x axis
   * @private
   * @returns {string} The x gap calculation
   */
  #xLineGap() {
    const left = this.textWidths.left + this.margins.left + this.margins.leftInner;
    const width = this.width - this.margins.right - (this.margins.rightInner * 2);

    return ((width - left) / (this.markerData.markerCount - 1));
  }

  /**
   * Return the marker data for the svg
   * @private
   * @returns {object} The markers and lines
   */
  #markers() {
    if (!this.markerData) {
      return '';
    }

    this.markerData.points = [];
    let markerHTML = '';
    let points = '';

    let left = this.textWidths.left + this.margins.left + (this.margins.leftInner * 2);

    for (let index = 0; index < this.markerData.markerCount; index++) {
      left = index === 0 ? left : left + this.#xLineGap();

      const value = this.data[0].data[index]?.value || 0;
      this.markerData.gridTop = this.margins.top + this.textWidths.top;
      this.markerData.gridBottom = this.height - this.margins.bottom - this.textWidths.bottom;

      // y = (value - min) / (max - min)
      const cyPerc = ((value - this.markerData.scale.niceMin)
        / (this.markerData.scale.niceMax - this.markerData.scale.niceMin));
      const cyHeight = (cyPerc * (this.markerData.gridBottom - this.markerData.gridTop));
      points += `${left},${this.markerData.gridBottom - cyHeight} `;
      this.markerData.points.push({ left, top: this.markerData.gridBottom - cyHeight, value });
      markerHTML += `<circle cx="${left}" cy="${this.markerData.gridBottom - cyHeight}" data-value="${value}" r="${this.markerSize}">${value}</circle>`;
    }
    return {
      markers: markerHTML,
      lines: `<polyline class="data-line" points="${points}"/>`
    };
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

  /**
   * Set the line chart title
   * @param {string} value The title value
   */
  set title(value) {
    this.setAttribute(attributes.TITLE, value);
    if (this.container?.querySelector(attributes.TITLE)) {
      this.container.querySelector(attributes.TITLE).textContent = value;
    }
  }

  get title() { return this.getAttribute(attributes.TITLE) || ''; }

  /**
   * Set the chart height
   * @param {number} value The height value
   */
  set height(value) {
    this.setAttribute(attributes.HEIGHT, value);
    this.container.setAttribute(attributes.HEIGHT, value);
    this.rerender();
  }

  get height() { return parseFloat(this.getAttribute(attributes.HEIGHT)) || 500; }

  /**
   * Set the chart width
   * @param {number} value The width value
   */
  set width(value) {
    this.setAttribute(attributes.WIDTH, value);
    this.container.setAttribute(attributes.WIDTH, value);
    this.rerender();
  }

  get width() { return parseFloat(this.getAttribute(attributes.WIDTH)) || 800; }

  /**
   * Set the chart margin (all 4 sides)
   * @param {object} value The margin values
   */
  set margins(value) {
    this.state.margins = value;
    this.rerender();
  }

  get margins() {
    return this.state?.margins || {
      left: 16,
      right: 16,
      top: 16,
      bottom: 16,
      leftInner: 8,
      rightInner: 8,
      topInner: 0,
      bottomInner: 12
    };
  }

  /**
   * Set the width the text labels/axes take up on each side.
   * @param {object} value The margin values
   */
  set textWidths(value) {
    this.state.textWidths = value;
    this.rerender();
  }

  get textWidths() {
    return this.state.textWidths || {
      left: 68, right: 0, top: 0, bottom: 24
    };
  }

  /**
   * Set the data array of the chart
   * @param {Array} value The array to use
   */
  set data(value) {
    if (value) {
      this.datasource.data = value;
      this.rerender();
      return;
    }

    this.datasource.data = null;
  }

  get data() { return this?.datasource?.data || []; }

  /**
   * Set the size of the markers (aka dots/ticks) in the chart
   * @param {number} value The value to use (in pixels)
   */
  set markerSize(value) {
    this.setAttribute(attributes.MARKER_SIZE, value);
    this.rerender();
  }

  get markerSize() { return parseFloat(this.getAttribute(attributes.MARKER_SIZE)) || 5; }

  /**
   * Set the minimum value on the y axis
   * @param {number} value The value to use (integer)
   */
  set yAxisMin(value) {
    this.setAttribute(attributes.Y_AXIS_MIN, value);
    this.rerender();
  }

  get yAxisMin() { return parseInt(this.getAttribute(attributes.Y_AXIS_MIN)) || 0; }
}

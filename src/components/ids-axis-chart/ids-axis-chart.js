import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-axis-chart-base';
import IdsDataSource from '../../core/ids-data-source';
import IdsEmptyMessage from '../ids-empty-message/ids-empty-message';

import NiceScale from './ids-nice-scale';
import { QUALITATIVE_COLORS } from './ids-chart-colors';

import styles from './ids-axis-chart.scss';

/**
 * IDS Axis Chart Component
 * @type {IdsAxisChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the outside container element
 * @part chart - the svg outer element
 */
@customElement('ids-axis-chart')
@scss(styles)
export default class IdsAxisChart extends Base {
  constructor() {
    super();

    // Setup the default values
    this.state = {};
    this.state.yAxisFormatter = {
      notation: 'compact',
      compactDisplay: 'short'
    };
  }

  /** Reference to datasource API */
  datasource = new IdsDataSource();

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    this.svg = this.shadowRoot.querySelector('svg');
    this.emptyMessage = this.querySelector('ids-empty-message') || this.shadowRoot.querySelector('ids-empty-message');
    this.legend = this.shadowRoot.querySelector('[name="legend"]');
    this.#attachEventHandlers();
    this.rerender();
    super.connectedCallback?.();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DATA,
      attributes.HEIGHT,
      attributes.MARGINS,
      attributes.SHOW_HORIZONTAL_GRID_LINES,
      attributes.SHOW_VERTICAL_GRID_LINES,
      attributes.TITLE,
      attributes.WIDTH
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-chart-container" part="container">
      <svg class="ids-axis-chart" part="chart" width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
      </svg>
      <slot name="legend">
      </slot>
      <slot name="empty-message">
        <ids-empty-message icon="empty-no-data" hidden>
          <ids-text type="h2" font-size="20" label="true" slot="label">${this.locale?.translate('NoData') || 'No Data Available'}</ids-text>
        </ids-empty-message>
      </slot>
    </div>`;
  }

  /**
   * Setup the Event Handling
   * @private
   */
  #attachEventHandlers() {
    this.onEvent('localechange.about-container', this.closest('ids-container'), async () => {
      this.rerender();
    });

    this.onEvent('languagechange.about-container', this.closest('ids-container'), async () => {
      this.shadowRoot.querySelector('ids-empty-message ids-text').textContent = this.locale?.translate('NoData');
    });
  }

  /**
   * Redraw the chart
   * @private
   */
  rerender() {
    if (this.data && this.data.length === 0 && this.initialized) {
      this.#showEmptyMessage();
      return;
    }
    this.#calculate();
    this.svg.innerHTML = this.#axisTemplate();
    this.legend.innerHTML = this.legendTemplate();
    this.triggerEvent('rendered', this, { svg: this.svg, data: this.data, markerData: this.markerData });
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

    // Calculate the Data Points / Locations
    this.markerData.points = [];
    this.data.forEach((dataPoints) => {
      let left = this.textWidths.left + this.margins.left + (this.margins.leftInner * 2);
      const points = [];
      for (let index = 0; index < this.markerData.markerCount; index++) {
        left = index === 0 ? left : left + this.#xLineGap();

        const value = dataPoints.data[index]?.value || 0;
        this.markerData.gridTop = this.margins.top + this.textWidths.top;
        this.markerData.gridBottom = this.height - this.margins.bottom - this.textWidths.bottom;

        // y = (value - min) / (max - min)
        const cyPerc = ((value - this.markerData.scale.niceMin)
          / (this.markerData.scale.niceMax - this.markerData.scale.niceMin));
        const cyHeight = (cyPerc * (this.markerData.gridBottom - this.markerData.gridTop));
        points.push({ left, top: this.markerData.gridBottom - cyHeight, value });
      }
      this.markerData.points.push(points);
    });
  }

  /**
   * Return the insider part of the SVG
   * @private
   * @returns {string} The SVG markup
   */
  #axisTemplate() {
    return `
    <title id="title">${this.title}</title>
    <g class="grid vertical-lines${!this.showVerticalGridLines ? ' hidden' : '' }">
      ${this.#verticalLines()}
    </g>
    <g class="grid horizontal-lines${!this.showHorizontalGridLines ? ' hidden' : '' }">
      ${this.#horizonatalLines()}
    </g>
    ${this.chartTemplate()}
    <g class="labels x-labels">
      ${this.#xLabels()}
    </g>
    <g class="labels y-labels">
      ${this.#yLabels()}
    </g>
    `;
  }

  /**
   * Overridable method to draw the markers
   * @returns {string} The SVG Marker Markup
   */
  chartTemplate() {
    return '';
  }

  /**
   * Return the y line data for the svg
   * @private
   * @returns {string} The y line markup
   */
  #horizonatalLines() {
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
  #verticalLines() {
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
    let lineHtml = '';
    let top = 0;
    // 3 is the half height of the text - could figure this out based on font size?
    const textHeight = 3;
    const left = this.textWidths.left + this.margins.left;

    this.markerData.scaleY.slice().reverse().forEach((value) => {
      top = top === 0 ? this.margins.top + textHeight : top + this.#yLineGap();
      lineHtml += `<text x="${left}" y="${top}">${this.#formatYLabel(value)}</text>`;
    });

    return lineHtml;
  }

  /**
   * Format the value for the x label in a variety of ways
   * @param {string} value The value to format value
   * @returns {string} The formatted value
   * @private
   */
  #formatXLabel(value) {
    if (!this.xAxisFormatter) {
      return value;
    }

    if (typeof this.xAxisFormatter === 'function') {
      return this.xAxisFormatter(value, this.data, this);
    }
  }

  /**
   * Format the value for the y label in a variety of ways
   * @param {string} value The value to format value
   * @returns {string} The formatted value
   * @private
   */
  #formatYLabel(value) {
    if (!this.yAxisFormatter) {
      return value;
    }

    if (typeof this.yAxisFormatter === 'function') {
      return this.yAxisFormatter(value, this.data, this);
    }
    return new Intl.NumberFormat(this.locale?.locale?.name || 'en', this.yAxisFormatter).format(value);
  }

  /**
   * Return true if there is at least one data point
   * @returns {boolean} True if there is at least one data point
   */
  get hasData() {
    return !this.markerData || !this.data[0]?.data;
  }

  /**
   * Return the x label data for the svg
   * @private
   * @returns {string} The x label markup
   */
  #xLabels() {
    if (this.hasData) {
      return '';
    }
    let labelHtml = '';
    let left = this.textWidths.left + this.margins.left + (this.margins.leftInner * 2);
    const height = this.height - this.margins.top - this.margins.bottom + this.margins.bottomInner;

    for (let index = 0; index < this.markerData.markerCount; index++) {
      left = index === 0 ? left : left + this.#xLineGap();
      labelHtml += `<text x="${left}" y="${height}">${this.#formatXLabel(this.data[0]?.data[index]?.name)}</text>`;
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
   * Show an empty message with settings configuration
   * @private
   */
  #showEmptyMessage() {
    this.svg.classList.add('hidden');
    this.emptyMessage.removeAttribute('hidden');
  }

  /**
   * Hide the empty message
   * @private
   */
  #hideEmptyMessage() {
    this.svg.classList.remove('hidden');
    this.emptyMessage.setAttribute('hidden', 'true');
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
    this.svg.setAttribute(attributes.HEIGHT, value);
    this.rerender();
  }

  get height() { return parseFloat(this.getAttribute(attributes.HEIGHT)) || 500; }

  /**
   * Set the chart width
   * @param {number} value The width value
   */
  set width(value) {
    this.setAttribute(attributes.WIDTH, value);
    this.svg.setAttribute(attributes.WIDTH, value);
    this.#setContainerWidth(value);
    this.rerender();
  }

  get width() { return parseFloat(this.getAttribute(attributes.WIDTH)) || 800; }

  /**
   * Set the container width (for correct legend and sizing)
   * @param {number} value The width value
   */
  #setContainerWidth(value) {
    const container = this.container;
    if (container.classList.contains('ids-chart-container')) {
      container.style.width = `${value}px`;
      return;
    }
    container.parentNode.style.width = `${value}px`;
  }

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
      right: this.legendPlacement === 'right' ? 150 : 16, // TODO: Calculate this
      top: 16,
      bottom: 12,
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
      left: this.legendPlacement === 'left' ? 34 : 68, // TODO: Calculate this
      right: 0,
      top: 0,
      bottom: 24
    };
  }

  /**
   * Set the data array of the chart
   * @param {Array} value The array to use
   */
  set data(value) {
    this.initialized = true;
    if (value) {
      this.#hideEmptyMessage();
      this.datasource.data = value;
      this.rerender();
      return;
    }
    this.datasource.data = null;
  }

  get data() { return this?.datasource?.data || undefined; }

  /**
   * Set the minimum value on the y axis
   * @param {number} value The value to use
   */
  set yAxisMin(value) {
    this.setAttribute(attributes.Y_AXIS_MIN, value);
    this.rerender();
  }

  get yAxisMin() { return parseInt(this.getAttribute(attributes.Y_AXIS_MIN)) || 0; }

  /**
   * Show the vertical axis grid lines
   * @param {number} value True or false to show the grid lines
   */
  set showVerticalGridLines(value) {
    this.setAttribute(attributes.SHOW_VERTICAL_GRID_LINES, value);
    this.rerender();
  }

  get showVerticalGridLines() {
    const value = this.getAttribute(attributes.SHOW_VERTICAL_GRID_LINES);
    if (value) {
      return stringToBool(this.getAttribute(attributes.SHOW_VERTICAL_GRID_LINES));
    }
    return false;
  }

  /**
   * Show the horizontal axis grid lines
   * @param {boolean} value True or false to show the grid lines
   */
  set showHorizontalGridLines(value) {
    this.setAttribute(attributes.SHOW_HORIZONTAL_GRID_LINES, value);
    this.rerender();
  }

  get showHorizontalGridLines() {
    const value = this.getAttribute(attributes.SHOW_HORIZONTAL_GRID_LINES);
    if (value) {
      return stringToBool(this.getAttribute(attributes.SHOW_HORIZONTAL_GRID_LINES));
    }
    return true;
  }

  /**
   * Utility function to get the colors series being used in this chart
   * @returns {Array} The colors being used on this instance.
   */
  get colors() {
    return QUALITATIVE_COLORS;
  }

  /**
   * Get the color to use based on the index
   * @param {number} index The current index
   * @returns {number} The value to use (integer)
   * @private
   */
  color(index) {
    // TODO: Figure out passing sequential and custom colors
    return this.colors[index];
  }

  /**
   * Set the format on the x axis items
   * @param {Function} value A string with the formatting routine or a function for more customization.
   */
  set xAxisFormatter(value) {
    this.state.xAxisFormatter = value;
    this.rerender();
  }

  get xAxisFormatter() {
    return this.state.xAxisFormatter;
  }

  /**
   * Set the format on the y axis items
   * @param {object|Function} value A string with the formatting routine or a function for more customization.
   */
  set yAxisFormatter(value) {
    this.state.yAxisFormatter = value;
    this.rerender();
  }

  get yAxisFormatter() {
    return this.state.yAxisFormatter;
  }
}

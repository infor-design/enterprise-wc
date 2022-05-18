import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { injectTemplate, stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { QUALITATIVE_COLORS } from '../ids-axis-chart/ids-chart-colors';
import Base from './ids-pie-chart-base';
import IdsDataSource from '../../core/ids-data-source';

import '../ids-tooltip/ids-tooltip';
import '../ids-empty-message/ids-empty-message';

import styles from './ids-pie-chart.scss';

type IdsPieChartData = {
  name?: string,
  value?: number,
  color?: string,
  data?: IdsPieChartData[],
  tooltip?: string
};

/**
 * IDS Pie Chart Component
 * @type {IdsPieChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the outside container element
 * @part chart - the svg outer element
 */
@customElement('ids-pie-chart')
@scss(styles)
export default class IdsPieChart extends Base {
  constructor() {
    super();

    // Setup the default values
    this.state = {};
    this.legendPlacement = 'right';
  }

  /** Reference to datasource API */
  datasource = new IdsDataSource();

  /**
   * Invoked each time the custom element is appended
   */
  connectedCallback(): void {
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
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.ANIMATED,
      attributes.DATA,
      attributes.DONUT,
      attributes.DONUT_TEXT,
      attributes.HEIGHT,
      attributes.TITLE,
      attributes.WIDTH
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-chart-container" part="container">
      <svg class="ids-pie-chart" part="chart" width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      </svg>
      <slot name="legend">
      </slot>
      <slot name="empty-message">
        <ids-empty-message icon="empty-no-data" hidden>
          <ids-text type="h2" font-size="20" label="true" slot="label">${this.locale?.translate('NoData') || 'No Data Available'}</ids-text>
        </ids-empty-message>
      </slot>
      <slot name="tooltip">
        <ids-tooltip id="tooltip"></ids-tooltip>
      </slot>
    </div>`;
  }

  /**
   * Setup the Event Handling
   * @private
   */
  #attachEventHandlers(): void {
    this.onEvent('localechange.pie', this.closest('ids-container'), async () => {
      this.rerender();
      this.shadowRoot.querySelector('ids-empty-message ids-text').textContent = this.locale?.translate('NoData');
    });

    this.onEvent('languagechange.pie', this.closest('ids-container'), async () => {
      this.shadowRoot.querySelector('ids-empty-message ids-text').textContent = this.locale?.translate('NoData');
    });
  }

  /**
   * Redraw the chart
   * @private
   */
  rerender(): void {
    if (!this.initialized) {
      return;
    }

    if (this.data && this.data.length === 0 && this.initialized) {
      this.#showEmptyMessage();
      return;
    }

    this.#calculate();
    this.#addColorVariables();
    this.legend.innerHTML = this.legendTemplate();
    this.svg.innerHTML = this.chartTemplate();

    // Completed Event and Callback
    this.triggerEvent('rendered', this, { svg: this.svg, data: this.data, markerData: this.markerData });
    if (this.rendered) {
      this?.rendered();
    }
  }

  /**
   * Get the percentages both rounded and total
   * @private
   */
  #calculate(): void {
    this.totals = 0;
    this.percents = [];
    const data = this.data[0].data;

    data?.forEach((element) => {
      this.totals += element.value || 0;
    });
    data?.forEach((element) => {
      const total = ((element.value || 0) / (this.totals)) * 100;
      this.percents.push({ total, rounded: Math.round(total) });
    });
  }

  /**
   * Calculate the legend markup and return it
   * @param {string} setting The setting to use between name,shortName and abbreviatedName
   * @returns {string} The legend markup.
   */
  legendTemplate(setting = 'name') {
    let legend = `<div class="chart-legend">`;
    const count = this.data[0].data?.length || 0;

    this.data[0].data?.forEach((slice: any, index: number) => {
      const colorClass = `color-${index + 1}`;
      let legendValue = `${slice[setting] ? slice[setting] : slice.name} (${this.percents[index].rounded}${this.locale.numbers().percentSign || '%'})`;
      if (typeof this.legendFormatter === 'function') {
        legendValue = this.legendFormatter(slice, this.percents[index], this);
      }
      legend += `<a${count > 1 ? ' href="#"' : ' aria-hidden="true"'}>
        <div class="swatch ${colorClass}"></div>
        ${legendValue}
        </a>`;
    });
    legend += `</div>`;
    return legend;
  }

  /**
   * Set the format on the legend items
   * @param {Function} value A function for legend customization
   */
  set legendFormatter(value: any) {
    this.state.legendFormatter = value;
    this.rerender();
  }

  get legendFormatter(): any {
    return this.state.legendFormatter;
  }

  /**
   * Add colors in a style sheet to the root so the css variables can be used
   * @private
   */
  #addColorVariables(): void {
    let colorSheet = '';
    if (!this.shadowRoot.styleSheets) {
      return;
    }
    const data = this.data[0].data;
    data?.forEach((group: IdsPieChartData, index: number) => {
      const slice = (group as any);
      colorSheet += `--ids-chart-color-${index + 1}: ${slice.color || `var(${this.colors[index]})`} !important;`;
    });

    const styleSheet = this.shadowRoot.styleSheets[0];
    styleSheet.insertRule(`:host {
      ${colorSheet}
    }`);
  }

  /**
   * Overridable method to draw the markers
   * @returns {string} The SVG Marker Markup
   */
  chartTemplate(): string {
    let rotate = 0;
    let circles = '';

    this.percents.forEach((percent: any, index: number) => {
      const deg = percent.total * 0.3142;

      circles += `<g role="listitem">
        <text class="audible">${this.data[0].data?.[index].name}  ${percent.rounded}%</text>
        <circle class="slice" r="5" cx="10" cy="10" stroke="${this.color(index)}" percent="${percent.total}" value="${percent.rounded}" index="${index}" stroke-dasharray="${deg} 31.42" transform="rotate(${rotate} 10 10)"></circle>
        </g>`;
      rotate += (deg / 31.42) * 360;
    });

    return `<title></title>
      <title>${this.title}</title>
      <g transform="rotate(-90 10 10)" stroke-width="10" role="list">
        ${circles}
        <circle class="donut-hole" r="${!this.donut ? 0 : 6.5}" cx="10" cy="10" fill="white" aria-hidden="true"></circle>
      </g>
      <text class="donut-text" x="50%" y="50%" dy=".3em">${this.donutText}</text>
      `;
  }

  /**
   * Child Chart elements that get tooltips
   * @private
   * @returns {Array<SVGElement>} The elements
   */
  tooltipElements(): Array<SVGElement> {
    return this.container.querySelectorAll('circle[percent]');
  }

  /**
   * Overridable method to draw to get the tooltip template
   * @returns {string} The tooltip template
   */
  tooltipTemplate(): string {
    // eslint-disable-next-line no-template-curly-in-string
    return '<b>${label}</b> ${value}';
  }

  /**
   * Setup handlers on tooltip elements
   */
  attachTooltipEvents(): void {
    // Need one event per bar due to the nature of the events for tooltip
    this.tooltipElements().forEach((element: SVGElement) => {
      this.onEvent('hoverend', element, async () => {
        const tooltip = this.container.querySelector('ids-tooltip');
        tooltip.innerHTML = this.#tooltipContent(element);
        tooltip.target = element;
        tooltip.placement = 'top';
        tooltip.visible = true;
      });
    });
  }

  /**
   * Return the data for a tooltip accessible by index
   * @param {number} index the data groupIndex
   * @param {number} groupIndex the data index
   * @returns {Array<string>} The elements
   */
  tooltipData(index: number, groupIndex = 0) {
    const data = (this.data as any)[groupIndex]?.data;

    return {
      label: data[index]?.name || (this.data as any)[0].data[index].name,
      value: data[index]?.value || 0,
      tooltip: data[index]?.tooltip
    };
  }

  /**
   * Return the tooltip content
   * @param {SVGElement} elem The svg element we will inspect for content
   * @private
   * @returns {string} The tooltip content
   */
  #tooltipContent(elem: SVGElement): string {
    const group = Number(elem.getAttribute('group-index'));
    const index = Number(elem.getAttribute('index'));
    const data = this.tooltipData(index, group);

    if (data.tooltip) {
      // eslint-disable-next-line no-template-curly-in-string
      return data.tooltip.replace('${value}', data.value).replace('${label}', data.label);
    }
    return injectTemplate(this.tooltipTemplate(), data);
  }

  /**
   * Show an empty message with settings configuration
   * @private
   */
  #showEmptyMessage() {
    this.svg.classList.add('hidden');
    this.emptyMessage.style.height = `${this.height}px`;
    this.emptyMessage.removeAttribute('hidden');
  }

  /**
   * Hide the empty message
   * @private
   */
  #hideEmptyMessage() {
    this.svg.classList.remove('hidden');
    this.emptyMessage.style.height = '';
    this.emptyMessage.setAttribute('hidden', '');
  }

  /**
   * Sets the chart title
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
   * Sets the chart to donut chart
   * @param {boolean} value True to make a donut chart
   */
  set donut(value) {
    const isDonut = stringToBool(value);
    this.setAttribute(attributes.DONUT, value);
    this.container.querySelector('.donut-hole')?.setAttribute('r', !isDonut ? '0' : '6.5');
  }

  get donut() { return stringToBool(this.getAttribute(attributes.DONUT)) || false; }

  /**
   * Sets the charts middle text
   * @param {string} value The text to use
   */
  set donutText(value) {
    this.setAttribute(attributes.DONUT_TEXT, value);
    this.container.querySelector('.donut-text')?.innerHTML(value);
  }

  get donutText() { return this.getAttribute(attributes.DONUT_TEXT) || ''; }

  /**
   * The width of the chart (in pixels) or 'inherit' from the parent
   * @param {number | string} value The height value
   */
  set height(value: number | string) {
    this.setAttribute(attributes.HEIGHT, value);
    this.svg.setAttribute(attributes.HEIGHT, value);
    this.rerender();
  }

  get height() { return parseFloat(this.getAttribute(attributes.HEIGHT)) || 400; }

  /**
   * The width of the chart (in pixels) or 'inherit' from the parent
   * @param {number | string} value The width value
   */
  set width(value: number | string) {
    this.setAttribute(attributes.WIDTH, value);
    this.svg.setAttribute(attributes.WIDTH, value);
    this.rerender();
  }

  get width() { return parseFloat(this.getAttribute(attributes.WIDTH)) || 400; }

  /**
   * Set the data array of the chart
   * @param {Array<unknown>} value The array to use
   */
  set data(value: Array<IdsPieChartData>) {
    if (value) {
      this.#hideEmptyMessage();
      this.datasource.data = value as any;
      this.initialized = true;
      this.rerender();
      this.reanimate();
      return;
    }
    this.datasource.data = [];
  }

  get data(): Array<IdsPieChartData> {
    return this?.datasource?.data || [];
  }

  /**
   * Utility function to get the colors series being used in this chart
   * @returns {Array} The colors being used on this instance.
   */
  get colors(): Array<string> {
    return QUALITATIVE_COLORS;
  }

  /**
   * Get the color to use based on the index for sequential and custom colors
   * @param {number} index The current index
   * @returns {string} The color to use
   * @private
   */
  color(index: number): string {
    return `var(${this.data[0].data?.[index].color ? `color-${index + 1}` : this.colors[index]})`;
  }

  /**
   * Reanimate the chart
   */
  reanimate(): void {
    if (!this.animated || !this.initialized) {
      return;
    }

    requestAnimationFrame(() => {
      this.container.querySelectorAll('animate').forEach((elem: SVGAnimationElement) => elem.beginElement());
      this.container.querySelectorAll('animateTransform').forEach((elem: SVGAnimationElement) => elem.beginElement());
    });
  }

  /**
   * Set the animation on/off
   * @param {boolean} value True if animation is on
   */
  set animated(value: boolean) {
    const animated = stringToBool(this.animated);
    this.setAttribute(attributes.ANIMATED, value);
    this.rerender();

    if (animated) {
      this.reanimate();
    }
  }

  get animated(): boolean {
    const animated = this.getAttribute(attributes.ANIMATED);
    if (animated === null) {
      return true;
    }
    return stringToBool(this.getAttribute(attributes.ANIMATED));
  }
}

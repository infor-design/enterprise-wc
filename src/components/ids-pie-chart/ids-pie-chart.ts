import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { injectTemplate, stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { QUALITATIVE_COLORS } from '../ids-axis-chart/ids-chart-colors';
import { patternData } from '../ids-axis-chart/ids-pattern-data';

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
  tooltip?: string,
  pattern?: string,
  patternColor?: string,
};

/**
 * IDS Pie Chart Component
 * @type {IdsPieChart}
 * @inherits IdsElement
 * @mixes IdsChartLegendMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the outside container element
 * @part chart - the svg outer element
 */
@customElement('ids-pie-chart')
@scss(styles)
export default class IdsPieChart extends Base {
  constructor() {
    super();

    // Setup default values
    this.state = {};
    this.legendPlacement = 'right';
  }

  /** Reference to datasource API */
  datasource = new IdsDataSource();

  /**
   * Invoked each time the custom element is connected to the DOM.
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
   * Invoked after rendering
   */
  rendered(): void {
    this.#attachTooltipEvents();
  }

  /**
   * Invoked when redrawing the chart
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
   * Return the attributes handled as getters/setters
   * @returns {Array} the list of attributes
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.ANIMATED,
      attributes.DATA,
      attributes.DONUT,
      attributes.DONUT_TEXT,
      attributes.HEIGHT,
      attributes.SUPPRESS_TOOLTIPS,
      attributes.TITLE,
      attributes.WIDTH
    ];
  }

  /**
   * Create the template chart
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-chart-container" part="container">
      <svg class="ids-pie-chart" part="chart"${this.width ? ` width="${this.width}"` : ''}${this.height ? ` height="${this.height}"` : ''} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.viewBoxSize} ${this.viewBoxSize}">
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
   * Setup event handling
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
   * Get the percentages as rounded and total
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
      const colorClass = slice.pattern ? '' : ` color-${index + 1}`;
      const patternSvg = slice.pattern ? `<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><rect width="12" height="12" fill="url(#${slice.pattern})"></rect></svg>` : '';

      let legendValue = `${slice[setting] ? slice[setting] : slice.name} (${this.percents[index].rounded}${this.locale.numbers().percentSign || '%'})`;
      if (typeof this.legendFormatter === 'function') {
        legendValue = this.legendFormatter(slice, this.percents[index], this);
      }
      legend += `<a${count > 1 ? ' href="#"' : ' aria-hidden="true"'}>
        <div class="swatch${colorClass}">${patternSvg}</div>
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
   * Return the inner chart template
   * @returns {string} The pie inner template
   */
  chartTemplate(): string {
    let circles = '';
    let filled = 0;
    const radius = this.donut ? 40 : 25;
    const strokeWidth = this.donut ? 15 : 50;
    const cx = this.viewBoxSize / 2;
    const cy = this.viewBoxSize / 2;

    this.percents.forEach((percent: any, index: number) => {
      const startAngle = -90;
      const dashArray = 2 * Math.PI * radius;
      const dashOffset = dashArray - ((dashArray * percent.total) / 100);
      const angle = ((filled * 360) / 100) + startAngle;
      const data = this.data[0].data;
      const colorClass = data?.[index].pattern ? '' : ` color-${index + 1}`;
      const stroke = data?.[index].pattern ? `url(#${data?.[index].pattern})` : this.color(index);

      circles += `<g role="listitem">
        <circle class="slice${colorClass}" part="circle" stroke="${stroke}" stroke-width="${strokeWidth}" index="${index}" percent="${percent.total}" r="${radius}" cx="${cx}" cy="${cy}" stroke-dasharray="${dashArray}" stroke-dashoffset="${this.animated ? dashArray : dashOffset}" transform="rotate(${angle} ${cx} ${cy})"></circle>
        <text class="audible">${data?.[index].name}  ${percent.rounded}%</text>
        </g>`;
      filled += percent.total;

      if (this.animated) {
        // Kick Off an Animation
        const animationDuration = 380;
        const currentDuration = (animationDuration * percent.total) / 100;
        const delay = (animationDuration * filled) / 100;

        requestAnimationFrame(() => {
          this.container.querySelector(`circle.slice[index="${index}"]`).style.transition = `stroke-dashoffset ${currentDuration}ms cubic-bezier(0.17, 0.04, 0.03, 0.94) ${delay}ms`;
          requestAnimationFrame(() => {
            this.container.querySelector(`circle.slice[index="${index}"]`).setAttribute('stroke-dashoffset', dashOffset);
          });
        });
      }
    });

    return `<title></title>
      <title>${this.title}</title>
      <defs>
        ${this.#patterns()}
      </defs>
      <g role="list">
        ${circles}
      </g>
      <circle class="donut-hole" r="${radius}" cx="${cx}" cy="${cy}" fill="transparent" stroke-width="0"></circle>
      <text class="donut-text" x="50%" y="50%" dy=".3em">${this.donutText}</text>
      `;
  }

  /**
   * Return the definition markup for svg patterns
   * @private
   * @returns {string} The string with all the patterns being used
   */
  #patterns(): string {
    let patternHtml = '';
    this.data[0].data?.forEach((slice: any, i: number) => {
      let pattern = patternData[slice.pattern];
      if (pattern) {
        const color = `${this.color(i)}` || '#000000';
        pattern = pattern.replace('fill="#000000"', `fill="${color}"`);
        patternHtml += pattern;
      }
    });
    return patternHtml;
  }

  /**
   * Viewbox size (square)
   * @returns {number} the viewbox width/height
   */
  get viewBoxSize(): number {
    return 100;
  }

  /**
   * Return chart elements that get tooltips
   * @private
   * @returns {Array<SVGElement>} The elements
   */
  tooltipElements(): Array<SVGElement> {
    return this.container.querySelectorAll('.slice');
  }

  /**
   * Return the tooltip template
   * @returns {string} The tooltip template
   */
  tooltipTemplate(): string {
    // eslint-disable-next-line no-template-curly-in-string
    return '<b>${label}</b> ${value}';
  }

  /**
   * Setup handlers on tooltip elements
   */
  #attachTooltipEvents(): void {
    if (this.suppressTooltips) {
      return;
    }

    // Need one event per bar due to the nature of the events for tooltip
    this.tooltipElements().forEach((element: SVGElement) => {
      this.onEvent('hoverend', element, async (e: MouseEvent) => {
        const tooltip = this.container.parentElement.querySelector('ids-tooltip');
        tooltip.innerHTML = this.#tooltipContent(element);
        tooltip.target = element;
        this.#positionTooltip(tooltip, e);
      });
    });
  }

  /**
   * Detatch tooltip handlers on elements
   */
  #detachTooltipEvents(): void {
    // Need one event per bar due to the nature of the events for tooltip
    this.tooltipElements().forEach((element: SVGElement) => {
      this.offEvent('hoverend', element);
    });
  }

  /**
   * Return the data for a tooltip accessed by index
   * @private
   * @param {SVGElement} tooltip the tooltip component
   * @param {MouseEvent} e the event element
   */
  #positionTooltip(tooltip: any, e: any) {
    tooltip.popup.onPlace = (popupRect: any) => {
      popupRect.x = e.clientX - 45;
      popupRect.y = e.clientY - 50;
      tooltip.popup.arrowEl.style.marginLeft = '';
      tooltip.popup.arrowEl.style.marginTop = '';
      return popupRect;
    };
    tooltip.popup.x = e.clientX - 45;
    tooltip.popup.y = e.clienty - 50;
    tooltip.visible = true;
  }

  /**
   * Return the data for a tooltip accessible by index
   * @param {number} index the data groupIndex
   * @returns {Array<string>} The elements
   */
  tooltipData(index: number) {
    const data = (this.data as any)[0].data[index];

    return {
      label: data.name,
      value: data.value || 0,
      tooltip: data.tooltip,
      total: this.percents[index].total,
      rounded: this.percents[index].rounded
    };
  }

  /**
   * Return the tooltip content
   * @param {SVGElement} elem The svg element we will inspect for content
   * @private
   * @returns {string} The tooltip content
   */
  #tooltipContent(elem: SVGElement): string {
    const index = Number(elem.getAttribute('index'));
    const data = this.tooltipData(index);

    if (data.tooltip) {
      // eslint-disable-next-line no-template-curly-in-string
      return data.tooltip.replace('${value}', data.value).replace('${label}', data.label).replace('${percent}', data.rounded);
    }
    return injectTemplate(this.tooltipTemplate(), data);
  }

  /**
   * Show an empty message with settings configuration
   * @private
   */
  #showEmptyMessage() {
    this.svg.classList.add('hidden');
    this.container.parentElement.classList.add('empty');
    this.emptyMessage.style.height = `${this.height}px`;
    this.emptyMessage.removeAttribute('hidden');
  }

  /**
   * Hide the empty message
   * @private
   */
  #hideEmptyMessage() {
    this.svg.classList.remove('hidden');
    this.container.parentElement.classList.remove('empty');
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
    this.setAttribute(attributes.DONUT, value);
    this.rerender();
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

  get height() {
    const attrib = this.getAttribute(attributes.HEIGHT);
    return attrib ? parseFloat(attrib) : '';
  }

  /**
   * The width of the chart (in pixels) or 'inherit' from the parent
   * @param {number | string} value The width value
   */
  set width(value: number | string) {
    this.setAttribute(attributes.WIDTH, value);
    this.svg.setAttribute(attributes.WIDTH, value);
    this.rerender();
  }

  get width() {
    const attrib = this.getAttribute(attributes.WIDTH);
    return attrib ? parseFloat(attrib) : '';
  }

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
   * Set the animation on/off
   * @param {boolean} value True if animation is on
   */
  set animated(value: boolean) {
    this.setAttribute(attributes.ANIMATED, value);
    this.rerender();
  }

  get animated(): boolean {
    const animated = this.getAttribute(attributes.ANIMATED);
    if (animated === null) {
      return true;
    }
    return stringToBool(this.getAttribute(attributes.ANIMATED));
  }

  /**
   * Set the tooltips on/off
   * @param {boolean} value True if animation is on
   */
  set suppressTooltips(value: boolean) {
    this.setAttribute(attributes.SUPPRESS_TOOLTIPS, value);
    const suppressed = stringToBool(this.getAttribute(attributes.SUPPRESS_TOOLTIPS));
    if (suppressed) {
      this.#detachTooltipEvents();
    }
    this.rerender();
  }

  get suppressTooltips(): boolean {
    const suppressed = this.getAttribute(attributes.SUPPRESS_TOOLTIPS);
    if (suppressed === null) {
      return false;
    }
    return stringToBool(this.getAttribute(attributes.SUPPRESS_TOOLTIPS));
  }
}

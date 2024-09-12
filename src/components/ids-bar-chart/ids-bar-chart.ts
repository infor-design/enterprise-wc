import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';
import IdsAxisChart from '../ids-axis-chart/ids-axis-chart';

import styles from './ids-bar-chart.scss';

type IdsBarChartSelected = {
  data?: any,
  groupIndex?: number | string,
  index?: number | string,
  bars?: any[],
  indexes?: any[]
};

type IdsBarChartSelectedBy = {
  groupIndex?: number | string,
  index?: number | string
};

/**
 * IDS Bar Chart Component
 * @type {IdsBarChart}
 * @inherits IdsElement
 * @part svg - the outside svg element
 * @part marker - the dots/markers in the chart
 * @part line - the lines in the chart
 * @part bars - each bars element in the chart
 */
@customElement('ids-bar-chart')
@scss(styles)
export default class IdsBarChart extends IdsAxisChart {
  constructor() {
    super();

    // Setup default values
    this.DEFAULT_SELECTABLE = false;
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

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Callback for after connected.
   * @returns {void}
   */
  afterConnectedCallback(): void {
    this.#adjustVerticalLines();
    this.#preSelected();
    this.attachTooltipEvents();
  }

  /**
   * Callback for after calculate.
   * @returns {void}
   */
  afterCalculateCallback(): void {
    this.#setIsGrouped();
  }

  /**
   * Return the chart data for the internal svg
   * @private
   * @returns {object} The markers and areas and lines
   */
  chartTemplate() {
    const ariaLabel = `${!this.stacked ? this.data[0]?.name : ''}`;
    return `<g class="bars" role="list" aria-label="${ariaLabel}">
      ${this.#bars()}
    </g>`;
  }

  /**
   * Set initially selected
   * @private
   * @returns {void}
   */
  #preSelected(): void {
    if (!this.initialized || !this.selectable || !this.data?.length || !this.selectionElements?.length) return;

    const isValid = (n: any) => typeof n === 'number' && n > -1;
    const removeSelectedInData = () => {
      this.data.forEach((g: any) => {
        delete g.selected;
        g.data?.forEach((n: any) => { delete n?.selected; });
      });
    };
    const gIndex = this.data.findIndex((n: any) => n.selected);
    if (isValid(gIndex)) {
      removeSelectedInData();
      (this.data as any)[gIndex].data?.forEach((n: any) => { n.selected = true; });
      this.selectionElements.forEach((el: SVGElement) => {
        if (el.getAttribute('group-index') === `${gIndex}`) el.setAttribute('selected', '');
        else el.classList.add('not-selected');
      });
      return;
    }

    let index: any;
    for (let i = 0, l = this.data.length; i < l; i++) {
      index = (this.data as any)[i].data?.findIndex((n: any) => n.selected);
      if (isValid(index)) break;
    }
    if (isValid(index)) {
      removeSelectedInData();
      this.data.forEach((g: any) => {
        const d = g?.data?.[index];
        if (d) d.selected = true;
      });
      this.selectionElements.forEach((el: SVGElement) => {
        if (el.getAttribute('index') === `${index}`) el.setAttribute('selected', '');
        else el.classList.add('not-selected');
      });
    }
  }

  /**
   * Get currently selected
   * @returns {IdsBarChartSelected} selected.
   */
  getSelected(): IdsBarChartSelected {
    const selected: any = this.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    if (!selected.length) return {};

    const groupIndex: any = selected[0].getAttribute('group-index');
    const isGroup = !(selected.some((el: SVGElement) => el.getAttribute('group-index') !== groupIndex));
    if (isGroup) {
      const data: any = (this.data as any)[groupIndex];
      return { bars: selected, data, groupIndex };
    }
    const data: any[] = [];
    const indexes = selected.map((el: SVGElement) => {
      const g: any = el.getAttribute('group-index');
      const i: any = el.getAttribute('index');
      const d: any = (this.data as any)[g].data[i];
      if (d) data.push(d);
      return { group: g, index: i };
    });
    return { bars: selected, data, indexes };
  }

  /**
   * Set selected by give indexes
   * @param {IdsBarChartSelectedBy} opt The in comeing options
   * @returns {void}
   */
  setSelected(opt: IdsBarChartSelectedBy): void {
    if (!this.initialized || !this.selectable || !this.data?.length || !this.selectionElements?.length) return;

    const gIndex = stringToNumber(opt.groupIndex);
    const index = stringToNumber(opt.index);
    if (Number.isNaN(gIndex)) return;
    if (Number.isNaN(index)) this.setSelection(gIndex, true);
    else {
      const idx = this.selectionElements.findIndex(
        (el: SVGElement) => el.getAttribute('group-index') === `${gIndex}`
          && el.getAttribute('index') === `${index}`
      );
      if (typeof idx === 'number' && idx > -1) this.setSelection(idx);
    }
  }

  /**
   * Set the selection for given index
   * @private
   * @param {number|string} index The index value
   * @param {boolean} isLegendClick True if legend clicked
   * @returns {boolean} False, if veto.
   */
  setSelection(index: any, isLegendClick?: boolean): boolean {
    if (Number.isNaN(index) || !this.selectionElements?.[0]) return false;

    // Set type of bar elements
    const extract = (cb: any) => this.selectionElements.filter((a: SVGElement) => cb(a));
    const bars: any = { selected: extract((el: SVGElement) => el.hasAttribute('selected')) };
    if (isLegendClick) {
      bars.target = extract((el: SVGElement) => el.getAttribute('group-index') === `${index}`);
      bars.inverse = extract((el: SVGElement) => el.getAttribute('group-index') !== `${index}`);
    } else {
      const idx = this.selectionElements?.[index]?.getAttribute('index');
      bars.target = extract((el: SVGElement) => el.getAttribute('index') === `${idx}`);
      bars.inverse = extract((el: SVGElement) => el.getAttribute('index') !== `${idx}`);
    }

    // Get data and indexes for given list of elements
    let isGroup = false;
    const args = (list: any[]) => {
      const groupIndex: any = list[0].getAttribute('group-index');
      isGroup = !(list.some((el: SVGElement) => el.getAttribute('group-index') !== groupIndex));
      if (isGroup) {
        const data: any = (this.data as any)[groupIndex];
        return { bars: list, data, groupIndex };
      }
      const data: any[] = [];
      const indexes = list.map((el: SVGElement) => {
        const g: any = el.getAttribute('group-index');
        const i: any = el.getAttribute('index');
        const d: any = (this.data as any)[g].data[i];
        if (d) data.push(d);
        return { group: g, index: i };
      });
      return { bars: list, data, indexes };
    };

    // Deselect
    const deselect = (): boolean => {
      const argsSelected = args(bars.selected);
      if (!this.triggerVetoableEvent('beforedeselected', argsSelected)) {
        return false;
      }
      const unmarkSelected = (n: any) => { delete n.selected; };
      if (isGroup) unmarkSelected(argsSelected.data);
      else argsSelected.data.forEach((n: any) => unmarkSelected(n));
      this.selectionElements.forEach((el: SVGElement) => el.classList.remove('not-selected'));
      bars.selected.forEach((el: SVGElement) => el.removeAttribute('selected'));
      this.triggerEvent('deselected', this, { bubbles: true, detail: { elem: this, ...argsSelected } });
      return true;
    };

    // Previously selected
    if (bars.selected.length) {
      const targetSelected = !(bars.target.some((el: SVGElement) => !el.hasAttribute('selected')));
      if (targetSelected) return deselect();
      if (!deselect()) return false;
    }

    // Traget data and indexes
    const argsTarget = args(bars.target);
    if (!this.triggerVetoableEvent('beforeselected', argsTarget)) {
      return false;
    }
    const markSelected = (n: any) => { n.selected = true; };
    if (isGroup) markSelected(argsTarget.data);
    else argsTarget.data.forEach((n: any) => markSelected(n));
    bars.target.forEach((el: SVGElement) => el.setAttribute('selected', ''));
    bars.inverse.forEach((el: SVGElement) => el.classList.add('not-selected'));
    this.triggerEvent('selected', this, { bubbles: true, detail: { elem: this, ...argsTarget } });

    return true;
  }

  /**
   * Return chart elements that get selection
   * @returns {Array<SVGElement>} The elements
   */
  get selectionElements(): Array<SVGElement> {
    if (!this.selectable) return [];
    return [...this.container?.querySelectorAll<SVGElement>('rect.bar') ?? []];
  }

  /**
   * Return the elements that get tooltip events
   * @returns {Array<string>} The elements
   */
  tooltipElements(): Array<SVGElement> {
    return [...this.container?.querySelectorAll<SVGElement>('rect.bar') ?? []];
  }

  /**
   * Adjust the lines to display category sections
   * @private
   */
  #adjustVerticalLines() {
    if (this.horizontal) return;
    const lineSection = this.shadowRoot?.querySelector('.vertical-lines');
    if (lineSection) {
      const lines = lineSection.querySelectorAll('line');
      lines.forEach((line: SVGLineElement, index: number) => {
        if (index === 0) {
          return;
        }
        line.setAttribute('x1', String(this.sectionWidths.at(index)?.left));
        line.setAttribute('x2', String(this.sectionWidths.at(index)?.left));
      });

      // Add two more
      const left = this.sectionWidths.at(-1)?.left;
      const line = `<line x1="${left}" x2="${left}" y1="${lines[0].getAttribute('y1')}" y2="${lines[0].getAttribute('y2')}"/>`;
      lineSection.insertAdjacentHTML('beforeend', line);
    }
  }

  /**
   * Generate the svg markup for the area paths
   * @returns {string} The area markup
   * @private
   */
  #bars() {
    if (this.horizontal) return this.#horizontalBars();

    let barHTML = '';
    const runningHeight: Record<number, number> = [];
    const groupCount = this.groupCount;
    const isGrouped = this.isGrouped;
    const sectionWidth = this.sectionWidth;
    const categoryWidth = (this.categoryPercentage * sectionWidth);
    const barGap = 1;

    // Calculate the width of each bar and bar "category" and fit it in even sections
    let barWidth = isGrouped ? ((categoryWidth - (groupCount * barGap)) / groupCount) : categoryWidth;
    barWidth *= this.barPercentage;

    // Generate the bars
    this.markerData.points?.forEach((pointGroup, groupIndex) => {
      pointGroup.forEach((point, index) => {
        let left;
        if (isGrouped) {
          left = this.sectionWidths[index].left
            + ((sectionWidth - categoryWidth) / 2)
            + ((categoryWidth - (barWidth * groupCount)) / 2);
          left += (barWidth * groupIndex) + (groupIndex * barGap);
        } else {
          left = this.sectionWidths[index].left
            + ((sectionWidth - categoryWidth) / 2)
            + ((categoryWidth - barWidth) / 2);
        }

        const bottom = this.markerData.gridBottom;
        let height = bottom - point.top;
        const pattern = this.data[groupIndex]?.pattern ? ` fill="url(#${this.data[groupIndex]?.pattern})"` : '';
        const label = (this.data as any)[0]?.data[index]?.name;
        let top = point.top;

        if (this.stacked) {
          top = groupIndex > 0 ? top - runningHeight[index] : top;
          runningHeight[index] = (runningHeight[index] || 0) + height;
        }

        if (height < 0) height = 0;
        if (barWidth < 0) barWidth = 0;

        barHTML += `<g role="listitem">
          <text class="audible" x="${left}" y="${this.markerData.gridBottom}">${label} ${point.value}</text>
          <rect class="bar color-${groupIndex + 1}" group-index="${groupIndex}" index="${index}" width="${barWidth}" height="${height}" x="${left}" y="${top}"${pattern}>
            <animate attributeName="height" from="0" to="${height}" ${this.animated ? this.cubicBezier : this.cubicBezier.replace('0.8s', '0.01s')}></animate>
            <animate attributeName="y" from="${bottom}" to="${top}" ${this.animated ? this.cubicBezier : this.cubicBezier.replace('0.8s', '0.01s')}></animate>
          </rect></g>`;
      });
    });

    return barHTML;
  }

  /**
   * Generate the svg markup for the horizontal bars.
   * @private
   * @returns {string} The markup
   */
  #horizontalBars() {
    let barHTML = '';
    const runningWidth: Record<number, number> = [];
    const groupCount = this.groupCount;
    const isGrouped = this.isGrouped;
    const sectionHeight = this.sectionHeight;
    const categoryHeight = (this.categoryPercentage * sectionHeight);
    const barGap = 1;

    // Calculate the height of each bar and bar "category" and fit it in even sections
    let barHeight = isGrouped ? ((categoryHeight - (groupCount * barGap)) / groupCount) : categoryHeight;
    barHeight *= this.barPercentage;

    // Generate the bars
    this.markerData.points?.forEach((pointGroup, groupIndex) => {
      pointGroup.forEach((point, index) => {
        let top;
        if (isGrouped) {
          top = this.sectionHeights[index].top
            + ((sectionHeight - categoryHeight) / 2)
            + ((categoryHeight - (barHeight * groupCount)) / 2);
          top += (barHeight * groupIndex) + (groupIndex * barGap);
        } else {
          top = this.sectionHeights[index].top
            + ((sectionHeight - categoryHeight) / 2)
            + ((categoryHeight - barHeight) / 2);
        }

        let x = this.markerData.gridLeft - this.margins.leftInner - this.margins.rightInner;
        const startEdge = x;
        const right = this.markerData.gridRight;
        const width = right - point.left;
        const pattern = this.data[groupIndex]?.pattern ? ` fill="url(#${this.data[groupIndex]?.pattern})"` : '';
        const label = (this.data as any)[0]?.data[index]?.name;

        if (this.stacked) {
          x = groupIndex > 0 ? runningWidth[index] : x;
          runningWidth[index] = (runningWidth[index] || x) + width;
        }

        barHTML += `<g role="listitem">
          <text class="audible" x="${x}" y="${this.markerData.gridBottom}">${label} ${point.value}</text>
          <rect class="bar color-${groupIndex + 1}" group-index="${groupIndex}" index="${index}" width="${width}" height="${barHeight}" x="${x}" y="${top}"${pattern}>
            <animate attributeName="x" from="${startEdge}" to="${x}" ${this.animated ? this.cubicBezier : this.cubicBezier.replace('0.8s', '0.01s')}></animate>
            <animate attributeName="width" from="0" to="${width}" ${this.animated ? this.cubicBezier : this.cubicBezier.replace('0.8s', '0.01s')}></animate>
          </rect></g>`;
      });
    });

    return barHTML;
  }

  /**
   * Number of groups count
   * @returns {number} count of groups
   */
  get groupCount(): number {
    return this.markerData?.groupCount || 1;
  }

  /**
   * Set if chart type as grouped
   * @returns {void}
   */
  #setIsGrouped(): void {
    this.isGrouped = (!this.stacked && this.groupCount > 1);
  }

  /**
   * Check if given value is between zero to one.
   * @param {number} value The number value to check (0-1)
   * @returns {boolean} true, if value is between zero to one
   */
  #isBetweenZeroToOne(value: number): boolean {
    return (!Number.isNaN(value) && value > 0 && value <= 1);
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
   * if `isGrouped` this value, will use as whole group percentage.
   * @param {number} value Percent (0-1)
   */
  set barPercentage(value: number) {
    if (this.#isBetweenZeroToOne(Number(value))) {
      this.setAttribute(attributes.BAR_PERCENTAGE, String(value));
    } else {
      this.removeAttribute(attributes.BAR_PERCENTAGE);
    }
    this.redraw();
  }

  get barPercentage(): number {
    const value = Number(this.getAttribute(attributes.BAR_PERCENTAGE));
    if (this.#isBetweenZeroToOne(value)) return value;
    return this.isGrouped ? 0.7 : 0.5;
  }

  /**
   * Percent (0-1) of the available width each category (group) section.
   * @param {number} value Percent (0-1)
   */
  set categoryPercentage(value: number) {
    if (this.#isBetweenZeroToOne(Number(value))) {
      this.setAttribute(attributes.CATEGORY_PERCENTAGE, String(value));
    } else {
      this.removeAttribute(attributes.CATEGORY_PERCENTAGE);
    }
    this.redraw();
  }

  get categoryPercentage(): number {
    const value = Number(this.getAttribute(attributes.CATEGORY_PERCENTAGE));
    if (this.#isBetweenZeroToOne(value)) return value;
    return 0.9;
  }
}

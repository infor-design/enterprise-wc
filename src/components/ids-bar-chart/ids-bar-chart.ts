import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-bar-chart-base';
import styles from './ids-bar-chart.scss';
import type IdsChartData from '../ids-axis-chart/ids-axis-chart';

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
    this.#adjustVerticalLines();
  }

  mountedCallback(): void {
    this.#preSelected();
    this.attachTooltipEvents();
  }

  /**
   * Return the chart data for the internal svg
   * @private
   * @returns {object} The markers and areas and lines
   */
  chartTemplate() {
    const ariaLabel = `${!this.grouped && !this.stacked ? this.data[0]?.name : ''}`;
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
    return [...this.container.querySelectorAll('rect.bar')];
  }

  /**
   * Return the elements that get tooltip events
   * @returns {Array<string>} The elements
   */
  tooltipElements(): Array<SVGElement> {
    return this.container.querySelectorAll('rect.bar');
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
        const pattern = this.data[groupIndex]?.pattern ? ` fill="url(#${this.data[groupIndex]?.pattern})"` : '';
        const label = (this.data as any)[0]?.data[index]?.name;
        let top = point.top;

        if (this.stacked) {
          top = groupIndex > 0 ? top - runningHeight[index] : top;
          runningHeight[index] = (runningHeight[index] || 0) + height;
        }

        barHTML += `<g role="listitem">
          <text class="audible" x="${left}" y="${this.markerData.gridBottom}">${label} ${point.value}</text>
          <rect class="bar color-${groupIndex + 1}" aria-hidden="true" group-index="${groupIndex}" index="${index}" width="${this.barWidth}" height="${height}" x="${left}" y="${top}"${pattern}>
            <animate attributeName="height" from="0" to="${height}" ${this.animated ? this.cubicBezier : this.cubicBezier.replace('0.8s', '0.01s')}></animate>
            <animate attributeName="y" from="${bottom}" to="${top}" ${this.animated ? this.cubicBezier : this.cubicBezier.replace('0.8s', '0.01s')}></animate>
          </rect></g>`;
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
    this.redraw();
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
    this.redraw();
  }

  get categoryPercentage(): number {
    const value = this.getAttribute(attributes.CATEGORY_PERCENTAGE);
    if (value) {
      return Number(this.getAttribute(attributes.CATEGORY_PERCENTAGE));
    }
    return 0.9;
  }
}

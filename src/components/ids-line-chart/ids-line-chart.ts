import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-line-chart-base';
import styles from './ids-line-chart.scss';
import type IdsChartData from '../ids-axis-chart/ids-axis-chart';

type IdsLineChartMarkers = {
  markers?: string,
  lines?: string
};

type IdsLineChartSelected = {
  data?: any,
  groupIndex?: number | string,
  index?: number | string,
  selectionElem?: SVGElement
};

type IdsLineChartSelectedBy = {
  groupIndex?: number | string,
  index?: number | string
};

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
      attributes.MARKER_SIZE
    ];
  }

  afterConnectedCallback() {
    this.#preSelected();
    this.attachTooltipEvents();
  }

  /**
   * Return the chart data for the internal svg
   * @returns {object} The markers and lines
   */
  chartTemplate() {
    return `<g class="marker-lines">
      ${this.lineMarkers().lines}
    </g>
    <g class="markers">
      ${this.lineMarkers().markers}
    </g>`;
  }

  /**
   * Set initially selected
   * @private
   * @returns {void}
   */
  #preSelected(): void {
    if (!this.initialized || !this.selectable || !this.data?.length || !this.selectionElements?.length) return;

    const gIndex = this.data.findIndex((n: any) => n.selected);
    const isValid = (n: any) => typeof n === 'number' && n > -1;
    if (isValid(gIndex)) {
      this.selectionElements.forEach((el: SVGElement) => {
        if (el.getAttribute('group-index') === `${gIndex}`) {
          if (el.getAttribute('part') === 'line') el.setAttribute('selected', '');
          el.classList.add('selected');
        } else el.classList.add('not-selected');
      });
      return;
    }

    const indexes: any = {};
    for (let i = 0, l = this.data.length; i < l; i++) {
      indexes.index = (this.data as any)[i].data?.findIndex((n: any) => n.selected);
      indexes.gIndex = i;
      if (isValid(indexes.index)) break;
    }
    if (isValid(indexes.index)) {
      this.selectionElements.forEach((el: SVGElement) => {
        if (el.getAttribute('group-index') === `${indexes.gIndex}`) {
          if (el.getAttribute('part') === 'marker'
            && el.getAttribute('index') === `${indexes.index}`) {
            el.setAttribute('selected', '');
          }
          el.classList.add('selected');
        } else el.classList.add('not-selected');
      });
    }
  }

  /**
   * Get currently selected
   * @returns {IdsLineChartSelected} selected.
   */
  getSelected(): IdsLineChartSelected {
    const selected: any = this.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'))[0];
    if (!selected) return {};

    const g: any = selected.getAttribute('group-index');
    const i: any = selected.getAttribute('index');
    if (i === null) { // grouped
      const data: any = (this.data as any)[g];
      return { data, groupIndex: g, selectionElem: selected };
    }
    const data: any = (this.data as any)[g].data[i];
    return { data, groupIndex: g, index: i, selectionElem: selected }; // eslint-disable-line
  }

  /**
   * Set selected by give indexes
   * @param {IdsLineChartSelectedBy} opt The in comeing options
   * @returns {void}
   */
  setSelected(opt: IdsLineChartSelectedBy): void {
    if (!this.initialized || !this.selectable || !this.data?.length || !this.selectionElements?.length) return;

    const gIndex = stringToNumber(opt.groupIndex);
    const index = stringToNumber(opt.index);
    if (Number.isNaN(gIndex)) return;
    if (Number.isNaN(index)) this.setSelection(gIndex, true);
    else {
      const idx = this.selectionElements.findIndex(
        (el: SVGElement) => el.getAttribute('part') === 'marker'
          && el.getAttribute('group-index') === `${gIndex}`
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

    // Set type of elements
    const extract = (cb: any) => this.selectionElements.filter((a: SVGElement) => cb(a));
    const elems: any = { selected: extract((el: SVGElement) => el.hasAttribute('selected'))[0] };
    if (isLegendClick) {
      elems.target = extract((el: SVGElement) => el.getAttribute('group-index') === `${index}`);
      elems.inverse = extract((el: SVGElement) => el.getAttribute('group-index') !== `${index}`);
      elems.targetSelect = extract((el: SVGElement) => el.getAttribute('part') === 'line'
        && el.getAttribute('group-index') === `${index}`)[0];
    } else {
      const elem = this.selectionElements?.[index];
      const idx = elem?.getAttribute('group-index');
      elems.target = extract((el: SVGElement) => el.getAttribute('group-index') === `${idx}`);
      elems.inverse = extract((el: SVGElement) => el.getAttribute('group-index') !== `${idx}`);
      elems.targetSelect = elem?.getAttribute('part') === 'marker'
        ? elem : extract((el: SVGElement) => el.getAttribute('part') === 'line'
          && el.getAttribute('group-index') === `${idx}`)[0];
    }

    // Get data and indexes for given element
    const args = (el: SVGElement) => {
      const g: any = el.getAttribute('group-index');
      const i: any = el.getAttribute('index');
      if (i === null) { // grouped
        const data: any = (this.data as any)[g];
        return { data, groupIndex: g, selectionElem: el };
      }
      const data: any = (this.data as any)[g].data[i];
      return { data, groupIndex: g, index: i, selectionElem: el }; // eslint-disable-line
    };

    // Deselect
    const deselect = (): boolean => {
      const argsSelected = args(elems.selected);
      if (!this.triggerVetoableEvent('beforedeselected', argsSelected)) {
        return false;
      }
      this.selectionElements.forEach((el: SVGElement) => el.classList.remove('selected', 'not-selected'));
      delete argsSelected.data.selected;
      argsSelected.selectionElem.removeAttribute('selected');
      this.triggerEvent('deselected', this, { bubbles: true, detail: { elem: this, ...argsSelected } });
      return true;
    };

    // Previously selected
    if (elems.selected) {
      const gIndex = (el: SVGElement) => el.getAttribute('group-index');
      const targetSelected = gIndex(elems.targetSelect) === gIndex(elems.selected);
      if (targetSelected) return deselect();
      if (!deselect()) return false;
    }

    // Traget data and indexes
    const argsTarget = args(elems.targetSelect);
    if (!this.triggerVetoableEvent('beforeselected', argsTarget)) {
      return false;
    }
    elems.targetSelect.setAttribute('selected', '');
    elems.target.forEach((el: SVGElement) => el.classList.add('selected'));
    elems.inverse.forEach((el: SVGElement) => el.classList.add('not-selected'));
    argsTarget.data.selected = true;
    this.triggerEvent('selected', this, { bubbles: true, detail: { elem: this, ...argsTarget } });

    return true;
  }

  /**
   * Return chart elements that get selection
   * @returns {Array<SVGElement>} The elements
   */
  get selectionElements(): Array<SVGElement> {
    if (!this.selectable) return [];
    return [
      ...this.container.querySelectorAll('.markers [part="marker"]'),
      ...this.container.querySelectorAll('.marker-lines [part="line"]')
    ];
  }

  /**
   * Return the elements that get tooltip events
   * @returns {Array<string>} The elements
   */
  tooltipElements(): Array<SVGElement> {
    return this.container.querySelectorAll('.markers circle');
  }

  /**
   * Return the marker data for the svg
   * @private
   * @returns {object} The markers and lines
   */
  lineMarkers(): IdsLineChartMarkers {
    let markerHTML = '';
    let lineHTML = '';
    this.markerData.points?.forEach((pointGroup: any, groupIndex: number) => {
      let points = '';
      let animationPoints = '';
      markerHTML += '<g class="marker-set">';

      pointGroup.forEach((point: IdsChartData, index: number) => {
        points += `${point.left},${point.top} `;
        animationPoints += `${point.left},${this.markerData.gridBottom} `;
        markerHTML += `<circle part="marker" group-index="${groupIndex}" index="${index}" class="color-${groupIndex + 1}" cx="${point.left}" cy="${point.top}" data-value="${point.value}" r="${this.markerSize}">
        ${stringToBool(this.animated) ? `<animate attributeName="cy" ${this.cubicBezier} from="${this.markerData.gridBottom}" to="${point.top}"/>` : ''}
        </circle>`;
      });
      markerHTML += '</g>';
      lineHTML += `<polyline part="line" class="data-line color-${groupIndex + 1}" points="${points}" stroke="var(${this.color(groupIndex)}" group-index="${groupIndex}">
      ${stringToBool(this.animated) ? `<animate attributeName="points" ${this.cubicBezier} from="${animationPoints}" to="${points}" />` : ''}
      </polyline>`;
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
    this.redraw();
  }

  get markerSize() {
    return parseFloat(this.getAttribute(attributes.MARKER_SIZE)) || 5;
  }
}

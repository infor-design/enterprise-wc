import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-treemap.scss';

const DEFAULT_HEIGHT = 300;

type Data = {
  value: number,
  color: string,
  text: string,
  label: string,
};

type TreemapDataSet = {
  data: Data,
  width: number,
  height: number,
  x: number,
  y: number
};

type RectMinWidth = {
  value: number,
  vertical: boolean
};

type Squarify = {
  children: number[],
  row: number[],
  width: number
};

type TreemapRectangle = {
  data: any[];
  xBeginning: number;
  yBeginning: number;
  totalWidth: number,
  totalHeight: number,
};

const Base = IdsLocaleMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Tree Component
 * Based on Treemap Squarify: https://github.com/clementbat/treemap
 * @type {IdsTreeMap}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @part tree - the tree element
 */
@customElement('ids-treemap')
@scss(styles)
export default class IdsTreeMap extends Base {
  d: TreemapDataSet[] = [];

  height = DEFAULT_HEIGHT;

  width = NaN;

  Rectangle: TreemapRectangle = {
    data: [],
    xBeginning: 0,
    yBeginning: 0,
    totalWidth: NaN,
    totalHeight: DEFAULT_HEIGHT
  };

  initialData: Data[] = [];

  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.resizeTreemap();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DATA,
      attributes.TITLE
    ];
  }

  /**
   * Set the data attribute
   * @param {TreemapDataSet[]} value of the treemap data object
   * @memberof IdsTreeMap
   */
  set data(value: TreemapDataSet[]) {
    this.d = value;
    this.render(true);
  }

  /**
   * Get the data attribute
   * @returns {TreemapDataSet[]} data of the treemap data object
   * @readonly
   * @memberof IdsTreeMap
   */
  get data(): TreemapDataSet[] {
    return this.d;
  }

  /**
   * Handles title attribute changes
   * @param {string} value title value
   */
  onTitleChange(value: string | null) {
    const titleText = this.shadowRoot?.querySelector('[part="title"]');
    if (titleText) titleText.innerHTML = value || '';
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    const treemap = `
      <div class="treemap-container">
        <div class="treemap-title">
          ${this.templateTitle()}
        </div>
        ${this.templateSvg(this.data)}
      </div>
    `;

    return treemap;
  }

  /**
   * Render SVG markup
   * @param {TreemapDataSet[]} data data array
   * @returns {string} svg
   * @memberof IdsTreeMap
   */
  templateSvg(data: TreemapDataSet[]): string {
    let svg = `<svg>Sorry, your browser does not support inline SVG.</svg>`;

    if (data !== undefined) {
      svg = `
        <svg width='${this.width}' height='${this.height}' stroke-width=".5">
          ${data?.map((rect: TreemapDataSet) => this.templateGroups(rect)).join('')}
        </svg>
      `;
    }

    return svg;
  }

  /**
   * Render the group markup
   * @param {TreemapDataSet} rect item in the data array
   * @returns {string} svg group
   * @memberof IdsTreeMap
   */
  templateGroups(rect: TreemapDataSet): string {
    const textOffset = 8;
    const isRTL = this.localeAPI?.isRTL();
    const textX = isRTL ? rect.width + rect.x - textOffset * 2 : rect.x + textOffset * 2;

    return `
      <g
        fill=${rect?.data?.color || '#003876'}
        class="treemap-rect"
      >
        <rect
          x=${rect.x}
          y=${rect.y}
          width=${rect.width}
          height=${rect.height}
        >
        </rect>
        <text
          fill="white"
          text-anchor="start"
          x="${textX}"
          y="${rect.y + textOffset * 3}"
          stroke-width="0"
        >
          ${rect?.data?.text || 'Empty'}
        </text>
        <text
          fill="white"
          text-anchor="start"
          x="${textX}"
          y="${rect.y + textOffset * 6}"
          stroke-width="0"
        >
          ${rect?.data?.label || '0%'}
        </text>
      </g>
    `;
  }

  /**
   * Render the title markup
   * @returns {string} Title banner markup
   * @memberof IdsTreeMap
   */
  templateTitle(): string {
    return `
      <ids-text type="span" font-weight="semi-bold" part="title">
        ${typeof this.title === 'string' ? this.title : 'Add Treemap Title'}
      </ids-text>`;
  }

  /**
   * Get max number
   * @param {number[]} array row
   * @returns {number} max number
   * @memberof IdsTreeMap
   * @private
   */
  #getMaximum = (array: number[]): number => Math.max(...array);

  /**
   * Get min number
   * @param {number[]} array row
   * @returns {number} min number
   * @memberof IdsTreeMap
   * @private
   */
  #getMinimum = (array: number[]): number => Math.min(...array);

  /**
   * Sum Reducer
   * @param {number} acc row
   * @param {number} cur row
   * @returns {Array} reduced array
   * @memberof IdsTreeMap
   * @private
   */
  #sumReducer = (acc: number, cur: number): number => acc + cur;

  /**
   * Round Value and preserve 2 decimals
   * @param {number} number row
   * @returns {number} round value array
   * @memberof IdsTreeMap
   * @private
   */
  #roundValue = (number: number): number => Math.max(Math.round(number * 100) / 100, 0);

  /**
   * Validate the treemap object.
   * @param {TreemapDataSet} treemap containing data and height
   * @param {Data[]} treemap.data array that contains the treemap block definitions
   * @param {number} treemap.height total hieght of the treemap
   * @memberof IdsTreeMap
   * @private
   */
  #validateArguments = (
    treemap: {
      data: Data[],
      height: number
    }
  ) => {
    const data = treemap.data;
    const height = treemap.height;

    if (typeof height !== 'number' || height <= 0) {
      throw new Error('You need to specify the height of your treemap');
    }
    if (!Array.isArray(data) || data.length === 0 || !data.every((dataPoint) => Object.prototype.hasOwnProperty.call(dataPoint, 'value') && typeof dataPoint.value === 'number' && dataPoint.value >= 0)) {
      throw new Error('Your data must be in this format [{ value: 1 }, { value: 2 }], \'value\' being a positive number');
    }
  };

  /**
   * Calculate worst ratio
   * @param {number[]} row array
   * @param {number} width of row
   * @returns {number} worst ratio number
   * @memberof IdsTreeMap
   * @private
   */
  #worstRatio = (row: number[], width: number): number => {
    const sum = row.reduce(this.#sumReducer, 0);
    const rowMax = this.#getMaximum(row);
    const rowMin = this.#getMinimum(row);
    return Math.max(((width ** 2) * rowMax) / (sum ** 2), (sum ** 2) / ((width ** 2) * rowMin));
  };

  /**
   * Get the min width
   * @returns {RectMinWidth} the minWidth object
   * @memberof IdsTreeMap
   * @private
   */
  #getMinWidth = (): RectMinWidth => {
    if (this.Rectangle.totalHeight ** 2 > this.Rectangle.totalWidth ** 2) {
      return { value: this.Rectangle.totalWidth, vertical: false };
    }
    return { value: this.Rectangle.totalHeight, vertical: true };
  };

  /**
   * Layout Row
   * @param {number[]} row array
   * @param {number} width number
   * @param {boolean} vertical boolean
   * @memberof IdsTreeMap
   * @private
   */
  #layoutRow = (
    row: number[],
    width: number,
    vertical: boolean
  ) => {
    const rowHeight = row.reduce(this.#sumReducer, 0) / width;

    row.forEach((rowItem: number) => {
      const rowWidth = rowItem / rowHeight;
      const { xBeginning } = this.Rectangle;
      const { yBeginning } = this.Rectangle;
      let data;

      if (vertical) {
        data = {
          x: xBeginning,
          y: yBeginning,
          width: rowHeight,
          height: rowWidth,
          data: this.initialData[this.Rectangle.data.length],
        };

        this.Rectangle.yBeginning += rowWidth;
      } else {
        data = {
          x: xBeginning,
          y: yBeginning,
          width: rowWidth,
          height: rowHeight,
          data: this.initialData[this.Rectangle.data.length],
        };

        this.Rectangle.xBeginning += rowWidth;
      }

      this.Rectangle.data.push(data);
    });

    if (vertical) {
      this.Rectangle.xBeginning += rowHeight;
      this.Rectangle.yBeginning -= width;
      this.Rectangle.totalWidth -= rowHeight;
    } else {
      this.Rectangle.xBeginning -= width;
      this.Rectangle.yBeginning += rowHeight;
      this.Rectangle.totalHeight -= rowHeight;
    }
  };

  /**
   * Layout last row
   * @param {number[]} rows array
   * @param {number[]} children array
   * @param {number} width number
   * @memberof IdsTreeMap
   * @private
   */
  #layoutLastRow = (
    rows: number[],
    children: number[],
    width: number
  ) => {
    const { vertical }: Pick<RectMinWidth, 'vertical'> = this.#getMinWidth();
    this.#layoutRow(rows, width, vertical);
    this.#layoutRow(children, width, vertical);
  };

  /**
   * Squarify
   * @param {number[]} children array
   * @param {number[]} row array
   * @param {number} width number
   * @returns {any} squarified row
   * @memberof IdsTreeMap
   * @private
   */
  #squarify = (
    children: number[],
    row: number[],
    width: number
  ): void | Squarify => {
    if (children.length === 1) {
      return this.#layoutLastRow(row, children, width);
    }

    const rowWithChild = [...row, children[0]];

    if (row.length === 0 || this.#worstRatio(row, width) >= this.#worstRatio(rowWithChild, width)) {
      children.shift();
      return this.#squarify(children, rowWithChild, width);
    }

    this.#layoutRow(row, width, this.#getMinWidth().vertical);
    return this.#squarify(children, [], this.#getMinWidth().value);
  };

  /**
   * Create the Treemap
   * @param {TreemapDataSet} treemap object that contains config for the treemap
   * @param {Data[]} treemap.data array that contains the treemap block definitions
   * @param {number} treemap.height total hieght of the treemap
   * @returns {TreemapDataSet[]} treemap array
   * @memberof IdsTreeMap
   */
  treeMap(
    treemap: {
      data: Data[],
      height: number
    }
  ): TreemapDataSet[] {
    if (treemap && treemap.data.length > 0) {
      const height = treemap.height;
      const data = treemap.data;

      this.#validateArguments({ data, height });
      this.width = this.container?.offsetWidth ?? NaN;
      this.height = height;

      this.Rectangle = {
        data: [],
        xBeginning: 0,
        yBeginning: 0,
        totalWidth: this.width,
        totalHeight: this.height,
      };

      this.initialData = data;
      const totalValue = data.map((dataPoint: Data) => dataPoint.value).reduce(this.#sumReducer, 0);
      const dataScaled = data.map((dataPoint: Data) => (dataPoint.value * this.height * this.width) / totalValue);

      this.#squarify(dataScaled, [], this.#getMinWidth().value);

      return this.Rectangle.data.map((dataPoint: TreemapDataSet) => ({
        ...dataPoint,
        x: this.#roundValue(dataPoint.x),
        y: this.#roundValue(dataPoint.y),
        width: this.#roundValue(dataPoint.width),
        height: this.#roundValue(dataPoint.height),
      }));
    }

    return [];
  }

  /**
   * Resize the treemap based on screen size
   * @memberof IdsTreeMap
   */
  resizeTreemap() {
    const resizeObserver: any = new ResizeObserver((entries) => {
      for (const entry of entries as any) {
        // Recalculate treemap data
        this.width = entry.target.offsetWidth;
        const updatedObj = {
          data: this.initialData,
          width: this.width,
          height: this.height
        };

        const newData = this.treeMap(updatedObj);
        if (newData) {
          this.data = this.treeMap(updatedObj);
        }
      }
    });

    resizeObserver.observe(this);
  }

  /**
   * Handle Locale (and language) change
   */
  onLocaleChange = () => {
    this.render(true);
  };
}

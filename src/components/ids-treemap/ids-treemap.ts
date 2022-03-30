import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-treemap-base';

import styles from './ids-treemap.scss';

const DEFAULT_DATA = [
  { value: 1 },
  { value: 2 }
];
const DEFAULT_HEIGHT = 300;

/**
 * IDS Tree Component
 * Based on Treemap Squarify: https://github.com/clementbat/treemap
 * @type {IdsTreeMap}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @part tree - the tree element
 */
@customElement('ids-treemap')
@scss(styles)
export default class IdsTreeMap extends Base {
  constructor() {
    super();
    this.d = DEFAULT_DATA;
    this.height = DEFAULT_HEIGHT;
    this.width = '';
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
   * @param {any} value of the treemap data object
   * @memberof IdsTreeMap
   */
  set data(value: any) {
    this.d = value;
    this.render();
  }

  /**
   * Get the data attribute
   * @returns {any} data of the treemap data object
   * @readonly
   * @memberof IdsTreeMap
   */
  get data(): any {
    return this.d;
  }

  /**
   * Set the title attribute
   * @param {string | null} value of the title
   * @memberof IdsTreeMap
   */
  set title(value: string | null) {
    if (value) {
      this.setAttribute(attributes.TITLE, value);
    } else {
      this.removeAttribute(attributes.TITLE);
    }

    const titleText = this.shadowRoot.querySelector('[part="title"]');
    if (titleText) {
      titleText.innerHTML = value ? value.toString() : '';
    }
  }

  /**
   * Get the title attribute
   * @returns {string} The value of the title attribute.
   * @readonly
   * @memberof IdsTreeMap
   */
  get title(): string | null {
    return this.getAttribute(attributes.TITLE);
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
   * @param {any} data data array
   * @returns {string} svg
   * @memberof IdsTreeMap
   */
  templateSvg(data: any): string {
    let svg = `<svg>Sorry, your browser does not support inline SVG.</svg>`;

    if (data !== undefined) {
      svg = `
        <svg width='${this.width}' height='${this.height}' stroke-width=".5">
          ${this.data.map((rect: any) => this.templateGroups(rect)).join('')}
        </svg>
      `;
    }
    return svg;
  }

  /**
   * Render the group markup
   * @param {any} rect item in the data array
   * @returns {string} svg group
   * @memberof IdsTreeMap
   */
  templateGroups(rect: any): string {
    const textOffset = 8;

    return `
      <g
        fill=${rect.data.color}
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
          x="${rect.x + textOffset * 2}"
          y="${rect.y + textOffset * 3}"
          stroke-width="0"
        >
          ${rect.data.text}
        </text>
        <text
          fill="white"
          x="${rect.x + textOffset * 2}"
          y="${rect.y + textOffset * 6}"
          stroke-width="0"
        >
          ${rect.data.label}
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
      <ids-text type="span" font-weight="bold" part="title">
        ${typeof this.title === 'string' ? this.title : 'Add Treemap Title'}
      </ids-text>`;
  }

  /**
   * Render the treemap by applying the template
   * @private
   */
  render() {
    super.render();
  }

  /**
   * Get max number
   * @param {any} array row
   * @returns {any} max number
   * @memberof IdsTreeMap
   * @private
   */
  #getMaximum = (array: any): any => Math.max(...array);

  /**
   * Get min number
   * @param {any} array row
   * @returns {any} min number
   * @memberof IdsTreeMap
   * @private
   */
  #getMinimum = (array: any): any => Math.min(...array);

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
   * @param {any} obj { data, height }
   * @param {any} obj.data array that contains the treemap block definitions
   * @param {number} obj.height total hieght of the treemap
   * @memberof IdsTreeMap
   * @private
   */
  #validateArguments = ({ data, height }: any) => {
    if (typeof height !== 'number' || height <= 0) {
      throw new Error('You need to specify the height of your treemap');
    }
    if (!Array.isArray(data) || data.length === 0 || !data.every((dataPoint) => Object.prototype.hasOwnProperty.call(dataPoint, 'value') && typeof dataPoint.value === 'number' && dataPoint.value >= 0)) {
      throw new Error('Your data must be in this format [{ value: 1 }, { value: 2 }], \'value\' being a positive number');
    }
  };

  /**
   * Calculate worst ratio
   * @param {any} row array
   * @param {number} width of row
   * @returns {number} worst ratio number
   * @memberof IdsTreeMap
   * @private
   */
  #worstRatio = (row: any, width: number) => {
    const sum = row.reduce(this.#sumReducer, 0);
    const rowMax = this.#getMaximum(row);
    const rowMin = this.#getMinimum(row);
    return Math.max(((width ** 2) * rowMax) / (sum ** 2), (sum ** 2) / ((width ** 2) * rowMin));
  };

  /**
   * Get the min width
   * @returns {any} the minWidth object
   * @memberof IdsTreeMap
   * @private
   */
  #getMinWidth = (): any => {
    if (this.Rectangle.totalHeight ** 2 > this.Rectangle.totalWidth ** 2) {
      return { value: this.Rectangle.totalWidth, vertical: false };
    }
    return { value: this.Rectangle.totalHeight, vertical: true };
  };

  /**
   * Layout Row
   * @param {any} row array
   * @param {number} width number
   * @param {boolean} vertical boolean
   * @memberof IdsTreeMap
   * @private
   */
  #layoutRow = (row: any, width: number, vertical: boolean) => {
    const rowHeight = row.reduce(this.#sumReducer, 0) / width;

    row.forEach((rowItem: any) => {
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
   * @param {any} rows array
   * @param {any} children array
   * @param {number} width number
   * @memberof IdsTreeMap
   * @private
   */
  #layoutLastRow = (rows: any, children: any, width: number) => {
    const { vertical }: any = this.#getMinWidth();
    this.#layoutRow(rows, width, vertical);
    this.#layoutRow(children, width, vertical);
  };

  /**
   * Squarify
   * @param {any} children array
   * @param {any} row array
   * @param {number} width number
   * @returns {any} squarified row
   * @memberof IdsTreeMap
   * @private
   */
  #squarify = (children: any, row: any, width: number): any => {
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
   * @param {any} obj object that contains config for the treemap
   * @param {any} obj.data array that contains the treemap block definitions
   * @param {number} obj.height total hieght of the treemap
   * @returns {any} treemap array
   * @memberof IdsTreeMap
   */
  treeMap({ data, height }: any): any {
    if (data && data.length > 0) {
      this.#validateArguments({ data, height });
      this.width = this.container.offsetWidth;
      this.height = height;

      this.Rectangle = {
        data: [],
        xBeginning: 0,
        yBeginning: 0,
        totalWidth: this.width,
        totalHeight: this.height,
      };

      this.initialData = data;
      const totalValue = data.map((dataPoint: any) => dataPoint.value).reduce(this.#sumReducer, 0);
      const dataScaled = data.map((dataPoint: any) => (dataPoint.value * this.height * this.width) / totalValue);

      this.#squarify(dataScaled, [], this.#getMinWidth().value);

      return this.Rectangle.data.map((dataPoint: any) => ({
        ...dataPoint,
        x: this.#roundValue(dataPoint.x),
        y: this.#roundValue(dataPoint.y),
        width: this.#roundValue(dataPoint.width),
        height: this.#roundValue(dataPoint.height),
      }));
    }

    return false;
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
}

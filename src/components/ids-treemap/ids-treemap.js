import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin,
  IdsLocaleMixin
} from '../../mixins';

import styles from './ids-treemap.scss';

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
class IdsTreeMap extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsThemeMixin,
    IdsLocaleMixin
  ) {
  constructor() {
    super();
    this.d = [];
    this.width = '';
    this.height = '';
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
   * @param {string} value of the treemap data object
   * @memberof IdsTreeMap
   */
  set data(value) {
    this.d = value;
    this.render(true);
  }

  /**
   * Get the data attribute
   * @returns {object} data of the treemap data object
   * @readonly
   * @memberof IdsTreeMap
   */
  get data() {
    return this.d;
  }

  /**
   * Set the title attribute
   * @param {string} value of the title
   * @memberof IdsTreeMap
   */
  set title(value) {
    if (value) {
      this.setAttribute(attributes.TITLE, value);
    } else {
      this.removeAttribute(attributes.TITLE);
    }
  }

  /**
   * Get the title attribute
   * @returns {string} The value of the title attribute.
   * @readonly
   * @memberof IdsTreeMap
   */
  get title() {
    return this.getAttribute(attributes.TITLE);
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const treemap = `
      <div class="treemap-container">
        <div class="treemap-title">${this.templateTitle()}</div>
        ${this.templateSvg(this.data)}
      </div>
    `;

    return treemap;
  }

  /**
   * Render SVG markup
   * @param {Array} data data array
   * @returns {*} svg
   * @memberof IdsTreeMap
   */
  templateSvg(data) {
    let svg = `<svg>Sorry, your browser does not support inline SVG.</svg>`;

    if (data !== undefined) {
      svg = `
        <svg width='${this.width}' height='${this.height}' stroke-width=".5">
          ${this.data.map((rect) => this.templateGroups(rect)).join('')}
        </svg>
      `;
    }
    return svg;
  }

  /**
   * Render the group markup
   * @param {object} rect item in the data array
   * @returns {*} svg group
   * @memberof IdsTreeMap
   */
  templateGroups(rect) {
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
   * @returns {*} Title banner markup
   * @memberof IdsTreeMap
   */
  templateTitle() {
    return `
      <ids-text type="span" font-weight="bold">
        ${this.title !== null ? this.title : 'Add Treemap Title'}
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
   * @param {Array} array row
   * @returns {Array} max number
   * @memberof IdsTreeMap
   * @private
   */
  #getMaximum = (array) => Math.max(...array);

  /**
   * Get min number
   * @param {Array} array row
   * @returns {Array} min number
   * @memberof IdsTreeMap
   * @private
   */
  #getMinimum = (array) => Math.min(...array);

  /**
   * Sum Reducer
   * @param {Array} acc row
   * @param {Array} cur row
   * @returns {Array} reduced array
   * @memberof IdsTreeMap
   * @private
   */
  #sumReducer = (acc, cur) => acc + cur;

  /**
   * Round Value
   * @param {Array} number row
   * @returns {Array} round value array
   * @memberof IdsTreeMap
   * @private
   */
  #roundValue = (number) => Math.max(Math.round(number * 100) / 100, 0);

  /**
   * Validate the treemap object.
   * @param {object} obj { data, height }
   * @param {Array} obj.data array that contains the treemap block definitions
   * @param {number} obj.height total hieght of the treemap
   * @memberof IdsTreeMap
   * @private
   */
  #validateArguments = ({ data, height }) => {
    if (!height || typeof height !== 'number' || height < 0) {
      throw new Error('You need to specify the height of your treemap');
    }
    if (!data || !Array.isArray(data) || data.length === 0 || !data.every((dataPoint) => Object.prototype.hasOwnProperty.call(dataPoint, 'value') && typeof dataPoint.value === 'number' && dataPoint.value >= 0 && !Number.isNaN(dataPoint.value))) {
      throw new Error('Your data must be in this format [{ value: 1 }, { value: 2 }], \'value\' being a positive number');
    }
  };

  /**
   * Calculate worst ratio
   * @param {Array} row array
   * @param {number} width of row
   * @returns {number} worst ratio number
   * @memberof IdsTreeMap
   * @private
   */
  #worstRatio = (row, width) => {
    const sum = row.reduce(this.#sumReducer, 0);
    const rowMax = this.#getMaximum(row);
    const rowMin = this.#getMinimum(row);
    return Math.max(((width ** 2) * rowMax) / (sum ** 2), (sum ** 2) / ((width ** 2) * rowMin));
  };

  /**
   * Get the min width
   * @returns {object} the minWidth object
   * @memberof IdsTreeMap
   * @private
   */
  #getMinWidth = () => {
    if (this.Rectangle.totalHeight ** 2 > this.Rectangle.totalWidth ** 2) {
      return { value: this.Rectangle.totalWidth, vertical: false };
    }
    return { value: this.Rectangle.totalHeight, vertical: true };
  };

  /**
   * Layout Row
   * @param {Array} row array
   * @param {number} width number
   * @param {boolean} vertical boolean
   * @memberof IdsTreeMap
   * @private
   */
  #layoutRow = (row, width, vertical) => {
    const rowHeight = row.reduce(this.#sumReducer, 0) / width;

    row.forEach((rowItem) => {
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
   * @param {Array} rows array
   * @param {Array} children array
   * @param {number} width number
   * @memberof IdsTreeMap
   */
  #layoutLastRow = (rows, children, width) => {
    const { vertical } = this.#getMinWidth();
    this.#layoutRow(rows, width, vertical);
    this.#layoutRow(children, width, vertical);
  };

  /**
   * Squarify
   * @param {Array} children array
   * @param {Array} row array
   * @param {number} width number
   * @returns {Array} squarified row
   * @memberof IdsTreeMap
   * @private
   */
  #squarify = (children, row, width) => {
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
   * @param {object} obj object that contains config for the treemap
   * @param {Array} obj.data array that contains the treemap block definitions
   * @param {number} obj.width total width of the treemap
   * @param {number} obj.height total hieght of the treemap
   * @returns {Array} treemap array
   * @memberof IdsTreeMap
   */
  treeMap({ data, width, height }) {
    this.#validateArguments({ data, width, height });

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
    const totalValue = data.map((dataPoint) => dataPoint.value).reduce(this.#sumReducer, 0);
    const dataScaled = data.map((dataPoint) => (dataPoint.value * this.height * this.width) / totalValue);

    this.#squarify(dataScaled, [], this.#getMinWidth().value);

    return this.Rectangle.data.map((dataPoint) => ({
      ...dataPoint,
      x: this.#roundValue(dataPoint.x),
      y: this.#roundValue(dataPoint.y),
      width: this.#roundValue(dataPoint.width),
      height: this.#roundValue(dataPoint.height),
    }));
  }

  /**
   * Resize the treemap based on screen size
   * @memberof IdsTreeMap
   */
  resizeTreemap() {
    window.addEventListener('resize', () => {
      this.width = this.container.offsetWidth;
      const updatedObj = {
        data: this.initialData,
        width: this.width,
        height: this.height
      };
      this.data = this.treeMap(updatedObj);
    });
  }
}

export default IdsTreeMap;

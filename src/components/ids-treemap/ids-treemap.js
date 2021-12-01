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
    this.res = [];
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
      attributes.RESULT,
      attributes.TITLE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const treemap = `
      <div class="treemap-container">
        <div class="treemap-title">${this.renderTitle()}</div>
        ${this.renderSvg(this.result)}
      </div>
    `;

    return treemap;
  }

  /**
   * Render SVG markup
   * @param {Array} result data array
   * @returns {*} svg
   * @memberof IdsTreeMap
   */
  renderSvg(result) {
    let svg = `<svg>Sorry, your browser does not support inline SVG.</svg>`;

    if (result !== undefined) {
      svg = `
        <svg width='${this.width}' height='${this.height}' stroke="#fff" stroke-width="1">
          ${this.result.map((rect) => this.renderGroups(rect)).join('')}
        </svg>
      `;
    }
    return svg;
  }

  /**
   * Render the group markup
   * @param {object} rect item in the result array
   * @returns {*} svg group
   * @memberof IdsTreeMap
   */
  renderGroups(rect) {
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
  renderTitle() {
    return `
      <ids-text type="span" font-weight="bold">
        ${this.title !== null ? this.title : 'Add Treemap Title'}
      </ids-text>`;
  }

  set result(value) {
    this.res = value;
    this.render(true);
  }

  get result() {
    return this.res;
  }

  set title(value) {
    if (value) {
      this.setAttribute(attributes.TITLE, value);
    } else {
      this.removeAttribute(attributes.TITLE);
    }
  }

  get title() {
    return this.getAttribute(attributes.TITLE);
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
  getMaximum = (array) => Math.max(...array);

  /**
   * Get min number
   * @param {Array} array row
   * @returns {Array} min number
   * @memberof IdsTreeMap
   * @private
   */
  getMinimum = (array) => Math.min(...array);

  /**
   * Sum Reducer
   * @param {Array} acc row
   * @param {Array} cur row
   * @returns {Array} reduced array
   * @memberof IdsTreeMap
   * @private
   */
  sumReducer = (acc, cur) => acc + cur;

  /**
   * Round Value
   * @param {Array} number row
   * @returns {Array} round value array
   * @memberof IdsTreeMap
   * @private
   */
  roundValue = (number) => Math.max(Math.round(number * 100) / 100, 0);

  /**
   * Validate Arguments
   * @param {Array} data.data object
   * @param {number} data.width number
   * @param {number} height number
   * @memberof IdsTreeMap
   * @private
   */
  validateArguments = ({ data, width, height }) => {
    if (!width || typeof width !== 'number' || width < 0) {
      throw new Error('You need to specify the width of your treemap');
    }
    if (!height || typeof height !== 'number' || height < 0) {
      throw new Error('You need to specify the height of your treemap');
    }
    if (!data || !Array.isArray(data) || data.length === 0 || !data.every((dataPoint) => Object.prototype.hasOwnProperty.call(dataPoint, 'value') && typeof dataPoint.value === 'number' && dataPoint.value >= 0 && !Number.isNaN(dataPoint.value))) {
      throw new Error('Your data must be in this format [{ value: 1 }, { value: 2 }], \'value\' being a positive number');
    }
  };

  worstRatio = (row, width) => {
    const sum = row.reduce(this.sumReducer, 0);
    const rowMax = this.getMaximum(row);
    const rowMin = this.getMinimum(row);
    return Math.max(((width ** 2) * rowMax) / (sum ** 2), (sum ** 2) / ((width ** 2) * rowMin));
  };

  getMinWidth = () => {
    if (this.Rectangle.totalHeight ** 2 > this.Rectangle.totalWidth ** 2) {
      return { value: this.Rectangle.totalWidth, vertical: false };
    }
    return { value: this.Rectangle.totalHeight, vertical: true };
  };

  layoutRow = (row, width, vertical) => {
    const rowHeight = row.reduce(this.sumReducer, 0) / width;

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

  layoutLastRow = (rows, children, width) => {
    const { vertical } = this.getMinWidth();
    this.layoutRow(rows, width, vertical);
    this.layoutRow(children, width, vertical);
  };

  squarify = (children, row, width) => {
    if (children.length === 1) {
      return this.layoutLastRow(row, children, width);
    }

    const rowWithChild = [...row, children[0]];

    if (row.length === 0 || this.worstRatio(row, width) >= this.worstRatio(rowWithChild, width)) {
      children.shift();
      return this.squarify(children, rowWithChild, width);
    }

    this.layoutRow(row, width, this.getMinWidth().vertical);
    return this.squarify(children, [], this.getMinWidth().value);
  };

  treeMap({ data, width, height }) {
    this.validateArguments({ data, width, height });

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
    const totalValue = data.map((dataPoint) => dataPoint.value).reduce(this.sumReducer, 0);
    const dataScaled = data.map((dataPoint) => (dataPoint.value * this.height * this.width) / totalValue);

    this.squarify(dataScaled, [], this.getMinWidth().value);

    return this.Rectangle.data.map((dataPoint) => ({
      ...dataPoint,
      x: this.roundValue(dataPoint.x),
      y: this.roundValue(dataPoint.y),
      width: this.roundValue(dataPoint.width),
      height: this.roundValue(dataPoint.height),
    }));
  }

  resizeTreemap() {
    window.addEventListener('resize', () => {
      this.width = this.container.offsetWidth;
      const updatedObj = {
        data: this.initialData,
        width: this.width,
        height: this.height
      };
      this.result = this.treeMap(updatedObj);
    });
  }
}

export default IdsTreeMap;

import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes,
  IdsDataSource
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin,
  IdsLocaleMixin
} from '../../mixins';

// Import Utils
import {
  IdsStringUtils as stringUtils,
  IdsXssUtils as xssUtils
} from '../../utils';

import styles from './ids-treemap.scss';

const { stringToBool } = stringUtils;

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
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.COLLAPSE_ICON
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <span>Treemap works!</span>
    `;
  }

  getMaximum = (array) => Math.max(...array);

  getMinimum = (array) => Math.min(...array);

  sumReducer = (acc, cur) => acc + cur;

  roundValue = (number) => Math.max(Math.round(number * 100) / 100, 0);

  worstRatio(row, width) {
    const sum = row.reduce(this.sumReducer, 0);
    const rowMax = this.getMaximum(row);
    const rowMin = this.getMinimum(row);
    return Math.max(((width ** 2) * rowMax) / (sum ** 2), (sum ** 2) / ((width ** 2) * rowMin));
  }

  getMinWidth = () => {
    if (this.Rectangle.totalHeight ** 2 > this.Rectangle.totalWidth ** 2) {
      return { value: this.Rectangle.totalWidth, vertical: false };
    }
    return { value: this.Rectangle.totalHeight, vertical: true };
  };

  squarify(children, row, width) {
    if (children.length === 1) {
      // layoutLastRow(row, children, width)
      return;
    }

    const rowWithChild = [...row, children[0]];

    if (row.length === 0 || this.worstRatio(row, width) >= this.worstRatio(rowWithChild, width)) {
      children.shift();
      this.squarify(children, rowWithChild, width);
    } else {
      // layoutRow(row, width)
      this.squarify(children, [], this.getMinWidth().width);
    }
  }

  treeMap({ data, width, height }) {
    this.worstRatio(data, width);

    this.Rectangle = {
      data: [],
      xBeginning: 0,
      yBeginning: 0,
      totalWidth: width,
      totalHeight: height,
    };

    return this.Rectangle.data.map((dataPoint) => ({
      ...dataPoint,
      x: this.roundValue(dataPoint.x),
      y: this.roundValue(dataPoint.y),
      width: this.roundValue(dataPoint.width),
      height: this.roundValue(dataPoint.height),
    }));
  }
}

export default IdsTreeMap;

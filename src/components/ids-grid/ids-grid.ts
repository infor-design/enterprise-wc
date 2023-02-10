import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import styles from './ids-grid.scss';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

const gridSizes: any = [
  { size: 'cols', className: 'grid-cols' },
  { size: 'colsXs', className: 'grid-cols-xs' },
  { size: 'colsSm', className: 'grid-cols-sm' },
  { size: 'colsMd', className: 'grid-cols-md' },
  { size: 'colsLg', className: 'grid-cols-lg' },
  { size: 'colsXl', className: 'grid-cols-xl' },
  { size: 'colsXxl', className: 'grid-cols-xxl' }
];

const minMaxWidths = [
  { setting: 'minColWidth', varName: '--min-col-width' },
  { setting: 'maxColWidth', varName: '--max-col-width' }
];

// const flowSettings = [
//   { setting: 'flowCol', className: 'grid-flow-col' },
//   { setting: 'flowColDense', className: 'grid-flow-col-dense' },
//   { setting: 'flowDense', className: 'grid-flow-dense' },
//   { setting: 'flowRow', className: 'grid-flow-row' },
//   { setting: 'flowRowDense', className: 'grid-flow-row-dense' },
// ];

/**
 * IDS Grid Component
 * @type {IdsGrid}
 * @inherits IdsElement
 */
@customElement('ids-grid')
@scss(styles)
export default class IdsGrid extends IdsElement {
  set autoFit(value: string | boolean | null) {
    const isTruthy = stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.AUTO_FIT, '');
    } else {
      this.removeAttribute(attributes.AUTO_FIT);
    }
  }

  get autoFit(): string | boolean | null {
    return stringToBool(this.getAttribute(attributes.AUTO_FIT));
  }

  set autoFill(value: string | boolean | null) {
    const isTruthy = stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.AUTO_FILL, '');
    } else {
      this.removeAttribute(attributes.AUTO_FILL);
    }
  }

  get autoFill(): string | boolean | null {
    return stringToBool(this.getAttribute(attributes.AUTO_FILL));
  }

  /**
   * Columns setter
   *
   * @memberof IdsGrid
   */
  set cols(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS, value);
    } else {
      this.removeAttribute(attributes.COLS);
    }
  }

  get cols(): string | null { return this.getAttribute(attributes.COLS); }

  /**
   * Columns XS setter
   *
   * @memberof IdsGrid
   */
  set colsXs(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_XS, value);
    } else {
      this.removeAttribute(attributes.COLS_XS);
    }
  }

  get colsXs(): string | null { return this.getAttribute(attributes.COLS_XS); }

  /**
   * Columns SM setter
   *
   * @memberof IdsGrid
   */
  set colsSm(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_SM, value);
    } else {
      this.removeAttribute(attributes.COLS_SM);
    }
  }

  get colsSm(): string | null { return this.getAttribute(attributes.COLS_SM); }

  /**
   * Columns MD setter
   *
   * @memberof IdsGrid
   */
  set colsMd(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_MD, value);
    } else {
      this.removeAttribute(attributes.COLS_MD);
    }
  }

  get colsMd(): string | null { return this.getAttribute(attributes.COLS_MD); }

  /**
   * Columns LG setter
   *
   * @memberof IdsGrid
   */
  set colsLg(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_LG, value);
    } else {
      this.removeAttribute(attributes.COLS_LG);
    }
  }

  get colsLg(): string | null { return this.getAttribute(attributes.COLS_LG); }

  /**
   * Columns XL setter
   *
   * @memberof IdsGrid
   */
  set colsXl(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_XL, value);
    } else {
      this.removeAttribute(attributes.COLS_XL);
    }
  }

  get colsXl(): string | null { return this.getAttribute(attributes.COLS_XL); }

  /**
   * Columns XXL setter
   *
   * @memberof IdsGrid
   */
  set colsXxl(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS_XXL, value);
    } else {
      this.removeAttribute(attributes.COLS_XXL);
    }
  }

  get colsXxl(): string | null { return this.getAttribute(attributes.COLS_XXL); }

  /**
   * Columns minColWidth setter
   *
   * @memberof IdsGrid
   */
  set minColWidth(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.MIN_COL_WIDTH, value);
    } else {
      this.removeAttribute(attributes.MIN_COL_WIDTH);
    }
  }

  get minColWidth(): string | null {
    return this.getAttribute(attributes.MIN_COL_WIDTH);
  }

  /**
   * Columns maxColWidth setter
   *
   * @memberof IdsGrid
   */
  set maxColWidth(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.MAX_COL_WIDTH, value);
    } else {
      this.removeAttribute(attributes.MAX_COL_WIDTH);
    }
  }

  get maxColWidth(): string | null {
    return this.getAttribute(attributes.MAX_COL_WIDTH);
  }

  /**
   * Handle The Gap Setting
   * @returns {string} The Gap [none, sm, md, lg, xl]
   */
  get gap(): string | null { return this.getAttribute(attributes.GAP); }

  /**
   * Set the grid gap
   * @param {string} value The Gap [none, sm, md, lg, xl]
   */
  set gap(value: string | null) {
    if (value) {
      this.setAttribute(attributes.GAP, value);
    } else {
      this.removeAttribute(attributes.GAP);
    }
  }

  set flow(value: string | null) {
    if (value !== null) {
      this.setAttribute('flow', value);
    } else {
      this.removeAttribute('flow');
    }
  }

  get flow(): string | null {
    return this.getAttribute('flow');
  }

  set flowCol(value: string | null) {
    if (value !== null) {
      this.setAttribute('flow-col', value);
    } else {
      this.removeAttribute('flow-col');
    }
  }

  get flowCol(): string | null {
    return this.getAttribute('flow-col');
  }

  set flowColDense(value: string | null) {
    if (value !== null) {
      this.setAttribute('flow-col-dense', value);
    } else {
      this.removeAttribute('flow-col-dense');
    }
  }

  get flowColDense(): string | null {
    return this.getAttribute('flow-col-dense');
  }

  set flowDense(value: string | null) {
    if (value !== null) {
      this.setAttribute('flow-dense', value);
    } else {
      this.removeAttribute('flow-dense');
    }
  }

  get flowDense(): string | null {
    return this.getAttribute('flow-dense');
  }

  set flowRow(value: string | null) {
    if (value !== null) {
      this.setAttribute('flow-row', value);
    } else {
      this.removeAttribute('flow-row');
    }
  }

  get flowRow(): string | null {
    return this.getAttribute('flow-row');
  }

  set flowRowDense(value: string | null) {
    if (value !== null) {
      this.setAttribute('flow-row-dense', value);
    } else {
      this.removeAttribute('flow-row-dense');
    }
  }

  get flowRowDense(): string | null {
    return this.getAttribute('flow-row-dense');
  }

  constructor() {
    super();
  }

  static get attributes(): any {
    return [
      attributes.AUTO_FIT,
      attributes.AUTO_FILL,
      attributes.COLS,
      attributes.COLS_XS,
      attributes.COLS_SM,
      attributes.COLS_MD,
      attributes.COLS_LG,
      attributes.COLS_XL,
      attributes.COLS_XXL,
      'flow',
      'flow-col',
      'flow-col-dense',
      'flow-dense',
      'flow-row',
      'flow-row-dense',
      attributes.GAP,
      attributes.MAX_COL_WIDTH,
      attributes.MIN_COL_WIDTH,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addSettings();
  }

  private addSettings() {
    this.classList.add('grid');
    this.setColumns();
    this.setMinMaxWidth();
    this.setGap();
    this.setAutoFit();
    this.setAutoFill();
    this.setFlow();
  }

  private setColumns() {
    for (const { size, className } of gridSizes) {
      if (this[size as keyof IdsGrid] !== null) {
        this.classList.add(`${className}-${this[size as keyof IdsGrid]}`);
      }
    }
  }

  private setMinMaxWidth() {
    for (const { setting, varName } of minMaxWidths) {
      if (this[setting as keyof IdsGrid] !== null) {
        this.style.setProperty(varName, this[setting as keyof IdsGrid]);
      }
    }
  }

  private setGap() {
    if (this.gap !== null) {
      this.classList.add(`grid-gap-${this.gap}`);
    }
  }

  private setAutoFit() {
    if (this.autoFit) {
      this.classList.add('grid-auto-fit');
    }
  }

  private setAutoFill() {
    if (this.autoFill) {
      this.classList.add('grid-auto-fill');
    }
  }

  private setFlow() {
    if (this.flow !== null) {
      this.classList.add(`grid-flow-${this.flow}`);
    }
  }

  template(): string {
    return `<slot></slot>`;
  }
}

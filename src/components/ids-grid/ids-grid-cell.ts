import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';

/**
 * IDS Grid Cell Component
 * @type {IdsGridCell}
 * @inherits IdsElement
 */
@customElement('ids-grid-cell')
export default class IdsGridCell extends IdsElement {
  /**
   * Set the amount of columns to span
   * @param {string | null} value The number value for the columns to span in the grid
   */
  set colSpan(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN);
    }
  }

  get colSpan(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN);
  }

  set colSpanXs(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_XS, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_XS);
    }
  }

  get colSpanXs(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_XS);
  }

  set colSpanSm(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_SM, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_SM);
    }
  }

  get colSpanSm(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_SM);
  }

  set colSpanMd(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_MD, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_MD);
    }
  }

  get colSpanMd(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_MD);
  }

  set colSpanLg(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_LG, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_LG);
    }
  }

  get colSpanLg(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_LG);
  }

  set colSpanXl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_XL, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_XL);
    }
  }

  get colSpanXl(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_XL);
  }

  set colSpanXxl(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.COL_SPAN_XXL, value);
    } else {
      this.removeAttribute(attributes.COL_SPAN_XXL);
    }
  }

  get colSpanXxl(): string | null | any {
    return this.getAttribute(attributes.COL_SPAN_XXL);
  }

  set rowSpan(value: string | null | any) {
    if (value !== null) {
      this.setAttribute(attributes.ROW_SPAN, value);
    } else {
      this.removeAttribute(attributes.ROW_SPAN);
    }
  }

  get rowSpan(): string | null | any {
    return this.getAttribute(attributes.ROW_SPAN);
  }

  set height(value: string | null | any) {
    if (value !== null) {
      this.setAttribute('height', value);
    } else {
      this.removeAttribute('height');
    }
  }

  get height(): string | null | any {
    return this.getAttribute('height');
  }

  set fill(value: string | null | any) {
    if (value !== null) {
      this.setAttribute('fill', value);
    } else {
      this.removeAttribute('fill');
    }
  }

  get fill(): string | null | any {
    return this.getAttribute('fill');
  }

  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): any {
    return [
      attributes.COL_SPAN,
      attributes.COL_SPAN_XS,
      attributes.COL_SPAN_SM,
      attributes.COL_SPAN_MD,
      attributes.COL_SPAN_LG,
      attributes.COL_SPAN_XL,
      attributes.COL_SPAN_XXL,
      attributes.ROW_SPAN
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.settings();
  }

  private settings() {
    this.classList.add('grid-cell');
    this.setColSpan();
    this.setRowSpan();
    this.setFill();
    this.setHeight();
  }

  private setColSpan() {
    if (this.colSpan !== null) {
      this.classList.add(`span-${this.colSpan}`);
    }

    if (this.colSpanXs !== null) {
      this.classList.add(`span-xs-${this.colSpanXs}`);
    }

    if (this.colSpanSm !== null) {
      this.classList.add(`span-sm-${this.colSpanSm}`);
    }

    if (this.colSpanMd !== null) {
      this.classList.add(`span-md-${this.colSpanMd}`);
    }

    if (this.colSpanLg !== null) {
      this.classList.add(`span-lg-${this.colSpanLg}`);
    }

    if (this.colSpanXl !== null) {
      this.classList.add(`span-xl-${this.colSpanXl}`);
    }

    if (this.colSpanXxl !== null) {
      this.classList.add(`span-xxl-${this.colSpanXxl}`);
    }
  }

  private setRowSpan() {
    if (this.rowSpan !== null) {
      this.classList.add(`row-span-${this.rowSpan}`);
    }
  }

  private setHeight() {
    if (this.height !== null) {
      this.classList.add(`height-${this.height}`);
    }
  }

  private setFill() {
    if (this.fill !== null) {
      this.classList.add('fill');
    }
  }

  template(): string {
    return `<slot></slot>`;
  }
}

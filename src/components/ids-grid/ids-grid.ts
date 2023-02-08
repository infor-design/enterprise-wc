import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import styles from './ids-grid.scss';
const BREAKPOINTS = ['', 'xs', 'sm', 'md', 'lg', 'xl'];

/**
 * IDS Grid Component
 * @type {IdsGrid}
 * @inherits IdsElement
 */
@customElement('ids-grid')
@scss(styles)
export default class IdsGrid extends IdsElement {
  set cols(value: string | null) {
    if (value) {
      this.setAttribute(attributes.COLS, value);
    } else {
      this.removeAttribute(attributes.COLS);
    }
  }

  get cols(): string | null { return this.getAttribute(attributes.COLS); }

  set colsXs(value: string | null) {
    if (value) {
      this.setAttribute('cols-xs', value);
    } else {
      this.removeAttribute('cols-xs');
    }
  }

  get colsXs(): string | null { return this.getAttribute('cols-xs'); }

  set colsSm(value: string | null) {
    if (value) {
      this.setAttribute('cols-sm', value);
    } else {
      this.removeAttribute('cols-sm');
    }
  }

  get colsSm(): string | null { return this.getAttribute('cols-sm'); }

  set colsMd(value: string | null) {
    if (value) {
      this.setAttribute('cols-md', value);
    } else {
      this.removeAttribute('cols-md');
    }
  }

  get colsMd(): string | null { return this.getAttribute('cols-md'); }

  set colsLg(value: string | null) {
    if (value) {
      this.setAttribute('cols-lg', value);
    } else {
      this.removeAttribute('cols-lg');
    }
  }

  get colsLg(): string | null { return this.getAttribute('cols-lg'); }

  set colsXl(value: string | null) {
    if (value) {
      this.setAttribute('cols-xl', value);
    } else {
      this.removeAttribute('cols-xl');
    }
  }

  get colsXl(): string | null { return this.getAttribute('cols-xl'); }

  set minColWidth(value: string | null) {
    if (value) {
      this.setAttribute('min-col-width', value);
    }
  }

  get minColWidth(): string | null {
    return this.getAttribute('min-col-width');
  }

  set maxColWidth(value: string | null) {
    if (value) {
      this.setAttribute('max-col-width', value);
    }
  }

  get maxColWidth(): string | null {
    return this.getAttribute('max-col-width');
  }

  constructor() {
    super();
  }

  static get attributes(): any {
    return [
      attributes.COLS,
      'cols-xs',
      'cols-sm',
      'cols-md',
      'cols-lg',
      'cols-xl',
      'min-col-width',
      'max-col-width'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.settings();
    this.getColumns('cols');
  }

  // Loop through all of the breakpoints to see if the media query
  // matches and grab the column value from the relevant prop if so
  private getColumns(property: string) {
    let matched;

    for (const breakpoint of BREAKPOINTS) {
      // Grab the value of the property, if it exists and our
      // media query matches we return the value
      const columns = (this as any)[property + breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)];

      if (columns !== undefined) {
        matched = columns;
      }
    }

    // Return the last matched columns since the breakpoints
    // increase in size and we want to return the largest match
    console.log(matched);
    return matched;
  }

  private settings() {
    this.classList.add('grid');
    this.setColumns();
    this.setMinMaxWidth();
  }

  private setColumns() {
    if (this.cols !== null) {
      this.classList.add(`grid-cols-${this.cols}`);
    }

    if (this.colsXs !== null) {
      this.classList.add(`grid-cols-xs-${this.colsXs}`);
    }

    if (this.colsSm !== null) {
      this.classList.add(`grid-cols-sm-${this.colsSm}`);
    }

    if (this.colsMd !== null) {
      this.classList.add(`grid-cols-md-${this.colsMd}`);
    }

    if (this.colsLg !== null) {
      this.classList.add(`grid-cols-lg-${this.colsLg}`);
    }

    if (this.colsXl !== null) {
      this.classList.add(`grid-cols-xl-${this.colsXl}`);
    }
  }

  private setMinMaxWidth() {
    if (this.minColWidth !== null) {
      this.style.setProperty('--min-col-width', `${this.minColWidth}`);
    }

    if (this.maxColWidth !== null) {
      this.style.setProperty('--max-col-width', `${this.maxColWidth}`);
    }
  }

  template(): string {
    return `<slot></slot>`;
  }
}

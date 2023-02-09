import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import styles from './ids-grid.scss';

const gridSizes = [
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

/**
 * IDS Grid Component
 * @type {IdsGrid}
 * @inherits IdsElement
 */
@customElement('ids-grid')
@scss(styles)
export default class IdsGrid extends IdsElement {
  set cols(value: string | null) {
    if (value !== null) {
      this.setAttribute(attributes.COLS, value);
    } else {
      this.removeAttribute(attributes.COLS);
    }
  }

  get cols(): string | null { return this.getAttribute(attributes.COLS); }

  set colsXs(value: string | null) {
    if (value !== null) {
      this.setAttribute('cols-xs', value);
    } else {
      this.removeAttribute('cols-xs');
    }
  }

  get colsXs(): string | null { return this.getAttribute('cols-xs'); }

  set colsSm(value: string | null) {
    if (value !== null) {
      this.setAttribute('cols-sm', value);
    } else {
      this.removeAttribute('cols-sm');
    }
  }

  get colsSm(): string | null { return this.getAttribute('cols-sm'); }

  set colsMd(value: string | null) {
    if (value !== null) {
      this.setAttribute('cols-md', value);
    } else {
      this.removeAttribute('cols-md');
    }
  }

  get colsMd(): string | null { return this.getAttribute('cols-md'); }

  set colsLg(value: string | null) {
    if (value !== null) {
      this.setAttribute('cols-lg', value);
    } else {
      this.removeAttribute('cols-lg');
    }
  }

  get colsLg(): string | null { return this.getAttribute('cols-lg'); }

  set colsXl(value: string | null) {
    if (value !== null) {
      this.setAttribute('cols-xl', value);
    } else {
      this.removeAttribute('cols-xl');
    }
  }

  get colsXl(): string | null { return this.getAttribute('cols-xl'); }

  set colsXxl(value: string | null) {
    if (value !== null) {
      this.setAttribute('cols-xxl', value);
    } else {
      this.removeAttribute('cols-xxl');
    }
  }

  get colsXxl(): string | null { return this.getAttribute('cols-xxl'); }

  set minColWidth(value: string | null) {
    if (value !== null) {
      this.setAttribute('min-col-width', value);
    }
  }

  get minColWidth(): string | null {
    return this.getAttribute('min-col-width');
  }

  set maxColWidth(value: string | null) {
    if (value !== null) {
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
      'cols-xxl',
      'min-col-width',
      'max-col-width'
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
  }

  private setColumns() {
    for (const { size, className } of gridSizes) {
      if (this[size] !== null) {
        this.classList.add(`${className}-${this[size]}`);
      }
    }
  }

  private setMinMaxWidth() {
    for (const { setting, varName } of minMaxWidths) {
      if (this[setting] !== null) {
        this.style.setProperty(varName, this[setting]);
      }
    }
  }

  template(): string {
    return `<slot></slot>`;
  }
}

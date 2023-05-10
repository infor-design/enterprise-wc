import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber, camelCase } from '../../utils/ids-string-utils/ids-string-utils';
import { HOME_PAGE_DEFAULTS, EVENTS } from './ids-home-page-attributes';

import '../ids-card/ids-card';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-home-page.scss';

const Base = IdsLocaleMixin(
  IdsEventsMixin(
    IdsElement
  )
);

export interface IdsHomePageBlock {
  /** The block width */
  w: number;
  /** The block height */
  h: number;
  /** The block x postion */
  x: number;
  /** The block x postion */
  y: number;
}

export interface IdsHomePageAavailable {
  /** The row element */
  row: number;
  /** The column element */
  col: number;
}

/**
 * IDS Home Page Component
 * @type {IdsHomePage}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @part home-page - The home-page element
 * @part cards - The cards element
 */
@customElement('ids-home-page')
@scss(styles)
export default class IdsHomePage extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.#init();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ANIMATED,
      attributes.CARD_HEIGHT,
      attributes.CARD_WIDTH,
      attributes.COLS,
      attributes.GAP,
      attributes.GAP_X,
      attributes.GAP_Y
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <div class="ids-home-page" part="home-page">
        <div class="cards" part="cards">
          <slot name="card"></slot>
        </div>
      </div>`;
  }

  /**
   * Refresh will resize calculations to update any changes.
   * @param {boolean} animated False will disable animation during refresh
   * @returns {void}
   */
  refresh(animated?: boolean): void {
    this.#resize(animated);
  }

  /**
   * List of blocks to manage cards width/height and position.
   * @private
   */
  #blocks: Array<any> = [];

  /**
   * List of cards attached to home page.
   * @private
   */
  #cards: Node[] = [];

  /**
   * Number of current columns.
   * @private
   */
  #columns = 0;

  /**
   * Container current height.
   * @private
   */
  #containerHeight = 0;

  /**
   * Column gap
   * @private
   */
  #gapX = 0;

  /**
   * Row gap
   * @private
   */
  #gapY = 0;

  /**
   * Keep all the blocks as rows and columns.
   * @private
   */
  #rowsAndCols: Array<any> = [];

  /**
   * Attach the resize observer.
   * @private
   */
  #resizeObserver = new ResizeObserver(() => this.#resize());

  /**
   * Initialize the component
   * @private
   * @returns {void}
   */
  #init(): void {
    this.#setGap();
    this.#initCards();
    this.#resize();
    this.#attachEventHandlers();
  }

  /**
   * Initialize attached cards.
   * @private
   * @returns {object} This API object for chaining
   */
  #initCards(): object {
    this.#cards = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="card"]')?.assignedNodes() ?? [];

    this.#cards.forEach((card: any) => {
      const colspan = this.#getNumberVal('colspan', card);
      const rowspan = this.#getNumberVal('rowspan', card);
      const w = colspan > 0 ? colspan : 1;
      const h = rowspan > 0 ? rowspan : 1;
      card.style.width = `${(this.cardWidth * w) + (this.#gapX * (w - 1))}px`;
      card.style.height = `${(this.cardHeight * h) + (this.#gapY * (h - 1))}px`;
      card.autoFit = true; // set to fit 100% width/height
    });

    return this;
  }

  /**
   * Initialize rows and cols.
   * @private
   * @returns {void}
   */
  #initRowsAndCols(): void {
    this.#rowsAndCols = [];
    this.#initColumns();
  }

  /**
   * Initialize columns.
   * @private
   * @param {number} row to be initialize.
   * @returns {void}
   */
  #initColumns(row = 0): void {
    this.#rowsAndCols[row] = [];

    for (let i = 0, l = this.#columns; i < l; i++) {
      this.#rowsAndCols[row][i] = true; // Make all columns available in first row[true]
    }
  }

  /**
   * Set the gap between each card,
   * will look into three values gap, gap-x, gap-y to sync into gapX and gapY
   * will not use the gap value if used gap along with gap-x or/and gap-y
   * for example if user add gap="10", gap-x="15" then will use the gap-x value,
   * but gap-y will be use as gap value, it will be { x: 15, y: 10 }
   * since the gap, gap-x, gap-y all three default values "20"
   * @private
   * @returns {object} This API object for chaining
   */
  #setGap(): object {
    const d = HOME_PAGE_DEFAULTS;
    const gap: any = this.gap;
    const gapX: any = this.gapX;
    const gapY: any = this.gapY;
    let x = d.gapX;
    let y = d.gapY;

    if (gap !== null && gapX === null && gapY === null) {
      x = stringToNumber(gap);
      y = stringToNumber(gap);
    } else if (gap === null && gapX !== null && gapY === null) {
      x = stringToNumber(gapX);
    } else if (gap === null && gapX === null && gapY !== null) {
      y = stringToNumber(gapY);
    } else if (gap !== null && gapX !== null && gapY === null) {
      x = stringToNumber(gapX);
      y = stringToNumber(gap);
    } else if (gap !== null && gapX === null && gapY !== null) {
      x = stringToNumber(gap);
      y = stringToNumber(gapY);
    } else if (gapX !== null && gapY !== null) {
      x = stringToNumber(gapX);
      y = stringToNumber(gapY);
    }

    this.#gapX = x;
    this.#gapY = y;

    return this;
  }

  /**
   * Refresh the gap to set gap and cards
   * @private
   * @returns {void}
   */
  #refreshGap(): void {
    this.#setGap();
    this.#resize();
  }

  /**
   * Setup each block sizes, based on card width and height provided from markup
   * @private
   * @returns {void}
   */
  #setBlocks(): void {
    this.#blocks = [];

    this.#cards.forEach((card: any) => {
      const colspan = this.#getNumberVal('colspan', card);
      const rowspan = this.#getNumberVal('rowspan', card);
      const w = colspan > 0 ? colspan : 1;
      const h = rowspan > 0 ? rowspan : 1;
      this.#blocks.push({ w, h, elem: card });
    });

    // Max sized columns brings to top
    if (this.#columns > 1) {
      for (let i = 0, j = 0, w = 0, l = this.#blocks.length; i < l; i++) {
        if (this.#blocks[i].w >= this.#columns && i
          && w && (w <= (this.#columns / 2))) {
          this.#arrayIndexMove(this.#blocks, i, j);
        }
        w += this.#blocks[i].w;
        if (w >= this.#columns) {
          w = 0; // reset
          j = (this.#blocks[j].w >= this.#columns) ? j + 1 : i; // record to move
        }
      }
    }
  }

  /**
   * Move an array element position
   * @private
   * @param {Array} arr The array
   * @param {number} from index
   * @param {number} to index
   * @returns {void}
   */
  #arrayIndexMove(arr: Array<any>, from: number, to: number): void {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
  }

  /**
   * Make all spots as unavailable, depends on block's width and height
   * Soon we used this block
   * @private
   * @param {number} r as row.
   * @param {number} c as col.
   * @param {IdsHomePageBlock} block to fit.
   * @returns {void}
   */
  #fitBlock(r: number, c: number, block: IdsHomePageBlock): void {
    let addRow = true;

    block.x = c;
    block.y = r;

    if ((block.w === 1) && (block.h === 1)) { // Single block can fit anywhere
      this.#rowsAndCols[r][c] = false;
    } else if (block.w !== 1) {
      // If more then one row or column then loop thru to block's width and height
      // If height is more then current rows then add new row
      // Mark those spots as unavailable[false]

      // Left to right
      for (let i = r, l = block.h + r; i < l; i++) {
        for (let j = c, l2 = block.w + c; j < l2; j++) {
          if (!this.#rowsAndCols[i]) {
            this.#initColumns(i);
          }
          this.#rowsAndCols[i][j] = false;
        }
      }
    } else {
      // Top to bottom
      for (let i = r, l = block.h + r; i < l; i++) {
        for (let j = c, l2 = block.h + c; j < l2; j++) {
          if (!this.#rowsAndCols[i]) {
            this.#initColumns(i);
          }
          this.#rowsAndCols[i][c] = false;
        }
      }
    }

    // Check if reach to end of columns then assign flag[addRow]
    for (let i = 0, l = this.#rowsAndCols[r].length; i < l; i++) {
      if (this.#rowsAndCols[r][i]) {
        addRow = false;
      }
    }

    // If reach to end of columns and next row is not avaiable then add new row
    // Make all columns available, if not assigned earlier as unavailable
    if (addRow) {
      if (!this.#rowsAndCols[r + 1]) {
        this.#initColumns(r + 1);
      }
    }
  }

  /**
   * Get availability where we can fit this given block.
   * @private
   * @param {IdsHomePageBlock} block to get availability.
   * @returns {IdsHomePageAavailable} [x and y] where we can fit this block
   */
  #getAvailability(block: IdsHomePageBlock): IdsHomePageAavailable {
    let abort = false;
    const smallest: any = {};
    const rows = this.#rowsAndCols.length;

    // Loop thru each row and column soon it found first available spot
    // Then check for if block's width can fit in(yes), asign to [smallest] and break both loops
    for (let i = 0, l = rows; i < l && !abort; i++) {
      for (
        let j = 0, innerCheck = true, cols = this.#rowsAndCols[i].length;
        j < cols && !abort;
        j++
      ) {
        if ((this.#rowsAndCols[i][j]) && ((block.w + j) <= cols)) {
          if ((block.w > 1) && (cols > (j + 1))) {
            for (let n = 0; n < block.w; n++) {
              if (!this.#rowsAndCols[i][j + n]) {
                innerCheck = false;
                break;
              }
            }
          }
          if ((block.h > 1) && (rows > (i + 1))) {
            for (let n = 0; n < block.h; n++) {
              if (!this.#rowsAndCols[i + n][j]) {
                innerCheck = false;
                break;
              }
            }
          }
          if (innerCheck) {
            smallest.row = i;
            smallest.col = j;
            abort = true;
          }
        }
      }
    }

    // If did not found any available spot from previous loops
    // Add new row and asign to [smallest] first column in this new row
    if (!Object.getOwnPropertyNames(smallest).length) {
      this.#initColumns(rows);
      smallest.row = rows;
      smallest.col = 0;
    }

    return smallest; // {x:0, y:0}
  }

  /**
   * Apply cubic-bezier effects
   * @private
   * @param {any} elem The element.
   * @param {string} effect effect to apply.
   * @returns {void}
   */
  #applyCubicBezier(elem: any, effect: string): void {
    const value = effect ? `all .3s cubic-bezier(${effect})` : 'none';
    elem.style['-webkit-transition'] = value;
    elem.style['-moz-transition'] = value;
    elem.style['-ms-transition'] = value;
    elem.style['-o-transition'] = value;
    elem.style.transition = value;
  }

  /**
   * Resize and adjust width/height for cards
   * @private
   * @param {boolean} animated False will disable animation during refresh
   * @returns {object} This API object for chaining
   */
  #resize(animated = this.animated) {
    window.requestAnimationFrame(() => {
      this.#columns = 0;
      const cardWidth = this.cardWidth;
      const gapX = this.#gapX;
      // Sizes of "breakpoints" is  320, 660, 1000, 1340, 1680 (for 320)
      // or 360, 740, 1120, 1500, 1880 or (for 360)
      const bpXl3 = (cardWidth * 6) + (gapX * 5);
      const bpXl2 = (cardWidth * 5) + (gapX * 4);
      const bpXl = (cardWidth * 4) + (gapX * 3);
      const bpDesktop = (cardWidth * 3) + (gapX * 2);
      const bpTablet = (cardWidth * 2) + gapX;
      const bpPhone = cardWidth;

      let bp = bpXl3; // 2260 = ((360 * 6) + (20 * 5))
      const elemWidth = this.container?.offsetWidth ?? NaN;

      // Find the Breakpoints
      const xl3 = (elemWidth >= bpXl3);
      const xl2 = (elemWidth >= bpXl2 && elemWidth <= bpXl3);
      const xl = (elemWidth >= bpXl && elemWidth <= bpXl2);
      const desktop = (elemWidth >= bpDesktop && elemWidth <= bpXl);
      const tablet = (elemWidth >= bpTablet && elemWidth <= bpDesktop);
      const phone = (elemWidth <= bpTablet);

      // Assign columns as breakpoint sizes
      let columns = 0;
      if (xl3 || this.cols === 6) {
        columns = 6;
        bp = bpXl3;
      }
      if (xl2 || this.cols === 5) {
        columns = 5;
        bp = bpXl2;
      }
      if (xl || this.cols === 4) {
        columns = 4;
        bp = bpXl;
      }
      if (desktop || this.cols === 3) {
        columns = 3;
        bp = bpDesktop;
      }
      if (tablet || this.cols === 2) {
        columns = 2;
        bp = bpTablet;
      }
      if (phone || this.cols === 1) {
        columns = 1;
        bp = bpPhone;
      }

      // Calculated columns
      this.#columns = columns;

      const cardsEl = this.shadowRoot?.querySelector<HTMLElement>('.cards');
      cardsEl?.style.setProperty('margin-left', `-${(bp / 2)}px`);

      this.#setBlocks(); // setup blocks
      this.#initRowsAndCols(); // setup columns

      let rowsCounter = 0;

      // Loop thru each block, make fit where available and
      // If block more wider than available size, make as available size
      // Assign new left and top css positions
      for (let i = 0, l = this.#blocks.length; i < l; i++) {
        const block = this.#blocks[i];
        const setWidth = (span: number) => {
          block.elem.style.width = `${(this.cardWidth * span) + (this.#gapX * (span - 1))}px`;
        };
        let colspan = this.#getNumberVal('colspan', block.elem);
        colspan = colspan > 0 ? colspan : 1;
        setWidth(colspan);

        // If block more wider than available size, make as available size
        if (block.w > this.#columns) {
          block.w = this.#columns;
          setWidth(this.#columns);
        }

        // Get Availability
        const available: IdsHomePageAavailable = this.#getAvailability(block);

        // Set positions
        const box = this.cardWidth + this.#gapX;
        const totalWidth = box * this.#columns;
        const top = (this.cardHeight + this.#gapY) * available.row;
        const left = this.localeAPI?.isRTL()
          ? totalWidth - ((box * block.w) + (box * available.col))
          : box * available.col;
        const pos = { left, top };

        const blockslide: any = animated ? [0.09, 0.11, 0.24, 0.91] : null;
        this.#applyCubicBezier(block.elem, blockslide);
        block.elem.style.left = `${pos.left}px`;
        block.elem.style.top = `${pos.top}px`;

        // Mark all spots as unavailable for this block, as we just used this one
        this.#fitBlock(available.row, available.col, block);
        rowsCounter = available.row + 1;
      }

      // Set container height
      this.#containerHeight = (this.cardHeight + this.#gapY) * rowsCounter;
      this.container?.style.setProperty('height', `${this.#containerHeight}px`);

      // Fires after the page is resized and layout is set
      this.triggerEvent(EVENTS.resized, this, { detail: { elem: this, ...this.status } });
    });

    return this;
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} This API object for chaining
   */
  #attachEventHandlers(): object {
    const slot = this.shadowRoot?.querySelector(`slot[name="card"]`);
    this.offEvent('slotchange', slot);
    this.onEvent('slotchange', slot, () => {
      this.#init();
    });

    // Set observer for resize
    this.#resizeObserver.disconnect();
    if (this.container) this.#resizeObserver.observe(this.container);
    return this;
  }

  /** Handle Languages Changes */
  onLanguageChange = () => {
    this.#resize();
  };

  /**
   * Get the boolean value for given attribute.
   * @private
   * @param {string} attr The attribute name to get the value.
   * @param {any} defaultVal The default value if not found in list.
   * @returns {any} The value
   */
  #getDefaultVal(attr: string, defaultVal: any): any {
    const val = (HOME_PAGE_DEFAULTS as any)[camelCase(attr)];
    return typeof val !== 'undefined' ? val : defaultVal;
  }

  /**
   * Check the given value is boolean.
   * @param {boolean|string} val The value.
   * @returns {boolean} true if the value boolean
   */
  #isBool(val: boolean | string | null): boolean {
    return val === true || val === 'true' || val === false || val === 'false';
  }

  /**
   * Get the boolean value for given attribute.
   * @private
   * @param {string} attr The attribute name to get the value.
   * @param {HTMLElement} elem The element.
   * @returns {boolean} The value
   */
  #getBoolVal(attr: string, elem = this): boolean {
    const val = elem.getAttribute(attr);
    return val !== null ? stringToBool(val) : this.#getDefaultVal(attr, false);
  }

  /**
   * Get the number value for given attribute.
   * @private
   * @param {string} attr The attribute name to get the value.
   * @param {HTMLElement} elem The element.
   * @returns {number} The value
   */
  #getNumberVal(attr: string, elem = this): number {
    let val: string | number | null = elem.getAttribute(attr);
    if (val === null) return this.#getDefaultVal(attr, 0);
    val = stringToNumber(val);
    return val > 0 ? val : this.#getDefaultVal(attr, 0);
  }

  /**
   * Get the current status of home page
   * @returns {object} containing information about the current status of the home page
   */
  get status(): object {
    let rows = this.#rowsAndCols.length;
    const cols = rows ? this.#rowsAndCols[0].length : 0;

    const lastRow = this.#rowsAndCols[rows - 1];
    if (lastRow?.indexOf(false) === -1) {
      rows -= 1;
    }

    return {
      rows,
      cols,
      containerHeight: this.#containerHeight,
      blocks: this.#blocks
    };
  }

  /**
   * Set to animated or not the home page cards on resize.
   * @param {boolean|string} value If true, allows animate the home page cards.
   */
  set animated(value: boolean | string | null) {
    if (this.#isBool(value)) {
      this.setAttribute(attributes.ANIMATED, String(value));
    } else {
      this.removeAttribute(attributes.ANIMATED);
    }
  }

  get animated() { return this.#getBoolVal(attributes.ANIMATED); }

  /**
   * Set card height for single span
   * @param {number|string} value The height
   */
  set cardHeight(value: number | string | null) {
    if (value) {
      this.setAttribute(attributes.CARD_HEIGHT, String(value));
    } else {
      this.removeAttribute(attributes.CARD_HEIGHT);
    }
  }

  get cardHeight(): number { return this.#getNumberVal(attributes.CARD_HEIGHT); }

  /**
   * Set card width for single span
   * @param {number|string} value The width
   */
  set cardWidth(value: number | string | null) {
    if (value) {
      this.setAttribute(attributes.CARD_WIDTH, String(value));
    } else {
      this.removeAttribute(attributes.CARD_WIDTH);
    }
  }

  get cardWidth(): number { return this.#getNumberVal(attributes.CARD_WIDTH); }

  /**
   * Set number of columns to display
   * @param {number|string} value Number of columns
   */
  set cols(value: number | string | null) {
    if (value) {
      this.setAttribute(attributes.COLS, String(value));
    } else {
      this.removeAttribute(attributes.COLS);
    }
  }

  get cols() { return this.#getNumberVal(attributes.COLS); }

  /**
   * Set card gap for single span, apply same for both horizontal and vertical sides
   * @param {number|string} value The row gap
   */
  set gap(value: number | string | null) {
    if (value) {
      this.setAttribute(attributes.GAP, String(value));
    } else {
      this.removeAttribute(attributes.GAP);
    }
    this.#refreshGap();
  }

  get gap() { return this.getAttribute(attributes.GAP); }

  /**
   * Set card horizontal gap for single span
   * @param {number|string} value The gap-x
   */
  set gapX(value: number | string | null) {
    if (value) {
      this.setAttribute(attributes.GAP_X, String(value));
    } else {
      this.removeAttribute(attributes.GAP_X);
    }
    this.#refreshGap();
  }

  get gapX() { return this.getAttribute(attributes.GAP_X); }

  /**
   * Set card vertical gap for single span
   * @param {number|string} value The gap-y
   */
  set gapY(value: number | string | null) {
    if (value) {
      this.setAttribute(attributes.GAP_Y, String(value));
    } else {
      this.removeAttribute(attributes.GAP_Y);
    }
    this.#refreshGap();
  }

  get gapY() { return this.getAttribute(attributes.GAP_Y); }
}

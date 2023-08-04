import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import styles from './ids-box.scss';

/**
 * IDS Box Component
 * @type {IdsBox}
 * @inherits IdsElement
 * @part box - the box container element
 */
@customElement('ids-box')
@scss(styles)
export default class IdsBox extends IdsElement {
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
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.ACTIONABLE,
      attributes.BACKGROUND_COLOR,
      attributes.BORDERLESS,
      attributes.BORDER_RADIUS,
      attributes.HEIGHT,
      attributes.PADDING_X,
      attributes.PADDING_Y,
      attributes.SHADOWED,
      attributes.SELECTED,
      attributes.WIDTH
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return '<div class="ids-box" part="box"><slot></slot></div>';
  }

  /**
   * If actionable the box can be toggled trigging a state
   * @param {boolean} value set to true for actionable
   */
  set actionable(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.ACTIONABLE, value.toString());
      this.container?.classList.add('is-actionable');
    } else {
      this.removeAttribute(attributes.ACTIONABLE);
      this.container?.classList.remove('is-actionable');
    }
  }

  get actionable(): boolean {
    return stringToBool(this.getAttribute(attributes.ACTIONABLE));
  }

  /**
   * Set the background color (as a css variable)
   * @param {string|null} value css color variable is used
   */
  set backgroundColor(value: string | null) {
    if (value) {
      this.setAttribute(attributes.BACKGROUND_COLOR, value);
      this.container?.style.setProperty('background-color', `var(${value})`);
    } else {
      this.removeAttribute(attributes.BACKGROUND_COLOR);
      this.container?.style.removeProperty('background-color');
    }
  }

  get backgroundColor(): string | null {
    return this.getAttribute(attributes.BACKGROUND_COLOR);
  }

  /**
   * Turns off the borders
   * @param {boolean|null} value Set to false to turn off borders
   */
  set borderless(value: boolean | null) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.BORDERLESS, 'true');
      this.container?.classList.add('borderless');
    } else {
      this.removeAttribute(attributes.BORDERLESS);
      this.container?.classList.remove('borderless');
    }
  }

  get borderless(): boolean | null {
    return stringToBool(this.getAttribute(attributes.BORDERLESS));
  }

  /**
   * Sets the border radius beyond the default
   * @param {number|null} value Radius to use
   */
  set borderRadius(value: number | null) {
    if (value) {
      this.setAttribute(attributes.BORDER_RADIUS, 'true');
      this.container?.style.setProperty('border-radius', value.toString());
    } else {
      this.removeAttribute(attributes.BORDER_RADIUS);
      this.container?.style.removeProperty('border-radius');
    }
  }

  get borderRadius(): number | null {
    return Number(this.getAttribute(attributes.BORDER_RADIUS)) || 4;
  }

  /**
   * Sets a width in pixels or percent
   * @param {string} value The width in pixels or as a percent
   */
  set width(value: string) {
    value = value?.replace('px', '');
    if (value) {
      this.setAttribute(attributes.WIDTH, value);
      this.container?.style.setProperty('width', `${value}${value?.indexOf('%') === -1 ? 'px' : ''}`);
    } else {
      this.removeAttribute(attributes.WIDTH);
      this.container?.style.removeProperty('width');
    }
  }

  get width(): string {
    return this.getAttribute(attributes.WIDTH) || '';
  }

  /**
   * Set a height in pixels or perct
   * @param {string} value The height in pixels or as a percent
   */
  set height(value: string) {
    value = value?.replace('px', '');
    if (value) {
      this.setAttribute(attributes.HEIGHT, value);
      this.container?.style.setProperty('height', `${value}${value?.indexOf('%') === -1 ? 'px' : ''}`);
    } else {
      this.removeAttribute(attributes.HEIGHT);
      this.container?.style.removeProperty('height');
    }
  }

  get height(): string {
    return this.getAttribute(attributes.HEIGHT) || '';
  }

  /**
   * Turn off the border but leave the shadow
   * @param {boolean|null} value Set to false to turn off
   */
  set shadowed(value: boolean | null) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SHADOWED, 'true');
      this.container?.classList.add('shadowed');
    } else {
      this.removeAttribute(attributes.SHADOWED);
      this.container?.classList.remove('shadowed');
    }
  }

  get shadowed(): boolean | null {
    return stringToBool(this.getAttribute(attributes.SHADOWED));
  }

  /**
   * Set the x axis padding on the box contents (in pixels)
   * @param {string | null} value The value of the paddingX attribute
   */
  set paddingX(value: string | null) {
    if (!value) {
      this.removeAttribute(attributes.PADDING_X);
      this.container?.style.removeProperty('padding-block');
    } else {
      this.setAttribute(attributes.PADDING_X, value);
      this.container?.style.setProperty('padding-block', `${value}px`);
    }
  }

  /**
   * Get the x axis padding
   * @returns {string | null} The number value that represents the paddingX of the box contents
   */
  get paddingX(): string | null { return this.getAttribute(attributes.PADDING_X); }

  /**
   * Set the y axis padding on the box contents (in pixels)
   * @param {string | null} value The value of the paddingY attribute
   */
  set paddingY(value: string | null) {
    if (!value) {
      this.removeAttribute(attributes.PADDING_Y);
      this.container?.style.removeProperty('padding-inline');
    } else {
      this.setAttribute(attributes.PADDING_Y, value);
      this.container?.style.setProperty('padding-inline', `${value}px`);
    }
  }

  /**
   * Get the x axis padding
   * @returns {string | null} The number value that represents the paddingY of the box contents
   */
  get paddingY(): string | null { return this.getAttribute(attributes.PADDING_Y); }

  /**
   * Set the selected state on the box
   * @param {boolean} val true if this stat should appear "selected"
   */
  set selected(val) {
    const currentValue = this.selected;
    const isValueTruthy = stringToBool(val);

    if (currentValue !== isValueTruthy) {
      if (isValueTruthy) {
        this.setAttribute(attributes.SELECTED, `${val}`);
        this.container?.classList.add('is-selected');
      } else {
        this.removeAttribute(attributes.SELECTED);
        this.container?.classList.remove('is-selected');
      }
    }
  }

  get selected() {
    return stringToBool(this.getAttribute(attributes.SELECTED));
  }
}

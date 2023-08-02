import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsRippleMixin from '../../mixins/ids-ripple-mixin/ids-ripple-mixin';
import IdsHideFocusMixin from '../../mixins/ids-hide-focus-mixin/ids-hide-focus-mixin';
import IdsLoadingIndicatorMixin from '../../mixins/ids-loading-indicator-mixin/ids-loading-indicator-mixin';

import IdsElement from '../../core/ids-element';

import {
  BUTTON_APPEARANCE,
  BUTTON_CONTENT_ALIGNMENTS,
  BUTTON_DEFAULTS,
  BUTTON_TYPES,
  BUTTON_ATTRIBUTES,
  ICON_ALIGN_CLASSNAMES,
  baseProtoClasses
} from './ids-button-common';
import type {
  IdsButtonContentAlignment,
  IdsButtonIconAlignment,
  IdsButtonAppearance,
  IdsButtonType
} from './ids-button-common';

import styles from './ids-button.scss';
import type IdsIcon from '../ids-icon/ids-icon';
import type IdsText from '../ids-text/ids-text';

const Base = IdsTooltipMixin(
  IdsLocaleMixin(
    IdsLoadingIndicatorMixin(
      IdsRippleMixin(
        IdsColorVariantMixin(
          IdsHideFocusMixin(
            IdsEventsMixin(
              IdsElement
            )
          )
        )
      )
    )
  )
);

/**
 * IDS Button Component
 * @type {IdsButton}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsColorVariantMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsRippleMixin
 * @mixes IdsTooltipMixin
 * @mixes IdsHideFocusMixin
 * @mixes IdsLoadingIndicatorMixin
 * @part button - the button element
 * @part icon - the icon element
 * @part text - the text element
 */
@customElement('ids-button')
@scss(styles)
export default class IdsButton extends Base {
  shouldUpdate = false;

  constructor() {
    super();
    Object.keys(BUTTON_DEFAULTS).forEach((prop) => {
      this.state[prop] = BUTTON_DEFAULTS[prop];
    });

    Object.defineProperty(this, 'tabIndex', {
      get: () => this.#tabIndex,
      set: (value) => { this.#tabIndex = value; },
      configurable: true,
      enumerable: true
    });
  }

  /**
   * Button-level `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback(): void {
    super.connectedCallback();
    this.#setInitialState();
    this.shouldUpdate = true;
    if (this.getAttribute('width')) this.width = this.getAttribute('width');
  }

  #setInitialState() {
    if (this.hasAttribute(attributes.ICON)) this.appendIcon(this.getAttribute(attributes.ICON) as string);
    if (this.hasAttribute(attributes.TEXT)) this.appendText(this.getAttribute(attributes.TEXT) as string);

    this.setAriaText();

    const isIconButton = this.button?.classList.contains('ids-icon-button');
    this.setupRipple(this.button as HTMLButtonElement, isIconButton ? 35 : 50);
    if (this.hasAttribute(attributes.CONTENT_ALIGN)) this.setContentAlignClass(this.getAttribute(attributes.CONTENT_ALIGN));
    this.setIconAlignment();
    this.refreshProtoClasses();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array<string>} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [...super.attributes, ...BUTTON_ATTRIBUTES];
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate', 'alternate-formatter', 'module', 'module-nav'];

  /**
   * Figure out the classes
   * @private
   * @readonly
   * @returns {Array<string>} containing classes used to identify this button prototype
   */
  get protoClasses() {
    const textContent = this.querySelector('span:not(.audible), ids-text:not([audible])');
    const iconContent = this.iconEl;
    if (iconContent && (!textContent)) {
      return ['ids-icon-button'];
    }
    return ['ids-button'];
  }

  /**
   * Refreshes this button's prototype CSS class
   * @private
   * @returns {void}
   */
  refreshProtoClasses() {
    if (!this.button) return;
    const cl = this.button.classList;
    const newProtoClass = this.protoClasses;

    cl.remove(...baseProtoClasses);
    cl.add(...newProtoClass);
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    let cssClass = '';
    let protoClasses = '';
    let disabled = '';
    let tabIndex = 'tabindex="0"';
    let appearance = '';
    if (this.state?.cssClass) {
      cssClass = ` ${this.state.cssClass.join(' ')}`;
    }
    if (this.state?.disabled) {
      disabled = ` disabled="true"`;
    }
    if (this.state?.tabIndex) {
      tabIndex = `tabindex="${this.state.tabIndex}"`;
    }
    if (this.state && this.state?.appearance !== 'default') {
      appearance = ` btn-${this.state.appearance}`;
    }

    if (this.hasAttribute(attributes.SQUARE)) {
      cssClass += ' square';
    }

    if (this.hasAttribute(attributes.NO_PADDING)) {
      cssClass += ' no-padding';
    }

    if (this.protoClasses.length) {
      protoClasses = `${this.protoClasses.join(' ')}`;
    }

    let alignCSS = '';
    if (this.state?.iconAlign) alignCSS = ` align-icon-${this.state?.iconAlign}`;

    return `<button part="button" class="${protoClasses}${appearance}${alignCSS}${cssClass}" ${tabIndex}${disabled}>
      <slot></slot>
      <slot name="loading-indicator"></slot>
    </button>`;
  }

  /**
   * Handles hidden attribute changes
   * @param {string} value true if hidden
   */
  onHiddenChange(value: string | boolean | null) {
    const bool = stringToBool(value);
    this.shouldUpdate = false;
    if (bool) {
      this.setAttribute(attributes.HIDDEN, '');
    } else {
      this.removeAttribute(attributes.HIDDEN);
    }
    this.shouldUpdate = true;
    this.state.hidden = bool;
    if (this.button) this.button.hidden = bool;
  }

  private setAriaText() {
    if (this.container) {
      this.container.setAttribute(htmlAttributes.ARIA_LABEL, this.text?.trim() || 'Button');
    }
  }

  /**
   * @readonly
   * @returns {HTMLButtonElement} reference to the true button element used in the Shadow Root
   */
  get button(): HTMLButtonElement | null {
    return this.shadowRoot?.querySelector('button') || null;
  }

  /**
   * Set the button content alignment between 'default (center)', 'start', or 'end'
   * @param {IdsButtonContentAlignment | null} val a valid button content alignment strategy
   */
  set contentAlign(val: IdsButtonContentAlignment | null) {
    if (!val || BUTTON_CONTENT_ALIGNMENTS.indexOf(val) <= 0) {
      this.removeAttribute(attributes.CONTENT_ALIGN);
      this.state.contentAlign = BUTTON_CONTENT_ALIGNMENTS[0];
    } else {
      this.setAttribute(attributes.CONTENT_ALIGN, val);
      if (this.state.contentAlign !== val) this.state.contentAlign = val;
    }
    this.setContentAlignClass(val);
  }

  /**
   * @returns {IdsButtonContentAlignment} the currently set content alignment
   */
  get contentAlign(): IdsButtonContentAlignment {
    return this.state.appearance;
  }

  /**
   * Sets the correct content alignment class on the ShadowRoot button.
   * @private
   * @param {string | null} val desired content alignment class
   */
  setContentAlignClass(val: string | null) {
    if (this.button) {
      BUTTON_CONTENT_ALIGNMENTS.forEach((app) => {
        const appClassName = `content-align-${app}`;
        if (val === app) {
          if (app !== 'default' && !this.button?.classList.contains(appClassName)) {
            this.button?.classList.add(appClassName);
          }
          return;
        }
        if (this.button?.classList.contains(appClassName)) {
          this.button?.classList.remove(appClassName);
        }
      });
    }
  }

  /**
   * @param {Array<string>|string} val containing CSS classes that will be applied to the button
   * Strings will be split into an array and separated by whitespace.
   */
  set cssClass(val: Array<string> | string) {
    let attr = val;
    let newCl: any[] = [];
    // @TODO replace with clone utils method
    const prevClasses = [].concat(this.state.cssClass);

    if (Array.isArray(val)) {
      newCl = val;
      attr = val.join(' ');
    } else if (typeof val === 'string' && val.length) {
      newCl = val.split(' ');
    }

    this.state.cssClass = newCl;
    if (newCl.length) {
      this.setAttribute(attributes.CSS_CLASS, attr.toString());
    } else {
      this.removeAttribute(attributes.CSS_CLASS);
    }

    // Remove/Set CSS classes on the actual inner Button component
    if (!this.button) return;

    const buttonCl = this.button.classList;
    const buttonClArr = Array.from(buttonCl);
    prevClasses.forEach((cssClass) => {
      if (!newCl.includes(cssClass)) {
        buttonCl.remove(cssClass);
      }
    });
    newCl.forEach((newCssClass) => {
      if (!buttonClArr.includes(newCssClass)) {
        buttonCl.add(newCssClass);
      }
    });
  }

  get cssClass(): string {
    return this.state.cssClass;
  }

  /**
   * Passes a disabled attribute from the custom element to the button
   * @param {boolean|string} val true if the button will be disabled
   */
  set disabled(val: boolean | string) {
    const isValueTruthy = stringToBool(val);
    this.shouldUpdate = false;
    if (isValueTruthy) {
      this.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.shouldUpdate = true;
    this.state.disabled = isValueTruthy;
    if (this.button) this.button.disabled = isValueTruthy;
  }

  get disabled(): boolean {
    return this.state.disabled;
  }

  /**
   * Passes a tabIndex attribute from the custom element to the button
   * @param {number | string | null} val the tabIndex value
   */
  set #tabIndex(val: number | string | null) {
    const trueVal = Number(val);

    this.removeAttribute(attributes.TABINDEX);

    if (Number.isNaN(trueVal) || trueVal < -1) {
      this.state.tabIndex = 0;
      this.button?.setAttribute(attributes.TABINDEX, '0');
      return;
    }

    this.state.tabIndex = trueVal;
    this.button?.setAttribute(attributes.TABINDEX, `${trueVal}`);
  }

  /**
   * @returns {number} the current tabIndex number for the button
   */
  get #tabIndex(): number {
    return this.state.tabIndex;
  }

  /**
   * Sets the icon on the button
   * @param {string | undefined} val representing the icon to set
   */
  set icon(val) {
    if (typeof val !== 'string' || !val.length) {
      this.removeAttribute(attributes.ICON);
      this.state.icon = undefined;
      this.removeIcon();
      return;
    }
    this.state.icon = val;
    this.setAttribute(attributes.ICON, val);
    this.appendIcon(val);
  }

  /**
   * Gets the current icon used on the button
   * @returns {string} a defined IdsIcon's `icon` attribute, if one is present
   */
  get icon(): string | undefined | null {
    return this.iconEl?.getAttribute('icon');
  }

  /**
   * Gets the current icon element
   * @readonly
   * @returns {HTMLElement | null} a defined IdsIcon, if one is present
   */
  get iconEl(): HTMLElement | null {
    return this.querySelector('ids-icon');
  }

  /**
   * Sets the automatic alignment of an existing icon to the 'start' or 'end' of the text
   * @param {IdsButtonIconAlignment} val automatic icon alignment setting, if applicable (defaults to undefined).
   */
  set iconAlign(val: IdsButtonIconAlignment) {
    if (!ICON_ALIGN_CLASSNAMES.includes(`align-icon-${val}`)) {
      val = undefined;
    }
    this.state.iconAlign = val;
    this.setIconAlignment();
  }

  /**
   * @returns {IdsButtonIconAlignment} automatic icon alignment setting, if enabled
   */
  get iconAlign(): IdsButtonIconAlignment {
    return this.state?.iconAlign;
  }

  /**
   * Get width
   * @returns {string | null} 100%, 90px, 50rem etc.
   */
  get width(): string | null {
    return this.getAttribute(attributes.WIDTH);
  }

  /**
   * Set width of button
   * @param {string | null} w 100%, 90px, 50rem etc.
   */
  set width(w: string | null) {
    if (!w) {
      this.removeAttribute(attributes.WIDTH);
      this.style.width = '';
      if (this.button) this.button.style.width = '';
      return;
    }

    // if percentage passed set width to host
    if (w.indexOf('%') !== -1) {
      this.style.width = w;
      if (this.button) this.button.style.width = '';
    } else {
      this.style.width = '';
      if (this.button) this.button.style.width = w;
    }

    this.setAttribute(attributes.WIDTH, w);
  }

  /**
   * Check if an icon exists, and adds the icon if it's missing
   * @param {string} iconName The icon name to check
   * @private
   */
  appendIcon(iconName: string) {
    const icon = this.querySelector<IdsIcon>(`ids-icon`); // @TODO check for dropdown/expander icons here
    const align = this.iconAlign;
    const iconInsertTarget = align === 'end' ? 'beforeend' : 'afterbegin';

    if (icon) {
      if (icon.icon !== iconName) {
        icon.icon = iconName;
        this.setIconAlignment();
      }
      if (align === 'end' && this.hasIncorrectEndElement()) this.append(icon);
      else if (this.hasIncorrectStartElement()) this.prepend(icon);
    } else {
      this.insertAdjacentHTML(iconInsertTarget, `<ids-icon icon="${iconName}" class="ids-icon"></ids-icon>`);
    }

    this.refreshProtoClasses();
  }

  /**
   * Check if an icon exists, and removes the icon if it's present
   * @private
   */
  removeIcon(): void {
    const icon = this.querySelector(`ids-icon`); // @TODO check for dropdown/expander icons here

    if (icon) icon.remove();
    this.setIconAlignment();
    this.refreshProtoClasses();
  }

  /**
   * Adds/Removes Icon Alignment CSS classes to/from the inner button component.
   * @private
   */
  setIconAlignment(): void {
    if (!this.button) return;

    const alignment = this.iconAlign;
    const iconStr = this.icon;
    this.button.classList.remove(...ICON_ALIGN_CLASSNAMES);

    // Align and append the icon, if needed
    if (alignment) {
      if (iconStr) {
        this.button.classList.add(`align-icon-${alignment}`);
        const incorrectStartElement = this.hasIncorrectStartElement();
        const incorrectEndElement = this.hasIncorrectEndElement();
        if (incorrectStartElement || incorrectEndElement) this.appendIcon(iconStr);
      }
    }
  }

  /**
   * @returns {boolean} true if an icon element isn't the first child element of this button
   */
  private hasIncorrectStartElement() {
    return this.iconAlign === 'start' && !this.children[0].isEqualNode(this.iconEl);
  }

  /**
   * @returns {boolean} true if an icon element isn't the last child element of this button
   */
  private hasIncorrectEndElement() {
    return this.iconAlign === 'end' && !this.children[this.children.length - 1].isEqualNode(this.iconEl);
  }

  /**
   * @param {string | null} val the text value
   * @returns {void}
   */
  set text(val: string | null) {
    this.removeAttribute(attributes.TEXT);

    if (typeof val !== 'string' || !val.length) {
      this.state.text = '';
      this.removeText();
      return;
    }

    // @TODO: Run this through an XSS check
    this.state.text = val;
    this.appendText(val);
  }

  /**
   * @returns {string | null} the current text value
   */
  get text(): string | null {
    const textElem = this.querySelector('span:not(.audible)');
    if (textElem && textElem.textContent?.length) {
      return textElem.textContent;
    }
    return this.textContent;
  }

  /**
   * Check if the text slot exists, and appends it if it's missing
   * @param {string} val New text contents
   * @private
   */
  appendText(val: string) {
    const text = this.querySelector(`span:not(.audible)`);
    const align = this.iconAlign;
    const iconInsertTarget = align === 'end' ? 'afterbegin' : 'beforeend';

    if (text) {
      text.textContent = val;
      this.setAriaText();
      if (align === 'end' && this.hasIncorrectEndElement()) this.prepend(text);
      else if (align === 'start' && this.hasIncorrectStartElement()) this.append(text);
    } else {
      this.insertAdjacentHTML(iconInsertTarget, `<span>${val}</span>`);
    }
    this.refreshProtoClasses();
  }

  /**
   * Checks if the text slot exists, and removes it if necessary
   * @private
   */
  removeText() {
    const text = this.querySelector(`span:not(.audible)`);
    if (text) {
      text.remove();
    }
    this.refreshProtoClasses();
  }

  /**
   * Set the button appearance between 'default', 'primary', 'secondary', 'tertiary', or 'destructive'
   * @param {IdsButtonAppearance | null} val a valid button "appearance"
   */
  set appearance(val: IdsButtonAppearance | null) {
    if (!val || BUTTON_APPEARANCE.indexOf(val) <= 0) {
      this.removeAttribute(attributes.APPEARANCE);
      this.state.appearance = BUTTON_APPEARANCE[0];
    } else {
      this.setAttribute(attributes.APPEARANCE, val);
      if (this.state.appearance !== val) this.state.appearance = val;
    }
    this.setAppearanceClass(val);
  }

  /**
   * @returns {IdsButtonAppearance} the currently set appearance
   */
  get appearance(): IdsButtonAppearance {
    return this.state.appearance;
  }

  /**
   * Sets the HTMLButtonElement 'type' attribute
   */
  set type(val: IdsButtonType) {
    if (val && BUTTON_TYPES.includes(val)) {
      this.setAttribute(attributes.TYPE, val);
      this.button?.setAttribute(attributes.TYPE, val);
      if (this.state.type !== val) this.state.type = val;
    } else {
      this.removeAttribute(attributes.TYPE);
      this.button?.removeAttribute(attributes.TYPE);
      this.state.type = BUTTON_TYPES[0];
    }
  }

  /**
   * @returns {IdsButtonType} Gets the HTMLButtonElement 'type' attribute
   */
  get type(): IdsButtonType {
    return this.state.type;
  }

  /**
   * Sets the no margins attribute
   * @param {boolean | string} n string value from the no margins attribute
   */
  set noMargins(n: boolean | string) {
    if (stringToBool(n)) {
      this.setAttribute(attributes.NO_MARGINS, '');
      this.container?.classList.add(attributes.NO_MARGINS);
      return;
    }
    this.removeAttribute(attributes.NO_MARGINS);
    this.container?.classList.remove(attributes.NO_MARGINS);
  }

  get noMargins(): boolean {
    return stringToBool(this.getAttribute(attributes.NO_MARGINS));
  }

  /**
   * @param {boolean | string} val true if the button should not have standard padding rules applied
   */
  set noPadding(val: boolean | string) {
    const isTruthy = this.noPadding;
    const trueVal = stringToBool(val);
    if (isTruthy !== trueVal) {
      if (trueVal) {
        this.container?.classList.add(attributes.NO_PADDING);
        this.setAttribute(attributes.NO_PADDING, 'true');
      } else {
        this.container?.classList.remove(attributes.NO_PADDING);
        this.removeAttribute(attributes.NO_PADDING);
      }
    }
  }

  /**
   * @returns {boolean | string} true if the button does not currently have standard padding rules applied
   */
  get noPadding(): boolean | string {
    return stringToBool(this.getAttribute(attributes.NO_PADDING));
  }

  /**
   * @param {boolean} value whether the corners of the button as an icon-button should be angled/90°
   */
  set square(value: boolean) {
    const isTruthy = stringToBool(value);

    if (this.button) {
      if (isTruthy && !this.button.classList.contains('square')) {
        this.button.classList.add('square');
      } else if (!isTruthy && this.button.classList.contains('square')) {
        this.button.classList.remove('square');
      }
    }

    if (isTruthy && !this.hasAttribute(attributes.SQUARE)) {
      this.setAttribute(attributes.SQUARE, '');
    } else if (!isTruthy && this.hasAttribute(attributes.SQUARE)) {
      this.removeAttribute(attributes.SQUARE);
    }
  }

  /**
   * @returns {boolean} whether the corners of the button as an icon-button are angled/90°
   */
  get square(): boolean {
    return this.hasAttribute(attributes.SQUARE);
  }

  /**
   * Sets the correct appearance class on the ShadowRoot button.
   * @private
   * @param {string | null} val desired appearance class
   */
  setAppearanceClass(val: string | null) {
    if (this.button) {
      BUTTON_APPEARANCE.forEach((app) => {
        const appClassName = `btn-${app}`;
        if (val === app) {
          if (app !== 'default' && !this.button?.classList.contains(appClassName)) {
            this.button?.classList.add(appClassName);
          }
          return;
        }
        if (this.button?.classList.contains(appClassName)) {
          this.button?.classList.remove(appClassName);
        }
      });
    }
  }

  /**
   * Overrides the standard "focus" behavior to instead pass focus to the inner HTMLButton element.
   */
  focus(): void {
    this.button?.focus();
  }

  /**
   * Implements callback from IdsColorVariantMixin used to
   * update the color variant on children components
   * @returns {void}
   */
  onColorVariantRefresh(): void {
    const icons = this.querySelectorAll<IdsIcon>('ids-icon');
    const texts = this.querySelectorAll<IdsText | HTMLSpanElement>('ids-text, span');
    const iterator = (el: IdsIcon | IdsText | HTMLSpanElement) => {
      if (!(el instanceof HTMLSpanElement)) el.colorVariant = this.colorVariant;
    };
    [...icons, ...texts].forEach(iterator);
  }
}

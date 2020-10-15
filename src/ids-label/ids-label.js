import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-label.scss';

/**
 * IDS Label Component
 */
@customElement('ids-label')
@scss(styles)
@mixin(IdsStringUtilsMixin)
class IdsLabel extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.TYPE, props.FONT_SIZE, props.REQUIRED, props.AUDIBLE, props.FIELD_STATE];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const tag = this.type || 'span';
    let classList = 'ids-label';
    classList += this.audible ? ' audible' : '';
    classList += this.fontSize ? ` ids-text-${this.fontSize}` : '';
    classList += this.type === 'label' && this.stringToBool(this.required) ? ' required' : '';
    classList = ` class="${classList}"`;
    let fieldState = this.fieldState === 'disabled' ? ' disabled' : '';
    fieldState = this.fieldState === 'readonly' ? ' readonly' : fieldState;

    return `<${tag}${classList}${fieldState}><slot></slot></${tag}>`;
  }

  /**
   * Rerender the component template
   * @private
   */
  rerender() {
    const template = document.createElement('template');
    this.shadowRoot.querySelector('.ids-label').remove();
    template.innerHTML = this.template();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * Set the font size/style of the label with a class.
   * @param {string} value The font size in the font scheme i.e. 10, 12, 16 or xs, sm, base, lg, xl
   */
  set fontSize(value) {
    if (value) {
      this.setAttribute(props.FONT_SIZE, value);
      this.container.classList.add(`ids-text-${value}`);
      return;
    }

    this.removeAttribute(props.FONT_SIZE);
    this.container.className = '';
    this.container.classList.add('ids-label');
  }

  get fontSize() { return this.getAttribute(props.FONT_SIZE); }

  /**
   * Set the type of object it is (h1-h6, label, span (default))
   * @param {string} value The font size in the font scheme i.e. 10, 12, 16 or xs, sm, base, lg, xl
   */
  set type(value) {
    if (value) {
      this.setAttribute(props.TYPE, value);
      this.rerender();
      return;
    }

    this.removeAttribute(props.TYPE);
    this.rerender();
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Set `required` attribute
   * @param {boolean} value If true will set `required` attribute
   */
  set required(value) {
    const val = this.stringToBool(value);

    if (val) {
      this.setAttribute(props.REQUIRED, val);
      this.rerender();
      return;
    }
    this.removeAttribute(props.REQUIRED);
    this.rerender();
  }

  get required() { return this.getAttribute(props.REQUIRED); }

  /**
   * Set `audible` attribute
   * @param {string} value The `audible` attribute
   */
  set audible(value) {
    if (value) {
      this.setAttribute(props.AUDIBLE, value);
      this.rerender();
      return;
    }
    this.removeAttribute(props.AUDIBLE);
    this.rerender();
  }

  get audible() { return this.getAttribute(props.AUDIBLE); }

  /**
   * Set the `fieldState` attribute of input
   * @param {string} val the value property
   */
  set fieldState(val) {
    if (val) {
      this.setAttribute(props.FIELD_STATE, val);
      this.rerender();
      return;
    }

    this.removeAttribute(props.FIELD_STATE);
    this.rerender();
  }

  get fieldState() { return this.getAttribute(props.FIELD_STATE); }
}

export default IdsLabel;

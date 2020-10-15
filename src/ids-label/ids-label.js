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
    return ['font-size', props.TYPE, props.REQUIRED, props.STATE];
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
    let state = this.state === 'disabled' ? ' disabled' : '';
    state = this.state === 'readonly' ? ' readonly' : state;

    return `<${tag}${classList}${state}><slot></slot></${tag}>`;
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
      this.setAttribute('font-size', value);
      this.container.classList.add(`ids-text-${value}`);
      return;
    }

    this.removeAttribute('font-size');
    this.container.className = '';
    this.container.classList.add('ids-label');
  }

  get fontSize() { return this.getAttribute('font-size'); }

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
      this.setAttribute('audible', value);
      this.rerender();
      return;
    }
    this.removeAttribute('audible');
    this.rerender();
  }

  get audible() { return this.getAttribute('audible'); }

  /**
   * Set the `state` attribute of input
   * @param {string} val the value property
   */
  set state(val) {
    if (val) {
      this.setAttribute(props.STATE, val);
      this.rerender();
      return;
    }

    this.removeAttribute(props.STATE);
    this.rerender();
  }

  get state() { return this.getAttribute(props.STATE); }
}

export default IdsLabel;

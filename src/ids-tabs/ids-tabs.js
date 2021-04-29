import {
  IdsElement,
  customElement,
  props,
  scss,
  mix
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import styles from './ids-tabs.scss';

/**
 * combines classes and considers truthy/falsy +
 * doesn't pollute the attribs/DOM without
 * any fuss
 *
 * @param  {...any} classes classes/expressions
 * @returns {string} ` class="c1 c2..."` || ""
 */
const buildClassAttrib = (...classes) => {
  const classAttrib = classes.reduce((attribStr = '', c) => {
    if (attribStr && c) { return `${attribStr} ${c}`; }
    if (!attribStr && c) { return c; }
    return attribStr;
  }, '');

  return !classAttrib ? '' : ` class=${classAttrib}`;
};

/**
 * IDS Tabs Component
 * @type {IdsTabs}
 * @inherits IdsElement
 */
@customElement('ids-tabs')
@scss(styles)
class IdsTabs extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.ORIENTATION, props.VALUE];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    return (
      `<div ${buildClassAttrib('ids-tabs', this.orientation)}>
        <slot></slot>
      </div>`
    );
  }

  /**
   * Binds associated callbacks and cleans
   * old handlers when template refreshes
   */
  rendered = () => {
    /* istanbul ignore next */
    if (!this.shouldUpdateCallbacks) {
      return;
    }

    // stop observing changes before updating DOM
    this.stepObserver.disconnect();
    this.resizeObserver.disconnect();

    // set up observer for resize which prevents overlapping labels
    this.resizeObserver.observe(this.container);

    // set up observer for monitoring if a child element changed
    this.stepObserver.observe(this, {
      childList: true,
      attributes: true,
      subtree: true
    });

    this.shouldUpdateCallbacks = false;
  };

  /**
   * Set the orientation of how tabs will be laid out
   * @param {'horizontal' | 'vertical'} value orientation
   */
  set orientation(value) {
    switch (value) {
    case 'vertical': {
      this.setAttribute(props.ORIENTATION, 'vertical');
      break;
    }
    case 'horizontal':
    default: {
      this.setAttribute(props.ORIENTATION, 'horizontal');
      break;
    }
    }
  }

  get orientation() {
    return this.getAttribute(props.ORIENTATION);
  }
}

export default IdsTabs;

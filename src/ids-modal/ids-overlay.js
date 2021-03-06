import {
  IdsElement,
  customElement,
  mix,
  attributes,
  stringUtils,
  scss
} from '../ids-base/ids-element';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin,
  IdsRenderLoopMixin,
  IdsRenderLoopItem
} from '../ids-mixins';

// Supporting Components
import IdsDOMUtils from '../ids-base/ids-dom-utils';

// Import Styles
import styles from './ids-overlay.scss';

const appliedMixins = [
  IdsEventsMixin,
  IdsThemeMixin,
  IdsRenderLoopMixin
];

/**
 * IDS Overlay Component
 * @type {IdsOverlay}
 * @inherits IdsElement
 * @mixes IdsRenderLoopMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-overlay')
@scss(styles)
class IdsOverlay extends mix(IdsElement).with(...appliedMixins) {
  constructor() {
    super();

    this.state = {
      opacity: 0.5,
      visible: false,
    };
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.VISIBLE,
      attributes.OPACITY
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-overlay" part="overlay"><slot></slot></div>`;
  }

  /**
   * @returns {boolean} true if the overlay is visible
   */
  get visible() {
    return this.state.visible;
  }

  /**
   * @param {boolean} val true if the overlay should be made visible
   */
  set visible(val) {
    const trueVal = stringUtils.stringToBool(val);

    this.state.visible = trueVal;
    this.#smoothlyAnimateVisibility(trueVal);
  }

  /**
   * @returns {number} the percent opacity
   */
  get opacity() {
    return this.state.opacity;
  }

  /**
   * @param {number} val a percentage number for setting overlay transparency
   */
  set opacity(val) {
    let trueVal = Number(val);
    if (Number.isNaN(trueVal)) {
      return;
    }

    // Opacity is a percentage value between 0 and 1,
    // so adjust the number accordingly if we get something off
    if (trueVal < 0) {
      trueVal = 0;
    }
    if (trueVal > 1) {
      trueVal = 1;
    }
    this.state.opacity = trueVal;
    this.#changeOpacity(trueVal);
  }

  /**
   * Changes the amount of opacity on the overlay
   * @param {number} val the opacity value to set on the overlay
   * @returns {Promise} fulfilled after a CSS transition completes.
   */
  async #changeOpacity(val) {
    return IdsDOMUtils.transitionToPromise(this.container, 'opacity', `${val}`);
  }

  /**
   * Animates in/out the visibility of the overlay
   * @param {boolean} val if true, shows the overlay.  If false, hides the overlay.
   */
  async #smoothlyAnimateVisibility(val) {
    const cl = this.container.classList;

    /* istanbul ignore else */
    if (val && !cl.contains('visible')) {
      // Make visible
      cl.add('visible');
      this.rl.onNextTick(() => {
        this.#changeOpacity(this.opacity);
      });
    } else if (!val && cl.contains('visible')) {
      // Make hidden
      await this.#changeOpacity(0);
      /* istanbul ignore next */
      cl.remove('visible');
    }
  }
}

export default IdsOverlay;

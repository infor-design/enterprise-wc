import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { stripTags } from '../../utils/ids-xss-utils/ids-xss-utils';

interface OrientationHandler {
  onOrientationRefresh?(): void;
}

type Constraints = IdsConstructor<OrientationHandler>;

/**
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsOrientationMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);

    // Overrides the IdsElement `render` method to also include an update
    // to color variant styling after it runs, keeping the visual state in-sync.
    this.render = () => {
      super.render();
      this.#refreshOrientation();
      return this;
    };
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#refreshOrientation('horizontal', this.orientation);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.ORIENTATION
    ];
  }

  /**
   * @returns {Array<string>} List of available orientation for this component
   */
  orientations = ['horizontal', 'vertical'];

  /**
   * @returns {string} the name of the orientation currently applied
   */
  get orientation(): string {
    return this.getAttribute(attributes.ORIENTATION) ?? 'horizontal';
  }

  /**
   * @param {string|null} val the name of the orientation to be applied
   */
  set orientation(val: string | null) {
    val ??= 'horizontal';
    const safeValue = String(stripTags(val, ''));
    const currentValue = this.orientation;

    if (currentValue !== safeValue) {
      if (this.orientations.includes(safeValue)) {
        this.setAttribute(attributes.ORIENTATION, `${safeValue}`);
      } else {
        this.removeAttribute(attributes.ORIENTATION);
      }

      this.#refreshOrientation(currentValue, safeValue);
    }
  }

  /**
   * Refreshes the component's orientation state, driven by
   * a CSS class on the WebComponent's `container` element
   * @param {string} oldVariantName the orientation variant name to "remove" from the style
   * @param {string} newVariantName the orientation variant name to "add" to the style
   * @returns {void}
   */
  #refreshOrientation(oldVariantName?: string, newVariantName?: string) {
    if (!this.container) return;
    const cl = this.container.classList;

    if (oldVariantName) cl.remove(`orientation-${oldVariantName}`);
    if (newVariantName) cl.add(`orientation-${newVariantName}`);

    // Fire optional callback
    if (typeof this.onOrientationRefresh === 'function') {
      this.onOrientationRefresh();
    }
  }
};

export default IdsOrientationMixin;

import renderLoop from '../../components/ids-render-loop/ids-render-loop-global';
import IdsRenderLoopItem from '../../components/ids-render-loop/ids-render-loop-item';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

const IdsRippleMixin = (superclass) => class extends superclass {
  // HTMLElement containing ripple, typically component container
  rippleTarget;

  // Radius of ripple, defaults to 50
  rippleRadius = 50;

  // Timeout for end of ripple effect
  rippleTimeout;

  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.NO_RIPPLE
    ];
  }

  /**
   * If set to true the ripple effect will be disabled.
   * @param {boolean} val The ripple value
   */
  set noRipple(val) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.NO_RIPPLE, '');
      this.#removeRippleListeners();
    } else {
      this.removeAttribute(attributes.NO_RIPPLE);
      this.#attachRippleListeners();
    }
  }

  /**
   * @returns {boolean} true if ripple disabled
   */
  get noRipple() {
    return this.hasAttribute(attributes.NO_RIPPLE);
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  /**
   * @public
   * @param {HTMLElement} rippleTarget Element containing ripple, default to component container
   * @param {number} rippleRadius Used to calc ripple size and coordinates, defaults to 50
   * @returns {void}
   */
  setupRipple(rippleTarget, rippleRadius) {
    this.rippleTarget = rippleTarget || this.container;
    this.rippleRadius = rippleRadius || this.rippleRadius;
    this.#attachRippleListeners();
  }

  /**
   * Remove event listeners
   * @private
   * @returns {void}
   */
  #removeRippleListeners() {
    this.offEvent('click.ripple');
    this.offEvent('touchstart.ripple');
  }

  /**
   * Sets up event listeners
   * @private
   * @returns {void}
   */
  #attachRippleListeners() {
    if (this.noRipple) return;

    let x;
    let y;
    let preceededByTouchstart = false;

    this.onEvent('click.ripple', this.rippleTarget, (e) => {
      if (preceededByTouchstart) {
        preceededByTouchstart = false;
        return;
      }
      x = e.clientX !== 0 ? e.clientX : undefined;
      y = e.clientY !== 0 ? e.clientY : undefined;
      this.createRipple(x, y);
    });

    this.onEvent('touchstart.ripple', this.rippleTarget, (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        x = touch.clientX !== 0 ? touch.clientX : undefined;
        y = touch.clientY !== 0 ? touch.clientY : undefined;
        this.createRipple(x, y);
        preceededByTouchstart = true;
      }
    }, {
      passive: true
    });
  }

  /**
   * Generates a "ripple" effect on a specified location inside the element's boundaries.
   * The coordinates defined are actual page coordinates, using the top/left of the page as [0,0],
   * which allows this to connect easily to mouse/touch events.
   * @private
   * @param {number} x the X coordinate
   * @param {number} y the Y coordinate
   * @returns {void}
   */
  createRipple(x, y) {
    if (this.noRipple || this.disabled) return;

    // Remove pre-existing ripples
    const rippleTarget = this.rippleTarget;
    const otherRippleEls = rippleTarget.querySelectorAll('.ripple-effect');
    otherRippleEls.forEach((rippleEl) => {
      rippleEl.remove();
    });

    // Create ripple element
    const rippleEl = document.createElement('span');
    rippleEl.classList.add('ripple-effect');
    rippleEl.setAttribute('aria-hidden', 'true');
    rippleEl.setAttribute('focusable', 'false');
    rippleEl.style.width = `${this.rippleRadius * 2}px`;
    rippleEl.style.height = `${this.rippleRadius * 2}px`;

    // place and position ripple
    const btnOffsets = this.getRippleOffsets(x, y);
    rippleTarget.classList.add('is-rippling');
    rippleTarget.prepend(rippleEl);
    rippleEl.style.left = `${btnOffsets.x}px`;
    rippleEl.style.top = `${btnOffsets.y}px`;
    rippleEl.classList.add('animating');

    // Remove pre-existing ripple timeouts
    if (this.rippleTimeout) {
      this.rippleTimeout.destroy(true);
    }

    // After a short time, remove the ripple effect
    this.rippleTimeout = renderLoop.register(new IdsRenderLoopItem({
      duration: 1200,
      timeoutCallback() {
        rippleTarget.classList.remove('is-rippling');
        rippleEl.remove();
      }
    }));
  }

  /**
   * The math used for getting the ripple offsets
   * @private
   * @param {number} x the X coordinate
   * @param {number} y the Y coordinate
   * @returns {object} containing x/y coordinates of the ripple
   */
  getRippleOffsets(x, y) {
    const rect = this.getBoundingClientRect();
    let elemX;
    let elemY;

    // If "X" is defined, assume it's page coordinates and subtract the
    // custom element's offsets from its location in the page.
    // Otherwise, simply set the offset to the center of the element.
    if (!x) {
      elemX = (rect.width / 2);
    } else {
      elemX = x - rect.left;
    }

    // If "Y" is defined, assume it's page coordinates and subtract the
    // custom element's offsets from its location in the page.
    // Otherwise, simply set the offset to the center of the element.
    if (!y) {
      elemY = (rect.height / 2);
    } else {
      elemY = y - rect.top;
    }

    // Subtract half the ripple size from each dimension.
    elemX -= this.rippleRadius;
    elemY -= this.rippleRadius;

    return { x: elemX, y: elemY };
  }
};

export default IdsRippleMixin;

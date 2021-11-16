/**
 * Ids DOM Utils
 */
const IdsDOMUtils = {
  /**
   * Converts a DOMRect to a plain object, making it's properties editable.
   * @param {DOMRect} rect a readonly DOMRect measurement.
   * @returns {object} with all the same properties, but editable
   */
  getEditableRect(rect) {
    const {
      bottom, left, right, top, height, width, x, y
    } = rect;

    return {
      bottom, left, right, top, height, width, x, y
    };
  },

  /**
   * Returns the closest Shadow Root, if the provided node is contained b+y one.
   * @param {HTMLElement} node the node to check
   * @returns {ShadowRoot|undefined} the node.
   */
  getClosestShadow(node) {
    let parent = (node && node.parentNode);
    while (parent) {
      if (parent.toString() === '[object ShadowRoot]') {
        return parent;
      }
      parent = parent.parentNode;
    }
    return undefined;
  },

  /**
   * Used specifically to detect the closest Shadow Root container OR `document`.
   * @param {HTMLElement} node the node to check
   * @returns {Node} the parent node
   */
  getClosestContainerNode(node) {
    return IdsDOMUtils.getClosestShadow(node) || document;
  },

  /**
   * Used specifically to detect the closest host element of a Shadow Root, OR `document`.
   * @param {HTMLElement} node the node to check
   * @returns {Node} the parent node.
   */
  getClosestHostNode(node) {
    return IdsDOMUtils.getClosestShadow(node)?.host || document;
  },

  /**
   * Returns the closest Root Node parent of a provided element.  If the provided element is inside
   * a Shadow Root, that Shadow Root's host's parentNode is provided. `document` is used as a
   * fallback. This method allows for `querySelector()` in some nested Shadow Roots to work properly
   * @param {HTMLElement} node the node to check
   * @returns {Node} the parent node.
   */
  getClosestRootNode(node) {
    return IdsDOMUtils.getClosestHostNode(node)?.parentNode || document;
  },

  /**
   * Traverses Shadow DOM (into Light DOM, if necessary) to find the closest reference to a
   * parent node matching the provided selector.
   * @param {HTMLElement} node the node to check
   * @param {string} selector containing a CSS selector to be used for matching
   * @returns {Node|undefined} the node if found, otherwise undefined
   */
  getClosest(node, selector) {
    let parent = (node && node.parentNode);
    while (parent) {
      if (parent.toString() === '[object ShadowRoot]') {
        parent = parent.host;
      }
      if (parent.toString() === '[object HTMLDocument]') {
        return undefined;
      }
      if (typeof parent.matches === 'function' && parent.matches(selector)) {
        return parent;
      }
      parent = parent.parentNode;
    }
    return undefined;
  },

  /**
   * Changes a CSS property with a transition,
   * @param {HTMLElement} el the element to act on
   * @param {string} property the CSS property with an attached transition to manipulate
   * @param {any} value the target CSS value
   * @returns {Promise} fulfulled when the CSS transition completes
   */
  transitionToPromise(el, property, value) {
    return new Promise((resolve) => {
      el.style[property] = value;
      const transitionEnded = (e) => {
        if (e.propertyName !== property) return;
        el.removeEventListener('transitionend', transitionEnded);
        resolve();
      };
      el.addEventListener('transitionend', transitionEnded);
    });
  },

  /**
   * Similar to `transitionToPromise`, but simply waits for the specified property's `transitionend`
   * event to complete (allows the user to change the property outside the promise)
   * @param {HTMLElement} el the element to act on
   * @param {string} [property] the CSS property used to qualify the correct transitionend event.  If not defined, the
   *  promise will simply be fulfilled when any transition completes.
   * @returns {Promise} fulfulled when the CSS transition completes
   */
  waitForTransitionEnd(el, property) {
    return new Promise((resolve) => {
      const transitionEnded = (e) => {
        if (property && e.propertyName !== property) return;
        el.removeEventListener('transitionend', transitionEnded);
        resolve();
      };
      el.addEventListener('transitionend', transitionEnded);
    });
  }
};

export default IdsDOMUtils;

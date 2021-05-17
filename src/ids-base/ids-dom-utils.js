/**
 * Ids DOM Utils
 */
const IdsDOMUtils = {
  /**
   * Returns the closest Shadow Root, if the provided node is contained by one.
   * @param {HTMLElement} node the node to check
   * @returns {ShadowRoot|undefined} the node.
   */
  getClosestShadow(node) {
    /** @type {any} */
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
   * Returns the closest Root Node parent of a provided element.  If the provided element is inside
   * a Shadow Root, that Shadow Root's host's parentNode is provided. `document` is used as a
   * fallback. This method allows for `querySelector()` in some nested Shadow Roots to work properly
   * @param {HTMLElement} node the node to check
   * @returns {Node} the parent node.
   */
  getClosestRootNode(node) {
    return IdsDOMUtils.getClosestShadow(node)?.host?.parentNode || document;
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

  waitForTransitionEnd(el, property) {
    return new Promise((resolve) => {
      const transitionEnded = (e) => {
        if (e.propertyName !== property) return;
        el.removeEventListener('transitionend', transitionEnded);
        resolve();
      };
      el.addEventListener('transitionend', transitionEnded);
    });
  }
};

export default IdsDOMUtils;

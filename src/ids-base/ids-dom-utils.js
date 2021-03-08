/**
 * Ids DOM Utils
 */
const IdsDOMUtils = {
  /**
   * Determines if a Node reference is currently contained within a Shadow Root.
   * @param {Node} node the node to check
   * @returns {boolean} true if the element is contained by a Shadow Root.
   */
  isInShadow(node) {
    let parent = (node && node.parentNode);
    while (parent) {
      if (parent.toString() === '[object ShadowRoot]') {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  },

  /**
   * Returns the closest Shadow Root, if the provided node is contained by one.
   * @param {Node} node the node to check
   * @returns {Node|undefined} the node.
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
   * Returns the closest Root Node parent of a provided element.  If the provided element is inside
   * a Shadow Root, that Shadow Root's host's parentNode is provided. `document` is used as a fallback.
   * This method allows for `querySelector()` in some nested Shadow Roots to work properly.
   * @param {Node} node the node to check
   * @returns {Node} the node.
   */
  getClosestRootNode(node) {
    return IdsDOMUtils.getClosestShadow(node)?.host?.parentNode || document;
  }
};

export default IdsDOMUtils;

/**
 * Ids DOM Utils
 */
const IdsDOMUtils = {
  /**
   * Returns the closest Shadow Root, if the provided node is contained by one.
   * @param {*} node the node to check
   * @returns {*} the node.
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
   * @param {*} node the node to check
   * @returns {Node} the parent node
   */
  getClosestContainerNode(node) {
    return IdsDOMUtils.getClosestShadow(node) || document;
  },

  /**
   * Returns the closest Root Node parent of a provided element.  If the provided element is inside
   * a Shadow Root, that Shadow Root's host's parentNode is provided. `document` is used as a
   * fallback. This method allows for `querySelector()` in some nested Shadow Roots to work properly
   * @param {*} node the node to check
   * @returns {Node} the parent node.
   */
  getClosestRootNode(node) {
    return IdsDOMUtils.getClosestShadow(node)?.host?.parentNode || document;
  }
};

export default IdsDOMUtils;

declare const IdsDOMUtils: {
  /** Returns the closest Shadow Root to the provided element, if applicable */
  getClosestShadow(node: HTMLElement): Node | undefined;

  /** Used specifically to detect the closest Shadow Root container OR `document`. */
  getClosestContainerNode(node: HTMLElement): Node;

  /**
   * Returns the closest Root Node parent of a provided element.  If the provided element is inside
   * a Shadow Root, that Shadow Root's host's parentNode is provided. `document` is used as a
   * fallback. This method allows for `querySelector()` in some nested Shadow Roots to work properly
   */
  getClosestRootNode(node: HTMLElement): Node;

  /**
   * Get all child elements start tag name with `ids-`
   */
  getIdsElements(node: HTMLElement, pierce: boolean): HTMLElement[];
};

export default IdsDOMUtils;

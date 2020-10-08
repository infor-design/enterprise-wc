/**
 * Ids DOM Utils
 */
const IdsDOMUtilsMixin = {
  /**
   * Finds this component's closest parent HTMLElement with a scrollbar.
   * @returns {HTMLElement} the closest parent DOM node with a scrollbar present
   */
  getScrollParents() {
    const parents = [];

    let thisNode = this;
    while (thisNode !== null) {
      if (thisNode.scrollHeight > thisNode.clientHeight) {
        parents.push(thisNode);
      }
      thisNode = thisNode.parentNode;
    }

    return parents;
  },

  /**
   * @returns {object} containing total X/Y scroll distance across all scrollable parent elements
   */
  getTotalScrollDistance() {
    const scrollParents = this.getScrollParents();
    let x = 0;
    let y = 0;

    scrollParents.forEach((parent) => {
      x += parent.scrollLeft;
      y += parent.scrollTop;
    });

    return { x, y };
  }
};

export { IdsDOMUtilsMixin };

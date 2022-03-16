// /**
//  * Returns the closest Shadow Root, if the provided node is contained by one.
//  * @param {HTMLElement} node the node to check
//  * @returns {ShadowRoot|undefined} the node.
//  */
// export function getClosestShadow(node) {
//   let parent = (node && node.parentNode);
//   while (parent) {
//     if (parent.toString() === '[object ShadowRoot]') {
//       return parent;
//     }
//     parent = parent.parentNode;
//   }
//   return undefined;
// }

// /**
//  * Used specifically to detect the closest Shadow Root container OR `document`.
//  * @param {HTMLElement} node the node to check
//  * @returns {Node} the parent node
//  */
// export function getClosestContainerNode(node) {
//   return getClosestShadow(node) || document;
// }

// /**
//  * Returns the closest Root Node parent of a provided element.  If the provided element is inside
//  * a Shadow Root, that Shadow Root's host's parentNode is provided. `document` is used as a
//  * fallback. This method allows for `querySelector()` in some nested Shadow Roots to work properly
//  * @param {HTMLElement} node the node to check
//  * @returns {Node} the parent node.
//  */
// export function getClosestRootNode(node) {
//   return getClosestShadow(node)?.host?.parentNode || document;
// }

/**
 * Traverses Shadow DOM (into Light DOM, if necessary) to find the closest reference to a
 * parent node matching the provided selector.
 * @param {HTMLElement} node the node to check
 * @param {string} selector containing a CSS selector to be used for matching
 * @returns {Node|undefined} the node if found, otherwise undefined
 */
export function getClosest(node, selector) {
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
}

// /**
//  * Changes a CSS property with a transition,
//  * @param {HTMLElement} el the element to act on
//  * @param {string} property the CSS property with an attached transition to manipulate
//  * @param {any} value the target CSS value
//  * @returns {Promise} fulfulled when the CSS transition completes
//  */
// export function transitionToPromise(el, property, value) {
//   return new Promise((resolve) => {
//     el.style[property] = value;
//     const transitionEnded = (e) => {
//       if (e.propertyName !== property) return;
//       el.removeEventListener('transitionend', transitionEnded);
//       resolve();
//     };
//     el.addEventListener('transitionend', transitionEnded);
//   });
// }

// /**
//  * Similar to `transitionToPromise`, but simply waits for the specified property's `transitionend`
//  * event to complete (allows the user to change the property outside the promise)
//  * @param {HTMLElement} el the element to act on
//  * @param {string} property the CSS property used to qualify the correct transitionend event
//  * @returns {Promise} fulfulled when the CSS transition completes
//  */
// export function waitForTransitionEnd(el, property) {
//   return new Promise((resolve) => {
//     const transitionEnded = (e) => {
//       if (e.propertyName !== property) return;
//       el.removeEventListener('transitionend', transitionEnded);
//       resolve();
//     };
//     el.addEventListener('transitionend', transitionEnded);
//   });
// }

// /**
//  * Converts a DOMRect to a plain object, making it's properties editable.
//  * @param {DOMRect} rect a readonly DOMRect measurement.
//  * @returns {object} with all the same properties, but editable
//  */
// export function getEditableRect(rect) {
//   const {
//     bottom, left, right, top, height, width, x, y
//   } = rect;

//   return {
//     bottom, left, right, top, height, width, x, y
//   };
// }

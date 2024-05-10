/**
 * Returns the closest Shadow Root, if the provided node is contained by one.
 * @param {HTMLElement} node the node to check
 * @returns {ShadowRoot|undefined} the node.
 */
export function getClosestShadow(node: HTMLElement) {
  let parent = (node && node.parentNode);
  while (parent) {
    if (parent.toString() === '[object ShadowRoot]') {
      return parent;
    }
    parent = parent.parentNode;
  }
  return undefined;
}

/**
 * Used specifically to detect the closest Shadow Root container OR `document`.
 * @param {HTMLElement} node the node to check
 * @returns {Node} the parent node
 */
export function getClosestContainerNode(node: any) {
  return getClosestShadow(node) || document;
}

/**
 * Returns the closest Root Node parent of a provided element.  If the provided element is inside
 * a Shadow Root, that Shadow Root's host's parentNode is provided. `document` is used as a
 * fallback. This method allows for `querySelector()` in some nested Shadow Roots to work properly
 * @param {HTMLElement} node the node to check
 * @returns {Node} the parent node.
 */
export function getClosestRootNode(node: HTMLElement) {
  return (getClosestShadow(node) as any)?.host?.parentNode || document;
}

/**
 * Traverses Shadow DOM (into Light DOM, if necessary) to find the closest reference to a
 * parent node matching the provided selector.
 * @param {HTMLElement} node the node to check
 * @param {string} selector containing a CSS selector to be used for matching
 * @returns {Node|undefined} the node if found, otherwise undefined
 */
export function getClosest(node: any, selector: string) {
  let parent: any = (node && node.parentNode);
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

/**
 * Traverses thru Shadow DOM if necessary to find parent node until matching the provided selector or until body.
 * @param {HTMLElement} node the node to check
 * @param {string|undefined} selector containing a CSS selector to be used for matching
 * @returns {Array<HTMLElement>} the list of parent elements
 */
export function parents(node: any, selector = 'body'): Array<HTMLElement> {
  const parentsList = [];
  for (
    let parent: any = node?.parentNode;
    parent;
    parent = parent.toString() === '[object ShadowRoot]' ? parent.host : parent?.parentNode
  ) {
    parentsList.push(parent);
    if (parent.matches?.(selector)) break;
  }
  return parentsList;
}

/**
 * Traverses down until matching the provided selector is found.
 * @param {HTMLElement} node the node to check
 * @param {string|undefined} selector containing a CSS selector to be used
 * @returns {Array<HTMLElement>} the list of parent elements
 */
export function nextUntil(node: any, selector: string): Array<HTMLElement> {
  const siblings = [];
  node = node.nextElementSibling;

  while (node) {
    if (node.matches(selector)) break;
    siblings.push(node);
    node = node.nextElementSibling;
  }

  return siblings;
}

/**
 * Traverses up until matching selector is found (like jquery next)
 * @param {HTMLElement} node the node to start
 * @param {string|undefined} selector containing a CSS selector to be used
 * @returns {HTMLElement} the element
 */
export function next(node: any, selector: string): HTMLElement {
  node = node.nextElementSibling;

  while (node) {
    if (node.matches(selector)) return node;
    node = node.nextElementSibling;
  }

  return node;
}

/**
 * Traverses down until matching selector is found (like jquery prev)
 * @param {HTMLElement} node the node to start
 * @param {string|undefined} selector containing a CSS selector to be used
 * @returns {HTMLElement} the element
 */
export function previous(node: any, selector: string): HTMLElement {
  node = node.previousElementSibling;

  while (node) {
    if (node.matches(selector)) return node;
    node = node.previousElementSibling;
  }

  return node;
}

/**
 * Changes a CSS property with a transition,
 * @param {HTMLElement} el the element to act on
 * @param {string} property the CSS property with an attached transition to manipulate
 * @param {any} value the target CSS value
 * @returns {Promise} fulfulled when the CSS transition completes
 */
export function transitionToPromise(el: any, property: string, value: any) {
  if (!el) return Promise.resolve();
  return new Promise((resolve) => {
    el.style[property] = value;
    const transitionEnded = (e: any) => {
      if (e.propertyName !== property) resolve(true);
      el.removeEventListener('transitionend', transitionEnded);
      resolve(true);
    };
    el.addEventListener('transitionend', transitionEnded);
  });
}

/**
 * Similar to `transitionToPromise`, but simply waits for the specified property's `transitionend`
 * event to complete (allows the user to change the property outside the promise)
 * @param {HTMLElement} el the element to act on
 * @param {string} property the CSS property used to qualify the correct transitionend event
 * @returns {Promise} fulfulled when the CSS transition completes
 */
export function waitForTransitionEnd(el: HTMLElement, property: string) {
  return new Promise((resolve) => {
    const transitionEnded = (e: any) => {
      if (e.propertyName !== property) resolve(true);
      el.removeEventListener('transitionend', transitionEnded);
      resolve(true);
    };
    el.addEventListener('transitionend', transitionEnded);
  });
}

/**
 * Similar to `transitionToPromise`, but simply waits for the specified property's `animationend` event to complete
 * @param {HTMLElement} el the element to act on
 * @param {string} animationName the CSS animation "keyframes" definition used to qualify the correct `animationend` event
 * @returns {Promise<boolean>} fulfulled when the CSS animation completes
 */
export function waitForAnimationEnd(el: HTMLElement, animationName: string) {
  return new Promise((resolve) => {
    if (typeof AnimationEvent !== 'function') resolve(true);
    const animationEnded = (e: any) => {
      if (e.animationName !== animationName) return; // Don't match other applied animations
      el.removeEventListener('animationend', animationEnded);
      resolve(true);
    };
    el.addEventListener('animationend', animationEnded);
  });
}

/**
 * Converts a DOMRect to a plain object, making it's properties editable.
 * @param {DOMRect} rect a readonly DOMRect measurement.
 * @returns {object} with all the same properties, but editable
 */
export function getEditableRect(rect: DOMRect) {
  const {
    bottom, left, right, top, height, width, x, y
  } = rect;

  return {
    bottom, left, right, top, height, width, x, y
  };
}

/**
 * Determines if the passed element is overflowing its bounds
 * @param {HTMLElement} el The element to check
 * @returns {boolean} true if overflowing, false otherwise
 */
export function checkOverflow(el?: HTMLElement | null) {
  if (!el) return false;

  const curOverflow = el.style.overflow;
  let changedOverflow = false;
  if (!curOverflow || curOverflow === 'visible') {
    el.style.overflow = 'hidden';
    changedOverflow = true;
  }

  const isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
  if (changedOverflow) {
    el.style.overflow = curOverflow;
  }

  return isOverflowing;
}

/**
 * Toggles a scrollbar on an element that should only display if its contents are overflowed
 * NOTE: the element receiving the `has-scrollbar` class should have accompanying styles
 *   applied for generating the scrollbar via `overflow: scroll;` or related prop.
 * @param {HTMLElement} el target element
 * @param {HTMLElement} [classEl] if defined, receives the CSS class needed to enable scrolling instead of the main element
 * @param {boolean | undefined} [doToggle] if true, toggles the scrollbar
 * @returns {boolean} true if the scrollbar was toggled
 */
export const toggleScrollbar = (el: HTMLElement, classEl?: HTMLElement, doToggle?: boolean) => {
  let didToggle = false;
  const classTargetEl = classEl || el;

  if (el instanceof HTMLElement) {
    if ((doToggle === undefined && el.scrollHeight > el.clientHeight) || doToggle === true) {
      classTargetEl.classList.add('has-scrollbar');
      didToggle = true;
    } else {
      classTargetEl.classList.remove('has-scrollbar');
    }
  }
  return didToggle;
};

/**
 * Check if given element has given css class
 * @param {HTMLElement} el the element to act on
 * @param {string} className The class name
 * @returns {boolean|undefined} true, if element has given css class
 */
export function hasClass(el: any, className: any) {
  return el?.classList.contains(className);
}

/**
 * Quickly listens for and dispatches a `mousemove` event on the document, which
 * then gets the current coordinates of the mouse and determines which Light DOM element is beneath them.
 * @returns {Element | null} the element which the mouse is currently hovering
 */
export function getElementAtMouseLocation() {
  let mousePos: [number, number] = [0, 0];

  const getCurrentCoords = (e: MouseEvent) => {
    mousePos = [e.clientX, e.clientY];
    document.removeEventListener('mousemove', getCurrentCoords);
  };

  document.addEventListener('mousemove', getCurrentCoords);
  return document.elementFromPoint(...mousePos);
}

/**
 * Query selector all that goes throw all shadowRoots
 * @param {string} selector The query selector
 * @param {Element} rootNode The element to check
 * @returns {Array<Element>} true if overflowing, false otherwise
 */
export function querySelectorAllShadowRoot(selector: string, rootNode = document.body) {
  const arr: Array<Element> = [];

  const traverser = (node: Element) => {
    // Decline all nodes that are not elements
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    // Add the node to the array, if it matches the selector
    if (node.matches(selector)) {
      arr.push(node);
    }

    // Loop through the children
    const children = node.children;
    if (children.length) {
      for (const child of children) {
        traverser(child);
      }
    }

    // Check for shadow DOM, and loop through it's children
    const shadowRoot = node.shadowRoot;
    if (shadowRoot) {
      const shadowChildren = shadowRoot.children;
      for (const shadowChild of shadowChildren) {
        traverser(shadowChild);
      }
    }
  };

  traverser(rootNode);

  return arr;
}

/**
 * Parses some value types and returns a valid `maxHeight` style property, if possible
 * @param {string | number | null} value a string/number value, or null
 * @returns {string | null} a pixel value representing a `maxHeight`, or null
 */
export function validMaxHeight(value: string | number | null) {
  let val: string | number | null = parseInt(value as string, 10);
  val = (!Number.isNaN(val) && val > -1) ? `${val}px` : null;
  return val;
}

/**
 * Parses a number or string representing a numeric size value
 * (potentially with a unit type attached) into a string value
 * compatible with a CSS length data type.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/length
 * @param {string | number | null} value incoming value definition
 * @returns {string} stringified value representing a CSS length data type
 */
export function parseNumberWithUnits(value: string | number | null) {
  let val = '';

  if (typeof value === 'number' && !Number.isNaN(value)) {
    val = `${value}px`;
  } else if (typeof value === 'string') {
    const last = parseInt(value.slice(-1), 10);
    if ((typeof last === 'number' && !Number.isNaN(last))) {
      val = `${value}px`;
    } else if (/(px|em|vw|vh|ch|%)$/g.test(value) && !Number.isNaN(parseInt(value, 10))) {
      val = value;
    }
  }
  return val;
}

import { IdsElement } from '../ids-base';

/**
 * Casts/Mirrors specific attributes in one-way-bindings to
 * children to avoid boilerplate/errors manually managing
 * this in child components
 *
 * @param {*} superclass class being mixed
 * @returns {any} the extended object
 */
export default (superclass) => class extends superclass {
  constructor() {
    super();
  }

  /**
   * update registered props on registered child component types
   *
   * @param {Array|string} attributes object containing
   * property lookups that will match with types in iterable it's linked with
   * @param {boolean} recursive optional; specifies whether to recursively
   * check simple search of IdsElement on container/perimeter level
   * @param {HTMLElement} scannedEl Base case: element provider.
   * Recursive case: scanned IdsElement in tree
   */
  provideAttributes(attributes = this.providedAttributes, recursive = true, scannedEl = this) {
    for (const el of [...scannedEl.children, ...scannedEl.shadowRoot.children]) {
      for (const [sourceAttribName, componentEntries] of Object.entries(attributes)) {
        if (recursive && el instanceof IdsElement) {
          this.provideAttributes(attributes, true, el);
        }

        for (const entry of componentEntries) {
          const IdsComponent = Array.isArray(entry) ? entry[0] : entry;
          if (!(el instanceof IdsComponent)) { continue; }

          const attribName = Array.isArray(entry)
            ? /* istanbul ignore next */ entry[1]
            : sourceAttribName;

          /* istanbul ignore else */
          if (this.hasAttribute(sourceAttribName) && this.getAttribute(sourceAttribName) !== null) {
            const attribValue = this.getAttribute(sourceAttribName);
            if (el.getAttribute(attribName) !== attribValue) {
              el.setAttribute(attribName, attribValue);
            }
          } else if (el.hasAttribute(attribName)) {
            el.removeAttribute(attribName);
          }
        }
      }
    }
  }

  /**
   * observes when any of instance's props change in order
   * to mirror them to child
   *
   */
  attributeObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      /* istanbul ignore else */
      if (m.type === 'attributes') {
        const value = this.getAttribute(m.attributeName);
        if ((typeof this.providedAttributes?.[m.attributeName] !== 'undefined') && (value !== m.oldValue)) {
          this.provideAttributes({ [m.attributeName]: this.providedAttributes[m.attributeName] });
        }
      }
    }
  });

  connectedCallback() {
    this.attributeObserver.observe(this, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: Object.keys(this.providedAttributes),
      subtree: false
    });
    super.connectedCallback?.();
  }
};

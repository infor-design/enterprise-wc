import {
  IdsElement
} from '../ids-base';

/**
 * Casts/Mirrors specific properties in one-way-bindings to
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
   * update props on casted children
   *
   * @param {Array|string} properties object containing
   * property lookups that will match with types in iterable it's linked with
   * @param {boolean} recursive optional; specifies whether to recursively
   * check simple search of IdsElement on container/perimeter level
   * @param {HTMLElement} scannedEl Base case: element provider.
   * Recursive case: scanned IdsElement in tree
   */
  provideProperties(properties = this.providedProperties, recursive = true, scannedEl = this) {
    for (const el of [...scannedEl.children, ...scannedEl.shadowRoot.children]) {
      for (const [sourceAttribName, componentEntries] of Object.entries(properties)) {
        if (recursive && el instanceof IdsElement) {
          this.provideProperties(properties, true, el);
        }

        for (const entry of componentEntries) {
          const IdsComponent = Array.isArray(entry) ? entry[0] : entry;
          if (!(el instanceof IdsComponent)) { continue; }

          const attribName = Array.isArray(entry) ? entry[1] : sourceAttribName;

          if (this.hasAttribute(attribName)) {
            el.setAttribute(attribName, this.getAttribute(attribName));
          } else {
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
   * TODO: diff attribute before firing provideProperties(...)
   */
  propertyObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes') {
        if (typeof this.providedProperties?.[m.attributeName] !== 'undefined') {
          this.provideProperties({
            [m.attributeName]: this.providedProperties[m.attributeName]
          });
        }
      }
    }
  });

  connectedCallback() {
    this.propertyObserver.observe(this, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: Object.keys(this.providedProperties),
      subtree: false
    });

    this.provideProperties();
    super.connectedCallback?.();
  }
};

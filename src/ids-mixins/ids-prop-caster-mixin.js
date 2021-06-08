import { IdsElement } from '../ids-base';

/**
 * Casts/Mirrors specific properties in one-way-bindings to
 * children to avoid boilerplate/errors manually managing
 * this in child components
 *
 * @param {*} superclass class being mixed
 * @returns {any} the extended object
 */
export default (superclass) => class extends superclass {
  /**
   * update props on casted children
   *
   * @param {Array|string} properties object containing
   * property lookups that will match with types in iterable it's linked with
   * @param {boolean} recursive optional; specifies whether to recursively
   * check simple search of IdsElement on container/perimeter level
   * @param {HTMLElement} scannedEl if recursive, this is set to current
   * scanned IdsElement in tree
   */
  castProperties(properties = this.castedProperties, recursive = false, scannedEl = this) {
    for (const el of [...scannedEl.children, ...scannedEl.shadowRoot.children]) {
      for (const [p, instanceTypes] of Object.entries(properties || this.castedProperties)) {
        if (recursive && el instanceof IdsElement) {
          this.castProperties(properties || this.castedProperties, true, el);
        }

        for (const instanceType of instanceTypes) {
          if (!(el instanceof instanceType)) { continue; }

          if (this.hasAttribute(p)) {
            el.setAttribute(p, this.getAttribute(p));
          } else {
            el.removeAttribute(p);
          }
        }
      }
    }
  }

  /**
   * observes when any of instance's props change in order
   * to mirror them to child
   *
   * TODO: diff attribute before firing castProperties(...)
   */
  castedPropObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes') {
        this.castProperties({
          [m.attributeName]: this.castedProperties[m.attributeName]
        });
      }
    }
  });

  connectedCallback() {
    super.connectedCallback?.();
    this.castedPropObserver.observe(this, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: Object.keys(this.castedProperties),
      subtree: false
    });

    this.castProperties();
  }
};

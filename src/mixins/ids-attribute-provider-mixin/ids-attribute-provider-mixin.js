/* istanbul ignore file */
import { IdsElement } from '../../core';

const identityFn = (v) => v;

/**
 * standard element types that are accepted
 * besides IdsElement when traversing trees
 * (doesn't cover all cases but just a
 * reasonable subset)
 */
const traversibleHTMLTags = new Set(['DIV', 'SPAN']);

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
   * Update registered props on registered child component types
   * @param {object} attributes lookup object containing attributes
   * and their relation when provided to children
   * @param {boolean} recursive optional; specifies whether to recursively
   * check simple search of IdsElement on container/perimeter level
   * @param {HTMLElement} scannedEl Base case: element provider.
   * Recursive case: scanned IdsElement in tree
   */
  provideAttributes(attributes = this.providedAttributes, recursive = true, scannedEl = this) {
    const domNodes = [
      ...(scannedEl.children || []),
      ...(scannedEl.shadowRoot?.children || [])
    ];
    for (const el of domNodes) {
      if (recursive && ((el instanceof IdsElement) || traversibleHTMLTags.has(el?.tagName))) {
        this.provideAttributes(attributes, true, el);
      }

      for (const [sourceAttribute, componentEntries] of Object.entries(attributes)) {
        for (const entry of componentEntries) {
          /** @type {IdsElement} */
          let component;

          /** @type {string} */
          let targetAttribute;

          /** @type {Function} */
          let valueXformer;

          if (entry.prototype instanceof IdsElement) {
            component = entry;
            valueXformer = identityFn;
            targetAttribute = sourceAttribute;
          } else if (typeof entry === 'object') {
            component = entry.component;
            targetAttribute = entry.targetAttribute || sourceAttribute;
            valueXformer = entry.valueXformer || identityFn;
          }

          if (!component || !(el instanceof component)) { continue; }

          const targetValue = valueXformer(this.getAttribute(sourceAttribute));

          /* istanbul ignore else */
          if (this.hasAttribute(sourceAttribute) && (targetValue !== null)) {
            if (el.getAttribute(targetAttribute) !== targetValue) {
              el.setAttribute(targetAttribute, targetValue);
            }
          } else if (el.hasAttribute(targetAttribute) && (targetValue === null)) {
            el.removeAttribute(targetAttribute);
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
    this.provideAttributes();
  }
};

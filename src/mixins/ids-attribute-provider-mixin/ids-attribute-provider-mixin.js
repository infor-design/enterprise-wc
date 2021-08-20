/* istanbul ignore file */
import { IdsElement } from '../../core';

const identityFn = ({ value }) => value;

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
 * @param {Function} attributeProviderDefs definitions for attribute provider
 * @returns {any} the extended object
 */
export default (attributeProviderDefs) => (superclass) => {
  const {
    attributesProvided = [],
    attributesListenedFor = []
  } = attributeProviderDefs;

  const providedAttributes = attributesProvided.map((d) => d.attribute);

  return class extends superclass {
    constructor() {
      super();
    }

    /**
     * Lookups for attributes to map to parent components,
     * and then to the associated definitions for
     * quick de-referencing
     * @type {Map<string, object>}
     */
    #attributesProvidedMap = (() => {
      const map = new Map();
      attributesProvided.forEach((def) => {
        const componentMap = map.get(def.attribute) || new Map();
        componentMap.set(def.component, def);
        map.set(def.attribute, componentMap);
      });

      return map;
    })();

    /**
     * Lookups for targetAttributes to map back to child components
     * on-change
     * @type {Map<string, object>}
     */
    #attributesListenedForMap = (() => {
      const map = new Map();
      attributesListenedFor.forEach((def) => {
        const entries = map.get(def.targetAttribute) || [];
        entries.push(def);
        map.set(def.targetAttribute, entries);
      });

      return map;
    })();

    /**
     * stack of updates to prevent callback when
     * children are updated redundantly
     */
    #providedValueMap = new Map();

    /**
     * Update registered props on registered child component types
     *
     * @param {object} attributes lookup object containing attributes
     * and their relation when provided to children
     * @param {boolean} recursive optional; specifies whether to recursively
     * check simple search of IdsElement on container/perimeter level
     * @param {HTMLElement} scannedEl Base case: element provider.
     * Recursive case: scanned IdsElement in tree
     * @param {number} depth (not needed to provide by user)
     */
    provideAttributes(
      attributes = providedAttributes,
      recursive = true,
      scannedEl = this,
      depth = 1
    ) {
      const domNodes = [
        ...(scannedEl.children || []),
        ...(scannedEl.shadowRoot?.children || [])
      ];

      for (const element of domNodes) {
        for (const sourceAttribute of attributes) {
          const componentMap = this.#attributesProvidedMap.get(sourceAttribute);

          for (const [component, def] of componentMap) {
            if (!component || !(element instanceof component)) { continue; }

            const {
              /** @type {string} */
              targetAttribute = sourceAttribute,
              /** @type {Function} */
              valueXformer = identityFn
            } = def;

            const targetValue = valueXformer({
              value: this.getAttribute(sourceAttribute),
              element,
              depth
            });

            /* istanbul ignore else */
            if (targetValue !== null && element.getAttribute(targetAttribute) !== targetValue) {
              this.#providedValueMap.set(element, targetValue);
              element.setAttribute(targetAttribute, targetValue);
            } else if ((targetValue === null) && element.hasAttribute(targetAttribute)) {
              this.#providedValueMap.set(element, targetValue);
              element.removeAttribute(targetAttribute);
            }
          }
        }

        if (recursive && (
          (element instanceof IdsElement)
          || traversibleHTMLTags.has(element?.tagName))
        ) {
          this.provideAttributes(attributes, true, element, depth + 1);
        }
      }
    }

    /**
     * observes when any of instance's props change in order
     * to mirror them to child
     */
    attributeObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        /* istanbul ignore else */
        if (m.type === 'attributes') {
          const value = this.getAttribute(m.attributeName);
          if (this.#attributesProvidedMap.has(m.attributeName) && (value !== m.oldValue)) {
            this.provideAttributes([m.attributeName]);
          }
        }
      }
    });

    connectedCallback() {
      this.attributeObserver.observe(this, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: providedAttributes,
        subtree: false
      });

      super.connectedCallback?.();
      this.provideAttributes();
    }
  };
};

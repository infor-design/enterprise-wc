/* istanbul ignore file */
import { IdsElement } from '../../core';

const identityFn = ({ value }) => value;

/**
 * standard element types that are accepted
 * besides IdsElement when traversing trees
 * (doesn't cover all cases but just a
 * reasonable subset)
 */
const traversibleTagSet = new Set(['DIV', 'SPAN']);

/**
 * @typedef AttributeProvidedDef
 * @property {string} attribute the type of attribute being provided
 * @property {string} targetAttribute the attribute being targeted
 * on the child which is assigned
 * @property {Function} valueTransformer transforms the value assigned
 * @property {Array} sentinelTags tags where we know to stop searching for more nodes < @TODO.
 * intended element and can stop traversing; can also be IdsElement tags e.g. ['IDS-BUTTON']
 */

/**
 * Casts/Mirrors specific attributes in one-way-bindings to
 * children to avoid boilerplate/errors manually managing
 * this in child components
 *
 * @param {object} defs definitions for attribute provider
 * @param {Array<AttributeProvidedDef>} defs.attributesProvided definitions relating to how
 * attributes will be provided down the DOM tree to provide attributes
 * @returns {any} the extended object
 */
const IdsAttributeProviderMixin = (defs) => (superclass) => {
  const {
    attributesProvided = [],
    attributesListenedFor = [],
    maxDepth = Number.MAX_SAFE_INTEGER,
    sentinelTags = []
  } = defs;

  const sentinelTagSet = new Set(sentinelTags);

  // vars intended for private/static access among component
  // for attribute mapping and lookups
  // (will be more important when we have two-way lookups,
  // for now it is just laid out here for consistency with
  // that)

  const providedAttributes = attributesProvided.map((d) => d.attribute);

  /**
   * Lookups for attributes to map to parent components,
   * and then to the associated definitions for
   * quick de-referencing; provides some meta data
   * to help do that when needed
   *
   * @type {Map<string, object>}
   */
  const attributesProvidedMap = new Map();
  attributesProvided.forEach((def) => {
    const componentMap = attributesProvidedMap.get(def.attribute) || new Map();
    componentMap.set(def.component, def);
    attributesProvidedMap.set(def.attribute, componentMap);
  });

  /**
   * Lookups for targetAttributes to map back to child components
   * on-change;
   *
   * not currently used yet but will be needed for 2-way binding
   * @type {Map<string, object>}
   */
  const attributesListenedForMap = new Map();
  attributesListenedFor.forEach((def) => {
    const entries = attributesListenedForMap.get(def.targetAttribute) || [];
    entries.push(def);
    attributesListenedForMap.set(def.targetAttribute, entries);
  });

  return class extends superclass {
    constructor() {
      super();
    }

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

      // walk the dom starting at element
      for (const element of domNodes) {
        for (const sourceAttribute of attributes) {
          const componentMap = attributesProvidedMap.get(sourceAttribute);

          for (const [component, def] of componentMap) {
            if (!component || !(element instanceof component)) { continue; }

            const {
              /** @type {string} */
              targetAttribute = sourceAttribute,
              /** @type {Function} */
              valueTransformer = identityFn
            } = def;

            const targetValue = valueTransformer({
              value: this.getAttribute(sourceAttribute),
              element,
              depth
            });

            /* istanbul ignore else */
            if (targetValue !== null && element.getAttribute(targetAttribute) !== targetValue) {
              element.setAttribute(targetAttribute, targetValue);
            } else if ((targetValue === null) && element.hasAttribute(targetAttribute)) {
              element.removeAttribute(targetAttribute);
            }
          }
        }

        if (depth > maxDepth) {
          return;
        }

        const isIdsElement = element instanceof IdsElement;
        const isRelevantTag = (
          traversibleTagSet.has(element?.tagName)
          && !sentinelTagSet.has(element?.tagName)
        );
        if (recursive && (isIdsElement || isRelevantTag)) {
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
          if (attributesProvidedMap.has(m.attributeName) && (value !== m.oldValue)) {
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

export default IdsAttributeProviderMixin;

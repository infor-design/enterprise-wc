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
 * @param {Function} attributeProviderDefs definitions for attribute provider
 * @returns {any} the extended object
 */
export default (attributeProviderDefs) => (superclass) => {
  const {
    attributesProvided = [],
    attributesListenedFor = []
  } = attributeProviderDefs;

  const attributeList = attributesProvided.map((d) => d.attribute);

  return class extends superclass {
    constructor() {
      super();
    }

    /**
     * Lookups for attributes to map to parent components
     * @type {Map<string, object>}
     */
    #attributesProvidedMap = new Map(attributesProvided.map((d) => (
      [d.attribute, d]
    )));

    /**
     * Lookups for targetAttributes to map back to child components
     * on-change
     * @type {Map<string, object>}
     */
    #attributesListenedForMap = new Map(attributesListenedFor.map((d) => (
      [d.targetAttribute, d]
    )));

    /**
     * Lookups for components to map to definitions.
     * @type {Map<IdsElement, object>}
     */
    #componentsListenedForMap = (() => {
      attributesListenedFor.forEach((d) => {
        const map = new Map();
        const components = d.component?.[0] ? d.component : [d.component];
        components.forEach((c) => map.set(c, d));

        return map;
      });
    })();

    /**
     * Update registered props on registered child component types
     *
     * @param {object} attributes lookup object containing attributes
     * and their relation when provided to children
     * @param {boolean} recursive optional; specifies whether to recursively
     * check simple search of IdsElement on container/perimeter level
     * @param {HTMLElement} scannedEl Base case: element provider.
     * Recursive case: scanned IdsElement in tree
     */
    provideAttributes(attributes = attributeList, recursive = true, scannedEl = this) {
      const domNodes = [
        ...(scannedEl.children || []),
        ...(scannedEl.shadowRoot?.children || [])
      ];

      for (const element of domNodes) {
        for (const sourceAttribute of attributes) {
          const {
            /** @type {IdsElement} */
            component: componentDef,
            /** @type {string} */
            targetAttribute = sourceAttribute,
            /** @type {Function} */
            valueXformer = identityFn
          } = this.#attributesProvidedMap.get(sourceAttribute);

          /** @type {IdsElement|Array<IdsElement>} */
          const components = componentDef?.[0] ? componentDef : [componentDef];

          for (const component of components) {
            if (!component || !(element instanceof component)) { continue; }

            const targetValue = valueXformer({
              value: this.getAttribute(sourceAttribute),
              element
            });

            /* istanbul ignore else */
            if (this.hasAttribute(sourceAttribute) && (targetValue !== null)) {
              if (element.getAttribute(targetAttribute) !== targetValue) {
                element.setAttribute(targetAttribute, targetValue);
              }
            } else if (element.hasAttribute(targetAttribute) && (targetValue === null)) {
              element.removeAttribute(targetAttribute);
            }
          }
        }

        if (recursive && (
          (element instanceof IdsElement)
          || traversibleHTMLTags.has(element?.tagName))
        ) {
          this.provideAttributes(attributes, true, element);
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
        attributeFilter: attributeList,
        subtree: false
      });

      super.connectedCallback?.();
      this.provideAttributes();
    }
  };
};

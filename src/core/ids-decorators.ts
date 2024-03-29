/**
 * Custom Element Decorator
 * @param {string} name The custom element name
 * @returns {Function} The function that did the decorating
 */
export function customElement(name: string) {
  return (target: any) => {
    if (!customElements.get(name)) {
      customElements.define(name, target);
    }
  };
}

/**
 * Styles Decorator
 * @param {string} cssStyles The css stringified stylesheet
 * @returns {Function} The function that did the decorating
 */
export function scss(cssStyles: string) {
  return (target: any) => {
    target.prototype.cssStyles = cssStyles;
  };
}

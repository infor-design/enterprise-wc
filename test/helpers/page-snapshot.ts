import percySnapshot from '@percy/puppeteer';

/**
 * Wraps percy snap shot in a custom function
 * @param {any} page puppetteer page object
 * @param {string} name name of snapshot
 * @param {any} options snapshot options
 * @returns {Promise} promise resolving after miliseconds specified
 */
function pageSnapshot(page: any, name: string, options?: any) {
  return percySnapshot(page, name, { disableShadowDOM: true, ...options });
}

export default pageSnapshot;

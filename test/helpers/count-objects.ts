/**
 * Count the objects looking for memory leaks.
 * @param {any} page any the puppeteer page
 * @returns {any} numberOfObjects page handler
 */
const countObjects = async (page: any) => {
  const prototypeHandle = await page.evaluateHandle(() => Object.prototype);
  const objectsHandle = await page.queryObjects(prototypeHandle);
  const numberOfObjects = await page.evaluate((instances: any) => instances.length, objectsHandle);

  await Promise.all([
    prototypeHandle.dispose(),
    objectsHandle.dispose()
  ]);

  return numberOfObjects;
};

export default countObjects;

const testValues = [
  '<script>alert()<\/script>', // eslint-disable-line
  '&lt;script&gt;alert()&lt;\script&gt;', // eslint-disable-line
  '&lt;svg/onload=alert(1)&gt;',
  'script<img src=\'a\'onerror=\'alert(0)\'>', // eslint-disable-line
  '<svg/onload=alert(1)>',
  '<script>alert(1)<\/script>', // eslint-disable-line
  '<img src=x onerror=alert("sup")>test'
];

/**
 * Makes a readable selector string for use with console reporting
 * @param {HTMLElement} el the element to analyze
 * @returns {string} a selector string
 */
const elementConsoleReporter = (el: HTMLElement) => {
  const tagName = el.tagName.toLowerCase();
  const className = el.classList.length ? `.${[...el.classList].join('.')}` : '';
  const id = el.id ? `#${el.id}` : '';
  return `${tagName}${id}${className}`;
};

/**
 * Checks an attribute setter on an IDS Component against a known set of XSS vulnerabilities
 * @param {HTMLElement} targetElement the element to test
 * @param {string} attributeName the attribute name to test (kebab-case, DOM)
 * @param {unknown} expectedValue a value which should be set on the attribute in the event an incoming value is invalid
 */
export default function TestForXSSVulnerabilities(
  targetElement: any,
  attributeName: string,
  expectedValue: unknown
) {
  if (!(attributeName in targetElement)) throw new Error(`Element "${elementConsoleReporter(targetElement)}" has no property "${attributeName}"`);

  testValues.forEach((val) => {
    targetElement[attributeName] = val;
    expect(targetElement[attributeName]).toBe(expectedValue);
  });
}

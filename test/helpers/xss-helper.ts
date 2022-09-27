const testValues = [
  { input: '<script>alert()<\/script>', output: 'alert()' }, // eslint-disable-line
  { input: '&lt;script&gt;alert()&lt;\script&gt;', output: '&lt;script&gt;alert()&lt;\script&gt;' }, // eslint-disable-line
  { input: '&lt;svg/onload=alert(1)&gt;', output: '&lt;svg/onload=alert(1)&gt;' },
  { input: 'script<img src=\'a\'onerror=\'alert(0)\'>', output: 'script' }, // eslint-disable-line
  { input: '<svg/onload=alert(1)>', output: '' },
  { input: '<script>alert(1)<\/script>', output: 'alert(1)' }, // eslint-disable-line
  { input: '<img src=x onerror=alert("sup")>test', output: 'test' }
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

  testValues.forEach((entry) => {
    targetElement[attributeName] = entry.input;

    // Output is either the "output" string provided, or the expected value, depending on how much is stripped.
    expect([expectedValue, entry.output]).toContain(targetElement[attributeName]);
  });
}

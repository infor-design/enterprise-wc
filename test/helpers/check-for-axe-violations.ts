import { AxePuppeteer } from '@axe-core/puppeteer';

// Console output customization
// (Jest uses `process.stdout.write()`)
const bold = (x: string) => `\x1b[1m${x}\x1b[0m`;
const dim = (x: string) => `\x1b[2m${x}\x1b[0m`;
const red = (x: string) => `\x1b[1m\x1b[31m${x}\x1b[0m`;

/**
 * Creates additional console input about aXe errors
 * @param {any} results aXe results object
 * @param {boolean} verbose true if we should include information about each DOM node containing a violation
 * @returns {string} error output
 */
const reportErrors = (results: any, verbose = true) => {
  let msg = '';

  if (results.violations.length) {
    msg += `${red(`aXe violation(s) discovered: ${results.violations.length}`)}\n\n`;
    results.violations.forEach((violation: any) => {
      msg += `id: '${bold(violation.id)}'\n`;
      msg += `nodes affected: ${violation.nodes?.length || 0}\n`;
      msg += `reason: ${violation.help}\n`;
      msg += `${dim(`(${violation.helpUrl})`)}\n`;
      if (verbose) {
        if (violation.nodes.length) {
          msg += `nodes:\n\n`;
          violation.nodes.forEach((node: any) => {
            msg += `${dim(node.html)}\n`;
            msg += `  ${node.failureSummary}\n\n`;
          });
        }
      }
      msg += '\n';
    });
  }
  return msg;
};

/**
 * Wrapper around `aXe` tests that provides additional console output about the specific aXe violations
 * @param {any} page reference to the puppeteer page
 * @param {Array<string>} disabledRules list of aXe violations to ignore
 */
const checkForAxeViolations = async (page: any, disabledRules: Array<string> = []) => {
  const results = await new AxePuppeteer(page)
    .disableRules(disabledRules)
    .analyze();

  try {
    expect(results.violations.length).toBe(0);
  } catch (err) {
    throw new Error(reportErrors(results));
  }
};

export default checkForAxeViolations;

import wait from './wait';

/**
 * wrapper for waiting for a Puppeteer page load with an additional specified duration
 * (used on some test pages that need snapshots to wait one or more `requestAnimationFrame` ticks)
 *
 * @param {string} url the page URL to load
 * @param {string} [theme] optional theme set
 * @param {number} duration time in miliseconds
 * @returns {Promise} promise resolving after miliseconds specified
 */
const waitForPageLoad = async (url, theme, duration) => {
  await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  if (theme) {
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', theme);
    });
  }
  await wait(duration);
};

export default waitForPageLoad;

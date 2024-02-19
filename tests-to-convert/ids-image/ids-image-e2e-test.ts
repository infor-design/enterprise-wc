import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

const imgSrcExists = '../assets/images/placeholdeer-60x60.png';
const imgSrcNotFound = '../assets/images/non-existant.jpg';
const placeholderEl = '#e2e-placeholder';
const fallbackEl = '#e2e-fallback';

describe('Ids Image e2e Tests', () => {
  const url = 'http://localhost:4444/ids-image/example.html';


  test('should render placeholder on image error', async () => {
    const hasPlaceholder = await page.$eval(fallbackEl, (el: HTMLElement) => el.shadowRoot?.querySelector('.placeholder'));

    expect(hasPlaceholder).toBeTruthy();
  });

  test('should render placeholder via attribute', async () => {
    const hasPlaceholder = await page.$eval(placeholderEl, (el: HTMLElement) => el.shadowRoot?.querySelector('.placeholder'));

    expect(hasPlaceholder).toBeTruthy();
  });

  test('should change placeholder to src', async () => {
    await page.evaluate((el: string, src: string) => {
      const element = document.querySelector<any>(el);
      element.placeholder = false;
      element.src = src;
    }, placeholderEl, imgSrcExists);

    const hasImage = await page.$eval(placeholderEl, (el: HTMLElement) => el.shadowRoot?.querySelector('img'));

    expect(hasImage).toBeTruthy();
  });

  test('should render placeholder if src changed and img failed to load', async () => {
    await page.evaluate((el: string, src: string) => {
      const element = document.querySelector<any>(el);
      element.src = src;
    }, fallbackEl, imgSrcNotFound);

    // Image failed to load - placeholder appears
    await page.waitForFunction(() => document.querySelector('#e2e-fallback')?.shadowRoot?.querySelector('.placeholder'));

    const hasPlaceholder = await page.$eval(fallbackEl, (el: HTMLElement) => el.shadowRoot?.querySelector('.placeholder'));

    expect(hasPlaceholder).toBeTruthy();
  });
});

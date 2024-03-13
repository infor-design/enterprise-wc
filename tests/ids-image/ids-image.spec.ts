import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsImage from '../../src/components/ids-image/ids-image';

test.describe('IdsImage tests', () => {
  const url = '/ids-image/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Image Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('e2e tests', () => {
    const imgSrcExists = '../assets/images/placeholder-60x60.png';
    const imgSrcNotFound = '../assets/images/non-existant.jpg';
    const placeholderEl = '#e2e-placeholder';
    const fallbackEl = '#e2e-fallback';
    test('should render placeholder on image error', async ({ page }) => {
      const hasPlaceholder = await page.locator(fallbackEl).evaluateHandle((el) => el.shadowRoot?.querySelector('.placeholder'));

      expect(hasPlaceholder).toBeTruthy();
    });

    test('should render placeholder via attribute', async ({ page }) => {
      const hasPlaceholder = await page.locator(placeholderEl).evaluateHandle((el) => el.shadowRoot?.querySelector('.placeholder'));

      expect(hasPlaceholder).toBeTruthy();
    });

    test('should change placeholder to src', async ({ page }) => {
      await page.evaluate(({ elSelector, src }) => {
        const element = document.querySelector(elSelector) as IdsImage;
        element.placeholder = false; // Remove placeholder attribute
        element.src = src; // Set image source
      }, { elSelector: placeholderEl, src: imgSrcExists });

      const hasImage = await page.locator(placeholderEl).evaluateHandle((el) => el.shadowRoot?.querySelector('img'));

      expect(hasImage).toBeTruthy();
    });

    test('should render placeholder if src changed and img failed to load', async ({ page }) => {
      await page.evaluate(({ elSelector, src }) => {
        const element = document.querySelector(elSelector) as IdsImage;
        element.src = src;
      }, { elSelector: fallbackEl, src: imgSrcNotFound });

      // Image failed to load - placeholder appears
      await page.waitForFunction(() => document.querySelector('#e2e-fallback')?.shadowRoot?.querySelector('.placeholder'));

      const hasPlaceholder = await page.locator(fallbackEl).evaluateHandle((el) => el.shadowRoot?.querySelector('.placeholder'));

      expect(hasPlaceholder).toBeTruthy();
    });
  });

  test.describe('functional tests', () => {
    let alt: string;
    let name: string;
    let size: string;
    let src: string;
    let idsImage: IdsImage;

    test.describe('IdsImage Component (using properties', () => {
      test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
          document.body.innerHTML = '';
          src = '../assets/images/placeholder-60x60.png';
          alt = 'example alt';
          size = 'sm';
          idsImage = document.createElement('ids-image') as IdsImage;

          document.body.appendChild(idsImage);
          idsImage.src = src;
          idsImage.alt = alt;
          idsImage.size = size;
        });
      });

      test('should render', async ({ page }) => {
        const elementCount = await page.evaluate(() => {
          name = 'ids-image';
          return document.querySelectorAll(name).length;
        });

        const errors = [];

        page.on('console', async (msg) => {
          if (msg.type() === 'error') errors.push(msg.text());
        });

        expect(elementCount).toEqual(1);
        expect(errors.length).toEqual(0);
      });

      test('has properties', async ({ page }) => {
        const properties = await page.evaluate(() => [idsImage.src, idsImage.alt, idsImage.size]);

        expect(properties).toEqual(['../assets/images/placeholder-60x60.png', 'example alt', 'sm']);
      });

      test('should set size auto as default', async ({ page }) => {
        let imgSize: any;

        await page.evaluate(() => {
          idsImage.size = null;
        });
        imgSize = await page.evaluate(() => idsImage.size);
        expect(imgSize).toEqual('auto');

        await page.evaluate(() => {
          idsImage.size = 'md';
        });
        imgSize = await page.evaluate(() => idsImage.size);
        expect(imgSize).toEqual('md');

        await page.evaluate(() => {
          idsImage.size = 'none';
        });
        imgSize = await page.evaluate(() => idsImage.size);
        expect(imgSize).toEqual('auto');
      });
    });

    test.describe('IdsImage Component (using attributes)', () => {
      test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
          document.body.innerHTML = '';
          src = '../assets/images/placeholder-60x60.png';
          alt = 'example alt';
          size = 'sm';
          name = 'ids-image';

          document.body.insertAdjacentHTML('beforeend', `
            <ids-image src="${src}" alt="${alt}" size="${size}" fallback="true"></ids-image>
          `);
          idsImage = document.querySelector(name) as IdsImage;
        });
      });

      test('should render', async ({ page }) => {
        const elementCount = await page.evaluate(() => {
          name = 'ids-image';
          return document.querySelectorAll(name).length;
        });

        const errors = [];

        page.on('console', async (msg) => {
          if (msg.type() === 'error') errors.push(msg.text());
        });

        expect(elementCount).toEqual(1);
        expect(errors.length).toEqual(0);
      });

      test('has properties', async ({ page }) => {
        const properties = await page.evaluate(() => [idsImage.src, idsImage.alt, idsImage.size, idsImage.fallback]);

        expect(properties).toEqual(['../assets/images/placeholder-60x60.png', 'example alt', 'sm', true]);
      });

      test('should set size auto as default', async ({ page }) => {
        await page.evaluate(() => {
          idsImage.size = null;
        });
        let imgSize = await page.evaluate(() => idsImage.size);
        expect(imgSize).toEqual('auto');

        await page.evaluate(() => {
          idsImage.size = 'md';
        });
        imgSize = await page.evaluate(() => idsImage.size);
        expect(imgSize).toEqual('md');

        await page.evaluate(() => {
          idsImage.size = 'none';
        });
        imgSize = await page.evaluate(() => idsImage.size);
        expect(imgSize).toEqual('auto');
      });

      test('img has src attributes', async ({ page }) => {
        const imgSrc = await page.evaluate(() => idsImage.getAttribute('src'));
        expect(imgSrc).toEqual('../assets/images/placeholder-60x60.png');
      });

      test('can change src, alt, and fallback attributes', async ({ page }) => {
        await page.evaluate(() => {
          idsImage.src = '../assets/images/placeholder-154x120.png';
          idsImage.alt = 'alt updated';
          idsImage.fallback = false;
        });
        const imgSrc = await page.evaluate(() => idsImage.getAttribute('src'));
        let imgAlt = await page.evaluate(() => idsImage.getAttribute('alt'));
        const imgFallback = await page.evaluate(() => idsImage.getAttribute('fallback'));

        expect(imgFallback).toBeNull();
        expect(imgSrc).toEqual('../assets/images/placeholder-154x120.png');
        expect(imgAlt).toEqual('alt updated');

        imgAlt = await page.evaluate(() => {
          idsImage.alt = ''; // Based on the method in the alt setter, it only accepts a string.
          return idsImage.getAttribute('alt');
        });

        expect(imgAlt).toBeNull();
      });
    });

    test.describe('IdsImage Component (empty)', () => {
      test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
          document.body.innerHTML = '';
          document.body.insertAdjacentHTML('beforeend', `<ids-image></ids-image>`);
          idsImage = document.querySelector('ids-image') as IdsImage;
        });
      });

      test('should render', async ({ page }) => {
        const elementCount = await page.evaluate(() => {
          name = 'ids-image';
          return document.querySelectorAll(name).length;
        });

        const errors = [];

        page.on('console', async (msg) => {
          if (msg.type() === 'error') errors.push(msg.text());
        });

        expect(elementCount).toEqual(1);
        expect(errors.length).toEqual(0);
      });

      test('should have default properties', async ({ page }) => {
        const properties = await page.evaluate(() => idsImage.size);

        expect(properties).toEqual('auto');
      });

      test('should render placeholder', async ({ page }) => {
        const hasPlaceholder = await page.evaluate(() => idsImage?.shadowRoot?.querySelector('.placeholder'));

        expect(hasPlaceholder).toBeTruthy();
      });

      test('should render image after src changed', async ({ page }) => {
        await page.evaluate(() => {
          idsImage.src = '../assets/images/placeholder-60x60.png';
        });

        const hasPlaceholder = await page.evaluate(() => idsImage?.shadowRoot?.querySelector('.placeholder'));
        const hasImage = await page.evaluate(() => idsImage?.shadowRoot?.querySelector('img'));

        expect(hasPlaceholder).toBeFalsy();
        expect(hasImage).toBeTruthy();
      });
    });

    test.describe('IdsImage Component (round and statuses)', () => {
      test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
          document.body.innerHTML = '';
          src = '../assets/images/placeholder-60x60.png';
          alt = 'example alt';

          document.body.insertAdjacentHTML(
            'beforeend',
            `<ids-image src="${src}" alt="${alt}" round="true" user-status="available"></ids-image>`
          );
          idsImage = document.querySelector('ids-image') as IdsImage;
        });
      });

      test('should render', async ({ page }) => {
        const elementCount = await page.evaluate(() => {
          name = 'ids-image';
          return document.querySelectorAll(name).length;
        });

        const errors = [];

        page.on('console', async (msg) => {
          if (msg.type() === 'error') errors.push(msg.text());
        });

        expect(elementCount).toEqual(1);
        expect(errors.length).toEqual(0);
      });

      test('should have attributes', async ({ page }) => {
        const properties = await page.evaluate(() => [idsImage.round, idsImage.getAttribute('round'), idsImage.userStatus, idsImage.getAttribute('user-status')]);

        expect(properties).toEqual([true, 'true', 'available', 'available']);
      });

      test('should change attributes', async ({ page }) => {
        await page.evaluate(() => {
          idsImage.round = false;
          idsImage.userStatus = null;
        });

        const properties = await page.evaluate(() => [idsImage.round, idsImage.getAttribute('round'), idsImage.userStatus, idsImage.getAttribute('user-status')]);

        expect(properties).toEqual([false, null, null, null]);

        await page.evaluate(() => {
          idsImage.round = true;
          idsImage.userStatus = 'away';
        });

        const newProperties = await page.evaluate(() => [idsImage.round, idsImage.getAttribute('round'), idsImage.userStatus, idsImage.getAttribute('user-status')]);

        expect(newProperties).toEqual([true, 'true', 'away', 'away']);
      });

      test('should change to initials', async ({ page }) => {
        await page.evaluate(() => {
          idsImage.initials = 'mn';
        });

        expect(await page.evaluate(() => idsImage.getAttribute('initials'))).toEqual('mn');
        expect(await page.evaluate(() => idsImage.shadowRoot?.querySelector('img'))).toBeFalsy();
        expect(await page.evaluate(() => idsImage.shadowRoot?.querySelector('.initials'))).toBeTruthy();
      });

      test('should render initials and back to placeholder', async ({ page }) => {
        await page.evaluate(() => {
          document.body.innerHTML = '';
          document.body.insertAdjacentHTML(
            'beforeend',
            `<ids-image round="true" initials="long"></ids-image>`
          );
          idsImage = document.querySelector('ids-image') as IdsImage;
        });

        expect(await page.evaluate(() => idsImage.getAttribute('initials'))).toEqual('long');
        expect(await page.evaluate(() => idsImage.shadowRoot?.querySelector('.initials'))).toBeTruthy();

        await page.evaluate(() => {
          idsImage.initials = null;
        });

        expect(await page.evaluate(() => idsImage.getAttribute('initials'))).toBeNull();
        expect(await page.evaluate(() => idsImage.shadowRoot?.querySelector('.placeholder'))).toBeTruthy();
      });
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-image');
      const html = await handle?.evaluate((el: IdsImage) => el?.outerHTML);
      expect(html).toMatchSnapshot('image-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-image');
      const html = await handle?.evaluate((el: IdsImage) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      expect(html).toMatchSnapshot('image-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-image-light');
    });
  });
});

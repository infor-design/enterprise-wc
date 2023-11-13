/**
 * Made this to generate the tests in tests folder initially.
 * Kept it around in case useful can be removed if it isnt.
 */
const path = require('path');
const fs = require('fs');
const fsFiles = require('./node-fs-files');

const template = `import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import {nameCaps} from '../../src/components/{name}/{name}';

test.describe('{nameCaps} tests', () => {
  const url = '/{name}/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS {nameOnlyCaps} Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
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
      const handle = await page.$('{name}');
      const html = await handle?.evaluate((el: {nameCaps}) => el?.outerHTML);
      await expect(html).toMatchSnapshot('{nameOnlyKebab}-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('{name}');
      const html = await handle?.evaluate((el: {nameCaps}) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('{nameOnlyKebab}-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, '{name}-light');
    });
  });
});
`;

const componentArray = [];
const filterArray = fsFiles('./src/components', 'ts').filter((item) => (!item.includes('demo') && item.includes('.ts') && !item.includes('ids-locale')));
filterArray.forEach((entry) => {
  const name = path.basename(path.dirname(entry));
  if (!componentArray.includes(name) && name.substring(0, 3) === 'ids') componentArray.push(name);
});

const capitalize = (string) => string.replaceAll('-', ' ').replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()).replaceAll(' ', '');

componentArray.forEach((entry) => {
  const folder = `tests/${entry}/`;
  const file = `${folder}/${entry}.spec.ts`;

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  if (!fs.existsSync(file)) {
    const fileContents = template
      .replaceAll(`{name}`, entry)
      .replaceAll(`{nameCaps}`, capitalize(entry))
      .replaceAll(`{nameOnlyCaps}`, capitalize(entry).replace('Ids', ''))
      .replaceAll(`{nameOnlyKebab}`, entry.replace('ids-', '').toLowerCase());

    // eslint-disable-next-line no-console
    console.info(`Making file: ${folder}/${entry}.spec.ts`);
    fs.writeFileSync(file, fileContents);
  }
});

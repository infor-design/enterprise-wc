import { expect } from '@playwright/test';
import { test, runFunction } from '../base-fixture';

test.describe('IdsColorUtils tests', () => {
  const url = '/ids-demo-app/utils.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('can convert hex colors to RGB format', async ({ page }) => {
    expect(await runFunction(page, 'colorNameToRgba', '#0072ED')).toEqual('rgb(0 114 237)');
  });

  test('can convert hex colors to RGBA format', async ({ page }) => {
    expect(await runFunction(page, 'colorNameToRgba', '#0072ED', '0.5')).toEqual('rgba(0 114 237 / 0.5)');
  });

  test('can convert built-in colors to RGB format', async ({ page }) => {
    expect(await runFunction(page, 'colorNameToRgba', 'red')).toEqual('rgb(255 0 0)');
  });
});

import { expect } from '@playwright/test';
import { test, runFunction } from '../base-fixture';
import {
  colorNameToRgba,
  contrastColor
} from '../../src/utils/ids-color-utils/ids-color-utils';

test.describe('IdsColorUtils tests', () => {
  const url = '/ids-demo-app/utils.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('can convert hex colors to RGB format', async ({ page }) => {
    await page.exposeFunction('colorNameToRgba', (color: string) => colorNameToRgba(color));
    const color = await page.evaluate((inputColor: string) => (window as any).colorNameToRgba(inputColor), '#0072ED');

    expect(color).toEqual('rgb(0 114 237)');
  });

  test('can convert hex colors to RGBA format', async ({ page }) => {
    await page.exposeFunction('colorNameToRgba', (color: string, opacity: number) => colorNameToRgba(color, opacity));
    const rgbaColor: string = await page.evaluate(() => (window as any).colorNameToRgba('#0072ED', '0.5'));

    expect(rgbaColor).toEqual('rgba(0 114 237 / 0.5)');
  });

  test('can convert built-in colors to RGB format', async ({ page }) => {
    expect(await runFunction(page, 'colorNameToRgba', 'red')).toEqual('rgb(255 0 0)');
  });

  test('can get contrast colors', async ({ page }) => {
    await page.exposeFunction('contrastColor', (color: string, lightColor: string, darkColor: string) => contrastColor(color, lightColor, darkColor));
    const color1 = await page.evaluate(() => (window as any).contrastColor('#ffffff', '#ffffff', '#000000'));
    const color2 = await page.evaluate(() => (window as any).contrastColor('#000000', '#ffffff', '#000000'));
    const color3 = await page.evaluate(() => (window as any).contrastColor('#2AC371', '#ffffff', '#000000'));

    expect(color1).toEqual('#000000');
    expect(color2).toEqual('#ffffff');
    expect(color3).toEqual('#ffffff');
  });
});

import { expect } from '@playwright/test';
import { test, runFunction } from '../base-fixture';

test.describe('IdsObjectUtils Tests', () => {
  const url = '/ids-demo-app/utils.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('should check whether the given object is an object or not', async ({ page }) => {
    const obj = { field: 'test-value' };

    expect(await runFunction(page, 'isObject', obj)).toEqual(true);
    expect(await runFunction(page, 'isObject', 123)).toEqual(false);
    expect(await runFunction(page, 'isObject', 'test')).toEqual(false);
    expect(await runFunction(page, 'isObject', ['a', 'b', 'c'])).toEqual(false);
  });

  test('should check the given object is an object and NOT empty', async ({ page }) => {
    const obj = { field: 'test-value' };
    const objEmpty = {};

    expect(await runFunction(page, 'isObjectAndNotEmpty', obj)).toEqual(true);
    expect(await runFunction(page, 'isObjectAndNotEmpty', objEmpty)).toEqual(false);
    expect(await runFunction(page, 'isObjectAndNotEmpty', 123)).toEqual(false);
    expect(await runFunction(page, 'isObjectAndNotEmpty', 123)).toEqual(false);
    expect(await runFunction(page, 'isObjectAndNotEmpty', 'test')).toEqual(false);
    expect(await runFunction(page, 'isObjectAndNotEmpty', ['a', 'b', 'c'])).toEqual(false);
  });
});

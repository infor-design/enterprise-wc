import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import NiceScale from '../../src/components/ids-axis-chart/ids-nice-scale';

test.describe('Nice Scale Tests', () => {
  test('computes scales', async ({ page }) => {
    await page.exposeFunction('testNiceScaleComputesScales', () => ([
      new NiceScale(-0.085, 0.173),
      new NiceScale(100, 200, { maxTicks: 10, minPoint: 100, maxPoint: 200 }),
      new NiceScale(105, 543),
      new NiceScale(2.04, 2.16),
      new NiceScale(0, 100),
      new NiceScale(0, 9999),
      new NiceScale(0, 10),
    ]));

    const scales: any = await page.evaluate(() => (window as any).testNiceScaleComputesScales());

    expect(scales[0]).toEqual({ niceMax: 0.2, niceMin: -0.1, tickSpacing: 0.05 });

    expect(scales[1]).toEqual({ niceMax: 200, niceMin: 100, tickSpacing: 10 });

    expect(scales[2]).toEqual({ niceMax: 550, niceMin: 100, tickSpacing: 50 });

    expect(scales[3]).toEqual({ niceMax: 2.16, niceMin: 2.04, tickSpacing: 0.02 });

    expect(scales[4]).toEqual({ niceMax: 100, niceMin: 0, tickSpacing: 10 });

    expect(scales[5]).toEqual({ niceMax: 10000, niceMin: 0, tickSpacing: 1000 });

    expect(scales[6]).toEqual({ niceMax: 10, niceMin: 0, tickSpacing: 1 });
  });

  test('can loop the scale', async ({ page }) => {
    await page.exposeFunction('testNiceScaleCanLoopScale', () => ([
      new NiceScale(0, 3411),
    ]));

    const [scale0]: any = await page.evaluate(() => (window as any).testNiceScaleCanLoopScale());

    expect(scale0).toEqual({ niceMax: 3500, niceMin: 0, tickSpacing: 500 });
    const values = [];
    for (let i = scale0.niceMin; i <= scale0.niceMax; i += scale0.tickSpacing) {
      values.push(i);
    }
    expect(values).toEqual([0, 500, 1000, 1500, 2000, 2500, 3000, 3500]);
  });

  test('can set the max ticks on the scale', async ({ page }) => {
    await page.exposeFunction('testNiceScaleCanSetMaxTicks', () => ([
      new NiceScale(0, 3411, { maxTicks: 8 }),
    ]));

    const [scale0]: any = await page.evaluate(() => (window as any).testNiceScaleCanSetMaxTicks());

    expect(scale0).toEqual({ niceMax: 4000, niceMin: 0, tickSpacing: 1000 });

    const values = [];
    for (let i = scale0.niceMin; i <= scale0.niceMax; i += (Number(scale0.tickSpacing))) {
      values.push(i);
    }
    expect(values).toEqual([0, 1000, 2000, 3000, 4000]);
  });
});

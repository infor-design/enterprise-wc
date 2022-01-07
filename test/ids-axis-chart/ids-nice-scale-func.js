/**
 * @jest-environment jsdom
 */
import NiceScale from '../../src/components/ids-line-chart/ids-nice-scale';

describe('Nice Scale Tests', () => {
  it('computes scales', () => {
    let scale = new NiceScale(-0.085, 0.173);
    expect(scale).toEqual({ niceMax: 0.2, niceMin: -0.1, tickSpacing: 0.05 });

    scale = new NiceScale(100, 200, { maxTicks: 10, minPoint: 100, maxPoint: 200 });
    expect(scale).toEqual({ niceMax: 200, niceMin: 100, tickSpacing: 10 });

    scale = new NiceScale(105, 543);
    expect(scale).toEqual({ niceMax: 550, niceMin: 100, tickSpacing: 50 });

    scale = new NiceScale(2.04, 2.16);
    expect(scale).toEqual({ niceMax: 2.16, niceMin: 2.04, tickSpacing: 0.02 });

    scale = new NiceScale(0, 100);
    expect(scale).toEqual({ niceMax: 100, niceMin: 0, tickSpacing: 10 });

    scale = new NiceScale(0, 9999);
    expect(scale).toEqual({ niceMax: 10000, niceMin: 0, tickSpacing: 1000 });

    scale = new NiceScale(0, 10);
    expect(scale).toEqual({ niceMax: 10, niceMin: 0, tickSpacing: 1 });
  });

  it('can loop the scale', () => {
    const scale = new NiceScale(0, 3411);
    expect(scale).toEqual({ niceMax: 3500, niceMin: 0, tickSpacing: 500 });
    const values = [];
    for (let i = scale.niceMin; i <= scale.niceMax; i += scale.tickSpacing) {
      values.push(i);
    }
    expect(values).toEqual([0, 500, 1000, 1500, 2000, 2500, 3000, 3500]);
  });

  it('can set the max ticks the scale', () => {
    const scale = new NiceScale(0, 3411, { maxTicks: 8 });
    expect(scale).toEqual({ niceMax: 4000, niceMin: 0, tickSpacing: 1000 });

    const values = [];
    for (let i = scale.niceMin; i <= scale.niceMax; i += scale.tickSpacing) {
      values.push(i);
    }
    expect(values).toEqual([0, 1000, 2000, 3000, 4000]);
  });
});

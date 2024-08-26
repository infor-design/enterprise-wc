import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
// import { test, expect } from '../base-fixture';
import { test, expect } from '../base-fixture';
import IdsSlider from '../../src/components/ids-slider/ids-slider';

test.describe('IdsSlider tests', () => {
  const url = '/ids-slider/example.html';
  let idsSlider: any;
  let rangeSlider: any;
  let stepSlider: any;
  let verticalRangeSlider: any;
  let verticalStepSlider: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    idsSlider = await page.locator('ids-slider').first();
    rangeSlider = await page.locator('ids-slider[type="range"]').first();
    stepSlider = await page.locator('ids-slider[type="step"]').first();
    verticalRangeSlider = await page.locator('ids-slider[type="range"][vertical="true"]').first();
    verticalStepSlider = await page.locator('ids-slider[type="step"][vertical="true"]').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Slider Component');
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
    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-slider-light');
    });

    test('should match the visual snapshot in percy (vertical)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-slider/vertical.html');
      await percySnapshot(page, 'ids-slider-vertical-light');
    });

    test('should match the visual snapshot in percy (min-max', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-slider/min-max-step.html');
      await percySnapshot(page, 'ids-slider-minmax-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should be able to render steps', async ({ page }) => {
      const slider = await page.locator('ids-slider').first();
      expect(await slider.getAttribute('step-number')).toBeNull();
      expect(await slider.evaluate((elem: IdsSlider) => elem.stepNumber)).toBe(2);
      expect(await slider.evaluate((elem: IdsSlider) => elem.container?.querySelectorAll('.tick').length)).toBe(2);

      await slider.evaluate((elem: IdsSlider) => {
        elem.type = 'step';
        elem.stepNumber = 1;
      });

      expect(await slider.getAttribute('step-number')).toBe('1');
      expect(await slider.evaluate((elem: IdsSlider) => elem.stepNumber)).toBe(3);
      expect(await slider.evaluate((elem: IdsSlider) => elem.container?.querySelectorAll('.tick').length)).toBe(3);

      await slider.evaluate((elem: IdsSlider) => {
        elem.stepNumber = 2;
      });

      expect(await slider.getAttribute('step-number')).toBe('2');
      expect(await slider.evaluate((elem: IdsSlider) => elem.stepNumber)).toBe(4);
      expect(await slider.evaluate((elem: IdsSlider) => elem.container?.querySelectorAll('.tick').length)).toBe(4);
    });

    test('sets color correctly', async () => {
      await idsSlider.evaluate((el: IdsSlider) => { el.color = '#25af65'; });
      let color = await idsSlider.evaluate((el: IdsSlider) => el.color);
      await expect(color).toBe('#25af65');
      await idsSlider.evaluate((el: IdsSlider) => { el.color = 'error'; });
      color = await idsSlider.evaluate((el: IdsSlider) => el.color);
      await expect(color).toBe('error');
      await idsSlider.evaluate((el: IdsSlider) => { el.color = 'success'; });
      color = await idsSlider.evaluate((el: IdsSlider) => el.color);
      await expect(color).toBe('success');
      await idsSlider.evaluate((el: IdsSlider) => { el.color = 'warning'; });
      color = await idsSlider.evaluate((el: IdsSlider) => el.color);
      await expect(color).toBe('warning');
      await idsSlider.evaluate((el: IdsSlider) => { el.color = '#606066'; });
      color = await idsSlider.evaluate((el: IdsSlider) => el.color);
      await expect(color).toBe('#606066');
      await idsSlider.evaluate((el: IdsSlider) => { el.color = 'purple-50'; });
      color = await idsSlider.evaluate((el: IdsSlider) => el.color);
      await expect(color).toBe('purple-50');
    });

    test('sets labels correctly', async () => {
      await idsSlider.evaluate((el: IdsSlider) => { el.color = '#25af65'; });
      const stepNumber = await idsSlider.evaluate((el: IdsSlider) => el.stepNumber);
      await expect(stepNumber).toBe(2);
      const text = await idsSlider.evaluate((el: IdsSlider) => el.container?.querySelector('ids-text')?.innerHTML);
      await expect(text).toBe('0');
    });

    test('sets vertical step labels correctly', async () => {
      await verticalStepSlider.evaluate((el: IdsSlider) => { el.color = '#25af65'; });
      const stepNumber = await verticalStepSlider.evaluate((el: IdsSlider) => el.stepNumber);
      await expect(stepNumber).toBe(6);
      await verticalStepSlider.evaluate((el: IdsSlider) => { el.labels = ['very bad', 'bad', 'poor', 'okay', 'good', 'very good']; });
      const sliderLabelsLength = await verticalStepSlider.evaluate((el: IdsSlider) => el.container?.querySelectorAll('.label').length);
      await expect(sliderLabelsLength).toBe(6);
      const sliderLabelsInnerHTML = await verticalStepSlider.locator('ids-text').all();

      const sliderLabels = await verticalStepSlider.evaluate((el: IdsSlider) => el.labels);
      let count = 6;

      for await (const label of sliderLabels) {
        await expect(await sliderLabelsInnerHTML[count].innerHTML()).toEqual(label);
        count--;
      }
    });

    test('sets step labels correctly', async () => {
      const slider = await stepSlider.evaluate((el: IdsSlider) => {
        const type = el.type;
        const stepNumber = el.stepNumber;
        return {
          type,
          stepNumber
        };
      });
      await expect(slider.type).toBe('step');
      await expect(slider.stepNumber).toBe(11);
      await stepSlider.evaluate((el: IdsSlider) => { el.labels = ['very bad', 'bad', 'poor', 'okay', 'good', 'very good', 'excellent', 'fantastic', 'superb', 'valiant', 'magnificent']; });
      let sliderLabelsLength = await stepSlider.evaluate((el: IdsSlider) => el.container?.querySelectorAll('.label').length);
      await expect(sliderLabelsLength).toBe(11);
      const sliderLabelsInnerHTML = await stepSlider.locator('ids-text').all();
      let sliderLabels = await stepSlider.evaluate((el: IdsSlider) => el.labels);
      let count = 1;

      for await (const label of sliderLabels) {
        await expect(await sliderLabelsInnerHTML[count].innerHTML()).toEqual(label);
        count++;
      }
      await stepSlider.evaluate((el: IdsSlider) => { el.stepNumber = 2; });
      let stepNumber = await stepSlider.evaluate((el: IdsSlider) => el.stepNumber);
      await expect(stepNumber).toBe(4);
      sliderLabelsLength = await stepSlider.evaluate((el: IdsSlider) => el.container?.querySelectorAll('.label').length);
      await expect(sliderLabelsLength).toBe(4);
      sliderLabels = await stepSlider.evaluate((el: IdsSlider) => el.labels);
      await expect(await sliderLabels[0]).toBe('0');
      await stepSlider.evaluate((el: IdsSlider) => { el.labels = ['worst', 'best']; });
      sliderLabels = await stepSlider.evaluate((el: IdsSlider) => el.labels);
      await expect(await sliderLabels[0]).toBe('worst');
      stepNumber = await stepSlider.evaluate((el: IdsSlider) => el.stepNumber);
      await expect(stepNumber).toBe(4);
    });

    test('sets range slider correctly', async ({ page }) => {
      let slider = await rangeSlider.evaluate((el: IdsSlider) => {
        const value = el.value;
        const valueSecondary = el.valueSecondary;
        return {
          value,
          valueSecondary
        };
      });
      await expect(slider.value).toBe(0);
      await expect(slider.valueSecondary).toBe(100);
      await rangeSlider.evaluate((el: IdsSlider) => { el.valueSecondary = 80; });
      slider = await rangeSlider.evaluate((el: IdsSlider) => {
        const value = el.value;
        const valueSecondary = el.valueSecondary;
        return {
          value,
          valueSecondary
        };
      });
      await expect(slider.valueSecondary).toBe(80);
      await rangeSlider.evaluate((el: IdsSlider) => { el.valueSecondary = el.max + 20; });
      slider = await rangeSlider.evaluate((el: IdsSlider) => {
        const value = el.value;
        const valueSecondary = el.valueSecondary;
        return {
          value,
          valueSecondary
        };
      });
      const sliderMax = rangeSlider.evaluate((el: IdsSlider) => el.max);
      await expect(slider.valueSecondary).toBe(await sliderMax);
      const tooltip = await rangeSlider.getByLabel('Multi-thumb minimum').locator('.tooltip');
      await rangeSlider.evaluate((el: IdsSlider) => { el.thumbDraggable?.click(); el.thumbDraggable?.focus(); });
      expect(await page.evaluate(() => (document as any).activeElement?.name)).toBe('ids-slider');
      await expect(tooltip).toHaveAttribute('style', 'opacity: 1;');
      await tooltip.waitFor({ state: 'visible' });
      await expect(tooltip).toBeVisible();
    });

    test('cannot set range slider thumb values lesser/greater than the opposite thumb', async () => {
      await rangeSlider.evaluate((el: IdsSlider) => {
        el.value = 20;
        el.valueSecondary = 19;
      });
      let slider = await rangeSlider.evaluate((el: IdsSlider) => {
        const value = el.value;
        const valueSecondary = el.valueSecondary;
        return {
          value,
          valueSecondary
        };
      });
      await expect(slider.value).toBe(20);
      await expect(slider.valueSecondary).toBe(20);
      await rangeSlider.evaluate((el: IdsSlider) => { el.value = 21; });
      slider = await rangeSlider.evaluate((el: IdsSlider) => {
        const value = el.value;
        const valueSecondary = el.valueSecondary;
        return {
          value,
          valueSecondary
        };
      });
      await expect(slider.value).toBe(20);
      await expect(slider.valueSecondary).toBe(20);
    });

    test('sets min correctly', async () => {
      await idsSlider.evaluate((el: IdsSlider) => { el.min = '50'; });
      let min = await idsSlider.evaluate((el: IdsSlider) => el.min);
      await expect(min).toBe(50);
      await idsSlider.evaluate((el: IdsSlider) => { el.min = ''; });
      min = await idsSlider.evaluate((el: IdsSlider) => el.min);
      const DEFAULT_MIN = await idsSlider.evaluate((el: IdsSlider) => el.DEFAULT_MIN);
      await expect(min).toBe(DEFAULT_MIN);
      await idsSlider.evaluate((el: IdsSlider) => { el.min = 'undefined'; });
      min = await idsSlider.evaluate((el: IdsSlider) => el.min);
      await expect(min).toBe(DEFAULT_MIN);
      await idsSlider.evaluate((el: IdsSlider) => { el.min = el.max + 1; });
      min = await idsSlider.evaluate((el: IdsSlider) => el.min);
      await expect(min).toBe(DEFAULT_MIN);
    });

    test('sets max correctly', async () => {
      await idsSlider.evaluate((el: IdsSlider) => { el.max = '150'; });
      let max = await idsSlider.evaluate((el: IdsSlider) => el.max);
      await expect(max).toBe(150);
      await idsSlider.evaluate((el: IdsSlider) => { el.max = ''; });
      max = await idsSlider.evaluate((el: IdsSlider) => el.max);
      const DEFAULT_MAX = await idsSlider.evaluate((el: IdsSlider) => el.DEFAULT_MAX + el.min);
      await expect(max).toBe(DEFAULT_MAX);
      await idsSlider.evaluate((el: IdsSlider) => { el.max = null; });
      max = await idsSlider.evaluate((el: IdsSlider) => el.max);
      await expect(max).toBe(DEFAULT_MAX);
      await idsSlider.evaluate((el: IdsSlider) => { el.max = undefined; });
      max = await idsSlider.evaluate((el: IdsSlider) => el.max);
      await expect(max).toBe(DEFAULT_MAX);
      await idsSlider.evaluate((el: IdsSlider) => { el.max = el.min - 1; });
      max = await idsSlider.evaluate((el: IdsSlider) => el.max);
      await expect(max).toBe(DEFAULT_MAX);
    });

    test('sets type correctly', async () => {
      await idsSlider.evaluate((el: IdsSlider) => { el.type = 'step'; });
      let type = await idsSlider.evaluate((el: IdsSlider) => el.type);
      await expect(type).toBe('step');
      await idsSlider.evaluate((el: IdsSlider) => { el.type = 'range'; });
      type = await idsSlider.evaluate((el: IdsSlider) => el.type);
      await expect(type).toBe('range');
      await idsSlider.evaluate((el: IdsSlider) => { el.type = '' as any; });
      type = await idsSlider.evaluate((el: IdsSlider) => el.type);
      const DEFAULT_TYPE = await idsSlider.evaluate((el: IdsSlider) => el.DEFAULT_TYPE);
      await expect(type).toBe(DEFAULT_TYPE);
      await idsSlider.evaluate((el: IdsSlider) => { el.type = 'asdf' as any; });
      type = await idsSlider.evaluate((el: IdsSlider) => el.type);
      await expect(type).toBe(DEFAULT_TYPE);
      await idsSlider.evaluate((el: IdsSlider) => { el.type = false as any; });
      type = await idsSlider.evaluate((el: IdsSlider) => el.type);
      await expect(type).toBe(DEFAULT_TYPE);
    });

    test('sets vertical correctly', async ({ page }) => {
      let vertical = await verticalRangeSlider.evaluate((el: IdsSlider) => el.vertical);
      await expect(vertical).toBeTruthy();
      await expect(verticalRangeSlider).toHaveAttribute('vertical', 'true');

      await verticalRangeSlider.evaluate((el: IdsSlider) => { el.vertical = true; });
      vertical = await verticalRangeSlider.evaluate((el: IdsSlider) => el.vertical);
      await expect(vertical).toBe(true);
      await verticalRangeSlider.evaluate((el: IdsSlider) => { el.vertical = false; });
      verticalRangeSlider = await page.locator('ids-slider[type="range"][color="green"]').first();
      await expect(verticalRangeSlider).not.toHaveAttribute('vertical');
      await verticalRangeSlider.evaluate((el: IdsSlider) => { el.value = el.max + 20; });
      const max = await verticalRangeSlider.evaluate((el: IdsSlider) => el.max);
      let value = await verticalRangeSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(max);
      await verticalRangeSlider.evaluate((el: IdsSlider) => { el.value = el.min - 20; });
      const min = await verticalRangeSlider.evaluate((el: IdsSlider) => el.min);
      value = await verticalRangeSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(min);
      await verticalRangeSlider.evaluate((el: IdsSlider) => { el.thumbDraggable?.focus(); });
      let tooltipMIN = await verticalRangeSlider.getByLabel('Colorful multi-thumb minimum').locator('.tooltip');
      expect(await page.evaluate(() => (document as any).activeElement?.name)).toBe('ids-slider');
      await expect(tooltipMIN).toHaveAttribute('style', 'opacity: 1;');
      await verticalRangeSlider.evaluate((el: IdsSlider) => { el.thumbDraggable?.blur(); });
      tooltipMIN = await verticalRangeSlider.getByLabel('Colorful multi-thumb minimum').locator('.tooltip');
      expect(await page.evaluate(() => (document as any).activeElement?.nodeName)).toBe('BODY');
      await expect(tooltipMIN).toHaveAttribute('style', 'opacity: 0;');
      await verticalRangeSlider.evaluate((el: IdsSlider) => { el.thumbDraggableSecondary?.focus(); });
      let tooltipMAX = await verticalRangeSlider.getByLabel('Colorful multi-thumb maximum').locator('.tooltip');
      expect(await page.evaluate(() => (document as any).activeElement?.name)).toBe('ids-slider');
      await expect(tooltipMAX).toHaveAttribute('style', 'opacity: 1;');
      await verticalRangeSlider.evaluate((el: IdsSlider) => { el.thumbDraggableSecondary?.blur(); });
      tooltipMAX = await verticalRangeSlider.getByLabel('Colorful multi-thumb maximum').locator('.tooltip');
      expect(await page.evaluate(() => (document as any).activeElement?.nodeName)).toBe('BODY');
      await expect(tooltipMAX).toHaveAttribute('style', 'opacity: 0;');
      await verticalRangeSlider.evaluate((el: IdsSlider) => { el.color = 'pink'; });
      verticalRangeSlider = await page.locator('ids-slider[type="range"][label="Colorful multi-thumb minimum"]').first();
      const color = await verticalRangeSlider.evaluate((el: IdsSlider) => el.color);
      await expect(color).toBe('pink');
    });

    test('sets rtl correctly, click outside of slider', async ({ page }) => {
      await page.evaluate(() => {
        (document.body as any).querySelector('ids-container').setAttribute('language', 'ar');
      });
      await idsSlider.evaluate((el: IdsSlider) => { el.value = el.min + 1; el.isRTL = true; });
      let isRTL = await idsSlider.evaluate((el: IdsSlider) => el.isRTL);
      await expect(isRTL).toBeTruthy();
      await idsSlider.evaluate((el: IdsSlider) => { el.isRTL = false; });
      isRTL = await idsSlider.evaluate((el: IdsSlider) => el.isRTL);
      await expect(isRTL).toBeFalsy();
      const tooltip = await idsSlider.getByLabel('Single-thumb').locator('.tooltip');
      await expect(tooltip).toHaveAttribute('style', 'opacity: 1;');
      await page.evaluate('document.querySelector("ids-container").click()');
      expect(await page.evaluate(() => (document as any).activeElement?.nodeName)).toBe('BODY');
    });

    test('drags correctly on range slider', async ({ page }) => {
      await page.evaluate(() => {
        const mockBounds = {
          LEFT: 0,
          RIGHT: 100,
          TOP: 0,
          BOTTOM: 24
        };
        const el = document.querySelector('ids-slider') as any;
        el.trackBounds = mockBounds;
      });
      let sliderEl = await rangeSlider.evaluate((el: IdsSlider) => {
        const value = el.value;
        const valueSecondary = el.valueSecondary;
        return {
          value,
          valueSecondary,
        };
      });
      await expect(sliderEl.value).toBe(0);
      await expect(sliderEl.valueSecondary).toBe(100);

      await rangeSlider.evaluate((el: IdsSlider) => {
        el.click();
        el.trackArea?.click();
        const label = el?.container?.querySelector('.label') as any;
        label.click();
      });

      await page.evaluate(() => {
        const slider = document.querySelector<IdsSlider>('ids-slider[type="range"]');
        const createEvent = (type: any, attributes = {}) => {
          const event = new Event(type);
          Object.assign(event, attributes);
          return event;
        };
        slider?.thumbDraggableSecondary?.dispatchEvent(
          createEvent('dragstart', { detail: { mouseX: 80, mouseY: 12 } })
        );
        slider?.thumbDraggableSecondary?.dispatchEvent(
          createEvent('drag', { detail: { mouseX: 80, mouseY: 12 } })
        );

        slider?.thumbDraggableSecondary?.dispatchEvent(
          createEvent('dragend', { detail: { mouseX: 80, mouseY: 12 } })
        );
      });
      sliderEl = await rangeSlider.evaluate((el: IdsSlider) => {
        const value = el.shadowRoot?.querySelector('ids-draggable.thumb-draggable')?.ariaValueNow;
        const valueSecondary = el.shadowRoot?.querySelector('ids-draggable.thumb-draggable.secondary')?.ariaValueNow;
        return {
          value,
          valueSecondary,
        };
      });
      await expect(sliderEl.value).toBe('0');
      await expect(sliderEl.valueSecondary).toBe('0');
    });

    test('clicks correctly on vertical step slider', async ({ page }) => {
      await page.evaluate(() => {
        (window as any).createKeyboardEvent = (keyName: any) => {
          const event = new KeyboardEvent('keydown', { key: keyName });
          return event;
        };
      });
      await page.evaluate(() => {
        const mockBounds = {
          LEFT: 0,
          RIGHT: 100,
          TOP: 0,
          BOTTOM: 24
        };
        const el = document.querySelector('ids-slider[type="step"][vertical="true"]') as any;
        el.trackBounds = mockBounds;
      });

      await verticalStepSlider.evaluate((el: IdsSlider) => {
        el.trackArea?.click();
        const label = el?.container?.querySelector('.label') as any;
        label.click();
        el.thumbDraggable?.focus();
      });
      let value = await verticalStepSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(100); // added assertion
      expect(await page.evaluate(() => (document as any).activeElement?.name)).toBe('ids-slider');
      await page.keyboard.press('ArrowUp');
      value = await verticalStepSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(100); // added assertion
      await page.keyboard.press('ArrowLeft');
      value = await verticalStepSlider.evaluate(async (el: IdsSlider) => el.value);
      await expect(value).toBe(80); // added assertion
      await page.keyboard.press('ArrowDown');
      value = await verticalStepSlider.evaluate(async (el: IdsSlider) => el.value);
      await expect(value).toBe(60); // added assertion
    });

    test('clicks and drags and navigates keyboard arrows on vertical range slider correctly', async ({ page }) => {
      await page.evaluate(() => {
        (window as any).createKeyboardEvent = (keyName: any) => {
          const event = new KeyboardEvent('keydown', { key: keyName });
          return event;
        };
      });
      const mockBounds = {
        LEFT: 0,
        RIGHT: 24,
        TOP: 0,
        BOTTOM: 200
      };
      const trackBounds = await page.evaluate((mockbounds) => {
        const el = document.querySelector('ids-slider[type="range"][vertical="true"]') as any;
        el.trackBounds = mockbounds;
        return el.trackBounds;
      }, mockBounds);
      await expect(trackBounds).toMatchObject(mockBounds);
      await verticalRangeSlider.evaluate((el: IdsSlider) => el.thumbDraggable?.focus());
      expect(await page.evaluate(() => (document as any).activeElement?.name)).toBe('ids-slider');
      await page.keyboard.press('ArrowLeft');
      let value = await verticalRangeSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(0);
      await page.keyboard.press('ArrowRight');
      value = await verticalRangeSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(1);

      await verticalRangeSlider.evaluate((el: IdsSlider) => { el.isRTL = false; });
      await verticalRangeSlider.evaluate((el: IdsSlider) => el.thumbDraggableSecondary?.focus());
      let valueSecondary = await verticalRangeSlider.evaluate((el: IdsSlider) => el.valueSecondary);
      await expect(valueSecondary).toBe(100);
      await page.keyboard.press('ArrowLeft');
      valueSecondary = await verticalRangeSlider.evaluate((el: IdsSlider) => el.valueSecondary);
      await expect(valueSecondary).toBe(99);
      await page.keyboard.press('ArrowDown');
      valueSecondary = await verticalRangeSlider.evaluate((el: IdsSlider) => el.valueSecondary);
      await expect(valueSecondary).toBe(98);
      await page.keyboard.press('ArrowRight');
      valueSecondary = await verticalRangeSlider.evaluate((el: IdsSlider) => el.valueSecondary);
      await expect(valueSecondary).toBe(99);
      await page.keyboard.press('ArrowUp');
      valueSecondary = await verticalRangeSlider.evaluate((el: IdsSlider) => el.valueSecondary);
      await expect(valueSecondary).toBe(100);

      await verticalRangeSlider.evaluate((el: IdsSlider) => { el.isRTL = true; el.trackArea?.click(); });
      await page.keyboard.press('ArrowLeft');
      valueSecondary = await verticalRangeSlider.evaluate((el: IdsSlider) => el.valueSecondary);
      await expect(valueSecondary).toBe(100);
      await page.keyboard.press('ArrowRight');
      valueSecondary = await verticalRangeSlider.evaluate((el: IdsSlider) => el.valueSecondary);
      await expect(valueSecondary).toBe(99);
      await page.keyboard.press('Enter');
      valueSecondary = await verticalRangeSlider.evaluate((el: IdsSlider) => el.valueSecondary);
      await expect(valueSecondary).toBe(99);
      await expect(async () => {
        const min = await verticalRangeSlider.locator('.thumb-draggable').first();
        const minElementBox = await min.boundingBox() as any;
        await page.mouse.move(
          minElementBox.x + minElementBox.width / 2,
          minElementBox.y + minElementBox.height / 2
        );
        await page.mouse.down();
        await page.mouse.move(0, 342);
        await page.mouse.up();
        const max = await verticalRangeSlider.locator('.thumb-draggable.secondary').first();
        const maxElementBox = await max.boundingBox() as any;
        await page.mouse.move(
          maxElementBox.x + maxElementBox.width / 2,
          maxElementBox.y + maxElementBox.height / 2
        );
        await page.mouse.down();
        await page.mouse.move(0, 297);
        await page.mouse.up();
        const sliderEl = await verticalRangeSlider.evaluate((el: IdsSlider) => {
          value = el.shadowRoot?.querySelector('ids-draggable.thumb-draggable')?.ariaValueNow ?? 0;
          valueSecondary = el.shadowRoot?.querySelector('ids-draggable.thumb-draggable.secondary')?.ariaValueNow ?? 0;
          return {
            value,
            valueSecondary,
          };
        });
        await expect(sliderEl.value as number).toBeInAllowedBounds(59, 2);
        await expect(sliderEl.valueSecondary as number).toBeCloseTo(50, 5);
        await expect(sliderEl.valueSecondary as number).toBe(50);
      }).toPass();
    });

    test('cannot change slider thumb values when disabled', async ({ page }) => {
      await page.evaluate(() => {
        (window as any).createKeyboardEvent = (keyName: any) => {
          const event = new KeyboardEvent('keydown', { key: keyName });
          return event;
        };
      });
      let value = await idsSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(0);
      await idsSlider.evaluate((el: IdsSlider) => { el.disabled = true; el.value = 10; });
      value = await idsSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(0);
      await page.keyboard.press('ArrowRight');
      value = await idsSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(0);
      await idsSlider.evaluate((el: IdsSlider) => { el.disabled = false; el.value = 70; });
      value = await idsSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(70);
    });

    test('cannot change slider thumb values when made readonly', async ({ page }) => {
      await page.evaluate(() => {
        (window as any).createKeyboardEvent = (keyName: any) => {
          const event = new KeyboardEvent('keydown', { key: keyName });
          return event;
        };
      });
      let value = await idsSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(0);
      await idsSlider.evaluate((el: IdsSlider) => { el.readonly = true; el.value = 10; });
      value = await idsSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(0);
      await page.keyboard.press('ArrowRight');
      value = await idsSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(0);
      await idsSlider.evaluate((el: IdsSlider) => { el.readonly = false; el.value = 70; });
      value = await idsSlider.evaluate((el: IdsSlider) => el.value);
      await expect(value).toBe(70);
    });

    test('has correct aria attributes on slider thumbs', async () => {
      let thumbDraggable = await verticalRangeSlider.locator('.thumb-draggable').first();
      let thumbDraggableSecondary = await verticalRangeSlider.locator('.thumb-draggable.secondary').first();
      await expect(thumbDraggable).toHaveAttribute('aria-label', 'Colorful multi-thumb minimum');
      await expect(thumbDraggableSecondary).toHaveAttribute('aria-label', 'Colorful multi-thumb maximum');
      await verticalRangeSlider.evaluate((el: IdsSlider) => {
        el.label = 'Lower Value';
        el.labelSecondary = 'Upper Value';
      });
      thumbDraggable = await verticalRangeSlider.locator('.thumb-draggable').first();
      thumbDraggableSecondary = await verticalRangeSlider.locator('.thumb-draggable.secondary').first();
      await expect(thumbDraggable).toHaveAttribute('aria-label', 'Lower Value');
      await expect(thumbDraggableSecondary).toHaveAttribute('aria-label', 'Upper Value');
    });
  });
});

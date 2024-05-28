import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsProcessIndicator from '../../src/components/ids-process-indicator/ids-process-indicator';

test.describe('IdsProcessIndicator tests', () => {
  const url = '/ids-process-indicator/example.html';
  let procIndicator: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    procIndicator = await page.locator('ids-process-indicator').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Process Indicator Component');
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
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-process-indicator');
      const html = await handle?.evaluate((el: IdsProcessIndicator) => el?.outerHTML);
      await expect(html).toMatchSnapshot('process-indicator-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-process-indicator');
      const html = await handle?.evaluate((el: IdsProcessIndicator) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('process-indicator-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-process-indicator-light');
    });
  });

  test.describe('functionality tests', () => {
    const HTMLSnippets = {
      VANILLA_PROCESS_INDICATOR: (
        `<ids-process-indicator>
      <ids-process-indicator-step status="done" label="Prepare"></ids-process-indicator-step>
      <ids-process-indicator-step status="started" label="Delivered"></ids-process-indicator-step>
      </ids-process-indicator>`
      ),
      STARTED_PROCESS_INDICATOR: (
        `<ids-process-indicator>
       <ids-process-indicator-step status="done" label="Prepare"></ids-process-indicator-step>
       <ids-process-indicator-step label="3rd Level - Multiple Approvers" status="started"></ids-process-indicator-step>
       </ids-process-indicator>`),
      CANCELLED_PROCESS_INDICATOR: (
        `<ids-process-indicator>
      <ids-process-indicator-step status="done" label="Prepare"></ids-process-indicator-step>
      <ids-process-indicator-step status="cancelled" label="Advertisement"></ids-process-indicator-step>
      <ids-process-indicator-step status="started" label="Delivered"></ids-process-indicator-step>
      </ids-process-indicator>`
      ),
      EMPTY_ATTRIBUTES_PROCESS_INDICATOR: (
        `<ids-process-indicator>
      <ids-process-indicator-step status="" label=""></ids-process-indicator-step>
      <ids-process-indicator-step status="" label=""></ids-process-indicator-step>
      <ids-process-indicator-step></ids-process-indicator-step>
      </ids-process-indicator>`
      ),
      NO_STEPS_PROCESS_INDICATOR: (
        `<ids-process-indicator>
        </ids-process-indicator>`
      ),
    };

    test('can show hide details on resize', async ({ page }) => {
      await page.setViewportSize({
        width: 375,
        height: 1080
      });
      await page.waitForLoadState();

      const slot = await page.locator('ids-process-indicator-step [slot="detail"]').first();
      await slot.waitFor({ state: 'hidden' });

      const size = await page.evaluate('document.querySelector("ids-process-indicator-step [slot=\'detail\']").style.width') as string;
      await expect(Number(size.replace('px', ''))).toBe(0);
    });

    test('sets labels correctly', async ({ page }) => {
      const createElemViaTemplate = async (html: any) => page.evaluate(async (innerHTML: any) => {
        let processIndicator: any;

        processIndicator?.remove?.();
        document.body.innerHTML = '';
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        processIndicator = template.content.childNodes[0];

        document.body.appendChild(processIndicator);

        return processIndicator;
      }, html);
      let labels = await page.evaluate(() => {
        const label: any[] = [];
        const steps = document.querySelectorAll('ids-process-indicator-step');
        steps.forEach((s: any) => {
          label.push(s.label);
        });
        return label;
      });
      await expect(labels[0]).toEqual('Process Started');
      await expect(labels[1]).toEqual('1st Level');
      await expect(labels[2]).toEqual('2nd Level');
      await expect(labels[3]).toEqual('3rd Level - Multiple Approvers');
      await expect(labels[4]).toEqual('4th Level');
      await expect(labels[5]).toEqual('5th Level');
      await expect(labels[6]).toEqual('Final Level');
      await createElemViaTemplate(HTMLSnippets.VANILLA_PROCESS_INDICATOR);
      labels = await page.evaluate(() => {
        const label: any[] = [];
        const steps = document.querySelectorAll('ids-process-indicator-step');
        steps.forEach((s: any) => {
          label.push(s.label);
        });
        return label;
      });
      await expect(labels[0]).toEqual('Prepare');
      await expect(labels[1]).toEqual('Delivered');
    });

    test('sets cancelled status correctly', async ({ page }) => {
      const createElemViaTemplate = async (html: any) => page.evaluate(async (innerHTML: any) => {
        let processIndicator: any;

        processIndicator?.remove?.();
        document.body.innerHTML = '';
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        processIndicator = template.content.childNodes[0];

        document.body.appendChild(processIndicator);

        return processIndicator;
      }, html);
      let status = await page.evaluate(() => {
        const stat: any[] = [];
        const steps = document.querySelectorAll('ids-process-indicator-step');
        steps.forEach((s: any) => {
          stat.push(s.status);
        });
        return stat;
      });
      await expect(status[0]).toEqual('done');
      await expect(status[1]).toEqual('done');
      await expect(status[2]).toEqual('done');
      await expect(status[3]).toEqual('started');
      await expect(status[4]).toEqual('cancelled');
      await expect(status[5]).toEqual('');
      await expect(status[6]).toEqual('');
      await createElemViaTemplate(HTMLSnippets.CANCELLED_PROCESS_INDICATOR);
      status = await page.evaluate(() => {
        const stat: any[] = [];
        const steps = document.querySelectorAll('ids-process-indicator-step');
        steps.forEach((s: any) => {
          stat.push(s.status);
        });
        return stat;
      });
      await expect(status[0]).toEqual('done');
      await expect(status[1]).toEqual('cancelled');
      await expect(status[2]).toEqual('started');
    });

    test('sets empty attributes correctly', async ({ page }) => {
      const createElemViaTemplate = async (html: any) => page.evaluate(async (innerHTML: any) => {
        let processIndicator: any;

        processIndicator?.remove?.();
        document.body.innerHTML = '';
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        processIndicator = template.content.childNodes[0];

        document.body.appendChild(processIndicator);

        return processIndicator;
      }, html);
      let status = await page.evaluate(() => {
        const stat: any[] = [];
        const steps = document.querySelectorAll('ids-process-indicator-step');
        steps.forEach((s: any) => {
          stat.push(s.status);
        });
        return stat;
      });
      let labels = await page.evaluate(() => {
        const label: any[] = [];
        const steps = document.querySelectorAll('ids-process-indicator-step');
        steps.forEach((s: any) => {
          label.push(s.label);
        });
        return label;
      });

      await expect(status[0]).toEqual('done');
      await expect(status[1]).toEqual('done');
      await expect(status[2]).toEqual('done');
      await expect(status[3]).toEqual('started');
      await expect(status[4]).toEqual('cancelled');
      await expect(status[5]).toEqual('');
      await expect(status[6]).toEqual('');
      await expect(labels[0]).toEqual('Process Started');
      await expect(labels[1]).toEqual('1st Level');
      await expect(labels[2]).toEqual('2nd Level');
      await expect(labels[3]).toEqual('3rd Level - Multiple Approvers');
      await expect(labels[4]).toEqual('4th Level');
      await expect(labels[5]).toEqual('5th Level');
      await expect(labels[6]).toEqual('Final Level');
      await createElemViaTemplate(HTMLSnippets.EMPTY_ATTRIBUTES_PROCESS_INDICATOR);
      status = await page.evaluate(() => {
        const stat: any[] = [];
        const steps = document.querySelectorAll('ids-process-indicator-step');
        steps.forEach((s: any) => {
          stat.push(s.status);
        });
        return stat;
      });
      labels = await page.evaluate(() => {
        const label: any[] = [];
        const steps = document.querySelectorAll('ids-process-indicator-step');
        steps.forEach((s: any) => {
          label.push(s.label);
        });
        return label;
      });
      await expect(status[0]).toEqual('');
      await expect(status[1]).toEqual('');
      await expect(labels[0]).toEqual('empty label');
      await expect(labels[1]).toEqual('empty label');
      await expect(labels[2]).toEqual('empty label');
    });

    test('handles icon changes/removal correctly', async ({ page }) => {
      const createElemViaTemplate = async (html: any) => page.evaluate(async (innerHTML: any) => {
        let processIndicator: any;

        processIndicator?.remove?.();
        document.body.innerHTML = '';
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        processIndicator = template.content.childNodes[0];

        document.body.appendChild(processIndicator);

        return processIndicator;
      }, html);
      await createElemViaTemplate(HTMLSnippets.CANCELLED_PROCESS_INDICATOR);
      let icon = await procIndicator.evaluate(() => {
        const step: any = document.querySelector('ids-process-indicator-step[status="cancelled"]');
        const ic0n = step.container.querySelector('ids-icon');
        return ic0n;
      });
      await expect(icon).toBeDefined();
      icon = await procIndicator.evaluate(() => {
        const step: any = document.querySelector('ids-process-indicator-step[status="cancelled"]');
        step.status = 'done';
        const ic0n = step.container.querySelector('ids-icon');
        return ic0n;
      });
      await expect(icon).toBeNull();
    });

    test('handles no steps correctly', async ({ page }) => {
      const createElemViaTemplate = async (html: any) => page.evaluate(async (innerHTML: any) => {
        let processIndicator: any;

        processIndicator?.remove?.();
        document.body.innerHTML = '';
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        processIndicator = template.content.childNodes[0];

        document.body.appendChild(processIndicator);

        return processIndicator;
      }, html);
      await createElemViaTemplate(HTMLSnippets.NO_STEPS_PROCESS_INDICATOR);
      const indicator = await procIndicator.evaluate((el: IdsProcessIndicator) => el?.shadowRoot?.innerHTML);
      await expect(indicator).toMatchSnapshot();
    });

    test('sets the xl-label corrrectly', async ({ page }) => {
      const createElemViaTemplate = async (html: any) => page.evaluate(async (innerHTML: any) => {
        let processIndicator: any;

        processIndicator?.remove?.();
        document.body.innerHTML = '';
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        processIndicator = template.content.childNodes[0];

        document.body.appendChild(processIndicator);

        return processIndicator;
      }, html);
      await createElemViaTemplate(HTMLSnippets.STARTED_PROCESS_INDICATOR);
      const indicator = await procIndicator.evaluate((el: IdsProcessIndicator) => el?.container?.querySelector('.xs-header .label')?.innerHTML);
      await expect(indicator).toEqual('None');
    });
  });
});

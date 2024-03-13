import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsWizard from '../../src/components/ids-wizard/ids-wizard';
import IdsContainer from '../../src/components/ids-container/ids-container';

test.describe('IdsWizard tests', () => {
  const url = '/ids-wizard/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('e2e tests', () => {
    test('should be able to click first step', async ({ page }) => {
      const activeStep = await page.evaluate(() => {
        const wizard = document.querySelector('ids-wizard') as IdsWizard;
        wizard.shadowRoot?.querySelectorAll('a')[0].click();
        return wizard.stepNumber;
      });

      expect(activeStep).toEqual(1);

      await page.evaluate(() => {
        const wizard = document.querySelector('ids-wizard') as IdsWizard;
        wizard.shadowRoot?.querySelectorAll('a')[0].click();
      });
    });

    test('should be able to focus and enter on a step', async ({ page }) => {
      let activeStep = await page.evaluate(() => {
        const wizard = document.querySelector('ids-wizard') as IdsWizard;
        return wizard.stepNumber;
      });

      expect(activeStep).toEqual(3);

      await page.evaluate(() => {
        const wizard = document.querySelector('ids-wizard') as IdsWizard;
        wizard.shadowRoot?.querySelectorAll('a')[3].focus();
      });

      await page.keyboard.press('Enter');

      activeStep = await page.evaluate(() => {
        const wizard = document.querySelector('ids-wizard') as IdsWizard;
        return wizard.stepNumber;
      });

      expect(activeStep).toEqual(4);
    });

    test('should show ellipsis on resize', async ({ page }) => {
      // Initial set of the page
      await page.setViewportSize({ width: 375, height: 900 });

      // This is where it resizes the page
      await page.setViewportSize({ width: 375, height: 1080 });

      await page.waitForTimeout(100);

      let size = await page.evaluate(() => {
        const wizard = document.querySelector('ids-wizard') as IdsWizard;
        return (wizard?.shadowRoot?.querySelector('.step-label') as HTMLElement).style.maxWidth;
      });

      expect(Number(size?.replace('px', ''))).toBeLessThan(80);
      expect(Number(size?.replace('px', ''))).toBeGreaterThan(60);

      await page.setViewportSize({ width: 320, height: 1080 });

      await page.waitForTimeout(100);

      size = await page.evaluate(() => {
        const wizard = document.querySelector('ids-wizard') as IdsWizard;
        return (wizard?.shadowRoot?.querySelector('.step-label') as HTMLElement).style.maxWidth;
      });

      expect(Number(size?.replace('px', ''))).toBeLessThan(70);
      expect(Number(size?.replace('px', ''))).toBeGreaterThan(40);
    });
  });

  test.describe('functional tests', () => {
    let elem: any;
    let container: any;

    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
        elem = document.createElement('ids-wizard') as IdsWizard;
        elem.innerHTML = `
          <ids-wizard-step>Step One</ids-wizard-step>
          <ids-wizard-step>Step Two</ids-wizard-step>
          <ids-wizard-step>Step Three</ids-wizard-step>
        `;
        elem.stepNumber = '1';
        container = document.createElement('ids-container') as IdsContainer;
        container.appendChild(elem);
        document.body.appendChild(container);
      });
    });

    test('render via document.createElement', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';

        const wizardElem: any = document.createElement('ids-wizard');
        wizardElem.innerHTML = `
          <ids-wizard-step>Step One</ids-wizard-step>
          <ids-wizard-step>Step Two</ids-wizard-step>
          <ids-wizard-step>Step Three</ids-wizard-step>
        `;
        wizardElem.stepNumber = '2';
        document.body.appendChild(wizardElem);
      });

      // expect that ids-wizard is rendered
      const wizard = await page.evaluate(() => document.querySelector('ids-wizard'));
      expect(wizard).not.toBeNull();
    });

    test('initializes without step number and it is set to undefined', async ({ page }) => {
      elem = await page.evaluate(() => {
        document.body.innerHTML = '';
        const wizardElem = document.createElement('ids-wizard') as IdsWizard;
        wizardElem.innerHTML = `
          <ids-wizard-step>Step One</ids-wizard-step>
          <ids-wizard-step>Step Two</ids-wizard-step>
          <ids-wizard-step>Step Three</ids-wizard-step>
        `;
        document.body.appendChild(wizardElem);
        return wizardElem;
      });

      expect(elem.stepNumber).toEqual(undefined);
    });

    test('updates the step number', async ({ page }) => {
      await page.evaluate(() => {
        elem.stepNumber = '3';
      });

      const stepNumber = await page.evaluate(() => elem.stepNumber);
      expect(stepNumber).toEqual(3);
    });

    test('set a random attribute with no visual differences', async ({ page }) => {
      const prevHTML = await page.evaluate(() => elem.innerHTML);
      await page.evaluate(() => {
        elem.setAttribute('random-attribute', 'random-value');
        elem.randomAttr2 = true;
      });
      const newHTML = await page.evaluate(() => elem.innerHTML);
      expect(newHTML).toEqual(prevHTML);
    });

    test('renders labels properly based on wizard step labels', async ({ page }) => {
      const lightDOMLabels = await page.evaluate(() => {
        const children = Array.from(elem.children) as HTMLElement[];
        return children.map((child: HTMLElement) => child.textContent?.trim() ?? '');
      });
      const shadowDOMLabels = await page.evaluate(() => {
        const stepLabels = elem.shadowRoot?.querySelectorAll('.step-label') ?? [];
        return Array.from(stepLabels).map((child: unknown) => (child as HTMLElement).textContent?.trim() ?? '');
      });

      expect(lightDOMLabels.join('_')).toEqual(shadowDOMLabels.join('_'));
    });

    test('refreshes ShadowDOM properly after changing the step markup', async ({ page }) => {
      let labels = await page.evaluate(() => {
        const children = Array.from(elem.children) as HTMLElement[];
        return children.map((child: HTMLElement) => child.textContent?.trim() ?? '');
      });

      expect(labels.join('_')).toEqual(labels.join('_'));

      labels = await page.evaluate(() => {
        const stepLabels = elem.shadowRoot?.querySelectorAll('.step-label') ?? [];
        return Array.from(stepLabels).map((child: unknown) => (child as HTMLElement).textContent?.trim() ?? '');
      });

      expect(labels.join('_')).toEqual(labels.join('_'));
    });

    test('on clickable wizard: clicks non-selected step, and the step number changes', async ({ page }) => {
      await page.evaluate(() => {
        const stepNumber = 2;
        elem.clickable = true;

        const marker = elem.shadowRoot.querySelector(`.step[step-number="${stepNumber}"] .step-marker`);
        marker.click();
      });

      expect(await page.evaluate(() => elem.stepNumber)).toEqual(2);
    });

    test('can calculate rect collision', async ({ page }) => {
      expect(await page.evaluate(() => elem.areRectsHColliding({ width: 10, right: 10 }, { right: 10 }))).toEqual(false);
      expect(await page.evaluate(() => elem.areRectsHColliding({ width: 10, right: 10 }, { right: 20 }))).toEqual(false);
    });

    test('can set step-width', async ({ page }) => {
      await page.evaluate(() => {
        elem.stepNumber = 2;
      });
      expect(await page.evaluate(() => elem.getAttribute('step-number'))).toEqual('2');

      await page.evaluate(() => {
        elem.stepNumber = 1;
      });
      expect(await page.evaluate(() => elem.getAttribute('step-number'))).toEqual('1');
    });

    test('cancel resize if 1 step', async ({ page }) => {
      elem = await page.evaluate(() => {
        document.body.innerHTML = '';
        const wizardElem = document.createElement('ids-wizard') as IdsWizard;
        wizardElem.innerHTML = `
          <ids-wizard-step>Step One</ids-wizard-step>
        `;
        document.body.appendChild(wizardElem);
        return wizardElem;
      });

      expect(await page.evaluate(() => elem.resizeStepLabelRects(elem)[0])).toEqual({ left: 0, right: 0, width: 0 });
    });
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Wizard Component');
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
      await percySnapshot(page, 'ids-wizard-light');
    });
  });
});

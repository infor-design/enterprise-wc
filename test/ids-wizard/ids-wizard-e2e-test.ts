import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Wizard e2e Tests', () => {
  const url = 'http://localhost:4444/ids-wizard/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Wizard Component');
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-wizard step-number="3" id="test">
        <ids-wizard-step>Step One</ids-wizard-step>
        <ids-wizard-step>Step Two</ids-wizard-step>
        <ids-wizard-step>Step Three</ids-wizard-step>
        <ids-wizard-step>Step Four</ids-wizard-step>
      </ids-wizard>`);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });

  it('should be able to click first step', async () => {
    await page.evaluate('document.querySelector("ids-wizard").shadowRoot.querySelectorAll("a")[0].click()');
    const activeStep = await page.evaluate(`document.querySelector("ids-wizard").stepNumber`);
    expect(activeStep).toEqual(1);
    await page.evaluate('document.querySelector("ids-wizard").shadowRoot.querySelectorAll("a")[0].click()');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should be able to focus and enter on a step', async () => {
    let activeStep = await page.evaluate(`document.querySelector("ids-wizard").stepNumber`);
    expect(activeStep).toEqual(3);
    await page.evaluate('document.querySelector("ids-wizard").shadowRoot.querySelectorAll("a")[3].focus()');
    await page.keyboard.press('Enter');

    activeStep = await page.evaluate(`document.querySelector("ids-wizard").stepNumber`);
    expect(activeStep).toEqual(4);
  });

  it('should show ellipsis on resize', async () => {
    await page.setViewport({
      width: 375,
      height: 1080
    });
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    let size = await page.evaluate('document.querySelector("ids-wizard").shadowRoot.querySelector(".step-label").style.maxWidth');
    expect(Number(size.replace('px', ''))).toBeLessThan(80);
    expect(Number(size.replace('px', ''))).toBeGreaterThan(60);

    await page.setViewport({
      width: 200,
      height: 1080
    });
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    size = await page.evaluate('document.querySelector("ids-wizard").shadowRoot.querySelector(".step-label").style.maxWidth');
    expect(Number(size.replace('px', ''))).toBeLessThan(55);
    expect(Number(size.replace('px', ''))).toBeGreaterThan(44);
  });
});

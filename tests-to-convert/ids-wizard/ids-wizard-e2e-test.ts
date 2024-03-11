import countObjects from '../helpers/count-objects';

describe('Ids Wizard e2e Tests', () => {
  const url = 'http://localhost:4444/ids-wizard/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  test('should be able to click first step', async () => {
    await page.evaluate('document.querySelector("ids-wizard").shadowRoot.querySelectorAll("a")[0].click()');
    const activeStep = await page.evaluate(`document.querySelector("ids-wizard").stepNumber`);
    expect(activeStep).toEqual(1);
    await page.evaluate('document.querySelector("ids-wizard").shadowRoot.querySelectorAll("a")[0].click()');
  });

  it.skip('should be able to focus and enter on a step', async () => {
    let activeStep = await page.evaluate(`document.querySelector("ids-wizard").stepNumber`);
    expect(activeStep).toEqual(3);
    await page.evaluate('document.querySelector("ids-wizard").shadowRoot.querySelectorAll("a")[3].focus()');
    await page.keyboard.press('Enter');

    activeStep = await page.evaluate(`document.querySelector("ids-wizard").stepNumber`);
    expect(activeStep).toEqual(4);
  });

  it.skip('should show ellipsis on resize', async () => {
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
    expect(Number(size.replace('px', ''))).toBeGreaterThan(40);
  });
});

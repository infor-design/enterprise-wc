describe('Ids Masthead e2e Tests', () => {
  const url = 'http://localhost:4444/ids-masthead';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Masthead Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests();
  });

  it('should react to desktop, tablet and mobile breakpoints/viewports', async () => {
    const assignedElementSelectors = {
      start: () => document.querySelector('ids-masthead').shadowRoot.querySelector('#start slot').assignedElements(),
      center: () => document.querySelector('ids-masthead').shadowRoot.querySelector('#center slot').assignedElements(),
      end: () => document.querySelector('ids-masthead').shadowRoot.querySelector('#end slot').assignedElements(),
      more: () => document.querySelector('ids-masthead').shadowRoot.querySelector('#more slot').assignedElements(),
    };

    // desktop: window.matchMedia('(min-width: 769px)'),
    await page.setViewport({
      width: 1024,
      height: 768
    });
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    let startSlot = await page.evaluate(assignedElementSelectors.start);
    let centerSlot = await page.evaluate(assignedElementSelectors.center);
    let endSlot = await page.evaluate(assignedElementSelectors.end);
    let moreSlot = await page.evaluate(assignedElementSelectors.more);
    expect(startSlot).toHaveLength(1);
    expect(centerSlot).toHaveLength(1);
    expect(endSlot).toHaveLength(1);
    expect(moreSlot).toHaveLength(0);

    // tablet: window.matchMedia('(min-width: 426px) and (max-width: 768px)'),
    await page.setViewport({
      width: 640,
      height: 320
    });
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    startSlot = await page.evaluate(assignedElementSelectors.start);
    centerSlot = await page.evaluate(assignedElementSelectors.center);
    endSlot = await page.evaluate(assignedElementSelectors.end);
    moreSlot = await page.evaluate(assignedElementSelectors.more);
    expect(startSlot).toHaveLength(1);
    expect(centerSlot).toHaveLength(0);
    expect(endSlot).toHaveLength(0);
    expect(moreSlot).toHaveLength(2);

    // mobile: window.matchMedia('(max-width: 425px)'),
    await page.setViewport({
      width: 375,
      height: 320
    });
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    startSlot = await page.evaluate(assignedElementSelectors.start);
    centerSlot = await page.evaluate(assignedElementSelectors.center);
    endSlot = await page.evaluate(assignedElementSelectors.end);
    moreSlot = await page.evaluate(assignedElementSelectors.more);
    expect(startSlot).toHaveLength(0);
    expect(centerSlot).toHaveLength(0);
    expect(endSlot).toHaveLength(0);
    expect(moreSlot).toHaveLength(3);
  });
});

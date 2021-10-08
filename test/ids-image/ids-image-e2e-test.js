describe('Ids Image e2e Tests', () => {
  const url = 'http://localhost:4444/ids-image';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Image Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests();
  });

  it('should render placeholder on image error', async () => {
    const hasPlaceholder = await page.$eval('#e2e-fallback', (el) => el?.shadowRoot.querySelector('.placeholder'));

    expect(hasPlaceholder).toBeTruthy();
  });

  it('should render placeholder via attribute', async () => {
    const hasPlaceholder = await page.$eval('#e2e-placeholder', (el) => el?.shadowRoot.querySelector('.placeholder'));

    expect(hasPlaceholder).toBeTruthy();
  });
});

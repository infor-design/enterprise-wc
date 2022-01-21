import percySnapshot from '@percy/puppeteer';
import waitForPageLoad from '../helpers/wait-for-page-load';

describe('Ids Rating Percy Tests', () => {
  const url = 'http://localhost:4444/ids-header';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await waitForPageLoad(url, null, 30);
    await percySnapshot(page, 'ids-header-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await waitForPageLoad(url, 'dark', 30);
    await percySnapshot(page, 'ids-header-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await waitForPageLoad(url, 'contrast', 30);
    await percySnapshot(page, 'ids-header-new-contrast');
  });
});
